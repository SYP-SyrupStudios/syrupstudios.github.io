import { initializeApp } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-app.js";
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut, sendEmailVerification, sendPasswordResetEmail } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-auth.js";

const apiKey = window.API_KEY;

const firebaseConfig = {
  apiKey: apiKey,
  authDomain: "syrup-studios-api.firebaseapp.com",
  databaseURL: "https://syrup-studios-api-default-rtdb.firebaseio.com",
  projectId: "syrup-studios-api",
  storageBucket: "syrup-studios-api.appspot.com",
  messagingSenderId: "100691275577",
  appId: "1:100691275577:web:76799b531c3d16c5b4c2e8"
};

  const app = initializeApp(firebaseConfig);
  const auth = getAuth(app);

  //login
  document.getElementById('login-btn').addEventListener('click', function(){
    const loginEmail = document.getElementById('login-email').value;
    const loginPassword = document.getElementById('login-password').value;

    signInWithEmailAndPassword(auth, loginEmail, loginPassword)
    .then((userCredential) => {
        //signed in
        const user = userCredential.user;
        document.getElementById('result-box').style.display = "inline";
        document.getElementById('login-div').style.display = "none";
        document.getElementById('result').innerHTML= "Welcome back!&nbsp" +loginEmail;
        document.getElementById('error-login').innerHTML= "";
    })

    .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        document.getElementById('error-login').innerHTML= "Sorry!&nbsp" +errorMessage;
    });
  });

  //create account

    document.getElementById('register-btn').addEventListener('click', function(){
      const registerEmail = document.getElementById('register-email').value;
      const registerPassword = document.getElementById('register-password').value;
  
      createUserWithEmailAndPassword(auth, registerEmail, registerPassword)
      .then((userCredential) => {
          //signed in
          const user = userCredential.user;
          document.getElementById('result-box').style.display = "inline";
          document.getElementById('register-div').style.display = "none";
          document.getElementById('result').innerHTML= "Welcome!&nbsp" +registerEmail;
          document.getElementById('error-signup').innerHTML= "";

          sendEmailVerification(auth.currentUser)
            .then(() => {
              console.log("Email Verification Sent!")
          })
  
      })
      .catch((error) => {
          const errorCode = error.code;
          const errorMessage = error.message;
          document.getElementById('error-signup').innerHTML= "Sorry!&nbsp" +errorMessage;
      });
});

// reset password
document.getElementById('reset-pass-btn').addEventListener('click', function(){
  const EmailToReset = document.getElementById('reset-password').value;

  sendPasswordResetEmail(auth, EmailToReset)
  .then(() => {
      document.getElementById('reset-div').style.display = "none";
      document.getElementById('login-div').style.display = "inline";
      document.getElementById('error-reset').innerHTML= "";
  })
  .catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
      document.getElementById('error-reset').innerHTML= "Sorry!&nbsp" +errorMessage;
  });
});

//buttons

document.getElementById('log-out-btn').addEventListener('click', function(){
  signOut(auth).then(() => {
    document.location.reload();
  }) .catch((error) => {
    document.getElementById('result').innerHTML= "Sorry!&nbsp" +errorMessage;
  });
});
  

document.getElementById('reg-btn').addEventListener('click', function(){
    document.getElementById('register-div').style.display = "inline";
    document.getElementById('login-div').style.display = "none";
});

document.getElementById('log-btn').addEventListener('click', function(){
    document.getElementById('register-div').style.display = "none";
    document.getElementById('login-div').style.display = "inline";
});

document.getElementById('reset-btn').addEventListener('click', function(){
  document.getElementById('login-div').style.display = "none";
  document.getElementById('reset-div').style.display = "inline";
});