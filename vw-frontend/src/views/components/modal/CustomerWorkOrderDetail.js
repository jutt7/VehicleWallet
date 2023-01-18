import React, { Component } from 'react';
import { Col, Row, Modal, Button, ButtonGroup, Tabs, Tab, DropdownButton, Dropdown, OverlayTrigger } from 'react-bootstrap';
import jwtDefaultConfig from "@src/@core/auth/jwt/jwtDefaultConfig"
import helper from '@src/@core/helper';
import axios from 'axios';
import { Steps, Icon } from 'rsuite';
import { ClipLoader } from "react-spinners";
import BootstrapTable from 'react-bootstrap-table-next';
//import WrappedMap from "../../googlemap/Map";
import AddressMap from '../maps/AddressMap';
import { getUserData } from '@utils'
import paginationFactory from "react-bootstrap-table2-paginator";
import {XCircle} from 'react-feather'
import '@src/style/steps.css';

export default class RequestDetailModal extends Component {
	constructor(props) {
		super(props);
		this.state = {
			order: [],
			materials: [],
			order_statuses: [],
			trips: [],
			overlay: false,
			mapZoom: 13,
			order_status_step: 0,
			tabkey: "info",
			expanded: [],
			mapfeatures: {
				showMarker: true,
				showRoutes: true,
				showOriginMarker: true,
			},
			mapKey: getUserData().map_key,
		}
	}

	populateData = async () => {
		await this.setState({
			overlay: true,
		})

		let data = {};
		data.client_id = getUserData().customer_id;
		data.ord_id = this.props.requestDetailModalData.order_id;
		let url = `${jwtDefaultConfig.clientBaseUrl}/getorder_detail`;
		let token =  `${localStorage.getItem("customerAccessToken")}`

		if (this.props.oms == 'admin') {
			data = {}
			data.ord_id = this.props.requestDetailModalData.requestDetailModalData;
			data.admin = 1;
			url = `${BASE_URL}/getorder_detail`;
			token = `bearer ${localStorage.getItem("authtoken")}`

		}
		this.setState({ overlay: true });
		if (helper.isObject(this.props.requestDetailModalData)) {
			axios.post(url, data, {
				// headers: {
				// 	Authorization: token
				// },
			}).then(async (res) => {
                helper.redirectToCustomerLogin( helper.isObject(res.data) ? res.data.Code : 201);
				if (res.status == 200) {
					if (res.data.code === 401) {
						dispatch(handleLogout())
						window.location = `${window.location.origin}/login`
					}
					await this.setState({
						order: res.data.order_detail,
						order_status_step: this.setOrderStatus(res.data.order_detail),
						materials: this.processMaterials(res.data.order_detail.materials),
						order_statuses: this.processOrderStatuses(res.data.order_detail.order_statuses),
						trips: (res.data.order_detail.trips) ? this.processTrips(res.data.order_detail.trips) : [],
						overlay: false,
					})
				} else {
					helper.toastNotification('Unable to process request.', "FAILED_MESSAGE");
					await this.setState({
						order: [],
						materials: [],
						order_statuses: [],
						trips: [],
						overlay: false,
					})
				}
			})
				.catch(async (error) => {
					console.log(error, 'error')
					await this.setState({ overlay: false })
					helper.toastNotification('Unable to get data.', "FAILED_MESSAGE");
				});
		}
	}

