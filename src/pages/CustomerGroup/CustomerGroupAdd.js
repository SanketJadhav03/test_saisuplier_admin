import React, { useEffect, useState, useCallback, useRef } from "react";
import { Card, Modal, ModalHeader, ModalBody, Label, Input } from "reactstrap";
import "react-toastify/dist/ReactToastify.css";
import AuthUser from "../../helpers/Authuser";
import CustomInput from "../Unit/Input";

const CustomerGroupAdd = (props) => {
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

  const [checkNameStatus, setCheckStatus] = useState({});
  const [msg, setMsg] = useState("");
  const [GroupType, setGroupType] = useState("");
  const SubmitData = () => {
    if (GroupType == "") {
      setCheckStatus({
        borderColor: "red",
        borderStyle: "groove",
      });
      setMsg("Group connot be empty!");
    } else {
      http
        .post("/customer_group/store", { customer_group_name: GroupType })
        .then(function (response) {
          props.checkchang(response.data.message, response.data.status);
        })
        .catch(function (error) {
          console.log(error);
        });
    }
  };
  const handleCustomerGroup = (e) => {
    setGroupType(e.target.value);
    if (GroupType != "") {
      setCheckStatus({});
      setMsg("");
    }
  };

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
      <Modal id="showModal" isOpen={modal} toggle={toggle} centered>
        <ModalHeader className="bg-light p-3" toggle={toggle}>
          Add CustomerGroup
        </ModalHeader>
        <span className="tablelist-form">
          <ModalBody>
            <Card className="border card-border-success p-3 shadow-lg">
              <div className="mb-3">
                <Label
                  htmlFor="categoryname-field"
                  className="form-label fw-bold d-flex justify-content-between"
                >
                  <div>
                    CustomerGroup Name<span style={{ color: "red" }}> *</span>
                  </div>
                  <div style={{ color: "red" }}>{msg}</div>
                </Label>
                <CustomInput
                  checkNameStatus={checkNameStatus}
                  name="category"
                  id="category-field"
                  className="form-control fw-bold"
                  placeholder="CustomerGroup Name"
                  type="text"
                  value={GroupType}
                  onChange={handleCustomerGroup}
                />
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

export default CustomerGroupAdd;
