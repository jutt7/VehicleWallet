// ** Third Party Components
import classnames from "classnames";
import usersGreen from "@src/assets/images/icons/users.png";
import Staff from "@src/assets/images/icons/driver-icon.png";

// ** Custom Components
import Avatar from "@components/avatar";

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
  const data = [
    {
      title: cols.stats.total_staff,
      subtitle: "Staff",
      color: "light-danger",
      icon: <img src={Staff} />,
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
    <Card className="card-statistics" style={{ height: "176px" }}>
      <CardHeader>
        <CardTitle tag="h4">Statistics</CardTitle>
      </CardHeader>
      <CardBody className="client-statistics-body">
        <Row>{renderData()}</Row>
      </CardBody>
    </Card>
  );
};

export default CustomerStats;
