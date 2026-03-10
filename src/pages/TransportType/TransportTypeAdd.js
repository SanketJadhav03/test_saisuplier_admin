import React, { useEffect, useState, useCallback, useRef } from "react";
import { Card, Modal, ModalHeader, ModalBody, Label, Input } from "reactstrap";
import "react-toastify/dist/ReactToastify.css";
import AuthUser from "../../helpers/Authuser";
import CustomInput from "../Unit/Input";

const TransportTypeAdd = (props) => {
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

  // States for fields
  const [formData, setFormData] = useState({
    transport_types_type: "",
    transport_types_charge: "",
    transport_types_description: "",
  });

  const [checkStatus, setCheckStatus] = useState({});
  const [msg, setMsg] = useState("");

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });

    if (e.target.value !== "") {
      setCheckStatus({});
      setMsg("");
    }
  };

  const SubmitData = () => {
    const { transport_types_type, transport_types_charge, transport_types_description } = formData;

    if (transport_types_type === "" || transport_types_charge === "") {
      setCheckStatus({
        borderColor: "red",
        borderStyle: "groove",
      });
      setMsg("Required fields cannot be empty!");
      return;
    }

    http
      .post("/transport_types/store", formData)
      .then(function (response) {
        props.checkchang(response.data.message, response.data.status);
      })
      .catch(function (error) {
        console.log(error);
      });
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
      <Modal id="showModal" isOpen={modal} toggle={toggle} centered>
        <ModalHeader className="bg-light p-3" toggle={toggle}>
          Add Transport Types
        </ModalHeader>
        <span className="tablelist-form">
          <ModalBody>
            <Card className="border card-border-success p-3 shadow-lg">
              {/* Transport Type */}
              <div className="mb-3">
                <Label className="form-label fw-bold d-flex justify-content-between">
                  <div>
                    Transport Type<span style={{ color: "red" }}> *</span>
                  </div>
                  <div style={{ color: "red" }}>{msg}</div>
                </Label>
                <CustomInput
                  checkNameStatus={checkStatus}
                  name="transport_types_type"
                  className="form-control fw-bold"
                  placeholder="Transport Type"
                  type="text"
                  onChange={handleChange}
                />
              </div>

              {/* Transport Charge */}
              <div className="mb-3">
                <Label className="form-label fw-bold">Transport Charge *</Label>
                <Input
                  name="transport_types_charge"
                  className="form-control fw-bold"
                  placeholder="Enter Charge"
                  type="number"
                  onChange={handleChange}
                />
              </div>

              {/* Transport Description */}
              <div className="mb-3">
                <Label className="form-label fw-bold">Description</Label>
                <Input
                  name="transport_types_description"
                  className="form-control fw-bold"
                  placeholder="Enter Description"
                  type="text"
                  onChange={handleChange}
                />
              </div>
            </Card>
          </ModalBody>
          <div className="modal-footer">
            <button
              type="button"
              className="btn btn-danger"
              onClick={() => Close()}
            >
              <i className="ri-close-line me-1 align-middle" />
              Close
            </button>
            <button
              ref={submitButtonRef}
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

export default TransportTypeAdd;
