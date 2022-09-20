import { loadHeader } from "../js/utils.js";

// Loads header
loadHeader();


// Import the functions you need from the SDKs you need
import { initializeApp} from "https://www.gstatic.com/firebasejs/9.10.0/firebase-app.js";
import { getAuth, signInWithEmailAndPassword, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/9.10.0/firebase-auth.js";
import { doc, getDoc, getFirestore } from "https://www.gstatic.com/firebasejs/9.10.0/firebase-firestore.js";



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


submitData.addEventListener("click", (e) => {
    
    var email = document.getElementById("email").value;
    var password = document.getElementById("psw").value;
    
    signInWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
        // Signed in 
        const user = userCredential.user;
        console.log("user logged- sign in with email and password")
        document.getElementById("logout-btn").style.display = "block";
        console.log(user);
    })
    .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        alert(errorMessage);
        console.log("unsuccessful creation");
    });
});


const user = auth.currentUser;

onAuthStateChanged(auth, (user) => {
  if (user) {
    const uid = user.uid;
    console.log("logged in- on auth state change")
    document.getElementById("logout-btn").style.display = "block";
    document.getElementById("login-btn").style.display = "none";
    document.getElementById("register-btn").style.display = "none";


    const db = getFirestore(app);
    const logName = async () => {
      const nameRef = doc(db, "users", user.email);
      const nameDoc = await getDoc(nameRef);
      document.getElementById("displayName").style.display = "block";
      document.getElementById("displayName").innerHTML = nameDoc.data().name;
    }
    logName();

  } else {
    // User is signed out
    console.log("not logged in- on auth state change")
    document.getElementById("logout-btn").style.display = "none";
    document.getElementById("displayName").style.display = "none";

  }
});