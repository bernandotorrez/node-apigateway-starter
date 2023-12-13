const dotenv = require('dotenv');
const { initializeApp } = require('firebase/app');
const {
    getFirestore,
    collection,
    getDocs,
} = require('firebase/firestore')

dotenv.config()

const { 
  FIREBASE_API_KEY,
  FIREBASE_AUTH_DOMAIN,
  FIREBASE_PROJECT_ID,
  FIREBASE_STORAGE_BUCKET,
  FIREBASE_SENDER_ID,
  FIREBASE_APP_ID
} = process.env;

const firebaseConfig = {
  apiKey: FIREBASE_API_KEY,
  authDomain: FIREBASE_AUTH_DOMAIN,
  projectId: FIREBASE_PROJECT_ID,
  storageBucket: FIREBASE_STORAGE_BUCKET,
  messagingSenderId: FIREBASE_SENDER_ID,
  appId: FIREBASE_APP_ID
};

const app = initializeApp(firebaseConfig);

const db = getFirestore(app);

module.exports = {
    db,
    getDocs,
    collection
};