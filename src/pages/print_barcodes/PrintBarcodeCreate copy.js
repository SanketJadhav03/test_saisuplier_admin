import React, { useEffect, useState, useRef } from "react";
import {
  Button,
  Card,
  CardBody,
  Col,
  Container,
  Input,
  Modal,
  ModalBody,
  ModalFooter,
  Navbar,
  Row,
  Table,
} from "reactstrap";
import BarcodeProductRow from "./components/BarcodeProductRow";
import { Link } from "react-router-dom";
import invalidAudio from "../../assets/audio/error.ogg";

import { useDispatch, useSelector } from "react-redux";
import AuthUser from "../../helpers/Authuser";
import {
  addProductToStore,
  increaseProductQuantity,
  removeAllProducts,
  setTotalAmounts,
  setVisibility,
  updateSingleProduct,
} from "../../store/barcode/BarcodeSlice";
import { useCallback } from "react";
import JsBarcode from "jsbarcode";

import { AsyncTypeahead } from "react-bootstrap-typeahead";
import ProductAdd from "../Products/ProductAdd";
import { ToastContainer, toast } from "react-toastify";
import ProductUpdate from "../Products/ProductUpdate";

const PrintBarcodeCreate = () => {
  // USE STATES
  const [paymentModesList, setpaymentModesList] = useState([]);
  const [multiplePrices, setMultiplePrices] = useState([]);
  const [Prodcut, setProdcut] = useState(0);
  const [modalStates, setModalStates] = useState(false);
  const [ProdcutModel, setProdcutModel] = useState(false);

  // REDUX TOOLKIT SELECTORS
  const cartProductsFromTheStore = useSelector(
    (state) => state.barcodeSlice.products
  );
  const [Product_Model, SetProduct_Model] = useState([]);

  // POS DATA OBJECT
  const [posData, setPosData] = useState({
    customerDetails: {},
    paymentDetails: {},
  });

  const products = useSelector((state) => state.barcodeSlice.products);

  const [searchTerm, setSearchTerm] = useState("");
  const [barcodeLanguage, setBarcodeLanguage] = useState(1);

  const renderMenuItemChildren = (option, props, index) => (
    <div key={option.id}>
      <div key={option.id}>
        <strong>
          {" "}
          {option.product_english_name}/ {option.product_marathi_name}
        </strong>
      </div>
    </div>
  );

  const handlePrint = () => {
    let counts = [];
    products.forEach((item) => {
      if (item.qty % 2 !== 0) {
        counts.push(item);
      }
    });
    if (counts.length > 0) {
      toast.error("Please fix the quantity");
      return;
    }

    // Generate barcodes
    products.forEach((data) => {
      JsBarcode(`#barcode-${data.product_hsn_code}`, data.product_hsn_code, {
        format: "CODE128",
        displayValue: false,
        fontSize: 10,
        width: 1.2,
        height: 20,
        margin: 0,
      });
    });

    const printableArea = document.getElementById("printable-area");

    const clonedContent = printableArea.cloneNode(true);
    const printFrame = document.createElement("iframe");
    printFrame.style.display = "none";
    document.body.appendChild(printFrame);

    printFrame.onload = () => {
      const printDocument =
        printFrame.contentDocument || printFrame.contentWindow.document;

      // Append the cloned content to the iframe
      printDocument.body.appendChild(clonedContent);

      // Apply CSS styles for printing
      const style = document.createElement("style");
      style.textContent = `
            @page {
                margin:0;
                padding:0;
                size:80mm  25mm ;
            }
            body {
              font-family: 'Your Font Family', sans-serif; /* Replace 'Your Font Family' with the desired font family name */
            }
          `;
      printDocument.head.appendChild(style);
      printFrame.contentWindow.print();
      dispatch(removeAllProducts());
    };
    printFrame.src = "about:blank";
  };

  const [searchList, SetSearchList] = useState([]);

  // GETTING CUSTOMERS LIST FROM API
  const { http } = AuthUser();

  const buttonsRef = useRef([]);
  const [focusedIndex, setFocusedIndex] = useState(0);
  const tableRef = useRef();
  const [searchResults, setSearchResults] = useState(products);

  const popupStyles = {
    position: "absolute",
    width: "100%",
    maxHeight: "250px",
    overflowY: "auto",
    backgroundColor: "white",
    border: "1px solid #ccc",
    boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
    zIndex: 1,
  };

  const popupItemStyles = {
    padding: "8px",
    cursor: "pointer",
    borderBottom: "1px solid #ccc",
  };
  const dispatch = useDispatch();
  const handleCallback = (data) => {
    setProductIntoTheCart(data.array);
    toast.success(data.message);
    setProdcut(0);
    setUpdateModalStates(!UpdatemodalStates);
  };
  // SETTING THE PRODUCT INTO THE CART
  const setProductIntoTheCart = async (prices) => {
    let productDetails;
    let productMap = {};
    if (Array.isArray(prices) && prices.length > 0) {
      productDetails = await getProductInfo(prices[0].product_tbl_id);
      productMap = {
        product_id: productDetails.product_id,
        product_name: productDetails.product_english_name,
        marathi_name: productDetails.product_marathi_name,
        product_price_id: prices.product_price_id,
        qty: 2,
        mrp: prices[0].price_mrp,
        salePrice: prices[0].price_sales,
        product_hsn_code: prices[0].price_barcode,
        totalPrice: prices[0].price_sales,
      };
    } else {
      productDetails = await getProductInfo(prices.product_tbl_id);
      productMap = {
        product_id: productDetails.product_id,
        product_name: productDetails.product_english_name,
        marathi_name: productDetails.product_marathi_name,
        product_price_id: prices.product_price_id,
        qty: 2,
        mrp: prices.price_mrp,
        salePrice: prices.price_sales,
        product_hsn_code: prices.price_barcode,
        totalPrice: prices.price_sales,
        purchase_price: prices.price_purchase,
        online_price: prices.price_online,
        wholesaler_price: prices.price_wholesaler,
      };
    }

    const isProductAlreadyInCart = cartProductsFromTheStore.some(
      (cartProduct) => cartProduct.product_id === productDetails.product_id
    );
    if (isProductAlreadyInCart) {
      const existingProduct = cartProductsFromTheStore.find(
        (cartProduct) => cartProduct.product_id === productDetails.product_id
      );
      if (existingProduct) {
        const previousQuantity = existingProduct.qty;
        const newQuantity = previousQuantity + 1;
        dispatch(
          increaseProductQuantity({
            product_id: productDetails.product_id,
            newQuantity,
          })
        );
        if (Array.isArray(prices) && prices.length > 0) {
          productDetails = await getProductInfo(prices[0].product_tbl_id);
          dispatch(
            updateSingleProduct({
              product_id: productDetails.product_id,
              newSalePrice: prices[0].price_sales,
              mrp: prices[0].price_mrp,
              marathi: productDetails.product_marathi_name,
              english: productDetails.product_english_name,
              purchase: prices[0].price_purchase,
              online: prices[0].price_online,
              wholesaler: prices[0].price_wholesaler,
              barcode: prices[0].price_barcode,
            })
          );
        } else {
          productDetails = await getProductInfo(prices.product_tbl_id);
          console.log(productDetails);
          dispatch(
            updateSingleProduct({
              product_id: productDetails.product_id,
              newSalePrice: prices.price_sales,
              mrp: prices.price_mrp,
              marathi: productDetails.product_marathi_name,
              english: productDetails.product_english_name,
              purchase: productDetails.price_purchase,
              online: productDetails.price_online,
              wholesaler: productDetails.price_wholesaler,
              barcode: prices.price_barcode,
            })
          );
        }

        dispatch(setTotalAmounts());
      }
    } else {
      dispatch(addProductToStore([productMap]));
      dispatch(setTotalAmounts());
    }
    setSearchTerm("");
  };

  const [isModalOpen, setIsModalOpen] = useState(true);

  // FETCHING SINGLE PRODUCT DETAILS
  const getProductInfo = async (productId) => {
    const response = await http.get(`/products/single-product/${productId}`);
    return response.data.productDetails;
  };
  const [Data_product, SetData_product] = useState([]);

  const getProductsByName = async (e) => {
    const words = e.target.value.length;
    if (e.target.value !== "" && words >= 3) {
      if (!isNaN(e.target.value)) {
        // backend unique array get
        const response = await http.get(
          `/product/information_barcode_onkeyup/${e.target.value}`
        );
        if (response.data.length === 1 && e.key === "Enter") {
          searchInputRef.current.clear();
          StoreDataPrice(response.data[0]);
        } else if (response.data.length >= 2 && e.key === "Enter") {
          // add multiple price
          searchInputRef.current.clear();
          SetProduct_Model(response.data);
          setmodal_standard(true);
        } else if (response.data.length === 0 && e.key === "Enter") {
          // searchInputRef.current.clear();
          const audio = new Audio(invalidAudio);
          audio.play();
          toast.error("Invalid Barcode ???");
        } else {
          //
        }
      } else {
        // backend unique array get
        const response = await http.get(
          `/product/information_barcode_onkeyup/${e.target.value}`
        );
        //  view datalist
        const uniqueProducts = response.data.filter((value, index, self) => {
          return (
            self.findIndex(
              (v) => v.product_english_name === value.product_english_name
            ) === index
          );
        });
        if (e.code !== "ArrowUp" && e.code !== "ArrowDown") {
          SetSearchList(uniqueProducts);
        }
        // setdata for responese
        SetData_product(response.data);
        // find product name get multiple array
        const result = Data_product.filter((product) => {
          return product.product_english_name === e.target.value;
        });
        if (result) {
          if (result.length >= 1) {
            if (result.length === 1) {
              if (e.key === "Enter") {
                SetSearchList([]);
                StoreDataPrice(result[0]);
                searchInputRef.current.clear();
              }
            } else {
              // add multiple price
              SetProduct_Model(result);
              setMultiplePrices(result);
              setmodal_standard(true);
              SetSearchList([]);
              searchInputRef.current.clear();
            }
          }
        }
      }
    } else {
      SetSearchList([]);
    }
  };
  const searchInputRef = useRef();
  const StoreDataPrice = (data) => {
    setProductIntoTheCart(data);
  };
  const [companyDetails, setCompanyDetails] = useState({});
  const [userDetails, setUserDetails] = useState({});

  const getCompanyDetails = async () => {
    const companyDetailsResponse = await http.get("/business_index");
    setCompanyDetails(companyDetailsResponse.data[0]);
    const obj = JSON.parse(sessionStorage.getItem("authUser"));
    setUserDetails(obj.user);
  };
  const getDetails = async () => {
    const resp = await http.get("/billing-settings/details");
    setBarcodeLanguage(resp.data.barcode_product_name_type);
    console.log(resp);
  };
  useEffect(() => {
    getDetails();
    getCompanyDetails();
    const handleShortCut = (e) => {
      const totalButtons = buttonsRef.current.length;
      if ((e.altKey && e.key === "s") || (e.altKey && e.key === "S")) {
        e.preventDefault();
      } else if (e.altKey && e.key === "ArrowUp") {
        setFocusedIndex(
          (prevIndex) => (prevIndex - 1 + totalButtons) % totalButtons
        );
      } else if (e.altKey && e.key === "ArrowDown") {
        setFocusedIndex((prevIndex) => (prevIndex + 1) % totalButtons);
      } else if (e.key === "Enter") {
        // Trigger a click event on the focused button
        const focusedButton = buttonsRef.current[focusedIndex];
        if (focusedButton) {
          focusedButton.click();
        }
      }
    };
    window.addEventListener("keydown", handleShortCut);
    return () => {
      window.removeEventListener("keydown", handleShortCut);
      // dispatch(removeAllProducts())
    };
  }, [dispatch]);

  useEffect(() => {
    // Focus the button based on focusedIndex
    buttonsRef.current[focusedIndex]?.focus();
    buttonsRef.current.forEach((button, index) => {
      try {
        if (index === focusedIndex) {
          button.style.backgroundColor = "red";
        } else {
          button.style.backgroundColor = ""; // Reset other buttons' background color
        }
      } catch (error) {
        console.log(error);
      }
    });
  }, [focusedIndex]);

  document.title = "Barcode Create - Ajspire Technologies";
  const [modal_standard, setmodal_standard] = useState(false);

  const showToast = () => {
    toast.error("Quantity must be even !");
  };
  // Prodcut edit
  const [UpdatemodalStates, setUpdateModalStates] = useState(false);
  const [FindData, SetFind] = useState([]);
  const ProdcutEdit = (data) => {
    http
      .get(`/products/find/product/singal/${data}`)
      .then(function (response) {
        SetFind(response.data[0]);
        setUpdateModalStates(!UpdatemodalStates);
      })
      .catch(function (error) {
        console.log({ error: error });
      });
  };
  return (
    <React.Fragment>
      <ToastContainer />
      <Modal
        id="myModal"
        isOpen={modal_standard}
        toggle={() => {
          setmodal_standard(!modal_standard);
        }}
      >
        <ModalBody>
          <h5 className="fs-15">Product Prices List</h5>
          <table className="table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Product Name</th>
                <th>MRP</th>
                <th>Purchase</th>
                <th>Sales</th>
                <th>Online</th>
              </tr>
            </thead>
            <tbody>
              {multiplePrices.map((price, index) => {
                return (
                  <tr
                    key={Math.random(Math.random() * Math.random())}
                    onClick={() => {
                      setProductIntoTheCart(price);
                      setmodal_standard(!modal_standard);
                      setFocusedIndex(null);
                    }}
                    ref={(el) => (buttonsRef.current[index] = el)}
                  >
                    <td>{index + 1}</td>
                    <td>
                      &#8377;{" "}
                      {price.product_english_name === undefined ||
                        price.product_english_name === null
                        ? "-"
                        : price.product_english_name}
                    </td>
                    <td>&#8377; {price.price_mrp}</td>
                    <td>&#8377; {price.price_purchase}</td>
                    <td>&#8377; {price.price_sales}</td>
                    <td>&#8377; {price.price_online}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </ModalBody>
        <ModalFooter>
          <Button
            color="danger"
            onClick={() => {
              setmodal_standard(!modal_standard);
            }}
          >
            Close
          </Button>
        </ModalFooter>
      </Modal>

      <Navbar className="mb-0 shadow">
        <div>Ajspire Technologies</div>
        <div className="float-right">
          <Button color="danger" className="btn-label rounded-pill">
            <i className="ri-user-smile-line label-icon align-middle fs-16 me-2"></i>
            <Link to={"/dashboard"} className="text-white">
              Dashboard
            </Link>
          </Button>
          <Button color="primary" className="ml-2 btn-label rounded-pill">
            <i className="ri-user-smile-line label-icon align-middle fs-16 me-2"></i>
            <Link to={"/pos"} className="text-white">
              POS Bills List
            </Link>
          </Button>
        </div>
      </Navbar>
      <div className="page-content" id="hide_scroll">
        <Container fluid>
          <Row>
            <Col lg={12} style={{ marginTop: "-80px" }}>
              {Prodcut === 1 ? (
                <ProductAdd
                  modalStates={Prodcut}
                  setModalStates={() => {
                    setProdcut(false);
                  }}
                  checkchang={handleCallback}
                />
              ) : (
                ""
              )}
              <Card>
                <CardBody>
                  <div className="form-icon right">
                    <div
                      className="input-group"
                      onKeyUp={(e) => getProductsByName(e)}
                    >
                      <AsyncTypeahead
                        id="async-pagination-example"
                        placeholder="Search Products by name or Scan Barcode..."
                        autoFocus
                        ref={searchInputRef}
                        labelKey={(option) => `${option.product_english_name}`}
                        renderMenuItemChildren={renderMenuItemChildren}
                        options={searchList}
                        onSearch={(e) => console.log(e)}
                        onChange={(data) => console.log(data)}
                      />
                      <span
                        className="input-group-text"
                        id="basic-addon2"
                        onClick={() => {
                          setProdcutModel(ProdcutModel ? false : true);
                          setIsModalOpen(false);
                        }}
                      >
                        <div className="d-flex">
                          <div style={{ backgroundColor: "red" }}>
                                                                  {/* <i className="ri-barcode-line fs-4 mx-5"></i> */}
                          </div>{" "}
                          <button className="bg-primary text-white">+</button>
                        </div>
                      </span>
                    </div>
                  </div>
                  <Row>
                    <Col
                      sm={12}
                      className="mt-2"
                      style={{ height: "500px", overflowY: "auto" }}
                    >
                      <Table className="align-right table-nowrap mb-0 fs-5 fw-bold text-end table-sm">
                        <thead className="bg-light">
                          <tr>
                            <th scope="col" className="text-start">
                              No.
                            </th>
                            <th scope="col" className="text-start">
                              Item Name
                            </th>
                            <th scope="col" className="text-center">
                              Barcode
                            </th>
                            <th scope="col" className="text-center">
                              Qty
                            </th>
                            <th scope="col">MRP</th>
                            <th scope="col">Sale Price</th>
                            <th scope="col">Purchase</th>
                            <th scope="col">Online</th>
                            <th scope="col">Wholesaler</th>
                            <th scope="col">Remove</th>
                          </tr>
                        </thead>
                        <tbody ref={tableRef}>
                          {cartProductsFromTheStore.map((item, index) => (
                            <BarcodeProductRow
                              key={item.product_id}
                              product={item}
                              index={index}
                              getindex={ProdcutEdit}
                              showToast={showToast}
                            />
                          ))}
                        </tbody>
                      </Table>
                    </Col>
                  </Row>
                </CardBody>
              </Card>
            </Col>
            <div className="d-flex justify-content-center">
              {/* <Link to={"/barcode-print-list"} className='text-white text-center'><Button>Print Barcodes</Button></Link> */}
              <Button color="primary" onClick={handlePrint}>
                Print Barcodes
              </Button>
              <div style={{ width: "10px" }}></div>
              <Button
                color="danger"
                className="ml-2"
                onClick={() => {
                  dispatch(removeAllProducts());
                }}
              >
                Reset
              </Button>
              <div style={{ width: "10px" }}></div>
            </div>
          </Row>
        </Container>
      </div>
      <Container className="d-none">
        <div
          id="printable-area"
          style={{ pageBreakAfter: "always", height: "15mm" }}
        >
          {products.map((data, index) => {
            const renderCount = Math.ceil(data.qty / 2);
            return Array.from({ length: renderCount }).map((_, renderIndex) => (
              <div style={{ display: "flex" }} key={`${index}-${renderIndex}`}>
                {Array.from({ length: 2 }).map((_, innerIndex) => {
                  const dataIndex = renderIndex * 2 + innerIndex;
                  if (dataIndex < data.qty) {
                    return (
                      <div
                        style={{
                          flex: 1,
                          // width: "38mm",
                          height: "23mm",
                          marginTop:
                            index === 0 && renderIndex === 0
                              ? "-5px"
                              : index + "px",
                          // background: "red",
                          border: "2px solid white",
                          textAlign: "center",
                          marginRight: innerIndex === 0 ? "5mm" : "0", // Apply margin only for the first item in a row
                        }}
                        key={dataIndex}
                      >
                        <small className="fw-bold">
                          {" "}
                          <b>{companyDetails.business_name}</b>{" "}
                        </small>{" "}
                        <br />
                        <svg id={`barcode-${data.product_hsn_code}`} />
                        <small style={{ fontSize: "10px", fontWeight: "bold" }}>{data.product_hsn_code}</small>
                        <p
                          style={{
                            fontSize: "11px",
                            fontWeight: "bold",
                            marginTop: "2px",
                          }}
                        >
                          {barcodeLanguage === 1
                            ? data.marathi_name.length > 18
                              ? data.marathi_name.substring(0, 18) + ".."
                              : data.marathi_name
                            : data.product_name.length > 18
                              ? data.product_name.substring(0, 18) + ".."
                              : data.product_name}
                        </p>
                        <p
                          style={{
                            marginTop: "-8px",
                            display: "flex",
                            justifyContent: "space-around",
                          }}
                        >
                          <span
                            style={{
                              fontSize: "12px",
                              marginTop: "-5px",
                              fontWeight: "bold",
                            }}
                          >
                            वि. किं.
                            <span style={{ fontSize: "14px" }}>
                              {data.salePrice}
                            </span>
                          </span>
                          <span style={{ fontSize: "7px", fontWeight: "bold" }}>
                            | {" "}
                            {new Date()
                              .toLocaleString("en-US", {
                                day: "2-digit",
                                month: "2-digit",
                                year: "2-digit",
                              })
                              .replace(/(\d+)\/(\d+)\/(\d+)/, "$2/$1/$3")}
                          </span>
                        </p>
                      </div>
                    );
                  } else {
                    return (
                      <div style={{ flex: 1, width: "38mm" }} key={dataIndex} />
                    );
                  }
                })}
              </div>
            ));
          })}
        </div>
        {UpdatemodalStates === true ? (
          <ProductUpdate
            modalStates={UpdatemodalStates}
            setModalStates={() => {
              setUpdateModalStates(false);
            }}
            checkchang={handleCallback}
            edit_data={FindData}
          />
        ) : (
          ""
        )}
      </Container>
    </React.Fragment >
  );
};

export default PrintBarcodeCreate;
