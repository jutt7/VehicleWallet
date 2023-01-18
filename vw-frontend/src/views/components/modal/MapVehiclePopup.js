import React from 'react';
import helper from '@src/@core/helper';
import { Row, Col } from 'react-bootstrap';
import jwtDefaultConfig from "@src/@core/auth/jwt/jwtDefaultConfig"
import * as IoIcons from 'react-icons/io';

const MapVehiclePopup = (props) => {

    return (
        <div>
            {
                helper.isObject(props.rowData) ?
                    <div style={{width:"350px",overflowX:'hidden'}}>
                        <Row>
                            <Col>
                                {
                                    props.rowData && props.rowData.icon != null
                                        ?
                                        <img src={(props.rowData.icon) ? jwtDefaultConfig.BASE_IMAGE_URL + props.rowData.icon : ''}
                                            width={40} height={30} />
                                        :
                                        <IoIcons.IoIosCar size={40} />
                                }
                            </Col>
                        </Row>
                        <Row>
                            <Col className='paddingLeftCol'>
                                <label><b>Vehicle Id:</b></label>
                                <label>{props.rowData.vehicle_id}</label>
                            </Col>
                            <Col className='paddingZero'>
                                <label><b>Plate No:</b></label>
                                <label>{props.rowData.number_plate}</label>
                            </Col>
                        </Row>
                        <Row>
                            <Col className='paddingLeftCol'>
                                <label><b>Vehicle Code:</b></label>
                                <label>{props.rowData.vehicle_code}</label>
                            </Col>
                            <Col className='paddingZero'>
                                <label><b>Vehicle Category:</b></label>
                                <label>{props.rowData.vehicle_category_name.en}</label>
                            </Col>
                        </Row>
                        <Row>
                            <Col className='paddingLeftCol'>
                                <label><b>Driver Id:</b></label>
                                <label>{props.rowData.driver_id}</label>
                            </Col>
                            <Col className='paddingZero'>
                                <label><b>Driver Name:</b></label>
                                <label>{props.rowData.driver_name}</label>
                            </Col>
                        </Row>
                    </div>
                    :
                    ''
            }
        </div>
    );
}

export default MapVehiclePopup;