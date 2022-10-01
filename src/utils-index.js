// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.10.0/firebase-app.js";
import { getAuth, signOut } from "https://www.gstatic.com/firebasejs/9.10.0/firebase-auth.js";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyB2NvowmMXThqn01P54Vm-0mSwuVIvbi1I",
  authDomain: "duedate-402bc.firebaseapp.com",
  projectId: "duedate-402bc",
  storageBucket: "duedate-402bc.appspot.com",
  messagingSenderId: "792845287352",
  appId: "1:792845287352:web:c3110ba0023c7d32a5594d",
};

// wrapper for querySelector...returns matching element
export function qs(selector, parent = document) {
  return parent.querySelector(selector);
}

export function renderWithTemplate(template, parentElement, data, callback) {
  let clone = template.content.cloneNode(true);
  if (callback) {
    clone = callback(clone, data);
  }
  parentElement.appendChild(clone);
}

export async function loadTemplate(path) {
  const html = await fetch(path)
    .then((response) => {
      if (!response.ok) {
        throw new Error("Error!");
      }
      return response;
    })
    .then((response) => response.text());

  const template = document.createElement("template");
  template.innerHTML = html;
  return template;
}

export async function loadHeader() {
  // Loads header into main.js
  const headerHTML = await loadTemplate("partials/header.html");

  const header = qs("#main-header");

  await renderWithTemplate(headerHTML, header);

  const app = initializeApp(firebaseConfig);
  const auth = getAuth();

  const logoutBtn = document.querySelector("#logout-btn");
  logoutBtn.addEventListener("click", (e) => {
    e.preventDefault();
    auth.signOut();
    console.log("User signed out!");
    document.getElementById("logout-btn").style.display = "none";
    document.getElementById("login-btn").style.display = "block";
    document.getElementById("register-btn").style.display = "block";
  });
}

export async function loadRegister() {
  // Loads header into main.js
  const registerHTML = await loadTemplate("partials/login.html");

  const register = qs("#register-partial");

  await renderWithTemplate(registerHTML, register);
}

export async function loadLogin() {
  // Loads header into main.js
  const loginHTML = await loadTemplate("partials/login.html");

  const login = qs("#register-partial");

  await renderWithTemplate(loginHTML, register);
}
