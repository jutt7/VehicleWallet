import React from "react";
import { Modal } from "react-bootstrap";

class ApproveModal extends React.PureComponent {
  constructor(props) {
    super(props);
    // this.state = {
    // }
  }

  submit = () => {
    if (this.props.disableBtn) {
      return false;
    }
    this.props.submitAction();
  };

  render() {
    return (
      <Modal
        animation={true}
        show={this.props.show}
        onHide={this.props.onHide}
        centered
        size="sm"
      >
        <Modal.Header closeButton>
          <Modal.Title className="text-center">
            {this.props.confirmationHeading}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body style={{ overflowY: "auto" }}>
          <div>
            <p style={{ fontSize: "12px" }}>{this.props.confirmationText}</p>
            <button
              style={{ float: "right" }}
              type="button"
              onClick={this.submit}
              className="btn btn-primary"
            >
              Yes
            </button>
          </div>
        </Modal.Body>
      </Modal>
    );
  }
}

export default ApproveModal;
