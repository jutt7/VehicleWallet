import React, { Component } from 'react';
import { Col, Row, Modal, Button } from 'react-bootstrap';
import jwtDefaultConfig from "@src/@core/auth/jwt/jwtDefaultConfig"
import helper from '@src/@core/helper';
import axios from 'axios';
import Select from 'react-select'
import Mobilization from '../project-planning/Mobilization'
import TypesOfMaterialToBeCollected from '../project-planning/TypesOfMaterialToBeCollected'
import ManPower from '../project-planning/ManPower'
import { ClipLoader } from "react-spinners";
import * as MdIcons from 'react-icons/md';
import AqgAddressModal from '../../components/modal/AqgAddressModal';
import { getUserData } from '@utils'

export default class EstimationModal extends Component {
    constructor(props) {

        super(props);
        this.state = {
            overlay: false,
            mapUrl: `https://maps.googleapis.com/maps/api/js?v=3.exp&libraries=geometry,drawing,places&key=${getUserData().map_key}&language=en`,
            form: {
                customer_name: '',
                estimated_weight: '',
                customer_comments: '',
                no_of_trucks: '',
                pick_up_site_location: '',
                drop_of_site_location: '',
                contract_work_permit: '',
                start_date: '',
                end_date: '',
                pick_latLong: '',
                drop_latLong: ''
            },
            error: {
                customer_name: '',
                estimated_weight: '',
                no_of_trucks: '',
                pick_up_site_location: '',
                drop_of_site_location: '',
                contract_work_permit: '',
                start_date: '',
                end_date: '',
                materials: '',
                equipments: '',
                labours: '',
            },
            rawData: [],
            order_detail: [],
            material_types: [],
            equipments: [],
            labours: [],
            selected_ManPower: [],
            mobilization: [],
            selected_materails: [],
            showLocationModal: false,
            selectAddress: { value: '', label: '' },
            aqg_loc: { value: '', label: '' },
            addresses: ''
        }
    }

    componentDidUpdate() {
        console.log(this.props.rawData, 'rawdata--')
    }

