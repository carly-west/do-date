import { loadHeader } from "../js/utils.js";

// Loads header
loadHeader();

// Import the functions you need from the SDKs you need
import { initializeApp} from "https://www.gstatic.com/firebasejs/9.10.0/firebase-app.js";
import { getAuth, signInWithEmailAndPassword, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/9.10.0/firebase-auth.js";
import { doc, setDoc, getDoc, getFirestore, getDocs, updateDoc, collection } from "https://www.gstatic.com/firebasejs/9.10.0/firebase-firestore.js";



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
const user = auth.currentUser;
const db = getFirestore(app);

// Populate dropdown




onAuthStateChanged(auth, (user) => {
    if (user) {

      console.log("logged in- on auth state change")
      document.getElementById("logout-btn").style.display = "block";
      document.getElementById("login-btn").style.display = "none";
      document.getElementById("register-btn").style.display = "none";
  
    //   Set class dropdown
    const setClasses = async () => {
        // const classRef = doc(db, "classes", user.email);
        // const classDoc = await getDoc(classRef);
        // const classObject = classDoc.data();
        // console.log(classObject)


        const classDoc = await getDocs(collection(db, "classes", user.email, "classes"))


        var classCounter = 0

        classDoc.forEach((doc) => {
          // Count the number of classes in the db/classes/user.email/classes collection
          classCounter += 1;
        });

        classCounter += 1



        document.getElementById("submitNewClass").addEventListener("click", (e) => {
            // Sets the new class name to be added
            var newClassName = "class" + classCounter
            var className = document.getElementById("className").value;

            // Add class to database
            setDoc(doc(db, "classes", user.email, "classes", newClassName), {
                // Capitalizes first letter of name
                "Name": className.charAt(0).toUpperCase() + className.slice(1)
                }, { merge: true });

            // // Add class to database
            // setDoc(doc(db, "classes", user.email), {
            //   // Capitalizes first letter of name
            //   [newClassName]: className.charAt(0).toUpperCase() + className.slice(1)
            //   }, { merge: true });
                
        });
    }
    setClasses();

    var classToBeEdited
    var classToBeEditedSelection
    var classNameUpdated


    //   Set name in header
      const logName = async () => {
        const nameRef = doc(db, "users", user.email);
        const nameDoc = await getDoc(nameRef);
        document.getElementById("displayName").style.display = "block";
        document.getElementById("displayName").innerHTML = nameDoc.data().name;

        // Loop through all of the classes linked with the user
        const classDoc = await getDocs(collection(db, "classes", user.email, "classes"))
        const select = document.getElementById('classesDropDown')

        classDoc.forEach((doc) => {
          // Display classes in the db/classes/user.email/classes collection
          const opt = document.createElement('option');
          opt.value = doc.id;
          opt.innerHTML = doc.data().Name;
          select.appendChild(opt);
        });

        const classToBeUpdated2 = collection(db, "classes", user.email, "classes");
        console.log("hey", classToBeUpdated2)

        const classToBeUpdated3 = doc(db, "classes", user.email);
        console.log("hey", classToBeUpdated3)

        // Gets the input from the text field
        document.getElementById("editClass").addEventListener("click", (event) => {
          classToBeEdited = document.getElementById("classesDropDown");
          classToBeEditedSelection = classToBeEdited.options[classToBeEdited.selectedIndex].text ;
          console.log(classToBeEditedSelection)   

          var classNameEdit = document.getElementById("classNameEdit").value;
          console.log("ugh", classNameEdit)

          classDoc.forEach((doc) => {
            if (doc.data().Name == classToBeEditedSelection) {
              console.log("hiiii")
              classNameUpdated = doc.id
            }
          });

        //   // Finds the field associated with the value
        //   for (const [key, value] of Object.entries(classObject)) {
        //     if (value == classToBeEditedSelection) {
        //       classNameUpdated = key
        //     }
        // }

        var classToBeUpdated = doc(db, "classes", user.email);
        classNameUpdated = "classes." + classNameUpdated
        console.log(classDoc.doc)
        // Set the "capital" field of the city 'DC'
        console.log("hi", classNameUpdated)  
        updateDoc(classToBeUpdated, {
          // "class6" : classNameEdit
          [classNameUpdated] : classNameEdit
        });

        console.log(classNameEdit)

        });



      }
      logName();
  


    } else {
      // User is signed out
      console.log("not logged in- on auth state change")
      document.getElementById("logout-btn").style.display = "none";
      document.getElementById("displayName").style.display = "none";
  
    }
  });