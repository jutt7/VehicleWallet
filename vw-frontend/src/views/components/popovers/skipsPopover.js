import React, { Component } from 'react'
import { Col, Row } from 'react-bootstrap';
import * as FaIcons from 'react-icons/fa';
import * as IoIcons from 'react-icons/io';

export default class popover extends Component {
    constructor (props) {
        super(props);
    }

    render() {
        return (
            <div style={{width:"400px",overflowX:'hidden'}}>
                <Row>
                    <p style={{ fontWeight: "bold", width: '100%', fontSize: '15px', marginLeft: '15px' }}>
                        
                        <svg style={{marginRight: '5px', width: '20px'}} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512">
                                                <path style={{ fill: this.props.mapData.current_skip_level.color }} className="svgIcon" d="M560 160c10.38 0 17.1-9.75 15.5-19.88l-24-95.1C549.8 37 543.3 32 536 32h-98.88l25.62 128H560zM272 32H171.5L145.9 160H272V32zM404.5 32H304v128h126.1L404.5 32zM16 160h97.25l25.63-128H40C32.75 32 26.25 37 24.5 44.12l-24 95.1C-2.001 150.2 5.625 160 16 160zM560 224h-20L544 192H32l4 32H16C7.25 224 0 231.2 0 240v32C0 280.8 7.25 288 16 288h28L64 448v16C64 472.8 71.25 480 80 480h32C120.8 480 128 472.8 128 464V448h320v16c0 8.75 7.25 16 16 16h32c8.75 0 16-7.25 16-16V448l20-160H560C568.8 288 576 280.8 576 272v-32C576 231.2 568.8 224 560 224z" />
                                            </svg>
                        <span>Skip Level: {this.props.mapData.current_skip_level.skip_level}</span>
                    </p>
                    {/* <p style={{ width: '100%', fontSize: '12px', marginLeft: '15px',marginTop: '0',fontWeight: '400'}}>{this.props.mapData.address.address ? this.props.mapData.address.address : '('+this.props.mapData.data.Latitude+','+this.props.mapData.data.Longitude+')'}</p> */}
                    {/* <p style={{ marginTop: '1px',fontSize: '12px', marginLeft: '15px', marginBottom: '6px' }}>{this.props.mapData.updated_at}</p> */}
                </Row>
                <Row style={{background:"#0C5640", color: "white", padding: '10px',marginTop: '5px'}}>
                    <Col xl="12">
                        <FaIcons.FaUserAlt size={20} />&nbsp;
                        <span>{ this.props.mapData.customer.name }</span>
                    </Col>
                    <Col xl="12" style={{marginTop: '5px'}}>
                        <FaIcons.FaMapMarkedAlt size={22}/>&nbsp;
                        <span>{ this.props.mapData.address.address } </span>
                    </Col>
                </Row>
            </div>
        )
    }
}
