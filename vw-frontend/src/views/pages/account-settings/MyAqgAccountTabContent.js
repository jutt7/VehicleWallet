import React, {Component} from 'react';
import { Col, Row, Button, ButtonGroup, DropdownButton, Dropdown } from 'react-bootstrap';
import { getUserData } from '@utils'
import { ClipLoader } from "react-spinners";
import * as MdIcons from 'react-icons/md'; 
import axios from 'axios';
import jwtDefaultConfig from "@src/@core/auth/jwt/jwtDefaultConfig"
import helper from '@src/@core/helper';
import AddressMap from '../../components/maps/AddressMap';
import '@src/style/oms.css';
export default class AqgAccount extends Component {
    constructor(props) {
        super(props);
        this.state = {
            customer: {
                customer_id: '',
                name: '',
                mobile: '',
                email: '',
                status: '',
                head_office: ''
            },
            active_orders: [],
            active_sites: [],
            addresses: [],
            materials: [],
            trip_activities: [],
            skip_levels: [],
            overlay: false,
            mapUrl: `//maps.googleapis.com/maps/api/js?v=3.exp&libraries=geometry,drawing,places&key=${getUserData().map_key}&language=en`,
        };
    }

    componentDidMount() {
        this.getData();
    }

    getData = () => {
        this.setState({overlay:true});
        axios.get(`${jwtDefaultConfig.clientBaseUrl}/customer_sites?customer_id=${getUserData().customer_id}`, {
            headers: {
                Authorization: `${localStorage.getItem("customerAccessToken")}`
            }
        }).then((res => {
            if (res.status && res.status === 200) {
                helper.redirectToCustomerLogin( helper.isObject(res.data) ? res.data.code : 201);
                console.log(res.data, 'response');
                this.setState({
                    customer: {
                        customer_id: res.data.data.customer.customer_id,
                        name: res.data.data.customer.name,
                        mobile: res.data.data.customer.mobile,
                        email: res.data.data.customer.email,
                        status: res.data.data.customer.status,
                        head_office: (res.data.data.customer.head_office && res.data.data.customer.head_office.length > 0) ? `${res.data.data.customer.head_office[0].address_title} (${res.data.data.customer.head_office[0].address})` : '' 
                    },
                    active_orders: (res.data.data.customer.active_orders) ? helper.applyCountID(res.data.data.customer.active_orders) : [],
                    active_sites: (res.data.data.customer.active_orders) ? this.processSites(res.data.data.customer.active_orders) : [],
                    addresses: (res.data.data.customer.address) ? helper.applyCountID(res.data.data.customer.address) : [],
                    materials: (res.data.data.material_data) ? this.processMaterials(res.data.data.material_data) : [],
                    trip_activities: (res.data.data.activity) ? helper.applyCountID(res.data.data.activity) : [],
                    skip_levels: (res.data.data.skip_levels) ? helper.applyCountID(res.data.data.skip_levels) : [],
                    overlay: false
                })
            } else {
                this.setState({overlay:false});
            }
        
        })).catch((error) => {
            console.log(error,'error')
            helper.toastNotification('Unable to get data.', "FAILED_MESSAGE");
            this.setState({overlay:false});
        });
    }

    processSites (data) {
        let sites = [];

        for (let i=0; i < data.length; i++) {
            if (data[i].pickup) {
                sites.push(data[i].pickup);
            }
        }

        console.log(data, 'active orders');
        console.log(sites, 'sites');
        return sites;
    }

