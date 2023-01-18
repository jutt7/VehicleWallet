import React, { useState, useEffect } from "react";
import { Modal, InputGroup } from "react-bootstrap";
import helper from "@src/@core/helper";
import axios from "axios";
import jwtDefaultConfig from "@src/@core/auth/jwt/jwtDefaultConfig";
import { ClipLoader } from "react-spinners";
import DriverSheet from "../../../assets/files/DriverSheet.xlsx";
import CustomMarker from "../../../assets/images/icons/custom_marker.png";

import {
  Button,
  Media,
  Label,
  Row,
  Col,
  Input,
  FormGroup,
  Alert,
  Form,
} from "reactstrap";
import "@styles/react/libs/flatpickr/flatpickr.scss";
import "@styles/react/pages/page-account-settings.scss";
import { GoogleMap, useJsApiLoader, Marker } from "@react-google-maps/api";

const center = {
  lat: 24.7136,
  lng: 46.6753,
};
const containerStyle = {
  width: "765px",
  height: "380px",
};

export default function Maps(props) {
  // const [mapKey, setMapKey] = useState("");

  const [markers, setMarkers] = useState([]);
  const [cordinates, setCordinates] = useState({
    lat: 24.7136,
    lng: 46.6753,
  });

  const { isLoaded } = useJsApiLoader({
    id: "google-map-script",

    googleMapsApiKey: localStorage.getItem("map_key"),
  });
  const [map, setMap] = React.useState(null);

  const onLoad = React.useCallback(function callback(map) {
    const bounds = new window.google.maps.LatLngBounds(cordinates);
    // map.fitBounds(bounds);
    setMap(map);
  }, []);

  const onUnmount = React.useCallback(function callback(map) {
    setMap(null);
  }, []);

  const setMarkerValues = () => {
    // console.log("dataaa in map", props.data);
    // setMapKey(props.mapKey);
    let arr = [];

    props.data.forEach((item) => {
      let markers = {
        lat: item.latitude,
        long: item.longitude,
      };
      arr.push(markers);
    });

    setMarkers(arr);
  };

  useEffect(() => {
    // console.log("marks", markers);

    if (markers.length > 0) {
      setCordinates({
        lat: parseFloat(markers[0].lat),
        lng: parseFloat(markers[0].long),
      });
    }
  }, [markers]);

  return (
    <div>
      <Modal
        show={props.show}
        onHide={props.onCloseModal}
        onShow={(e) => setMarkerValues()}
        centered
        size="lg"
      >
        <Modal.Header closeButton>
          <Modal.Title className="text-center">
            Location of Gas Stations
          </Modal.Title>
        </Modal.Header>

        <Modal.Body style={{ height: "400px", overflowY: "auto" }}>
          {isLoaded ? (
            <div
            // style={{ background: "pink", height: "200px", width: "200px" }}
            >
              <GoogleMap
                mapContainerStyle={containerStyle}
                center={cordinates}
                zoom={8}
                onLoad={onLoad}
                onUnmount={onUnmount}
              >
                {/* Child components, such as markers, info windows, etc. */}

                {markers.length > 0 ? (
                  markers.map((item, index) => {
                    return (
                      <Marker
                        key={index}
                        position={{
                          lat: parseFloat(item.lat),
                          lng: parseFloat(item.long),
                        }}
                        icon={{
                          url: CustomMarker,
                          scaledSize: new google.maps.Size(25, 35),
                          // scale: 0.1,
                        }}
                      />
                    );
                  })
                ) : (
                  <></>
                )}
              </GoogleMap>
            </div>
          ) : (
            <></>
          )}
        </Modal.Body>

        <Modal.Footer>
          <Button
            color="primary"
            onClick={() => {
              props.onCloseModal();
            }}
          >
            {/* <i className="fas fa-check"></i> */}
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}
