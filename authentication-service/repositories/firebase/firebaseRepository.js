const { initializeApp } = require('firebase/app');
const {
    getFirestore,
    collection,
    getDocs,
} = require('firebase/firestore')

const firebaseConfig = {
  apiKey: "AIzaSyBCNEqNjug8a_P0J30zH-vL1yjag2jDqqQ",
  authDomain: "belajar-345d4.firebaseapp.com",
  projectId: "belajar-345d4",
  storageBucket: "belajar-345d4.appspot.com",
  messagingSenderId: "900364024903",
  appId: "1:900364024903:web:2b2b8d250417b2552d8562"
};

const app = initializeApp(firebaseConfig);

const db = getFirestore(app);

module.exports = {
    db,
    getDocs,
    collection
};