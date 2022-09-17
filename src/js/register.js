import { loadHeader } from "../js/utils.js";

// Loads header
loadHeader();


// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.10.0/firebase-app.js";
import { doc, setDoc, getFirestore } from "https://www.gstatic.com/firebasejs/9.10.0/firebase-firestore.js";
import { getAuth, createUserWithEmailAndPassword, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/9.10.0/firebase-auth.js";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyB2NvowmMXThqn01P54Vm-0mSwuVIvbi1I",
  authDomain: "duedate-402bc.firebaseapp.com",
  projectId: "duedate-402bc",
  storageBucket: "duedate-402bc.appspot.com",
  messagingSenderId: "792845287352",
  appId: "1:792845287352:web:c3110ba0023c7d32a5594d"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth();
const db = getFirestore(app);
const user = auth.currentUser;

submitData.addEventListener("click", (e) => {
    
    var email = document.getElementById("email").value;
    var password = document.getElementById("psw").value;
    
    createUserWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
        // Signed in 
        const user = userCredential.user;
        console.log("created user!")

        // Hide login and register buttons
        document.getElementById("logout-btn").style.display = "block";
        document.getElementById("login-btn").style.display = "none";
        document.getElementById("register-btn").style.display = "none";

        const db = getFirestore(app);

        // Add user to database
        setDoc(doc(db, "users", user.email), {
            email: user.email
          });
    })
    .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        alert(errorMessage);
        console.log("unsuccessful creation");
    });
});

onAuthStateChanged(auth, (user) => {
  if (user) {
    const uid = user.uid;
    console.log("logged in- on auth state change")
    document.getElementById("logout-btn").style.display = "block";
    document.getElementById("login-btn").style.display = "none";
    document.getElementById("register-btn").style.display = "none";

  } else {
    // User is signed out
    console.log("not logged in- on auth state change")
    document.getElementById("logout-btn").style.display = "none";
  }
});