	renderMaterialInfoDataTbl = () => {
		const columns = [
			{
				dataField: 'material',
				text: 'Materials',
				sort: true,
				headerStyle: {
					fontSize: '10px',
					outline: 'none',
				},
				style: {
					fontSize: '10px',
					fontSize: 'bold',
				},
			},
			{
				dataField: 'weight',
				text: 'Estimated Weight',
				sort: true,
				style: {
					fontSize: '10px',
				},
				headerStyle: {
					fontSize: '10px',
					outline: 'none',
				},
			},
			{
				dataField: 'pickup_weight',
				text: 'Pickup Weight',
				sort: true,
				style: {
					fontSize: '10px',
				},
				headerStyle: {
					fontSize: '10px',
					outline: 'none',
				},
			},
			{
				dataField: 'remarks',
				text: 'Remarks',
				sort: true,
				style: {
					fontSize: '10px',
				},
				headerStyle: {
					fontSize: '10px',
					outline: 'none',
				}
			},
		];

		const rowEvents = {
		};

		if (this.state.materials) {
			for (let i = 0; i < this.state.materials.length; i++) {
				let material_id = this.state.materials[i].value;
				let material_weight_unit = '';
				let pickup_weight = 0;
				let pickup_weight_unit = '';
				for (let j=0; j < this.state.trips.length; j++) {
					if (this.state.trips[j].pickup_material && this.state.trips[j].pickup_material.length) {
						for (let k = 0; k < this.state.trips[j].pickup_material.length; k++) {
							if (material_id == this.state.trips[j].pickup_material[k].material_id) {
								pickup_weight += this.state.trips[j].pickup_material[k].weight;
								pickup_weight_unit = (helper.isObject(this.state.trips[j].pickup_material[k].material_unit)) ? helper.stringToJson(this.state.trips[j].pickup_material[k].material_unit.unit).en : '';
							}	
						}
					}
				}

				this.state.materials[i].pickup_weight = pickup_weight + ' ' + pickup_weight_unit;

				if (helper.isObject(this.state.materials[i].unit)) {
					this.state.materials[i].weight = this.state.materials[i].weight + ' ' + helper.stringToJson(this.state.materials[i].unit).en;
				}
			}
		}

		return (<BootstrapTable
			bootstrap4
			keyField="material_id"
			data={this.state.materials}
			columns={columns}
			rowEvents={rowEvents}
			noDataIndication={"No Record Loaded"}
			key={2} />
		)
	}

	renderAssetsDataTbl = () => {

		const columns = [
            {
                dataField: 'asset',
                text: 'Asset',
                sort: true,
                headerStyle: {
                    fontSize: '10px',
                    outline: 'none',
                },
                style: {
                    fontSize: '10px',
                    fontSize: 'bold',
                },
            },
            {
                dataField: 'quantity',
                text: 'Quantity',
                sort: true,
                style: {
                    fontSize: '10px',
                },
                headerStyle: {
                    fontSize: '10px',
                    outline: 'none',
                },
            },
        ];

		const rowEvents = {
        };

		let assets = [];
		if (this.state.order && this.state.order.assets) {
			for (let i=0; i < this.state.order.assets.length; i++) {
				let asset = {};
				asset.asset_id = this.state.order.assets[i].order_service_request_id;
				asset.asset = (this.state.order.assets[i].service_category ) ? helper.stringToJson(this.state.order.assets[i].service_category.title).en : '';
				asset.quantity = this.state.order.assets[i].quantity;

				assets.push(asset);
			}
		}
		return (<BootstrapTable
            bootstrap4
            keyField="asset_id"
            data={assets}
            columns={columns}
            rowEvents={rowEvents}
            noDataIndication={"No Record Loaded"}
            key={2} />
        )
	}

	renderSkipsDataTbl = () => {
		const columns = [
            {
                dataField: 'skip',
                text: 'Skip',
                sort: true,
                headerStyle: {
                    fontSize: '10px',
                    outline: 'none',
                },
                style: {
                    fontSize: '10px',
                    fontSize: 'bold',
                },
            },
			{
                dataField: 'category',
                text: 'Category',
                sort: true,
                headerStyle: {
                    fontSize: '10px',
                    outline: 'none',
                },
                style: {
                    fontSize: '10px',
                    fontSize: 'bold',
                },
            },
            {
                dataField: 'skip_level',
                text: 'Skip Level',
                sort: true,
                style: {
                    fontSize: '10px',
                },
                headerStyle: {
                    fontSize: '10px',
                    outline: 'none',
                },
            },
			{
                dataField: 'replacement',
                text: 'Replacement',
                sort: true,
                style: {
                    fontSize: '10px',
                },
                headerStyle: {
                    fontSize: '10px',
                    outline: 'none',
                },
            },
        ];

		const rowEvents = {
        };

		let skips = [];
		if (this.state.order && this.state.order.assets) {
			for (let i=0; i < this.state.order.assets.length; i++) {
				let skip = {};
				skip.skip_id = this.state.order.assets[i].skip_id;
				skip.skip = (this.state.order.assets[i].title) ? this.state.order.assets[i].title : '';
				skip.category = (this.state.order.assets[i].service_category_title) ? helper.stringToJson(this.state.order.assets[i].service_category_title).en : '';
				skip.skip_level = (this.state.order.assets[i].skip_level) ? this.state.order.assets[i].skip_level : '',
				skip.replacement = (this.state.order.assets[i].replacement) ? "Yes" : "No";

				skips.push(skip);
			}
		}
		return (<BootstrapTable
            bootstrap4
            keyField="skip_id"
            data={skips}
            columns={columns}
            rowEvents={rowEvents}
            noDataIndication={"No Record Loaded"}
            key={2} />
        )
	}

