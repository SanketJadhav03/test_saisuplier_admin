import React, { useEffect, useState } from "react";
import {
  Card,
  CardBody,
  Col,
  Container,
  CardHeader,
  Nav,
  Row,
  Spinner,
} from "reactstrap";

import { ToastContainer } from "react-toastify";
import AuthUser from "../../helpers/Authuser";
import { Link } from "react-router-dom";

const StockList = () => {
  const { http } = AuthUser();
  const [Data, SetData] = useState([]);
  const [Loading, SetLoading] = useState(true);
  useEffect(() => {
    document.title = "Saisupplier Admin | Stock Report ";
    // ?page=${Pages}&limit=30
    http
      .get(`/stock/list`)
      .then(function (response) {
        SetData(response.data);
        SetLoading(false);
      })
      .catch(function (error) {
        console.log(error);
      });
  }, []);
  return (
    <React.Fragment>
      <Container fluid>
        <Row>
          <Col lg={12}>
            <Card>
              <CardHeader className="card-header border-0">
                <Row className="align-items-center gy-3">
                  <div className="col-sm">
                    <h5 className="card-title mb-0">Stock List</h5>
                  </div>
                  <div className="col-sm-auto">
                    <div className="d-flex gap-1 flex-wrap">
                      <Link to={"/dashbord"} className="btn btn-success">
                        DashBoard
                      </Link>
                    </div>
                  </div>
                </Row>
              </CardHeader>

              <CardBody className="pt-0">
                <div>
                  <Nav
                    className="nav-tabs nav-tabs-custom nav-success"
                    role="tablist"
                  ></Nav>
                  <div className="table-responsive">
                    <table
                      role="table"
                      className="align-middle table-nowrap table table-hover"
                    >
                      <thead className="table-light text-muted text-uppercase">
                        <tr>
                          <th
                            title="Toggle SortBy"
                            style={{ cursor: "pointer" }}
                          >
                            Sr No
                          </th>
                          <th
                            title="Toggle SortBy"
                            style={{ cursor: "pointer" }}
                          >
                            Product Name
                          </th>
                          <th
                            title="Toggle SortBy"
                            style={{ cursor: "pointer" }}
                          >
                            Opening QTY
                          </th>
                          <th
                            title="Toggle SortBy"
                            style={{ cursor: "pointer" }}
                          >
                            Opening Value
                          </th>

                          <th
                            title="Toggle SortBy"
                            style={{ cursor: "pointer" }}
                          >
                            Purchase QTY
                          </th>
                          <th
                            title="Toggle SortBy"
                            style={{ cursor: "pointer" }}
                          >
                            Purchase Value
                          </th>
                          <th
                            title="Toggle SortBy"
                            style={{ cursor: "pointer" }}
                          >
                            Sale QTY
                          </th>
                          <th
                            title="Toggle SortBy"
                            style={{ cursor: "pointer" }}
                          >
                            Sale Value
                          </th>
                          <th
                            title="Toggle SortBy"
                            style={{ cursor: "pointer" }}
                          >
                            Closing QTY
                          </th>
                          <th
                            title="Toggle SortBy"
                            style={{ cursor: "pointer" }}
                          >
                            Closing Value
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {Data.map((item, index) => (
                          <tr key={index}>
                            <td>
                              <a
                                className="fw-medium link-primary"
                                href="/apps-ecommerce-order-details"
                              >
                                {index + 1}
                              </a>
                            </td>
                            <td>{item.product_english_name}</td>
                            <td>
                              {item.prodcut_op_qty == null
                                ? 0
                                : item.prodcut_op_qty.toFixed(2)}
                            </td>
                            <td>
                              {item.prodcut_op_value == null
                                ? 0
                                : item.prodcut_op_value.toFixed(2)}
                            </td>
                            <td>
                              {item.total_purchase_qty === null
                                ? 0
                                : item.total_purchase_qty?.toFixed(2)}
                            </td>
                            <td>
                              {item.total_purchase_value === null
                                ? 0
                                : item.total_purchase_value.toFixed(2)}
                            </td>
                            <td>
                              {item.total_pos_sale_qty === null
                                ? 0
                                : item.total_pos_sale_qty.toFixed(2)}
                            </td>
                            <td>
                              {item.total_saleprice === null
                                ? 0
                                : item.total_saleprice.toFixed(2)}
                            </td>
                            <td>
                              {(
                                item.prodcut_op_qty +
                                item.total_purchase_qty -
                                item.total_pos_sale_qty
                              ).toFixed(2)}
                            </td>
                            <td>
                              {(
                                item.prodcut_op_value +
                                item.total_purchase_value -
                                item.total_sale_value
                              ).toFixed(2)}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  {Loading ? (
                    <Row>
                      <Col lg={12} className="text-center">
                        <Spinner animation="border" role="status"></Spinner>
                      </Col>
                    </Row>
                  ) : (
                    ""
                  )}
                </div>
              </CardBody>
            </Card>
          </Col>
        </Row>
        <ToastContainer closeButton={false} limit={1} />
      </Container>
    </React.Fragment>
  );
};

export default StockList;
