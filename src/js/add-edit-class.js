import { loadHeader } from "./utils.js";

// Loads header
loadHeader();

// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.10.0/firebase-app.js";
import { getAuth, signInWithEmailAndPassword, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/9.10.0/firebase-auth.js";
import { doc, setDoc, getDoc, getFirestore, getDocs, updateDoc } from "https://www.gstatic.com/firebasejs/9.10.0/firebase-firestore.js";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyB2NvowmMXThqn01P54Vm-0mSwuVIvbi1I",
  authDomain: "duedate-402bc.firebaseapp.com",
  projectId: "duedate-402bc",
  storageBucket: "duedate-402bc.appspot.com",
  messagingSenderId: "792845287352",
  appId: "1:792845287352:web:c3110ba0023c7d32a5594d",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth();
const user = auth.currentUser;
const db = getFirestore(app);

// Populate dropdown

onAuthStateChanged(auth, (user) => {
  if (user) {
    console.log("logged in- on auth state change");
    document.getElementById("logout-btn").style.display = "block";
    document.getElementById("login-btn").style.display = "none";
    document.getElementById("register-btn").style.display = "none";

    //   Set class dropdown
    const setClasses = async () => {
      const classRef = doc(db, "classes", user.email);
      const classDoc = await getDoc(classRef);
      const classObject = classDoc.data();

      /*
          ADDS CLASS WHEN CREATE CLASS BUTTON IS CLICKED
        */

      document.getElementById("submitNewClass").addEventListener("click", (e) => {
        // Sets the new class name to be added
        var newClassName = "class" + (Object.keys(classObject).length + 1);
        var className = document.getElementById("className").value;
        var classColor = document.getElementById("selectColor");

        var classColorSet = classColor.options[classColor.selectedIndex].text;

        // Add class to database
        setDoc(
          doc(db, "classes", user.email),
          {
            // Capitalizes first letter of name
            [newClassName]: { Name: className.charAt(0).toUpperCase() + className.slice(1), Color: classColorSet, Assignments: {} },
          },
          { merge: true }
        );
      });
    };
    setClasses();

    var classToBeEdited;
    var classToBeEditedSelection;
    var classNameUpdated;

    //   Set name in header
    const logName = async () => {
      const nameRef = doc(db, "users", user.email);
      const nameDoc = await getDoc(nameRef);
      document.getElementById("displayName").style.display = "block";
      document.getElementById("displayName").innerHTML = nameDoc.data().name;

      // Loop through all of the classes linked with the user
      const classRef = doc(db, "classes", user.email);
      const classDoc = await getDoc(classRef);
      const classObject = classDoc.data();

      // Display classes in dropdown
      const select = document.getElementById("classesDropDown");
      for (const [key, value] of Object.entries(classObject)) {
        const opt = document.createElement("option");
        opt.value = key;
        opt.innerHTML = value.Name;
        select.appendChild(opt);
      }

      /*
          UPDATE CLASS WHEN EDIT CLASS BUTTON IS CLICKED
        */
      // Gets the input from the text field
      document.getElementById("editClass").addEventListener("click", (event) => {
        classToBeEdited = document.getElementById("classesDropDown");
        classToBeEditedSelection = classToBeEdited.options[classToBeEdited.selectedIndex].text;

        var classNameEdit = document.getElementById("classNameEdit").value;
        console.log("ugh", classNameEdit);

        // Finds the field associated with the value
        for (const [key, value] of Object.entries(classObject)) {
          if (value.Name == classToBeEditedSelection) {
            classNameUpdated = key;
          }
        }

        // Update document without changing any other fields
        updateDoc(doc(db, "classes", user.email), {
          [`${[classNameUpdated]}.Name`]: classNameEdit,
        });
      });
    };
    logName();
  } else {
    // User is signed out
    console.log("not logged in- on auth state change");
    document.getElementById("logout-btn").style.display = "none";
    document.getElementById("displayName").style.display = "none";
  }
});
