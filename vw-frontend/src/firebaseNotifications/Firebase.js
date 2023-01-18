// Firebase Cloud Messaging Configuration File.
// Read more at https://firebase.google.com/docs/cloud-messaging/js/client && https://firebase.google.com/docs/cloud-messaging/js/receive

import { initializeApp } from "firebase/app";
import { getMessaging, getToken, onMessage } from "firebase/messaging";
import Notification from "./Notification";

export let fireBaseToken;

const firebaseConfig = {
  apiKey: "AIzaSyBukOiKDcQ5z5V666JvsGuS1lr09U82dGE",
  authDomain: "vihicle-wallet.firebaseapp.com",
  projectId: "vihicle-wallet",
  storageBucket: "vihicle-wallet.appspot.com",
  messagingSenderId: "492251282434",
  appId: "1:492251282434:web:dccea62096eaf9eebfbb1b",
  measurementId: "G-32W2CB841J",
};

initializeApp(firebaseConfig);

const messaging = getMessaging();

export const requestForToken = () => {
  return getToken(messaging, {
    vapidKey: `BCtSV4gPNvOkeM5IYhZ0XooVUnLhJA9EqfIO-7M_0LgD3DB6fsqq4GYjPO-tbLFnq9_wo6WOX6E2qBbWk3n-qYU`,
  })
    .then((currentToken) => {
      if (currentToken) {
        //console.log("current token for client: ", currentToken);
        // Perform any other neccessary action with the token
        fireBaseToken = currentToken;
      } else {
        // Show permission request UI
        console.log(
          "No registration token available. Request permission to generate one."
        );
      }
    })
    .catch((err) => {
      console.log("An error occurred while retrieving token. ", err);
    });
};

// Handle incoming messages. Called when:
// - a message is received while the app has focus
// - the user clicks on an app notification created by a service worker `messaging.onBackgroundMessage` handler.
export const onMessageListener = () =>
  new Promise((resolve) => {
    onMessage(messaging, (payload) => {
      resolve(payload);
      // console.log(resolve(payload));
      console.log(payload.data);
      // <Notification/>
    });
  });

// Import the functions you need from the SDKs you need
// import { initializeApp } from "firebase/app";
// import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
// const firebaseConfig = {
//   apiKey: "AIzaSyChMLgNKfBQBA4Eg34X4S3-pHE0Z8l31nM",
//   authDomain: "aqgsupplier.firebaseapp.com",
//   projectId: "aqgsupplier",
//   storageBucket: "aqgsupplier.appspot.com",
//   messagingSenderId: "926007298382",
//   appId: "1:926007298382:web:4749bf93ed6e1c85d0361f",
//   measurementId: "G-3MYVH00XS4"
// };

// Initialize Firebase
// const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);
