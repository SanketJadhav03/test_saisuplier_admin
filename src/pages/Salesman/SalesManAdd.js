import React, { useEffect, useState, useCallback, useRef } from "react";
import { Card, Modal, ModalHeader, ModalBody, Label, Input } from "reactstrap";
import "react-toastify/dist/ReactToastify.css";
import AuthUser from "../../helpers/Authuser";
import CustomInput from "../Unit/Input";
import { toast } from "react-toastify";
const SalesManAdd = (props) => {
  const { http } = AuthUser();
  const [passwordShow, setPasswordShow] = useState(false);
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
  const [SalesMansData, setSalesMansData] = useState({
    salesman_name: "",
    salesman_mobile: "",
    salesman_email: "",
    salesman_password: "",
  });

  const getSalesManData = (e) => {
    setSalesMansData({ ...SalesMansData, [e.target.name]: e.target.value });
    if (SalesMansData.salesman_name != "") {
      setCheckStatus({});
      setMsg("");
    }
  };
  const [checkNameStatus, setCheckStatus] = useState({});
  const [msg, setMsg] = useState("");
  const OnSubmited = () => {
    if (SalesMansData.salesman_name == "") {
      setCheckStatus({
        borderColor: "red",
        borderStyle: "groove",
      });
      setMsg("Customer connot be empty!");
    } else if (SalesMansData.salesman_password == "") {
      toast.error("Password Cannot be empty!");
     }else {
      http
        .post("/salesman/store", SalesMansData)
        .then(function (response) {
          props.checkchang(response.data.message, response.data.status );
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

  return (
    <div>
      <Modal id="showModal" size="xl" isOpen={modal} toggle={toggle} centered>
        <ModalHeader className="bg-light p-3" toggle={toggle}>
          Add SalesMan
        </ModalHeader>
        <div className="tablelist-form">
          <ModalBody>
            <Card className="border card-border-success  p-3 shadow-lg">
              <div className="mb-3 row">
                <div className="col-6">
                  <Label
                    htmlFor="SalesManname-field"
                    className="form-label mt-2 fw-bold d-flex justify-content-between"
                  >
                    <div>
                      SalesMan Name<span style={{ color: "red" }}> *</span>
                    </div>
                    <div style={{ color: "red" }}>{msg}</div>
                  </Label>
                  <CustomInput
                    checkNameStatus={checkNameStatus}
                    onChange={getSalesManData}
                    name="salesman_name"
                    id="salesman_name"
                    className="form-control fw-bold"
                    placeholder="SalesMan Name"
                    type="text"
                  />
                </div>
                <div className="col-6">
                  <Label
                    htmlFor="SalesManname-field"
                    className="form-label mt-2 fw-bold"
                  >
                    Mobile No.
                  </Label>
                  <Input
                    onChange={getSalesManData}
                    name="salesman_mobile"
                    id="salesman_mobile"
                    className="form-control fw-bold"
                    placeholder="Mobile No"
                    type="text"
                  />
                </div>
                <div className="col-6">
                  <Label
                    htmlFor="SalesManname-field"
                    className="form-label mt-2 fw-bold"
                  >
                    Email.
                  </Label>
                  <Input
                    onChange={getSalesManData}
                    name="salesman_email"
                    id="salesman_email"
                    className="form-control fw-bold"
                    placeholder="Email"
                    type="email"
                  />
                </div>
                <div className="col-6">
                  <Label
                    htmlFor="categoryname-field"
                    className="form-label fw-bold d-flex justify-content-between  mt-2"
                  >
                    Password
                  </Label>
                  <span className="d-flex">
                    <Input
                      id="role-name-field"
                      className="form-control fw-bold"
                      placeholder="Password"
                      type={passwordShow ? "text" : "password"}
                      name="salesman_password"
                      onChange={getSalesManData}
                    />
                    <button
                      className="btn btn-success rounded text-white position-absolute end-0 top-2"
                      type="button"
                      id="password-addon"
                      onClick={() => setPasswordShow(!passwordShow)}
                    >
                      <i className="ri-eye-fill align-middle"></i>
                    </button>
                  </span>
                </div>
                <div className="col-12">
                  <Label
                    htmlFor="SalesManname-field"
                    className="form-label mt-3 fw-bold"
                  >
                    Address
                  </Label>
                  <textarea
                    onChange={getSalesManData}
                    rows={3}
                    placeholder="Enter address"
                    className="form-control fw-bold"
                    name="salesman_address"
                    id="salesman_address"
                  />
                </div>
              </div>
            </Card>
          </ModalBody>
          <div className="modal-footer">
            <div className="hstack gap-2 justify-content-end">
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
export default SalesManAdd;