    onChangeMobilization = async(array, type) => {
        if (type === "add") {
            let aray = [...this.state.mobilization]
            aray.push({ category: "", sub_category: "", qty: "", remarks: "", date_requested: helper.isObject(this.state.form) && this.state.form.start_date ? this.state.form.start_date : '', days: "", client_approval: 0, gov_approval: 0, })
             this.setState({
                mobilization: aray
            })
        }
        else if (type === "remove") this.setState({ mobilization: array })
        else this.setState({ mobilization: array })
    }
    onChangeMaterial = (array, type) => {
        if (type === "addRemarks") this.setState({ selected_materails: array });
        else if (type === "remove") this.setState({ selected_materails: array });
        else {
            let aray = this.state.selected_materails
            aray.push(array)
            this.setState({ selected_materails: aray })
        }
        console.log(this.state.selected_materails, 'selected_materails')
    }
    onChangeUser = (array, type) => {
        if (type === "remove") this.setState({ selected_ManPower: array });
        else {
            let aray = this.state.selected_ManPower
            aray.push(array)
            this.setState({ selected_ManPower: aray })
        }
    }
    populateData = async () => {
        await this.setState({
            selected_ManPower: [],
            mobilization: [],
            selected_materails: [],
            error: this.initializeEmptyError,
            form: this.initializeFormData,
            overlay: true,
        })
        console.log(this.props, 'test prop')
        await this.getRawData()
        console.log(this.props.updateModalData, 'test data')
        if (helper.isObject(this.props.updateModalData)) {
            axios.post(`${jwtDefaultConfig.adminBaseUrl}/supervisor_order_detail`, {
                order_id: this.props.updateModalData.order_id
            }, {
            }).then(async (res) => {
                helper.redirectToLogin(helper.isObject(res.data) ? res.data.code : 201)
                if (res.status && res.status === 200) {
                    const detail = res.data.data.order_detail
                    console.log(detail, 'deatil')

                    await this.setState({
                        selected_materails: this.populateSelectedMaterial(detail),
                        selected_ManPower: this.populateSelectedManPower(detail),
                        mobilization:this.populateSelectedMobilization(detail),
                        form: {
                            estimated_weight: helper.isEmptyString(detail.net_weight) ? '' : detail.net_weight,
                            no_of_trucks: helper.isEmptyString(detail.required_vehicles) ? '' : detail.required_vehicles,
                            pick_up_site_location: helper.isObject(detail.pickup) && !helper.isEmptyString(detail.pickup.address_title) ? detail.pickup.address_title : '',
                            drop_of_site_location: helper.isObject(detail.aqg) && !helper.isEmptyString(detail.aqg.address_title) ? detail.aqg.address_title : helper.isObject(detail.customer_warehouse) && detail.customer_warehouse.address_title ? detail.customer_warehouse.address_title : '',
                            contract_work_permit: detail.contract_work_permit,
                            start_date: helper.removeTimeFromDate(detail.required_start_date),
                            end_date: helper.removeTimeFromDate(detail.estimated_end_date),
                            customer_comments: helper.isEmptyString(detail.comments) ? '' : detail.comments,
                            pick_latLong: helper.isObject(detail.pickup) && detail.pickup.map_info ? helper.stringToJson(detail.pickup.map_info) : '',
                            drop_latLong: helper.isObject(detail.aqg) && detail.aqg.map_info ? helper.stringToJson(detail.aqg.map_info) : helper.isObject(detail.customer_warehouse) && detail.customer_warehouse.map_info ? helper.stringToJson(detail.customer_warehouse.map_info) : '',
                            pick_up_site_location_id: helper.isObject(detail.pickup) && detail.pickup.address_id ? detail.pickup.address_id : '',
                            drop_of_site_location_id: helper.isObject(detail.aqg) && detail.aqg.address_id ? detail.aqg.address_id : helper.isObject(detail.customer_warehouse) && detail.customer_warehouse.address_id ? detail.customer_warehouse.address_id : '',
                        },
                        min_start_date: this.setMinStartDate(detail),
                        overlay: false,
                    })
                    console.log(this.state.form, 'changed')

                } else {
                    await this.setState({ overlay: false })
                    helper.toastNotification('Unable to fetch estimation information.', "FAILED_MESSAGE");
                }
            })
                .catch(async (error) => {
                    console.log(error, 'error')
                    await this.setState({ overlay: false })
                    helper.toastNotification('Unable to get data.', "FAILED_MESSAGE");
                });
        }
    }

    setMinStartDate = (order) => {
        let maxDays = null;
        let min_start_date = ''

        
        if (helper.isObject(order)) {
            
            if (helper.isObject(order.pickup)) {
                if (order.pickup.type == 5) {
                    maxDays = 7;
                } else if (order.pickup.type == 6) {
                    maxDays = 14;
                } else {
                    maxDays = null;
                }

                //console.log(maxDays, 'order placed at');
                //console.log(new Date(order.created_at).getDate() + maxDays, 'order placed at');
                min_start_date = (maxDays) ? new Date(new Date().setDate(new Date(order.created_at).getDate() + maxDays)).toISOString().split('T')[0] : new Date(order.created_at).toISOString().split('T')[0];
            } else {
                min_start_date = (maxDays) ? new Date(new Date().setDate(new Date(order.created_at).getDate() + maxDays)).toISOString().split('T')[0] : new Date(order.created_at).toISOString().split('T')[0];
            }
        } else {
           min_start_date = (maxDays) ? new Date(new Date().setDate(new Date().getDate() + maxDays)).toISOString().split('T')[0] : new Date().toISOString().split('T')[0];
        }
        

        return min_start_date;
    }

