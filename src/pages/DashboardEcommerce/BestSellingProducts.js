import React from "react";
import { Link } from "react-router-dom";
import {
  Card,
  CardBody,
  CardHeader,
  Col,
  DropdownItem,
  DropdownMenu,
  DropdownToggle,
  UncontrolledDropdown,
} from "reactstrap";

const BestSellingProducts = ({ Comp }) => {
  return (
    <React.Fragment>
      <Col xl={6}>
        <Card>
          <CardHeader className="align-items-center d-flex">
            <h4 className="card-title mb-0 flex-grow-1">
              Best Selling Products
            </h4>
            <div className="flex-shrink-0">
              <Link
                to={"/product-list"}
                type="button"
                className="btn btn-soft-info btn-sm shadow-none"
              >
                <i className="ri-file-list-3-line align-middle"></i> View Stock
                Report
              </Link>
            </div>
          </CardHeader>

          <CardBody>
            <div className="table-responsive table-card">
              <table className="table table-hover table-centered align-middle table-nowrap mb-0">
                <tbody>
                  {Comp.bestSellingProducts &&
                    Comp.bestSellingProducts.map((item, key) => (
                      <tr key={key}>
                        <td>
                          <div className="d-flex align-items-center">
                            {/* <div className="avatar-sm bg-light rounded p-1 me-2">
                                                        <img src={item.img} alt="" className="img-fluid d-block" />
                                                    </div> */}
                            <div>
                              <h5 className="fs-14 my-1">
                                <Link
                                  to="/apps-ecommerce-product-details"
                                  className="text-reset"
                                >
                                  {item.product_english_name.length > 30
                                    ? `${item.product_english_name.slice(
                                        0,
                                        30
                                      )}...`
                                    : item.product_english_name}
                                </Link>
                              </h5>
                              <span className="text-muted">13-9-2023</span>
                            </div>
                          </div>
                        </td>
                        <td style={{ textAlign: "right" }}>
                          <h5 className="fs-14 my-1 fw-normal ">
                            Rs.{item.price_mrp}
                          </h5>
                          <span className="text-muted">MRP</span>
                        </td>
                        <td style={{ textAlign: "right" }}>
                          <h5 className="fs-14 my-1 fw-normal">
                            {item.price_sales}
                          </h5>
                          <span className="text-muted">Price</span>
                        </td>
                        <td style={{ textAlign: "right" }}>
                          <h5 className="fs-14 my-1 fw-normal">
                            {item.master_qty}
                          </h5>
                          <span className="text-muted">QTY</span>
                        </td>
                        <td style={{ textAlign: "right" }}>
                          <h5 className="fs-14 my-1 fw-normal">
                            Rs.
                            {(
                              item.price_sales * item.total_quantity_sold
                            ).toFixed(2)}
                          </h5>
                          <span className="text-muted">Amount</span>
                        </td>
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

export default BestSellingProducts;
