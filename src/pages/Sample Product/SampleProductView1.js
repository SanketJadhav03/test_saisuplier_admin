import React, { useEffect, useState, useCallback, useRef } from "react";
import classnames from "classnames";
import Select from "react-select";
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
import CategoryAdd from "../Category/CategoryAdd";

const SampleProductView1 = (props) => {
  const [modal, setModal] = useState(false);
  const [activeTab, setActiveTab] = useState("1");
  const [MainInfromation, SetMainInfromation] = useState([]);
  const [modalStatess, setModalStatess] = useState(false);
  const [counts, Setcounts] = useState(1);
  const handleCallback = (data) => {
    Setcounts(counts + 1);
    toast.success(data);
    setModalStatess(false);
  };
  const { http } = AuthUser();
  useEffect(() => {
    http
      .get("/products/informtion")
      .then(function (response) {
        SetMainInfromation(response.data);
      })
      .catch(function (error) {
        console.log(error);
      });
    http
      .get(`/products/price/finds/${props.edit_data.product_id}`)
      .then(function (response) {
        SetMultiProduct(response.data.product_price);
      })
      .catch(function (error) {
        console.log(error);
      });
  }, [counts]);
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

  function tog_fullscreen1() {
    setModal(!modal);
  }

  const toggleTab = (tab, type) => {
    if (activeTab !== tab) {
      setActiveTab(tab);
    }
  };
  // MULTIPLE PRICE IN PRODUCT CODE
  const [ProductMulti, SetMultiProduct] = useState([
    {
      price_barcode: "",
      price_qrcode: "",
      price_mrp: "",
      price_sales: "",
      price_purchase: "",
      price_wholesaler: "",
      price_distributor: "",
      price_online: "",
      price_opening_qty: "",
      price_opening_value: "",
      mfg_date: "",
      exp_date: "",
      // Add other fields here
    },
  ]);
  const addProduct = (index) => {
    let FindArray = ProductMulti.filter((_, i) => i == index);
    SetMultiProduct([...ProductMulti, FindArray[0]]);
  };
  const deletProduct = (index) => {
    const updatedProductMulti = ProductMulti.filter((_, i) => i !== index);
    SetMultiProduct(updatedProductMulti);
  };

  const OnchangeNow = (value, index, field) => {
    const updatedProductList = [...ProductMulti];
    const updatedProduct = { ...updatedProductList[index] };
    updatedProduct[field] = value;
    updatedProductList[index] = updatedProduct;
    SetMultiProduct(updatedProductList);
  };

  // END CODE FOR MULTIPLE PRODUCT PRICE
  // PRODUCT PRIMARY IMFORMTION
  const [PrmaryImfomation, SetPramrayImformation] = useState(props.edit_data);
  const PramryImformtion = (e) => {
    setCheckStatus({});
    setMsg("");
    SetPramrayImformation({
      ...PrmaryImfomation,
      [e.target.name]: e.target.value,
    });
  };

  const getSelectedGroupValue = (e, name) => {
    SetPramrayImformation({ ...PrmaryImfomation, [name]: e.value });
  };
  // END PRODUCT PIMARY IMFOMATION
  const [checkNameStatus, setCheckStatus] = useState({});
  const [msg, setMsg] = useState("");
  const SubmitData = () => {
    // props.checkchang("Unit Create Successfully !!");
    if (PrmaryImfomation.product_english_name == "") {
      setCheckStatus({
        borderColor: "red",
        borderStyle: "groove",
      });
      setMsg("Product connot be empty!");
    } else {
      const mainProductArray = {
        productPricre: ProductMulti,
        PrimaryImformation: PrmaryImfomation,
      };
      http
        .put("/products/update", mainProductArray)
        .then(function (response) {
          props.checkchang("Product Update Successfully !!");
        })
        .catch(function (error) {
          console.log(error);
        });
    }
  };
  // start short cut
  const [NO, SetNO] = useState(true);
  const emailInput = useCallback((inputElement) => {
    if (inputElement && NO) {
      inputElement.focus();
    }
  });

  const inputRef = useRef();
  const submitButtonRef = useRef();
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (
        event.altKey &&
        event.key === "ArrowDown" &&
        document.activeElement !== inputRef.current
      ) {
        event.preventDefault();
        inputRef.current.focus();
        SetNO(false);
      }
      if (
        (event.altKey && event.key === "s") ||
        (event.altKey && event.key === "S")
      ) {
        event.preventDefault();
        SetNO(false);
        submitButtonRef.current.click();
      }
      if (event.altKey && event.key === "Escape") {
        event.preventDefault();
        SetNO(false);
        props.setModalStates();
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);
  // end Short cut
  return (
    <div>
      {/* Fullscreen Responsive kjh Modals */}
      <Modal
        size="xl"
        isOpen={modal}
        toggle={() => {
          tog_fullscreen1();
        }}
        className="modal-fullscreen"
        id="fullscreeexampleModal"
      >
        <ModalHeader
          className="modal-title"
          id="fullscreeexampleModalLabel"
          toggle={() => {
            tog_fullscreen1();
          }}
        >
          View Product
        </ModalHeader>
        <ModalBody>
          <Card className="border card-border-success shadow-lg">
            <Nav className="nav-tabs nav-tabs-custom nav-success p-2 pb-0 bg-light">
              <NavItem>
                <NavLink
                  href="#"
                  className={classnames({
                    active: activeTab === "1",
                  })}
                  onClick={() => {
                    toggleTab("1");
                  }}
                >
                  Primary Information
                </NavLink>
              </NavItem>
              <NavItem>
                <NavLink
                  href="#"
                  className={classnames({
                    active: activeTab === "2",
                  })}
                  onClick={() => {
                    toggleTab("2");
                  }}
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
                          htmlFor="categoryname-field"
                          className="form-label fw-bold d-flex justify-content-between"
                        >
                          <div>
                            English Name<span style={{ color: "red" }}> *</span>
                          </div>
                          <div style={{ color: "red" }}>{msg}</div>
                        </Label>
                        <input
                          readOnly
                          style={checkNameStatus}
                          type="text"
                          className="form-control fw-bold"
                          ref={emailInput}
                          placeholder="Enter your firstname"
                          name="product_english_name"
                          value={PrmaryImfomation.product_english_name}
                          onChange={(e) => PramryImformtion(e)}
                        />
                      </div>
                    </Col>
                    <Col lg={4}>
                      <div className="mb-3">
                        <Label
                          for="lastnameInput"
                          className="form-label fw-bold"
                        >
                          Marathi Name
                        </Label>
                        <Input
                          readOnly
                          type="text"
                          className="form-control fw-bold"
                          id="lastnameInput"
                          placeholder="Enter your lastname"
                          name="product_marathi_name"
                          value={PrmaryImfomation.product_marathi_name}
                          onChange={(e) => PramryImformtion(e)}
                        />
                      </div>
                    </Col>
                    <Col lg={4}>
                      <div className="mb-3">
                        <Label
                          for="phonenumberInput"
                          className="form-label fw-bold"
                        >
                          HSN Code
                        </Label>
                        <Input
                          readOnly
                          type="text"
                          className="form-control fw-bold"
                          id="phonetextInput"
                          placeholder="Enter your text"
                          name="product_hsn_code"
                          value={PrmaryImfomation.product_hsn_code}
                          onChange={(e) => PramryImformtion(e)}
                        />
                      </div>
                    </Col>
                    <Col lg={3}>
                      <div className="mb-3">
                        <Label
                          htmlFor="customername-field"
                          className="form-label fw-bold d-flex justify-content-between"
                        >
                          Category
                        </Label>

                        <Input
                          readOnly
                          type="text"
                          className="form-control fw-bold"
                          value={PrmaryImfomation.category_name}
                        />
                      </div>
                    </Col>
                    {/* <Col lg={3}>
                      <div className="mb-3">
                        <Label
                          for="contactnumberInput"
                          className="form-label fw-bold"
                        >
                          SubCategory
                        </Label>
                        <Input
                        readOnly
                          type="number"
                          className="form-control fw-bold"
                          id="contactnumberInput"
                          placeholder="Enter your number"
                          name="product_sub_category"
                          value={PrmaryImfomation.product_sub_category}
                          onChange={(e) => PramryImformtion(e)}
                        />
                      </div>
                    </Col> */}
                    <Col lg={3}>
                      <div className="mb-3">
                        <Label
                          htmlFor="customername-field"
                          className="form-label fw-bold"
                        >
                          Bank
                        </Label>
                        <Input
                          readOnly
                          type="text"
                          className="form-control fw-bold"
                          value={PrmaryImfomation.bank_name}
                        />
                      </div>
                    </Col>
                    <Col lg={3}>
                      <div className="mb-3">
                        <Label
                          htmlFor="customername-field"
                          className="form-label fw-bold"
                        >
                          Tax %
                        </Label>
                        <Input
                          readOnly
                          type="text"
                          className="form-control fw-bold"
                          value={PrmaryImfomation.tax_name}
                        />
                      </div>
                    </Col>
                    <Col lg={3}>
                      <div className="mb-3">
                        <Label
                          htmlFor="customername-field"
                          className="form-label fw-bold"
                        >
                          Tax Type
                        </Label>
                        <Input
                          readOnly
                          type="text"
                          className="form-control fw-bold"
                          value={
                            PrmaryImfomation.product_tax_type == 1
                              ? "Inclusive Tax"
                              : "Exclusive Tax"
                          }
                        />
                      </div>
                    </Col>
                    <Col lg={3}>
                      <div className="mb-3">
                        <Label
                          htmlFor="customername-field"
                          className="form-label fw-bold"
                        >
                          Primary Unit
                        </Label>
                        <Input
                          readOnly
                          type="text"
                          className="form-control fw-bold"
                          value={PrmaryImfomation.unit_name}
                        />
                      </div>
                    </Col>
                    <Col lg={3}>
                      <div className="mb-3">
                        <Label
                          htmlFor="customername-field"
                          className="form-label fw-bold"
                        >
                          Alternate Unit
                        </Label>
                        <Input
                          readOnly
                          type="text"
                          className="form-control fw-bold"
                          value={PrmaryImfomation.unit_name}
                        />
                      </div>
                    </Col>
                    <Col lg={3}>
                      <div className="mb-3">
                        <Label
                          for="phonenumberInput"
                          className="form-label fw-bold"
                        >
                          Conversion Factor
                        </Label>
                        <Input
                          readOnly
                          type="text"
                          className="form-control fw-bold"
                          id="phonetextInput"
                          placeholder="Enter your text"
                          name="product_conversion_factor"
                          value={PrmaryImfomation.product_conversion_factor}
                          onChange={(e) => PramryImformtion(e)}
                        />
                      </div>
                    </Col>{" "}
                    <Col lg={3}>
                      <div className="mb-3">
                        <Label
                          htmlFor="customername-field"
                          className="form-label fw-bold"
                        >
                          Unit Price Per
                        </Label>
                        <Input
                          readOnly
                          type="text"
                          className="form-control fw-bold"
                          value={PrmaryImfomation.unit_name}
                        />
                      </div>
                    </Col>
                    <Col lg={12}>
                      <Row>
                        <Col sm={12}>
                          <div className="table-responsive table-card mt-4">
                            <table className="table">
                              <thead className="bg-light text-center">
                                <tr>
                                  <th scope="col">Barcode</th>
                                  <th scope="col">Qr Code</th>
                                  <th scope="col">MRP</th>
                                  <th scope="col">Sale</th>
                                  <th scope="col">Purchase Price</th>
                                  <th scope="col">Wholesaler</th>
                                  <th scope="col">Distributor Price</th>
                                  <th scope="col">Online</th>
                                  <th scope="col">Op_Qty</th>
                                  <th scope="col">Op_value</th>
                                  <th scope="col">Mfg Date</th>
                                  <th scope="col">Exp Date</th>
                                  {/* <th scope="col">Action</th> */}
                                </tr>
                              </thead>
                              <tbody>
                                {ProductMulti.map((item, index) => (
                                  <tr key={index}>
                                    <td style={{ padding: "0px" }}>
                                      <input
                                        readOnly
                                        type="text"
                                        style={{
                                          width: "100%",
                                        }}
                                        className=" text-end fw-bold"
                                        onChange={(e) =>
                                          OnchangeNow(
                                            e.target.value,
                                            index,
                                            "price_barcode"
                                          )
                                        }
                                        value={item.price_barcode}
                                        ref={inputRef}
                                      />
                                    </td>
                                    <td style={{ padding: "0px" }}>
                                      <input
                                        readOnly
                                        type="text"
                                        style={{
                                          width: "100%",
                                        }}
                                        className=" text-end fw-bold"
                                        onChange={(e) =>
                                          OnchangeNow(
                                            e.target.value,
                                            index,
                                            "price_qrcode"
                                          )
                                        }
                                        value={item.price_qrcode}
                                      />
                                    </td>
                                    <td style={{ padding: "0px" }}>
                                      <input
                                        readOnly
                                        type="number"
                                        style={{
                                          width: "100%",
                                        }}
                                        className=" text-end fw-bold"
                                        onChange={(e) =>
                                          OnchangeNow(
                                            e.target.value,
                                            index,
                                            "price_mrp"
                                          )
                                        }
                                        value={item.price_mrp}
                                      />
                                    </td>
                                    <td style={{ padding: "0px" }}>
                                      <input
                                        readOnly
                                        type="number"
                                        style={{
                                          width: "100%",
                                        }}
                                        className=" text-end fw-bold"
                                        onChange={(e) =>
                                          OnchangeNow(
                                            e.target.value,
                                            index,
                                            "price_sales"
                                          )
                                        }
                                        value={item.price_sales}
                                      />
                                    </td>
                                    <td style={{ padding: "0px" }}>
                                      <input
                                        readOnly
                                        type="number"
                                        style={{
                                          width: "100%",
                                        }}
                                        className=" text-end fw-bold"
                                        onChange={(e) =>
                                          OnchangeNow(
                                            e.target.value,
                                            index,
                                            "price_purchase"
                                          )
                                        }
                                        value={item.price_purchase}
                                      />
                                    </td>
                                    <td style={{ padding: "0px" }}>
                                      <input
                                        readOnly
                                        type="number"
                                        style={{
                                          width: "100%",
                                        }}
                                        className=" text-end fw-bold"
                                        onChange={(e) =>
                                          OnchangeNow(
                                            e.target.value,
                                            index,
                                            "price_wholesaler"
                                          )
                                        }
                                        value={item.price_wholesaler}
                                      />
                                    </td>
                                    <td style={{ padding: "0px" }}>
                                      <input
                                        readOnly
                                        type="number"
                                        style={{
                                          width: "100%",
                                        }}
                                        className=" text-end fw-bold"
                                        onChange={(e) =>
                                          OnchangeNow(
                                            e.target.value,
                                            index,
                                            "price_distributor"
                                          )
                                        }
                                        value={item.price_distributor}
                                      />
                                    </td>
                                    <td style={{ padding: "0px" }}>
                                      <input
                                        readOnly
                                        type="number"
                                        style={{
                                          width: "100%",
                                        }}
                                        className=" text-end fw-bold"
                                        onChange={(e) =>
                                          OnchangeNow(
                                            e.target.value,
                                            index,
                                            "price_online"
                                          )
                                        }
                                        value={item.price_online}
                                      />
                                    </td>
                                    <td style={{ padding: "0px" }}>
                                      <input
                                        readOnly
                                        type="number"
                                        style={{
                                          width: "100%",
                                        }}
                                        className=" text-end fw-bold"
                                        onChange={(e) =>
                                          OnchangeNow(
                                            e.target.value,
                                            index,
                                            "price_opening_qty"
                                          )
                                        }
                                        value={item.price_opening_qty}
                                      />
                                    </td>
                                    <td style={{ padding: "0px" }}>
                                      <input
                                        readOnly
                                        type="number"
                                        style={{
                                          width: "100%",
                                        }}
                                        className=" text-end fw-bold"
                                        onChange={(e) =>
                                          OnchangeNow(
                                            e.target.value,
                                            index,
                                            "price_opening_value"
                                          )
                                        }
                                        value={item.price_opening_value}
                                      />
                                    </td>
                                    <td style={{ padding: "0px" }}>
                                      <input
                                        readOnly
                                        type="date"
                                        style={{
                                          width: "100%",
                                        }}
                                        className=" text-end fw-bold"
                                        onChange={(e) =>
                                          OnchangeNow(
                                            e.target.value,
                                            index,
                                            "mfg_date"
                                          )
                                        }
                                        value={item.mfg_date}
                                      />
                                    </td>
                                    <td style={{ padding: "0px" }}>
                                      <input
                                        readOnly
                                        type="date"
                                        style={{
                                          width: "100%",
                                        }}
                                        className=" text-end fw-bold"
                                        onChange={(e) =>
                                          OnchangeNow(
                                            e.target.value,
                                            index,
                                            "exp_date"
                                          )
                                        }
                                        value={item.exp_date}
                                      />
                                    </td>
                                    {/* <td style={{ padding: "0px" }}>
                                      <div className="d-flex">
                                        <button
                                          className="btn-icon btn btn-primary btn-sm"
                                          onClick={() => addProduct(index)}
                                        >
                                          <i className=" ri-file-copy-line"></i>
                                        </button>
                                        <button
                                          className="btn-icon btn btn-danger btn-sm"
                                          onClick={() => deletProduct(index)}
                                        >
                                          <i className="ri-delete-bin-5-fill fs-16"></i>
                                        </button>
                                      </div>
                                    </td> */}
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        </Col>
                      </Row>
                      <div className="hstack gap-2 justify-content-end mt-2">
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
                      </div>
                    </Col>
                  </Row>
                </TabPane>
                <TabPane tabId="2">
                  <Row>
                    {/* <Col lg={6}>
                      <div className="mb-3">
                        <Label
                          for="companylogoInput"
                          className="form-label fw-bold"
                        >
                          Company Logo
                        </Label>
                        <Input
                        readOnly
                          type="file"
                          className="form-control fw-bold"
                          id="companylogoInput"
                        />
                      </div>
                    </Col> */}
                    <Col lg={6}>
                      <div className="mb-3">
                        <Label
                          for="companylogoInput"
                          className="form-label fw-bold"
                        >
                          Product Image
                        </Label>{" "}
                        <br />
                        <img
                          src="https://boschbankstore.com/wp-content/uploads/2019/01/no-image.png"
                          alt="Not img"
                          width={"10%"}
                        />
                      </div>
                    </Col>

                    <Col lg={12}>
                      <div className="mb-3">
                        <Label
                          for="exampleFormControlTextarea1"
                          className="form-label fw-bold"
                        >
                          Description
                        </Label>
                        <textarea
                          readOnly
                          className="form-control fw-bold"
                          id="exampleFormControlTextarea1"
                          rows="3"
                          placeholder="Enter description"
                        ></textarea>
                      </div>
                    </Col>
                    <Col lg={12}>
                      <div className="hstack gap-2 justify-content-center mt-2">
                        <button
                          type="button"
                          onClick={() => {
                            tog_fullscreen1();
                          }}
                          className="btn btn-danger"
                        >
                          <i className="ri-close-line me-1 align-middle" />
                          Close
                        </button>
                        {/* <button type="submit" className="btn btn-primary">
                          <i className="ri-save-3-line align-bottom me-1"></i>
                          Save
                        </button> */}
                      </div>
                    </Col>
                  </Row>
                </TabPane>
              </TabContent>
            </ModalBody>
          </Card>
        </ModalBody>
      </Modal>
      {/* {modalStatess === true ? (
        <CategoryAdd
          modalStates={modalStatess}
          setModalStates={() => {
            setModalStatess(false);
          }}
          checkchang={handleCallback}
        />
      ) : (
        ""
      )} */}
    </div>
  );
};

export default SampleProductView1;
