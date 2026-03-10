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
import { Link, useNavigate } from "react-router-dom";
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
  const [barcodeSettings, setBarcodeSettings] = useState({

    "barcode_id": 1,
    "marathi_name_length": 15,
    "english_name_length": 15,
    "mrp_size": 12,
    "mrp_weight": "normal",
    "mrp_status": 1,
    "margin_top": 30,
    "barcode_printer": "",
    "barcode_size": "1",
    "business_name_size": "12",
    "business_name_weight": "normal",
    "business_name_status": "1",
    "product_name_size": "12",
    "product_name_weight": "normal",
    "product_name_status": "1",
    "sale_price_size": "12",
    "sale_price_weight": "normal",
    "sale_price_status": "2",
    "date_size": "12",
    "date_weight": "normal",
    "date_status": "1",
    "barcode_number_size": "12",
    "barcode_number_weight": "normal",
    "barcode_number_status": "1",
    "barcode_height": "12",
    "barcode_width": "10",
    "barcode_weight": "normal",
    "bpos_id": null,
    "isSynced": 1,
    "barcode_status": 1,
    "createdAt": "2024-07-30T03:23:50.535Z",
    "updatedAt": "2024-07-30T04:00:14.353Z"
  });
  const getBarcodeSettings = async () => {
    http
      .get("/barcode_settings/list")
      .then((res) => {
        console.log("Test", res.data);
        setBarcodeSettings(res.data);
      })
      .catch((err) => {
        console.log(err);
      })
  }

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

  const navigate = useNavigate();
  // const handlePrint = () => {
  //   let counts = [];
  //   products.forEach((item) => {
  //     if (item.qty % 2 !== 0) {
  //       counts.push(item);
  //     }
  //   });
  //   if (counts.length > 0) {
  //     toast.error("Please fix the quantity");
  //     return;
  //   }

  //   // Generate barcodes
  //   products.forEach((data) => {
  //     JsBarcode(`#barcode-${data.product_hsn_code}`, data.product_hsn_code, {
  //       format: "CODE128",
  //       displayValue: false,
  //       fontSize: 10,
  //       width: 1.2,
  //       height: 20,
  //       margin: 0,
  //     });
  //   });
  //   console.log(products);

  //   const printableArea = document.getElementById("printable-area");

  //   const clonedContent = printableArea.cloneNode(true);
  //   const printFrame = document.createElement("iframe");
  //   printFrame.style.display = "none";
  //   document.body.appendChild(printFrame);

  //   printFrame.onload = () => {
  //     const printDocument =
  //       printFrame.contentDocument || printFrame.contentWindow.document;

  //     // Append the cloned content to the iframe
  //     printDocument.body.appendChild(clonedContent);

  //     // Apply CSS styles for printing
  //     const style = document.createElement("style");
  //     style.textContent = `
  //           @page {
  //               margin:0;
  //               padding:0;
  //               margin-top: 0;
  //               margin-left: 0;
  //               margin-right: 0;
  //               margin-bottom: 0;
  //               size: 80mm 25mm;
  //               background-color: blue;
  //           }
  //           body {
  //             font-family: 'Your Font Family', sans-serif; /* Replace 'Your Font Family' with the desired font family name */
  //           }
  //         `;
  //     printDocument.head.appendChild(style);
  //     printFrame.contentWindow.print();
  //     setTimeout(() => {
  //       navigate("/barcode-print-create ");
  //     }, 1000);
  //     dispatch(removeAllProducts());
  //   };
  //   printFrame.src = "about:blank";
  // };
  const handlePrint = () => {
    if (products.length === 0) {
      toast.warning("Please select at least one product and quantity!");
      return;
    }

    // Generate barcodes for each product
    products.forEach((data) => {
      JsBarcode(`#barcode-${data.product_hsn_code}`, data.product_hsn_code, {
        format: 'CODE128',
        width: (data.product_hsn_code).length > 8 ? 0.8 : 0.7,
        displayValue: false,
        height: 10,
        margin: 0.2,
        font: 'calibri',
        textMargin: 2,
        quietZone: 10,
      });
    });

    // Delay to ensure JsBarcode finishes rendering
    setTimeout(() => {
      // Select the printable area
      const printableArea = document.getElementById("printable-area");

      // Clone the printable area content
      const clonedContent = printableArea.cloneNode(true);

      // Create a hidden iframe for printing
      const printFrame = document.createElement("iframe");
      printFrame.style.display = "none";
      document.body.appendChild(printFrame);

      // Get the iframe's document and append the cloned content
      const printDocument = printFrame.contentDocument || printFrame.contentWindow.document;
      printDocument.body.appendChild(clonedContent);

      // Get the HTML content from the cloned document
      const contentHtml = printDocument.documentElement.outerHTML;

      // Function to replace px with mm (mimicking the `replacePxWithMm` function from `handlePrint2`)
      const updatedHtml = replacePxWithMm(contentHtml);

      // Use electron's print method for silent printing (if applicable)
      window.electron.print({
        printerName: barcodeSettings.barcode_printer, // Use your configured printer
        content: updatedHtml,
        width: 60,  // 80mm in pixels
        height: 25,// Pass the modified HTML content
      });

      // Dispatch action to remove all products after printing
      dispatch(removeAllProducts());

    }, 1000); // Adjust delay to ensure barcodes are fully rendered
  };



  const handlePrint1 = () => {
    let counts = [];
    products.forEach((item) => {
      // Check if the quantity is even; if not, show an error
      if (item.qty % 2 !== 0) {
        counts.push(item);
      }
    });

    if (counts.length > 0) {
      toast.error("Please fix the quantity");
      return;
    }

    // Generate barcodes for all products
    products.forEach((data) => {
      JsBarcode(`#barcode-${data.product_hsn_code}`, data.product_hsn_code, {
        format: "CODE128",
        displayValue: false,
        fontSize: 10,
        width: 0.7,
        height: 10,
        margin: 0,
      });
    });

    setTimeout(() => {
      // Get the content to print
      const printableArea = document.getElementById("printable-area_1");
      const clonedContent = printableArea.cloneNode(true);

      // Create a style element to define print CSS
      const style = document.createElement("style");
      style.textContent = `
        @page {
          margin: 0;
          padding: 0;
          margin-top: 0;
          margin-left: 0;
          margin-right: 0;
          margin-bottom: 0;
          size: 34mm 25mm;  // Set the print size to 34mm x 25mm
        }
        body {
          margin: 0;
          padding: 0;
          font-family: Arial, sans-serif;
        }
      `;
      document.head.appendChild(style);

      // Convert the content to HTML and replace px with mm if necessary
      const contentHtml = clonedContent.outerHTML;
      const updatedHtml = replacePxWithMm(contentHtml); // Ensure this function handles the conversion correctly

      // Send print request to Electron (assuming electron.print is defined)
      window.electron.print({
        printerName: barcodeSettings.barcode_printer, // Barcode printer name
        content: updatedHtml,
        width: 34, // Set the print width to 34mm
        height: 25 // Set the print height to 25mm
      });

      // Clear products after printing
      dispatch(removeAllProducts());
    }, 1000);
  };



  function replacePxWithMm(htmlString) {
    return htmlString.replace(/px/g, 'mm');
  }
  // For 50 x 25 electron
  const handlePrint2 = () => {
    if (products.length == 0) {
      toast.warning("Plz select at leats one product and quantity!");
      return
    } else {
      products.forEach((data) => {
        JsBarcode(`#barcode-${data.product_hsn_code}`, data.product_hsn_code, {
          format: "CODE128",
          displayValue: false,
          fontSize: 4,
          width: 0.7,
          height: 10,
          margin: 0.5,
        });
      });

      // Delay cloning to ensure JsBarcode has finished rendering
      setTimeout(() => {
        const printableArea = document.getElementById("printable-area_2");
        const clonedContent = printableArea.cloneNode(true);
        const printFrame = document.createElement("iframe");
        printFrame.style.display = "none";
        document.body.appendChild(printFrame);

        const printDocument = printFrame.contentDocument || printFrame.contentWindow.document;
        printDocument.body.appendChild(clonedContent);

        const contentHtml = printDocument.documentElement.outerHTML;

        const updatedHtml = replacePxWithMm(contentHtml);

        window.electron.print({
          printerName: barcodeSettings.barcode_printer,
          content: updatedHtml,
          width: 38,
          height: 25
        });

        dispatch(removeAllProducts()); // Adjust timeout duration as needed
      }, 1000);
    } // Adjust timeout duration as needed
  };





  // const handlePrint2 = () => { 
  //   // Generate barcodes
  //  products.forEach((data) => {
  //     JsBarcode(`#barcode-${data.product_hsn_code}`, data.product_hsn_code, {
  //       format: "CODE128",
  //       displayValue: false,
  //       fontSize: 10,
  //       width: 1,
  //       height: 15,
  //       margin: 0,
  //     });
  //   }); 
  //   const printableArea = document.getElementById("printable-area_2");

  //   const clonedContent = printableArea.cloneNode(true);
  //   const printFrame = document.createElement("iframe");
  //   printFrame.style.display = "none";
  //   document.body.appendChild(printFrame);

  //   printFrame.onload = () => {
  //     const printDocument =
  //       printFrame.contentDocument || printFrame.contentWindow.document;

  //     // Append the cloned content to the iframe
  //     printDocument.body.appendChild(clonedContent);

  //     // Apply CSS styles for printing
  //     const style = document.createElement("style");
  //     style.textContent = `
  //           @page {
  //               margin:0;
  //               padding:0;
  //               margin-top: 0;
  //               margin-left: 0;
  //               margin-right: 0;
  //               margin-bottom: 0;
  //               size:50mm 25mm;
  //           }
  //           body {
  //             font-family: 'Your Font Family', sans-serif; /* Replace 'Your Font Family' with the desired font family name */
  //           }
  //         `;
  //     printDocument.head.appendChild(style);
  //     printFrame.contentWindow.print();
  //     // window.electron.print({
  //     //   printerName: barcodeSettings.barcode_printer,
  //     //   content: clonedContent,
  //     // });
  //     dispatch(removeAllProducts());
  //     setTimeout(() => {
  //       navigate("/barcode-print-create")
  //   }, 1000);
  //   };
  //   printFrame.src = "about:blank";

  // };

  const [searchList, SetSearchList] = useState([]);

  // GETTING CUSTOMERS LIST FROM API
  const { http } = AuthUser();

  const buttonsRef = useRef([]);
  const [focusedIndex, setFocusedIndex] = useState(0);
  const tableRef = useRef();
  const [searchResults, setSearchResults] = useState(products);


  const dispatch = useDispatch();
  const handleCallback = (data) => {
    console.log(data);

    if (data.customer !== undefined) {
      setProductIntoTheCart(data.customer);
    }
    toast.success(data.message);
    setProdcutModel(false);
    setIsModalOpen(true);
    setUpdateModalStates(false);
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
        price_credit: prices[0].price_credit,
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
        price_credit: prices.price_credit,
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
              price_credit: prices[0].price_credit,
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
              price_credit: productDetails.price_credit,
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
    // if (e.target.value !== "" && words >= 3) {
    if (e.target.value !== "" && words >= 2) {

      // backend unique array get
      const response = await http.get(
        `/product/information_barcode_onkeyup/${encodeURIComponent(e.target.value)}`
      );
      //  view datalist
      const uniqueProducts = response.data.filter((value, index, self) => {
        return (
          self.findIndex(
            (v) => (v.product_english_name === value.product_english_name
              &&
              v.product_marathi_name === value.product_marathi_name)
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
      if (response.data.length === 0 && e.key === "Enter") {
        // searchInputRef.current.clear();
        const audio = new Audio(invalidAudio);
        audio.play();
        toast.error("Invalid Barcode ???");
      }
      if (result && result.length != 0) {
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
      } else {
        if (e.key === "Enter" && response.data.length != 0) {
          if (response.data.length > 1) {
            const result = Data_product.filter((product) => {
              return (product.price_barcode === e.target.value || product.price_qrcode === e.target.value);
            });
            SetProduct_Model(result);
            setMultiplePrices(result);
            setmodal_standard(true);
            SetSearchList([]);
            searchInputRef.current.clear();
          } else {
            SetSearchList([]);
            StoreDataPrice(response.data[0]);
            searchInputRef.current.clear();
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
    dispatch(removeAllProducts());
    const handleShortCut = (e) => {
      const totalButtons = buttonsRef.current.length;
      if ((e.altKey && e.key === "s") || (e.altKey && e.key === "S")) {
        e.preventDefault();
        // } else if (e.altKey && e.key === "ArrowUp") {
      } else if (e.key === "ArrowUp") {
        setFocusedIndex(
          (prevIndex) => (prevIndex - 1 + totalButtons) % totalButtons
        );
        // } else if (e.altKey && e.key === "ArrowDown") {
      } else if (e.key === "ArrowDown") {
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
    getBarcodeSettings();
  }, [dispatch]);

  useEffect(() => {
    getBarcodeSettings();
    // Focus the button based on focusedIndex
    buttonsRef.current[focusedIndex]?.focus();
    buttonsRef.current.forEach((button, index) => {
      try {
        if (index === focusedIndex) {
          button.style.backgroundColor = "#E7EAE5";
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
                <th>Credit</th>
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
                    style={focusedIndex == index ? { backgroundColor: "#E7EAE5" } : { backgroundColor: "white" }}
                  >
                    <td>{index + 1}</td>
                    <td>
                      {" "}
                      {price.product_english_name === undefined ||
                        price.product_english_name === null
                        ? "-"
                        : price.product_english_name}
                    </td>
                    <td>&#8377; {price.price_mrp}</td>
                    <td>&#8377; {price.price_purchase}</td>
                    <td>&#8377; {price.price_sales}</td>
                    <td>&#8377; {price.price_credit}</td>
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
              {ProdcutModel === true ? (
                <ProductAdd
                  modalStates={ProdcutModel}
                  setModalStates={() => {
                    setProdcutModel(false);
                    setIsModalOpen(true);
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
              <Button color="primary" onClick={barcodeSettings.barcode_size == 1 ? handlePrint : (barcodeSettings.barcode_size == 2 ? handlePrint1 : handlePrint2)}>
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
        <div id="printable-area_1">
          {products.map((data, index) => {
            const renderCount = Math.ceil(data.qty / 1); // Adjusted rendering based on quantity
            return Array.from({ length: renderCount }).map((_, renderIndex) => (
              <div
                style={{ 
                  marginBottom: 0,
                  paddingTop: 0,
                  pageBreakAfter: "always"
                }}
                key={`${index}-${renderIndex}`}
              >
                {Array.from({ length: 1 }).map((_, innerIndex) => {
                  const dataIndex = renderIndex * 1 + innerIndex;
                  if (dataIndex < data.qty) {
                    return (
                      <div
                        style={{
                          textAlign: "center",
                          width: "110mm",
                          height: "25mm",  // Set to 25mm for height
                          marginBottom: "0px",
                          marginTop: index === 0 && renderIndex === 0 ? "-7px" : (index - 4) + "px", // Adjust the margins as needed
                        }}
                        key={dataIndex}
                      >
                        {barcodeSettings.business_name_status == 1 && <small className="fw-bold">
                          <div style={{ paddingTop: `${barcodeSettings.margin_top}px`, fontSize: `${barcodeSettings.business_name_size}px`, fontWeight: `${barcodeSettings.business_name_weight}` }}>
                            {companyDetails && companyDetails.business_name}
                          </div>
                        </small>}

                        {barcodeSettings.barcode_status == 1 &&
                          <div style={{ paddingTop: barcodeSettings.business_name_status == 1 ? "0px" : `${barcodeSettings.margin_top}px` }}>
                            <svg id={`barcode-${data.product_hsn_code}`} style={{ width: "100%", height: "16mm" }} />  {/* Adjust barcode size */}
                          </div>
                        }

                        {barcodeSettings.barcode_number_status == 1 &&
                          <small style={{ fontSize: `${barcodeSettings.barcode_number_size}px`, fontWeight: barcodeSettings.barcode_number_weight }}>
                            {data.product_hsn_code}
                          </small>
                        }

                        {barcodeSettings.date_status == 1 && <span style={{ fontSize: `${barcodeSettings.date_size}px`, fontWeight: `${barcodeSettings.date_weight}` }}>
                          {"pkd. "}
                          {new Date().toLocaleString("en-US", {
                            day: "2-digit",
                            month: "2-digit",
                            year: "2-digit",
                          }).replace(/(\d+)\/(\d+)\/(\d+)/, "$2/$1/$3")}
                        </span>}

                        {barcodeSettings.product_name_status == 1 &&
                          <div style={{ fontSize: `${barcodeSettings.product_name_size}px`, fontWeight: `${barcodeSettings.product_name_weight}` }}>
                            {barcodeLanguage === 1
                              ? data.marathi_name.substring(0, `${parseInt(barcodeSettings.marathi_name_length)}`) + ((data.marathi_name).length > parseInt(barcodeSettings.marathi_name_length) ? ".." : "")
                              : data.product_english_name.substring(0, `${parseInt(barcodeSettings.english_name_length)}`) + ((data.product_english_name).length > parseInt(barcodeSettings.english_name_length) ? ".." : "")
                            }
                          </div>
                        }

                        <div style={{ marginTop: "0px", display: "flex", justifyContent: "space-around" }}>
                          {barcodeSettings.mrp_status == 1 && <span style={{ fontSize: `${parseInt(barcodeSettings.mrp_size) - 2}px`, fontWeight: `${barcodeSettings.mrp_weight}`, marginTop: "-5x" }}>
                            MRP.
                            <span style={{ fontSize: `${parseInt(barcodeSettings.mrp_size)}px` }}>{data.mrp}</span>
                          </span>}

                          {barcodeSettings.sale_price_status == 1 && <span style={{ fontSize: `${parseInt(barcodeSettings.sale_price_size) - 2}px`, fontWeight: `${barcodeSettings.sale_price_weight}`, marginTop: "-5x" }}>
                            Rate.
                            <span style={{ fontSize: `${parseInt(barcodeSettings.sale_price_size)}px` }}>{data.salePrice}</span>
                          </span>}
                        </div>
                      </div>
                    );
                  }
                })}
              </div>
            ));
          })}
        </div>


        <div id="printable-area_2"  >
          {products.map((data, index) => {
            const renderCount = Math.ceil(data.qty / 1);
            return Array.from({ length: renderCount }).map((_, renderIndex) => (
              <div

                style={{
                  marginBottom: 0,
                  paddingTop: 0,
                  pageBreakAfter: "always"
                }}
                key={`${index}-${renderIndex}`}
              >
                {Array.from({ length: 1 }).map((_, innerIndex) => {
                  const dataIndex = renderIndex * 1 + innerIndex;
                  if (dataIndex < data.qty) {
                    return (
                      <div
                        style={{

                          textAlign: "center",

                          width: "100%",
                          height: "23mm",
                          marginBottom: "0px",
                          // Adjusted height for 25mm labels
                          // marginTop: index === 0 && renderIndex === 0 ? "-7px" : (index) + "px", // for client
                          marginTop: index === 0 && renderIndex === 0 ? "-7px" : (index - 4) + "px",
                        }}
                        key={dataIndex}
                      >
                        {barcodeSettings.business_name_status == 1 && <small className="fw-bold">
                          <div style={{ paddingTop: `${barcodeSettings.margin_top}px`, fontSize: `${barcodeSettings.business_name_size}px`, fontWeight: `${barcodeSettings.business_name_weight}` }} >
                            {companyDetails && companyDetails.business_name}
                          </div>
                        </small>
                        }

                        {barcodeSettings.barcode_status == 1 &&
                          <div style={{ paddingTop: barcodeSettings.business_name_status == 1 ? "0px" : `${barcodeSettings.margin_top}px` }}>
                            <svg id={`barcode-${data.product_hsn_code}`} /></div>}

                        {barcodeSettings.barcode_number_status == 1 &&
                          <small style={{ fontSize: `${barcodeSettings.barcode_number_size}px`, fontWeight: barcodeSettings.barcode_number_weight }}>
                            {data.product_hsn_code}
                          </small>
                        }
                        {barcodeSettings.date_status == 1 && <span style={{ fontSize: `${barcodeSettings.date_size}px`, fontWeight: `${barcodeSettings.date_weight}` }}>
                          {"pkd. "}
                          {new Date().toLocaleString("en-US", {
                            day: "2-digit",
                            month: "2-digit",
                            year: "2-digit",
                          }).replace(/(\d+)\/(\d+)\/(\d+)/, "$2/$1/$3")}
                        </span>}
                        {
                          barcodeSettings.product_name_status == 1 &&
                          <div style={{ fontSize: `${barcodeSettings.product_name_size}px`, fontWeight: `${barcodeSettings.product_name_weight}` }}>
                            {barcodeLanguage === 1
                              ? data.marathi_name.substring(0, `${parseInt(barcodeSettings.marathi_name_length)}`) + ((data.marathi_name).length > parseInt(barcodeSettings.marathi_name_length) ? ".." : "")
                              : data.product_english_name.substring(0, `${parseInt(barcodeSettings.english_name_length)}`) + ((data.product_english_name).length > parseInt(barcodeSettings.english_name_length) ? ".." : "")
                            }
                          </div>}
                        <div style={{ marginTop: "0px", display: "flex", justifyContent: "space-around" }}>
                          {barcodeSettings.mrp_status == 1 && <span style={{ fontSize: `${parseInt(barcodeSettings.mrp_size) - 2}px`, fontWeight: `${barcodeSettings.mrp_weight}`, marginTop: "-5x" }}>
                            MRP.
                            {/* <span style={{ fontSize: `${barcodeSettings.barcode_font_size}px` }}>{data.salePrice}</span> */}
                            <span style={{ fontSize: `${parseInt(barcodeSettings.mrp_size)}px` }}>{data.mrp}</span>
                          </span>}
                          {barcodeSettings.sale_price_status == 1 && <span style={{ fontSize: `${parseInt(barcodeSettings.sale_price_size) - 2}px`, fontWeight: `${barcodeSettings.sale_price_weight}`, marginTop: "-5x" }}>
                            Rate.
                            {/* <span style={{ fontSize: `${barcodeSettings.barcode_font_size}px` }}>{data.salePrice}</span> */}
                            <span style={{ fontSize: `${parseInt(barcodeSettings.sale_price_size)}px` }}>{data.salePrice}</span>
                          </span>}

                        </div>
                      </div>
                    );
                  }
                })}
              </div>
            ));
          })}
        </div>



        <div
          id="printable-area"
          style={{ pageBreakAfter: "always" }}
        >
          {/* <div style={{border: "1px solid black"}}>
          Test
        </div> */}
          {products.map((data, index) => {
            const renderCount = Math.ceil(data.qty / 2); // Adjusted to show 2 items per row
            return Array.from({ length: renderCount }).map((_, renderIndex) => (
              <div
                style={{
                  display: "flex", // Flex layout for 2-up structure
                  marginBottom: 0,
                  paddingTop: 0,

                  pageBreakAfter: "always"
                }}
                key={`${index}-${renderIndex}`}
              >
                {Array.from({ length: 2 }).map((_, innerIndex) => {
                  const dataIndex = renderIndex * 2 + innerIndex;
                  if (dataIndex < data.qty) {
                    return (
                      <div
                        style={{
                          flex: 1, // Two items will take equal space
                          textAlign: "center",
                          marginBottom: "0px",
                          marginTop: index === 0 && renderIndex === 0 ? "0px" : "0px", // Custom margin
                          // Border
                          marginRight: innerIndex === 0 ? "5mm" : "0" // Margin only for the first item in each row
                        }}
                        key={dataIndex}
                      >
                        {barcodeSettings.business_name_status == 1 && <small className="fw-bold">
                          <div style={{ paddingTop: `${barcodeSettings.margin_top}px`, fontSize: `${barcodeSettings.business_name_size}px`, fontWeight: `${barcodeSettings.business_name_weight}` }} >
                            {companyDetails && companyDetails.business_name}
                          </div>
                        </small>
                        }

                        {barcodeSettings.barcode_status == 1 &&
                          <div style={{ paddingTop: barcodeSettings.business_name_status == 1 ? "0px" : `${barcodeSettings.margin_top}px` }}>
                            <svg id={`barcode-${data.product_hsn_code}`} /></div>}

                        {barcodeSettings.barcode_number_status == 1 &&
                          <small style={{ fontSize: `${barcodeSettings.barcode_number_size}px`, fontWeight: barcodeSettings.barcode_number_weight }}>
                            {data.product_hsn_code}
                          </small>
                        }
                        {barcodeSettings.date_status == 1 && <span style={{ fontSize: `${barcodeSettings.date_size}px`, fontWeight: `${barcodeSettings.date_weight}` }}>
                          {"pkd. "}
                          {new Date().toLocaleString("en-US", {
                            day: "2-digit",
                            month: "2-digit",
                            year: "2-digit",
                          }).replace(/(\d+)\/(\d+)\/(\d+)/, "$2/$1/$3")}
                        </span>}
                        {
                          barcodeSettings.product_name_status == 1 &&
                          <div style={{ fontSize: `${barcodeSettings.product_name_size}px`, fontWeight: `${barcodeSettings.product_name_weight}` }}>
                            {barcodeLanguage === 1
                              ? data.marathi_name.substring(0, `${parseInt(barcodeSettings.marathi_name_length)}`) + ((data.marathi_name).length > parseInt(barcodeSettings.marathi_name_length) ? ".." : "")
                              : data.product_english_name.substring(0, `${parseInt(barcodeSettings.english_name_length)}`) + ((data.product_english_name).length > parseInt(barcodeSettings.english_name_length) ? ".." : "")
                            }
                          </div>}
                        <div style={{ marginTop: "0px", display: "flex", justifyContent: "space-around" }}>
                          {barcodeSettings.mrp_status == 1 && <span style={{ fontFamily: '"Calibri", Calibri, sans-serif', fontSize: `${parseInt(barcodeSettings.mrp_size) - 2}px`, fontWeight: `${barcodeSettings.mrp_weight}`, marginTop: "-5x" }}>
                            MRP.
                            {/* <span style={{ fontSize: `${barcodeSettings.barcode_font_size}px` }}>{data.salePrice}</span> */}
                            <span style={{ fontSize: `${parseInt(barcodeSettings.mrp_size)}px` }}>{data.mrp}</span>
                          </span>}
                          {barcodeSettings.sale_price_status == 1 && <span style={{ fontFamily: '"Calibri", Calibri, sans-serif', fontSize: `${parseInt(barcodeSettings.sale_price_size) - 2}px`, fontWeight: `${barcodeSettings.sale_price_weight}`, marginTop: "-5x" }}>
                            विक्री कि.
                            {/* <span style={{ fontSize: `${barcodeSettings.barcode_font_size}px` }}>{data.salePrice}</span> */}
                            <span style={{ fontSize: `${parseInt(barcodeSettings.sale_price_size)}px` }}>{data.salePrice}</span>
                          </span>}

                        </div>
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
    </React.Fragment>
  );
};

export default PrintBarcodeCreate;
