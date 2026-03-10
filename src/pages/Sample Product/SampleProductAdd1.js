import React, { useEffect, useState, useCallback, useRef } from "react";
import { toast } from "react-toastify";
import {
  Card,
  Modal,
  ModalHeader,
  ModalBody,
  Label,
  Input,
  Col,
  Row,
  Button,
  CardHeader,
  CardBody,
  FormGroup
} from "reactstrap";
import "react-toastify/dist/ReactToastify.css";
import AuthUser from "../../helpers/Authuser";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";

const SampleProductAdd1 = (props) => {
  // State declarations
  const [modal, setModal] = useState(false);
  const [singleImg, setSingleImg] = useState(null);
  const [multipleImg, setMultipleImg] = useState([]);
  const [productData, setProductData] = useState({
    product_english_name: "",
    product_description: "",
    product_mrp: "",
    product_sale_price: "",
    delivery_charge: "0"
  });

  // Refs
  const submitButtonRef = useRef();

  // API calls
  const { http, https } = AuthUser();

  // Modal control
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

  // Form handlers
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProductData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleImageChange = (e) => {
    setSingleImg(e.target.files[0]);
  };

  const handleMultipleImagesChange = (e) => {
    setMultipleImg(Array.from(e.target.files));
  };

  const removeImage = (index) => {
    setMultipleImg(prev => prev.filter((_, i) => i !== index));
  };

  // Submit function matching your API
  const SubmitData = async () => {
    try {
      const formData = new FormData();
      console.log(productData);

      // Append text fields
      formData.append("product_english_name", productData.product_english_name);
      formData.append("product_description", productData.product_description);
      formData.append("product_mrp", productData.product_mrp);
      formData.append("product_sale_price", productData.product_sale_price);
      formData.append("delivery_charge", productData.delivery_charge);

      // Append single main image
      if (singleImg) {
        formData.append("product_image", singleImg);
      }

      // Append multiple images under one key with [] syntax
      multipleImg.forEach((file) => {
        formData.append("sample_product_multiple_image[]", file);
      });

      // Debug log: To see FormData entries
      for (let pair of formData.entries()) {
        console.log(pair[0] + ": ", pair[1]);
      }

      // Send to API
      await https.post("/sample/store", formData)
        .then((res) => {
          console.log(res.data);
          toast.success("Product created successfully!");
          props.checkchang({
            message: res.data.message,
            status: res.data.status,
            customer: res.data.array,
          });
          toggle(); // close modal
        })
        .catch((e) => {
          console.log(e);
          toast.error(e.response?.data?.message || "Failed to create product");
        });

    } catch (error) {
      console.error("Error creating product:", error);
      toast.error(error.response?.data?.message || "Something went wrong!");
    }
  };

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.altKey && event.key === "s") {
        event.preventDefault();
        submitButtonRef.current?.click();
      }
      if (event.altKey && event.key === "Escape") {
        event.preventDefault();
        props.setModalStates();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <div>
      <Modal size="xl" isOpen={modal} toggle={tog_fullscreen1} className="modal-fullscreen">
        <ModalHeader toggle={tog_fullscreen1}>Add Product</ModalHeader>
        <ModalBody>
          <Card className="border card-border-success shadow-lg">
            <ModalBody>
              <Row>
                <Col lg={12}>
                  <Row>
                    <Col lg={6}>
                      <FormGroup>
                        <Label className="fw-bold">
                          Product Name<span className="text-danger"> *</span>
                        </Label>
                        <Input
                          type="text"
                          name="product_english_name"
                          value={productData.product_english_name}
                          onChange={handleInputChange}
                          className="form-control-md"
                          placeholder="Enter product name"
                          required
                        />
                      </FormGroup>
                      <FormGroup>
                        <Label className="fw-bold">Description</Label>
                        <CKEditor
                          editor={ClassicEditor}
                          data={productData.product_description}
                          onChange={(event, editor) => {
                            setProductData(prev => ({
                              ...prev,
                              product_description: editor.getData()
                            }));
                          }}
                        />
                      </FormGroup>
                    </Col>

                    <Col lg={6}>
                      <Card className="border border-warning">
                        <CardHeader className="bg-warning text-white">
                          <h6 className="mb-0">Pricing Information</h6>
                        </CardHeader>
                        <CardBody>
                          <Row>
                            <Col lg={6}>
                              <FormGroup>
                                <Label className="fw-bold">MRP (₹)</Label>
                                <Input
                                  type="number"
                                  name="product_mrp"
                                  value={productData.product_mrp}
                                  onChange={handleInputChange}
                                  className="form-control-md"
                                  min="0"
                                  step="0.01"
                                  required
                                />
                              </FormGroup>
                            </Col>
                            <Col lg={6}>
                              <FormGroup>
                                <Label className="fw-bold">Sale Price (₹)</Label>
                                <Input
                                  type="number"
                                  name="product_sale_price"
                                  value={productData.product_sale_price}
                                  onChange={handleInputChange}
                                  className="form-control-md"
                                  min="0"
                                  step="0.01"
                                  required
                                />
                              </FormGroup>
                            </Col>
                            <Col lg={6}>
                              <FormGroup>
                                <Label className="fw-bold">Delivery Charge (₹)</Label>
                                <Input
                                  type="number"
                                  name="delivery_charge"
                                  value={productData.delivery_charge}
                                  onChange={handleInputChange}
                                  className="form-control-md"
                                  min="0"
                                  step="0.01"
                                />
                                <small className="text-muted">Additional shipping cost</small>
                              </FormGroup>
                            </Col>
                          </Row>
                        </CardBody>
                      </Card>
                    
                      <Card>
                        <CardHeader className="bg-light">
                          <h6 className="mb-0">Product Images</h6>
                        </CardHeader>
                        <CardBody>
                          <FormGroup>
                            <Label>Main Image</Label>
                            <Input
                              type="file"
                              accept="image/*"
                              onChange={handleImageChange}
                            />
                            {singleImg && (
                              <div className="mt-1">
                                <img
                                  src={URL.createObjectURL(singleImg)}
                                  alt="Preview"
                                  style={{ maxHeight: "100px" }}
                                  className="img-thumbnail"
                                />
                              </div>
                            )}
                          </FormGroup>

                          <FormGroup className="mt-3">
                            <Label>Additional Images</Label>
                            <Input
                              type="file"
                              multiple
                              accept="image/*"
                              onChange={handleMultipleImagesChange}
                            />
                            <div className="d-flex flex-wrap mt-1">
                              {multipleImg.map((img, index) => (
                                <div key={index} className="position-relative m-1">
                                  <img
                                    src={URL.createObjectURL(img)}
                                    alt={`Product ${index + 1}`}
                                    style={{ height: "80px", width: "80px", objectFit: "cover" }}
                                    className="img-thumbnail"
                                  />
                                  <button
                                    type="button"
                                    onClick={() => removeImage(index)}
                                    className="btn btn-danger btn-sm position-absolute top-0 end-0"
                                    style={{ transform: "translate(50%, -50%)" }}
                                  >
                                    ×
                                  </button>
                                </div>
                              ))}
                            </div>
                          </FormGroup>
                        </CardBody>
                      </Card>
                    </Col>
                  </Row>
                </Col>

                <Col lg={12}>
                  <div className="d-flex justify-content-end mt-4">
                    <Button color="secondary" onClick={tog_fullscreen1} className="me-2">
                      Cancel
                    </Button>
                    <Button
                      color="primary"
                      innerRef={submitButtonRef}
                      onClick={SubmitData}
                    >
                      Save Product
                    </Button>
                  </div>
                </Col>
              </Row>
            </ModalBody>
          </Card>
        </ModalBody>
      </Modal>
    </div>
  );
};

export default SampleProductAdd1;