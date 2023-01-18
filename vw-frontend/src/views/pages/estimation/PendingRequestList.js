import React, { Component } from 'react';
import axios from 'axios';
import fStyle from "../../FleetManagement/Components/FleetManagementMenu.module.css";
import helper from "../../../Helper/helper.js";
import { BASE_URL } from "../../Constants/Enviroment/Enviroment";
import Router from "next/router";
import { LOGOUT } from "../../../store/actions/actionTypes";
import EstimationModal from "./EstimationModal";
import Pagination from "react-js-pagination";
import { Col, Row, Button } from 'react-bootstrap';
import { AiOutlineSearch } from 'react-icons/ai';
import { DateRangePicker } from 'rsuite';
import { ClipLoader } from "react-spinners";

class PendingRequestList extends Component {
    constructor(props) {
        super(props);
        this.state = {
            data: [],
            loading: false,
            showAddUpdateModal: false,
            updateModalData: null,
            updateIndex: '',
            itemsCountPerPage: 0,
            totalItemsCount: 0,
            currentPage: 1,
            onSubmit: '',
            sorting_icon: '',
            activePage: '',
            request: '',
            name: '',
            required_start_date: '',
            estimated_end_date: '',
            to: '',
            from: '',
            date:'',
            overlay:false,
        }
    }

    componentDidMount() {
        this.getData();
    }

    onOpenUpdateModal = (item, index) => {
        this.setState({
            showAddUpdateModal: true,
            updateIndex: index,
            onSubmit: 'update',
            updateModalData: item
        });
    }

    onCloseAddUpdateModal = () => {
        this.setState({
            showAddUpdateModal: false,
            updateIndex: null,
            onSubmit: null,
            updateModalData: null
        });
    }

    getData = async () => {
        this.setState({overlay:true})
        await axios.get(`${BASE_URL}/pending_orders?page=${this.state.currentPage}&request_number=${this.state.request}&customer=${this.state.name}&required_start_date=${this.state.required_start_date}&estimated_end_date=${this.state.estimated_end_date}&status=${''}&to=${helper.formatDateInHashes(this.state.to)}&from=${helper.formatDateInHashes(this.state.from)}`, {
            headers: {
                Authorization: `bearer ${localStorage.getItem("authtoken")}`
            },
        }).then((res) => {
            if (res.status && res.status === 200) {
                console.log('response', res);
                if (res.data.code === 401) { // user is not authorized to access this api
                    Router.push("/login");
                    dispatch({
                        type: LOGOUT,
                        payload: { loginStatus: false, message: res.data.status },
                    });
                } else {
                    this.setState({
                        activePage: res.data.data.pending_orders.current_page,
                        totalItemsCount: res.data.data.pending_orders.total,
                        itemsCountPerPage: res.data.data.pending_orders.per_page,
                        data: helper.applyCountID(res.data.data.pending_orders.data),
                        loading: false,
                        overlay:false
                    })
                }
            } else {
                helper.toastNotification('Unable to process request.', "FAILED_MESSAGE");
                this.setState({
                    data: [],
                    loading: false,
                    overlay:false
                })
            }
        })
            .catch((error) => {
                this.setState({
                    data: [],
                    loading: false,
                    overlay:false
                })
            });
    }

    update = (args) => {
        axios.post(`${LOCAL_API_URL}/api/geofence/edit/${this.state.updateModalData.id}`, args,
            {
                headers: {
                    Authorization: `bearer ${localStorage.getItem("authtoken")}`
                },
            }).then((res) => {
                helper.redirectToLogin(helper.isObject(res.data) ? res.data.code : 201)
                if (res.data.code && (res.data.code === 200 || res.data.code === 201)) {
                    helper.toastNotification('Request has been processed successfuly.', "SUCCESS_MESSAGE");
                    this.getData()
                    this.setState({ showAddUpdateModal: false })
                }
                else {
                    helper.toastNotification('Unable to process request.', "FAILED_MESSAGE");
                }
            })
            .catch((error) => {
                this.setState({
                    showAddUpdateModal: false,
                    data: [],
                    loading: false
                })
                helper.toastNotification('Unable to process request.', "FAILED_MESSAGE");
            });
    }

    applyRowClass = (arg) => {
        return (arg && arg.count_id % 2 == 0) ? true : false
    }

    submitAction = (args = '') => {
        if (this.state.onSubmit == 'update') {
            this.update(args)
        }
    }