	setOrderStatus = (data) => {
		if (data.order_statuses) {
			for (let i = 0; i < data.order_statuses.length; i++) {
				if (data.order_status_id == data.order_statuses[i].order_status_id) {
					console.log('order status set', i);
					return i;
				}
			}
		}

		console.log('order status set', 0);
		return 0;
	}

	processMaterials = (data) => {
		if (helper.isArray(data)) {
			for (let i = 0; i < data.length; i++) {
				data[i].material = helper.stringToJson(data[i].label).en;
			}
		} else {
			data = [];
		}

		return data;
	}

	processOrderStatuses = (data) => {
		for (let i = 0; i < data.length; i++) {
			data[i].label = helper.stringToJson(data[i].order_status_title).en;
		}

		return data;
	}

	processTrips = (data) => {
		console.log(data);
		for (let i = 0; i < data.length; i++) {
			data[i].count_id = i + 1;

			if (helper.isArray(data[i].kpi)) {
				for (let j = 0; j < data[i].kpi.length; j++) {
					if (helper.isObject(data[i].kpi[j])) {

						data[i].current_trip_step = j;
					}
				}
			}
		}

		console.log('trips', data);
		return data;
	}

	handleOnExpand = (row, isExpand, rowIndex, e) => {
		console.log(row);
		console.log(isExpand);
		console.log(this.state.expanded);
		if (isExpand) {
			this.setState(() => ({
				expanded: [...this.state.expanded, row.trip_id]
			}));
		} else {
			this.setState(() => ({
				expanded: this.state.expanded.filter(x => x !== row.trip_id)
			}));
		}
	}

