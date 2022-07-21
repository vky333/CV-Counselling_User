import firebase from 'firebase';
  
const firebaseConfig = {
    apiKey: "AIzaSyDPFvhfIxU_XQVxt2z0FaqDmJoBjHwQ1aE",
    authDomain: "cv-counsellors.firebaseapp.com",
    projectId: "cv-counsellors",
    storageBucket: "cv-counsellors.appspot.com",
    messagingSenderId: "149722418613",
    appId: "1:149722418613:web:4970c3c4c3223494f81dfc"
};

if(firebase.apps.length === 0)
    firebase.initializeApp(firebaseConfig);
var auth = firebase.auth();

export {auth , firebase};