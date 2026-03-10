import React, { useEffect, useCallback, useRef, useState } from "react";
import {
  Card,
  Modal,
  ModalHeader,
  ModalBody,
  Row,
  Col,
  Table,
  Badge,
  Button
} from "reactstrap";
import {
  X,
  ChevronRight,
  CheckCircle,
  Truck,
  DollarSign
} from "react-feather";
import axios from "axios";
import AuthUser from "../../helpers/Authuser";

const OrderDetailsModal = ({ order: orderProp, onClose }) => {
  const [modal, setModal] = useState(true);
  const {http,user} = AuthUser();
  const [activeTab, setActiveTab] = useState("details");
  const [items, setItems] = useState(orderProp.items || []);
  const closeButtonRef = useRef();
  const toggle = useCallback(() => {
    setModal(!modal);
  }, [modal]);
  

  // Fetch items from different API if master_type === 2
  useEffect(() => {
    const fetchItems = async () => {
      if (orderProp.master_bill_type === 2) {
        try {
           await http.post(
            `/pos/list/sample`,{user_id:user.user_id,master_id:orderProp.master_id}
          ).then((res)=>{
            console.log(res.data[0]);
          setItems(res.data || []);

          }).catch((e)=>{
            console.log(e);
            
          })
        } catch (error) {
          console.error("Error fetching alternate items:", error);
          setItems([]); // fallback
        }
      } else {
        setItems(orderProp.items || []);
      }
    };
    fetchItems();
  }, [orderProp]);

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.altKey && event.key === "Escape") {
        event.preventDefault();
        onClose();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  const parsedItems = items.map((item) => ({
    ...item,
    price: parseFloat(item.price) || 0,
    quantity: parseFloat(item.quantity) || 0
  }));

  const subtotal = parsedItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  const tax = parseFloat(orderProp.master_total_bill_amt) - subtotal || 0;
  const discount = 0; // No discount field in your data
  const total = parseFloat(orderProp.master_total_bill_amt) || 0;

  const orderStatus = orderProp.master_payment_mode_id === "1" ? "processing" : "completed";

  return (
    <Modal
      isOpen={modal}
      toggle={onClose}
      className="order-details-modal"
      contentClassName="border-0"
      size="xl"
      centered
    >
      <ModalHeader className="bg-white p-4 border-bottom" toggle={toggle}>
        <div className="d-flex justify-content-between w-100 align-items-center">
          <div>
            <h4 className="mb-1 fw-bold text-primary">
              Order #{orderProp.master_invoice_no || `INV-${orderProp.master_id}`}
            </h4>
            <p className="text-muted mb-0">
              <span className="me-3">
                <strong>Date:</strong> {orderProp.master_bill_date}
              </span>
              <span>
                <strong>Customer:</strong> {orderProp.user_name}
              </span>
            </p>
          </div>
        </div>
      </ModalHeader>

      <ModalBody className="p-0">
        <div className="d-flex">
          <div className="bg-light p-3" style={{ width: "200px", borderRight: "1px solid #eee" }}>
            <Button
              color={activeTab === "details" ? "primary" : "light"}
              className="w-100 mb-2 text-start d-flex align-items-center"
              onClick={() => setActiveTab("details")}
            >
              <ChevronRight size={16} className="me-2" />
              Order Details
            </Button>
            <Button
              color={activeTab === "payment" ? "primary" : "light"}
              className="w-100 text-start d-flex align-items-center"
              onClick={() => setActiveTab("payment")}
            >
              <ChevronRight size={16} className="me-2" />
              Payment Info
            </Button>
          </div>

          <div className="flex-grow-1 p-4">
            {activeTab === "details" && (
              <>
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <div>
                    <div
                      className={`px-4 py-1 text-sm shadow-lg font-semibold rounded-full
                      ${orderProp.master_bill_status === 1
                          ? "bg-warning text-white"
                          : orderProp.master_bill_status === 2
                            ? "bg-primary text-white"
                            : orderProp.master_bill_status === 3
                              ? "bg-info text-white"
                              : orderProp.master_bill_status === 4
                                ? "bg-success text-white"
                                : orderProp.master_bill_status === 5
                                  ? "bg-danger text-white"
                                  : "bg-success text-white"
                        }`}
                    >
                      {["Pending", "Approval", "Packing", "Dispatch", "Rejected", "Delivered"][orderProp.master_bill_status - 1] || "Delivered"}
                    </div>
                  </div>
                  <div
                    className={orderProp.master_payment_mode_id === "1"
                      ? "btn btn-sm rounded text-white shadow bg-success me-2"
                      : "btn btn-sm rounded text-white shadow bg-info me-2"}
                  >
                    {orderProp.master_payment_mode_id === "1" ? "Cash On Delivery" : "Online Payment"}
                  </div>
                </div>

                <Card className="border-0 shadow-sm">
                  <div className="p-3 border-bottom bg-light">
                    <h5 className="mb-0 fw-bold">Order Items</h5>
                  </div>
                  <div className="p-3">
                    <Table hover responsive className="mb-0">
                      <thead className="bg-light">
                        <tr>
                          <th width="5%">#</th>
                          <th>Item</th>
                          <th width="15%" className="text-end">Price</th>
                          <th width="10%" className="text-end">Qty</th>
                          <th width="15%" className="text-end">Total</th>
                        </tr>
                      </thead>
                      <tbody>
                        {parsedItems.length > 0 ? (
                          parsedItems.map((item, index) => (
                            <tr key={index}>
                              <td>{index + 1}</td>
                              <td>
                                <div className="d-flex align-items-center">
                                  <div className="me-3 bg-light rounded p-1" style={{ width: "40px", height: "40px" }}>
                                    <div className="w-100 h-100 d-flex align-items-center justify-content-center text-muted">
                                      {item.product_name?.charAt(0) || "P"}
                                    </div>
                                  </div>
                                  <div>
                                    <div className="fw-medium">{item.product_name}</div>
                                    <small className="text-muted">SKU: {item.sku || "N/A"}</small>
                                  </div>
                                </div>
                              </td>
                              <td className="text-end">₹{item.price.toFixed(2)}</td>
                              <td className="text-end">{item.quantity}</td>
                              <td className="text-end fw-medium">₹{(item.price * item.quantity).toFixed(2)}</td>
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td colSpan="5" className="text-center text-muted py-4">
                              No items in this order.
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </Table>
                  </div>
                </Card>

                <Row>
                  <Col md={6}>
                    <div className="bg-light shadow p-3 rounded mb-3">
                      <h5 className="mb-2 fw-bold">Customer Information</h5>
                      <p className="mb-1"><strong>Name:</strong> {orderProp.user_name}</p>
                      <p className="mb-1"><strong>Phone:</strong> {orderProp.user_phone || "N/A"}</p>
                      <p className="mb-0"><strong>Email:</strong> {orderProp.user_email || "N/A"}</p>
                    </div>
                    <div className="bg-light shadow p-3 rounded">
                      <h5 className="mb-2 fw-bold">Shipping Address</h5>
                      <p className="mb-1">{orderProp.master_address1}</p>
                      {orderProp.master_address2 && <p className="mb-1">{orderProp.master_address2}</p>}
                      <p className="mb-1">{orderProp.master_city}, {orderProp.master_state}</p>
                      <p className="mb-0">{orderProp.master_country}</p>
                    </div>
                  </Col>
                  <Col md={6}>
                    <div className="bg-light shadow p-3 rounded">
                      <h5 className="mb-2 fw-bold">Order Summary</h5>
                      <div className="d-flex justify-content-between mb-1">
                        <span>Items:</span>
                        <span>{orderProp.master_qty}</span>
                      </div>
                      <div className="d-flex justify-content-between mb-1">
                        <span>Subtotal:</span>
                        <span>₹{subtotal.toFixed(2)}</span>
                      </div>
                      {tax > 0 && (
                        <div className="d-flex justify-content-between mb-1">
                          <span>Tax:</span>
                          <span>₹{tax.toFixed(2)}</span>
                        </div>
                      )}
                      {discount > 0 && (
                        <div className="d-flex justify-content-between mb-1">
                          <span>Discount:</span>
                          <span>-₹{discount.toFixed(2)}</span>
                        </div>
                      )}
                      <div className="d-flex justify-content-between fw-bold mt-2 pt-2 border-top">
                        <span>Total:</span>
                        <span>₹{total.toFixed(2)}</span>
                      </div>
                    </div>
                  </Col>
                </Row>
              </>
            )}

            {activeTab === "payment" && (
              <div>
                <h5 className="mb-4 fw-bold">Payment Information</h5>
                <Card className="border-0 shadow-sm">
                  <div className="p-3 border-bottom bg-light">
                    <h6 className="mb-0 fw-bold">Payment Details</h6>
                  </div>
                  <div className="p-3">
                    <Row>
                      <Col md={6}>
                        <h6 className="fw-bold text-muted">Payment Method</h6>
                        <p>
                          {orderProp.master_payment_mode_id === "1"
                            ? "Cash on Delivery"
                            : "Online Payment"}
                        </p>
                      </Col>
                      <Col md={6}>
                        <h6 className="fw-bold text-muted">Payment Status</h6>
                        <Badge color={orderStatus === "completed" ? "success" : "warning"} pill>
                          {orderStatus === "completed" ? "Paid" : "Pending"}
                        </Badge>
                      </Col>
                    </Row>
                    <Row>
                      <Col md={6}>
                        <h6 className="fw-bold text-muted">Subtotal</h6>
                        <p>₹{subtotal.toFixed(2)}</p>
                      </Col>
                      <Col md={6}>
                        <h6 className="fw-bold text-muted">Tax</h6>
                        <p>₹{tax.toFixed(2)}</p>
                      </Col>
                    </Row>
                    <Row>
                      <Col md={6}>
                        <h6 className="fw-bold text-muted">Total Amount</h6>
                        <p className="fw-bold">₹{total.toFixed(2)}</p>
                      </Col>
                    </Row>
                  </div>
                </Card>
              </div>
            )}
          </div>
        </div>
      </ModalBody>

      <div className="modal-footer border-top bg-light p-2">
        <button
          ref={closeButtonRef}
          type="button"
          className="btn align-items-center d-flex text-white btn-danger"
          onClick={onClose}
        >
          Close
        </button>
      </div>
    </Modal>
  );
};

export default OrderDetailsModal;