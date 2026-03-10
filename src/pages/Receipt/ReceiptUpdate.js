import React, { useEffect, useState, useCallback, useRef } from "react";
import { Card, Modal, ModalHeader, ModalBody, Label, Input } from "reactstrap";
import "react-toastify/dist/ReactToastify.css";
import Select from "react-select";
import AuthUser from "../../helpers/Authuser";
import Flatpickr from "react-flatpickr";
import { toast } from "react-toastify";
import CustomInput from "../Unit/Input";

const ReceiptUpdate = (props) => {
  // On form submit getCustomerData imported
  const { http } = AuthUser();
  const [Customer, setCustomer] = useState([]);
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
      .get("/all_customers")
      .then(function (response) {
        if (response.data.length == 0) {
          setActiveGroup(false);
        } else {
          setCustomer(response.data);
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
    setAllPaymentData({ ...AllPaymentData, receipt_payment_mode: e.value });
  };

  //  select data
  const getSelectedPartyValue = (e) => {
    setAllPaymentData({ ...AllPaymentData, receipt_customer_name: e.value });
  };

  const [checkNameStatus, setCheckStatus] = useState({});
  const [msg, setMsg] = useState("");
  const OnSubmited = () => {
    console.log(AllPaymentData);
    // if(CustomersData.Customer_name==""){
    //   setCheckStatus({
    //     borderColor:"red",
    //     borderStyle:"groove"
    //   });
    //   setMsg("Customer connot be empty!");
    // }else{
    // const mainCustomerArray = {
    //   allCustomers: CustomersData,
    // };
    http
      .put("/receipt/update", AllPaymentData)
      .then(function (response) {
        props.checkchang(response.data.message, response.data.status);
      })
      .catch(function (error) {
        console.log(error);
      });
    // }
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
          Update Receipt
        </ModalHeader>
        <div className="tablelist-form">
          <ModalBody>
            <Card className="border card-border-success  p-3 shadow-lg">
              <div className="mb-3 row">
                <div className="col-6">
                  <Label
                    htmlFor="customername-field"
                    className="form-label mt-2 fw-bold"
                  >
                    Receipt Date
                  </Label>
                  <Flatpickr
                    className="form-control"
                    options={{
                      dateFormat: "d/m/Y",
                      defaultDate: AllPaymentData.receipt_date,
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
                        receipt_date: formattedDate,
                      });
                    }}
                    name="receipt_date"
                  />
                </div>
                <div className="col-6">
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
                    name="receipt_payment_mode"
                    id="receipt_mode"
                    className=" fw-bold"
                  />
                </div>

                <div className="col-6">
                  <Label
                    htmlFor="customername-field"
                    className="form-label mt-2 fw-bold d-flex justify-content-between"
                  >
                    Customer Name
                  </Label>
                  {activeGroup ? (
                    <Select
                      onChange={getSelectedPartyValue}
                      options={Customer.map((group) => ({
                        value: group.customer_id,
                        label: group.customer_name,
                      }))}
                      name="receipt_customer_name"
                      id="Customer_type"
                      className=" fw-bold"
                      placeholder={
                        manageGroup == 0
                          ? Customer[0].customer_name
                          : Customer[Customer.length - 1].customer_name
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
                    readOnly
                    onChange={handleAllPaymentData}
                    name="receipt_credit_amount"
                    id="Customer_mobile"
                    className="form-control fw-bold"
                    value={AllPaymentData.receipt_credit_amount}
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
                    name="receipt_total_amount"
                    id="Customer_mobile"
                    className="form-control fw-bold"
                    value={AllPaymentData.receipt_total_amount}
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
                    name="receipt_remark"
                    id="customer_shipping_address"
                    value={AllPaymentData.receipt_remark}
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
    </div>
  );
};

export default ReceiptUpdate;
