import React, { Component } from 'react';
import { Col, Row, Modal, Tabs, Tab, Button } from 'react-bootstrap';
import { ClipLoader } from "react-spinners";
import AddressMap from "../maps/AddressMap";
import jwtDefaultConfig from "@src/@core/auth/jwt/jwtDefaultConfig"
import helper from '@src/@core/helper';
import axios from 'axios';
import { getUserData } from '@utils'

class AqgAddressModal extends Component {
    constructor(props) {
        
        super(props);
        this.state = {
            overlay: false,
            mapUrl: `https://maps.googleapis.com/maps/api/js?v=3.exp&libraries=geometry,drawing,places&key=${getUserData().map_key}&language=en`,
            title:'',
            address:'',
            latitude:'',
            longitude:'',
            titleError:'',
            addressError:''
        }
    }
    
    onMapClick = (data) => {
        this.setState({
            address:data.address,
            latitude:data.lat,
            longitude:data.lng
        })
    }

    addAddress = () =>{
        let count = 0
        if(this.state.title == ''){
            this.setState({titleError:'Enter Site title'})
            count++
        }
        if(this.state.address == ''){
            this.setState({addressError:'Select address'})
            count++
        }  

        if(count == 0){
            this.submit()
        }
        else{
            helper.toastNotification("Please submit required inputs")
        }
    }
    submit = () => {
        let obj = {
            address: this.state.address,
            address_title: this.state.title,
            latitude: this.state.latitude,
            longitude: this.state.longitude,
            location_id : 0
        }
        
        axios.post(`${jwtDefaultConfig.adminBaseUrl}/add_aqg_addresses`, obj, {
        }).then((res) => {
            helper.redirectToLogin( helper.isObject(res.data) ? res.data.Code : 201);
            if (res.data.Code == 200) {
                helper.toastNotification('Aqg address added successfully', "SUCCESS_MESSAGE")
                this.props.onHide(res.data.data.address_id,this.state.address)
            }
        }).catch((error) => {
            console.log(error,'error')
            helper.toastNotification('Unable to process request', "FAILED_MESSAGE")
        });
    }
    
    render() { 
        return (
            <div>
                <ClipLoader css={`
                    position: fixed;
                    top: 40%;
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
                    loading={this.state.overlay ? true : false}
                />
                <Modal show={this.props.show} onHide={this.props.onHide} dialogClassName="modal-60-percent">
                    <Modal.Header closeButton>
                        <Modal.Title className="text-center">Choose Location</Modal.Title>
                    </Modal.Header>
                    <Modal.Body style={{height:'480px', overflowY:'auto'}}>
                        <Row>
                            <Col lg="4">
                                <Row>
                                    <Col>
                                        <label>Site Title <span style={{color: 'red'}}>*</span>:</label><br/>
                                        <input value={this.state.title} className='form-control' name="address_title"
                                        onChange={e => this.setState({title : e.target.value,titleError:''})}/>
                                        <p style={{color:"red"}}>{this.state.titleError}</p>
                                    </Col>
                                </Row>
                                <br />
                                <Row>
                                    <Col>
                                        <label>Address Detail <span style={{color: 'red'}}>*</span>:</label><br/>
                                        <input disabled value={this.state.address} className='form-control' name="address"/>
                                        <p style={{color:"red"}}>{this.state.addressError}</p>
                                    </Col>
                                </Row>
                                <br />
                                <Row>
                                    <Col>
                                        <label>Latitude <span style={{color: 'red'}}>*</span>:</label><br/>
                                        <input disabled value={this.state.latitude} className='form-control' name="latitude"/>
                                    </Col>

                                    <Col>
                                        <label>Longitude <span style={{color: 'red'}}>*</span>:</label><br/>
                                        <input disabled value={this.state.longitude} className='form-control' name="longitude"/>
                                    </Col>
                                </Row>
                                <br />
                                <Row>
                                    <Col>
                                        <Button onClick={this.addAddress}>Add Address</Button>
                                    </Col>
                                </Row>
                            </Col>
                            <Col lg="8">
                                
                                <AddressMap 
                                    googleMapURL={this.state.mapUrl}
                                    data={''}
                                    onMapClick={this.onMapClick}
                                    onAddressSelection={''}
                                    height='400px' />
                            </Col>
                        </Row>
                       
                    </Modal.Body>
                </Modal>
            </div>
        );
    }
}
 
export default AqgAddressModal;