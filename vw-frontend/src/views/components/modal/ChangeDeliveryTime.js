import React, { Component } from "react";
import {
  Modal,
  Container,
  Row,
  Col,
  Button,
  Form,
  FormGroup,
} from "react-bootstrap";
import { FadeLoader } from "react-spinners";
import DatePicker from "./Simple";
import moment from "moment";
import { connect } from "react-redux";
import { update_order_delivery_time } from "../../../store/actionCreator";
import { ToastContainer, toast, Zoom } from "react-toastify";
import style from "@src/style/RoutesPlan.module.css";
import { Trans } from "react-i18next";

class ChangeDeliveryTime extends Component {
  constructor(props) {
    super(props);
    this.state = {
      validated: false,
      timeSlots: [],
      order_id: null,
      currentDate: null,
      dateFormat: "yyyy-MM-dd",
      currentTimeSlot: null,
      selectedTimeSlot: null,
      showModal: false,
      selected_day: null,
      selectedTimeSlotID: null
    };
  }

  componentDidMount() {

    if (this.state.currentDate == null) {
      let d = new Date()
      const event = new Date(d);
      const options = { weekday: 'short' };
      this.setState({
        currentDate: d,
        selected_day: event.toLocaleDateString(undefined, options)
      })
    }
  }

  showMessage = (message, type, autoClose = 2000) => {
    if (type == "error" || type == "ERROR") {
      type = "error"
    }

    this.setState({
      pageloading: false
    })
    return toast(this.props.t(message), {
      type: type,
      // autoClose: false,
      autoClose: autoClose,
      className:
        type === "error"
          ? style.toastContainer
          : style.toastContainerSuccess,
    });
  };

  renderFadeLoader = () => {
    return (
      <FadeLoader
        css={`
          cssdisplay: block;
          margin: 0 auto;
          border-color: red;
        `}
        size={150}
        color={"#123abc"}
        loading={this.state.sideloading}
      />
    );
  };
  static getDerivedStateFromProps(props, state) {
    if (props.timeslots && props.orderid && props.currenttimeslot) {
      if (state.selectedTimeSlot) {
        return {
          showModal: true,
          currentTimeSlot: state.selectedTimeSlot,
          timeSlots: props.timeslots,
          order_id: props.orderid,
        };
      } else {
        console.log("yes selected slot false");
        return {
          showModal: true,
          currentTimeSlot: props.currenttimeslot,
          timeSlots: props.timeslots,
          order_id: props.orderid,
        };
      }
    }
    return state;
  }
  handleSubmit = (e) => {
    //const formData = new FormData(e.target);
    if (this.state.selectedTimeSlot) {
      let data = {
        order_id: this.state.order_id,
        deliverytime: this.state.selectedTimeSlot,
        delivery_slot_id: this.state.selectedTimeSlotID,
        date: moment(this.state.currentDate).format("YYYY-MM-DD"),
      };
      let newData = JSON.stringify(data);
      this.props.updateOrderDeliveryApi(newData, this.props.selectedstore);
      e.preventDefault();
    }
    else {
      this.showMessage("Nothing to modify.", "error");
      this.setState({
        pageloading: false
      })

    }

    // axios
    //   .post(`${LOCAL_API_URL}updateOrderDelivery`, JSON.stringify(data))
    //   .then((res) => {
    //     let response = res.data;
    //     if (response.code === 200) {
    //       alert(response.message);
    //       this.setState({ selectedTimeSlot: null });
    //       this.props.onHide(false);
    //       this.props.changedeliveryslotid(this.state.order_id, deliverytime);
    //     } else {
    //       alert(response.message);
    //     }
    //   })
    //   .catch((error) => console.log(error));
  };

  handleDateChange = (date) => {
    const event = new Date(date);
    const options = { weekday: 'short' };
    this.setState({
      currentDate: date,
      selected_day: event.toLocaleDateString(undefined, options)
    });
  };
  handleRadioChange = (e) => {
    let val = e.target.value.split("_")
    this.setState({
      selectedTimeSlot: val[0],
      selectedTimeSlotID: val[1]
    });
  };
  render() {
    return (
      <Modal
        show={this.props.show}
        onHide={this.props.onHide}
        aria-labelledby="contained-modal-title-vcenter"
      >
        <Form
          noValidate
          validated={this.state.validated}
        // onSubmit={(e) => this.handleSubmit(e)}
        >
          <Modal.Header closeButton>
            <Modal.Title id="contained-modal-title-vcenter">
              <Trans i18nKey={"Change Delivery Time"} />
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Container>
              <Row>
                <table style={{ width: "70%" }}>
                  <caption style={{ captionSide: "top", }}><b><Trans i18nKey={"Current delivery details"} /></b></caption>
                  <tbody>
                    <tr>
                      <th><Trans i18nKey={"Date"} /></th>
                      <td>{this.props.order.delivery_date ? this.props.order.delivery_date : '-'}</td>
                      <th><Trans i18nKey={"Day"} /></th>
                      <td>{new Date(this.props.order.delivery_date).toLocaleDateString(undefined, { weekday: 'long' })}</td>
                      <th><Trans i18nKey={"Slot"} /></th>
                      <td>{this.props.currenttimeslot}</td>
                    </tr>
                  </tbody>

                </table>
              </Row>
              <br></br>
              <Row className="">
                <div>
                  <DatePicker
                    showTimeSelect={false}
                    title="Select Date"
                    currentDate={this.state.currentDate}
                    dateFormat={this.state.dateFormat}
                    onChange={this.handleDateChange}
                  ></DatePicker>
                </div>
              </Row>

              {this.state.timeSlots.length > 0
                ? this.state.timeSlots
                  .sort((a, b) => a.slot_id < b.slot_id)
                  .map((slot, key) => (
                    slot.day == this.state.selected_day && slot.title.length > 0 ? slot.title.map((slotel, keyel) => (
                      <Row key={keyel} className="show-grid">
                        <Col xs={6} md={10}>
                          <FormGroup keyel>
                            <Form.Check
                              type={`radio`}
                              ref={`changedelivery${keyel}`}
                              checked={
                                slotel === this.state.currentTimeSlot
                              }
                              onChange={this.handleRadioChange}
                              value={`${slotel}_${slot.slot_id}`}
                              name="changedelivery"
                              id={`default${keyel}`}
                              label={slotel}
                            />
                          </FormGroup>
                        </Col>
                      </Row>
                    )) : null

                  ))
                : null}
            </Container>
          </Modal.Body>
          <Modal.Footer>
            <Button onClick={this.handleSubmit} ><Trans i18nKey={"Submit form"} /></Button>
            <Button onClick={this.props.onHide}><Trans i18nKey={"Close"} /></Button>
          </Modal.Footer>
        </Form>
      </Modal>
    );
  }
}
const mapStateToProps = (state) => {
  return {
    updateOrderDeliveryResponse: state.live.updateOrderDeliveryResponse,
  };
};
const mapDispatchToProps = (dispatch) => {
  return {
    // getTripsApi: (date, store_id) => dispatch(get_trips_list(date, store_id)),
    updateOrderDeliveryApi: (data, store_id) =>
      dispatch(update_order_delivery_time(data, store_id)),
  };
};
export default connect(mapStateToProps, mapDispatchToProps)(ChangeDeliveryTime);
