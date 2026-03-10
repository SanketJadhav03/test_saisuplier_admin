import React, { useEffect, useState, useCallback } from "react";
import { Card, Modal, ModalHeader, ModalBody, Label, Input } from "reactstrap";
import "react-toastify/dist/ReactToastify.css";
import AuthUser from "../../helpers/Authuser";
import CustomInput from "../Unit/Input";

const ExpensesUpdate = (props) => {
  const [modal, setModal] = useState(false);
  const { http } = AuthUser();
  const Close = () => {
    setModal(false);
    props.setModalStates();
  };

  useEffect(() => {
    setModal(false);
    toggle();
  }, [props.modalState]);

  const toggle = useCallback(() => {
    if (modal) {
      setModal(false);
      props.setModalStates();
    } else {
      setModal(true);
    }
  }, [modal]);

  const [checkNameStatus,setCheckStatus]=useState({});
  const [msg,setMsg] = useState("");
  const [UpdateData, SetUpData] = useState(props.edit_data);
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    SetUpData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
    if(UpdateData.expenses_type!=""){
      setCheckStatus({});
      setMsg("");
    }
  };
  const SubmitData = () => {
    if(UpdateData.expenses_type==""){
      setCheckStatus({
        borderColor:"red",
        borderStyle:"groove"
      });
      setMsg("Expenses connot be empty!");
    }else{
    http
      .put("/expenses/update", UpdateData)
      .then(function (response) {
        props.checkchang(response.data.message,response.data.status);
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
          Edit Expenses
        </ModalHeader>
        <span className="tablelist-form">
          <ModalBody>
            <Card className="border card-border-success p-3 shadow-lg">
              <div className="mb-3">
                <Label htmlFor="categoryname-field" className="form-label fw-bold  d-flex justify-content-between">
                <div>
                    Expenses Name<span style={{color:"red"}}> *</span>
                  </div>
                  <div style={{color:"red"}}>
                    {msg}
                  </div>
                </Label>
                <CustomInput
                  checkNameStatus={checkNameStatus}
                  name="expenses_type"
                  id="category-field"
                  className="form-control fw-bold"
                  placeholder="Expenses Name"
                  type="text"
                  onChange={handleInputChange}
                  value={UpdateData.expenses_type}
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
              Save
            </button>
          </div>
        </span>
      </Modal>
    </div>
  );
};

export default ExpensesUpdate;
