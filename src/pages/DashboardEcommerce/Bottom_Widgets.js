import React from "react";
import { Link } from "react-router-dom";
import { Card, CardBody, Col } from "reactstrap";

const Bottom_Widgets = ({ Comp }) => {
  const ecomWidgets = [
    {
      id: 5,
      cardColor: "primary",
      label: "Total Supplier",
      counter: Comp.total_supplier,
      link: "View All Supplier",
      a: "/supplier-list",
      bgcolor: "success",
      icon: "bx bx-user",
    },
    {
      id: 6,
      cardColor: "secondary",
      label: "Total Brand",
      counter: Comp.total_brand,
      link: "View All Brand",
      a: "/brand-list",
      bgcolor: "info",
      icon: "bx bx-box",
      decimals: 0,
    },
    {
      id: 6,
      cardColor: "success",
      label: "Total Tax",
      counter: Comp.total_tax,
      link: "View All Taxes",
      a: "/tax-list",
      bgcolor: "warning",
      icon: "bx bx-file",
    },
    {
      id: 7,
      cardColor: "info",
      label: "Total Unit",
      counter: Comp.total_unit,
      link: "View All Unit",
      a: "/unit-list",
      bgcolor: "danger",
      icon: "bx bx-money",
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
                        {Number(item.counter || 0).toLocaleString(undefined, {
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

export default Bottom_Widgets;
