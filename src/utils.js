import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";
import { getFirestore, serverTimestamp, doc, setDoc } from "firebase/firestore";
import { getAuth } from 'firebase/auth';
import { writable } from 'svelte/store';

//###############################################
// INITIALIZE AND SETUP FIREBASE FOR DATA STORAGE
//###############################################
// NOTE: This app uses the module version of the firebase JS library which uses
// different syntax since version 9.x.x

// Copy and paste your firebase config here:
const firebaseConfig = {
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
export const serverTime = serverTimestamp();
//###############################################

//############################
// GLOBAL EXPERIMENT VARIABLES
//############################
// Initialize an empty reactive global variable (Svelte store) for storing a single 
// user's data that will be accessible throughout the app
export const userStore = writable({});

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
// Arguments: userID (string)
// Returns: None
export const initUser = async (userId) => {
  try {
    const docRef = doc(db, 'participants', userId);
    // Add any additional fields here that you want
    await setDoc(docRef, {
      userId: userId,
      currentState: 'consent',
      currentTrial: 1,
      consent_start: serverTime,
    });

    console.log(`New user successfully created with document ID: ${docRef.id}`);
  } catch (error) {
    console.error(`Error creating new document with ID ${userId}: `, error);
  }
}

// Function to update an existing user record in the database
// Arguments: userStore (svelte store)
// Returns: None
export const updateUser = async (userDoc) => {
  try {
    const docRef = doc(db, 'participants', userDoc.userId);
    await setDoc(docRef, userDoc);

    console.log(`user doc successfully updated: ${docRef.id}`);
  } catch (error) {
    console.error(`Error updating user document: ${userDoc.userId}:`, error);
  }
};