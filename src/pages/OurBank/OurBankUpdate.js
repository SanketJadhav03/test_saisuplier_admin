import React, { useEffect, useState, useCallback } from "react";
import { Card, Modal, ModalHeader, ModalBody, Label, Input } from "reactstrap";
import "react-toastify/dist/ReactToastify.css";
import AuthUser from "../../helpers/Authuser";
import CustomInput from "../Unit/Input";
import D_img from "../D_img";
import { IMG_API_URL } from "../../helpers/url_helper";

const OurBankUpdate = (props) => {
  const [modal, setModal] = useState(false);
  const { https } = AuthUser();

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

  const [OurBankName, SetOurBankName] = useState(props.edit_data.ourBank_name);
  const [OurBankImg, SetOurBankImg] = useState();
  const [OurBankID] = useState(props.edit_data.ourBank_id);
  const [checkNameStatus, setCheckStatus] = useState({});
  const [msg, setMsg] = useState("");
  const SubmitData = () => {
    if (OurBankName == "") {
      setCheckStatus({
        borderColor: "red",
        borderStyle: "groove",
      });
      setMsg("OurBank cannot be empty!");
    } else {
      https
        .put("/ourBank/update", {
          ourBank_name: OurBankName,
          ourBank_img: OurBankImg,
          ourBank_id: OurBankID,
        })
        .then(function (response) {
          props.checkchang(response.data.message, response.data.status);
        })
        .catch(function (error) {
          console.log(error);
        });
    }
  };
  const handleOurBankData = (e) => {
    setCheckStatus({});
    setMsg("");
    SetOurBankName(e.target.value);
  };
  return (
    <div>
      <Modal id="showModal" isOpen={modal} toggle={toggle} centered>
        <ModalHeader className="bg-light p-3" toggle={toggle}>
          Update OurBank
        </ModalHeader>
        <span className="tablelist-form">
          <ModalBody>
            <Card className="border card-border-success p-3 shadow-lg">
              <div className="mb-3">
                <Label
                  htmlFor="categoryname-field"
                  className="form-label fw-bold d-flex justify-content-between"
                >
                  <div>
                    OurBank Name<span style={{ color: "red" }}> *</span>
                  </div>
                  <div style={{ color: "red" }}>{msg}</div>
                </Label>
                <CustomInput
                  checkNameStatus={checkNameStatus}
                  name="category"
                  id="category-field"
                  className="form-control fw-bold"
                  placeholder="OurBank Name"
                  onChange={handleOurBankData}
                  type="text"
                  value={OurBankName}
                />
              </div>
              <div className="mb-3">
                <Label htmlFor="categoryname-field" className="form-label">
                  OurBank Image
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
                          onChange={(e) => SetOurBankImg(e.target.files[0])}
                          accept="image/png, image/gif, image/jpeg"
                        />
                      </div>
                      <div className="avatar-lg">
                        <div className="avatar-title bg-light rounded">
                          {OurBankImg ? (
                            <img
                              src={URL.createObjectURL(OurBankImg)}
                              id="product-img"
                              alt="product-img"
                              className="h-auto"
                              width={"200px"}
                            />
                          ) : props.edit_data.ourBank_img ? (
                            <img
                              src={`${IMG_API_URL}/ourBanks/${props.edit_data.ourBank_img}`}
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
    </div>
  );
};

export default OurBankUpdate;
