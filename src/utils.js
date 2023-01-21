// @ts-nocheck
import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";
import { getFirestore, doc, setDoc, updateDoc, runTransaction, serverTimestamp } from "firebase/firestore";
import { getAuth } from 'firebase/auth';
import { writable, get } from 'svelte/store';

//###############################################
// INITIALIZE AND SETUP FIREBASE FOR DATA STORAGE
//###############################################
// NOTE: This app uses the module version of the firebase JS library which uses
// different syntax since version 9.x.x

// Copy and paste your firebase config here:
const firebaseConfig = {
  apiKey: "AIzaSyCUQMcJo6brxVX2Jf7r0Hublw7SyLj2xBY",
  authDomain: "trust-game-844b3.firebaseapp.com",
  projectId: "trust-game-844b3",
  storageBucket: "trust-game-844b3.appspot.com",
  messagingSenderId: "841005706064",
  appId: "1:841005706064:web:3f33629cbe2594247e9a55"
};

// Initialize firebase
const app = initializeApp(firebaseConfig);

// Export database variables for use elsewhere in the app
// Exporting them from this file after initializing the database connection above
// makes it easy to read/write to the database from any file in the app
// Use them by importing in another file:
// import { db } from 'utils.js'
// db.collection(...)
export const db = getFirestore();
export const storage = getStorage();
export const auth = getAuth();
//###############################################

//############################
// GLOBAL EXPERIMENT VARIABLES
//############################
// Initialize an empty reactive global variable (Svelte store) for storing a single 
// user's data that will be accessible throughout the app
export const userStore = writable({});
// Another store for the group data
export const groupStore = writable({});
// Another store that keeps track of whether a user is logged in or not
export const loggedIn = writable(false);
// And one more so we can keep track of their user id to subscribe to their collection
export const userId = writable(null);
// Store to control the UI for what state the experiment is in
export const stateDisplay = writable([]);

// Add any global variables you want to use elsewhere in the app
// Then use them in another file by importing:
// import { globalVars } from '../utils.js';
// console.log(globalVars.time)
export const globalVars = {
  multiplier: 4,
  minPainDur: 5,
  maxPainDur: 15,
  maxEndowment: 5,
  maxPossiblePainReduction: 10,
  deliveryTimeBuffer: 3000, // additional time to wait for stimulation to finish
  costConversion: {
    0.5: '2',
    0.75: '1.5',
    1: '1'
  },
  receiverEndowmentPerTrial: 2 //  36 trials * $2/trial = $72 theoretical max
};


//############################

//############################
// GLOBAL EXPERIMENT FUNCTIONS
//############################

// Function to create a new user record in the database
export const initUser = async (groupId, subId, role, name) => {
  try {
    // We could have just tried to read the value of the $userId store here, but the $
    // syntax only works in .svelte files. There's a special get() function we have to
    // use instead, but because this is such simple case let's just make the userId like
    // we do in Login.svelte and avoid the overhead.
    const userId = `${groupId}_${subId}_${role}`;

    const docRef = doc(db, 'participants', userId);
    await setDoc(docRef, {
      userId: userId,
      groupId: groupId,
      subId: subId,
      name: name,
      role: role
    });

    console.log(`New user successfully created with document ID: ${docRef.id}`);
  } catch (error) {
    console.error(`Error creating new document with ID ${userId}: `, error);
  }
};

// Reset a group to the instructions and first trial
// Doesn't erase their data
export const resetGroupData = async () => {
  const groupData = get(groupStore);
  groupData.counter = [];
  groupData.currentState = 'instructions';
  groupData.currentTrial = 0;
  try {
    const docRef = doc(db, 'groups', groupData.groupId);
    await setDoc(docRef, groupData);
    console.log('Successfully reset group data');
  } catch (error) {
    console.error(`Error resetting group data:`, error);
  }

};

