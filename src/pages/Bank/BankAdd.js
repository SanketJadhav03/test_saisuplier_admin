import React, { useEffect, useState, useCallback, useRef } from "react";
import { Card, Modal, ModalHeader, ModalBody, Label, Input } from "reactstrap";
import "react-toastify/dist/ReactToastify.css";
import AuthUser from "../../helpers/Authuser";
import { toast } from "react-toastify";
import CustomInput from "../Unit/Input";
import Select from "react-select";
import CategoryAdd from "../Category/CategoryAdd";
const BankAdd = (props) => {
  const [modal, setModal] = useState(false);
  const [BankName, SetBankName] = useState("");
  const [BankImg, SetBankImg] = useState("");
  const [bank_category, Setbank_category] = useState(1);
  const [modalStatess, setModalStatess] = useState(false);
  const { https, http } = AuthUser();
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
        .post("/bank/store", { bank_img: BankImg, bank_name: BankName, bank_category: bank_category })
        .then(function (response) {
          props.checkchang(response.data.message, response.data.status);
        })
        .catch(function (error) {
          console.log(error);
        });
    }
  };
  const handleBank = (e) => {
    setCheckStatus({});
    setMsg("");
    SetBankName(e.target.value);
  };

  // shortcuts for save and close
  const submitButtonRef = useRef();
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.altKey && event.key === "Escape") {
        event.preventDefault();
        props.setModalStates(false);
      }
      if (
        (event.altKey && event.key === "s") ||
        (event.altKey && event.key === "S")
      ) {
        event.preventDefault();
        submitButtonRef.current.click();
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);
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
          Add Sub Category
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
                  placeholder={CategoryData[0]?.category_name || "Add Category First"}
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
                  id="category-field"
                  className="form-control fw-bold"
                  placeholder="Sub Category Name"
                  type="text"
                  onChange={handleBank}
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
                          defaultValue=""
                          id="product-image-input"
                          type="file"
                          accept="image/png, image/gif, image/jpeg"
                          onChange={(e) => SetBankImg(e.target.files[0])}
                        />
                      </div>
                      <div className="avatar-lg">
                        <div className="avatar-title bg-light rounded">
                          {BankImg ? (
                            <img
                              src={
                                BankImg ? URL.createObjectURL(BankImg) : ""
                              }
                              id="product-img"
                              alt="product-img"
                              className="h-auto"
                              width={"200px"}
                            />
                          ) : (
                            ""
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
              ref={submitButtonRef}
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

export default BankAdd;
