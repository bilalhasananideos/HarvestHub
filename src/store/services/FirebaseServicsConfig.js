// // Import the functions you need from the SDKs you need
// import { initializeApp } from "firebase/app";
// import { getAnalytics } from "firebase/analytics";
// // TODO: Add SDKs for Firebase products that you want to use
// // https://firebase.google.com/docs/web/setup#available-libraries

// // Your web app's Firebase configuration
// // For Firebase JS SDK v7.20.0 and later, measurementId is optional
// const firebaseConfig = {
//   apiKey: "AIzaSyC_QcVGtFjbXyfGDUaRYc7spMB08JoVQyk",
//   authDomain: "harvest-hub-f93cf.firebaseapp.com",
//   projectId: "harvest-hub-f93cf",
//   storageBucket: "harvest-hub-f93cf.firebasestorage.app",
//   messagingSenderId: "943734294750",
//   appId: "1:943734294750:web:6dd0a5475b6843b4c89a4f",
//   measurementId: "G-61HBXGQP9H"
// };

// // Initialize Firebase
// const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);





// Import the functions you need from the SDKs you need
import {initializeApp} from 'firebase/app';
import {getFirestore, initializeFirestore} from 'firebase/firestore';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries
 
// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyC_QcVGtFjbXyfGDUaRYc7spMB08JoVQyk",
    authDomain: "harvest-hub-f93cf.firebaseapp.com",
    projectId: "harvest-hub-f93cf",
    storageBucket: "harvest-hub-f93cf.firebasestorage.app",
    messagingSenderId: "943734294750",
    appId: "1:943734294750:web:6dd0a5475b6843b4c89a4f",
    measurementId: "G-61HBXGQP9H"
};
 
// Initialize Firebase
const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);
// const db = getFirestore(app);
// ✅ Use initializeFirestore to set settings like experimentalForceLongPolling
const db = initializeFirestore(app, {
  experimentalForceLongPolling: true,
  useFetchStreams: false, // optionally disable fetch streams for RN
});
 
export {db};