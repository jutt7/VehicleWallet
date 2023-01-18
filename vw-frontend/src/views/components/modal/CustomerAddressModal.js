import React, { Component } from 'react';
import { Col, Row, Modal, Button } from 'react-bootstrap';
import { ClipLoader } from "react-spinners";
import AddressMap from "../maps/AddressMap";
import Select from 'react-select';
import helper from '@src/@core/helper';
import axios from 'axios';
import jwtDefaultConfig from "@src/@core/auth/jwt/jwtDefaultConfig"

class AddressModal extends Component {
    constructor(props) {
        
        super(props);
        this.state = {
            overlay: false,
            data: [],
            mapUrl: this.props.mapUrl,
            address_types: [],
            cities: [],
            selected_address: null,
            showProceed: false,
            form : {
                customer_id: localStorage.getItem('customerId'),
                address_title: '',
                address: '',
                latitude: '',
                longitude: '',
                type: '',
                location_id: null,
            },
            error: {
                address_title: '',
                address: '',
                latitude: '',
                longitude: '',
                type: '',
            }
        }
    }

    populateData = async() => {
        
        let data = [...this.props.data];
        let newData = [];
        let address_types = [];
        let cities = [];
        let selected_address = null;
        let k=0;
        for(let i=0; i < data.length; i ++) {
            if (data[i].options && data[i].options.length) {
                for(let j=0; j < data[i].options.length; j++) {
                    if (data[i].options[j].address_id == this.props.selected_address_id) {
                        data[i].options[j].selected = true;
                        selected_address = data[i].options[j];
                    } else {
                        data[i].options[j].selected = false;
                    }

                    newData[k++] = data[i].options[j];
                }
            }
        }

       
        for (let i=0; i < this.props.address_types.length; i++) {
            let type = {label: helper.stringToJson(this.props.address_types[i].name).en, value:this.props.address_types[i].address_type_id};
            address_types.push(type);
        }
        
        for (let i=0; i < this.props.cities.length; i++) {
            let city = {label: helper.stringToJson(this.props.cities[i].location_name).en, value:this.props.cities[i].location_id};
            cities.push(city);
        }

        await this.setState({
            data: newData,
            address_types: address_types,
            cities: cities,
            selected_address: selected_address
        })
    }

