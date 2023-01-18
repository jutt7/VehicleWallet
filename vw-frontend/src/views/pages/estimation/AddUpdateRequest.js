import React from 'react'
import { Modal, Container, Row, Col } from 'react-bootstrap';
import helper from '../../../../Helper/helper';
import { Button } from 'rsuite';

class AddUpdateRequest extends React.PureComponent {
    constructor(props) {
        super(props);

        this.state = {
            error : {
                vehicle_count: '',
                labour_count: '',
            },
            form: {
                vehicle_count: 0,
                labour_count: 0,
            }
        }
    }

    render() {
        return (
            <Modal show={this.props.show} onHide={this.props.onHide} onShow={this.setUpdateFormValues} centered size="lg">
                <Modal.Header closeButton>
                    <Modal.Title className="text-center">Send Feedback</Modal.Title>
                </Modal.Header>
                <Modal.Body style={{ height: '400px', overflowY: 'auto' }}>
                    <div>
                        <Container>
                             <Row>
                                <Col>
                                    <div className="form-group">
                                        <label>No of Vehicles<span style={{ color: "red" }}>*</span></label>
                                        <input type="text" autoComplete="off" name="vehicle_count" value={this.state.form.vehicle_count} onChange={e => this.onInputchange(e)} className="form-control" placeholder="No. of Vehicles" />
                                        <p style={{ color: "red" }}>{this.state.error.vehicle_count ? this.state.error.vehicle_count : ''}</p>
                                    </div>
                                </Col>
                            </Row>
                            <Row>
                                <Col>
                                    <div className="form-group">
                                        <label>No of Labour <span style={{ color: "red" }}>*</span></label>
                                        <input type="text" autoComplete="off" name="labour_count" value={this.state.form.labour_count} onChange={e => this.onInputchange(e)} className="form-control" placeholder="No. of Labour" />
                                        <p style={{ color: "red" }}>{this.state.error.labour_count ? this.state.error.labour_count : ''}</p>
                                    </div>
                                </Col>
                            </Row>
                            <Row>
                            </Row>
                        </Container>
                    </div>
                </Modal.Body>
                <Modal.Footer>
                    <Button onClick={this.submit} ><i className="fas fa-check"></i> {helper.isObject(props.updateModalData) ? "Update" : "Submit" }</Button>
                </Modal.Footer>
            </Modal>
        );
    }
}

export default AddUpdateRequest;