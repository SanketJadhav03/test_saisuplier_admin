import React, { useEffect, useState, useCallback } from "react";
import { Card, Modal, ModalHeader, ModalBody, Label, Input } from "reactstrap";
import "react-toastify/dist/ReactToastify.css";
import Select from "react-select";
import AuthUser from "../../helpers/Authuser";

const CustomerView = (props) => {
  // On form submit getCustomerData imported
  const { http } = AuthUser();
  const [CustomerGroup,setCustomerGroup]=useState([]);
  useEffect(()=>{
    http 
    .get("/all_customer_groups")
    .then(function(response){
      setCustomerGroup(response.data)
    }).catch(function(error){
      console.log(error);
  })
  },[])
  const [CustomersData, setCustomersData] = useState(props.edit_data);


  const OnSubmited = () => {
    
  };

  const [modal, setModal] = useState(false);

  const Close = () => {
    setModal(false);
    props.setModalStates();
  };

  useEffect(() => {
    setModal(false);
    toggle();
  }, [props.modalStates]);

  const toggle = useCallback(() => {
    if (modal) {
      setModal(false);
      props.setModalStates();
    } else {
      setModal(true);
    }
  }, [modal]);

  const SubmitData = () => {
    props.checkchang("Tax Create Successfully !!");
  };
  return (
    <div>
      <Modal id="showModal" size="xl" isOpen={modal} toggle={toggle} centered>
        <ModalHeader className="bg-light p-3" toggle={toggle}>
          View Customer
        </ModalHeader>
        <div className="tablelist-form">
          <ModalBody>
            <Card className="border card-border-success  p-3 shadow-lg">
              <div className="mb-3 row">
                <div className="col-4">
                  <Label
                    htmlFor="customername-field"
                    className="form-label mt-2 fw-bold"
                  >
                    Customer Name
                  </Label>
                  <Input
                    readOnly
                    value={CustomersData.customer_name}
                    name="customer_name"
                    id="customer_name"
                    className="form-control fw-bold"
                    placeholder="Customer Name"
                    type="text"
                  />
                </div>

                <div className="col-4">
                  <Label
                    htmlFor="customername-field"
                    className="form-label mt-2 fw-bold"
                  >
                    Mobile No.
                  </Label>
                  <Input
                  value={CustomersData.customer_mobile}
                    readOnly
                    name="customer_mobile"
                    id="customer_mobile"
                    className="form-control fw-bold"
                    placeholder="Mobile No"
                    type="text"
                  />
                </div>
                <div className="col-4">
                  <Label
                    htmlFor="customername-field"
                    className="form-label mt-2 fw-bold"
                  >
                    Email.
                  </Label>
                  <Input
                  value={CustomersData.customer_email}
                    readOnly
                    name="customer_email"
                    id="customer_email"
                    className="form-control fw-bold"
                    placeholder="Email"
                    type="text"
                  />
                </div>
                <div className="col-3">
                  <Label
                    htmlFor="customername-field"
                    className="form-label mt-2 fw-bold"
                  >
                    GST No.
                  </Label>
                  <Input
                  value={CustomersData.customer_gst_no}
                    readOnly
                    name="customer_gst_no"
                    id="customer_gst_no"
                    className="form-control fw-bold"
                    placeholder="Gst No"
                    type="text"
                  />
                </div>
                <div className="col-3">
                  <Label
                    htmlFor="customername-field"
                    className="form-label mt-2 fw-bold"
                  >
                    Pan No.
                  </Label>
                  <Input
                  value={CustomersData.customer_pan_no}
                    readOnly
                    name="customer_pan_no"
                    id="customer_pan_no"
                    className="form-control fw-bold"
                    placeholder="Pan No"
                    type="text"
                  />
                </div>
                <div className="col-3">
                  <Label
                    htmlFor="customername-field"
                    className="form-label mt-2 fw-bold"
                  >
                    Opening Balance.
                  </Label>
                  <Input
                  value={CustomersData.customer_opening_balance}
                    readOnly
                    name="customer_opening_balance"
                    id="customer_opening_balance"
                    className="form-control fw-bold"
                    placeholder="Opening Balance"
                    type="text"
                  />
                </div>
                <div className="col-3">
                  <Label
                    htmlFor="customername-field"
                    className="form-label mt-2 fw-bold"
                  >
                    Group Type
                  </Label>
                  <Input
                  readOnly
                  className="form-control fw-bold"
                  value={CustomersData.customer_group_name}
                  />
                </div>

                <div className="col-6">
                  <Label
                    htmlFor="customername-field"
                    className="form-label mt-3 fw-bold"
                  >
                    Billing Address
                  </Label>
                  <textarea
                  value={CustomersData.customer_billing_address}
                    readOnly
                    rows={3}
                    placeholder="Enter billing address"
                    className="form-control fw-bold"
                    name="customer_billing_address"
                    id="customer_billing_address"
                  />
                </div>
                <div className="col-6">
                  <Label
                    htmlFor="customername-field"
                    className="form-label mt-3  d-flex justify-content-between"
                  >
                    <div className="fw-bold">Shipping Address</div>
                    <div>same as billing address</div>
                  </Label>
                  <textarea
                  value={CustomersData.customer_shipping_address}
                    readOnly
                    rows={3}
                    placeholder="Enter shipping address"
                    className="form-control fw-bold"
                    name="customer_shipping_address"
                    id="customer_shipping_address"
                  />
                </div>

                <div className="col-4">
                  <Label
                    htmlFor="customername-field"
                    className="form-label mt-2 fw-bold"
                  >
                    City.
                  </Label>
                  <Input
                  value={CustomersData.customer_city}
                    readOnly
                    name="customer_city"
                    id="customer_city"
                    className="form-control fw-bold"
                    placeholder="City"
                    type="text"
                  />
                </div>

                <div className="col-4">
                  <Label
                    htmlFor="customername-field"
                    className="form-label mt-2 fw-bold"
                  >
                    Credit Limit
                  </Label>
                  <Input
                  value={CustomersData.customer_credit_limit}
                    readOnly
                    name="customer_credit_limit"
                    id="customer_credit_limit"
                    className="form-control fw-bold"
                    placeholder="Credit Limit"
                    type="text"
                  />
                </div>
                <div className="col-4">
                  <Label
                    htmlFor="customername-field"
                    className="form-label mt-2 fw-bold"
                  >
                    Credit Period(days)
                  </Label>
                  <Input
                  value={CustomersData.customer_credit_period_day}
                    readOnly
                    name="customer_credit_period_day"
                    id="customer_credit_period_day"
                    className="form-control fw-bold"
                    placeholder="Credit Period(days)"
                    type="text"
                  />
                </div>
              </div>
            </Card>
          </ModalBody>
          <div className="modal-footer">
            <div className="hstack gap-2 justify-content-end">
              <button
                name="close"
                id="close"
                type="button"
                className="btn btn-danger"
                onClick={() => Close()}
              >
                <i className="ri-close-line me-1 align-middle" />
                Close
              </button>
              
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default CustomerView;
