import React from 'react';
import { compose, withProps } from 'recompose';
import { GoogleMap, Marker, withScriptjs, withGoogleMap, InfoWindow } from 'react-google-maps';
import MonitoringPopover from '../../pages/monetering/MonitoringPopover';
import jwtDefaultConfig from "@src/@core/auth/jwt/jwtDefaultConfig"
import { getUserData } from '@utils'
import MapVehiclePopup from '../modal/MapVehiclePopup';

class TripMap extends React.PureComponent {
    constructor(props) {
        super(props);

        this.state = {
            data: [],
            position: null,
            rowData: null,
        }
    }

    componentDidMount() {
        if (this.props.data) {
            this.setState({
                data: this.props.data
            })
        }
    }

    componentDidUpdate(prevProps, prevState) {
        console.log(this.props.data, 'thisprops.data')
        if (this.state.data != this.props.data) {
            this.setState({
                data: this.props.data
            })
        }
    }

    handleToggleOpen(item) {
        this.setState({
            data: this.state.data,
            position: {
                lat: item.current_latitude,
                lng: item.current_longitude
            },
            rowData: item
        })
    }

    handleMouseOver = async (item) => {
        await this.setState({
            data: this.state.data,
            position: {
                lat: item.current_latitude,
                lng: item.current_longitude
            },
            rowData: item
        });
        //console.log(this.state.rowData,"rowdata")
    };
    handleMouseExit = e => {
        this.setState({
            position: null,
            rowData: null
        });
    };

    render() {
        return (
            <GoogleMap
                defaultZoom={8}
                defaultCenter={{ lat: 24.7241504, lng: 46.2620528 }}
                language={'en'}
                mapTypeId={google.maps.MapTypeId.ROADMAP}
            // mapContainerStyle={{
            //     height: "500px",
            //     width: "100%"
            // }}
            >
                {
                    this.state.data.length > 0 &&
                    this.state.data.map((marker, index) => (
                        <Marker
                            key={index + 'allmaps'}
                            position={{ lat: marker.current_latitude, lng: marker.current_longitude }}
                            onMouseOver={() => this.handleMouseOver(marker)}
                            icon={{
                                url: marker.vehicle_type && marker.vehicle_type.icon ? jwtDefaultConfig.BASE_IMAGE_URL + marker.vehicle_type.icon : `/images/markers/car.png`,
                                scaledSize: new window.google.maps.Size(40, 30),
                                anchor: { x: 10, y: 10 },
                            }}
                        />
                    ))
                }
                {
                    this.state.customRoute && this.state.position ?
                        <InfoWindow
                            position={this.state.position} onCloseClick={this.handleMouseExit}
                        >
                            <MapVehiclePopup rowData={this.state.rowData} height={this.props.height} />

                        </InfoWindow>
                        :
                        this.state.position && <InfoWindow
                            position={this.state.position} onCloseClick={this.handleMouseExit}
                            maxWidth={420} height={300} >
                            <MonitoringPopover rowData={this.state.rowData} height={this.props.height} />

                        </InfoWindow>
                }
            </GoogleMap>
        )
    }
}
export default compose(
    withProps((props) => {
        return {
            googleMapURL: `https://maps.googleapis.com/maps/api/js?v=3.exp&libraries=geometry,drawing,places&key=${getUserData().map_key}&language=en`,
            loadingElement: <div style={{ height: `100%` }} />,
            containerElement: <div style={{ height: props.height ? props.height : '100vh' }} />,
            mapElement: <div style={{ height: `100%` }} />,
        };
    }),
    withScriptjs,
    withGoogleMap,
)(TripMap);