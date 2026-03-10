import React, { useEffect, useState, useCallback } from "react";
import {
  Card,
  Modal,
  ModalHeader,
  Form,
  ModalBody,
  Label,
  Input,
} from "reactstrap";
import "react-toastify/dist/ReactToastify.css";
import AuthUser from "../../helpers/Authuser";
import CustomInput from "../Unit/Input";

const TaxUpdate = (props) => {
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

  const [TaxValues, setTaxValues] = useState(props.edit_data);
  const handleTax = (e) => {
    if(e.target.name=="tax_name"){
      setCheckStatus({});
      setMsg("");
    }
    if(e.target.name=="tax_percentage"){
      setCheckStatus1({});
      setMsg1("");
    }
    setTaxValues({ ...TaxValues, [e.target.name]: e.target.value });
  };

  const [checkNameStatus,setCheckStatus]=useState({});
  const [checkNameStatus1,setCheckStatus1]=useState({});
  const [msg,setMsg] = useState("");
  const [msg1,setMsg1] = useState("");
  const SubmitData = () => {
  if(TaxValues.tax_name==""){
    setCheckStatus({
      borderColor:"red",
      borderStyle:"groove"
    });
    setMsg("Tax connot be empty!");
  }
    else if(TaxValues.tax_percentage==""){
      setCheckStatus1({
        borderColor:"red",
        borderStyle:"groove"
      });
      setMsg1("Percentage cannot be empty!");
    }else{

    http
      .put("/tax/update", TaxValues)
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
          Edit Tax
        </ModalHeader>
        <span className="tablelist-form">
          <ModalBody>
            <Card className="border card-border-success p-3 shadow-lg">
              <div className="mb-3">
              <Label htmlFor="categoryname-field" className="form-label fw-bold d-flex justify-content-between">
                  <div>
                    Tax Name<span style={{color:"red"}}> *</span>
                  </div>
                  <div style={{color:"red"}}>
                    {msg}
                  </div>
                </Label>
                <CustomInput
                checkNameStatus={checkNameStatus}
                  name="tax_name"
                  id="category-field"
                  className="form-control fw-bold"
                  placeholder="Tax Name"
                  type="text"
                  value={TaxValues.tax_name}
                  onChange={handleTax}
                />
              </div>

              <div className="mb-3">
              <Label htmlFor="categoryimage-field" className="form-label fw-bold d-flex justify-content-between">
                <div>
                    Tax Percentage<span style={{color:"red"}}> *</span>
                  </div>
                  <div style={{color:"red"}}>
                    {msg1}
                  </div>
                </Label>
                <Input
                style={checkNameStatus1}
                  className="form-control fw-bold"
                  id="formSizeDefault"
                  placeholder="Tax percentage"
                  type="text"
                  name="tax_percentage"
                  value={TaxValues.tax_percentage}
                  onChange={handleTax}
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

export default TaxUpdate;