	renderTripDataTable = () => {
		let products = []
		let temp = "-"
		let temp2 = "-"
		let kpi = []
		let checkout_date = null
		let diffMs = null
		const columns = [
			{
				dataField: 'count_id',
				text: 'Sequence',
				sort: true,
				headerStyle: {
					fontSize: '10px',
					outline: 'none',
				},
				style: {
					fontSize: '10px',
				},
			},
			{
				dataField: 'trip_code',
				text: 'Trip Code',
				sort: true,
				headerStyle: {
					fontSize: '10px',
					outline: 'none',
				},
				style: {
					fontSize: '10px',
				},
			},
			{
				dataField: 'created_at',
				text: 'Trip date',
				sort: true,
				style: {
					fontSize: '10px',
				},
				headerStyle: {
					fontSize: '10px',
					outline: 'none',
				},
			},
			{
				dataField: 'trip_status_en',
				text: 'Trip Status',
				sort: true,
				style: {
					fontSize: '10px',
				},
				headerStyle: {
					fontSize: '10px',
					outline: 'none',
				},
			},
			{
				dataField: 'eta',
				text: 'ETA',
				sort: true,
				style: {
					fontSize: '10px',
				},
				headerStyle: {
					fontSize: '10px',
					outline: 'none',
				},
			},
			{
				dataField: 'p2p_dist',
				text: 'Planned Distance',
				sort: true,
				style: {
					fontSize: '10px',
				},
				headerStyle: {
					fontSize: '10px',
					outline: 'none',
				},
			},
			{
				dataField: 'actual_distance',
				text: 'Actual Distance',
				sort: true,
				style: {
					fontSize: '10px',
				},
				headerStyle: {
					fontSize: '10px',
					outline: 'none',
				},
			},
			{
				dataField: 'p2p_time',
				text: 'Planned Time',
				sort: true,
				style: {
					fontSize: '10px',
				},
				headerStyle: {
					fontSize: '10px',
					outline: 'none',
				},
			},
			{
				dataField: 'actual_time',
				text: 'Actual Time',
				sort: true,
				style: {
					fontSize: '10px',
				},
				headerStyle: {
					fontSize: '10px',
					outline: 'none',
				},
			},
			{
				dataField: 'p2p_service',
				text: 'Planned Service Time',
				sort: true,
				style: {
					fontSize: '10px',
				},
				headerStyle: {
					fontSize: '10px',
					outline: 'none',
				},
			},
			{
				dataField: 'service_time',
				text: 'Actual Service Time',
				sort: true,
				style: {
					fontSize: '10px',
				},
				headerStyle: {
					fontSize: '10px',
					outline: 'none',
				},
			},
		];

		if (this.state.trips) {
			for (let i = 0; i < this.state.trips.length; i++) {
				this.state.trips[i].p2p_dist = (this.state.trips[i].total_distance / 1000).toFixed(1);
				this.state.trips[i].p2p_time = this.state.trips[i].total_time;

				if (this.state.trips[i].weight) {
					if (this.state.trips[i].unit) {
						this.state.trips[i].weight += ' ' + this.state.trips[i].unit;
					}
				} else {
					this.state.trips[i].weight = '-';
				}


				if (this.state.trips[i].kpi) {
					kpi = this.state.trips[i].kpi;
				}

				if (this.state.trips[i].trip_status) {
					temp2 = helper.stringToJson(this.state.trips[i].trip_status.trip_status_title).en;
					console.log(temp2);
				}

				if (this.state.trips[i].service_time) {
					if (this.state.trips[i].service_time.toString().length > 1) {
						if (!this.state.trips[i].service_time.toString().includes(" Min")) {
							this.state.trips[i].service_time = this.state.trips[i].service_time + " Min"
						}

					} else {
						this.state.trips[i].service_time = this.state.trips[i].service_time + " Min"
					}
				} else {
					this.state.trips[i].service_time = "-";
				}


				products.push({
					count_id: this.state.trips[i].count_id + 1,
					trip_code: this.state.trips[i].trip_code,
					trip_status_en: temp2,
					p2p_dist: (this.state.trips[i].total_distance / 1000).toFixed(3) + ' Km',
					p2p_time: (this.state.trips[i].total_time) ? this.state.trips[i].total_time + ' Min' : '0 Min',
					p2p_service: this.state.trips[i].service_time,
					materials: this.state.trips[i].materials,
					trip_id: this.state.trips[i].delivery_trip_id,
					created_at: helper.humanReadableDate(this.state.trips[i].created_at),
					service_time: (this.state.trips[i].actual_service_time) ? `${this.state.trips[i].actual_service_time} Min` : '-',
					trip_status_id: this.state.trips[i].trips_status_id,
					kpi: kpi,
					start_time_planned: (this.state.trips[i].start_time_planned) ? this.state.trips[i].start_time_planned : '-',
					actual_time: (this.state.trips[i].actual_time) ? `${this.state.trips[i].actual_time} Min` : '-',
					actual_distance: (this.state.trips[i].actual_distance) ? `${(this.state.trips[i].actual_distance / 1000).toFixed(1)} Km` : '-',
					eta: (this.state.trips[i].eta) ? this.state.trips[i].eta : '-'
				})

				kpi = [];
				temp = "-";
				temp2 = "-";
			}
		}

		const rowEvents = {
			/*  onClick: (e, row, rowIndex) => {
				//this.getTimelineData({ "order_id": row.order_id })
				console.log(`clicked on row with index: ${rowIndex}`);
			}, */
		};

		const expandRow = {

			renderer: row => (
				<>
						<ul class="timelin">
							<li>
								<h5>Start</h5>
								<label>{
									helper.isArray(row.kpi) && row.kpi.length && helper.isObject(row.kpi[0]) ?
										row.kpi[0].description
										: ''
								}</label>
							</li>
							<li>
								<h5>CheckIn</h5>
								<label>{
									helper.isArray(row.kpi) && row.kpi.length && helper.isObject(row.kpi[1]) ?
										row.kpi[1].description
										: ''
								}</label>
							</li>
							<li>
								<h5>Close</h5>
								<label>{
									helper.isArray(row.kpi) && row.kpi.length && helper.isObject(row.kpi[2]) ?
										row.kpi[2].description
										: ''
								}</label><br/>
								{
									helper.isArray(row.kpi) && row.kpi.length && helper.isObject(row.kpi[2]) && helper.isArray(row.kpi[2]["e-ticket"]) ?
										row.kpi[2]["e-ticket"].map((item, index) => (
											<img src={item} width={50} height={50} key={index}/>
										))
									:''
								}
							</li>
						</ul>
						{/* <Steps current={row.current_trip_step} small={true}>
							<Steps.Item title={<Trans i18nKey={"Check In"} />} description={row.kpi && row.kpi[1] ? row.kpi[1].description : null} icon={<Icon icon="checkin" size="lg"/>} />
							<Steps.Item title={<Trans i18nKey={"load"} />} description={
								(row.kpi && row.kpi[2]) ?
									row.kpi[2].description
									: null} icon={<Icon icon="delivered" size="lg" />} />
							<Steps.Item title={<Trans i18nKey={"Checkout"} />} description={row.kpi && row.kpi[2] ? row.kpi[2].description : null} icon={<Icon icon="checkout" size="lg" />} />
							<Steps.Item title={<Trans i18nKey={"Unload"} />} description={row.kpi && row.kpi[4] ? row.kpi[4].description : null} icon={<Icon icon="unloaded" size="lg" />} />
						</Steps> */}
					{
						(row.materials && row.materials.length) ?
							<div className="offset-1">
								<Row className="ml-1" >
									<Col xs={2}><b style={{ fontSize: "10px" }}>Material:</b></Col>
									<Col xs={1}><b style={{ fontSize: "10px" }}>Weight:</b></Col>
									<Col xs={2}><b style={{ fontSize: "10px" }}>Remarks:</b></Col>
								</Row>

							</div> : ''
					}

				</>
			),
			expanded: this.state.expanded,
			onExpand: this.handleOnExpand,
			showExpandColumn: true,
			expandHeaderColumnRenderer: ({ isAnyExpands }) => {
				if (isAnyExpands) {
					return <b>-</b>;
				}
				return <b>+</b>;
			},
			expandColumnRenderer: ({ expanded }) => {
				if (expanded) {
					return (
						<b><i className="fas fa-caret-up"></i></b>
					);
				}
				return (
					<b><i className="fas fa-caret-down"></i></b>
				);
			}
		};

		const rowStyle2 = (row) => {
			const style = {};
			if (row.trip_status_id == 4) { //4 is for closed trip
				//style.backgroundColor = '#c8e6c9';
				style.backgroundColor = '#d1b256';
			} else {
				//style.backgroundColor = '#d1b256';
				style.backgroundColor = '#c8e6c9';
			}
			return style;
		};

		const sizePerPageRenderer = ({
			options,
			currSizePerPage,
			onSizePerPageChange,
		}) => (
			<React.Fragment>
				<DropdownButton
					as={ButtonGroup}
					key={"up"}
					className="react-bs-table-sizePerPage-dropdown dropdown bg-aquaGreen col-1 pl-1"
					id={`tripplandropdown-button-drop-up`}
					drop={`up`}
					variant=""
					title={currSizePerPage}
				>
					{options.map((option) => (
						<Dropdown.Item
							key={option.text}
							eventKey="1"
							onClick={() => onSizePerPageChange(option.page)}
							className={`btn ${currSizePerPage === `${option.page}`
								? "btn-light-brown"
								: "btn-light-brown2"
								}`}
						>
							{option.text}
						</Dropdown.Item>
					))}
				</DropdownButton>
			</React.Fragment>
		);

		const customTotal = (from, to, size) => (
			<span className="react-bootstrap-table-pagination-total">
				{"   "} Total Records: {size}
			</span>
		);
		const options = {
			sizePerPageRenderer,
			paginationTotalRenderer: customTotal,
			showTotal: true,
		};
		if (this.state.overlay && this.state.trips) {
			this.setState({
				overlay: false,
			})
		}

		console.log('products jkdkvkxcvkxjc', products);
		return (
			<>
				<BootstrapTable
					key={1}
					bootstrap4
					keyField="trip_id"
					data={products}
					columns={columns}
					rowEvents={rowEvents}
					noDataIndication={'No Record Loaded'}
					pagination={paginationFactory(options)}
					//selectRow={selectRow}
					expandRow={expandRow}
					striped
					hover
					condensed
					bordered={false}
					rowStyle={rowStyle2}
				/>
			</>
		)
	}

