import React, { useEffect, useState, useCallback, useRef } from "react";
import classnames from "classnames";
import Select from "react-select";
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
  Nav,
  NavItem,
  NavLink,
} from "reactstrap";
import "react-toastify/dist/ReactToastify.css";
import AuthUser from "../../helpers/Authuser";
import CategoryAdd from "../Category/CategoryAdd";
import BankAdd from "../Bank/BankAdd";
import D_img from "../D_img";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";

const SampleProductAdd = (props) => {
  const [modal, setModal] = useState(false);
  const [singleImg, setSingleImg] = useState("");
  const [multipleImg, setMultipleImg] = useState([]);

  const handleMultipleImgChange = (e) => {
    const files = Array.from(e.target.files);
    setMultipleImg((prev) => [...prev, ...files]);
  };

  const removeImage = (index) => {
    setMultipleImg((prev) => prev.filter((_, i) => i !== index));
  };

  const [MainInfromation, SetMainInfromation] = useState([]);
  const [activeIN, SetactiveIN] = useState(false);
  const [modalStatess, setModalStatess] = useState(false);
  const [BankModel, setBankModel] = useState(false);
  const [counts, Setcounts] = useState(1);
  const [manageCategory, setManageCategory] = useState(0);
  const [manageBank, setManageBank] = useState(0);
  const [checkPrice_sales, SetcheckPrice_sales] = useState(true);
  const [Marathis, SetMarathis] = useState("");

  const handleCategoryCallback = (data, status) => {
    Setcounts(counts + 1);
    if (status == 0) {
      setManageCategory(1);
      toast.success(data);
    } else {
      toast.warn(data);
    }
    setModalStatess(false);
  };

  const handleBankCallback = (data, status) => {
    Setcounts(counts + 1);
    if (status == 0) {
      setManageBank(1);
      toast.success(data);
    } else {
      toast.warn(data);
    }
    setBankModel(false);
  };

  const { http, https } = AuthUser();
  const [PrmaryImfomation, SetPramrayImformation] = useState({});

  useEffect(() => {
    http
      .get("/products/informtion")
      .then(function (response) {
        SetMainInfromation(response.data);
        SetPramrayImformation((prevState) => ({
          ...PrmaryImfomation,
          product_category:
            manageCategory == 0
              ? response.data.category[0].category_id
              : response.data.category[response.data.category.length - 1]
                .category_id,
          product_unit_price: response.data.unit[0].unit_id,
          product_alternate_unit: response.data.unit[0].unit_id,
          product_primary_unit: response.data.unit[0].unit_id,
          product_tax_type: 1,
          product_tax_present: response.data.tax[0].tax_id,
          product_bank:
            manageBank == 0
              ? response.data.bank[0].bank_id
              : response.data.bank[response.data.bank.length - 1].bank_id,
        }));
        SetactiveIN(true);
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

  // MULTIPLE PRICE IN PRODUCT CODE
  const [ProductMulti, SetMultiProduct] = useState([
    {
      price_barcode: "",
      price_mrp: "",
      price_qrcode: "",
      price_sales: "",
      price_purchase: "",
      price_wholesaler: "",
      price_distributor: "",
      price_online: "",
      price_credit: "",
      price_opening_qty: "",
      price_opening_value: "",
      mfg_date: "",
      exp_date: "",
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

    if (field === "price_purchase" || field === "price_opening_qty") {
      const price_purchase = parseFloat(updatedProduct["price_purchase"]);
      const price_opening_qty = parseFloat(updatedProduct["price_opening_qty"]);
      if (!isNaN(price_purchase) && !isNaN(price_opening_qty)) {
        updatedProduct["price_opening_value"] = (
          price_purchase * price_opening_qty
        ).toFixed(2);
      } else {
        updatedProduct["price_opening_value"] = "";
      }
    }
    if (field === "price_sales" || field === "price_mrp") {
      const price_saless = parseFloat(updatedProduct["price_sales"]);
      const price_mrps = parseFloat(updatedProduct["price_mrp"]);
      if (price_mrps < price_saless) {
        SetcheckPrice_sales(false);
      } else {
        SetcheckPrice_sales(true);
      }
    }
    updatedProductList[index] = updatedProduct;
    SetMultiProduct(updatedProductList);
    SetNO(false);
  };

  const PramryImformtion = (e) => {
    SetPramrayImformation({
      ...PrmaryImfomation,
      [e.target.name]: e.target.value,
    });
    setCheckStatus({});
    setMsg("");
    SetNO(false);
  };

  const getSelectedGroupValue = (e, name) => {
    SetPramrayImformation({ ...PrmaryImfomation, [name]: e.value });
  };

  const [checkNameStatus, setCheckStatus] = useState({});
  const [msg, setMsg] = useState("");

  const SubmitData = () => {
    const formData = new FormData();
    if (singleImg) {
      formData.append("product_image", singleImg);
    }
    if (multipleImg && Array.isArray(multipleImg)) {
      multipleImg.forEach((file) => {
        formData.append("product_multiple_image", file);
      });
    }
    if (checkPrice_sales) {
      const mainProductArray = {
        productPricre: ProductMulti,
        PrimaryImformation: {
          ...PrmaryImfomation,
          product_marathi_name: (Marathis
            ? Marathis
            : PrmaryImfomation.product_marathi_name),
        },
      };
      http
        .post("/products/store", mainProductArray)
        .then(function (response) {
          if (response.data.status == 1) {
            toast.error(response.data.message);
          } else {
            formData.append("product_id", response.data.product_id);
            https.post("/products/store/images", formData)
              .then((res) => {
                console.log("Image Uploaded!");
              })
              .catch((err) => {
                console.log("Image Not Uploadded!");
              });
            props.checkchang({
              message: response.data.message,
              status: response.data.status,
              customer: response.data.array,
            });
          }
        })
        .catch(function (error) {
          setCheckStatus({
            borderColor: "red",
            borderStyle: "groove",
          });
          setMsg("Product connot be empty!");
        });
    } else {
      toast.error("Enter Sales Price Less Than MRP OR Equal");
    }
  };

  // Shortcut functionality
  const [NO, SetNO] = useState(true);
  const emailInput = useCallback((inputElement) => {
    if (inputElement && NO) {
      inputElement.focus();
    }
  });

  const inputRef = useRef();
  const submitButtonRef = useRef();
  const [spiKey, setApikey] = useState("");

  const getBarcodeData = () => {
    http
      .get("/barcode_settings/list")
      .then((res) => {
        setApikey(res.data.gtrans);
      }).catch((e) => {
        console.log(e);
      })
  }

  useEffect(() => {
    getBarcodeData();
    const handleKeyDown = (event) => {
      if (event.altKey && event.ctrlKey && event.key === "ArrowDown") {
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

  const apiKey = `${spiKey}`;
  const translateText = async (inputText) => {
    SetPramrayImformation({
      ...PrmaryImfomation,
      product_english_name: inputText.target.value,
    });
    if (!navigator.onLine) {
      console.log("Internet is off");
      return;
    }

    try {
      const response = await fetch(
        `https://translation.googleapis.com/language/translate/v2?key=${apiKey}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            q: inputText.target.value,
            source: "en",
            target: "mr",
          }),
        }
      );
      if (response.ok) {
        const data = await response.json();
        const translatedText = data.data.translations[0].translatedText;
        SetPramrayImformation({
          ...PrmaryImfomation,
          product_english_name: inputText.target.value,
          product_marathi_name: translatedText,
        });
      }
    } catch (error) {
      console.error("Translation error:", error);
    }
  };

  return (
    <div>
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
        >
          Add Product
        </ModalHeader>
        <ModalBody>
          <Card className="border card-border-success shadow-lg">
            <ModalBody>
              <Row>
                <Col lg={12}>
                  <Row>
                    <Col lg={4}>
                      <div className="mb-3">
                        <Label
                          htmlFor="categoryname-field"
                          className="form-label fw-bold d-flex justify-content-between"
                        >
                          <div>
                            Product Name<span style={{ color: "red" }}> *</span>
                          </div>
                          <div style={{ color: "red" }}>{msg}</div>
                        </Label>
                        <input
                          style={checkNameStatus}
                          type="text"
                          className="form-control fw-bold"
                          ref={emailInput}
                          placeholder="Enter Product Name"
                          name="product_english_name"
                          onChange={(e) => {
                            if (!navigator.onLine) {
                              PramryImformtion(e);
                            } else {
                              translateText(e);
                            }
                          }}
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
                          type="text"
                          className="form-control fw-bold"
                          id="phonetextInput"
                          placeholder="Enter HSN Code"
                          name="product_hsn_code"
                          onChange={(e) => PramryImformtion(e)}
                        />
                      </div>
                    </Col>
                  </Row>
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
                              <th scope="col">Op_Qty</th>
                              <th scope="col">Op_value</th>
                            </tr>
                          </thead>
                          <tbody>
                            {ProductMulti.map((item, index) => (
                              <tr key={index}>
                                <td style={{ padding: "0px" }}>
                                  <input
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
                                    readOnly={index === 0 ? "" : ""}
                                  />
                                </td>
                                <td style={{ padding: "0px" }}>
                                  <input
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
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </Col>
                  </Row>
                </Col>
                <Col lg={12}> 
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
                          {multipleImg.map((img, index) => (
                            <div
                              key={index}
                              className="position-relative border rounded shadow-sm"
                              style={{ width: "100px", height: "100px", overflow: "hidden" }}
                            >
                              <img
                                src={URL.createObjectURL(img)}
                                alt={`multiple-img-${index}`}
                                className="img-fluid rounded"
                                style={{ width: "100%", height: "100%", objectFit: "cover" }}
                              />
                              <button
                                type="button"
                                onClick={() => removeImage(index)}
                                className="btn btn-sm btn-danger position-absolute top-0 end-0 m-1 p-1"
                                style={{ lineHeight: "1", fontSize: "0.8rem", borderRadius: "50%" }}
                                title="Remove image"
                              >
                                ×
                              </button>
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
                  </Row>
                </Col>
                <Col lg={12}> 
                  <Row>
                    <Col lg={12}>
                      <div className="mb-3">
                        <Label for="exampleFormControlTextarea1" className="form-label fw-bold">
                          Youtube Video Link
                        </Label>
                        <Input
                          type="text"
                          className="form-control fw-bold"
                          id="youtubeLink"
                          placeholder="Enter Youtube Video Link"
                          name="product_youtube_link"
                          onChange={(e) => PramryImformtion(e)}
                          value={PrmaryImfomation.product_youtube_link || ""}
                        />
                      </div>
                    </Col>
                    <Col lg={12}>
                      <div className="mb-3">
                        <Label for="exampleFormControlTextarea1" className="form-label fw-bold">
                          Description
                        </Label>
                        <CKEditor
                          editor={ClassicEditor}
                          data={PrmaryImfomation.product_description || ""}
                          onChange={(event, editor) => {
                            const data = editor.getData();
                            SetPramrayImformation({
                              ...PrmaryImfomation,
                              product_description: data
                            });
                          }}
                        />
                      </div>
                    </Col>
                  </Row>
                </Col>
                <Col lg={12}>
                  <div className="hstack gap-2 justify-content-center mt-4">
                    <button type="button" onClick={() => tog_fullscreen1()} className="btn btn-danger">
                      <i className="ri-close-line me-1 align-middle" />
                      Close
                    </button>
                    <button
                      ref={submitButtonRef}
                      type="button"
                      className="btn btn-primary"
                      onClick={() => SubmitData()}
                    >
                      <i className="ri-save-3-line align-bottom me-1"></i>
                      Save
                    </button>
                  </div>
                </Col>
              </Row>
            </ModalBody>
          </Card>
        </ModalBody>
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
      {BankModel === true ? (
        <BankAdd
          modalStates={BankModel}
          setModalStates={() => {
            setBankModel(false);
          }}
          checkchang={handleBankCallback}
        />
      ) : (
        ""
      )}
    </div>
  );
};

export default SampleProductAdd;