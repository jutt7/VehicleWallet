import React, { useState } from "react";
import Client from "./client";
import Station from "./station";
import User from "./users";

export default function index() {
  const [clientShow, setclientShow] = useState(true);
  const [stationShow, setstationShow] = useState(false);
  const [usersShow, setusersShow] = useState(false);
  const [clientID, setclientID] = useState("");

  const onShowStation = (id) => {
    setclientShow(false);
    setusersShow(false);
    setstationShow(true);
    setclientID(id);
  };

  const onShowUser = (id) => {
    setclientShow(false);
    setstationShow(false);
    setusersShow(true);
    setclientID(id);
  };

  const onShowClient = () => {
    setstationShow(false);
    setusersShow(false);
    setclientShow(true);
  };

  const showListing = () => {
    if (clientShow) {
      return (
        <Client
          onShowStation={(e) => onShowStation(e)}
          onShowUser={(e) => onShowUser(e)}
          clientID={clientID}
        />
      );
    } else if (stationShow) {
      return (
        <Station onShowClient={(e) => onShowClient()} clientID={clientID} />
      );
    } else if (usersShow) {
      return <User onShowClient={(e) => onShowClient()} clientID={clientID} />;
    }
  };

  return <div>{showListing()}</div>;
}
