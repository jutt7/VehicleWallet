import React, { Component } from "react";
import {
  Modal,
  Container,
  Button,
  Form,
} from "react-bootstrap";
import { ToastContainer, toast, Zoom } from "react-toastify";
import style from "@src/style/OrderCancelModal.module.css";
import { connect } from "react-redux";
import {
  delete_delivery,
} from "../../../store/routeplan/actionCreator";
import { FOR_ROUTES_PALN_PAGE_MESSAGES } from "../../../store/Constants";
class OrderCancelModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      validated: false,
      tripId: null,
    };
  }
  componentDidUpdate(prevProps, prevState) {
    if (prevProps !== this.props) {
      if (this.props.canceldata) {
        this.setState({
          tripId: this.props.canceldata.delivery_trip_id,
        });
      } else {
        this.setState({
          tripId: null,
        });
      }
    }
    if (this.props.toastMessages) {
      const { forPage, messageId, type, message } = this.props.toastMessages;
      if (
        forPage === FOR_ROUTES_PALN_PAGE_MESSAGES &&
        messageId !== prevProps.toastMessages.messageId
      ) {
        this.props.cancelleddelivery(this.props.canceldata.delivery_trip_id);
        this.props.onHide();
        this.showMessage(message, type)
      }
    }
  }
  handleSubmit = (e) => {
    const data = {
      trip_id: `${this.props.canceldata.delivery_trip_id}`,
    };
    const newdata = JSON.stringify(data);
    this.props.deleteDeliveryApi(this.props.selectedBranchId, newdata);
    //  axios
    //    .post(`storesupervisor/v1/removeTrip`, newdata, {
    //      headers: {
    //        Authorization: `bearer ${localStorage.getItem("authtoken")}`,
    //      },
    //    })
    //    .then((res) => {
    //      let response = res.data;
    //      if (response.code === 200) {
    //        this.props.cancelleddelivery(this.state.tripId);
    //        this.props.onHide();
    //        this.showMessage(response.message, "success");
    //      } else {
    //        this.showMessage(response.message, "error");
    //      }
    //    })
    //    .catch((error) => console.log(error));
    e.preventDefault();
  };
  showMessage = (message, type, autoClose = 2000) => {
    if (type == "error" || type == "ERROR" || type == "ERRORMESSAGE") {
      type = "error"
    }
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
  render() {
    let t = this.props.t;
    let language = this.props.language;
    return (
      <React.Fragment>
        <ToastContainer
          transition={Zoom}
          position="top-center"
          // autoClose={1500}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnVisibilityChange
          draggable
          pauseOnHover
        />
        <Modal
          show={this.props.show}
          onHide={this.props.onHide}
          aria-labelledby="contained-modal-title-vcenter"
        >
          <Form
            noValidate
            validated={this.state.validated}
            onSubmit={(e) => this.handleSubmit(e)}
          >
            <Modal.Header closeButton>
              <Modal.Title
                id="contained-modal-title-vcenter"
                className="col-11 text-center"
              >
                {t("Cancel Delivery Trip")}
              </Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <Container>
                <h5 className="text-center">
                  {" "}
                  {t("Are you sure you want to delete trip??")}
                </h5>
              </Container>
            </Modal.Body>
            <Modal.Footer>
              <Button type="submit" className="btn btnGreen">
                {t("Yes")}
              </Button>
              <Button className="btn bg-aquaGreen" onClick={this.props.onHide}>
                {t("No")}
              </Button>
            </Modal.Footer>
          </Form>
        </Modal>
      </React.Fragment>
    );
  }
}
const mapStateToProps = (state) => {
  return {
    toastMessages: state.toastmessages,
    selectedBranchId: state.navbar.selectedBranch,
  };
};
const mapDispatchToProps = (dispatch) => {
  return {
    deleteDeliveryApi: (branchId, data) =>
      dispatch(delete_delivery(branchId, data)),
  };
};
export default connect(mapStateToProps, mapDispatchToProps)(OrderCancelModal);
