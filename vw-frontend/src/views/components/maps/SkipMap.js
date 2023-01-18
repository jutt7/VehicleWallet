import { compose, withProps } from 'recompose';
import { Col, Row, Button } from 'react-bootstrap';
import { GoogleMap, Marker, withScriptjs, withGoogleMap, InfoWindow } from 'react-google-maps';
import helper from '@src/@core/helper';
import MapPopup from '../popovers/skipsPopover';


import React from 'react'

class SkipMap extends React.PureComponent {
    constructor(props) {
        console.log("constructor", props);
        super(props);

        this.state = {
            data: [],
            mapHoverData : null
        }
    }

    // componentDidUpdate = async (prevProps, prevState) => {
    //     if (prevProps.data !== this.props.data) {
    //       await this.setData()
    //     }
    // }
    
    // setData = async()=> {
    //     await this.setState({ data: this.props.data });
    // }

    handleMouseOver = async (item) => {
        await  this.setState({
            mapHoverData: item
        });
        console.log(this.state.mapHoverData, 'mapHoverData')
    };
    
    handleMouseExit = e => {
        this.setState({
            mapHoverData: null
        });
    };
    
  render() {
    return (
       
            <GoogleMap 
                defaultZoom={8}
                defaultCenter={{ lat: 24.7241504, lng: 46.2620528 }}
                language={'en'}
                mapTypeId={google.maps.MapTypeId.ROADMAP}
            >

                {this.props.data.length &&
                    this.props.data.map((item, i) => (
                        <Marker key={i} position={{
                            lat: helper.isObject(item.address) ? item.address.latitude : 0,
                            lng: helper.isObject(item.address) ? item.address.longitude : 0,
                        }}
                        onMouseOver={() => this.handleMouseOver(item)}
                        icon= {{
                            path: "M560 160c10.38 0 17.1-9.75 15.5-19.88l-24-95.1C549.8 37 543.3 32 536 32h-98.88l25.62 128H560zM272 32H171.5L145.9 160H272V32zM404.5 32H304v128h126.1L404.5 32zM16 160h97.25l25.63-128H40C32.75 32 26.25 37 24.5 44.12l-24 95.1C-2.001 150.2 5.625 160 16 160zM560 224h-20L544 192H32l4 32H16C7.25 224 0 231.2 0 240v32C0 280.8 7.25 288 16 288h28L64 448v16C64 472.8 71.25 480 80 480h32C120.8 480 128 472.8 128 464V448h320v16c0 8.75 7.25 16 16 16h32c8.75 0 16-7.25 16-16V448l20-160H560C568.8 288 576 280.8 576 272v-32C576 231.2 568.8 224 560 224z",
                            fillColor: helper.isObject(item.current_skip_level) ? item.current_skip_level.color : '',
                            fillOpacity: 1,
                            strokeWeight: 1,
                            strokeColor: helper.isObject(item.current_skip_level) ? item.current_skip_level.color : '',
                            scale: 0.075,
                        }}
                        />
                    ))}
            
                {
                    helper.isObject(this.state.mapHoverData) ?
                     <InfoWindow
                     position={{
                        lat: helper.isObject(this.state.mapHoverData.address) ? this.state.mapHoverData.address.latitude : 0,
                        lng: helper.isObject(this.state.mapHoverData.address) ? this.state.mapHoverData.address.longitude : 0,
                    }}
                        onCloseClick={this.handleMouseExit}
                        style={{ "padding": 0, "margin": 0 }}
                    >
                        <MapPopup mapData={this.state.mapHoverData} />
                    </InfoWindow>
                    : ''
                }


                
                </GoogleMap>
    )
  }
}

export default compose(
    withProps((props) => {
        return {
            googleMapURL: "https://maps.googleapis.com/maps/api/js?v=3.exp&libraries=geometry,drawing,places&key="+props.mapKey+"&language=en}",
            loadingElement: <div style={{ height: `100%` }} />,
            containerElement: <div style={{ height: '100vh'}} />,
            mapElement: <div style={{ height: `100%` }} />,
        };
    }),
    withScriptjs,
    withGoogleMap,
)(SkipMap)
