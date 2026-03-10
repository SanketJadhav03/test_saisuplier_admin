import React, { useEffect, useState, useCallback } from "react";
import { Card, Modal, ModalHeader, ModalBody, Label, Input } from "reactstrap";
import "react-toastify/dist/ReactToastify.css";
import AuthUser from "../../helpers/Authuser";
import CustomInput from "../Unit/Input";

const IndustryTypeUpdate = (props) => {
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

  // Getting Data to updated 
  const {http} = AuthUser();
  const [checkNameStatus,setCheckStatus]=useState({});
  const [msg,setMsg] = useState("");
  const [IndustryType,setIndustryType]=useState(props.edit_data);
  const SubmitData = () => {
    if(IndustryType.industry_type_name!=""){
    http 
    .put("/industry_types/update",IndustryType)
    .then(function(response){
      
      props.checkchang(response.data.message,response.data.status);
    }).catch(function(error){
      console.log(error);
    })
  }else{
    setCheckStatus({
      borderColor:"red",
      borderStyle:"groove"
    });
    setMsg("IndustryType cannot be empty!");
  }
  };
  const handleIndustryType =(e)=>{
    setCheckStatus({});
    setMsg("");
    setIndustryType({...IndustryType,industry_type_name:e.target.value});
  }
  return (
    <div>
      <Modal id="showModal" isOpen={modal} toggle={toggle} centered>
        <ModalHeader className="bg-light p-3" toggle={toggle}>
          Update IndustryType
        </ModalHeader>
        <span className="tablelist-form">
          <ModalBody>
            <Card className="border card-border-success p-3 shadow-lg">
              <div className="mb-3">
              <Label htmlFor="categoryname-field" className="form-label fw-bold d-flex justify-content-between">
                  <div>
                    IndustryType Name<span style={{color:"red"}}> *</span>
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
                  placeholder="IndustryType Name"
                  type="text"
                  value={IndustryType.industry_type_name}
                  onChange={handleIndustryType}
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
              onClick={() => SubmitData()}
            >
              <i className="ri-save-3-line align-bottom me-1"></i>
              Update
            </button>
          </div>
        </span>
      </Modal>
    </div>
  );
};

export default IndustryTypeUpdate;
