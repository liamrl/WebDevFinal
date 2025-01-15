/* === Imports === */
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-auth.js";
import { createUserWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-auth.js";
import { signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-auth.js";
import { signOut } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-auth.js";
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-firestore.js";
import { collection } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-firestore.js";
import { addDoc } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-firestore.js";
import { serverTimestamp } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-firestore.js";
import { getDocs } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-firestore.js"; 
import { query } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-firestore.js";



/* === Firebase Setup === */
const firebaseConfig = {
    apiKey: "AIzaSyD_7Xbx1i757kL7MtRN-II5TiZCZtSdNUg",
    authDomain: "hot-and-cold-12e31.firebaseapp.com",
    projectId: "hot-and-cold-12e31",
    storageBucket: "hot-and-cold-12e31.firebasestorage.app",
    messagingSenderId: "537579000252",
    appId: "1:537579000252:web:f617c195f80ad4a5d05bb9"
  };
 
  // Initialize Firebase
  const app = initializeApp(firebaseConfig);
  const auth = getAuth(app)
  const db = getFirestore(app);
  console.log(db)
  console.log(auth)
 
  console.log(app.options.projectId)
/* === UI === */

/* == UI - Elements == */
const userProfilePictureEl = document.getElementById("user-profile-picture")

const viewLoggedOut = document.getElementById("logged-out-view")
const viewLoggedIn = document.getElementById("logged-in-view")

const signInWithGoogleButtonEl = document.getElementById("sign-in-with-google-btn")

const emailInputEl = document.getElementById("email-input")
const passwordInputEl = document.getElementById("password-input")

const signInButtonEl = document.getElementById("sign-in-btn")
const createAccountButtonEl = document.getElementById("create-account-btn")

const signOutButtonEl = document.getElementById("sign-out-btn")

const userGreetingEl = document.getElementById("user-greeting")

const textareaEl = document.getElementById("post-input")
const postButtonEl = document.getElementById("post-btn")

const fetchPostsButtonEl = document.getElementById("fetch-posts-btn"); 
const postsContainerEl = document.getElementById("posts-container"); 

/* == UI - Event Listeners == */
signInWithGoogleButtonEl.addEventListener("click", authSignInWithGoogle)

signInButtonEl.addEventListener("click", authSignInWithEmail)
createAccountButtonEl.addEventListener("click", authCreateAccountWithEmail)

signOutButtonEl.addEventListener("click", authSignOut)

postButtonEl.addEventListener("click", postButtonPressed)

fetchPostsButtonEl.addEventListener("click", fetchAllPosts);

/* === Main Code === */
showLoggedOutView()

onAuthStateChanged(auth, (user) => {
    if (user) {
        showLoggedInView()
        showProfilePicture(userProfilePictureEl, user)
        showUserGreeting(userGreetingEl, user)
    } else {
        showLoggedOutView()
    }
 })
 
/* === Functions === */
function showProfilePicture(imgElement, user) {
    if (user !== null) {
      let photoURL = user.photoURL

        if (photoURL === null){
            photoURL = 'assets/images/defaultPic.jpg'
        }

        imgElement.src = photoURL

    }
}


function showUserGreeting(element, user){
    if (user !== null) {
        const displayName = user.displayName;
        
        if (!displayName){
            element.textContent = "Hey friend, how are you?";
        } else{
            element.textContent = "Hi " + displayName;
        }

    }
}

function fetchAllPosts() { 
    const postsQuery = query(collection(db, "posts"))
    
    getDocs(postsQuery) 	
    .then((querySnapshot) => { 
    postsContainerEl.innerHTML = ""; 
    
    querySnapshot.forEach((doc) => { 
    const post = doc.data(); 
    displayPost(post); }); 
    })
     
    .catch((error) => { 
    console.error("Error fetching posts: ", error.message);
     }); 
} 


function displayPost(post) { 

    const postCardEl = document.createElement("div"); 
    postCardEl.classList.add("post-card");
    let createdAt = post.createdAt
    if (!post.createdAt){
        createdAt = "Unknown time"
    } 
    postCardEl.innerHTML = ` <h3>${post.uid}</h3> 
                            <p><strong>Posted on:</strong> ${createdAt} </p> 
                            <p>${post.body}</p> `; 
    
    postsContainerEl.appendChild(postCardEl);
    
    }
    
    

/* = Functions - Firebase - Authentication = */

function authSignInWithGoogle() {
    console.log("Sign in with Google")
}

function authSignInWithEmail() {
    const email = emailInputEl.value
    const password = passwordInputEl.value


    signInWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
    showLoggedInView()
    })
    .catch((error) => {
    console.log(error.message)
    });


}

function authCreateAccountWithEmail() {
    const email = emailInputEl.value
    const password = passwordInputEl.value


    createUserWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
    showLoggedInView()
    })
    .catch((error) => {
    console.log(error.message)
    });


}


function authSignOut() {
    signOut(auth)
    .then(() => {
        showLoggedOutView()
      }).catch((error) => {
        console.log(error.message)
      });


}

/* == Functions - UI Functions == */
function showLoggedOutView() {
    hideView(viewLoggedIn)
    showView(viewLoggedOut)
 }
 
 function showLoggedInView() {
    hideView(viewLoggedOut)
    showView(viewLoggedIn)
 }
 
 function showView(view) {
    view.style.display = "flex"
 }
 
 function hideView(view) {
    view.style.display = "none"
 }

 function postButtonPressed() {
    const postBody = textareaEl.value
    const user = auth.currentUser

    if (postBody) {
        addPostToDB(postBody, user)
        clearInputField(textareaEl)
    }
 }
 

/* = Functions - Firebase - Cloud Firestore = */


async function addPostToDB(postBody, user) {
    try {
        
        const docRef = await addDoc(collection(db, "posts"), {
            body: postBody,
            uid: user.uid,
            createdAt: serverTimestamp()
        });
        console.log("Document written with ID: ", docRef.id);
    } catch (e) {
        console.error("Error adding document: ", e);
    }
}
 