// Format the values the user inputted so that we encode each id as 000, 001...NNN, so
// we can use them as unique document ideas up to 1000 subs.
export const formatUserId = (groupId, subId, role) => {
  let groupId_f, subId_f, userId_f, role_f;
  let g = parseInt(groupId);
  let s = parseInt(subId);
  if (g < 10) {
    groupId_f = `00${g}`;
  } else if (g >= 10 && g < 100) {
    groupId_f = `0${g}`;
  } else {
    groupId_f = groupId;
  }
  if (s < 10) {
    subId_f = `00${s}`;
  } else if (s >= 10 && s < 100) {
    subId_f = `0${s}`;
  } else {
    subId_f = subId;
  }

  userId_f = `${groupId_f}_${subId_f}_${role}`;
  role_f = role;

  return {
    groupId_f,
    subId_f,
    role_f,
    userId_f
  };
};

// Rounds a float to 2 decimal places
export const round2 = (val) => {
  return Math.round(val * 100) / 100;
};

export const roundHalf = (val) => {
  return Math.round(val * 2) / 2;
};
// Calculates propSpent on choice made, executed reactively by EndowmentScale.svelte
export const calcPropSpent = (ratingString, endowment) => {
  const proportionOfEndowmentSpent = parseFloat(ratingString) / endowment;
  return {
    proportionOfEndowmentSpent
  };
};

//#####################################
// DATABASE TRANSACTION WRITE FUNCTIONS
//#####################################
// These are functions that make use of firestore's runTransaction() feature
// EXPLANATION:
// When multiple users try to update the *same* data simulataneously, e.g. when
// submitting their responses during a part of a trial, or indicating they're ready to
// advance the experiment state, we can run into conflicts when these updates occur
// simultaenously or close in time

// This is particularly bad, when some of the data we're trying to update depends on
// existing values in the database, e.g. the counter which keeps track of which and how
// many users are ready to advance to the next state

// In these situations, we don't want to rely on the value in the $groupStore, because
// it's updated by onSnapShot(), which will push changes *immediately* even if those
// values haven't been written to the db yet. That's because firestore first updates a
// user's *local* copy of the db, which triggers the onSnapShot() function and
// overwrites the groupStore. 

// Similar to the issue with directly updating the groupStore as described in
// App.svelte, a call to updateDoc will also update a user's groupStore before writing
// to the database because groupStore is overwritten everytime onSnapShot() runs. So
// whenever we want to make a write to the db that needs the *latest* data, we need to
// wrap that write in runTransaction(). Inside this function we first perform a get()
// for the latest data, then use those values before calling update(). runTransaction()
// is designed to pay attention to if the data changes any time between get() and
// update(), e.g. by another user. In this case, it'll re-run itself thus ensuring get()
// has the latest data before running update()

// Update the experiment state and write to firebase
// Checks to see if all participants are ready to transition from state A -> B each
// time the function runs. So only the *last* user to call this function actually
// initiates the state change
export const reqStateChange = async (newState, updateTrial = false) => {
  const { groupId } = get(groupStore);
  const { userId } = get(userStore);
  const docRef = doc(db, 'groups', groupId);
  try {
    await runTransaction(db, async (transaction) => {

      // Get the latest data, rather than relying on the store
      const document = await transaction.get(docRef);
      if (!document.exists()) {
        throw "Document does not exist!";
      }
      // Freshest data
      const { counter, currentState } = document.data();
      console.log(
        `Participant: ${userId} is requesting state change: ${currentState} -> ${newState}`
      );
      // Add the user to the counter if they're not already in it
      if (!counter.includes(userId)) {
        await transaction.update(docRef, { counter: [...counter, userId] });
      } else {
        console.log("Ignoring duplicate request");
      }
    });
  } catch (error) {
    console.error(`Error updating state to ${newState} for group: ${groupId}`, error);
  }
  // Use helper function to run a second transaction that checks the counter length and
  // actually performs the state change if appropriate
  await verifyStateChange(newState, updateTrial);
};

