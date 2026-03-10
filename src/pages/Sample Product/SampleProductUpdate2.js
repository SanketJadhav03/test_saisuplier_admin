import React, { useEffect, useState, useCallback, useRef } from "react";
import classnames from "classnames";
import {
  Card,
  Modal,
  ModalHeader,
  ModalBody,
  Label,
  Input,
  Col,
  TabContent,
  TabPane,
  Row,
  Nav,
  NavItem,
  NavLink,
} from "reactstrap";
import "react-toastify/dist/ReactToastify.css";
import AuthUser from "../../helpers/Authuser";
import { toast } from "react-toastify";
import D_img from "../D_img";
import { IMG_API_URL } from "../../helpers/url_helper";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";

const SampleProductUpdate2 = (props) => {
  const [modal, setModal] = useState(false);
  const [singleImg, setSingleImg] = useState("");
  const [multipleImg, setMultipleImg] = useState([]);
  const [activeTab, setActiveTab] = useState("1");
  const [sampleProduct, setSampleProduct] = useState(props.edit_data);
  const [checkNameStatus, setCheckStatus] = useState({});
  const [msg, setMsg] = useState("");
  const { http, https } = AuthUser();

  const [oldMultipleImages, setOldMultipleImages] = useState(
    sampleProduct.sample_product_multiple_image !== '[]' 
      ? JSON.parse(sampleProduct.sample_product_multiple_image) 
      : []
  );

  const handleMultipleImgChange = (e) => {
    const files = Array.from(e.target.files);
    setMultipleImg((prev) => [...prev, ...files]);
  };

  const removeOldImage = (index) => {
    const updated = [...oldMultipleImages];
    updated.splice(index, 1);
    setOldMultipleImages(updated);
  };

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

  const tog_fullscreen1 = () => {
    setModal(!modal);
  };

  const toggleTab = (tab) => {
    if (activeTab !== tab) {
      setActiveTab(tab);
    }
  };

  const handleInputChange = (e) => {
    setSampleProduct({
      ...sampleProduct,
      [e.target.name]: e.target.value
    });
  };
const SubmitData = () => {
  if (sampleProduct.sample_product_english_name === "") {
    setCheckStatus({
      borderColor: "red",
      borderStyle: "groove",
    });
    setMsg("Product name cannot be empty!");
    return;
  }

  const formData = new FormData();
  
  // Append all your data
  formData.append("sample_product_id", sampleProduct.sample_product_id);
  formData.append("sample_product_english_name", sampleProduct.sample_product_english_name);
  formData.append("sample_product_description", sampleProduct.sample_product_description);
  formData.append("sample_product_mrp", sampleProduct.sample_product_mrp);
  formData.append("sample_product_sale_price", sampleProduct.sample_product_sale_price);
  formData.append("sample_delivery_charge", sampleProduct.sample_delivery_charge);
  
  if (singleImg) {
    formData.append("sample_product_image", singleImg);
  }
  
  if (multipleImg && Array.isArray(multipleImg)) {
    multipleImg.forEach((img) => {
      formData.append("sample_product_multiple_image", img);
    });
  }
  
  formData.append("kept_multiple_images",oldMultipleImages && oldMultipleImages.length > 0 ? JSON.stringify(oldMultipleImages) : null);

  // To debug FormData contents, you need to iterate through it
  console.log("FormData contents:");
  for (let [key, value] of formData.entries()) {
    console.log(key, value);
  }

  // Make sure your API endpoint is correct
  https.put("/sample/update", formData, {

  })
  .then(function (response) {
    props.checkchang({
      message: response.data.message,
      status: response.data.status,
      update: 1
    });
    Close();
  })
  .catch(function (error) {
    console.error("Error updating sample product:", error);
    toast.error("Error updating sample product");
  });
};

  const inputRef = useRef();
  const submitButtonRef = useRef();

  return (
    <div>
      <Modal
        size="xl"
        isOpen={modal}
        toggle={tog_fullscreen1}
        className="modal-fullscreen"
        id="fullscreeexampleModal"
      >
        <ModalHeader className="modal-title" id="fullscreeexampleModalLabel">
          Update Sample Product
        </ModalHeader>
        <ModalBody>
          <Card className="border card-border-success shadow-lg">
            <Nav className="nav-tabs nav-tabs-custom nav-success p-2 pb-0 bg-light">
              <NavItem>
                <NavLink
                  href="#"
                  className={classnames({ active: activeTab === "1" })}
                  onClick={() => toggleTab("1")}
                >
                  Primary Information
                </NavLink>
              </NavItem>
              <NavItem>
                <NavLink
                  href="#"
                  className={classnames({ active: activeTab === "2" })}
                  onClick={() => toggleTab("2")}
                >
                  Ecommerce
                </NavLink>
              </NavItem>
            </Nav>

            <ModalBody>
              <TabContent activeTab={activeTab}>
                <TabPane tabId="1">
                  <Row>
                    <Col lg={4}>
                      <div className="mb-3">
                        <Label
                          htmlFor="product-name"
                          className="form-label fw-bold d-flex justify-content-between"
                        >
                          <div>English Name<span style={{ color: "red" }}> *</span></div>
                          <div style={{ color: "red" }}>{msg}</div>
                        </Label>
                        <input
                          style={checkNameStatus}
                          type="text"
                          className="form-control fw-bold"
                          placeholder="Enter product name"
                          name="sample_product_english_name"
                          value={sampleProduct.sample_product_english_name}
                          onChange={handleInputChange}
                        />
                      </div>
                    </Col>
                    <Col lg={4}>
                      <div className="mb-3">
                        <Label className="form-label fw-bold">
                          MRP
                        </Label>
                        <Input
                          type="number"
                          className="form-control fw-bold"
                          placeholder="Enter MRP"
                          name="sample_product_mrp"
                          value={sampleProduct.sample_product_mrp}
                          onChange={handleInputChange}
                        />
                      </div>
                    </Col>
                    <Col lg={4}>
                      <div className="mb-3">
                        <Label className="form-label fw-bold">
                          Sale Price
                        </Label>
                        <Input
                          type="number"
                          className="form-control fw-bold"
                          placeholder="Enter sale price"
                          name="sample_product_sale_price"
                          value={sampleProduct.sample_product_sale_price}
                          onChange={handleInputChange}
                        />
                      </div>
                    </Col>
                    <Col lg={4}>
                      <div className="mb-3">
                        <Label className="form-label fw-bold">
                          Delivery Charge
                        </Label>
                        <Input
                          type="number"
                          className="form-control fw-bold"
                          placeholder="Enter delivery charge"
                          name="sample_delivery_charge"
                          value={sampleProduct.sample_delivery_charge}
                          onChange={handleInputChange}
                        />
                      </div>
                    </Col>
                  </Row>
                            <Col lg={12}>
                      <div className="hstack gap-2 justify-content-center mt-2">
                        <button 
                          type="button" 
                          onClick={Close} 
                          className="btn btn-danger"
                        >
                          <i className="ri-close-line me-1 align-middle" />
                          Close
                        </button>
                        <button
                          ref={submitButtonRef}
                          type="button"
                          className="btn btn-primary"
                          onClick={SubmitData}
                        >
                          <i className="ri-save-3-line align-bottom me-1"></i>
                          Save
                        </button>
                      </div>
                    </Col>
                </TabPane>
                <TabPane tabId="2">
                  <Row>
                    <Col lg={3}>
                      <div className="mb-4">
                        <h5 className="fs-15 mb-1">Product Image</h5>
                        <div className="text-center">
                          <div className="position-relative d-inline-block">
                            <div className="position-absolute top-100 start-100 translate-middle">
                              <label
                                htmlFor="product-image-input"
                                className="mb-0"
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
                                accept="image/png, image/gif, image/jpeg"
                                onChange={(e) => setSingleImg(e.target.files[0])}
                              />
                            </div>
                            <div className="avatar-lg">
                              <div className="avatar-title bg-light rounded">
                                {singleImg ? (
                                  <img
                                    src={URL.createObjectURL(singleImg)}
                                    id="product-img"
                                    alt="product-img"
                                    className="h-auto"
                                    width={"100px"}
                                  />
                                ) : sampleProduct.sample_product_image ? (
                                  <img
                                    src={`${IMG_API_URL}/products/${sampleProduct.sample_product_image}`}
                                    alt="old-product-img"
                                    className="h-auto"
                                    width={"100px"}
                                  />
                                ) : (
                                  <D_img />
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </Col>
                    <Col lg={9}>
                      <div className="mb-4">
                        <h5 className="fs-15 mb-2">Add Multiple Images</h5>
                        <div className="d-flex gap-2 flex-wrap align-items-start">
                          {oldMultipleImages && oldMultipleImages.length > 0 && oldMultipleImages.map((img, index) => (
                            <div
                              key={`old-${index}`}
                              className="position-relative border rounded shadow-sm"
                              style={{ width: "100px", height: "100px", overflow: "hidden" }}
                            >
                              <img
                                src={`${IMG_API_URL}/products/${img}`}
                                alt={`old-img-${index}`}
                                className="img-fluid rounded"
                                style={{ width: "100%", height: "100%", objectFit: "cover" }}
                              />
                              <button
                                type="button"
                                onClick={() => removeOldImage(index)}
                                className="btn btn-sm btn-danger position-absolute top-0 end-0 m-1 p-1"
                                style={{ lineHeight: "1", fontSize: "0.8rem", borderRadius: "50%" }}
                                title="Remove image"
                              >
                                ×
                              </button>
                            </div>
                          ))}

                          {multipleImg.length > 0 && multipleImg.map((img, index) => (
                            <div
                              key={`new-${index}`}
                              className="position-relative border rounded shadow-sm"
                              style={{ width: "100px", height: "100px", overflow: "hidden" }}
                            >
                              <img
                                src={URL.createObjectURL(img)}
                                alt={`new-img-${index}`}
                                className="img-fluid rounded"
                                style={{ width: "100%", height: "100%", objectFit: "cover" }}
                              />
                            </div>
                          ))}

                          <div className="position-relative d-inline-block">
                            <label htmlFor="multiple-image-input" className="cursor-pointer">
                              <div className="avatar-lg bg-light border rounded d-flex justify-content-center align-items-center">
                                <i className="ri-image-add-line fs-24 text-muted" />
                              </div>
                            </label>
                            <input
                              className="form-control d-none"
                              id="multiple-image-input"
                              type="file"
                              multiple
                              accept="image/png, image/gif, image/jpeg"
                              onChange={handleMultipleImgChange}
                            />
                          </div>
                        </div>
                      </div>
                    </Col>
                    <Col lg={12}>
                      <div className="mb-3">
                        <Label className="form-label fw-bold">
                          Description
                        </Label>
                        <CKEditor
                          editor={ClassicEditor}
                          data={sampleProduct.sample_product_description || ""}
                          onChange={(event, editor) => {
                            const data = editor.getData();
                            setSampleProduct({
                              ...sampleProduct,
                              sample_product_description: data
                            });
                          }}
                        />
                      </div>
                    </Col>

                    <Col lg={12}>
                      <div className="hstack gap-2 justify-content-center mt-2">
                        <button 
                          type="button" 
                          onClick={Close} 
                          className="btn btn-danger"
                        >
                          <i className="ri-close-line me-1 align-middle" />
                          Close
                        </button>
                        <button
                          ref={submitButtonRef}
                          type="button"
                          className="btn btn-primary"
                          onClick={SubmitData}
                        >
                          <i className="ri-save-3-line align-bottom me-1"></i>
                          Save
                        </button>
                      </div>
                    </Col>
                  </Row>
                </TabPane>
              </TabContent>
            </ModalBody>
          </Card>
        </ModalBody>
      </Modal>
    </div>
  );
};

export default SampleProductUpdate2;