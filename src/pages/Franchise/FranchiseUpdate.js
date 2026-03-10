import React, { useEffect, useState, useCallback } from "react";
import { Card, Modal, ModalHeader, ModalBody, Label, Input } from "reactstrap";
import "react-toastify/dist/ReactToastify.css";
import Select from "react-select";
import AuthUser from "../../helpers/Authuser";
import { toast } from "react-toastify";
import CustomInput from "../Unit/Input";


const FranchiseUpdate = (props) => {
  // On form submit getFranchiseData imported
  const { http } = AuthUser(); 
  const [modalStatess, setModalStatess] = useState(false);
  
  const [counts, Setcounts] = useState(1);
  const handleCallback = (data) => {
    Setcounts(counts + 1);
    
    toast.success(data);
    setModalStatess(false);
  };
  
  const [FranchisesData, setFranchisesData] = useState(props.edit_data);

  

  const [checkNameStatus,setCheckStatus]=useState({});
  const [msg,setMsg] = useState("");
  const OnSubmited = () => {
   if(FranchisesData.franchise_name==""){
    setCheckStatus({
      borderColor:"red",
      borderStyle:"groove"
    });
    setMsg("Franchise connot be empty!");
  }else{
    http 
    .put("/franchise/update",FranchisesData)
    .then(function(response){
      
      props.checkchang(response.data.message,response.data.status);
    }).catch(function(error){
      console.log(error);
    })
  }
  };
  const getFranchiseData = (e) => {
    setFranchisesData({ ...FranchisesData, [e.target.name]: e.target.value });
    if(FranchisesData.franchise_name!=""){
      setCheckStatus({});
      setMsg("");
    }
  };
  

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

  const handlModalState =()=>{
    
    setModalStatess(!false);
  }
  const SubmitData = () => {
    props.checkchang("Franchise Create Successfully !!");
  };
  return (
    <div>
      <Modal id="showModal" size="xl" isOpen={modal} toggle={toggle} centered>
        <ModalHeader className="bg-light p-3" toggle={toggle}>
          Update Franchise
        </ModalHeader>
        <div className="tablelist-form">
          <ModalBody>
            <Card className="border card-border-success  p-3 shadow-lg">
              <div className="mb-3 row">
                <div className="col-6">
                  <Label
                    htmlFor="Franchisename-field"
                    className="form-label mt-2 fw-bold d-flex justify-content-between"
                  >
                    <div>
                    Franchise Name<span style={{color:"red"}}> *</span>
                  </div>
                  <div style={{color:"red"}}>
                    {msg}
                  </div>
                  </Label>
                  <CustomInput
                  checkNameStatus={checkNameStatus}
                    onChange={getFranchiseData}
                    value={FranchisesData.franchise_name}
                    name="franchise_name"
                    id="franchise_name"
                    className="form-control fw-bold"
                    placeholder="Franchise Name"
                    type="text"
                  />
                </div>

                <div className="col-6">
                  <Label
                    htmlFor="Franchisename-field"
                    className="form-label mt-2 fw-bold"
                  >
                    Mobile No.
                  </Label>
                  <Input
                  value={FranchisesData.franchise_mobile}
                    onChange={getFranchiseData}
                    name="franchise_mobile"
                    id="franchise_mobile"
                    className="form-control fw-bold"
                    placeholder="Mobile No"
                    type="text"
                  />
                </div>
                <div className="col-6">
                  <Label
                    htmlFor="Franchisename-field"
                    className="form-label mt-2 fw-bold"
                  >
                    Email.
                  </Label>
                  <Input
                  value={FranchisesData.franchise_email}
                    onChange={getFranchiseData}
                    name="franchise_email"
                    id="franchise_email"
                    className="form-control fw-bold"
                    placeholder="Email"
                    type="email"
                  />
                </div> 
                <div className="col-6">
                  <Label
                    htmlFor="Franchisename-field"
                    className="form-label mt-2 fw-bold"
                  >
                    Password
                  </Label>
                  <Input
                  value={FranchisesData.franchise_password}
                    onChange={getFranchiseData}
                    name="franchise_password"
                    id="franchise_password"
                    className="form-control fw-bold"
                    placeholder="Password"
                    type="password"
                  />
                </div> 

                <div className="col-12">
                  <Label
                    htmlFor="Franchisename-field"
                    className="form-label mt-3 fw-bold"
                  >
                   Address
                  </Label>
                  <textarea
                  value={FranchisesData.franchise_address}
                    onChange={getFranchiseData}
                    rows={3}
                    placeholder="Enter address"
                    className="form-control fw-bold"
                    name="franchise_address"
                    id="franchise_address"
                  />
                </div> 
              </div>
            </Card>
          </ModalBody>
          <div className="modal-footer">
            <div className="hstack gap-2 justify-content-end">
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
                type="button"
                name="sumbit"
                id="submit"
                className="btn btn-primary"
                onClick={() => OnSubmited()}
              >
                <i className="ri-save-3-line align-bottom me-1"></i>
                Update
              </button>
            </div>
          </div>
        </div>
      </Modal>
      
    </div>
  );
};

export default FranchiseUpdate;
