import React, { useEffect, useState, useCallback } from "react";
import { Card, Modal, ModalHeader, ModalBody, Label, Input } from "reactstrap";
import "react-toastify/dist/ReactToastify.css";
import Select from "react-select";
import AuthUser from "../../helpers/Authuser";
import { toast } from "react-toastify";
import CustomInput from "../Unit/Input";
import SupplierGroupAdd from "../SupplierGroup/SupplierGroupAdd";

const SupplierUpdate = (props) => {
  // On form submit getSupplierData imported
  const { http } = AuthUser();
  const [SupplierGroup,setSupplierGroup]=useState([]);
  const [modalStatess, setModalStatess] = useState(false);
  const [manageGroup,setManageGroup] = useState(0);
  const [counts, Setcounts] = useState(1);
  const handleCallback = (data) => {
    Setcounts(counts + 1);
    setManageGroup(1);
    toast.success(data);
    setModalStatess(false);
  };
  useEffect(()=>{
    http 
    .get("/all_supplier_groups")
    .then(function(response){
      setSupplierGroup(response.data)
      setSuppliersData(()=>({
        ...SuppliersData,
        supplier_group_type:manageGroup==0?SuppliersData.supplier_group_type:response.data[response.data.length-1].supplier_group_id
      }))
    }).catch(function(error){
      console.log(error);
  })
  },[counts+1])
  const [SuppliersData, setSuppliersData] = useState(props.edit_data);

  

  const [checkNameStatus,setCheckStatus]=useState({});
  const [msg,setMsg] = useState("");
  const OnSubmited = () => {
   if(SuppliersData.supplier_name==""){
    setCheckStatus({
      borderColor:"red",
      borderStyle:"groove"
    });
    setMsg("Supplier connot be empty!");
  }else{
    http 
    .put("/suppliers/update",SuppliersData)
    .then(function(response){
      
      props.checkchang(response.data.message,response.data.status);
    }).catch(function(error){
      console.log(error);
    })
  }
  };
  const getSupplierData = (e) => {
    setSuppliersData({ ...SuppliersData, [e.target.name]: e.target.value });
    if(SuppliersData.supplier_name!=""){
      setCheckStatus({});
      setMsg("");
    }
  };
  const getSelectedGroupValue = (e) => {
    setSuppliersData({ ...SuppliersData, supplier_group_type: e.value });

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
    props.checkchang("Supplier Create Successfully !!");
  };
  return (
    <div>
      <Modal id="showModal" size="xl" isOpen={modal} toggle={toggle} centered>
        <ModalHeader className="bg-light p-3" toggle={toggle}>
          Update Supplier
        </ModalHeader>
        <div className="tablelist-form">
          <ModalBody>
            <Card className="border card-border-success  p-3 shadow-lg">
              <div className="mb-3 row">
                <div className="col-4">
                  <Label
                    htmlFor="Suppliername-field"
                    className="form-label mt-2 fw-bold d-flex justify-content-between"
                  >
                    <div>
                    Supplier Name<span style={{color:"red"}}> *</span>
                  </div>
                  <div style={{color:"red"}}>
                    {msg}
                  </div>
                  </Label>
                  <CustomInput
                  checkNameStatus={checkNameStatus}
                    onChange={getSupplierData}
                    value={SuppliersData.supplier_name}
                    name="supplier_name"
                    id="supplier_name"
                    className="form-control fw-bold"
                    placeholder="Supplier Name"
                    type="text"
                  />
                </div>

                <div className="col-4">
                  <Label
                    htmlFor="Suppliername-field"
                    className="form-label mt-2 fw-bold"
                  >
                    Mobile No.
                  </Label>
                  <Input
                  value={SuppliersData.supplier_mobile}
                    onChange={getSupplierData}
                    name="supplier_mobile"
                    id="supplier_mobile"
                    className="form-control fw-bold"
                    placeholder="Mobile No"
                    type="text"
                  />
                </div>
                <div className="col-4">
                  <Label
                    htmlFor="Suppliername-field"
                    className="form-label mt-2 fw-bold"
                  >
                    Email.
                  </Label>
                  <Input
                  value={SuppliersData.supplier_email}
                    onChange={getSupplierData}
                    name="supplier_email"
                    id="supplier_email"
                    className="form-control fw-bold"
                    placeholder="Email"
                    type="email"
                  />
                </div>
                <div className="col-3">
                  <Label
                    htmlFor="Suppliername-field"
                    className="form-label mt-2 fw-bold"
                  >
                    GST No.
                  </Label>
                  <Input
                  value={SuppliersData.supplier_gst_no}
                    onChange={getSupplierData}
                    name="supplier_gst_no"
                    id="supplier_gst_no"
                    className="form-control fw-bold"
                    placeholder="Gst No"
                    type="text"
                  />
                </div>
                <div className="col-3">
                  <Label
                    htmlFor="Suppliername-field"
                    className="form-label mt-2 fw-bold"
                  >
                    Pan No.
                  </Label>
                  <Input
                  value={SuppliersData.supplier_pan_no}
                    onChange={getSupplierData}
                    name="supplier_pan_no"
                    id="supplier_pan_no"
                    className="form-control fw-bold"
                    placeholder="Pan No"
                    type="text"
                  />
                </div>
                <div className="col-3">
                  <Label
                    htmlFor="Suppliername-field"
                    className="form-label mt-2 fw-bold"
                  >
                    Opening Balance.
                  </Label>
                  <Input
                  value={SuppliersData.supplier_opening_balance}
                    onChange={getSupplierData}
                    name="supplier_opening_balance"
                    id="supplier_opening_balance"
                    className="form-control fw-bold"
                    placeholder="Opening Balance"
                    type="number"
                  />
                </div>
                <div className="col-3">
                  <Label
                    htmlFor="Suppliername-field"
                    className="form-label mt-2 fw-bold d-flex justify-content-between"
                  >
                    Group Type
                    
                    <button
                            className="btn btn-success btn-sm px-1"
                            style={{ padding: "0px" }}
                            onClick={handlModalState}
                          >
                            <i className="ri-add-line align-bottom"></i>
                          </button>
                  </Label>
                  <Select
                    placeholder={manageGroup==0?SuppliersData.supplier_group_name:SupplierGroup[SupplierGroup.length-1].supplier_group_name}
                    onChange={getSelectedGroupValue}
                    options={SupplierGroup.map((item)=>({value:item.supplier_group_id,label:item.supplier_group_name}))}
                    name="supplier_group_type"
                    id="supplier_group_type"
                    className="fw-bold"
                  />
                </div>

                <div className="col-6">
                  <Label
                    htmlFor="Suppliername-field"
                    className="form-label mt-3 fw-bold"
                  >
                    Billing Address
                  </Label>
                  <textarea
                  value={SuppliersData.supplier_billing_address}
                    onChange={getSupplierData}
                    rows={3}
                    placeholder="Enter billing address"
                    className="form-control fw-bold"
                    name="supplier_billing_address"
                    id="supplier_billing_address"
                  />
                </div>
                <div className="col-6">
                  <Label
                    htmlFor="Suppliername-field"
                    className="form-label mt-3  d-flex justify-content-between"
                  >
                    <div className="fw-bold">Shipping Address</div>
                    <div>same as billing address</div>
                  </Label>
                  <textarea
                  value={SuppliersData.supplier_shipping_address}
                    onChange={getSupplierData}
                    rows={3}
                    placeholder="Enter shipping address"
                    className="form-control fw-bold"
                    name="supplier_shipping_address"
                    id="supplier_shipping_address"
                  />
                </div>

                <div className="col-4">
                  <Label
                    htmlFor="Suppliername-field"
                    className="form-label mt-2 fw-bold"
                  >
                    City.
                  </Label>
                  <Input
                  value={SuppliersData.supplier_city}
                    onChange={getSupplierData}
                    name="supplier_city"
                    id="supplier_city"
                    className="form-control fw-bold"
                    placeholder="City"
                    type="text"
                  />
                </div>

                <div className="col-4">
                  <Label
                    htmlFor="Suppliername-field"
                    className="form-label mt-2 fw-bold"
                  >
                    Credit Limit
                  </Label>
                  <Input
                  value={SuppliersData.supplier_credit_limit}
                    onChange={getSupplierData}
                    name="supplier_credit_limit"
                    id="supplier_credit_limit"
                    className="form-control fw-bold"
                    placeholder="Credit Limit"
                    type="text"
                  />
                </div>
                <div className="col-4">
                  <Label
                    htmlFor="Suppliername-field"
                    className="form-label mt-2 fw-bold"
                  >
                    Credit Period(days)
                  </Label>
                  <Input
                  value={SuppliersData.supplier_credit_period_day}
                    onChange={getSupplierData}
                    name="supplier_credit_period_day"
                    id="supplier_credit_period_day"
                    className="form-control fw-bold"
                    placeholder="Credit Period(days)"
                    type="text"
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
      {modalStatess === true ? (
        <SupplierGroupAdd
          modalStates={modalStatess}
          setModalStates={() => {
            setModalStatess(false);
          }}
          checkchang={handleCallback}
        />
        
      ) : (
        ""
      )}
    </div>
  );
};

export default SupplierUpdate;
