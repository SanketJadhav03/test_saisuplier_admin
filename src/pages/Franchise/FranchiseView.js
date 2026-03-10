import React, { useEffect, useState, useCallback } from "react";
import { Card, Modal, ModalHeader, ModalBody, Label, Input } from "reactstrap";
import "react-toastify/dist/ReactToastify.css";
import Select from "react-select";
import AuthUser from "../../helpers/Authuser";

const FranchiseView = (props) => {
  // On form submit getFranchiseData imported
 
  const [FranchisesData, setFranchisesData] = useState(props.edit_data);


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
 
  return (
    <div>
      <Modal id="showModal" size="xl" isOpen={modal} toggle={toggle} centered>
        <ModalHeader className="bg-light p-3" toggle={toggle}>
          View Franchise
        </ModalHeader>
        <div className="tablelist-form">
          <ModalBody>
            <Card className="border card-border-success  p-3 shadow-lg">
              <div className="mb-3 row">
                <div className="col-4">
                  <Label
                    htmlFor="Franchisename-field"
                    className="form-label mt-2 fw-bold"
                  >
                    Franchise Name
                  </Label>
                  <Input
                    readOnly
                    value={FranchisesData.supplier_name}
                    name="supplier_name"
                    id="supplier_name"
                    className="form-control fw-bold"
                    placeholder="Franchise Name"
                    type="text"
                  />
                </div>

                <div className="col-4">
                  <Label
                    htmlFor="Franchisename-field"
                    className="form-label mt-2 fw-bold"
                  >
                    Mobile No.
                  </Label>
                  <Input
                  value={FranchisesData.supplier_mobile}
                    readOnly
                    name="supplier_mobile"
                    id="supplier_mobile"
                    className="form-control fw-bold"
                    placeholder="Mobile No"
                    type="text"
                  />
                </div>
                <div className="col-4">
                  <Label
                    htmlFor="Franchisename-field"
                    className="form-label mt-2 fw-bold"
                  >
                    Email.
                  </Label>
                  <Input
                  value={FranchisesData.supplier_email}
                    readOnly
                    name="supplier_email"
                    id="supplier_email"
                    className="form-control fw-bold"
                    placeholder="Email"
                    type="text"
                  />
                </div>
                <div className="col-3">
                  <Label
                    htmlFor="Franchisename-field"
                    className="form-label mt-2 fw-bold"
                  >
                    GST No.
                  </Label>
                  <Input
                  value={FranchisesData.supplier_gst_no}
                    readOnly
                    name="supplier_gst_no"
                    id="supplier_gst_no"
                    className="form-control fw-bold"
                    placeholder="Gst No"
                    type="text"
                  />
                </div>
                <div className="col-3">
                  <Label
                    htmlFor="Franchisename-field"
                    className="form-label mt-2 fw-bold"
                  >
                    Pan No.
                  </Label>
                  <Input
                  value={FranchisesData.supplier_pan_no}
                    readOnly
                    name="supplier_pan_no"
                    id="supplier_pan_no"
                    className="form-control fw-bold"
                    placeholder="Pan No"
                    type="text"
                  />
                </div>
                <div className="col-3">
                  <Label
                    htmlFor="Franchisename-field"
                    className="form-label mt-2 fw-bold"
                  >
                    Opening Balance.
                  </Label>
                  <Input
                  value={FranchisesData.supplier_opening_balance}
                    readOnly
                    name="supplier_opening_balance"
                    id="supplier_opening_balance"
                    className="form-control fw-bold"
                    placeholder="Opening Balance"
                    type="text"
                  />
                </div>
                <div className="col-3">
                  <Label
                    htmlFor="Franchisename-field"
                    className="form-label mt-2 fw-bold"
                  >
                    Group Type
                  </Label>
                  <Input
                  readOnly
                  className="form-control fw-bold"
                  value={FranchisesData.supplier_group_name}
                  />
                </div>

                <div className="col-6">
                  <Label
                    htmlFor="Franchisename-field"
                    className="form-label mt-3 fw-bold"
                  >
                    Billing Address
                  </Label>
                  <textarea
                  value={FranchisesData.supplier_billing_address}
                    readOnly
                    rows={3}
                    placeholder="Enter billing address"
                    className="form-control fw-bold"
                    name="supplier_billing_address"
                    id="supplier_billing_address"
                  />
                </div>
                <div className="col-6">
                  <Label
                    htmlFor="Franchisename-field"
                    className="form-label mt-3  d-flex justify-content-between"
                  >
                    <div className="fw-bold">Shipping Address</div>
                    <div>same as billing address</div>
                  </Label>
                  <textarea
                  value={FranchisesData.supplier_shipping_address}
                    readOnly
                    rows={3}
                    placeholder="Enter shipping address"
                    className="form-control fw-bold"
                    name="supplier_shipping_address"
                    id="supplier_shipping_address"
                  />
                </div>

                <div className="col-4">
                  <Label
                    htmlFor="Franchisename-field"
                    className="form-label mt-2 fw-bold"
                  >
                    City.
                  </Label>
                  <Input
                  value={FranchisesData.supplier_city}
                    readOnly
                    name="supplier_city"
                    id="supplier_city"
                    className="form-control fw-bold"
                    placeholder="City"
                    type="text"
                  />
                </div>

                <div className="col-4">
                  <Label
                    htmlFor="Franchisename-field"
                    className="form-label mt-2 fw-bold"
                  >
                    Credit Limit
                  </Label>
                  <Input
                  value={FranchisesData.supplier_credit_limit}
                    readOnly
                    name="supplier_credit_limit"
                    id="supplier_credit_limit"
                    className="form-control fw-bold"
                    placeholder="Credit Limit"
                    type="text"
                  />
                </div>
                <div className="col-4">
                  <Label
                    htmlFor="Franchisename-field"
                    className="form-label mt-2 fw-bold"
                  >
                    Credit Period(days)
                  </Label>
                  <Input
                  value={FranchisesData.supplier_credit_period_day}
                    readOnly
                    name="supplier_credit_period_day"
                    id="supplier_credit_period_day"
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

export default FranchiseView;
