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

onAuthStateChanged(auth, (user) => {
  if (user) {
    console.log("logged in- on auth state change");
    document.getElementById("logout-btn").style.display = "block";
    document.getElementById("login-btn").style.display = "none";
    document.getElementById("register-btn").style.display = "none";

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

      // Display classes in list
      const classLegend = document.getElementById("classList");
      for (const [key, value] of Object.entries(classObject)) {
        const listItem = document.createElement("li");
        listItem.value = key;
        listItem.innerHTML = value.Name;
        classLegend.appendChild(listItem);
        listItem.setAttribute("class", "class-color-" + value.Color);
      }

      //   Set class dropdown
      const setClasses = async () => {
        const classRef = doc(db, "classes", user.email);
        const classDoc = await getDoc(classRef);
        const classObject = classDoc.data();
        var assignmentToBeAdded;
        var assignmentNameUpdated;
        var dayToBeAdded;

        /*
          ADDS ASSIGNMENT WHEN CREATE ASSIGNMENT BUTTON IS CLICKED
        */

        document.getElementById("addAssignmentButton").addEventListener("click", (e) => {
          // Sets the new class name to be added
          var assignmentName = document.getElementById("addAssignment").value;
          var classEdited = document.getElementById("classesDropDown");
          assignmentToBeAdded = classEdited.options[classEdited.selectedIndex].text;

          // // Sets the day of the week of the assignment to be added
          var dayEdited = document.getElementById("dayDropDown");
          dayToBeAdded = dayEdited.options[dayEdited.selectedIndex].text;

          // Finds the field associated with the value
          for (const [key, value] of Object.entries(classObject)) {
            if (value.Name == assignmentToBeAdded) {
              assignmentNameUpdated = key;
            }
          }
          var newAssignmentName = "assignment" + (Object.keys(classObject[assignmentNameUpdated].Assignments).length + 1);

          // Update document without changing any other fields
          updateDoc(doc(db, "classes", user.email), {
            [`${[assignmentNameUpdated]}.Assignments.${[newAssignmentName]}`]: { Name: assignmentName, Date: dayToBeAdded },
          });
        });
      };
      setClasses();
    };
    logName();
  } else {
    // User is signed out
    console.log("not logged in- on auth state change");
    document.getElementById("logout-btn").style.display = "none";
    document.getElementById("displayName").style.display = "none";
  }
});
