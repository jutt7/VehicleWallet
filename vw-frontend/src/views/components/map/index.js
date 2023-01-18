import React, { useState, useEffect } from "react";
import "@styles/react/libs/flatpickr/flatpickr.scss";
import "@styles/react/pages/page-account-settings.scss";
import {
  GoogleMap,
  useJsApiLoader,
  Marker,
  InfoWindow,
} from "@react-google-maps/api";
import { useTranslation } from "react-i18next";
import CustomMarker from "../../../assets/images/icons/custom_marker.png";
import { ClipLoader } from "react-spinners";
import {
  Card,
  CardHeader,
  CardTitle,
  CardBody,
  CardSubtitle,
} from "reactstrap";

function MapComponent(props) {
  const { t } = useTranslation();
  const [overlay, setoverlay] = useState(false);

  const [activeMarker, setActiveMarker] = useState(null);

  const [markers, setMarkers] = useState([]);
  const [cordinates, setCordinates] = useState({
    lat: 24.7136,
    lng: 46.6753,
  });
  const [containerStyle, setContainerStyle] = useState({
    width: "100%",
    height: "480px",
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

  const handleActiveMarker = (marker) => {
    // console.log("iddddddddddd", marker);
    if (marker === activeMarker) {
      return;
    }
    setActiveMarker(marker);
  };

  const setMarkerValues = () => {
    // console.log("dataaa in map", props.data);
    // setMapKey(props.mapKey);
    let arr = [];

    // props.data.forEach((item) => {
    //   let markers = {
    //     lat: item.latitude,
    //     long: item.longitude,
    //     name: item.name_en,
    //   };
    //   arr.push(markers);
    // });
    setContainerStyle({
      height: props.height,
      width: props.width,
    });
    setMarkers(props.data);
  };
  useEffect(() => {
    setMarkerValues();
  }, [props.data]);

  useEffect(() => {
    // console.log("marks", markers);
    if (markers.length > 0) {
      setCordinates({
        lat: parseFloat(markers[0].latitude),
        lng: parseFloat(markers[0].longitude),
      });
    }
  }, [markers]);
  return (
    <div>
      <ClipLoader
        css={`
          position: absolute;
          top: 20%;
          left: 40%;
          right: 40%;
          bottom: 20%;
          z-index: 999999;
          display: block;
        `}
        size={"200px"}
        this
        also
        works
        color={"#196633"}
        height={100}
        loading={props.loading}
      />
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
            onClick={() => setActiveMarker(null)}
          >
            {/* Child components, such as markers, info windows, etc. */}

            {markers.length > 0 ? (
              markers.map((item, index) => {
                return (
                  <Marker
                    onClick={() => handleActiveMarker(item.gas_station_id)}
                    key={index}
                    position={{
                      lat: parseFloat(item.latitude),
                      lng: parseFloat(item.longitude),
                    }}
                    options={{
                      icon: CustomMarker,
                    }}
                  >
                    {activeMarker === item.gas_station_id ? (
                      <InfoWindow onCloseClick={() => setActiveMarker(null)}>
                        <div>
                          <p style={{ color: "black", fontWeight: "500" }}>
                            Gas Station Name: {item.name_en}
                          </p>
                          <p style={{ color: "black", fontWeight: "500" }}>
                            Address: {item.address}
                          </p>
                        </div>
                      </InfoWindow>
                    ) : null}
                  </Marker>
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
    </div>
  );
}

export default MapComponent;
