import React, { useEffect, useState, useCallback } from "react";
import { Card, Modal, ModalHeader, ModalBody, Label, Input } from "reactstrap";
import "react-toastify/dist/ReactToastify.css";
import AuthUser from "../../helpers/Authuser";
import CustomInput from "../Unit/Input";

const OtherChrageUpdate = (props) => {
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

  // validation + messages
  const [checkStatus, setCheckStatus] = useState({});
  const [msg, setMsg] = useState("");

  // store form data (edit_data comes from parent)
  const [UpdateData, SetUpData] = useState(props.edit_data || {});

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    SetUpData((prevData) => ({
      ...prevData,
      [name]: value,
    }));

    if (value !== "") {
      setCheckStatus({});
      setMsg("");
    }
  };

  const SubmitData = () => {
    if (!UpdateData.other_charges_name || UpdateData.other_charges_name === "") {
      setCheckStatus({
        borderColor: "red",
        borderStyle: "groove",
      });
      setMsg("Transport type cannot be empty!");
    }  else {
      http
        .put("/other_charges/update", UpdateData) // update API
        .then(function (response) {
          props.checkchang(response.data.message, response.data.status);
        })
        .catch(function (error) {
          console.log(error);
        });
    }
  };

  return (
    <div>
      <Modal id="showModal" isOpen={modal} toggle={toggle} centered>
        <ModalHeader className="bg-light p-3" toggle={toggle}>
          Edit Other Charges
        </ModalHeader>
        <span className="tablelist-form">
          <ModalBody>
            <Card className="border card-border-success p-3 shadow-lg">
              {/* Type */}
              <div className="mb-3">
                <Label className="form-label fw-bold d-flex justify-content-between">
                  <div>
                    Other Charges<span style={{ color: "red" }}> *</span>
                  </div>
                  <div style={{ color: "red" }}>{msg}</div>
                </Label>
                <CustomInput
                  checkNameStatus={checkStatus}
                  name="other_charges_name"
                  className="form-control fw-bold"
                  placeholder="Other Charges"
                  type="text"
                  onChange={handleInputChange}
                  value={UpdateData.other_charges_name || ""}
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

export default OtherChrageUpdate;
