import React, { useEffect, useState, useCallback, useRef } from "react";
import { Card, Modal, ModalHeader, ModalBody, Label, Input } from "reactstrap";
import "react-toastify/dist/ReactToastify.css";
import AuthUser from "../../helpers/Authuser";
import { toast } from "react-toastify";
import CustomInput from "../Unit/Input";

const OurClientAdd = (props) => {
  const [modal, setModal] = useState(false);
  const [OurClientName, SetOurClientName] = useState("");
  const [OurClientImg, SetOurClientImg] = useState("");
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

  const [checkNameStatus, setCheckStatus] = useState({});
  const [msg, setMsg] = useState("");
  const SubmitData = () => {
    if (OurClientName == "") {
      setCheckStatus({
        borderColor: "red",
        borderStyle: "groove",
      });
      setMsg("OurClient cannot be empty!");
    } else {
      https
        .post("/ourClient/store", { ourClient_img: OurClientImg, ourClient_name: OurClientName })
        .then(function (response) {
          props.checkchang(response.data.message, response.data.status);
        })
        .catch(function (error) {
          console.log(error);
        });
    }
  };
  const handleOurClient = (e) => {
    setCheckStatus({});
    setMsg("");
    SetOurClientName(e.target.value);
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

  return (
    <div>
      <Modal id="showModal" isOpen={modal} toggle={toggle} centered>
        <ModalHeader className="bg-light p-3" toggle={toggle}>
          Add OurClient
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
                    OurClient Name<span style={{ color: "red" }}> *</span>
                  </div>
                  <div style={{ color: "red" }}>{msg}</div>
                </Label>
                <CustomInput
                  checkNameStatus={checkNameStatus}
                  id="category-field"
                  className="form-control fw-bold"
                  placeholder="OurClient Name"
                  type="text"
                  onChange={handleOurClient}
                />
              </div>
              <div className="mb-3">
                <Label htmlFor="categoryname-field" className="form-label">
                  OurClient Image
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
                          onChange={(e) => SetOurClientImg(e.target.files[0])}
                        />
                      </div>
                      <div className="avatar-lg">
                        <div className="avatar-title bg-light rounded">
                          {OurClientImg ? (
                            <img
                              src={
                                OurClientImg ? URL.createObjectURL(OurClientImg) : ""
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
    </div>
  );
};

export default OurClientAdd;