// Helper function called by reqStateChange that runs a follow-up transaction after the
// reqStateChange transaction so we rely on freshes counter value in the db rather than
// the value in any user's store which may be out-of-sync
// Also has the benefit that if all 3 users have requested a state change, but it failed
// for some reason, then any user can re-make that request without overwriting their
// data and it will run sucdessfully 
const verifyStateChange = async (newState, updateTrial = false) => {
  const { groupId } = get(groupStore);
  const docRef = doc(db, 'groups', groupId);
  try {
    await runTransaction(db, async (transaction) => {
      // Get the latest data, rather than relying on the store
      const document = await transaction.get(docRef);
      if (!document.exists()) {
        throw "Document does not exist!";
      }
      // Get latest counter
      const { counter, currentTrial, trials } = document.data();
      const maxTrials = trials.length;
      if (counter.length === 2) {
        console.log('Last request...initiating state change');
        const obj = {};
        obj["counter"] = [];
        obj["currentState"] = newState;
        if (updateTrial) {
          if (currentTrial + 1 === maxTrials) {
            console.log("At last trial...going to debrief");
            obj["currentState"] = 'debrief';
          } else {
            console.log(`Also getting next trial`);
            obj["currentTrial"] = currentTrial + 1;
          }
        }
        await transaction.update(docRef, obj);
      } else {
        console.log(`Still waiting for ${2 - counter.length} requests...`);
      }
    });
  } catch (error) {
    console.error(`Error verifying state change`, error);
  }
};

// Save each user's name in the group doc
export const saveName = async (name) => {
  const { groupId } = get(groupStore);
  const { role } = get(userStore);
  const docRef = doc(db, 'groups', groupId);
  try {
    await runTransaction(db, async (transaction) => {
      const document = await transaction.get(docRef);
      if (!document.exists()) {
        throw "Document does not exist!";
      }
      const updateData = {};
      if (role === 'investor') {
        updateData['I_name'] = name;
      } else if (role === 'trustee') {
        updateData['T_name'] = name;
      } else {
        throw `${role} is an unknown role`;
      }
      await transaction.update(docRef, updateData);
      console.log(`Successfully added ${name} to db`);
    });

  } catch (error) {
    console.error(`Error saving name for user: ${name}`, error);
  }

};

