import { loadHeader } from "../js/utils.js";

// Loads header
loadHeader();

// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.10.0/firebase-app.js";
import { getAuth, signInWithEmailAndPassword, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/9.10.0/firebase-auth.js";
import { doc, setDoc, getDoc, getFirestore, getDocs, updateDoc, deleteField } from "https://www.gstatic.com/firebasejs/9.10.0/firebase-firestore.js";

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

      // Display classes in legend
      const classLegend = document.getElementById("classList");
      for (const [key, value] of Object.entries(classObject)) {
        const listItem = document.createElement("li");
        listItem.value = key;
        listItem.innerHTML = value.Name;
        classLegend.appendChild(listItem);
        listItem.setAttribute("class", "class-color-" + value.Color);
      }

      // Display classes in days of the week
      for (const [outerKey, value] of Object.entries(classObject)) {
        for (const [key, assignmentValue] of Object.entries(value.Assignments)) {
          // assignmentValue is the assignment information
          const dayOfWeekID = document.getElementById(assignmentValue.DoDate);
          const dayListItem = document.createElement("li");
          dayListItem.value = key;
          dayListItem.innerHTML = assignmentValue.Name;
          dayOfWeekID.appendChild(dayListItem);
          dayListItem.setAttribute("class", "class-color-" + value.Color + " assignments");
          dayListItem.setAttribute("id", outerKey + "-" + assignmentValue.Name);
          dayListItem.setAttribute("value", outerKey + "-" + assignmentValue.Name);

          const dayOfWeekItem = document.getElementById(outerKey + "-" + assignmentValue.Name);
          const dayListCheck = document.createElement("input");
          dayOfWeekItem.appendChild(dayListCheck);
          dayListCheck.setAttribute("type", "checkbox");
          dayListCheck.setAttribute("name", "assignments");
          dayListCheck.setAttribute("value", outerKey + "-" + key);
        }
      }

      const setClasses = async () => {
        const classRef = doc(db, "classes", user.email);
        const classDoc = await getDoc(classRef);
        const classObject = classDoc.data();
        var assignmentToBeAdded;
        var assignmentNameUpdated;
        var doDayToBeAdded;
        var dueDayToBeAdded;

        /*
          ADDS ASSIGNMENT WHEN CREATE ASSIGNMENT BUTTON IS CLICKED
        */
        document.getElementById("addAssignmentButton").addEventListener("click", (e) => {
          // Sets the new class name to be added
          var assignmentName = document.getElementById("addAssignment").value;
          var classEdited = document.getElementById("classesDropDown");
          assignmentToBeAdded = classEdited.options[classEdited.selectedIndex].text;

          // // Sets the DO day of the week of the assignment to be added
          var doDayEdited = document.getElementById("dayDropDown");
          doDayToBeAdded = doDayEdited.options[doDayEdited.selectedIndex].text;

          // // Sets the DUE day of the week of the assignment to be added
          var dueDayEdited = document.getElementById("DueDayDropDown");
          dueDayToBeAdded = dueDayEdited.options[dueDayEdited.selectedIndex].text;

          // Finds the field associated with the value
          for (const [key, value] of Object.entries(classObject)) {
            if (value.Name == assignmentToBeAdded) {
              assignmentNameUpdated = key;
            }
          }
          var newAssignmentName = "assignment" + (Object.keys(classObject[assignmentNameUpdated].Assignments).length + 1);

          // Update document without changing any other fields
          updateDoc(doc(db, "classes", user.email), {
            [`${[assignmentNameUpdated]}.Assignments.${[newAssignmentName]}`]: { Name: assignmentName, DoDate: doDayToBeAdded, DueDate: dueDayToBeAdded },
          });
        });

        /*
          WHEN REMOVE ASSIGNMENTS BUTTON IS SELECTED
        */
        document.getElementById("removeAssignmentBtn").addEventListener("click", (e) => {
          // console.log(document.getElementById("email").value);
          var checkedAssignemnts = document.querySelectorAll('input[name="assignments"]:checked');
          let checkedAssignmentsArray = [];

          // Adds all checked assignmenst to an array and deletes the ones that are checked
          checkedAssignemnts.forEach((checkbox) => {
            checkedAssignmentsArray.push(checkbox.value);
            var checkboxValue = checkbox.value;
            var classId = checkboxValue.substr(0, checkboxValue.indexOf("-"));
            var assignmentId = checkboxValue.substring(checkboxValue.indexOf("-") + 1);

            // Update document without changing any other fields
            updateDoc(doc(db, "classes", user.email), {
              [`${[classId]}.Assignments.${[assignmentId]}`]: deleteField(),
            });
          });
        });

        /*
          WHEN "ORGANIZE BY DO DATE" IS CHECKED
        */

        document.getElementById("organizeCheckboxDo").addEventListener("click", (e) => {
          var removeElements = document.querySelectorAll(".assignments");
          removeElements.forEach((item) => {
            item.remove();
          });

          // Display classes in days of the week
          for (const [outerKey, value] of Object.entries(classObject)) {
            for (const [key, assignmentValue] of Object.entries(value.Assignments)) {
              const dayOfWeekID = document.getElementById(assignmentValue.DoDate);
              const dayListItem = document.createElement("li");
              dayListItem.value = key;
              dayListItem.innerHTML = assignmentValue.Name;
              dayOfWeekID.appendChild(dayListItem);
              dayListItem.setAttribute("class", "class-color-" + value.Color + " assignments");
              dayListItem.setAttribute("id", outerKey + "-" + assignmentValue.Name);
              dayListItem.setAttribute("value", outerKey + "-" + assignmentValue.Name);

              const dayOfWeekItem = document.getElementById(outerKey + "-" + assignmentValue.Name);
              const dayListCheck = document.createElement("input");
              dayOfWeekItem.appendChild(dayListCheck);
              dayListCheck.setAttribute("type", "checkbox");
              dayListCheck.setAttribute("name", "assignments");
              dayListCheck.setAttribute("value", outerKey + "-" + key);
            }
          }
        });

        document.getElementById("organizeCheckboxDue").addEventListener("click", (e) => {
          var removeElements = document.querySelectorAll(".assignments");
          removeElements.forEach((item) => {
            item.remove();
          });

          // Display classes in days of the week
          for (const [outerKey, value] of Object.entries(classObject)) {
            for (const [key, assignmentValue] of Object.entries(value.Assignments)) {
              const dayOfWeekID = document.getElementById(assignmentValue.DueDate);
              const dayListItem = document.createElement("li");
              dayListItem.value = key;
              dayListItem.innerHTML = assignmentValue.Name;
              dayOfWeekID.appendChild(dayListItem);
              dayListItem.setAttribute("class", "class-color-" + value.Color + " assignments");
              dayListItem.setAttribute("id", outerKey + "-" + assignmentValue.Name);
              dayListItem.setAttribute("value", outerKey + "-" + assignmentValue.Name);

              const dayOfWeekItem = document.getElementById(outerKey + "-" + assignmentValue.Name);
              const dayListCheck = document.createElement("input");
              dayOfWeekItem.appendChild(dayListCheck);
              dayListCheck.setAttribute("type", "checkbox");
              dayListCheck.setAttribute("name", "assignments");
              dayListCheck.setAttribute("value", outerKey + "-" + key);
            }
          }
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