    handleMouseOver = async(item) => {
        await this.setState({
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

    onMapClick = async (data) => {
        console.log(data);

        let location_id = 0;
        if (!helper.isEmptyString(data.city)) {
            let city = data.city.toLowerCase();

            for (let i=0; i < this.props.cities; i++) {
                if (city.indexOf(this.props.cities[i].location_name) > -1) {
                    location_id = this.props.cities[i].location_id;
                    break;
                }
            }
        }

        await this.setState({
            form: {
                customer_id: localStorage.getItem('customerId'),
                address_title: this.state.form.address_title,
                address: data.address,
                latitude: data.lat,
                longitude: data.lng,
                type: this.state.form.type,
                location_id: (!helper.isEmptyString(location_id) && location_id > 0) ? location_id: this.state.form.location_id
            }
        })

        console.log("map click", this.state.form);
    }

    onAddressSelection = async (data) => {
        if (data) {
            await this.setState({
                selected_address: data
            })

            this.props.onLocationChange(data);
        }
    }

    setInput = async (event) => {
        //console.log(event.target.name);
        //console.log(event.target.value);

        await this.setState({
            form: {
                customer_id: localStorage.getItem('customerId'),
                address_title: event.target.name == 'address_title' ? event.target.value : this.state.form.address_title,
                address: event.target.name == 'address' ? event.target.value : this.state.form.address,
                latitude: event.target.name == 'latitude' ? event.target.value : this.state.form.latitude,
                longitude: event.target.name == 'longitude' ? event.target.value : this.state.form.longitude,
                type: event.target.name == 'type' ? event.target.value : this.state.form.type,
                location_id: event.target.name == 'location_id' ? event.value : this.state.form.location_id,
            }
        })

        console.log("setinput", this.state.form);
    }

    onSiteCategoryChange = async (arg) => {
        console.log(arg.value)
        await this.setState({
            form : {
                customer_id: localStorage.getItem('customerId'),
                address_title: this.state.form.address_title ? this.state.form.address_title : '',
                address: this.state.form.address ? this.state.form.address : '',
                latitude: this.state.form.latitude ? this.state.form.latitude : '',
                longitude: this.state.form.longitude ? this.state.form.longitude : '',
                type: arg.value,
                location_id: (this.state.form.location_id) ? this.state.form.location_id : null
            }
        })

        console.log("sitechange", this.state.form);
    }

    onCityChange = async (arg) => {
        console.log(arg.value)
        console.log(this.state.cities, 'cities')
        //on city change drag your pointer to cities latlng.

        await this.setState({
            form : {
                customer_id: localStorage.getItem('customerId'),
                address_title: this.state.form.address_title ? this.state.form.address_title : '',
                address: this.state.form.address ? this.state.form.address : '',
                latitude: this.state.form.latitude ? this.state.form.latitude : '',
                longitude: this.state.form.longitude ? this.state.form.longitude : '',
                type: (this.state.form.type) ? this.state.form.type : '',
                location_id: arg.value
            }
        })

        console.log("citychange", this.state.form);
    }

    initializeFormData = () => {
        return {
            type: '',
            address_title: '',
            address: '',
            latitude: '',
            longitude: ''
        }
    }

    submit = async () => {
        await this.setState({overlay: false});
        let error = {};
        let errorCount = 0;

        if (helper.isEmptyString(this.state.form.type)) {
            error.type = 'Site category is required.';
            errorCount++;
        }

        if (helper.isEmptyString(this.state.form.address_title)) {
            error.address_title = 'Site title location is required.'
            errorCount++
        }
        if (helper.isEmptyString(this.state.form.address)) {
            error.address = 'Site address detail is required.'
            errorCount++
        }

        if (helper.isEmptyString(this.state.form.latitude)) {
            error.latitude = 'Latitude is required.'
            errorCount++
        }

        if (helper.isEmptyString(this.state.form.longitude)) {
            error.longitude = 'Longitude is required.'
            errorCount++
        }

        if (errorCount > 0) {
            helper.toastNotification('Please submit required inputs.')
            await this.setState({error: error});
        } else {
            console.log(this.state.form);
            axios.post(`${jwtDefaultConfig.clientBaseUrl}/add_update_addresses`, this.state.form, {
                headers: {
                    Authorization: localStorage.getItem("customerAccessToken")
                }
            }).then((res) => {
                //console.log('response', res);
                helper.redirectToCustomerLogin( helper.isObject(res.data) ? res.data.Code : 201);
                if (res.data.Code == 200) {
                    
                    //send new list of addresses to parent control.
                    let addresses = [...res.data.data.addresses];
                    this.props.onNewAddressAdded(addresses);
                    this.onAddressSelection(addresses[0]);
                    
                    
                    //this.applyAddressCountID(addresses);

                    //onAddressSelection();// select newly added address on address input.
                    this.setState({
                        form : {
                            customer_id: localStorage.getItem('customerId'),
                            address_title: '',
                            address: '',
                            latitude: '',
                            longitude: '',
                            type: '',
                        },
                        error: {
                            address_title: '',
                            address: '',
                            latitude: '',
                            longitude: '',
                            type: '',
                        },
                        data: res.data.data.addresses,
                        overlay: false
                    })
                }
            
            }).catch(async(error) => {
                this.setState({overlay: false})
            });
        }
    }

    applyAddressCountID = (data) => {
        let categories = [...this.state.address_types];
        let addresses = [];

        for (let h=0; h < categories.length; h++) {
            let category = [];
            for (let i = 0; i < data.length; i++) {
                data[i].count_id = i + 1;
                data[i].label = `${data[i].title} (${data[i].address})`;
                data[i].value = data[i].address_id;
                data[i].selected = false;

                if (data[i].type == categories[h].value) {
                    //site A;
                    category.push(data[i]);     
                } /*else if (data[i].type == 5) {
                    data[i].value = data[i].address_id;
                
                    categoryB.push(data[i]);
                } else if (data[i].type == 6) {
                    data[i].value = data[i].address_id;
                    categoryC.push(data[i]);
                }*/
            }

            console.log(category);
            let val = {label: categories[h].label, options:category};
            addresses.push(val);
            console.log('address', addresses);
        }
        
        console.log('addresses', addresses);
        this.props.onNewAddressAdded(addresses);
        //return addresses;
    }

    render () {
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
                <Modal show={this.props.show} onShow={this.populateData} onHide={this.props.onHide} dialogClassName="modal-90-percent">
                    <Modal.Header closeButton>
                        <Modal.Title className="text-center">Choose Location</Modal.Title>
                    </Modal.Header>
                    <Modal.Body style={{height:'75vh', overflowY:'auto'}}>
                        <Row>
                            <Col lg="4">
                                <Row>
                                    <Col>
                                        <h6>Add New Address</h6>
                                    </Col>
                                </Row>
                                <br />
                                <Row>
                                    <Col>
                                        <label>Site Category <span style={{color: 'red'}}>*</span>:</label>
                                        <Select options={this.state.address_types} width='200px' name="type" onChange={(e) => this.onSiteCategoryChange(e)}></Select>
                                        <p style={{color:'red'}}>{this.state.error.type}</p>
                                    </Col>
                                    <Col>
                                        <label>Site Title <span style={{color: 'red'}}>*</span>:</label><br/>
                                        <input className='form-control' name="address_title" value={this.state.address_title}
                                            onChange={e => this.setInput(e)}/>
                                        <p style={{color:'red'}}>{this.state.error.address_title}</p>
                                    </Col>
                                </Row>
                                <br />
                                <Row>
                                    <Col>
                                        <label>City:</label>
                                        <Select options={this.state.cities} width='200px' name="location_id"  isClearable={true}
                                            onChange={(e) => this.onCityChange(e)}></Select>
                                    </Col>
                                    <Col>
                                        <label>Address Detail <span style={{color: 'red'}}>*</span>:</label><br/>
                                        <input className='form-control' name="address" value={this.state.form.address} onChange={e => this.setInput(e)}/>
                                        <p style={{color:'red'}}>{this.state.error.address}</p>
                                    </Col>
                                </Row>
                                <br />
                                <Row>
                                    <Col>
                                        <label>Latitude <span style={{color: 'red'}}>*</span>:</label><br/>
                                        <input className='form-control' name="latitude" value={this.state.form.latitude} onChange={e => this.setInput(e)}/>
                                        <p style={{color:'red'}}>{this.state.error.latitude}</p>
                                    </Col>

                                    <Col>
                                        <label>Longitude <span style={{color: 'red'}}>*</span>:</label><br/>
                                        <input className='form-control' name="longitude" value={this.state.form.longitude} onChange={e => this.setInput(e)}/>
                                        <p style={{color:'red'}}>{this.state.error.longitude}</p>
                                    </Col>
                                </Row>
                                <br />
                                <Row>
                                    <Col>
                                        <Button onClick={this.submit}>Add Address</Button>
                                    </Col>
                                </Row>
                            </Col>
                            <Col lg="8">
                                
                                <AddressMap 
                                    googleMapURL={this.state.mapUrl}
                                    data={this.state.data}
                                    onMapClick={this.onMapClick}
                                    onAddressSelection={this.onAddressSelection}
                                    height='65vh' />
                                {(this.state.selected_address) ? <Button onClick={this.props.onHide} style={{float: "right"}}>Proceed</Button> : ''}
                                
                            </Col>
                        </Row>
                       
                    </Modal.Body>
                </Modal>
            </div>
        )
    }
}
export default AddressModal