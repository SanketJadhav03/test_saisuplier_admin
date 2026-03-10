import React, { useEffect, useState, useCallback, useRef } from "react";
import { Card, Modal, ModalHeader, ModalBody, Label, Input } from "reactstrap";
import "react-toastify/dist/ReactToastify.css";
import Select from "react-select";
import AuthUser from "../../helpers/Authuser";
import CustomInput from "../Unit/Input";
import { toast } from "react-toastify";
import SupplierGroupAdd from "../SupplierGroup/SupplierGroupAdd";

const SupplierAdd = (props) => {
  // On form submit getSupplierData imported
  const [SupplierGroup, setSupplierGroup] = useState([]);
  const [activeGroup, setActiveGroup] = useState(false);
  const [modalStatess, setModalStatess] = useState(false);
  const [counts, Setcounts] = useState(1);
  const [manageGroup, setManageGroup] = useState(0);
  const handleCallback = (data, status) => {
    if (status == 0) {
      setManageGroup(1);
      toast.success(data);
    } else {
      toast.warn(data);
    }
    Setcounts(counts + 1);
    setModalStatess(false);
  };
  useEffect(() => {
    http
      .get("/all_supplier_groups")
      .then(function (response) {
        if (response.data.length == 0) {
          setActiveGroup(false);
        } else {
          setSupplierGroup(response.data);
          setActiveGroup(true);
          setSuppliersData(() => ({
            ...SuppliersData,
            supplier_group_type:
              manageGroup == 0
                ? response.data[0].supplier_group_id
                : response.data[response.data.length - 1].supplier_group_id,
          }));
        }
      })
      .catch(function (error) {
        console.log(error);
      });
  }, [counts + 1]);
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
  const [SuppliersData, setSuppliersData] = useState({
    supplier_name: "",
    supplier_mobile: "",
    supplier_email: "",
    supplier_gst_no: "",
    supplier_pan_no: "",
    supplier_opening_balance: "",
    supplier_group_type: "",
    supplier_billing_address: "",
    supplier_shipping_address: "",
    supplier_city: "",
    supplier_credit_limit: "",
    supplier_credit_period_day: "",
  });

  const getSupplierData = (e) => {
    setSuppliersData({ ...SuppliersData, [e.target.name]: e.target.value });
    if (SuppliersData.supplier_name != "") {
      setCheckStatus({});
      setMsg("");
    }
  };
  const getSelectedGroupValue = (e) => {
    setSuppliersData({ ...SuppliersData, supplier_group_type: e.value });
  };

  const [checkNameStatus, setCheckStatus] = useState({});
  const [msg, setMsg] = useState("");
  const OnSubmited = () => {
    if (SuppliersData.supplier_name == "") {
      setCheckStatus({
        borderColor: "red",
        borderStyle: "groove",
      });
      setMsg("Customer connot be empty!");
    } else {
      const mainSupplierArray = {
        allSuppliers: SuppliersData,
      };
      http
        .post("/suppliers/store", mainSupplierArray.allSuppliers)
        .then(function (response) {
          props.checkchang(response.data.message,response.data.status);
        })
        .catch(function (error) {
          console.log(error);
        });
    }
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
    props.checkchang("Supplier Create Successfully !!");
  };
  const handlModalState = () => {
    setModalStatess(!false);
  };
  // get Supplier group type
  const { http } = AuthUser();

  return (
    <div>
      <Modal id="showModal" size="xl" isOpen={modal} toggle={toggle} centered>
        <ModalHeader className="bg-light p-3" toggle={toggle}>
          Add Supplier
        </ModalHeader>
        <div className="tablelist-form">
          <ModalBody>
            <Card className="border card-border-success  p-3 shadow-lg">
              <div className="mb-3 row">
                <div className="col-4">
                  <Label
                    htmlFor="Suppliername-field"
                    className="form-label mt-2 fw-bold d-flex justify-content-between"
                  >
                    <div>
                      Supplier Name<span style={{ color: "red" }}> *</span>
                    </div>
                    <div style={{ color: "red" }}>{msg}</div>
                  </Label>
                  <CustomInput
                    checkNameStatus={checkNameStatus}
                    onChange={getSupplierData}
                    name="supplier_name"
                    id="supplier_name"
                    className="form-control fw-bold"
                    placeholder="Supplier Name"
                    type="text"
                  />
                </div>

                <div className="col-4">
                  <Label
                    htmlFor="Suppliername-field"
                    className="form-label mt-2 fw-bold"
                  >
                    Mobile No.
                  </Label>
                  <Input
                    onChange={getSupplierData}
                    name="supplier_mobile"
                    id="supplier_mobile"
                    className="form-control fw-bold"
                    placeholder="Mobile No"
                    type="text"
                  />
                </div>
                <div className="col-4">
                  <Label
                    htmlFor="Suppliername-field"
                    className="form-label mt-2 fw-bold"
                  >
                    Email.
                  </Label>
                  <Input
                    onChange={getSupplierData}
                    name="supplier_email"
                    id="supplier_email"
                    className="form-control fw-bold"
                    placeholder="Email"
                    type="email"
                  />
                </div>
                <div className="col-3">
                  <Label
                    htmlFor="Suppliername-field"
                    className="form-label mt-2 fw-bold"
                  >
                    GST No.
                  </Label>
                  <Input
                    onChange={getSupplierData}
                    name="supplier_gst_no"
                    id="supplier_gst_no"
                    className="form-control fw-bold"
                    placeholder="Gst No"
                    type="text"
                  />
                </div>
                <div className="col-3">
                  <Label
                    htmlFor="Suppliername-field"
                    className="form-label mt-2 fw-bold"
                  >
                    Pan No.
                  </Label>
                  <Input
                    onChange={getSupplierData}
                    name="supplier_pan_no"
                    id="supplier_pan_no"
                    className="form-control fw-bold"
                    placeholder="Pan No"
                    type="text"
                  />
                </div>
                <div className="col-3">
                  <Label
                    htmlFor="Suppliername-field"
                    className="form-label mt-2 fw-bold"
                  >
                    Opening Balance.
                  </Label>
                  <Input
                    onChange={getSupplierData}
                    name="supplier_opening_balance"
                    id="supplier_opening_balance"
                    className="form-control fw-bold"
                    placeholder="Opening Balance"
                    type="number"
                  />
                </div>
                <div className="col-3">
                  <Label
                    htmlFor="Suppliername-field"
                    className="form-label mt-2 fw-bold d-flex justify-content-between"
                  >
                    Group Type
                    <button
                      className="btn btn-success btn-sm px-1"
                      style={{ padding: "0px" }}
                      onClick={handlModalState}
                    >
                      <i className="ri-add-line align-bottom"></i>
                    </button>
                  </Label>
                  {activeGroup ? (
                    <Select
                      placeholder={
                        manageGroup == 0
                          ? SupplierGroup[0].supplier_group_name
                          : SupplierGroup[SupplierGroup.length - 1]
                              .supplier_group_name
                      }
                      onChange={getSelectedGroupValue}
                      options={SupplierGroup.map((group) => ({
                        value: group.supplier_group_id,
                        label: group.supplier_group_name,
                      }))}
                      name="supplier_group_type"
                      id="supplier_group_type"
                      className="fw-bold"
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
                    htmlFor="Suppliername-field"
                    className="form-label mt-3 fw-bold"
                  >
                    Billing Address
                  </Label>
                  <textarea
                    onChange={getSupplierData}
                    rows={3}
                    placeholder="Enter billing address"
                    className="form-control fw-bold"
                    name="supplier_billing_address"
                    id="supplier_billing_address"
                  />
                </div>
                <div className="col-6">
                  <Label
                    htmlFor="Suppliername-field"
                    className="form-label mt-3  d-flex justify-content-between"
                  >
                    <div className="fw-bold">Shipping Address</div>
                    <div>same as billing address</div>
                  </Label>
                  <textarea
                    onChange={getSupplierData}
                    rows={3}
                    placeholder="Enter shipping address"
                    className="form-control fw-bold"
                    name="supplier_shipping_address"
                    id="supplier_shipping_address"
                  />
                </div>

                <div className="col-4">
                  <Label
                    htmlFor="Suppliername-field"
                    className="form-label mt-2 fw-bold"
                  >
                    City.
                  </Label>
                  <Input
                    onChange={getSupplierData}
                    name="supplier_city"
                    id="supplier_city"
                    className="form-control fw-bold"
                    placeholder="City"
                    type="text"
                  />
                </div>
                <div className="col-4">
                  <Label
                    htmlFor="Suppliername-field"
                    className="form-label mt-2 fw-bold"
                  >
                    Credit Limit
                  </Label>
                  <Input
                    onChange={getSupplierData}
                    name="supplier_credit_limit"
                    id="supplier_credit_limit"
                    className="form-control fw-bold"
                    placeholder="Credit Limit"
                    type="text"
                  />
                </div>
                <div className="col-4">
                  <Label
                    htmlFor="Suppliername-field"
                    className="form-label mt-2 fw-bold"
                  >
                    Credit Period(days)
                  </Label>
                  <Input
                    onChange={getSupplierData}
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
        <SupplierGroupAdd
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

export default SupplierAdd;
