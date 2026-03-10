import React, { useEffect, useState, useCallback } from "react";
import { Card, Modal, ModalHeader, ModalBody, Label, Input } from "reactstrap";
import "react-toastify/dist/ReactToastify.css";
import AuthUser from "../../helpers/Authuser";
import CustomInput from "../Unit/Input";

const TransportTypeUpdate = (props) => {
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
    if (!UpdateData.transport_types_type || UpdateData.transport_types_type === "") {
      setCheckStatus({
        borderColor: "red",
        borderStyle: "groove",
      });
      setMsg("Transport type cannot be empty!");
    } else if (!UpdateData.transport_types_charge || UpdateData.transport_types_charge === "") {
      setCheckStatus({
        borderColor: "red",
        borderStyle: "groove",
      });
      setMsg("Transport charge cannot be empty!");
    } else {
      http
        .put("/transport_types/update", UpdateData) // update API
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
          Edit Transport Type
        </ModalHeader>
        <span className="tablelist-form">
          <ModalBody>
            <Card className="border card-border-success p-3 shadow-lg">
              {/* Type */}
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
                  onChange={handleInputChange}
                  value={UpdateData.transport_types_type || ""}
                />
              </div>

              {/* Charge */}
              <div className="mb-3">
                <Label className="form-label fw-bold">
                  Transport Charge<span style={{ color: "red" }}> *</span>
                </Label>
                <Input
                  name="transport_types_charge"
                  className="form-control fw-bold"
                  placeholder="Enter Charge"
                  type="number"
                  onChange={handleInputChange}
                  value={UpdateData.transport_types_charge || ""}
                />
              </div>

              {/* Description */}
              <div className="mb-3">
                <Label className="form-label fw-bold">Description</Label>
                <Input
                  name="transport_types_description"
                  className="form-control fw-bold"
                  placeholder="Enter Description"
                  type="text"
                  onChange={handleInputChange}
                  value={UpdateData.transport_types_description || ""}
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

export default TransportTypeUpdate;
