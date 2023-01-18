import { useState } from "react";
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

export default function Upload(props) {
  // console.log(props, "props");
  const [avatar, setAvatar] = useState(
    !helper.isEmptyString(props.cr_photo)
      ? props.cr_photo
      : require("@src/assets/images/portrait/small/avatar-blank.png").default
  );

  const onChange = (e) => {
    const reader = new FileReader(),
      files = e.target.files;
    reader.onload = function () {
      setAvatar(reader.result);
      props.onInputchange(reader.result, "cr_photo");
    };
    reader.readAsDataURL(files[0]);
  };

  const onReset = () => {
    setAvatar(
      require("@src/assets/images/portrait/small/avatar-blank.png").default
    );
    props.onInputchange("", "cr_photo");
  };

  return (
    <div>
      <p>Upload CR Certificate</p>
      <Media className="row">
        <Media className="col-sm-2" left>
          <Media
            object
            className="rounded mr-50"
            src={avatar}
            alt="Generic placeholder image"
            height="80"
            width="80"
          />
        </Media>
        <Media
          className="col-sm-5"
          body
          style={{ marginTop: "10px", marginLeft: "60px" }}
        >
          <Button.Ripple
            tag={Label}
            className="mr-75"
            size="sm"
            color="primary"
          >
            Upload
            <Input type="file" onChange={onChange} hidden accept="image/*" />
          </Button.Ripple>
          <Button.Ripple
            color="secondary"
            size="sm"
            outline
            style={{ width: "61px" }}
            onClick={onReset}
          >
            Reset
          </Button.Ripple>
        </Media>
      </Media>
    </div>
  );
}
