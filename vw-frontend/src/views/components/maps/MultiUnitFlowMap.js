import React from 'react';
import {compose, withProps} from 'recompose';
import { GoogleMap, Marker, withScriptjs, withGoogleMap, InfoWindow } from 'react-google-maps';

class MultiUnitFlowMap extends React.PureComponent {
    constructor(props) {
        super(props);

        this.state = {
            data: [],//this.props.data,
            position : null,
            rowData: null
        }
    }

	componentDidMount() {
        this.setState({ data: this.props.data });
	}

    componentDidUpdate(prevProps, prevState) {
       
    }

    handleToggleOpen(item){
		this.setState({
			position : {
				lat : item.current_latitude,
				lng : item.current_longitude
			},
            rowData: item			
		})
	}

    handleMouseOver(item) {
        this.setState({
            position: {
                lat: item.current_latitude,
                lng: item.current_longitude
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

    render() {
        return(
            <GoogleMap 
                defaultZoom={8}
                defaultCenter={{ lat: 24.7241504, lng: 46.2620528 }}
                language='en'
                mapTypeId={google.maps.MapTypeId.ROADMAP}
            >
            
			{this.state.data.map(marker => (
				  <Marker
					key={marker.count_id}
					position={{ lat: marker.current_latitude, lng: marker.current_longitude }}
                    onMouseOver={() => this.handleMouseOver(marker)}
                    icon={{
                        url: `/images/markers/car.png`,
                        scaledSize: new window.google.maps.Size(24, 24),
                        anchor: { x: 10, y: 10 },
                    }}
				/>
            ))}
                

            {
                this.state.position && <InfoWindow
                    position={this.state.position} onCloseClick={this.handleMouseExit}
                    maxWidth={420} height={300} style={{"padding":0, "margin":0}}
                    >
                        <div>
                            <p style={{margin: '1px 7px'}}>{ this.state.rowData.vehicle_plate_number }</p>
                        </div>
                
                </InfoWindow>
            }
			
			
            </GoogleMap>
        )
    }
}

export default compose(
    withProps((props) => {
        return {
            googleMapURL: props.googleMapURL,
            loadingElement: <div style={{ height: `100%` }} />,
            containerElement: <div style={{ height: props.height, width:props.width }} />,
            mapElement: <div style={{ height: `100%` }} />,
        };
    }),
    withScriptjs,
    withGoogleMap,
)(MultiUnitFlowMap)