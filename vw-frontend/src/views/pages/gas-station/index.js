import React, { useState } from "react";
import Station from "./gasStation";
import User from "./users";

export default function index() {
  const [stationShow, setstationShow] = useState(true);
  const [usersShow, setusersShow] = useState(false);
  const [stationID, setstationID] = useState("");

  const onShowStation = () => {
    setusersShow(false);
    setstationShow(true);
  };

  const onShowUser = (id) => {
    setstationShow(false);
    setusersShow(true);
    setstationID(id);
  };

  const showListing = () => {
    if (stationShow) {
      return (
        <Station onShowUser={(e) => onShowUser(e)} stationID={stationID} />
      );
    } else if (usersShow) {
      return (
        <User onShowStation={(e) => onShowStation()} stationID={stationID} />
      );
    }
  };

  return <div>{showListing()}</div>;
}
