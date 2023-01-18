// This a service worker file for receiving push notifitications.
// See `Access registration token section` @ https://firebase.google.com/docs/cloud-messaging/js/client#retrieve-the-current-registration-token

// import Notification from "../src/firebaseNotifications/Notification";

// Scripts for firebase and firebase messaging
importScripts("https://www.gstatic.com/firebasejs/8.2.0/firebase-app.js");
importScripts("https://www.gstatic.com/firebasejs/8.2.0/firebase-messaging.js");

// Initialize the Firebase app in the service worker by passing the generated config
const firebaseConfig = {
  apiKey: "AIzaSyBukOiKDcQ5z5V666JvsGuS1lr09U82dGE",
  authDomain: "vihicle-wallet.firebaseapp.com",
  projectId: "vihicle-wallet",
  storageBucket: "vihicle-wallet.appspot.com",
  messagingSenderId: "492251282434",
  appId: "1:492251282434:web:dccea62096eaf9eebfbb1b",
  measurementId: "G-32W2CB841J",
};

firebase.initializeApp(firebaseConfig);

// Retrieve firebase messaging
const messaging = firebase.messaging();

// Handle incoming messages while the app is not in focus (i.e in the background, hidden behind other tabs, or completely closed).
messaging.onBackgroundMessage(function (payload) {
  console.log("Received background message ", payload);

  const notificationTitle = payload.data.message;
  console.log("noti-----------------", payload.data.body);
  const notificationOptions = {
    body: payload.data.body,
  };
  // <Notification/>
  self.registration.showNotification(notificationTitle, notificationOptions);
});
