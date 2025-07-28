import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.9.0/firebase-app.js'; // Example version
import { getAuth } from 'https://www.gstatic.com/firebasejs/10.9.0/firebase-auth.js';
import { getFirestore } from 'https://www.gstatic.com/firebasejs/10.9.0/firebase-firestore.js';

const firebaseConfig = {
  apiKey: "AIzaSyBnRKitQGBX0u8k4COtDTILYxCJuMf7xzE",
  authDomain: "authdramaarena.firebaseapp.com",     
  databaseURL: "https://authdramaarena.firebaseio.com",
  projectId: "authdramaarena",                      
  storageBucket: "authdramaarena.appspot.com",      
  messagingSenderId: "348583435302",             
  appId: "1:348583435302:web:someUniqueWebId",    
  measurementId: "G-DGF0CP099H"                  
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
