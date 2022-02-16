import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";
import { getFirestore, doc, setDoc, updateDoc } from "firebase/firestore";
import { getAuth } from 'firebase/auth';
import { writable } from 'svelte/store';

//###############################################
// INITIALIZE AND SETUP FIREBASE FOR DATA STORAGE
//###############################################
// NOTE: This app uses the module version of the firebase JS library which uses
// different syntax since version 9.x.x

// Copy and paste your firebase config here:
const firebaseConfig = {
  apiKey: "AIzaSyD9udIO5ap006xab7tb2bZ6s5C7Kc4m7YM",
  authDomain: "max-thesis.firebaseapp.com",
  projectId: "max-thesis",
  storageBucket: "max-thesis.appspot.com",
  messagingSenderId: "658200948450",
  appId: "1:658200948450:web:15a5eff940daf56b3378bb"
};

initializeApp(firebaseConfig);

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

// Add any global variables you want to use elsewhere in the app
// Then use them in another file by importing:
// import { globalVars } from '../utils.js';
// console.log(globalVars.time)
export const globalVars = {
  time: 5,
};
//############################

//############################
// GLOBAL EXPERIMENT FUNCTIONS
//############################
// Add any functions here that you want to reuse throughout the app

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
}

// Function to update an existing user record in the database
export const updateUser = async (userDoc) => {
  try {
    const docRef = doc(db, 'participants', userDoc.userId);
    await setDoc(docRef, userDoc);

    console.log(`user doc successfully updated: ${docRef.id}`);
  } catch (error) {
    console.error(`Error updating user document: ${userDoc.userId}:`, error);
  }
};

// Function to update an existing group record in the database
// This should be called in App.svelte in response to any save events from pages or components 
export const saveData = async (groupId, data) => {
  try {
    const docRef = doc(db, 'groups', groupId);
    await updateDoc(docRef, data);
    console.log(`Successfully saved data for group: ${groupId}`);
  } catch (error) {
    console.error(`Error saving data for group: ${groupId}:`, error);
  }
};

// Format the values the user inputted so that we encode each id as 000, 001...NNN, so
// we can use them as unique document ideas up to 1000 subs.
export const formatUserId = (groupId, subId, role) => {
  let groupId_f, subId_f, userId_f, role_f;
  let g = parseInt(groupId)
  let s = parseInt(subId)
  if (g < 10) {
    groupId_f = `00${g}`
  } else if (g >= 10 && g < 100) {
    groupId_f = `0${g}`
  } else {
    groupId_f = groupId;
  }
  if (s < 10) {
    subId_f = `00${s}`
  } else if (s >= 10 && s < 100) {
    subId_f = `0${s}`
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
  }
}

// Create a test group with 2 trials for developing the app locally and adjusting the
// data structure. For the real experiment, this will be uploaded by a python script
// after part 1
export const createTestGroup = async () => {
  const data = {
    groupId: '000',
    D1: '000',
    D2: '001',
    R: '002',
    counter: [],
    currentState: 'instructions',
    currentTrial: 0,
    trial: [
      {
        cost: 1,
        endowment: 10,
        pain_dur: 7,
        D1D2: 0,
        D1R: 0,
        D1_actual: 1,
        D1_agency: 0.2,
        D1_post: [],
        D2D1: 0,
        D2R: 0,
        D2_actual: 6,
        D2_agency: 0.8,
        D2_post: [],
        RD1: 0,
        RD2: 0,
        R_post: [],
      },
      {
        cost: 1,
        endowment: 20,
        pain_dur: 9,
        D1D2: 0,
        D1R: 0,
        D1_actual: 1,
        D1_agency: 0.2,
        D1_post: [],
        D2D1: 0,
        D2R: 0,
        D2_actual: 6,
        D2_agency: 0.8,
        D2_post: [],
        RD1: 0,
        RD2: 0,
        R_post: [],
      }
    ],
  }
  try {
    const docRef = doc(db, 'groups', '000');
    await setDoc(docRef, data)
    console.log('test group doc successfully created')
  } catch (error) {
    console.error(`Error creating test group doc:`, error)
  }

}