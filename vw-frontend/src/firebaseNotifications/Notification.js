import React, { useState, useEffect } from "react";
import { ToastContainer, toast } from "react-toastify";
import { requestForToken, onMessageListener } from "./Firebase";
import helper from "@src/@core/helper";
import firebase from "firebase/app";

const Notification = () => {
  if ("Notification" in window) {
    console.log("Notification supported");
  } else {
    console.log("Notification not supported");
  }
  const [notification, setNotification] = useState({
    title: "",
    body: "",
  });
  const notify = () =>
    toast.success(<ToastContent />, {
      position: "top-right",
      // autoClose: 4000,
      hideProgressBar: true,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
    });

  const messaging = () => {
    // const messaging = firebase.messaging.isSupported()
    //   ? console.log("messaging supported")
    //   : console.log("messaging not supported");
  };

  function ToastContent() {
    return (
      <div>
        <p>
          <b>{notification?.title}</b>
        </p>
        <p>{notification?.body}</p>
      </div>
    );
  }

  useEffect(() => {
    messaging();
  }, []);

  useEffect(() => {
    if (notification?.title) {
      notify();
      console.log("findd");
    }
  }, [notification]);

  requestForToken();

  onMessageListener()
    .then((payload) => {
      //console.log(payload.notification, "payload");
      setNotification({
        title: payload?.notification?.title,
        body: payload?.notification?.body,
      });
    })
    .catch((err) => console.log("failed: ", err));

  return helper.isObject(notification) ? (
    <ToastContainer autoClose={false} />
  ) : (
    ""
  );
};

export default Notification;