	orderComplete = () => {
		let data = {}
		data.order_id = this.props.requestDetailModalData.requestDetailModalData;
		data.admin = 1;
		axios.post(`${BASE_URL}/order_complete`, data, {
			headers: {
				Authorization: `bearer ${localStorage.getItem("authtoken")}`
			},
		}).then(async (res) => {
			console.log(res,'res order complete')
			this.props.onHide('complete')
			helper.toastNotification('Order Completed Successfully.', "SUCCESS_MESSAGE");
		}).catch((error) =>{
			helper.toastNotification('Unable to get data.', "FAILED_MESSAGE");
			console.log(error)
		})
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
					<Modal.Body style={{ height: "90vh", overflowY: 'auto' }}>
						<Row className="float-right" style={{display:"flex", float:"right"}}>
							<Col>
								{/* <i className="fa fa-close fa-1x" style={{ cursor: "pointer" }} onClick={this.props.onHide}></i> */}
								<XCircle style={{ cursor: "pointer", width:"18px", float:"right"}} onClick={this.props.onHide}/>
							</Col>
						</Row>
						<Row style={{ position: "relative", border: "1px solid #F3F3F3", borderRadius: "2px", backgroundColor: "white", fontSize:"11px" }}>
							<div style={{ backgroundColor: "#0C5640", padding: "20px 20px", width: "60px" }}>
								<Icon icon="map-marker" size="3x" />
							</div>
							<Col className={'pt-3'}>
								<Steps current={this.state.order_status_step} small={false}>
									{
										this.state.order_statuses.map((status, index) => (
											<Steps.Item title={status.label}
												description={(this.state.order && this.state.order.kpi && this.state.order.kpi[index]) ? this.state.order.kpi[index].description : null} />
										))
									}
									{/* <Steps.Item id="createdStep" title={<Trans i18nKey={"Created"} />} description={`-`} />
                                <Steps.Item id="stockStep" title={<Trans i18nKey={"Stock received"} />} description={`-`}  />
                                <Steps.Item id="StartedStep" title={<Trans i18nKey={"Started"} />} description={`-`}  />
                                <Steps.Item id="completedStep" title={<Trans i18nKey={"Partially Closed"} />} description={`-`}  />
                                <Steps.Item id="endStep" title={<Trans i18nKey={"Closed"} />} description={`-`}  /> */}
								</Steps>
							</Col>
							<div style={{ backgroundColor: "#0C5640", padding: "22px 22px", width: "70px" }}>
								<Icon icon="map-marker" size="3x" />
							</div>
						</Row>
						<Row className={"justify-content-center align-items-center mt-2"} style={{ position: "relative" }}>
							<Col xs={1}>
								<Row className={"no-gutters"} style={{ fontSize:"11px", borderBottom: "1px solid #D3D3D3" }}>
									<label><b>Work Order:</b></label>
								</Row>
								<Row className={"no-gutters"} style={{fontSize:"11px"}}>
									<label>{this.state.order ? (this.state.order.order_number) : ("-")} </label>
								</Row>
							</Col>
							<Col xs={1}>
								<Row className={"no-gutters"} style={{ fontSize:"11px", borderBottom: "1px solid #D3D3D3" }}>
									<label><b>Status:</b></label>
								</Row>
								<Row className={"no-gutters"} style={{fontSize:"11px"}}>{console.log()}
									<label id="dynamic_status" className={`font-weight-bold 
                                        ${this.state.order.order_status && this.state.order.order_status.key == 'ACCEPTED' ? ("text-primary") :
											this.state.order.order_status && this.state.order.order_status.key == 'EXECUTION' ? ("text-success") :
												this.state.order.order_status &&
													(this.state.order.order_status.key == 'DELIVERED' || this.state.order.order_status.key == 'CANCELLED') ? ("text-danger") :
													this.state.order.order_status && this.state.order.order_status.key == 'WAITING_FOR_ACCEPTANCE' ? ("text-warning") : "text-warning"}`}>

										{(this.state.order.order_status) ? helper.stringToJson(this.state.order.order_status.order_status_title).en : '-'}
									</label>
								</Row>
							</Col>
							<Col xs={1}>
								<Row className={"no-gutters"} style={{ fontSize:"11px", borderBottom: "1px solid #D3D3D3" }}>
									<label><b>No of Trucks:</b></label>
								</Row>
								<Row className={"no-gutters"} style={{fontSize:"11px"}}>
									<label>{(this.state.order && this.state.order.trucks) ? this.state.order.trucks : '-'}</label>
								</Row>
							</Col>
							<Col xs={1}>
								<Row className={"no-gutters"} style={{ fontSize:"11px", borderBottom: "1px solid #D3D3D3" }}>
									<label><b>Weight:</b></label>
								</Row>
								<Row className={"no-gutters"} style={{fontSize:"11px"}}>
									<label>{this.state.order.net_weight ? this.state.order.net_weight : '-'}
										<span>{(this.state.order.net_weight && this.state.order.net_weight > 0 && this.state.order.unit) ?
											` ${helper.stringToJson(this.state.order.unit).en}` : ''}</span></label>
								</Row>
							</Col>
							<Col xs={1}>
								<Row className={"no-gutters"} style={{ fontSize:"11px", borderBottom: "1px solid #D3D3D3" }}>
									<label><b>Site Location:</b></label>
								</Row>
								<Row style={{fontSize:"11px"}}>
									<label>{this.state.order.pickup ? (`${this.state.order.pickup.address_title}`) : ("-")}</label>
								</Row>
							</Col>
							{
								(this.state.order.customer_dropoff) ?
									<Col xs={1}>
										<Row>
											<Col xs={3}>
												<img src={'/googleMap.png'} width={"25px"}></img>
											</Col>
											<Col>
												<Row className={"no-gutters"} style={{ borderBottom: "1px solid #D3D3D3" }}>
													<label><b>Distance:</b></label>
												</Row>
												<Row className={"no-gutters"}>
													<label>{this.state.order.customer_dropoff ? (`${this.state.order.customer_dropoff.address_title}`) : ("-")}</label>
												</Row>
											</Col>
										</Row>
									</Col> : ''
							}
							<Col xs={1}>
								<Row>
									<Button variant="success"
										onClick={this.populateData}
									>Refresh</Button>
								</Row>
							</Col>
							{
								this.props.oms === 'admin' && helper.isObject(this.state.order.order_status) && this.state.order.order_status.key == 'EXECUTION'?
								<Col xs={1}>
									<Row>
										<Button variant="success"
										  onClick={this.orderComplete}
										>Complete</Button>
									</Row>
								</Col>
								:''
							}

						</Row>
						<Tabs id="controlled-tab-example"
							activeKey={this.state.tabkey}
							onSelect={(k) => this.setState({ tabkey: k })} >
							<Tab eventKey="info" title={'Material info'} style={{ marginTop: "12px", marginLeft: "-10px" }}>

								<Row>
									<Col xs={6} style={{ height: "400px" }} >
									{
										(this.state.order) ? 
											(this.state.order.category_id == 1 || this.state.order.category_id == 2) ? this.renderMaterialInfoDataTbl() : 
											(this.state.order.category_id == 3) ? this.renderAssetsDataTbl() : this.renderSkipsDataTbl() : ''
									}
									</Col>
									<Col xs={6} style={{ height: "400px" }} >
										<AddressMap 
											googleMapURL={`https://maps.googleapis.com/maps/api/js?v=3.exp&libraries=geometry,drawing,places&key=${this.state.mapKey}&language=en}`}
											data={[]}
											onMapClick={() => {}}
											onAddressSelection={{}}
											height='400px' />
										{/* <WrappedMap
											routelist={
												this.state.trips ? this.state.trips : null
											}
											zoom={13}
											getMapError={this.onMapLoadError}
											t={this.props.t}
											//vehicleTrackingData={vehObj}
											testflag={true}
											testVehTrack={this.state.vehicleTracking}
											defaultCenter={this.props.defaultCenter ? this.props.defaultCenter : { lat: 25.057, lng: 42.588 }}
											mapfeatures={this.state.mapfeatures}
											language={this.state.language}
											room={this.state.room}
											googleMapURL={`https://maps.googleapis.com/maps/api/js?v=3.exp&libraries=geometry,drawing,places&key=${this.props.oms == 'admin' ?cookie.get("Map_Key"):this.state.mapKey}&language=en}`}
											loadingElement={<div style={{ height: "80%" }} />}
											containerElement={<div style={{ height: "80%" }} />}
											mapElement={<div style={{ height: "100%" }} />}
										/> */}

										{/* <Row>
											<Col xs={3}><img src={'/images/markers/red.png'}></img> Pending</Col>
											<Col xs={3}><img src={'/images/markers/green.png'}></img> Delivered</Col>
											<Col xs={3}><img src={'/images/markers/brown.png'}></img> Cancel</Col>

										</Row> */}
									</Col>
								</Row>
								<Row>
									<Col>
										{this.renderTripDataTable()}
									</Col>
								</Row>
							</Tab>
						</Tabs>
					</Modal.Body>
				</Modal>
			</div>
		);
	}
}