import React, { useEffect, useState, useCallback } from "react";
import { Card, Modal, ModalHeader, ModalBody, Label, Input } from "reactstrap";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import { API_URL } from "../../helpers/url_helper";
import AuthUser from "../../helpers/Authuser";
import { useRef } from "react";
import CustomInput from "./Input";
import { toast } from "react-toastify";

const SourceAdd = (props) => {
  const [modal, setModal] = useState(false);
  const [unitName, setStagesName] = useState("");
  const { http } = AuthUser();
  const Close = () => {
    setModal(false);
    props.setModalStates();
  };
  const handleFocus = () => {
    console.log(ref.current);
  };
  useEffect(() => {
    if (modal) {
      ref.current.focus(); // Focus on the input field when modal is opened
      console.log(ref);
    }
    toggle();
  }, [props.modalStates]);

  const ref = useRef(null);

  const toggle = useCallback(() => {
    if (modal) {
      setModal(false);
      props.setModalStates();
    } else {
      setModal(true);
    }
  }, [modal, props]);
  const [checkNameStatus, setCheckStatus] = useState({});
  const [msg, setMsg] = useState("");
  const handleStages = (e) => {
    setCheckStatus({});
    setMsg("");
    setStagesName(e.target.value);
  };
  const SubmitData = () => {
    if (unitName == "") {
      setCheckStatus({
        borderColor: "red",
        borderStyle: "groove",
      });
      setMsg("Stages connot be empty!");
    } else {
      http
        .post("/sources/store", { name: unitName })
        .then(function (response) {
          props.checkchang(response.data.message, response.data.status);
        })
        .catch(function (error) {
          console.log(error);
        });
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
          Add Stages
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
                    Stages Name<span style={{ color: "red" }}> *</span>
                  </div>
                  <div style={{ color: "red" }}>{msg}</div>
                </Label>
                <CustomInput
                  name="category"
                  id="category-field"
                  placeholder="Stages Name"
                  className="form-control fw-bold"
                  onChange={handleStages}
                  type="text"
                  checkNameStatus={checkNameStatus}
                  handleStages={handleStages}
                  unitName={unitName}
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
              name="close"
              id="close"
              type="button"
              ref={submitButtonRef}
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

export default SourceAdd;
