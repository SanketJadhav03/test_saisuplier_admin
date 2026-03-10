import React, { useEffect, useState, useCallback } from "react";
import { Card, Modal, ModalHeader, ModalBody, Label, Input } from "reactstrap";
import "react-toastify/dist/ReactToastify.css";
import AuthUser from "../../helpers/Authuser";
import CustomInput from "./Input";

const SourceUpdate = (props) => {
  const [modal, setModal] = useState(false);
  const { http } = AuthUser();
  const [ModalData, setModalData] = useState(props.edit_data)
  const Close = () => {
    setModal(false);
    props.setModalStates();
  };

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

  const [checkNameStatus,setCheckStatus]=useState({});
  const [msg,setMsg] = useState("");
  const updateData = () => {
    if(ModalData.unit_name==""){
      setCheckStatus({
        borderColor:"red",
        borderStyle:"groove"
      });
      setMsg("Stages connot be empty!");
    }else{
    http
      .put("/stages/update", ModalData)
      .then(function (response) {
        props.checkchang(response.data.message,response.data.status);
      })
      .catch(function (error) {
        console.log(error);
      });
    }
    }
    const handleStages = (e)=>{
      setCheckStatus({});
      setMsg("");
      setModalData({ ...ModalData,unit_name: e.target.value })
    }

  return (
    <div>
      <Modal id="showModal" isOpen={modal} toggle={toggle} centered>
        <ModalHeader className="bg-light p-3" toggle={toggle}>
          Edit Stages
        </ModalHeader>
        <span className="tablelist-form">
          <ModalBody>
            <Card className="border card-border-success p-3 shadow-lg">
              <div className="mb-3">
              <Label htmlFor="categoryname-field" className="form-label fw-bold d-flex justify-content-between">
                  <div>
                    Stages Name<span style={{color:"red"}}> *</span>
                  </div>
                  <div style={{color:"red"}}>
                    {msg}
                  </div>
                </Label>
                <CustomInput
                  checkNameStatus={checkNameStatus}
                  name="category"
                  id="category-field"
                  className="form-control fw-bold"
                  placeholder="Stages Name"
                  type="text"
                  onChange={handleStages}
                  value={ModalData.unit_name}
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
              className="btn btn-primary"
              onClick={() => updateData()}
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

export default SourceUpdate;
