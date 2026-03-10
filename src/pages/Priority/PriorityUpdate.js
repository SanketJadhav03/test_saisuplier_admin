import React, { useEffect, useState, useCallback } from "react";
import { Card, Modal, ModalHeader, ModalBody, Label, Input } from "reactstrap";
import "react-toastify/dist/ReactToastify.css";
import AuthUser from "../../helpers/Authuser";
import CustomInput from "./Input";

const PriorityUpdate = (props) => {
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
    if(ModalData.name==""){
      setCheckStatus({
        borderColor:"red",
        borderStyle:"groove"
      });
      setMsg("Priority connot be empty!");
    }else{
    http
      .put(`/priority/update/${ModalData.id}`, ModalData)
      .then(function (response) {
        props.checkchang(response.data.message,response.data.status);
      })
      .catch(function (error) {
        console.log(error);
      });
    }
    }
    const handlePriority = (e)=>{
      setCheckStatus({});
      setMsg("");
      setModalData({ ...ModalData,name: e.target.value })
    }

  return (
    <div>
      <Modal id="showModal" isOpen={modal} toggle={toggle} centered>
        <ModalHeader className="bg-light p-3" toggle={toggle}>
          Edit Priority
        </ModalHeader>
        <span className="tablelist-form">
          <ModalBody>
            <Card className="border card-border-success p-3 shadow-lg">
              <div className="mb-3">
              <Label htmlFor="categoryname-field" className="form-label fw-bold d-flex justify-content-between">
                  <div>
                    Priority Name<span style={{color:"red"}}> *</span>
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
                  placeholder="Priority Name"
                  type="text"
                  onChange={handlePriority}
                  value={ModalData.name}
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

export default PriorityUpdate;
