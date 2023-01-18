import { useState, forwardRef, useEffect } from "react";
import {
  Button,
  Media,
  Label,
  Row,
  Col,
  Input,
  FormGroup,
  Alert,
  Form,
} from "reactstrap";
import helper from "@src/@core/helper";

// export default function Upload (props) {
export default function Upload(props) {
  // console.log(props, "props");

  return (
    <div>
      <Media className="row">
        <Media className="col-sm-2" left style={{ width: "13%" }}>
          <Media
            object
            className="rounded mr-50"
            src={props.avatar}
            alt="Generic placeholder image"
            height="80"
            width="80"
          />
        </Media>
        <Media body style={{ marginTop: "10px" }}>
          <Button.Ripple
            tag={Label}
            className="mr-75"
            size="sm"
            color="primary"
          >
            Upload
            <Input
              type="file"
              onChange={props.onChange}
              hidden
              accept="image/* ,.pdf"
            />
          </Button.Ripple>
          <Button.Ripple
            color="secondary"
            size="sm"
            outline
            style={{ marginLeft: "5px", marginTop: "-3px" }}
            onClick={props.onReset()}
          >
            Reset
          </Button.Ripple>
          <p>Allowed PDF, JPG, GIF or PNG. Max size of 800kB</p>
        </Media>
      </Media>
    </div>
  );
}
