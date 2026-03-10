import React, { useState, useEffect } from "react";
import { Col, Container, Row } from "reactstrap";
import Revenue from "./Revenue";
import RecentOrders from "./RecentOrders";
import TopSellers from "./TopSellers";
import BestSellingProducts from "./BestSellingProducts";
import Widget from "./Widgets";
import Bottom_Widgets from "./Bottom_Widgets";
import Section from "./Section";
import AuthUser from "../../helpers/Authuser";

const DashboardEcommerce = () => { 
  const [rightColumn, setRightColumn] = useState(true);
  const toggleRightColumn = () => {
    setRightColumn(!rightColumn);
  };
  const { http,permission } = AuthUser();
  const [Data, SetData] = useState({});
  useEffect(() => {
    document.title = "Saisupplier Admin | Dashboard";
    http
      .get(`/dashbord`)
      .then(function (response) {
        SetData(response.data);
      })
      .catch(function (error) {
        console.log(error);
      });
  }, []);
  return (
    <React.Fragment>
      <div className="page-content">

        <Container fluid>
          <Row>
            <Col>
            {permission.find(permission => permission.permission_category === "DASHBOARD" && permission.permission_path === "0") &&
              <div className="h-100">
                <Section rightClickBtn={toggleRightColumn} />
                <Row>
                  <Widget Comp={Data} />
                </Row>
                <Row>
                  <Col xl={8}>
                    <Revenue />
                  </Col>
                  <RecentOrders Comp={Data} />
                </Row>
                {/* <Row>
                  <BestSellingProducts Comp={Data} />
                  <TopSellers Comp={Data} />
                </Row> */}
                {/* <Row>
                  <Bottom_Widgets Comp={Data} />
                </Row> */}
              </div>
            }
            <div>
               
            </div>
            </Col>
          </Row>
        </Container>
      </div>
    </React.Fragment>
  );
};

export default DashboardEcommerce;