    processMaterials (data) {
        let materials = [];
        for (let site in data) {
            for (let material in data[site]) {
                materials.push(data[site][material]);
            }
        }
        return materials;
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
                <Row style={{paddingTop: "10px", margin: "0px"}}>
                    <Col xs={3} style={{padding:"0px", margin:"3px"}}>
                        <span>{(!helper.isEmptyString(this.state.customer)) ? this.state.customer.name : ''}</span>
                    </Col>
                    
                </Row>
                <Row style={{paddingTop: "10px", margin: "0px"}}>
                    <Col xs={3} className="aqg-account-box">
                        <div className="header">
                            <label className='pull-left'>DETAILS</label>
                        </div>
                        <table className="details table ">
                            <tbody>
                                <tr>
                                    <th style={{width: "30%", borderBottom: "none"}}></th>
                                    <th style={{width: "100%", borderBottom: "none"}}></th>
                                </tr>
                                <tr>
                                    <td><MdIcons.MdLocationOn style={{width:"30px", height:"30px"}}/></td>
                                    <td>{(!helper.isEmptyString(this.state.customer.head_office)) ? this.state.customer.head_office : ''}</td>
                                </tr>
                                 <tr>
                                    <td><MdIcons.MdPhone style={{width:"30px", height:"25px"}}/></td>
                                    <td>{(this.state.customer.mobile) ? this.state.customer.mobile : "-"}</td>
                                </tr>
                                 <tr>
                                    <td><MdIcons.MdEmail style={{width:"30px", height:"25px"}}/></td>
                                    <td>{this.state.customer.email}</td>
                                </tr>
                                 <tr>
                                    <td><MdIcons.MdFlag style={{width:"30px", height:"30px"}}/></td>
                                    <td style={{color: "red"}}>{ (this.state.customer.status === 1) ? 'Active' : 'InActive' }</td>
                                </tr>
                            </tbody>
                        </table>
                    </Col>
                    <Col className="aqg-account-box">
                        <div className="header">
                            <label className='pull-left'>JOB ACTIVITY</label>
                            <label className="pull-right">See Activity Detail <i className="fas fa-angle" /> </label>
                        </div>
                        <div className="aqg-account-box-inner">
                            <table>
                                <tbody>
                                    
                                    {
                                        this.state.trip_activities.map((activity) => (
                                        
                                            (activity.count_id < 10) ?
                                                <tr key={activity.count_id}>
                                                    <td style={{width: "20%"}}>
                                                        Trip {activity.trip_code}
                                                        <div style={{color:"#OC5640", width:"100px", height:"10px"}}></div>
                                                        <div>{activity.trip_activity}</div>
                                                    </td>
                                                    <td style={{width: "50%"}}>
                                                        {helper.stringToJson(activity.category_name).en} <br />
                                                        
                                                        {activity.weight} {helper.stringToJson(activity.unit).en} - {helper.stringToJson(activity.material_name).en}
                                                        <br /> Juaymah
                                                    </td>
                                                    <td style={{width: "20%"}}>
                                                    {
                                                        (!helper.isEmptyString(activity.trip_updated_at)) ? helper.formatDateInSlash(activity.trip_updated_at) :
                                                        (!helper.isEmptyString(activity.pickup_date)) ? helper.formatDateInSlash(activity.pickup_date): 
                                                        (!helper.isEmptyString(activity.dropoff_date)) ? helper.formatDateInSlash(activity.droppff_date) : "-"
                                                    }
                                                    </td>
                                                    {/* <td> 
                                                        <MdIcons.MdRemoveRedEye style={{width:"20px", height:"20px"}}/>
                                                    </td> */}
                                                </tr> : ''
                                        ))
                                    }
                                    {/* <tr>
                                        <td>
                                            Trip 145236
                                            <div style={{color:"gray", width:"100px", height:"10px"}}></div>
                                            <div>ASSIGNED</div>
                                        </td>
                                        <td>Collection - 90 Tons - Steel Pipes <br /> Juaymah </td>
                                        <td>Wed 9/3/22</td>
                                        <td><MdIcons.MdRemoveRedEye style={{width:"20px", height:"20px"}}/></td>
                                    </tr>
                                    */}
                                </tbody>
                            </table>
                        </div>

                        
                    </Col>
                </Row>

                <Row style={{paddingTop: "10px", margin: "0px"}}>
                    <Col xs={3} className="aqg-account-box">
                        <div className="header">
                            <label className='pull-left'>ACTIVE WORK ORDERS </label>
                            {/* <button className="pull-right" style={{background:"#3B9845"}}><i className="fa fa-plus" /> </button> */}
                        </div>
                        <div className="aqg-account-box-inner">
                            <table>
                                <tbody>
                                    {
                                        this.state.active_orders.map((order, i) => (
                                        
                                            (order.count_id < 10) ?
                                            <tr key={i}>
                                                <td>    
                                                    <strong>{ (order.category) ? helper.stringToJson(order.category.category_name).en : ''}</strong><br />
                                                    {
                                                        (order.category && ( order.category.key === 'PICKUP' || order.category.key === 'TRANSFER')) ? 
                                                            `Estimated Weight: ${ (order.net_weight) ?  order.net_weight :'-'}` : 
                                                        (order.category && order.category.key === 'SKIP COLLECTION') ?
                                                            `Total Skips: ${order.luggers_count}`  : 
                                                        (order.category && order.category.key === 'ASSET') ? 
                                                           (order.luggers_count > 0) ? 
                                                                `Total Skips: ${order.luggers_count} ${(order.iot_count > 0) ? `Total IOT: ${order.iot_count}` : ''}`
                                                                : 
                                                           (order.iot_count > 0) ? `Total IOT: ${order.iot_count}` : ''

                                                        : ''
                                                    }
                                                </td>
                                                <td>
                                                    {
                                                        (order.category && ( order.category.key === 'PICKUP' || order.category.key === 'TRANSFER') && order.pickup_address) ? order.pickup_address.address_title :
                                                        (order.category && (order.category.key === 'SKIP COLLECTION' || order.category.key === 'ASSET') && order.shipping_address) ?
                                                            order.shipping_address.address_title : "-"
                                                    } <br />
                                                    Start Date: {helper.formatDateInSlash(order.required_start_date)}
                                                </td>
                                            </tr> : ''
                                        ))
                                    }
                                    {/* <tr>
                                        <td>
                                            <strong>{}</strong><br />
                                            Estimated Weight: 2000 tons
                                        </td>
                                        <td>Juaymah Reclamation Yard <br />
                                            Start Date: 20/03/22
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>
                                            <strong>Collection Job</strong><br />
                                            Total Luggers: 4
                                        </td>
                                        <td>Juaymah Reclamation Yard <br />
                                            Start Date: 20/03/22
                                        </td>
                                    </tr> */}
                                </tbody>
                            </table>
                        </div>
                        
                    </Col>
                    <Col xs={3} className="aqg-account-box">
                        <div className="header">
                            <label className='pull-left'>{(this.state.addresses && this.state.addresses.length === 1) ? 'SITE' : (this.state.addresses.length > 1) ? 'SITES' : ''}</label>
                            {/* <button className="pull-right" style={{background:"#3B9845"}}><i className="fa fa-plus" /> </button> */}
                        </div>
                        <div className="aqg-account-box-inner">
                            <table>
                                <tbody>
                                    {
                                        this.state.addresses.map((address) => (
                                            (address.count_id < 10) ?
                                                <tr key={address.count_id}>
                                                    <td>{address.address_title}</td>
                                                    <td>{address.address}</td>
                                                </tr> : ''
                                        ))
                                    }
                                    {/* <tr>
                                        <td>Juaymah Reclamation Yard</td>
                                        <td>5336 6981, Saudi Arabia, رأس تنورة 32864, Saudi Arabia</td>
                                    </tr>
                                    <tr>
                                        <td>Shedgum Reclamation Yard</td>
                                        <td>Unnamed Road 33428, Saudi Arabia</td>
                                    </tr>
                                    <tr>
                                        <td>Pipe Yard C111 </td>
                                        <td>5336 6981, Saudi Arabia, رأس تنورة 32864, Saudi Arabia</td>
                                    </tr> */}
                                </tbody>
                            </table>
                        </div>
                        
                    </Col>
                    <Col xs={3} className="aqg-account-box">
                        <div className="header">
                            <label className='pull-left'>LOCATION</label>
                            {/* <button className="pull-right" style={{background:"#3B9845"}}><i className="fa fa-plus" /> </button> */}
                        </div>
                        <div style={{padding:"0px",width: "100%", overflow: "hidden"}}>
                            <AddressMap googleMapURL={this.state.mapUrl} height='265px' width='200px'
                                data={this.state.active_sites} onMapClick={() => {return}}
                                    onAddressSelection={() => {return}} donotShowCategoryMarker={true}/>
                        </div>
                    </Col>
                    <Col className="aqg-account-box">
                        <div className="header">
                            <label className='pull-left'>MATERIALS</label>
                            {/* <button className="pull-right" style={{background:"#3B9845"}}><i className="fa fa-plus" /> </button> */}
                        </div>
                        <div className="aqg-account-box-inner">
                            <table>
                                <tbody>
                                    {
                                        this.state.materials.map((material, i) => (
                                            (i < 10) ?
                                                <tr key={i}>
                                                    <td>
                                                        {helper.stringToJson(material.material_name).en} <br />
                                                        {(material.sum_weight > 0) ? `Weight: ${material.sum_weight} ${helper.stringToJson(material.unit).en}`: ''}
                                                    </td>
                                                    <td>{material.pickup_address}</td>
                                                </tr> : ''
                                        ))
                                    }
                                    {/* <tr>
                                        <td>Steel Pipes <br /> Weight: 1000 ton</td>
                                        <td>Juaymah Reclamation Yard</td>
                                        
                                    </tr>
                                    */}
                                   
                                </tbody>
                            </table>
                        </div>
                    </Col>
                </Row>

                <Row style={{paddingTop: "10px", margin: "0px"}}>
                    <Col xs={3} className="aqg-account-box">
                        <div className="header">
                            <label className='pull-left'>CONTACTS</label>
                        </div>
                        <div className="aqg-account-box-inner">
                            <table>
                                <tbody>
                                    {
                                        this.state.addresses.map((address) => (
                                            (!((address.site_manager_name == null || address.site_manager_name == '' || address.site_manager_name == undefined) && 
                                                (address.site_manager_mobile == null || address.site_manager_mobile == '' || address.site_manager_mobile == undefined) && 
                                                (address.site_manager_email == null || address.site_manager_email == '' || address.site_manager_email == undefined))) ?
                                            <tr key={address.count_id}>
                                                <td>{address.site_manager_name}</td>
                                                <td>
                                                    <MdIcons.MdEmail style={{width:"15px", height:"15px"}}/>{address.site_manager_email}<br />
                                                    <MdIcons.MdPhone style={{width:"15px", height:"15px"}}/>{address.site_manager_mobile}
                                                </td>
                                            </tr> : ''
                                        ))
                                    }
                                </tbody>
                            </table>
                        </div>
                    </Col>
                    <Col xs={3} className="aqg-account-box">
                        <div className="header">
                            <label className='pull-left'>SKIPS</label>
                        </div>
                        <div className="aqg-account-box-inner">
                            <table>
                                <tbody>
                                    {
                                        this.state.skip_levels.length && this.state.skip_levels.map((item, index) => (
                                            (item.skips_count > 0) ? 
                                                <tr key={index}>
                                                    <td>
                                                        <svg style={{marginRight: '5px', width: '20px'}} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512">
                                                            <path style={{ fill: item.color }} className="svgIcon" d="M560 160c10.38 0 17.1-9.75 15.5-19.88l-24-95.1C549.8 37 543.3 32 536 32h-98.88l25.62 128H560zM272 32H171.5L145.9 160H272V32zM404.5 32H304v128h126.1L404.5 32zM16 160h97.25l25.63-128H40C32.75 32 26.25 37 24.5 44.12l-24 95.1C-2.001 150.2 5.625 160 16 160zM560 224h-20L544 192H32l4 32H16C7.25 224 0 231.2 0 240v32C0 280.8 7.25 288 16 288h28L64 448v16C64 472.8 71.25 480 80 480h32C120.8 480 128 472.8 128 464V448h320v16c0 8.75 7.25 16 16 16h32c8.75 0 16-7.25 16-16V448l20-160H560C568.8 288 576 280.8 576 272v-32C576 231.2 568.8 224 560 224z" />
                                                        </svg>
                                                        <span>{item.skip_level}</span>
                                                    </td>
                                                    <td>{ item.skips_count }</td>
                                                </tr> : ''
                                        ))
                                    }
                                </tbody>
                            </table>
                        </div>
                    </Col>
                </Row>
                
            </div>
        );
    }
}