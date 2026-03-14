import React, { useEffect, useState, useCallback } from "react";
import { Card, Modal, ModalHeader, ModalBody, Label, Row, Col } from "reactstrap";
import "react-toastify/dist/ReactToastify.css";
import AuthUser from "../../helpers/Authuser";
import CustomInput from "./Input";

const StagesUpdate = (props) => {
  const [modal, setModal] = useState(false);
  const { http } = AuthUser();
  const [ModalData, setModalData] = useState(props.edit_data);
  const [checkNameStatus, setCheckStatus] = useState({});
  const [msg, setMsg] = useState("");

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

  // Synchronize internal state when props change
  useEffect(() => {
    if (props.edit_data) {
      setModalData(props.edit_data);
    }
  }, [props.edit_data]);

  useEffect(() => {
    setModal(false);
    toggle();
  }, [props.modalState, props.unitID, props.unitName]);

  const toggle = useCallback(() => {
    if (modal) {
      setModal(false);
      props.setModalStates();
    } else {
      setModal(true);
    }
  }, [modal, props]);

  const updateData = () => {
    if (!ModalData.name || ModalData.name === "") {
      setCheckStatus({
        borderColor: "red",
        borderStyle: "groove",
      });
      setMsg("Stages cannot be empty!");
    } else {
      http
        .put(`/stages/update/${ModalData.id}`, ModalData)
        .then(function (response) {
          props.checkchang(response.data.message, response.data.status);
        })
        .catch(function (error) {
          console.log(error);
        });
    }
  };

  const handleStages = (e) => {
    setCheckStatus({});
    setMsg("");
    setModalData({ ...ModalData, name: e.target.value });
  };

  const handleColorChange = (colorValue) => {
    setModalData({ ...ModalData, color: colorValue });
  };

  return (
    <div>
      <Modal id="showModal" isOpen={modal} toggle={toggle} centered>
        <ModalHeader className="bg-light p-3" toggle={toggle}>
          Edit Stages
        </ModalHeader>
        <span className="tablelist-form">
          <ModalBody>
            <Card className="border card-border-success p-3 shadow-lg">
              {/* Stage Name */}
              <div className="mb-3">
                <Label htmlFor="categoryname-field" className="form-label fw-bold d-flex justify-content-between">
                  <div>
                    Stages Name<span style={{ color: "red" }}> *</span>
                  </div>
                  <div style={{ color: "red" }}>{msg}</div>
                </Label>
                <CustomInput
                  checkNameStatus={checkNameStatus}
                  name="category"
                  id="category-field"
                  className="form-control fw-bold"
                  placeholder="Stages Name"
                  type="text"
                  onChange={handleStages}
                  value={ModalData?.name || ""}
                />
              </div>

              {/* Color Selection */}
              <div className="mb-2">
                <Label className="form-label fw-bold">Stage Color</Label>
                <Row className="g-2">
                  {colorOptions.map((color) => (
                    <Col key={color.value} xs={4}>
                      <div
                        className={`p-2 border rounded text-center cursor-pointer ${
                          ModalData?.color === color.value 
                          ? `bg-${color.value} text-white` 
                          : 'bg-light text-dark'
                        }`}
                        onClick={() => handleColorChange(color.value)}
                        style={{ cursor: 'pointer', fontSize: '11px' }}
                      >
                        <i className={`ri-checkbox-blank-circle-fill me-1 text-${
                          ModalData?.color === color.value ? 'white' : color.value
                        }`}></i>
                        {color.name}
                      </div>
                    </Col>
                  ))}
                </Row>
              </div>
            </Card>
          </ModalBody>
          <div className="modal-footer">
            <button
              type="button"
              className="btn btn-danger"
              onClick={() => Close()}
            >
              <i className="ri-close-line me-1 align-middle" /> Close
            </button>
            <button
              type="button"
              className="btn btn-primary"
              onClick={() => updateData()}
            >
              <i className="ri-save-3-line align-bottom me-1"></i> Save Changes
            </button>
          </div>
        </span>
      </Modal>
    </div>
  );
};

export default StagesUpdate;