    getRawData = async () => {

        axios.get(`${jwtDefaultConfig.adminBaseUrl}/raw_data_supervisor`, {
        }).then(async (res) => {
            helper.redirectToLogin(helper.isObject(res.data) ? res.data.code : 201)
            if (res.status && res.status === 200) {
                if (helper.isObject(res.data.data.aqg_warehouses)) {
                    let array = []
                    for (let i = 0; i < res.data.data.aqg_warehouses.length; i++) {
                        array.push({ value: res.data.data.aqg_warehouses[i].id, label: res.data.data.aqg_warehouses[i].address })
                    }
                    await this.setState({
                        //rawData: res.data.data,
                        selectAddress: array
                    })
                }
            } else {
                helper.toastNotification('Unable to fetch data.', "FAILED_MESSAGE");
            }
        })
            .catch((error) => {
                console.log(error, 'error')
                helper.toastNotification('Unable to get data.', "FAILED_MESSAGE");
            });
    }

    populateSelectedMobilization = (data) => {
        if (data.mobilization && data.mobilization.length) {
            let array = [];
            for (let i = 0; i < data.mobilization.length; i++) {
              array.push({
                  category: helper.isObject(data.mobilization[i].service_category) && helper.isObject(data.mobilization[i].service_category.parent) ? 
                    {
                    label: helper.stringToJson(data.mobilization[i].service_category.parent.title).en,
                    value: data.mobilization[i].service_category.parent.service_category_id   
                    } : {},
                sub_category: helper.isObject(data.mobilization[i].service_category) ?
                    {
                    label: helper.stringToJson(data.mobilization[i].service_category.title).en,
                    value: data.mobilization[i].service_category.service_category_id
                    } : {}, 
                qty: data.mobilization[i].quantity,
                remarks: data.mobilization[i].remarks,
                date_requested: helper.removeTimeFromDate(data.mobilization[i].start_date),
                days: data.mobilization[i].days_count,
                client_approval: data.mobilization[i].is_client_approval_required,
                gov_approval: data.mobilization[i].is_govt_approval_required,
              })
            }
            return (array)
          }
          else{
              return []
          }
    }

    populateSelectedMaterial = (data) => {
     console.log(data.types_of_material_to_be_collected ,'data.types_of_material_to_be_collected ')
        let array = [];
        if (data.types_of_material_to_be_collected && data.types_of_material_to_be_collected.length) {
            for (let i = 0; i < data.types_of_material_to_be_collected.length; i++) {
                array.push({
                    value: data.types_of_material_to_be_collected[i].value,
                    label: helper.stringToJson(data.types_of_material_to_be_collected[i].label).en,
                    remarks: data.types_of_material_to_be_collected[i].remarks,
                    weight: data.types_of_material_to_be_collected[i].weight,
                    unit: data.types_of_material_to_be_collected[i].unit_id
                })
            }
        }
        return array

    }

    populateSelectedManPower = (data) => {
        let array = [];
        if (data.man_power && data.man_power.length) {
            console.log(data.man_power, 'manpower')
            for (let i = 0; i < data.man_power.length; i++) {
                array.push({
                    value: data.man_power[i].value,
                    label: helper.stringToJson(data.man_power[i].label).en,
                    name: data.man_power[i].name,
                    nationality: data.man_power[i].nationality
                })
            }
        }
        return array
    }

    initializeEmptyError = () => {
        return {
            customer_name: '',
            estimated_weight: '',
            no_of_trucks: '',
            pick_up_site_location: '',
            drop_of_site_location: '',
            contract_work_permit: '',
            start_date: '',
            end_date: '',
        }
    }

    initializeFormData = () => {
        return {
            customer_name: '',
            estimated_weight: '',
            no_of_trucks: '',
            pick_up_site_location: '',
            drop_of_site_location: '',
            contract_work_permit: '',
            start_date: '',
            end_date: '',
        }
    }

