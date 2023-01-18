import React, { useState, useEffect } from "react";
import { Modal, InputGroup } from "react-bootstrap";
import helper from "@src/@core/helper";
import GooglePlacesAutocomplete from "react-google-places-autocomplete";
import Geocode from "react-geocode";
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

export default function SearchOnMap(props) {
  // const [mapKey, setMapKey] = useState("");

  const [markers, setMarkers] = useState({
    lat: "",
    lng: "",
  });

  const [cordinates, setCordinates] = useState({
    lat: 24.7136,
    lng: 46.6753,
  });

  const { isLoaded } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: localStorage.getItem("map_key"),
    // libraries: ["GeocodingAPI"],
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
    if (props.loc.lat != "" && props.loc.lng != "") {
      setCordinates({
        lat: parseFloat(props.loc.lat),
        lng: parseFloat(props.loc.lng),
      });
      setMarkers({
        lat: parseFloat(props.loc.lat),
        lng: parseFloat(props.loc.lng),
      });
    }
  };

  const submit = () => {
    // props.submitAction(markers);
  };

  // useEffect(() => {

  //   console.log("marks", markers);
  //   if (markers.lat != "" && markers.lng != "") {
  //     getAddress();
  //   }
  // }, [markers]);

  const getAddress = () => {
    Geocode.setApiKey(localStorage.getItem("map_key"));
    Geocode.fromLatLng(markers.lat, markers.lng).then(
      (response) => {
        const address = response.results[0].formatted_address;
        let city, state, country;
        for (
          let i = 0;
          i < response.results[0].address_components.length;
          i++
        ) {
          for (
            let j = 0;
            j < response.results[0].address_components[i].types.length;
            j++
          ) {
            switch (response.results[0].address_components[i].types[j]) {
              case "locality":
                city = response.results[0].address_components[i].long_name;
                break;
              case "administrative_area_level_1":
                state = response.results[0].address_components[i].long_name;
                break;
              case "country":
                country = response.results[0].address_components[i].long_name;
                break;
            }
          }
        }
        console.log(city, state, country);
        console.log(address);
      },
      (error) => {
        console.error(error);
      }
    );
  };

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
          {/* <div>
            <GooglePlacesAutocomplete />
          </div> */}
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
                onClick={(e) => {
                  // console.log("lat on: ", e.latLng.lat());
                  // console.log("long on: ", e.latLng.lng());
                  props.setLocation({
                    lat: e.latLng.lat(),
                    lng: e.latLng.lng(),
                  });
                  setMarkers({
                    lat: e.latLng.lat(),
                    lng: e.latLng.lng(),
                  });
                }}
                // onClick={(e) => {
                //   console.log("lat on: ", e.latLng.lat());
                //   console.log("long on: ", e.latLng.lng());
                // }}
              >
                {/* Child components, such as markers, info windows, etc. */}

                {markers.lat != "" ? (
                  <Marker
                    position={{
                      lat: parseFloat(markers.lat),
                      lng: parseFloat(markers.lng),
                    }}
                    options={{
                      icon: CustomMarker,
                    }}
                  />
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
          <Button color="primary" onClick={() => props.submit()}>
            <i className="fas fa-check"></i> Submit
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}
