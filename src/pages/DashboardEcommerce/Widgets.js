import React from "react";
import { Link } from "react-router-dom";
import { Card, CardBody, Col } from "reactstrap";

const Widgets = ({ Comp }) => {
  const ecomWidgets = [
    {
      id: 1,
      cardColor: "primary",
      label: "Today Bills Amount",
      counter: Comp.totalAmountPos ? Comp.totalAmountPos : 0,
      link: "View All Bills",
      a: "/pos/list",
      bgcolor: "success",
      icon: "bx bx-printer",
    },
    {
      id: 3,
      cardColor: "success",
      label: "Total Product",
      counter: Comp.Product_count,
      link: "View All Product",
      a: "/product-list",
      bgcolor: "warning",
      icon: "bx bx-user-circle",
    },
    {
      id: 4,
      cardColor: "info",
      label: "Total Customer",
      counter: Comp.Customer_count,
      link: "View All Customer",
      a: "/user/list",
      bgcolor: "danger",
      icon: "bx bx-user",
    },
    {
      id: 11,
      cardColor: "info",
      label: "Total Users",
      counter: Comp.user_count ? Comp.user_count : 0,
      link: "View All Recepit",
      a: "/users-list",
      bgcolor: "danger",
      icon: "bx bx-user",
    },
  ];
  return (
    <React.Fragment>
      {ecomWidgets.map((item, key) => (
        <Col xl={3} md={6} key={key}>
          <Card className="card-animate">
            <CardBody>
              <div className="d-flex align-items-center">
                <div className="flex-grow-1 overflow-hidden">
                  <p className="text-uppercase fw-medium text-muted text-truncate mb-0">
                    {item.label}
                  </p>
                </div>
                <div className="flex-shrink-0">
                  <h5 className={"fs-14 mb-0 text-" + item.badgeClass}>
                    {item.badge ? (
                      <i className={"fs-13 align-middle " + item.badge}></i>
                    ) : null}{" "}
                    {item.percentage} %
                  </h5>
                </div>
              </div>
              <div className="d-flex align-items-end justify-content-between mt-4">
                <div>
                  <h4 className="fs-22 fw-semibold ff-secondary mb-4">
                    <span className="counter-value" data-target="559.25">
                      <span>
                        {item.prefix || ""}
                        {Number(item.counter || 0).toLocaleString("en-IN", {
                          minimumFractionDigits: item.decimals ?? 0,
                          maximumFractionDigits: item.decimals ?? 0,
                        })}
                        {item.suffix || ""}
                      </span>
                    </span>
                  </h4>
                  <Link to={item.a} className="text-decoration-underline">
                    {item.link}
                  </Link>
                </div>
                <div className="avatar-sm flex-shrink-0">
                  <span
                    className={"avatar-title rounded fs-3 bg-" + item.bgcolor}
                  >
                    <i className={`${item.icon}`}></i>
                  </span>
                </div>
              </div>
            </CardBody>
          </Card>
        </Col>
      ))}
    </React.Fragment>
  );
};

export default Widgets;