    submit = (req) => {
        console.log(req,'submit req')
        axios.post(`${BASE_URL}/order_update`, req, {
            headers: {
                Authorization: `bearer ${localStorage.getItem("authtoken")}`
            },
        }).then((res) => {
            helper.redirectToLogin(helper.isObject(res.data) ? res.data.code : 201)
            if (res.status && res.status === 200) {
                helper.toastNotification('Request has been processed successfuly.', "SUCCESS_MESSAGE");
                this.setState({ showAddUpdateModal: false })
                this.getData()
            } else {
                helper.toastNotification('Unable to  process request.', "FAILED_MESSAGE");
            }
        })
            .catch((error) => {
                console.log(error, 'error')
                helper.toastNotification('Unable to get data.', "FAILED_MESSAGE");
            });
    }

    sortAscending = (icon, sortType, colsort) => {
        if (colsort == 'order_number') {
            this.setState({
                sorting_icon: icon,
                data: helper.applyCountID(this.state.data.sort((a, b) => a[colsort] > b[colsort] && sortType === 'asc' ? 1 : -1))
            });
        }
        else if (colsort == 'name') {
            this.setState({
                sorting_icon: icon,
                data: helper.applyCountID(this.state.data.sort(
                    (a, b) =>
                        (a.customer.name.toLowerCase() > b.customer.name.toLowerCase()) && (sortType === 'asc') ? 1 : -1))
            })
        }
        else {
            this.setState({
                sorting_icon: icon,
                data: helper.applyCountID(this.state.data.sort(
                    (a, b) =>
                        (a[colsort] > b[colsort]) && (sortType === 'asc') ? 1 : -1))
            })
        }

    }

    onCurrPageChange = async(page) => {
        await this.setState({
            currentPage: page,
        })
        this.getData()
    }