    submit = async () => {
        await this.setState({ overlay: true })

        let error = {}
        let errorCount = 0
        if (helper.isEmptyString(this.state.form.estimated_weight)) {
            error.estimated_weight = 'Estimated weight is required.'
            errorCount++
        }
        // if (helper.isEmptyString(this.state.form.pick_up_site_location)) {
        //     error.pick_up_site_location = 'Pickup site location is required.'
        //     errorCount++
        // }
        console.log(this.state.form.drop_of_site_location, 'this.state.form.drop_of_site_location')
        console.log(this.state.aqg_loc.value, 'this.state.aqg_loc.value')
        if (helper.isEmptyString(this.state.form.drop_of_site_location) && helper.isEmptyString(this.state.aqg_loc.value)) {
            error.drop_of_site_location = 'Drop-off site location is required.'
            errorCount++
        }
        if (helper.isEmptyString(this.state.form.start_date)) {
            error.start_date = 'Required start date is required.'
            errorCount++
        }
        if (helper.isEmptyString(this.state.form.end_date)) {
            error.end_date = 'Required end date is required.'
            errorCount++
        }
        if (helper.isEmptyString(this.state.form.contract_work_permit)) {
            error.contract_work_permit = 'Contract work permit is required.'
            errorCount++
        }
        if (helper.isEmptyString(this.state.form.no_of_trucks)) {
            error.no_of_trucks = 'No. of trucks is required.'
            errorCount++
        }
        if (!this.state.selected_materails.length) {
            error.material_types = 'Materials are required.'
            errorCount++
        }
        if (!this.state.mobilization.length) {
            error.equipments = 'Equipments are required.'
            errorCount++
        }
        if (!this.state.selected_ManPower.length) {
            error.labours = 'Labours are required.'
            errorCount++
        }
        console.log(errorCount,'error')
        if (errorCount !== 0) {
            helper.toastNotification('Please submit required inputs.')
            await this.setState({ error: error })
        } else {
            const req = this.makeSubmitRequest()
          // console.log(req, 'req--')
            this.props.submit(req)
        }

        this.setState({ overlay: false })

    }

    makeSubmitRequest = () => {
        // console.log(this.state.form, 'form')
        // console.log(this.state.selected_materails, 'selected_materails')
        // console.log(this.state.mobilization, 'mobilization')
        return {
            user_id: this.props.updateModalData.customer_id,
            order_id: this.props.updateModalData.order_id,
            estimated_weight: this.state.form.estimated_weight,
            pickup_site_location: this.state.form.pick_up_site_location_id,
            dropoff_site_location: this.state.form.drop_of_site_location_id,
            no_of_vehicles: this.state.form.no_of_trucks,
            contract_work_permit: this.state.form.contract_work_permit,
            material_types: this.state.selected_materails,
            equipment: this.setEquipmentObject(this.state.mobilization),
            labor: this.setLabourObject(this.state.selected_ManPower),
            required_start_date: this.state.form.start_date,
            estimated_end_date: this.state.form.end_date,
            aqg_loc_id: this.state.aqg_loc.value
        }

    }

    setEquipmentObject = (data) => {
        let materials = []
        for (let i = 0; i < data.length; i++) {
            materials.push({
                quantity: data[i].qty,
                remarks: data[i].remarks,
                service_category_id: helper.isObject(data[i].sub_category) ? data[i].sub_category.value : '',
                capacity: 0,
                start_date: data[i].date_requested,
                days_count: data[i].days,
                is_client_approval_required: data[i].client_approval,
                is_govt_approval_required: data[i].gov_approval
            })
        }
        return materials
    }

    setLabourObject = (data) => {
        let labours = []
        for (let i = 0; i < data.length; i++) {
            labours.push({
                service_category_id: data[i].value,
            })
        }
        return labours
    }

    setMaterialTypes = (data) => {
        let materials = []
        for (let i = 0; i < data.length; i++) {
            materials.push({ value: data[i].material_id, label: helper.stringToJson(data[i].name).en })
        }
        this.setState({
            material_types: materials
        })
    }

