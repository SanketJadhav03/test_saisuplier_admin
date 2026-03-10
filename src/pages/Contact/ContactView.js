import React, { useEffect, useState, useCallback } from "react";
import { Card, Modal, ModalHeader, ModalBody, Label, Input } from "reactstrap";
import "react-toastify/dist/ReactToastify.css";
import Select from "react-select";
import AuthUser from "../../helpers/Authuser";

const ContactView = (props) => {
  // On form submit getCustomerData imported
  const { http, permission } = AuthUser();
  const [CustomerGroup, setCustomerGroup] = useState([]);
  console.log(props.edit_data);

  useEffect(() => {
    http
      .get("/contact_us/list")
      .then(function (response) {
        setCustomerGroup(response.data);
      })
      .catch(function (error) {
        console.log(error);
      });
  }, []);
  const [CustomersData, setCustomersData] = useState(props.edit_data);

  const OnSubmited = () => {};

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
          View Contact Us
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
                    Contact Name
                  </Label>
                  <Input
                    readOnly
                    value={CustomersData.contact_us_name}
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
                    Contact Email.
                  </Label>
                  <Input
                    value={CustomersData.contact_us_email}
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
                    Contact Subject
                  </Label>
                  <Input
                    value={CustomersData.contact_us_subject}
                    readOnly
                    name="customer_gst_no"
                    id="customer_gst_no"
                    className="form-control fw-bold"
                    placeholder="Gst No"
                    type="text"
                  />
                </div>
                <div className="col-12">
                  <Label
                    htmlFor="customername-field"
                    className="form-label mt-2 fw-bold"
                  >
                    Contact Message
                  </Label>
                  <textarea
                    value={CustomersData.contact_us_message}
                    readOnly
                    name="customer_pan_no"
                    id="customer_pan_no"
                    className="form-control fw-bold"
                    placeholder="Pan No"
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

export default ContactView;
