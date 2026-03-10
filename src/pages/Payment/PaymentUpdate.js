import React, { useEffect, useState, useCallback, useRef } from "react";
import { Card, Modal, ModalHeader, ModalBody, Label, Input } from "reactstrap";
import "react-toastify/dist/ReactToastify.css";
import Select from "react-select";
import AuthUser from "../../helpers/Authuser";
import Flatpickr from "react-flatpickr";
import { toast } from "react-toastify";
import CustomInput from "../Unit/Input";

const PaymentUpdate = (props) => {
  // On form submit getCustomerData imported
  const { http } = AuthUser();
  const [Supplier, setsupplier] = useState([]);
  const [Expenses, setexpenses] = useState([]);
  const [activeGroup, setActiveGroup] = useState(false);
  const [Payment, setpayment] = useState([]);
  const [modalStatess, setModalStatess] = useState(false);
  const [counts, Setcounts] = useState(1);
  const [manageGroup, setManageGroup] = useState(0);
  const [startDate, setStartDate] = useState("");
  const handleCallback = (data) => {
    Setcounts(counts + 1);
    setManageGroup(1);
    toast.success(data);
    setModalStatess(false);
  };

  useEffect(() => {
    http
      .get("/payment_mode/list?page=1&limit=100")
      .then(function (response) {
        setpayment(response.data);
      })
      .catch(function (error) {
        console.log(error);
      });

    http
      .get("/expenses/list?page=1&limit=100")
      .then(function (response) {
        setexpenses(response.data);
      })
      .catch(function (error) {
        console.log(error);
      });
    http
      .get("/all_suppliers")
      .then(function (response) {
        if (response.data.length == 0) {
          setActiveGroup(false);
        } else {
          setsupplier(response.data);
          setActiveGroup(true);
        }
      })
      .catch(function (error) {
        console.log(error);
      });
  }, [counts + 1]);

  const [AllPaymentData, setAllPaymentData] = useState(props.edit_data);

  const handleAllPaymentData = (e) => {
    setAllPaymentData({
      ...AllPaymentData,
      [e.target.name]: e.target.value,
    });
  };

  //  select data
  const getSelectedPaymentValue = (e) => {
    setAllPaymentData({ ...AllPaymentData, payment_mode: e.value });
  };
  //  select data
  const getSelectedExpensesValue = (e) => {
    setAllPaymentData({ ...AllPaymentData, payment_expenses: e.value });
  };
  //  select data
  const getSelectedPartyValue = (e) => {
    setAllPaymentData({ ...AllPaymentData, party_name: e.value });
  };

  const OnSubmited = () => {
    http
      .put("/party_payment/update", AllPaymentData)
      .then(function (response) {
        props.checkchang(response.data.message, response.data.status);
      })
      .catch(function (error) {
        console.log(error);
      });
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

  // shortcuts for save and close
  const submitButtonRef = useRef();
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.altKey && event.key === "Escape") {
        event.preventDefault();
        props.setModalStates(false);
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
      <Modal id="showModal" size="xl" isOpen={modal} toggle={toggle} centered>
        <ModalHeader className="bg-light p-3" toggle={toggle}>
          Update Payment
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
                    Payment Date
                  </Label>
                  <Flatpickr
                    className="form-control"
                    options={{
                      dateFormat: "d/m/Y",
                      defaultDate: AllPaymentData.payment_date,
                    }}
                    onChange={(selectedDates) => {
                      const selectedDate = selectedDates[0];

                      const formattedDate = selectedDate.toLocaleDateString(
                        "en-US",
                        {
                          day: "numeric",
                          month: "numeric",
                          year: "numeric",
                        }
                      );
                      setAllPaymentData({
                        ...AllPaymentData,
                        payment_date: formattedDate,
                      });
                    }}
                    name="payment_date"
                  />
                </div>
                <div className="col-4">
                  <Label
                    htmlFor="customername-field"
                    className="form-label mt-2 fw-bold d-flex justify-content-between"
                  >
                    Payment Mode
                  </Label>

                  <Select
                    placeholder={AllPaymentData.payment_type}
                    onChange={getSelectedPaymentValue}
                    options={Payment.map((group) => ({
                      value: group.payment_id,
                      label: group.payment_type,
                    }))}
                    name="payment_mode"
                    id="payment_mode"
                    className=" fw-bold"
                  />
                </div>
                <div className="col-4">
                  <Label
                    htmlFor="customername-field"
                    className="form-label mt-2 fw-bold d-flex justify-content-between"
                  >
                    Expenses Type
                  </Label>

                  <Select
                    placeholder={AllPaymentData.expenses_type}
                    onChange={getSelectedExpensesValue}
                    options={Expenses.map((group) => ({
                      value: group.expenses_id,
                      label: group.expenses_type,
                    }))}
                    name="payment_expenses"
                    id="payment_mode"
                    className=" fw-bold"
                  />
                </div>
                <div className="col-6">
                  <Label
                    htmlFor="customername-field"
                    className="form-label mt-2 fw-bold d-flex justify-content-between"
                  >
                    Party Name
                  </Label>
                  {activeGroup ? (
                    <Select
                      placeholder={AllPaymentData.supplier_name}
                      onChange={getSelectedPartyValue}
                      options={Supplier.map((group) => ({
                        value: group.supplier_id,
                        label: group.supplier_name,
                      }))}
                      name="party_name"
                      id="supplier_type"
                      className=" fw-bold"
                    />
                  ) : (
                    <Input
                      type="text"
                      readOnly
                      className="form-control fw-bold "
                      style={{ color: "red" }}
                      value="First Fill the Customer Group *"
                      placeholder=""
                    />
                  )}
                </div>

                <div className="col-6">
                  <Label
                    htmlFor="customername-field"
                    className="form-label mt-2 fw-bold"
                  >
                    Credit Amount
                  </Label>
                  <Input
                    readOnly
                    value={AllPaymentData.credit_amount}
                    onChange={handleAllPaymentData}
                    name="credit_amount"
                    id="supplier_mobile"
                    className="form-control fw-bold"
                    placeholder=" Credit Amount"
                    type="text"
                  />
                </div>

                <div className="col-6">
                  <Label
                    htmlFor="customername-field"
                    className="form-label mt-2 fw-bold"
                  >
                    Paid Amount
                  </Label>
                  <Input
                    value={AllPaymentData.total_amount}
                    onChange={handleAllPaymentData}
                    name="total_amount"
                    id="supplier_mobile"
                    className="form-control fw-bold"
                    placeholder="Enter Paid Amount"
                    type="text"
                  />
                </div>

                <div className="col-12">
                  <Label
                    htmlFor="customername-field"
                    className="form-label mt-3  d-flex justify-content-between"
                  >
                    <div className="fw-bold">Remark</div>
                  </Label>
                  <textarea
                    onChange={handleAllPaymentData}
                    rows={3}
                    placeholder="Enter Remark"
                    className="form-control fw-bold"
                    name="remark"
                    id="customer_shipping_address"
                    value={AllPaymentData.remark}
                  >
                    {AllPaymentData.remark}
                  </textarea>
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
              {activeGroup ? (
                <button
                  type="button"
                  name="sumbit"
                  id="submit"
                  className="btn btn-primary"
                  onClick={() => OnSubmited()}
                  ref={submitButtonRef}
                >
                  <i className="ri-save-3-line align-bottom me-1"></i>
                  Save
                </button>
              ) : (
                <span style={{ color: "red" }}>
                  First fill basic information then save.
                </span>
              )}
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default PaymentUpdate;