    setInput = (event) => {
        console.log(event.target.name, 'target')
        console.log(event.target.value, 'value')
        this.setState({
            form: {
                customer_name: helper.isObject(this.props.updateModalData) && helper.isObject(this.props.updateModalData.customer) ? this.props.updateModalData.customer.name : '',
                estimated_weight: event.target.name == 'estimated_weight' ? helper.cleanDecimal(event.target.value) : this.state.form.estimated_weight,
                no_of_trucks: event.target.name == 'no_of_trucks' ? helper.cleanInteger(event.target.value) : this.state.form.no_of_trucks,
                pick_up_site_location: event.target.name == 'pick_up_site_location' ? event.target.value : this.state.form.pick_up_site_location,
                drop_of_site_location: event.target.name == 'drop_of_site_location' ? event.target.value : this.state.form.drop_of_site_location,
                contract_work_permit: event.target.name == 'contract_work_permit' ? event.target.value : this.state.form.contract_work_permit,
                start_date: event.target.name == 'start_date' ? event.target.value : this.state.form.start_date,
                end_date: event.target.name == 'end_date' ? event.target.value : this.state.form.end_date,
            }
        })
    }

    onOpenLocationModal = () => {
        this.setState({
            showLocationModal: true,
        });
    }

    onCloseLocationModal = (id,address) => {
        this.setState({
            showLocationModal: false,
            form:{
                customer_name: this.state.form.customer_name,
                estimated_weight: this.state.form.estimated_weight,
                no_of_trucks: this.state.form.no_of_trucks,
                pick_up_site_location: this.state.form.pick_up_site_location,
                drop_of_site_location: address,
                contract_work_permit: this.state.form.contract_work_permit,
                start_date: this.state.form.start_date,
                end_date: this.state.form.end_date,
            },
            aqg_loc: {value:id}
        });
        this.getRawData()
    }

    onNewAddressAdded = async (addresses) => {
        await this.setState({
            addresses: addresses
        });
    }

    onPickUpLocationChange = async (arg) => {
        console.log(args, 'args map testing')
    }

    onAddressChange = async(e) => {
        await this.setState({ aqg_loc: e })
    }

    disablePastDate = (value) => {
        let today = new Date();
        if (this.state.form.start_date != '' && value == 'end') {
            today = new Date(this.state.form.start_date);
        }
        const dd = String(today.getDate()).padStart(2, "0");
        const mm = String(today.getMonth() + 1).padStart(2, "0");
        const yyyy = today.getFullYear();
        return yyyy + "-" + mm + "-" + dd;
    }