// Save trial data for Q questions handling concurrent writes
export const saveQData = async (questions) => {
  const { groupId, currentState } = get(groupStore);
  const { role } = get(userStore);
  const docRef = doc(db, 'groups', groupId);
  try {
    await runTransaction(db, async (transaction) => {
      // Get the latest data, rather than relying on the store
      const document = await transaction.get(docRef);
      if (!document.exists()) {
        throw "Document does not exist!";
      }
      // Get the latest trial and current trial
      const { trials, currentTrial } = document.data();
      const data = { "trials": trials };
      console.log("data", data)
      console.log("questions", questions)
      console.log("currentTrial", currentTrial)

      // TO E FROM W: I know this is spaghetti but it (seemingly) gets the job done
      if (currentState === "phase-01") {
        if (role === "investor") {
          data["trials"][currentTrial]["I_CHOICE"] = questions[0].rating;
        } else if (role === 'trustee') {
          data["trials"][currentTrial]["T_PREDICTION"] = questions[0].rating;
        } else {
          throw `${role} is an unknown role`;
        }
      } else if (currentState === "phase-02") {
        if (role === "investor") {
          data["trials"][currentTrial]["I_1ST_ORDER_EXPECTATION"] = questions[0].rating;
        } else if (role === 'trustee') {
          data["trials"][currentTrial]["T_2ND_ORDER_EXPECTATION"] = questions[0].rating;
        } else {
          throw `${role} is an unknown role`;
        }
      } else if (currentState === "phase-03") {
        if (role === 'trustee') {
          let endowment = data["trials"][currentTrial].endowment;
          let t_choice = questions[0].rating; // how much T chooses to give to I (of the invested amount * multiplier)
          let i_choice = data["trials"][currentTrial]["I_CHOICE"]; // how much of endowment I chose to invest in T from phase-01

          data["trials"][currentTrial]["T_CHOICE"] = t_choice; // how much T returned to I
          data["trials"][currentTrial]["T_EARNED"] = ((i_choice * globalVars.multiplier) - t_choice);
          data["trials"][currentTrial]["I_EARNED"] = (endowment - i_choice) + t_choice; // should be: (endowment - I_CHOICE) + T_CHOICE

        } else if (role === 'investor') {
          console.log("investor waiting for trustee")
        } else {
          throw `${role} is an unknown role`;
        }
      } else if (currentState === "phase-04") {
        if (role === 'trustee' || role === 'investor') {
          let self = role === "trustee" ? "T" : "I"
          let other = self === "T" ? "I" : "T"

          data["trials"][currentTrial][`${self}_GUILT`] = questions[0].rating;
          data["trials"][currentTrial][`${self}_ANGY`] = questions[1].rating;
          data["trials"][currentTrial][`${self}_PREDICT_${other}_GUILT`] = questions[2].rating;
          data["trials"][currentTrial][`${self}_PREDICT_${other}_ANGY`] = questions[3].rating;
          data["trials"][currentTrial][`${self}_CLOSE`] = questions[4].rating;
          data["trials"][currentTrial][`${self}_SATISFIED`] = questions[5].rating;
        } else {
          throw `${role} is an unknown role`;
        }
      }

      await transaction.update(docRef, data);
      console.log(`Successfully saved Q data for: ${role}`);
    });
  } catch (error) {
    console.error(`Error saving data for group: ${groupId}`, error);
  }
};

export const saveAPQData = async (questions) => {
  const { groupId } = get(groupStore);
  const { role } = get(userStore);
  const docRef = doc(db, 'groups', groupId);
  try {
    await runTransaction(db, async (transaction) => {
      const document = await transaction.get(docRef);
      if (!document.exists()) {
        throw "Document does not exist!";
      }
      // Get the latest trial and current trial
      const { trials, currentTrial } = document.data();
      const data = { "trials": trials };
      let prefix;
      let suffix;
      let key;
      if (role === "decider1") {
        prefix = "D1_";
      } else if (role === "decider2") {
        prefix = "D2_";
      } else if (role === 'receiver') {
        prefix = "R_";
      } else {
        throw `${role} is an unknown role`;
      }
      questions.forEach((q) => {
        if (q.type.includes("other")) {
          suffix = q.type.split("_")[1];
          key = prefix === "D1_" ? "D2_" : "D1_";
          key = `${prefix}${key}${suffix}`;
        } else {
          key = `${prefix}${q.type}`;
        }
        data["trials"][currentTrial][key] = q.rating;
      });
      await transaction.update(docRef, data);
      console.log(`Successfully saved APQ data for: ${role}`);
    });
  } catch (error) {
    console.error(`Error saving data for group: ${groupId}`, error);
  }

};

export const saveDebrief = async (data) => {
  const { groupId } = get(groupStore);
  const { role } = get(userStore);
  const docRef = doc(db, 'groups', groupId);
  try {
    await runTransaction(db, async (transaction) => {
      const document = await transaction.get(docRef);
      if (!document.exists()) {
        throw "Document does not exist!";
      }
      const updateData = { 'debrief': {} };
      if (role === 'decider1') {
        updateData['debrief']['D1'] = data;
      } else if (role === 'decider2') {
        updateData['debrief']['D2'] = data;
      } else if (role === 'receiver') {
        updateData['debrief']['R'] = data;
      } else {
        throw `${role} is an unknown role`;
      }
      await transaction.update(docRef, updateData);
      console.log("Successfully saved debrief data");
    });

  } catch (error) {
    console.error(`Error saving debrief data`, error);
  }

}





