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
import { useTranslation } from "react-i18next";

export default function Upload(props) {
  const { t } = useTranslation();
  console.log(props, "props");
  const [avatar, setAvatar] = useState(
    !helper.isEmptyString(props.photo)
      ? props.photo
      : require("@src/assets/images/portrait/small/avatar-blank.png").default
  );

  const onChange = (e) => {
    const reader = new FileReader(),
      files = e.target.files;

    if (files[0].size > 800000) {
      helper.toastNotification(
        "Image size sould be less than 800kb",
        "FAILED_MESSAGE"
      );
    } else {
      reader.onload = function () {
        setAvatar(reader.result);
        props.onInputchange(reader.result, "photo");
      };
      reader.readAsDataURL(files[0]);
    }
  };

  const onReset = () => {
    setAvatar(
      require("@src/assets/images/portrait/small/avatar-blank.png").default
    );
    props.onInputchange("", "photo");
  };

  return (
    <div>
      <Media className="row">
        <Media className="col-sm-2" left style={{ width: "13%" }}>
          <Media
            object
            className="rounded mr-50"
            src={avatar}
            alt="Generic placeholder image"
            height="80"
            width="80"
          />
        </Media>
        <Media className="col-sm-5" body style={{ marginTop: "10px" }}>
          <Button.Ripple
            tag={Label}
            className="mr-75"
            size="sm"
            color="primary"
          >
            {t("Upload")}
            <Input type="file" onChange={onChange} hidden accept="image/*" />
          </Button.Ripple>
          <Button.Ripple
            color="secondary"
            size="sm"
            outline
            style={{ marginLeft: "5px", marginTop: "-3px" }}
            onClick={onReset}
          >
            {t("Reset")}
          </Button.Ripple>
          <p>{t("Allowed JPG, GIF or PNG. Max size of 800kB")}</p>
        </Media>
      </Media>
    </div>
  );
}