    resetData = async()=>{
        await this.setState({
            request: '',
            name: '',
            required_start_date: '',
            estimated_end_date: '',
            to: '',
            from: '',
            date:'',
        })
        this.getData()
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
                <Row className='planningSearchBar'>
                <Col>
                    <label>Request Number</label>
                    <input placeholder='Request Number' className='form-control' value={this.state.request} onChange={e => this.setState({request: helper.cleanInteger(e.target.value)})} />
                </Col>
                <Col>
                    <label>Customer</label>
                    <input placeholder='Customer' className='form-control' value={this.state.name} onChange={e => this.setState({name: e.target.value})} />
                </Col>
                <Col>
                    <label>Required Start Date</label>
                    <input placeholder='Required Start Date' className='form-control' type='date' value={this.state.required_start_date} onChange={e => this.setState({required_start_date: e.target.value})} />
                </Col>
                <Col>
                    <label>Estimated End Date</label>
                    <input placeholder='Estimated End Date' className='form-control' value={this.state.estimated_end_date} type='date' onChange={e => this.setState({estimated_end_date: e.target.value})} />
                </Col>
                <Col>
                    <label>Submitted on</label>
                    <DateRangePicker placeholder='Submitted on' placement='auto' value={this.state.date} onChange={e => this.setState({to: e[0], from: e[1],date:e})} />
                </Col>
                <Col>
                    <Button style={{ marginTop: "30px",marginRight: "5px" }} onClick={e => this.getData(1)}>
                        <AiOutlineSearch size={16} />Search
                    </Button>
                    <Button style={{ marginTop: "30px" }} onClick={e => this.resetData()}>Reset</Button>
                </Col>
            </Row>
                <table className='table'>
                    <thead>
                        <tr>
                            <th className="table-th">
                                <b>Request Number</b>
                                <i onClick={(e) => this.sortAscending('Col1_asc', 'asc', 'order_number')} class={this.state.sorting_icon == 'Col1_asc' ? 'fas fa-long-arrow-alt-up sort-color' : 'fas fa-long-arrow-alt-up'}></i>
                                <i onClick={(e) => this.sortAscending('Col1_des', 'des', 'order_number')} class={this.state.sorting_icon == 'Col1_des' ? 'fas fa-long-arrow-alt-down sort-color' : 'fas fa-long-arrow-alt-down'}></i>
                            </th>
                            <th className="table-th">
                                <b>Customer</b>
                                <i onClick={(e) => this.sortAscending('Col2_asc', 'asc', 'name')} class={this.state.sorting_icon == 'Col2_asc' ? 'fas fa-long-arrow-alt-up sort-color' : 'fas fa-long-arrow-alt-up'}></i>
                                <i onClick={(e) => this.sortAscending('Col2_des', 'des', 'name')} class={this.state.sorting_icon == 'Col2_des' ? 'fas fa-long-arrow-alt-down sort-color' : 'fas fa-long-arrow-alt-down'}></i>
                            </th>
                            <th className="table-th">
                                <b>Required Start Date</b>
                                <i onClick={(e) => this.sortAscending('Col3_asc', 'asc', 'required_start_date')} class={this.state.sorting_icon == 'Col3_asc' ? 'fas fa-long-arrow-alt-up sort-color' : 'fas fa-long-arrow-alt-up'}></i>
                                <i onClick={(e) => this.sortAscending('Col3_des', 'des', 'required_start_date')} class={this.state.sorting_icon == 'Col3_des' ? 'fas fa-long-arrow-alt-down sort-color' : 'fas fa-long-arrow-alt-down'}></i>
                            </th>
                            <th className="table-th">
                                <b>Estimated End Date</b>
                                <i onClick={(e) => this.sortAscending('Col4_asc', 'asc', 'estimated_end_date')} class={this.state.sorting_icon == 'Col4_asc' ? 'fas fa-long-arrow-alt-up sort-color' : 'fas fa-long-arrow-alt-up'}></i>
                                <i onClick={(e) => this.sortAscending('Col4_des', 'des', 'estimated_end_date')} class={this.state.sorting_icon == 'Col4_des' ? 'fas fa-long-arrow-alt-down sort-color' : 'fas fa-long-arrow-alt-down'}></i>
                            </th>
                            <th className="table-th">
                                <b>Status</b>
                            </th>
                            <th className="table-th">Submitted on
                                <i onClick={(e) => this.sortAscending('Col5_asc', 'asc', 'created_at')} class={this.state.sorting_icon == 'Col5_asc' ? 'fas fa-long-arrow-alt-up sort-color' : 'fas fa-long-arrow-alt-up'}></i>
                                <i onClick={(e) => this.sortAscending('Col5_des', 'des', 'created_at')} class={this.state.sorting_icon == 'Col5_des' ? 'fas fa-long-arrow-alt-down sort-color' : 'fas fa-long-arrow-alt-down'}></i>
                            </th>
                            <th className="table-th">
                                <b>Actions</b>
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            this.state.data.map((RowData, index) => (
                                <tr key={index} className={this.applyRowClass(RowData) === true ? `${fStyle.evenRowColor}` : 'oddRowColor'}>
                                    <td>{RowData.order_number}</td>
                                    <td>{RowData.customer.name}</td>
                                    <td>{helper.humanReadableDate(RowData.required_start_date)}</td>
                                    <td>{helper.humanReadableDate(RowData.estimated_end_date)}</td>
                                    <td>{helper.stringToJson(RowData.order_status.order_status_title).en}</td>
                                    <td>{helper.humanReadableDate(RowData.created_at)}</td>
                                    <td>
                                        <div>
                                            <img onClick={() => { this.onOpenUpdateModal(RowData, index) }}
                                                style={{ width: '15px', cursor: 'pointer' }} src={'/images/fleet/task.png'} />
                                        </div>
                                    </td>
                                </tr>
                            ))
                        }
                    </tbody>
                </table>
                <div className={`${fStyle.fleetPaginator}`}>
                    <Pagination
                        activePage={this.state.activePage}
                        itemsCountPerPage={this.state.itemsCountPerPage}
                        totalItemsCount={this.state.totalItemsCount}
                        pageRangeDisplayed={5}
                        prevPageText="<"
                        nextPageText=">"
                        onChange={this.onCurrPageChange.bind(this)}
                        itemClassFirst={`${fStyle.itemClassFirst}`}
                        itemClassPrev={`${fStyle.itemClassPrev}`}
                        itemClassLast={`${fStyle.itemClassLast}`}
                        disabledClass={`${fStyle.disabledClass}`}
                        linkClass={`${fStyle.linkClass}`}
                    />
                </div>
                <EstimationModal
                    show={this.state.showAddUpdateModal}
                    updateModalData={this.state.updateModalData}
                    onHide={this.onCloseAddUpdateModal}
                    submit={this.submit}
                />
            </div>
        )
    }
}

export default PendingRequestList;