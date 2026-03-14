import React, { useEffect, useState, useCallback, useRef } from "react";
import { Card, Modal, ModalHeader, ModalBody, Label, Row, Col } from "reactstrap";
import AuthUser from "../../helpers/Authuser";
import CustomInput from "./Input";

const StagesAdd = (props) => {
  const [modal, setModal] = useState(false);
  const [unitName, setStagesName] = useState("");
  const [selectedColor, setSelectedColor] = useState("primary"); // Default color
  const { http } = AuthUser();
  const ref = useRef(null);
  const submitButtonRef = useRef();

  // Velzon Theme Colors
  const colorOptions = [
    { name: "Primary", value: "primary" },
    { name: "Success", value: "success" },
    { name: "Info", value: "info" },
    { name: "Warning", value: "warning" },
    { name: "Danger", value: "danger" },
    { name: "Secondary", value: "secondary" },
    { name: "Dark", value: "dark" },
  ];

  const Close = () => {
    setModal(false);
    props.setModalStates();
  };

  useEffect(() => {
    if (props.modalStates) {
      setModal(true);
    } else {
      setModal(false);
    }
  }, [props.modalStates]);

  const toggle = useCallback(() => {
    setModal(!modal);
    props.setModalStates();
  }, [modal, props]);

  const [checkNameStatus, setCheckStatus] = useState({});
  const [msg, setMsg] = useState("");

  const handleStages = (e) => {
    setCheckStatus({});
    setMsg("");
    setStagesName(e.target.value);
  };

  const SubmitData = () => {
    if (unitName === "") {
      setCheckStatus({ borderColor: "red", borderStyle: "groove" });
      setMsg("Stages cannot be empty!");
    } else {
      // Sending both name and color to backend
      http
        .post("/stages/store", { 
            name: unitName, 
            color: selectedColor 
        })
        .then(function (response) {
          props.checkchang(response.data.message, response.data.status);
          setStagesName(""); // Reset form
          setSelectedColor("primary");
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
          Add Stages
        </ModalHeader>
        <ModalBody>
          <Card className="border card-border-success p-3 shadow-lg">
            {/* Stage Name Input */}
            <div className="mb-3">
              <Label htmlFor="categoryname-field" className="form-label fw-bold d-flex justify-content-between">
                <div>
                  Stages Name<span style={{ color: "red" }}> *</span>
                </div>
                <div style={{ color: "red" }}>{msg}</div>
              </Label>
              <CustomInput
                name="category"
                id="category-field"
                placeholder="e.g. Quotation Sent"
                className="form-control fw-bold"
                onChange={handleStages}
                type="text"
                checkNameStatus={checkNameStatus}
                unitName={unitName}
              />
            </div>

            {/* Color Selection Section */}
            <div className="mb-2">
              <Label className="form-label fw-bold">Select Stage Color</Label>
              <Row className="g-2">
                {colorOptions.map((color) => (
                  <Col key={color.value} xs={4}>
                    <div 
                      className={`p-2 border rounded text-center cursor-pointer ${selectedColor === color.value ? `bg-${color.value} text-white` : 'bg-light text-dark'}`}
                      onClick={() => setSelectedColor(color.value)}
                      style={{ cursor: 'pointer', fontSize: '12px' }}
                    >
                      <i className={`ri-checkbox-blank-circle-fill me-1 text-${selectedColor === color.value ? 'white' : color.value}`}></i>
                      {color.name}
                    </div>
                  </Col>
                ))}
              </Row>
            </div>
          </Card>
        </ModalBody>
        <div className="modal-footer">
          <button type="button" className="btn btn-danger" onClick={() => Close()}>
            <i className="ri-close-line me-1 align-middle" /> Close
          </button>
          <button
            type="button"
            ref={submitButtonRef}
            className="btn btn-primary"
            onClick={() => SubmitData()}
          >
            <i className="ri-save-3-line align-bottom me-1"></i> Save
          </button>
        </div>
      </Modal>
    </div>
  );
};

export default StagesAdd;