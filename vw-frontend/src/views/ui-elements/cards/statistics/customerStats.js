// ** Third Party Components
import classnames from "classnames";
import usersGreen from "@src/assets/images/icons/users.png";
import vehiclesGreen from "@src/assets/images/icons/vehicles.png";
import driverGreen from "@src/assets/images/icons/driver-icon.png";
import stationGreen from "@src/assets/images/icons/client-station.png";
import { useEffect } from "react";

// ** Custom Components
import Avatar from "@components/avatar";

import { useTranslation } from "react-i18next";

// ** Reactstrap Importsp
import {
  Card,
  CardHeader,
  CardTitle,
  CardBody,
  CardText,
  Row,
  Col,
} from "reactstrap";

const CustomerStats = ({ cols }) => {
  const { t } = useTranslation();

  console.log(cols, "cols");
  const data = [
    {
      title: cols.stats.total_drivers,
      subtitle: "Drivers",
      color: "light-primary",
      icon: <img src={driverGreen} />,
    },
    {
      title: cols.stats.total_vehicles,
      subtitle: "Vehicles",
      color: "light-info",
      icon: <img src={vehiclesGreen} />,
    },
    {
      title: cols.stats.total_networks,
      subtitle: "Gas Stations",
      color: "light-danger",
      icon: <img src={stationGreen} />,
    },
    {
      title: cols.stats.total_users,
      subtitle: "Users",
      color: "light-success",
      icon: <img src={usersGreen} />,
    },
  ];

  const renderData = () => {
    return data.map((item, index) => {
      const colMargin = Object.keys(cols);
      const margin = index === 2 ? "sm" : colMargin[0];
      return (
        <Col
          key={index}
          {...cols}
          className={classnames({
            [`mb-2 mb-${margin}-0`]: index !== data.length - 1,
          })}
          style={{ marginTop: index == 2 || index == 3 ? "5px" : "0" }}
        >
          <div className="d-flex align-items-center">
            <Avatar color={item.color} icon={item.icon} className="me-2" />
            <div className="my-auto">
              <h4 className="fw-bolder mb-0">{item.title}</h4>
              <CardText className="font-small-3 mb-0">{item.subtitle}</CardText>
            </div>
          </div>
        </Col>
      );
    });
  };

  return (
    <Card className="card-statistics">
      <CardHeader>
        <CardTitle tag="h4">{t("Statistics")}</CardTitle>
      </CardHeader>
      <CardBody className="client-statistics-body">
        <Row>{renderData()}</Row>
      </CardBody>
    </Card>
  );
};

export default CustomerStats;
