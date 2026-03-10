import React, { useEffect, useState, useCallback, useRef } from "react";
import { Card, Modal, ModalHeader, ModalBody, Label, Input } from "reactstrap";
import "react-toastify/dist/ReactToastify.css";
import Select from "react-select";
import AuthUser from "../../helpers/Authuser";
import Flatpickr from "react-flatpickr";
import { toast } from "react-toastify";
import CustomInput from "../Unit/Input";
import PaymentModeAdd from "../PaymentMode/PaymentModeAdd";
import ExpensesAdd from "../Expenses/ExpensesAdd";

const PaymentAdd = (props) => {
  // On form submit getCustomerData imported
  const { http } = AuthUser();
  const [Supplier, setsupplier] = useState([]);
  const [Expenses, setexpenses] = useState([]);
  const [activeGroup, setActiveGroup] = useState(false);
  const [activeSupplierCheck, setSupplierActiveGroup] = useState(false);
  const [activePaymentGroup, setActivePaymentGroup] = useState(false);
  const [Payment, setpayment] = useState([]);
  const [modalStatess, setModalStatess] = useState(false);
  const [counts, Setcounts] = useState(1);
  const [manageGroup, setManageGroup] = useState(0);
  const [startDate, setStartDate] = useState(new Date().toLocaleDateString());
  const handleDate = (selectedDates) => {
    if (selectedDates && selectedDates.length > 0) {
      console.log(selectedDates);
      // Update the startDate state with the selected date
      setStartDate(selectedDates[0]);
    }
  };
  const handleCallback = (data) => {
    setManageGroup(1);
    Setcounts(counts + 1);
    toast.success(data);
    setModalStatess(false);
  };
  const [AllPaymentData, setAllPaymentData] = useState({
    payment_date: new Date().toLocaleDateString(),
    payment_mode: 1,
    payment_expenses: 1,
    party_name: 1,
    total_amount: 0,
    credit_amount: 0,
    remark: "",
  });
  useEffect(() => {
    loadAllData();
  }, [counts + 1]);

  const loadAllData = async () => {
    const apiExpensesResponse = await http.get(
      "/expenses/list?page=1&limit=100"
    );
    if (apiExpensesResponse.data.length == 0) {
      setActiveGroup(false);
    } else {
      setActiveGroup(true);
      const temp =
        manageGroup == 0
          ? apiExpensesResponse.data[0].expenses_id
          : apiExpensesResponse.data[apiExpensesResponse.data.length - 1]
              .expenses_id;
      setAllPaymentData({
        ...AllPaymentData,
        payment_expenses: temp,
      });
      setexpenses(apiExpensesResponse.data);
    }
    const apiPaymentResponse = await http.get(
      "/payment_mode/list?page=1&limit=100"
    );
    if (apiPaymentResponse.data.length == 0) {
      setActivePaymentGroup(false);
    } else {
      setActivePaymentGroup(true);
      setpayment(apiPaymentResponse.data);
      setAllPaymentData({
        ...AllPaymentData,
        payment_mode: apiPaymentResponse.data[0].payment_id,
      });
    }
    const apiSupplierResponse = await http.get("/all_suppliers");
    if (apiSupplierResponse.data.length == 0) {
      setSupplierActiveGroup(false);
    } else {
      setSupplierActiveGroup(true);
      setsupplier(apiSupplierResponse.data);
      setAllPaymentData({
        ...AllPaymentData,
        credit_amount: apiSupplierResponse.data[0].supplier_credit_amount,
      });
    }
  };

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

  const [checkNameStatus, setCheckStatus] = useState({});
  const [msg, setMsg] = useState("");

  const OnSubmited = () => {
    http
      .post("/party_payment/store", AllPaymentData)
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
          Add Payment
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
                      defaultDate: startDate,
                    }}
                    name="payment_date"
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
                  />
                </div>
                <div className="col-4">
                  <Label
                    htmlFor="customername-field"
                    className="form-label mt-2 fw-bold d-flex justify-content-between"
                  >
                    Payment Mode
                  </Label>

                  {activePaymentGroup ? (
                    <Select
                      onChange={getSelectedPaymentValue}
                      defaultValue={{
                        label: Payment[0].payment_type,
                        value: Payment[0].payment_id,
                      }}
                      options={Payment.map((group) => ({
                        value: group.payment_id,
                        label: group.payment_type,
                      }))}
                      name="payment_mode"
                      id="payment_mode"
                      className=" fw-bold"
                    />
                  ) : (
                    ""
                  )}
                </div>
                <div className="col-4">
                  <Label
                    htmlFor="customername-field"
                    className="form-label mt-2 fw-bold d-flex justify-content-between"
                  >
                    Expenses Type
                    <button
                      className="btn btn-success btn-sm px-1"
                      style={{ padding: "0px" }}
                      onClick={() => setModalStatess(!false)}
                    >
                      <i className="ri-add-line align-bottom"></i>
                    </button>
                  </Label>
                  {activeGroup ? (
                    <Select
                      onChange={(e) => getSelectedExpensesValue(e)}
                      options={Expenses.map((group) => ({
                        value: group.expenses_id,
                        label: group.expenses_type,
                      }))}
                      name="customer_group_type"
                      id="customer_group_type"
                      className=" fw-bold"
                      placeholder={
                        manageGroup == 0
                          ? Expenses[0].expenses_type
                          : Expenses[Expenses.length - 1].expenses_type
                      }
                    />
                  ) : (
                    <Input
                      type="text"
                      readOnly
                      className="form-control fw-bold "
                      style={{ color: "red" }}
                      value="First Fill the Expenses *"
                      placeholder=""
                    />
                  )}
                </div>
                <div className="col-6">
                  <Label
                    htmlFor="customername-field"
                    className="form-label mt-2 fw-bold d-flex justify-content-between"
                  >
                    Party Name
                  </Label>
                  {activeSupplierCheck ? (
                    <Select
                      onChange={(e) => {
                        http
                          .get(`/suppliers/show/${e.value}`)
                          .then(function (response) {
                            setAllPaymentData({
                              ...AllPaymentData,
                              party_name: response.data.supplier_id,
                              credit_amount:
                                response.data.supplier_credit_amount,
                            });
                          })
                          .catch(function (err) {
                            console.log(err);
                          });
                      }}
                      options={Supplier.map((group) => ({
                        value: group.supplier_id,
                        label: group.supplier_name,
                      }))}
                      name="party_name"
                      id="supplier_type"
                      className=" fw-bold"
                      placeholder={
                        manageGroup == 0
                          ? Supplier[0].supplier_name
                          : Supplier[Supplier.length - 1].supplier_name
                      }
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
                    onChange={handleAllPaymentData}
                    readOnly
                    value={AllPaymentData.credit_amount}
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
      {modalStatess === true ? (
        <ExpensesAdd
          modalStates={modalStatess}
          setModalStates={() => {
            setModalStatess(false);
          }}
          checkchang={handleCallback}
        />
      ) : (
        ""
      )}
    </div>
  );
};

export default PaymentAdd;
