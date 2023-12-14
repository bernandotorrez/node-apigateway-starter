const dotenv = require('dotenv');
const firebaseConfig = require('../firebase_admin.json');
const { initializeApp, cert } = require('firebase-admin/app');
const {
    getFirestore,
} = require('firebase-admin/firestore')

dotenv.config()

const app = initializeApp({
  credential: cert(firebaseConfig)
});

const db = getFirestore(app);

module.exports = {
    db
};