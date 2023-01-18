import React from 'react';
import { GoogleMap, Marker, InfoWindow, withGoogleMap, withScriptjs, DirectionsRenderer } from "react-google-maps";
import { withProps, compose, lifecycle } from "recompose";
import helper from '@src/@core/helper';
import MapPopup from "../../pages/fleet-management/Components/Tracking/popover";
import jwtDefaultConfig from "@src/@core/auth/jwt/jwtDefaultConfig"
import { getUserData } from '@utils'


const MapWithADirectionsRenderer = compose(
  withProps({
    googleMapURL:
      `https://maps.googleapis.com/maps/api/js?key=${getUserData().map_key}&v=3.exp&libraries=geometry,drawing,places`,
    loadingElement: <div style={{ height: `100%` }} />,
    containerElement: <div style={{ height: `80vh` }} />,
    mapElement: <div style={{ height: `100%` }} />
  }),
  withScriptjs,
  withGoogleMap,
  lifecycle({
    componentDidMount() {
      // this.setState({
      //   DirectionsService: new google.maps.DirectionsService()
      // })
    },
    componentDidUpdate(prevProps) {
      if (this.props.showMapRoutesStatus && this.props.mapData.length) {
        const DirectionsService = new google.maps.DirectionsService()
        let directions = []
        for (let i = 0; i < this.props.mapData.length; i++) {

          if (this.props.mapData[i].trackingdata && helper.isObject(this.props.mapData[i].trackingdata)) {
            var waypts = [];
            DirectionsService.route(
              {
                origin: { lat: this.props.mapData[i].trackingdata[0].Latitude, lng: this.props.mapData[i].trackingdata[0].Longitude },  // Haight.
                destination: { lat: this.props.mapData[i].trackingdata[this.props.mapData[i].trackingdata.length - 1].Latitude, lng: this.props.mapData[i].trackingdata[this.props.mapData[i].trackingdata.length - 1].Longitude },  // Domlur.
                travelMode: google.maps.TravelMode.DRIVING,
                waypoints: waypts,
                optimizeWaypoints: true
              },
              async (result, status) => {
                if (i == this.props.mapData.length - 1) {
                  await this.props.changeGenerateMapRoute(false)
                }

                if (status === google.maps.DirectionsStatus.OK) {
                  directions.push(result)
                  await this.setState({
                    directions: directions
                  });
                } else {
                  console.error(`error fetching directions ${result}`);
                }
              }
            );
          }

        }
      }

    }
  })
)(props => (
  <GoogleMap
    defaultZoom={10}
    mapData={props.mapData}
    showMapRoutesStatus={props.showMapRoutesStatus}
    changeGenerateMapRoute={props.changeGenerateMapRoute}
    defaultCenter={new google.maps.LatLng(33.6844, 73.0479)}
    handleMapMouseOver={() => props.handleMapMouseOver}
    handleMapMouseExit={() => props.handleMapMouseExit}
    mapHover={props.mapHover}
  >

    {helper.isObject(props.directions) && props.mapData.length &&
      props.directions.map((direction, i) => (
        <DirectionsRenderer
          key={i}
          mapData={props.mapData}
          changeGenerateMapRoute={props.changeGenerateMapRoute}
          showMapRoutesStatus={props.showMapRoutesStatus}
          directions={direction}
          progress={props.progress}
          options={{ suppressMarkers: true }}
        />
      ))}


    {/* Vehicle play icon - start */}
    {props.mapData.length ? <Marker
      position={props.progress}
      zIndex={100}
      icon={{
        url: props.icon != null ? jwtDefaultConfig.BASE_IMAGE_URL + props.icon : `/images/markers/car.png`,
        scaledSize: new window.google.maps.Size(24, 24),
        anchor: { x: 10, y: 10 },
      }}

    /> : ''}
    {/* Vehicle play icon - end */}

    {/* Origin icon - start */}
    {props.mapData &&
      props.mapData.map((direction, i) => (
        direction.trackingdata.length ?
          <Marker key={i} position={{
            lat: direction.trackingdata[0].Latitude,
            lng: direction.trackingdata[0].Longitude
          }}
            icon={{ url: `/images/markers/start_point.png` }}
            onMouseOver={() => props.handleMapMouseOver(direction.trackingdata[0], direction.vehicleplate)}
          /> : ''
      ))}
    {/* Origin icon - end */}


    {/* Destination icon - start */}
    {props.mapData &&
      props.mapData.map((direction, i) => (
        direction.trackingdata.length ?
          <Marker key={i} position={{
            lat: direction.trackingdata[direction.trackingdata.length - 1].Latitude,
            lng: direction.trackingdata[direction.trackingdata.length - 1].Longitude
          }}
            icon={{ path: `/images/markers/destination.png`} }
            onMouseOver={() => props.handleMapMouseOver(direction.trackingdata[direction.trackingdata.length - 1], direction.vehicleplate)}

          /> : ''
      ))}
    {/* Destination icon - end */}

    {/* Waypoints icon - start */}
    {helper.isArray(props.mapData) && props.mapData.map((item, index) => (
      item.trackingdata.map((distance, i) => (
        (i !== item.trackingdata.length - 1 && i !== 0) ?
          <Marker
            key={index + i}
            position={{ lat: distance.Latitude, lng: distance.Longitude }}
            icon={{
              url: `/images/markers/waypoints_1_8x8.png`,
              scaledSize: new window.google.maps.Size(5, 5),
            }}
            onMouseOver={() => props.handleMapMouseOver(distance, item.vehicleplate)}
          />
          : ''
      )

      )))}

    {
      helper.isObject(props.mapHover.data) ?
        <InfoWindow
          position={{ lat: props.mapHover.lat, lng: props.mapHover.lng }}
          onCloseClick={props.handleMapMouseExit}
          style={{ "padding": 0, "margin": 0 }}
        >
          <MapPopup mapData={props.mapHover} />
        </InfoWindow>
        : ''
    }
    {/* Waypoints icon - end */}

  </GoogleMap>
))
class TrackingMap extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      mapData: [],
      data: [],
      progress: [],
      progress_history: [],
      moveForwordIndex: 0,
      moveBackwordIndex: 0,
      initialDate: '',
      newDate: '',
      incrementTime: 0, //seconds
      fast_forword_distance: 0,
      mapHover: { data: {}, vehicle: '', lat: 0, lng: 0 },
      index: 0,
    }
  }

  velocity = 100
  showTrack = false

  componentDidMount() {
    this.interval = window.setInterval(this.playVehicle, 1000)
  }

  componentWillUnmount = () => {
    window.clearInterval(this.interval)
  }

  handleMapMouseOver = async (direction, vehicle) => {
    if (helper.isObject(direction) && !helper.isEmptyString(vehicle)) {
      await this.setState({ mapHover: { data: direction, vehicle: vehicle, lat: direction.Latitude, lng: direction.Longitude } })
    }
  }

  handleMapMouseExit = async () => {
    await this.setState({ mapHover: { data: {}, vehicle: '', lat: 0, lng: 0 } })
  }

  setIncrementTime = async (increment) => {
    await this.setState({ incrementTime: this.state.incrementTime + increment })
  }

  setNewProgress = async (new_progress) => {
    await this.setState({ progress: new_progress, index: this.state.index + this.setSpeed() })
    //console.log(this.state.progress, 'progress')
  }

  setSpeed = () => {
    if (this.props.speed == "100") return 1
    else if (this.props.speed == "200") return 2
    else if (this.props.speed == "300") return 3
    else if (this.props.speed == "400") return 4
    else return 5
  }

  playVehicle = async () => {
    if (!this.props.play) {
      return
    }
    /* Check PLAY button is on - end */

    /* Check PAUSE button is on - start */
    if (this.props.pause) {
      return
    }

    if (this.props.forword) {
      await this.setState({ index: this.state.index + 2 })
      this.props.onForword()
    } else if (this.props.backword) {
      await this.setState({ index: this.state.index - 2 < 0 ? 0 : this.state.index - 2 })
      this.props.onBackword()
    }
    if (this.state.index < this.state.data.length) {
      //console.log(this.state.data,'state data testimg')
      this.setNewProgress({ lat: this.state.data[this.state.index].lat, lng: this.state.data[this.state.index].lng })
    }
  }

  moveObject = async () => {
    let progress_history = []
    let progress = []
    let distance = 0

    /* Check PLAY button is on - start */
    if (!this.props.play) {
      return
    }
    /* Check PLAY button is on - end */


    /* Check PAUSE button is on - start */
    if (this.props.pause) {
      await this.setState({ newDate: new Date() })
      return
    }

    let date = new Date(this.state.newDate);
    date = date.setSeconds(date.getSeconds() + 1)
    await this.setState({ newDate: new Date(date) })

    /* Check PAUSE button is on - end */

    distance = this.getDistance()
    // console.log(distance,'distance')
    if (this.props.forword) {
      const nextLine = this.state.data.find(coordinates => coordinates.distance > distance)
      if (helper.isObject(nextLine)) {
        distance = nextLine.distance
        this.setIncrementTime(10)
        //console.log(this.state.incrementTime, 'increment time')
      }
      this.props.onForword()
    } else if (this.props.backword) {
      const nextLine = this.state.data.find(coordinates => coordinates.distance < distance)
      if (helper.isObject(nextLine)) {
        distance = nextLine.distance
        this.setIncrementTime(-10)
        //console.log(this.state.incrementTime, 'decrement time')
      }
      this.props.onBackword()
    }


    // console.log(this.state.covered_distance, 'covered_distance')
    //console.log(distance, 'distance')
    if (!distance) {
      return
    }


    progress = this.state.data.filter(coordinates => coordinates.distance < distance)
    //console.log(progress, 'progress')
    const nextLine = this.state.data.find(coordinates => coordinates.distance > distance)
    //console.log(nextLine, 'nextLine')
    if (!nextLine) {
      this.setNewProgress(progress[progress.length - 1])
      return // it's the end!
    }

    if (progress.length && helper.isObject(nextLine)) {
      /* Moving car orientation - start */
      let point1, point2

      if (nextLine) {
        point1 = progress[progress.length - 1]
        point2 = nextLine
      } else {
        // it's the end, so use the latest 2
        point1 = progress[progress.length - 2]
        point2 = progress[progress.length - 1]
      }

      const point1LatLng = new window.google.maps.LatLng(point1.lat, point1.lng)
      const point2LatLng = new window.google.maps.LatLng(point2.lat, point2.lng)

      const angle = window.google.maps.geometry.spherical.computeHeading(point1LatLng, point2LatLng)
      const actualAngle = angle - 90

      const markerUrl = this.props.icon != null ? jwtDefaultConfig.BASE_IMAGE_URL + this.props.icon : `/images/markers/car.png`
      const marker = document.querySelector(`[src="${markerUrl}"]`)

      if (marker) { // when it hasn't loaded, it's null
        marker.style.transform = `rotate(${actualAngle}deg)`
      }
      /* Moving car orientation - end */

      const lastLine = progress[progress.length - 1]

      const lastLineLatLng = new window.google.maps.LatLng(
        lastLine.lat,
        lastLine.lng
      )

      const nextLineLatLng = new window.google.maps.LatLng(
        nextLine.lat,
        nextLine.lng
      )
      const totalDistance = nextLine.distance - lastLine.distance
      const percentage = (distance - lastLine.distance) / totalDistance

      const position = window.google.maps.geometry.spherical.interpolate(
        lastLineLatLng,
        nextLineLatLng,
        percentage
      )
      progress = progress.concat(position)
      this.setNewProgress(progress[progress.length - 1])
    }

  }

  componentDidUpdate = async (prevProps, prevState) => {
    if (this.props.generateTrackStatus) {
      this.props.changeGenerateTrack(false)
      await this.setState({ mapData: this.props.data })
    }
    if (prevProps.playindex !== this.props.playindex) {
      await this.setPaths(this.props.data[this.props.playindex], this.props.playTrackIndex)
    }
  }

  setPaths = async (data, plate_num) => {
    // console.log(plate_num, 'plate_num')
    // console.log(data,'data')
    let path = []
    let distance = 0
    //let track = data.find(x => x.vehicleplate === plate_num)
    //console.log(track,'track')
    if (this.props.playindex != -1) {
      data.trackingdata.map((coordinates, i, array) => {
        if (i === 0) {
          distance = 0;
          // path.push({ lat: coordinates.Latitude, lng: coordinates.Longitude, distance: distance })

        } else {
          const latLong1 = new window.google.maps.LatLng(coordinates.Latitude, coordinates.Longitude)

          const latLong2 = new window.google.maps.LatLng(array[0].Latitude, array[0].Longitude)

          // // in meters:
          distance = window.google.maps.geometry.spherical.computeDistanceBetween(
            latLong1,
            latLong2
          )
        }
        // if (path[path.length - 1].distance == 0 || distance > path[path.length - 1].distance) {
        //   path.push({ lat: coordinates.Latitude, lng: coordinates.Longitude, distance: distance })
        // }
        path.push({ lat: coordinates.Latitude, lng: coordinates.Longitude, distance: distance })

      })
    }

    let initial_date = new Date()
    //let newDate = 
    //console.log(path,'path')
    await this.setState({
      data: path,
      initialDate: initial_date,
      newDate: initial_date,
      progress: path[0],
      incrementTime: 0,
      index: 0,
    })
    // console.log(this.state, 'state')
  }


  getDistance = () => {
    // seconds between when the component loaded and now

    const differentInTime = (helper.addSecondsInDate(this.state.newDate, this.state.incrementTime) - this.state.initialDate) / 1000 // pass to seconds
    const getDistance = differentInTime * this.props.speed // d = v*t --  
    //console.log(differentInTime, 'getDistance')
    return getDistance < 0 ? 0 : getDistance
  }

  render() {
    return (
      <React.Fragment>
        <MapWithADirectionsRenderer mapData={this.state.mapData}
          showMapRoutesStatus={this.props.showMapRoutesStatus}
          changeGenerateMapRoute={(e) => this.props.changeGenerateMapRoute(false)}
          progress={this.state.progress}
          mapHover={this.state.mapHover}
          handleMapMouseOver={this.handleMapMouseOver}
          handleMapMouseExit={this.handleMapMouseExit}
          icon={this.props.icon}
          playindex={this.props.playindex}
        />
      </React.Fragment>
    );
  }
}

export default TrackingMap;