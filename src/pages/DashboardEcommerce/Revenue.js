import React, { useEffect, useState } from "react";
import {
  Card,
  CardBody,
  CardHeader,
  Col,
  DropdownItem,
  DropdownMenu,
  DropdownToggle,
  Row,
  UncontrolledDropdown,
} from "reactstrap";
import { RevenueCharts } from "./DashboardEcommerceCharts"; 
import AuthUser from "../../helpers/Authuser";

const Revenue = () => {
  const [ValueChck, SetValueChck] = useState("Today");
  const [chartData, SetchartData] = useState([]);
  const [Comp, SetComp] = useState({});
  const { http } = AuthUser();
  useEffect(() => {
    http
      .get(`/dashbord/${ValueChck}`)
      .then(function (response) {
        SetComp(response.data.childArray);
        SetchartData([
          {
            name: " ",
            type: "area",
            data: [0],
          },
          {
            name: " ",
            type: "bar",
            data: response.data.dailyTotals,
          },
          {
            name: " ",
            type: "line",
            data: [0],
          },
        ]);
      })
      .catch(function (error) {
        console.log(error);
      });
  }, [ValueChck]);

  const onChangeChartPeriod = (pType) => {
    SetValueChck(pType);
  };

  return (
    <React.Fragment>
      <Card>
        <CardHeader className="border-0 align-items-center d-flex">
          <h4 className="card-title mb-0 flex-grow-1">POS Billing Summary</h4>
          <div className="flex-shrink-0">
            <UncontrolledDropdown className="card-header-dropdown">
              <DropdownToggle
                tag="a"
                className="text-reset dropdown-btn"
                role="button"
              >
                <span className="fw-semibold text-uppercase fs-12">
                  Sort by : {ValueChck}
                </span>
                <span className="text-muted">
                  <i className="mdi mdi-chevron-down ms-1"></i>
                </span>
              </DropdownToggle>
              <DropdownMenu className="dropdown-menu-end">
                <DropdownItem
                  onClick={() => {
                    onChangeChartPeriod("Today");
                  }}
                  className={ValueChck == "Today" ? "active" : ""}
                >
                  Today
                </DropdownItem>
                <DropdownItem
                  onClick={() => {
                    onChangeChartPeriod("Weekly");
                  }}
                  className={ValueChck == "Weekly" ? "active" : ""}
                >
                  Weekly
                </DropdownItem>
                <DropdownItem
                  onClick={() => {
                    onChangeChartPeriod("Monthly");
                  }}
                  className={ValueChck == "Monthly" ? "active" : ""}
                >
                  Monthly
                </DropdownItem>
                <DropdownItem
                  onClick={() => {
                    onChangeChartPeriod("Yearly");
                  }}
                  className={ValueChck == "Yearly" ? "active" : ""}
                >
                  Yearly
                </DropdownItem>
              </DropdownMenu>
            </UncontrolledDropdown>
          </div>
        </CardHeader>

        <CardHeader className="p-0 border-0 bg-light-subtle">
          <Row className="g-0 text-center">
            <Col xs={6} sm={3}>
              <div className="p-3 border border-dashed border-start-0">
                <h5 className="mb-1">
                  <span>
                    Rs.{Comp ? Number(Comp.cash_amount).toFixed(2) : "0.00"}
                  </span>
                </h5>
                <p className="text-muted mb-0">Cash Bills Amount</p>
              </div>
            </Col>
            <Col xs={6} sm={3}>
              <div className="p-3 border border-dashed border-start-0">
                <h5 className="mb-1">
                  <span>
                    Rs.{parseFloat(Comp?.total_online || 0).toFixed(2)}
                  </span>
                </h5>
                <p className="text-muted mb-0">Onlile Bills Amount</p>
              </div>
            </Col>
            <Col xs={6} sm={3}>
              <div className="p-3 border border-dashed border-start-0">
                <h5 className="mb-1 text-danger">
                  <span>
                    Rs.{parseFloat(Comp?.credit_amount || 0).toFixed(2)}
                  </span>
                </h5>
                <p className="text-muted mb-0">Credit Bills Amount</p>
              </div>
            </Col>
            <Col xs={6} sm={3}>
              <div className="p-3 border border-dashed border-start-0 border-end-0">
                <h5 className="mb-1 text-success">
                  <span>
                    Rs.{parseFloat(Comp?.totalAmountPos || 0).toFixed(2)}
                  </span>
                </h5>
                <p className="text-muted mb-0">Total Amount</p>
              </div>
            </Col>
          </Row>
        </CardHeader>

        <CardBody className="p-0 pb-2">
          <div className="w-100">
            <div dir="ltr">
              <RevenueCharts
                series={chartData}
                check={ValueChck}
                dataColors='["--vz-white", "--vz-primary", "--vz-white"]'
              />
            </div>
          </div>
        </CardBody>
      </Card>
    </React.Fragment>
  );
};

export default Revenue;
