import React, { useEffect, useState, useCallback, useRef } from "react";
import { Card, Modal, ModalHeader, ModalBody, Label, Input } from "reactstrap";
import "react-toastify/dist/ReactToastify.css";
import AuthUser from "../../helpers/Authuser";
import CustomInput from "../Unit/Input";

const OtherChargAdd = (props) => {
  const [modal, setModal] = useState(false);
  const { http } = AuthUser();
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
  // Store data
  const [checkNameStatus, setCheckStatus] = useState({});
  const [msg, setMsg] = useState("");
  const [expensesType, SetExpenses] = useState("");
  const SubmitData = () => {
    if (expensesType == "") {
      setCheckStatus({
        borderColor: "red",
        borderStyle: "groove",
      });
      setMsg("Other Charge connot be empty!");
    } else {
      http
        .post("/expenses/store", { expenses_type: expensesType })
        .then(function (response) {
          props.checkchang(response.data.message, response.data.status);
        })
        .catch(function (error) {
          console.log(error);
        });
    }
  };

  const handleExpenses = (e) => {
    SetExpenses(e.target.value);
    if (expensesType != "") {
      setCheckStatus({});
      setMsg("");
    }
  };

  // shortcuts to save and close modal
  const submitButtonRef = useRef();
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.altKey && event.key === "Escape") {
        event.preventDefault();
        props.setModalStates(true);
      }
      if (
        (event.altKey && event.key === "s") ||
        (event.altKey && event.key === "S")
      ) {
        event.preventDefault();
        submitButtonRef.current.click();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  return (
    <div>
      <Modal id="showModal" isOpen={modal} size="xl" toggle={toggle} centered>
        <ModalHeader className="bg-light p-3" toggle={toggle}>
          Add Other Charge
        </ModalHeader>
        <span className="tablelist-form">
          <ModalBody>
            <Card className="border card-border-success p-3 shadow-lg">
              {/* <div className="mb-3">
                <Label
                  htmlFor="categoryname-field"
                  className="form-label fw-bold d-flex justify-content-between"
                >
                  <div>
                    Other Charge Name<span style={{ color: "red" }}> *</span>
                  </div>
                  <div style={{ color: "red" }}>{msg}</div>
                </Label>
                <CustomInput
                  checkNameStatus={checkNameStatus}
                  name="category"
                  id="category-field"
                  className="form-control fw-bold"
                  placeholder="Other Charge Name"
                  type="text"
                  onChange={handleExpenses}
                />
              </div> */}
              <div className="mb-3 row">
                <div className="col-6">
                  <Label
                    htmlFor="customername-field"
                    className="form-label mt-2 fw-bold"
                  >
                    Other Charge Name
                  </Label>
                  <Input
                    name="intial_latter"
                    id="supplier_mobile"
                    className="form-control fw-bold"
                    placeholder="Enter......."
                    type="text"
                    onChange={(e) => {}}
                  />
                </div>
                <div className="col-6">
                  <div className="d-flex justify-content-center">
                    <Label
                      htmlFor="customername-field"
                      className="form-label mt-2 fw-bold"
                    >
                      Types of Charges
                    </Label>
                  </div>
                  <div className="d-flex justify-content-center">
                    <label className="mx-2">
                      <input
                        type="radio"
                        name="chargeType"
                        value="addition"
                        className="fs-3"
                        onChange={(e) => {}}
                      />
                      <span className="fs-3">(+)</span>
                    </label>
                    <label className="mx-2">
                      <input
                        type="radio"
                        name="chargeType"
                        value="deduction"
                        className="fs-3"
                        onChange={(e) => {}}
                      />
                      <span className="fs-3">(-)</span>
                    </label>
                  </div>
                </div>
              </div>

              <div className="row mt-2">
                <div className="col-5 ">
                  <Label
                    htmlFor="customername-field"
                    className="form-label mt-2 fw-bold"
                  >
                    Amount of Charges
                  </Label>
                  <div className="d-flex">
                    <label className="mx-2">
                      <input
                        type="radio"
                        name="amountType"
                        className="mx-1"
                        value="absolute"
                        onChange={(e) => {
                          console.log("absolute");
                        }}
                      />
                      Absolute
                    </label>
                    <label className="mx-2">
                      <input
                        type="radio"
                        name="amountType"
                        className="mx-1"
                        value="qty"
                        onChange={(e) => {
                          console.log("qty");
                        }}
                      />
                      QTY
                    </label>
                    <label className="mx-2">
                      <input
                        type="radio"
                        name="amountType"
                        className="mx-1"
                        value="percentage"
                        onChange={(e) => {
                          console.log("percentage");
                        }}
                      />
                      Percentage
                    </label>
                  </div>
                </div>

                <div className="col-7">
                  <div className="row">
                    <div className="col-2">
                      <Label
                        htmlFor="customername-field"
                        className="form-label mt-2 fw-bold"
                      >
                        Apply On
                      </Label>
                      <Input
                        name="intial_latter"
                        id="supplier_mobile"
                        className="form-control fw-bold"
                        placeholder="Enter......."
                        type="text"
                        onChange={(e) => {}}
                      />
                    </div>
                    <div className="col-2">
                      <Label
                        htmlFor="customername-field"
                        className="form-label mt-2 fw-bold"
                      >
                        Amount
                      </Label>
                      <Input
                        name="intial_latter"
                        id="supplier_mobile"
                        className="form-control fw-bold"
                        placeholder="Enter......."
                        type="text"
                        onChange={(e) => {}}
                      />
                    </div>
                    <div className="col-2">
                      <Label
                        htmlFor="customername-field"
                        className="form-label mt-2 fw-bold"
                      >
                        Amount
                      </Label>
                      <Input
                        name="intial_latter"
                        id="supplier_mobile"
                        className="form-control fw-bold"
                        placeholder="Enter......."
                        type="text"
                        onChange={(e) => {}}
                      />
                    </div>
                    <div className="col-2">
                      <Label
                        htmlFor="customername-field"
                        className="form-label mt-2 fw-bold"
                      >
                        Amount
                      </Label>
                      <Input
                        name="intial_latter"
                        id="supplier_mobile"
                        className="form-control fw-bold"
                        placeholder="Enter......."
                        type="text"
                        onChange={(e) => {}}
                      />
                    </div>
                    <div className="col-2">
                      <Label
                        htmlFor="customername-field"
                        className="form-label mt-2 fw-bold"
                      >
                        Amount
                      </Label>
                      <Input
                        name="intial_latter"
                        id="supplier_mobile"
                        className="form-control fw-bold"
                        placeholder="Enter......."
                        type="text"
                        onChange={(e) => {}}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          </ModalBody>
          <div className="modal-footer">
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
            <button
              ref={submitButtonRef}
              name="close"
              id="close"
              type="button"
              className="btn btn-primary"
              onClick={() => SubmitData()}
            >
              <i className="ri-save-3-line align-bottom me-1"></i>
              Save
            </button>
          </div>
        </span>
      </Modal>
    </div>
  );
};

export default OtherChargAdd;
