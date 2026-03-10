import React, { useEffect, useState, useCallback } from "react";
import {
  Card,
  Modal,
  ModalHeader,
  ModalBody,
  Label,
  Input,
  Row,
  Col,
} from "reactstrap";
import "react-toastify/dist/ReactToastify.css";
import AuthUser from "../../helpers/Authuser";
import CustomInput from "../Unit/Input";
import { IMG_API_URL } from "../../helpers/url_helper";
import D_img from "../D_img";

const CategoryEdit = (props) => {
  const [modal, setModal] = useState(false);
  const [Category, SetCategory] = useState(props.edit_data.category_name);
  const [BrandID] = useState(props.edit_data.category_id);
  const [BannerSet, SetBannerSet] = useState();
  const [CategoryImg, SetCategoryImg] = useState();
  const { https } = AuthUser();
  const [checkNameStatus, setCheckStatus] = useState({});
  const [msg, setMsg] = useState("");
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

  const SubmitData = () => {
    if (Category == "") {
      setCheckStatus({
        borderColor: "red",
        borderStyle: "groove",
      });
      setMsg("Category cannot be empty!");
    } else {
      https
        .put("/category/update", {
          category_id: BrandID,
          category_img: CategoryImg,
          category_name: Category,
          category_banner: BannerSet,
        })
        .then(function (response) {
          props.checkchang(response.data.message,response.data.status);
        })
        .catch(function (error) {
          console.log(error);
        });
    }

  };
  const handleCategory = (e) => {
    setCheckStatus({});
    setMsg("");
    SetCategory(e.target.value);
  };
  return (
    <div>
      <Modal id="showModal" isOpen={modal} toggle={toggle} centered>
        <ModalHeader className="bg-light p-3" toggle={toggle}>
          Category Edit
        </ModalHeader>
        <span className="tablelist-form">
          <ModalBody>
            <Card className="border card-border-success p-3 shadow-lg">
              <Row>
                <Col lg={12}>
                  <div className="mb-3">
                    <Label
                      htmlFor="categoryname-field"
                      className="form-label fw-bold d-flex justify-content-between"
                    >
                      <div>
                        Category Name<span style={{ color: "red" }}> *</span>
                      </div>
                      <div style={{ color: "red" }}>{msg}</div>
                    </Label>
                    <CustomInput
                      checkNameStatus={checkNameStatus}
                      name="category"
                      id="category-field"
                      className="form-control fw-bold"
                      placeholder="Category Name"
                      type="text"
                      value={Category}
                      onChange={handleCategory}
                    />
                  </div>
                </Col>
                <Col lg={6}>
                  <div className="mb-4">
                    <h5 className="fs-15 mb-1">Select New Category Image</h5>
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
                            onChange={(e) => SetCategoryImg(e.target.files[0])}
                          />
                        </div>
                        <div className="avatar-lg">
                          <div className="avatar-title bg-light rounded">
                            {CategoryImg ? (
                              <img
                                src={URL.createObjectURL(CategoryImg)}
                                id="product-img"
                                alt="product-img"
                                className="h-auto"
                                width={"100px"}
                              />
                            ) : (
                              props.edit_data.category_img?(<img
                                src={`${IMG_API_URL}/category/${props.edit_data.category_img}`}
                                id="product-img"
                                alt="product-img"
                                className="h-auto"
                                width={"100px"}
                              />):(
                                <D_img/>
                              )
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </Col>
                <Col lg={6}>
                  <div className="mb-4">
                    <h5 className="fs-15 mb-1">Select New Banner Image</h5>
                    <div className="text-center">
                      <div className="position-relative d-inline-block">
                        <div className="position-absolute top-100 start-100 translate-middle">
                          <label
                            htmlFor="product-image-input1"
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
                            id="product-image-input1"
                            type="file"
                            accept="image/png, image/gif, image/jpeg"
                            onChange={(e) => SetBannerSet(e.target.files[0])}
                          />
                        </div>
                        <div className="avatar-lg">
                          <div className="avatar-title bg-light rounded">
                            {BannerSet ? (
                              <img
                                src={URL.createObjectURL(BannerSet)}
                                id="product-img"
                                alt="product-img"
                                className="h-auto"
                                width={"100px"}
                              />
                            ) : (
                             
                              props.edit_data.category_banner?(<img
                                src={`${IMG_API_URL}/category/${props.edit_data.category_banner}`}
                                id="product-img"
                                alt="product-img"
                                className="h-auto"
                                width={"100px"}
                              />):(
                                <D_img/>
                              )
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </Col>
              </Row>
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

export default CategoryEdit;
