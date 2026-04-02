import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Card, CardBody, CardHeader, Col } from "reactstrap";

const RecentOrders = ({ Comp }) => {
  const [invoiceDetails] = useState(
    JSON.parse(sessionStorage.getItem("authUser")).invoiceDetails.intial_latter
  );
  return (
    <React.Fragment>
      <Col xl={4}>
        <Card>
          <CardHeader className="align-items-center d-flex">
            <h4 className="card-title mb-0 flex-grow-1">Recent POS Bills</h4>
            <div className="flex-shrink-0">
              <Link
                to={"/invoice"}
                type="button"
                className="btn btn-soft-info btn-sm shadow-none"
              >
                <i className="ri-file-list-3-line align-middle"></i> View All
                Bills
              </Link>
            </div>
          </CardHeader>

          <CardBody>
            <div className="table-responsive table-card">
              <table className="table table-borderless table-centered align-middle table-nowrap mb-0">
                <thead
                  className="text-muted table-light text-center "
                  style={{
                    fontSize: 13,
                  }}
                >
                  <tr>
                    <th scope="col">
                      Invoice <br /> No
                    </th>
                    <th scope="col">
                      Customer <br /> Name
                    </th>
                    <th scope="col">
                      Payment <br /> Type
                    </th>
                    <th scope="col">
                      Bill <br /> Amount
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {Comp.pos_recent_bill &&
                    Comp.pos_recent_bill.map((item, key) => (
                      <tr key={key}>
                        <td>
                          {item.master_invoice_no}
                        </td>
                        <td style={{ maxWidth: "130px" }}>
                          <div className="d-flex align-items-center">
                            <div
                              style={{
                                maxWidth: "130px",
                                whiteSpace: "normal",
                                wordWrap: "break-word",
                                wordBreak: "break-word",
                              }}
                            >
                              {item.user_type == 1
                                ? item.user_name
                                : item.master_name}
                              {item.user_type == 3
                                ? ` - ${item.master_branch_name}`
                                : " "}
                              {item.user_type == 3
                                ? ` - ${item.master_branch_code}`
                                : " "}
                            </div>
                          </div>
                        </td>

                        <td>
                          <span
                            style={{
                              maxWidth: "100px",
                              whiteSpace: "normal",
                              wordWrap: "break-word",
                              wordBreak: "break-word",
                            }}
                            className={`badge bg-${
                              item.payment_type == "Cash" ? "success" : "danger"
                            }`}
                          >
                            {item.payment_type}
                          </span>
                        </td>
                        <td style={{ textAlign: "right" }}>
                          <span className="text-success">
                            Rs.
                            {parseFloat(
                              Number(item.gstTotal || 0) +
                                Number(item.master_total_bill_amt)
                            ) + parseFloat(item.other_charge_amount)}
                          </span>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </CardBody>
        </Card>
      </Col>
    </React.Fragment>
  );
};

export default RecentOrders;
