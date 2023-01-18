import React, { useState } from "react";
import { Modal } from "react-bootstrap";
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";
const ZoomableImageModal = (props) => {
  return (
    <Modal show={props.isOpen} onHide={props.onHide} centered>
      <Modal.Header closeButton>
        <Modal.Title className="text-center"></Modal.Title>
      </Modal.Header>
      <Modal.Body style={{ height: "500px", overflowY: "auto" }}>
        <div className="d-flex align-items-center justify-content-center mb-2 pb-50">
          <TransformWrapper
            defaultScale={1}
            defaultPositionX={0}
            defaultPositionY={0}
          >
            <TransformComponent>
              {props.isPdf ? (
                <iframe
                  src={props.imgUrl}
                  frameBorder="0"
                  scrolling="auto"
                  style={{ width: "100%", height: "500px" }}
                ></iframe>
              ) : (
                <img src={props.imgUrl} style={{ width: "100%" }} />
              )}
            </TransformComponent>
          </TransformWrapper>
        </div>
      </Modal.Body>
    </Modal>
  );
};
export default ZoomableImageModal;
