import React from "react";
import { Link } from "react-router-dom";
import { Card, CardBody, CardHeader, Col } from "reactstrap";

const TopSellers = ({ Comp }) => {
  return (
    <React.Fragment>
      <Col xl={6}>
        <Card className="card-height-100">
          <CardHeader className="align-items-center d-flex">
            <h4 className="card-title mb-0 flex-grow-1">Top Customers</h4>
            <div className="flex-shrink-0">
              <Link
                to={"/customer-list"}
                type="button"
                className="btn btn-soft-info btn-sm shadow-none"
              >
                <i className="ri-file-list-3-line align-middle"></i> View Report
              </Link>
            </div>
          </CardHeader>

          <CardBody>
            <div className="table-responsive table-card">
              <table className="table table-centered table-hover align-middle table-nowrap mb-0">
                <tbody>
                  {Comp.TopCustomers &&
                    Comp.TopCustomers.map((item, key) => (
                      <tr key={key}>
                        <td>
                          <div className="d-flex align-items-center">
                            {/* <div className="flex-shrink-0 me-2">
                                                        <img src={item.img} alt="" className="avatar-sm p-2" />
                                                    </div> */}
                            <div>
                              <h5 className="fs-14 my-1 fw-medium">
                                <Link
                                  to="/apps-ecommerce-seller-details"
                                  className="text-reset"
                                >
                                  {item.customer_name}
                                </Link>
                              </h5>
                              <span className="text-muted">Customer Name</span>
                            </div>
                          </div>
                        </td>

                        <td style={{ textAlign: "right" }}>
                          <p className="mb-0">{item.total_purchase_amount}</p>
                          <span className="text-muted">Total Purchase</span>
                        </td>
                        <td style={{ textAlign: "right" }}>
                          <p className="mb-0">{item.customer_credit_amount}</p>
                          <span className="text-muted">Total Credit</span>
                        </td>

                        {/* <td>
                          <h5 className="fs-14 mb-0">
                            {item.total_mrp_amount - item.total_purchase_amount}
                            <i className="ri-bar-chart-fill text-success fs-16 align-middle ms-2"></i>
                          </h5>
                          <span className="text-muted">Total Profit</span>
                        </td> */}
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
            {/* <div className="align-items-center mt-4 pt-2 justify-content-between row text-center text-sm-start">
              <div className="col-sm">
                <div className="text-muted">
                  Showing <span className="fw-semibold">5</span> of{" "}
                  <span className="fw-semibold">25</span> Results
                </div>
              </div>
              <div className="col-sm-auto mt-3 mt-sm-0">
                <ul className="pagination pagination-separated pagination-sm mb-0">
                  <li className="page-item disabled">
                    <Link to="#" className="page-link">
                      ←
                    </Link>
                  </li>
                  <li className="page-item">
                    <Link to="#" className="page-link">
                      1
                    </Link>
                  </li>
                  <li className="page-item active">
                    <Link to="#" className="page-link">
                      2
                    </Link>
                  </li>
                  <li className="page-item">
                    <Link to="#" className="page-link">
                      3
                    </Link>
                  </li>
                  <li className="page-item">
                    <Link to="#" className="page-link">
                      →
                    </Link>
                  </li>
                </ul>
              </div>
            </div> */}
          </CardBody>
        </Card>
      </Col>
    </React.Fragment>
  );
};

export default TopSellers;