    render() {
        return (
            <div>
                <ClipLoader
                    css={`
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
                <Modal show={this.props.show} onHide={this.props.onHide} onShow={this.populateData} dialogClassName="modal-90-percent">
                    <Modal.Header closeButton>
                        <Modal.Title className="text-center">Cost Estimation &#38; Timeline</Modal.Title>
                    </Modal.Header>
                    <Modal.Body style={{ height: '75vh', overflowY: 'auto' }}>
                        <Row>
                            <Col lg="4">
                                <Row>
                                    <Col>
                                        <label>Customer Name :</label><br />
                                        <input value={helper.isObject(this.props.updateModalData) && helper.isObject(this.props.updateModalData.customer) ? this.props.updateModalData.customer.name : ''} className='form-control' disabled />
                                    </Col>
                                </Row>

                                <Row style={{ marginTop: '10px' }}>
                                    <Col>
                                        <label>Pickup Site Location <span style={{ color: 'red' }}>*</span> :</label><br />
                                        <div className='input-group'>
                                            <input className='form-control' name="pick_up_site_location" value={this.state.form.pick_up_site_location || ''} onChange={e => this.setInput(e)} disabled />
                                            <div className="input-group-append">
                                                <a className="input-group-text" target='blank' href={helper.isObject(this.state.form.pick_latLong) ? `https://www.google.com/maps/search/?api=1&query=${this.state.form.pick_latLong.latitude},${this.state.form.pick_latLong.longitude}` : "#"}><span style={{ cursor: 'pointer' }}><i className="fas fa-map-marker-alt"></i></span></a>
                                            </div>
                                        </div>
                                        <p style={{ color: 'red' }}>{this.state.error.pick_up_site_location}</p>

                                    </Col>
                                </Row>

                                <Row style={{ marginTop: '10px' }}>
                                    <Col>
                                        <label>Drop-off Site Location <span style={{ color: 'red' }}>*</span> :</label><br />
                                        <div className='input-group'>
                                            <input className='form-control' name="drop_of_site_location" value={this.state.form.drop_of_site_location || ''} onChange={e => this.setInput(e)} disabled />
                                            <div className="input-group-append">
                                                <a className="input-group-text" target='blank' href={helper.isObject(this.state.form.drop_latLong) ? `https://www.google.com/maps/search/?api=1&query=${this.state.form.drop_latLong.latitude},${this.state.form.drop_latLong.longitude}` : "#"}><span style={{ cursor: 'pointer' }}><i className="fas fa-map-marker-alt"></i></span></a>
                                            </div>
                                        </div>
                                    </Col>
                                </Row>
                                {!this.state.form.drop_of_site_location ?
                                    <Row style={{ marginTop: '10px' }}>
                                        <Col>
                                            <label>Select Drop-off location <span style={{ color: 'red' }}>*</span> :</label><br />
                                            <div className="input-group">
                                                <div style={{ width: '245px' }}>
                                                    <Select onChange={(e) => this.onAddressChange(e)} options={helper.isArray(this.props.selectAddress)?this.props.selectAddress:[]}
                                                        isClearable={true} />
                                                </div>
                                                <div className="input-group-append">
                                                    <Button onClick={() => { this.onOpenLocationModal() }}>
                                                        <MdIcons.MdAddLocationAlt style={{ "width": "20px", "height": "20px" }} />Choose Location</Button>
                                                </div>
                                            </div>
                                            <p style={{ color: 'red' }}>{this.state.error.drop_of_site_location}</p>
                                        </Col>
                                    </Row>
                                    :
                                    <p></p>
                                }
                                <Row style={{ marginTop: '10px' }}>
                                    <Col>
                                        <label>Estimated Weight <span style={{ color: 'red' }}>*</span> :</label><br />
                                        <input name='estimated_weight' value={this.state.form.estimated_weight || ''} onChange={e => this.setInput(e)} className='form-control' />
                                        <p style={{ color: 'red' }}>{this.state.error.estimated_weight}</p>
                                    </Col>

                                    <Col>
                                        <label>Number of Trucks <span style={{ color: 'red' }}>*</span> :</label><br />
                                        <input name="no_of_trucks" value={this.state.form.no_of_trucks || ''} className='form-control' onChange={e => this.setInput(e)} />
                                        <p style={{ color: 'red' }}>{this.state.error.no_of_trucks}</p>
                                    </Col>
                                </Row>

                                <Row style={{ marginTop: '10px' }}>
                                    <Col>
                                        <label>Required Start Date <span style={{ color: 'red' }}>*</span> :</label><br />
                                        <input type="date" name="start_date" className='form-control' value={this.state.form.start_date || ''} 
                                            onChange={e => this.setInput(e)} min={this.state.min_start_date} />
                                        <p style={{ color: 'red' }}>{this.state.error.start_date}</p>
                                    </Col>
                                    <Col>
                                        <label>Estimated End Date <span style={{ color: 'red' }}>*</span> :</label><br />
                                        <input type="date" name="end_date" className='form-control' value={this.state.form.end_date || ''} onChange={e => this.setInput(e)} 
                                        min={(!helper.isEmptyString(this.state.form.start_date)) ? this.state.form.start_date : new Date().toISOString().split('T')[0]} /> {/*min={this.disablePastDate('end')} />*/}
                                        <p style={{ color: 'red' }}>{this.state.error.end_date}</p>
                                    </Col>
                                </Row>

                                <Row style={{ marginTop: '10px' }}>
                                    <Col>
                                       <label>Customer Comments</label>
                                       <textarea className='form-control' value={this.state.form.customer_comments || ''} disabled/>
                                    </Col>
                                </Row>

                                <Row style={{ marginTop: '10px' }}>
                                    <Col>
                                        <label>Contract Work Permit <span style={{ color: 'red' }}>*</span> </label><br />

                                        <label className="checkmark_container" style={{ marginTop: "5px" }}>
                                            <input type="checkbox" checked={this.state.form.contract_work_permit == 'no' ? true : false} name="contract_work_permit" onChange={e => this.setInput(e)} value="no" />
                                            <span className="checkmark"></span>
                                            <label style={{ marginLeft: '5px' }} >No</label><br />
                                        </label>

                                        <label className="checkmark_container" style={{ marginTop: "5px" }}>
                                            <input type="checkbox" checked={this.state.form.contract_work_permit == 'cold_work_permit' ? true : false} name="contract_work_permit" onChange={e => this.setInput(e)} value="cold_work_permit" />
                                            <span className="checkmark"></span>
                                            <label style={{ marginLeft: '5px' }} >Cold Work Permit</label><br />
                                        </label>

                                        <label className="checkmark_container" style={{ marginTop: "5px" }}>
                                            <input type="checkbox" checked={this.state.form.contract_work_permit == 'hot_work_permit' ? true : false} name="contract_work_permit" onChange={e => this.setInput(e)} value="hot_work_permit" />
                                            <span className="checkmark"></span>
                                            <label style={{ marginLeft: '5px' }} >Hot Work Permit</label><br />
                                        </label>


                                        <p style={{ color: 'red' }}>{this.state.error.contract_work_permit}</p>
                                    </Col>
                                </Row>
                            </Col>

                            <Col lg="8">
                                <Row style={{ border: '1px solid #ced4da', borderRadius: '6px', padding: '2px' }}>
                                    <Col>
                                        <h6>Material Types <span style={{ color: 'red' }}>*</span> </h6><p style={{ color: 'red' }}>{this.state.error.material_types}</p><br />
                                        <TypesOfMaterialToBeCollected selected_materails={this.state.selected_materails} onChangeMaterial={this.onChangeMaterial}
                                            rawData={this.props.rawData.materials} unitData={this.props.rawData.measurement_types} />
                                    </Col>
                                </Row>

                                <Row style={{ marginTop: '10px', border: '1px solid #ced4da', borderRadius: '6px', padding: '2px' }}>
                                    <Col>
                                        <h6>Required Equipments  <span style={{ color: 'red' }}>*</span> </h6><p style={{ color: 'red' }}>{this.state.error.equipments}</p><br />
                                        <Mobilization categories={this.props.rawData.categories} sub_categories={this.props.rawData.sub_categories}
                                            mobilization={this.state.mobilization} onChangeMobilization={this.onChangeMobilization} 
                                            min_start_date={this.state.min_start_date} start_date={this.state.form.start_date} end_date={this.state.form.end_date}/>
                                    </Col>
                                </Row>

                                <Row style={{ marginTop: '10px', border: '1px solid #ced4da', borderRadius: '6px', padding: '2px' }}>
                                    <Col>
                                        <h6>Required Labour  <span style={{ color: 'red' }}>*</span> </h6><p style={{ color: 'red' }}>{this.state.error.labours}</p><br />
                                        <ManPower selected_ManPower={this.state.selected_ManPower} categories={this.props.rawData.categories} sub_categories={this.props.rawData.sub_categories} onChangeUser={this.onChangeUser} />
                                    </Col>
                                </Row>
                            </Col>

                        </Row>

                    </Modal.Body>

                    <Modal.Footer>
                        <Button onClick={this.submit}><i className="fas fa-check"></i> Save changes</Button>
                    </Modal.Footer>

                </Modal>

                <AqgAddressModal 
                    show={this.state.showLocationModal}
                    onHide={this.onCloseLocationModal}
                    mapUrl={this.state.mapUrl}
                />
            </div>
        );
    }
}