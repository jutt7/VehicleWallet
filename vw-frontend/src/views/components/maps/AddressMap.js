import React from 'react';
import { compose, withProps } from 'recompose';
import { GoogleMap, Marker, withScriptjs, withGoogleMap, InfoWindow } from 'react-google-maps';
import { Row, Col, Button } from 'react-bootstrap';

class AddressMap extends React.PureComponent {
    constructor(props) {
       super(props);

        this.state = {
            data: this.props.data,
            position: null,
            rowData: null,
            selected: null,
            draggableMarker: { lat: 24.7241504, lng: 46.2620528 }
        }
    }

    componentDidMount() {
        this.setData();
    }

    componentDidUpdate(prevProps, prevState) {
        this.setData()
    }

    setData = async()=> {
        await this.setState({ 
            data: this.props.data 
        });
        
        let data = {};
        data.lat = this.state.draggableMarker.lat;
        data.lng = this.state.draggableMarker.lng;

        await fetch(`//nominatim.openstreetmap.org/reverse?format=json&lon=${data.lng}&lat=${data.lat}`)
        .then(function(response) {
            return response.json();
        }).then(function(json) {
           
            data.address = json.display_name;
        });

        this.props.onMapClick(data);
    }

    handleMouseOver=async(item)=> {
      await  this.setState({
            data: this.state.data,
            position: {
                lat: item.latitude,
                lng: item.longitude
            },
            rowData: item
        });
    };

    handleMouseExit = e => {
        this.setState({
            position: null,
            rowData: null
        });
    };

    handleClick = async(item) => {
        let data = [...this.state.data];
        let selected = this.state.selected;

        for (let i=0; i < data.length; i ++) {
           
            if (data[i].address_id == item.address_id) {
                data[i].selected = true;
                selected = data[i];
                
            } else {
                data[i].selected = false;
            }
            
        }

        await  this.setState({
            data: data,
            selected: selected
        });

        this.props.onAddressSelection(selected);
    };

    onDragEnd = async (e) => {
        //console.log(e);
        let data = {};
        data.lat = e.latLng.lat();
        data.lng = e.latLng.lng();

        await this.setState({
            draggableMarker: { lat: data.lat, lng: data.lng }
        });

        await fetch(`//nominatim.openstreetmap.org/reverse?format=json&lon=${data.lng}&lat=${data.lat}`)
        .then(function(response) {
            return response.json();
        }).then(function(json) {
            console.log('api response', json);
            data.address = json.display_name;
            data.city = json.address && json.address.city ? json.address.city : null;
        });

        this.props.onMapClick(data);
    }

    render() {
        return (
            <div>
                <GoogleMap
                    defaultZoom={8}
                    defaultCenter={{ lat: 24.7241504, lng: 46.2620528 }}
                    language={this.props.language}
                    mapTypeId={google.maps.MapTypeId.ROADMAP}
                    // mapContainerStyle={{
                    //     height: "500px",
                    //     width: "100%"
                    // }}
                >
                    <Marker position={this.state.draggableMarker} draggable={true} onDragEnd={this.onDragEnd}></Marker>
                    {this.state.data && this.state.data.map(marker => (
                        <Marker
                            key={marker.address_id}
                            position={{ lat: marker.latitude, lng: marker.longitude }}
                            onMouseOver={() => this.handleMouseOver(marker)} onClick={() => this.handleClick(marker)}
                            icon={{
                                url: (marker.selected == true ) ? `/images/markers/yellow.png` : marker.type == 4 ? `/images/markers/brown.png` : (marker.type == 5) ? `/images/markers/green.png` : (marker.type == 6) ? `/images/markers/purple.png` :  `/images/markers/red.png`,
                                scaledSize: new window.google.maps.Size(40, 30),
                                anchor: { x: 10, y: 10 },
                            }}
                        />
                    ))}

                    {
                        this.state.position && <InfoWindow
                            position={this.state.position} onCloseClick={this.handleMouseExit}
                            maxWidth={420} height={300}
                        >
                            <div>
                                <h6>{(this.state.rowData.type == 4) ? 'Category A' : (this.state.rowData.type == 5) ? 'Category B' : (this.state.rowData.type == 6) ? 'Category C' : ''}</h6>
                                <p>{this.state.rowData.address_title}</p>
                                <p>{this.state.rowData.address_detail}</p>
                                <p><span><b>LatLng:</b></span>{this.state.rowData.latitude},{this.state.rowData.longitude}</p>
                            </div>

                        </InfoWindow>
                    }
                    {
                    ((!this.props.hasOwnProperty('donotShowCategoryMarker')) || (this.props.hasOwnProperty('donotShowCategoryMarker') && this.props.donotShowCategoryMarker !== true)) ?
                        <div>
                            <img src='/images/markers/yellow.png' /><label>Selected</label>&nbsp;
                            <img src='/images/markers/brown.png' /><label>Category A</label>&nbsp;
                            <img src='/images/markers/green.png' /><label>Category B</label>&nbsp;
                            <img src='/images/markers/purple.png' /><label>Category C</label>
                        </div>
                    :
                    ''
                    }
                </GoogleMap>
            </div>
            
        )
    }
}

export default compose(
    withProps((props) => {
        return {
            googleMapURL: props.googleMapURL,
            loadingElement: <div style={{ height: `100%` }} />,
            containerElement: <div style={{ height: props.height }} />,
            mapElement: <div style={{ height: `100%` }} />,
        };
    }),
    withScriptjs,
    withGoogleMap,
)(AddressMap)