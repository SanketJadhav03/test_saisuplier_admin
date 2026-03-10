import React, { useEffect, useState, useCallback } from "react";
import { Card, Modal, ModalHeader, ModalBody, Label, Input } from "reactstrap";
import "react-toastify/dist/ReactToastify.css";
import AuthUser from "../../helpers/Authuser";
import CustomInput from "../Unit/Input";
import D_img from "../D_img";
import { IMG_API_URL } from "../../helpers/url_helper";
import Select from "react-select";
import { toast } from "react-toastify";
import CategoryAdd from "../Category/CategoryAdd";

const BankUpdate = (props) => {
  const [modal, setModal] = useState(false);
  const { https, http } = AuthUser();
  const [modalStatess, setModalStatess] = useState(false);
  const [bank_category, Setbank_category] = useState(props.edit_data.bank_category);
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

  const [BankName, SetBankName] = useState(props.edit_data.bank_name);
  const [BankImg, SetBankImg] = useState();
  const [BankID] = useState(props.edit_data.bank_id);
  const [checkNameStatus, setCheckStatus] = useState({});
  const [msg, setMsg] = useState("");
  const SubmitData = () => {
    if (BankName == "") {
      setCheckStatus({
        borderColor: "red",
        borderStyle: "groove",
      });
      setMsg("Bank cannot be empty!");
    } else {
      https
        .put("/bank/update", {
          bank_name: BankName,
          bank_img: BankImg,
          bank_id: BankID,
          bank_category: bank_category,
        })
        .then(function (response) {
          props.checkchang(response.data.message, response.data.status);
        })
        .catch(function (error) {
          console.log(error);
        });
    }
  };
  const handleBankData = (e) => {
    setCheckStatus({});
    setMsg("");
    SetBankName(e.target.value);
  };

  const [counts, setCounts] = useState(1);
  const handleCategoryCallback = (data, status) => {
    if (status == 0) {
      setCounts(counts + 1);
      toast.success(data);
    } else {
      toast.warn(data);
    }
    setModalStatess(false);
  };
  const [CategoryData, SetCategoryData] = useState([]);
  useEffect(() => {
    http
      .get(`/category/list`)
      .then(function (response) {
        if (response.data.length > 0) {
          SetCategoryData(response.data);
        }
      })
      .catch(function (error) {
        console.log(error);
      });
  }, [counts]);
  return (
    <div>
      <Modal id="showModal" isOpen={modal} toggle={toggle} centered>
        <ModalHeader className="bg-light p-3" toggle={toggle}>
          Update Sub Category
        </ModalHeader>
        <span className="tablelist-form">
          <ModalBody>
            <Card className="border card-border-success p-3 shadow-lg">
              <div className="mb-3">
                <Label
                  htmlFor="customername-field"
                  className="form-label fw-bold d-flex justify-content-between"
                >
                  Category
                  <button
                    className="btn btn-success btn-sm px-1"
                    style={{ padding: "0px" }}
                    onClick={() => setModalStatess(!false)}
                  >
                    <i className="ri-add-line align-bottom"></i>
                  </button>
                </Label>

                <Select
                  value={{
                    value: bank_category,
                    label: CategoryData.find(item => item.category_id == bank_category)?.category_name
                  }}
                  name="product_category"
                  id="contactnumberInput"
                  className="fw-bold"
                  onChange={(e) => {
                    Setbank_category(e.value);
                  }}
                  options={
                    CategoryData.map((item) => ({
                      value: item.category_id,
                      label: item.category_name,
                    }))
                  }
                />
              </div>
              <div className="mb-3">
                <Label
                  htmlFor="categoryname-field"
                  className="form-label fw-bold d-flex justify-content-between"
                >
                  <div>
                    Sub Category Name<span style={{ color: "red" }}> *</span>
                  </div>
                  <div style={{ color: "red" }}>{msg}</div>
                </Label>
                <CustomInput
                  checkNameStatus={checkNameStatus}
                  name="category"
                  id="category-field"
                  className="form-control fw-bold"
                  placeholder="Sub Category Name"
                  onChange={handleBankData}
                  type="text"
                  value={BankName}
                />
              </div>
              <div className="mb-3">
                <Label htmlFor="categoryname-field" className="form-label">
                  Sub Category Image
                </Label>
                <div className="mb-4">
                  <div className="text-center">
                    <div className="position-relative d-inline-block">
                      <div className="position-absolute top-100 start-100 translate-middle">
                        <label
                          htmlFor="product-image-input"
                          className="mb-0"
                          data-bs-toggle="tooltip"
                          data-bs-placement="right"
                          title=""
                          data-bs-original-title="Select Image"
                        >
                          <div className="avatar-xs">
                            <div className="avatar-title bg-light border rounded-circle text-muted cursor-pointer">
                              <i className="ri-image-fill"></i>
                            </div>
                          </div>
                        </label>
                        <input
                          className="form-control d-none"
                          id="product-image-input"
                          type="file"
                          onChange={(e) => SetBankImg(e.target.files[0])}
                          accept="image/png, image/gif, image/jpeg"
                        />
                      </div>
                      <div className="avatar-lg">
                        <div className="avatar-title bg-light rounded">
                          {BankImg ? (
                            <img
                              src={URL.createObjectURL(BankImg)}
                              id="product-img"
                              alt="product-img"
                              className="h-auto"
                              width={"200px"}
                            />
                          ) : props.edit_data.bank_img ? (
                            <img
                              src={`${IMG_API_URL}/banks/${props.edit_data.bank_img}`}
                              id="product-img"
                              alt="product-img"
                              className="h-auto"
                              width={"200px"}
                            />
                          ) : (
                            <D_img />
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
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
      {modalStatess === true ? (
        <CategoryAdd
          modalStates={modalStatess}
          setModalStates={() => {
            setModalStatess(false);
          }}
          checkchang={handleCategoryCallback}
        />
      ) : (
        ""
      )}
    </div>
  );
};

export default BankUpdate;
