import React, { useEffect, useState, useRef } from "react";
import classnames from "classnames";
import AsyncSelect from 'react-select/async';

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
  Spinner,
  Table,
  Label,
  TabContent,
  TabPane,
  Nav,
  NavItem,
  NavLink,
} from "reactstrap";
import POSProductRow from "./components/POSProductRow";
import { Link, json, useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import AuthUser from "../../helpers/Authuser";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer, toast } from "react-toastify";
import invalidAudio from "../../assets/audio/error.ogg";
import validAudio from "../../assets/audio/audio_sucess.mp3";
import CustomerAdd from "../Customers/CustomerAdd";
import {
  addProductToStore,
  increaseProductQuantity,
  makeLastProductEditable,
  setCreditTotalAmounts,
  setPrintingDialogState,
  setTotalAmounts,
  setTotalPayable,
  setVisibility,
  updateCreditSingleProduct,
  updateMRPPrice,
  addTabId,
  updatePayable,
} from "../../store/pos/POSSlice";
import Select from "react-select";
import ProductAdd from "../Products/ProductAdd";
import Flatpickr from "react-flatpickr";
import {
  removeAllProducts,
  updateSingleProduct,
} from "../../store/pos/POSSlice";
import { AsyncTypeahead } from "react-bootstrap-typeahead";
import "react-bootstrap-typeahead/css/Typeahead.css";
import ProductUpdate from "../Products/ProductUpdate";
import { IMG_API_URL } from "../../helpers/url_helper";
import ScrollToBottom from "react-scroll-to-bottom";
import "../purchase/autoscroll.css";
import Confirmation from "../../Components/Common/Confirmation";
import WhatsAppButton from "./components/WhatsAppMessage";

const POSCreate = () => {

  // NAVIGATION
  const navigate = useNavigate();
  const { tab_id } = useParams();
  const [tabId, setTabId] = useState(tab_id);
  const [activeTab, setActiveTab] = useState(tabId || "1");
  const toggleTab = (tab, type) => {

    if (activeTab !== tab) {
      dispatch(addTabId({
        tab_id: tab
      }))
      dispatch(setTotalAmounts());
      setTabId(tab);
      setActiveTab(tab);
      navigate(`/pos/create/${tab}`)
    }
  };
  const [tabs, setTabs] = useState([
    { id: '1', title: "POS 1", content: 'Bye' },
  ]);



  const [defaultValues, setDefaultValues] = useState(0);
  const addTab = () => {
    const newTabId = (tabs.length + 1).toString();
    const newTab = { id: newTabId, title: `POS ${newTabId}`, content: `Content for Tab ${newTabId}` };
    setDefaultValues(defaultValues + 1);


    setTabs([...tabs, newTab]);
    navigate(`/pos/create/${newTabId}`);


    dispatch(addTabId({
      tab_id: newTabId
    }))


    dispatch(setTotalAmounts());
    setTabId(newTabId);
    setActiveTab(newTabId);
  };
  useEffect(() => {
    setCustomerType([...customerType.filter(item => item.tab_id != tabId), { label: "Cash Sale", value: 1, tab_id: tabId }]);
    setPaymentType([...paymentType.filter(item => item.tab_id != tabId), { label: "Cash", value: 1, tab_id: tabId }]);
    setPaymentTerm([...paymentTerm.filter(item => item.tab_id != tabId), { label: "Cash", value: 1, tab_id: tabId }]);
    if (tabs.filter((item) => item.id == tabId).length == 0) {
      dispatch(addTabId({
        tab_id: 1
      }))
      dispatch(setTotalAmounts());
      // setActiveTab('1');
      // setTabId('1');
      navigate("/pos/create/1")
    }
  }, [defaultValues + 1])

  const removeTab = (index) => {

    setTabs(tabs.filter((_, i) => i != index));
    setActiveTab('1');
    setTabId('1');
    dispatch(removeAllProducts({
      tab_id: tabId
    }));
    dispatch(setTotalAmounts());
    navigate(`/pos/create/1`)
  }
  // USE STATES
  const [billingSettings, setBillingSettings] = useState({
    marathi_name_length: 11,
    english_name_length: 11,
    business_name_size: 12,
    business_name_weight: "normal",
    address_size: 12,
    address_weight: "normal",

    mobile_size: 12,
    mobile_weight: "normal",

    product_name_size: 12,
    product_name_weight: "normal",


    all_amount_size: 12,
    all_amount_weight: "normal",

    total_qty_size: 10,
    total_qty_weight: "normal",

    total_bill_size: 12,
    total_bill_weight: "bold",

    saving_amount_size: 12,
    saving_amount_weight: "normal",

  });
  const getBillingSettings = async () => {
    http
      .get("/billing_settings/list")
      .then((res) => {
        if (res.data) {
          setBillingSettings(res.data);
        }
      })
      .catch((err) => {
        console.log(err);
      })
  }
  useEffect(() => {
    getBillingSettings();
  }, []);

  // 
  const [customersList, setCustomersList] = useState([]);


  const [paymentModesList, setpaymentModesList] = useState([]);
  const [paymentTermList, setpaymentTermList] = useState([]);
  const [products, setProducts] = useState([]);
  const [multiplePrices, setMultiplePrices] = useState([]);
  const [enteredBillAmount, setEnteredBillAmount] = useState(0);
  const [lastBillDetails, setLastBillDetails] = useState({});
  const [defaultCustomer, setDefaultCustomer] = useState({});
  const [defaultPaymentMode, setDefaultPaymentMode] = useState({});
  const [defaultPaymentTerm, setDefaultPaymentTerm] = useState({});
  const [currentCustomerDetails, setCurrentCustomerDetails] = useState({});
  const [C_model, Set_C_model] = useState(false);
  const [ProdcutModel, setProdcutModel] = useState(false);
  const [manageCategory, setManageCategory] = useState(0);
  const [currentMultipleProductDetails, setCurrentMultipleProductDetails] =
    useState("");
  const saveButtonRef = useRef();
  const customerRef = useRef();
  // STATE FOR CHECK & SAVE PRODUCT ALT + S
  const [isModalOpen, setIsModalOpen] = useState(true);
  const handleCallback = (data, status, customer) => {
    if (status == 0) { // for customer
      setManageCategory(1);
      getcustomer();

      const updatedPrimaryInformation = {
        ...posData.PrimaryImformation,
        master_customer_id: customer.customer_id,
      };
      const updatedPosData = {
        ...posData,
        PrimaryImformation: updatedPrimaryInformation,
      };
      toast.success(data);  //customer
      console.log("Customer data: ", customer);
      setCustomerType([...customerType.filter(item => item.tab_id != tabId), { label: customer.customer_name, value: customer.customer_id, tab_id: tabId }]);
      setPosData(updatedPosData);
      getCustomerDetails(customer.customer_id);
    }
    if (data.customer !== undefined) {
      setProductIntoTheCart(data.customer, data.update);
    }
    toast.success(data.message);
    setProdcutModel(false);
    setIsModalOpen(true);
    setUpdateModalStates(false);
    Set_C_model(false);
    navigate("/pos/create/1");

  };
  // REDUX TOOLKIT SELECTORS
  const totalMRP = useSelector((state) => state.POSSlice.totalMRP);
  const totalQty = useSelector((state) => state.POSSlice.totalQty);
  const totalSale = useSelector((state) => state.POSSlice.totalSalesPrice);
  const totalBillAMT = useSelector((state) => state.POSSlice.totalBillAmount);
  const [saveButtonLoading, setSaveButtonLoading] = useState(false);
  const [size, setSize] = useState(null);
  const isOpened = useSelector(
    (state) => state.POSSlice.isPrintingDialogOpening
  );
  const isVisible = useSelector(
    (state) => state.POSSlice.isVisibilityForAmount
  );
  const totalPayable = useSelector((state) => state.POSSlice.totalPayable);
  const remainingFromStore = useSelector(
    (state) => state.POSSlice.totalRemaining
  );
  const cartProductsFromTheStore = useSelector(
    (state) => state.POSSlice.products
  );


  // SELECT BOXES
  const customerOptions = tabs.map((data, index) => {
    return customersList.map((item) => ({
      value: item.customer_id,
      label: item.customer_name,
      tab_id: tabId
    }))
  });
  const paymentModes = tabs.map((data, index) => {
    return paymentModesList.map((item) => ({
      value: item.payment_id,
      label: item.payment_type,
      tab_id: tabId
    }));
  });

  const paymentTermModes = tabs.map((data, index) => {
    return paymentTermList.map((item) => ({
      value: item.payment_term_id,
      label: item.payment_term_type,
      tab_id: tabId
    }));
  });


  // POS DATA OBJECT

  const [customerType, setCustomerType] = useState(tabs.map((data, index) => {
    return {
      label: "Cash Sale",
      value: 1,
      tab_id: data.id
    }
  }));

  const [paymentType, setPaymentType] = useState(tabs.map((data, index) => {
    return {
      label: "Cash",
      value: 1,
      tab_id: data.id
    }
  }));
  const [paymentTerm, setPaymentTerm] = useState(tabs.map((data, index) => {
    return {
      label: "Cash",
      value: 1,
      tab_id: data.id
    }
  }));
  const [posData, setPosData] = useState({
    productPricre: [],
    PrimaryImformation: {
      master_payment_mode_id: null,
      master_payment_term: null,
      master_customer_id: 1,
      master_total_bill_amt: 1,
      master_bill_type: 1,
      tab_id: tabId,
      // master_invoice_no: 1,
      master_bill_date:(() => {
        const currentDate = new Date();
        const day = currentDate.getDate().toString().padStart(2, "0");
        const month = (currentDate.getMonth() + 1).toString().padStart(2, "0");
        const year = currentDate.getFullYear();
        const hours = currentDate.getHours();
        const minutes = currentDate.getMinutes();
        const ampm = hours >= 12 ? "PM" : "AM";
        const hours12 = hours % 12 || 12;
        return `${day}/${month}/${year} ${hours12}:${minutes.toString().padStart(2, "0")} ${ampm}`;
      })(),
      master_qty: 1,
    },
  });



  const [searchTerm, setSearchTerm] = useState("");
  const [value, setValue] = useState("");
  // GETTING CUSTOMERS LIST FROM API
  const { http } = AuthUser();

  const getcustomer = async () => {
    // fetching the customers
    const customersResponse = await http.get(
      "/customers/list"
    );
    setCustomersList(customersResponse.data);

    const paymentResponse = await http.get(
      "/payment_mode/list?page=1&limit=100"
    );
    setpaymentModesList(paymentResponse.data);
    const paymentTermResponse = await http.get(
      "/payment_term/list?page=1&limit=100"
    );
    setpaymentTermList(paymentTermResponse.data);
  };
  useEffect(() => {
    getDataForPOS();
  }, []);
  const getDataForPOS = async () => {
    // fetching the customers
    const customersResponse = await http.get(
      "/customers/list"
    );
    setCustomersList(customersResponse.data);
    const paymentResponse = await http.get(
      "/payment_mode/list?page=1&limit=100"
    );
    setpaymentModesList(paymentResponse.data);
    const paymentTermResponse = await http.get(
      "/payment_term/list?page=1&limit=100"
    );
    setpaymentTermList(paymentTermResponse.data);
    const firstCustomer = customersResponse.data[0];
    if (firstCustomer) {
      getCustomerDetails(firstCustomer.customer_id);
    }
    const firstPaymentMode = paymentResponse.data[0];
    const firstPaymentTerm = paymentTermResponse.data[0];
    if (firstCustomer && paymentResponse) {
      setDefaultCustomer({
        label: firstCustomer.customer_name,
        value: firstCustomer.customer_id,
      });
      setDefaultPaymentMode({
        label: firstPaymentMode.payment_type,
        value: firstPaymentMode.payment_id,
      });
      setDefaultPaymentTerm({
        label: firstPaymentTerm.payment_term_type,
        value: firstPaymentTerm.payment_term_id,
      });
      const updatedPrimaryInformation = {
        ...posData.PrimaryImformation,
        master_customer_id: firstCustomer.customer_id,
        master_payment_mode_id: firstPaymentMode.payment_id,
        master_payment_term: firstPaymentTerm.payment_term_id,
      };
      const updatedPosData = {
        ...posData,
        PrimaryImformation: updatedPrimaryInformation,
      };
      setPosData(updatedPosData);
    }
    try {
      const response = await http.get("/pos/bills/history");
      if (response.status == 401) {
        navigate("/unauthorized");
      }
      if (response.length === 0) return;
      setLastBillDetails(response.data[0]);
      const obj = JSON.parse(sessionStorage.getItem("authUser"));
      const newDataInvoice = response.data.map((POSBillDetails) => ({
        ...POSBillDetails,
        master_invoice_no: `${obj.invoiceDetails.intial_latter}-${POSBillDetails.master_invoice_no}`,
      }));
      setPosBillList(newDataInvoice.reverse());
    } catch (error) {
      if (error.response.status == 401) {
        navigate("/unauthorized");
      }
    }
  };

  const handleVisibility = () => {
    if (customerType.value !== 1) {
      dispatch(setVisibility(isVisible ? false : true));
    }
    if (!isVisible) {
      setEnteredBillAmount(totalPayable);
      // setRemaining()
    }
  };
  const updateTotalBillTypes = async (billAmount, paymentTerm) => {
    setTimeout(() => {
      setEnteredBillAmount(billAmount);
      dispatch(updatePayable({ billAmount: billAmount, paymentTerm: paymentTerm }));
    }, 500);
    // setRemaining(remainingFromStore)
  };

  const [Data_product, SetData_product] = useState([]);

  const [searchResults, setSearchResults] = useState(products);
  const [searchList, SetSearchList] = useState([]);
  const dispatch = useDispatch();
  const [Product_Model, SetProduct_Model] = useState([]);

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
  const [posBillLang, setposBillLang] = useState(1);
  const StoreDataPrice = (data) => {

    setProductIntoTheCart(data);
  };

  // SETTING THE PRODUCT INTO THE CART
  const setProductIntoTheCart = async (prices, update) => {

    let productDetails;
    if (Array.isArray(prices) && prices.length > 0) {
      productDetails = await getProductInfo(prices[0].product_tbl_id);
    } else {
      productDetails = await getProductInfo(prices.product_tbl_id);
    }
    const productMap = {
      product_id: productDetails.product_id,
      product_name: productDetails.product_english_name,
      marathi_name: productDetails.product_marathi_name,
      product_price_id: prices.product_price_id,
      qty: 1,
      mrp: prices.price_mrp,
      price_credit: prices.price_credit,
      salePrice: prices.price_sales,
      product_hsn_code: prices.price_barcode,
      totalPrice: prices.price_sales,
      tab_id: tabId
    };
    console.log("Product Add  ", cartProductsFromTheStore);
    const isProductAlreadyInCart = cartProductsFromTheStore.some(
      (cartProduct) => cartProduct.product_id === productDetails.product_id
    );
    if (isProductAlreadyInCart) {
      const existingProduct = cartProductsFromTheStore.find(
        (cartProduct) => cartProduct.product_id === productDetails.product_id && cartProduct.tab_id == tabId
      );



      if (existingProduct && existingProduct.tab_id == tabId) {
        const previousQuantity = existingProduct.qty;
        // const newQuantity = previousQuantity + 1;
        const newQuantity = previousQuantity + 1;
        setEnteredBillAmount(totalBillAMT);
        (update != 1 &&
          dispatch(
            increaseProductQuantity({
              tab_id: tabId,
              paymentTerm: paymentTerm.filter(item => item.tab_id == tabId)[0].label,
              product_id: productDetails.product_id,
              newQuantity,
            })
          ));
        if (Array.isArray(prices) && prices.length > 0) {
          productDetails = await getProductInfo(prices[0].product_tbl_id);

          dispatch(
            updateSingleProduct({
              product_id: productDetails.product_id,
              newSalePrice: prices[0].price_sales,
              newCreditPrice: prices[0].price_credit,
              paymentTerm: paymentTerm.filter(item => item.tab_id == tabId)[0].label
            })
          );
          dispatch(
            updateMRPPrice({
              product_id: productDetails.product_id,
              newMRPPrice: prices[0].price_mrp,
            })
          );
        } else {
          productDetails = await getProductInfo(prices.product_tbl_id);
          dispatch(
            updateSingleProduct({
              product_id: productDetails.product_id,
              newSalePrice: prices.price_sales,
              newCreditPrice: prices.price_credit,
              paymentTerm: paymentTerm.filter(item => item.tab_id == tabId)[0].label
            })
          );

          dispatch(
            updateMRPPrice({
              product_id: productDetails.product_id,
              newMRPPrice: prices.price_mrp,
            })
          );
        }
        if (paymentTerm.filter(item => item.tab_id == tabId)[0].label == "Cash") {
          dispatch(setTotalAmounts());
        } else {

          dispatch(setCreditTotalAmounts());
        }
      } else {
        console.log("Product Map: ", {
          ...productMap,
          tab_id: tabId
        });

        dispatch(addProductToStore([productMap]));
        dispatch(setTotalAmounts());
        setEnteredBillAmount(totalBillAMT);
      }
    } else {
      dispatch(addProductToStore([productMap]));
      dispatch(setTotalAmounts());
      setEnteredBillAmount(totalBillAMT);
    }
    setSearchTerm("");
  };

  // FETCHING SINGLE PRODUCT DETAILS
  const getProductInfo = async (productId) => {
    const response = await http.get(`/products/single-product/${productId}`);
    return response.data.productDetails;
  };

  const getProductByBarcode = async (barcode) => {
    const response = await http.get(
      `/product/information_barcode_onkeyup/${barcode}`
    );
    if (response.data.length === 0) {
      toast.error("Invalid Barcode");
      const audio = new Audio(invalidAudio);
      audio.play();
      return;
    }
    const audio = new Audio(validAudio);
    audio.play();
    return response.data;
  };

  const buttonsRef = useRef([]);
  const [focusedIndex, setFocusedIndex] = useState(0);
  // GETTING MULTIPLE PRODUCT PRICES

  const searchInputRef = useRef();

  const updateProductsInPosData = () => {
    setPosData((prevPosData) => ({
      ...prevPosData,
      productPricre: [cartProductsFromTheStore],
      PrimaryImformation: {
        ...prevPosData.PrimaryImformation,
        master_total_bill_amt: totalPayable,
      },
    }));
  };

  const saveBill = async () => {
    if (cartProductsFromTheStore.length === 0) {
      toast.error("You must add at least 1 product into the list");
      return;
    }

    // Update the posData first
    updateProductsInPosData();
    dispatch(setVisibility(false));

    // getting user details
    const data = sessionStorage.getItem("authUser");
    const jsonData = JSON.parse(data);
    // Use the latest posData for the API call
    const updatedPosData = {
      ...posData,
      productPricre: cartProductsFromTheStore.filter(item => item.tab_id == tabId),
      PrimaryImformation: {
        ...posData.PrimaryImformation,
        master_payment_mode_id: (paymentType && paymentType.filter(i => i.tab_id == tabId).length > 0) ? paymentType.filter(i => i.tab_id == tabId)[0].value : 1,
        master_payment_term: (paymentTerm && paymentTerm.filter(i => i.tab_id == tabId).length > 0) ? paymentTerm.filter(i => i.tab_id == tabId)[0].value : 1,
        master_customer_id: (customerType && customerType.filter(i => i.tab_id == tabId).length > 0) ? customerType.filter(i => i.tab_id == tabId)[0].value : 1,
        master_total_bill_amt: Math.round(totalBillAMT),
        master_qty: totalQty,
        master_total_bill_mrp: totalMRP,
        master_user_id: jsonData.user.user_id,
        master_paid_amount: totalPayable,
      },
    };

    try {
      setSaveButtonLoading(true);
      const resp = await http.post("/pos/store", {
        posData: updatedPosData,
      });
      toast.success("Bill added successfully");
      console.log("Removed Table Data ", tabId);

      dispatch(removeAllProducts({
        tab_id: tabId
      }));
      dispatch(setTotalAmounts());
      showInvoiceModel(
        resp.data.data.master_id,
        resp.data.data.master_customer_id
      );
      setCustomerType([...customerType.filter(item => item.tab_id != tabId), { label: "Cash Sale", value: 1, tab_id: tabId }]);
      setPaymentType([...paymentType.filter(item => item.tab_id != tabId), { label: "Cash", value: 1, tab_id: tabId }]);
      setPaymentTerm([...paymentTerm.filter(item => item.tab_id != tabId), { label: "Cash", value: 1, tab_id: tabId }]);
      getCustomerDetails(1);
      dispatch(setPrintingDialogState(true));
      const response = await http.get("/pos/bills/history");
      setLastBillDetails(response.data[0]);
      setTimeout(() => {
        handlePrint();

      }, 1000);
      setSaveButtonLoading(false);
      setManageCategory(0);
    } catch (error) {
      setSaveButtonLoading(false);
      // Handle error
    }
  };
  const [deleteModal, setDeleteModal] = useState(false);

  const handleDeleteOrder = (data) => {
    if (data._reactName == "onClick") {
      dispatch(removeAllProducts({
        tab_id: tabId
      }));
      dispatch(setTotalAmounts());
      setDeleteModal(false);
      toast.success("Remove Bill SuccessFully !!");
    }
  };
  const [posLanguage, setPosLanguage] = useState(1);
  const [showPrice, setShowPrice] = useState(1);
  const getDetails = async () => {
    const resp = await http.get("/billing-settings/details");
    setPosLanguage(resp.data.pos_bill_language);
    setposBillLang(resp.data.pos_bill_print_language);
    setShowPrice(resp.data.pos_bill_show_price);
  };
  const addTabRef = useRef(null);
  useEffect(() => {
    const lsValue = localStorage.getItem("bill_size");
    getDetails();
    if (lsValue != null || lsValue != undefined) {
      setSize(lsValue);
    } else {
      setSize(80);
    }
    const handleShortCut = (e) => {
      if (e.ctrlKey && e.key === "Enter") {
        // handlePrint(); hiii
        searchInputRef.current.focus();
      }


      if ((e.altKey && e.key == "c") || (e.altKey && e.key == "C")) {
        customerRef.current.focus();
      }
      if ((e.altKey && e.key == "t") || (e.altKey && e.key == "T")) {
        if (addTabRef.current) {
          addTabRef.current.click();
        }
      }

      if ((e.altKey && e.key === "p") || (e.altKey && e.key === "P")) {
        setProdcutModel(true);
      }
      if ((e.altKey && e.key === "a") || (e.altKey && e.key === "A")) {
        searchInputRef.current.focus();
      }
      const totalButtons = buttonsRef.current.length;
      if ((e.altKey && e.key === "s") || (e.altKey && e.key == "S")) {
        e.preventDefault(); // Prevent default browser behavior
        if (isModalOpen) {
          saveButtonRef.current.click();
        }
        // TODO: Handle the search functionality here
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
      // dispatch(removeAllProducts());
    };
  }, [dispatch, isModalOpen]);

  useEffect(() => {
    // Focus the button based on focusedIndex
    buttonsRef.current[focusedIndex]?.focus();
    buttonsRef.current.forEach((button, index) => {
      try {
        if (index === focusedIndex) {
          button.style.backgroundColor = "#E7EAE5";
          button.style.color = "";
        } else {
          button.style.backgroundColor = ""; // Reset other buttons' background color
        }
      } catch (error) {
        console.log(error);
      }
    });
  }, [focusedIndex]);

  document.title = "POS Create - Ajspire Technologies";

  const [modal_standard, setmodal_standard] = useState(false);
  const [modalForHistory, setModalForHistory] = useState(false);
  const [modalForPrint, setModalForPrint] = useState(false);

  const [posBillList, setPosBillList] = useState([]);
  const [companyDetails, setCompanyDetails] = useState({});
  // LAST 10 ENTRIES
  const showHistory = async () => {
    const response = await http.get("/pos/bills/history");
    if (response.status == 401) {
      navigate("/unauthorized");
    }
    if (response.length === 0) return;
    setLastBillDetails(response.data[0]);
    const obj = JSON.parse(sessionStorage.getItem("authUser"));
    const newDataInvoice = response.data.map((POSBillDetails) => ({
      ...POSBillDetails,
      master_invoice_no: `${obj.invoiceDetails.intial_latter}-${POSBillDetails.master_invoice_no}`,
    }));
    setPosBillList(newDataInvoice.reverse());
    setModalForHistory(!modalForHistory);
  };
  const [masterDetails, setMasterDetails] = useState({});
  const [productsList, setproductsList] = useState([]);
  const [customerDetails, setCustomerDetails] = useState({});

  const [formattedTime, setFormattedTime] = useState(null);
  const [paymentModeDetails, setPaymentModeDetails] = useState({});

  // GETTING CUSTOMER DETAILS
  const getCustomerDetails = async (customerID) => {
    try {
      if (customerID) {
        const customer = await http.get(`/customers/show/${customerID}`);
        setCurrentCustomerDetails(customer.data);
      }
    } catch (error) {
      console.log(`Error is ${error}`);
    }
  };
  const [userDetails, setUserDetails] = useState({});

  const showInvoiceModel = async (masterID, customer) => {
    const companyDetailsResponse = await http.get("/business_index");
    setCompanyDetails(companyDetailsResponse.data[0]);
    const productsDetails = await http.get(`/pos/get/${masterID}`);
    console.log("Hello", productsDetails.data);

    setproductsList(productsDetails.data);
    const billMaster = await http.get(`/pos/bills/single/${masterID}`);
    const details = billMaster.data[0];
    const paymentMode = await http.get(`/payment_mode/show/${details.master_payment_mode_id}`);
    const obj = JSON.parse(sessionStorage.getItem("authUser"));
    setUserDetails(obj.user);
    setPaymentModeDetails(paymentMode);
    setMasterDetails({
      ...details,
      master_invoice_no: `${obj.invoiceDetails.intial_latter}-${details.master_invoice_no}`,
    });

    // Convert updatedAt to IST
    const utcDate = new Date(billMaster.data[0].updatedAt);

    // Calculate IST (UTC + 5:30)
    const istDate = new Date(utcDate.getTime() + (5.5 * 60 * 60 * 1000));

    // Format the IST date
    const options = { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', hour12: true };
    const formattedISTTime = istDate.toLocaleString('en-IN', options);

    setFormattedTime(formattedISTTime); // Set the formatted time

    const customerData = await http.get(`/customers/show/${customer}`);
    setCustomerDetails(customerData.data);
    setModalForPrint(!modalForPrint);
  };

  const handlePrint = () => {
    const lsValue = localStorage.getItem("bill_size");
    const top = localStorage.getItem("marginTop");
    const bottom = localStorage.getItem("marginBottom");
    const left = localStorage.getItem("marginLeft");
    const right = localStorage.getItem("marginRight");
    const printableArea = document.getElementById("printable-area");
    const clonedContent = printableArea.cloneNode(true);
    const printFrame = document.createElement("iframe");
    printFrame.style.display = "none";
    document.body.appendChild(printFrame);

    printFrame.onload = () => {
      const printDocument =
        printFrame.contentDocument || printFrame.contentWindow.document;

      // Add a <style> element to the printDocument to remove margins and padding
      const style = document.createElement("style");
      style.textContent = `
        @page {
          margin-top: ${top};
          margin-left: ${left};
          margin-right: ${right};
          margin-bottom: ${bottom};
        }
        body {
          font-family: 'Your Font Family', sans-serif; /* Replace 'Your Font Family' with the desired font family name */
        }
      `;
      printDocument.head.appendChild(style);

      printDocument.body.appendChild(clonedContent);
      printFrame.contentWindow.print();

      // Add event listener for when printing is finished
      if ('onafterprint' in printFrame.contentWindow) {
        printFrame.contentWindow.onafterprint = () => {
          // Refresh the page after printing is finished
          navigate(`/pos/create/${tabId}`);
        };
      } else {
        // For browsers that don't support onafterprint event
        setTimeout(() => {
          navigate(`/pos/create/${tabId}`);
        }, 1000); // Refresh after a delay (adjust time as needed)
      }
    };

    printFrame.src = "about:blank";
    setModalForPrint(false);
  };



  // Prodcut edit
  const [UpdatemodalStates, setUpdateModalStates] = useState(false);
  const [FindData, SetFind] = useState([]);
  const ProdcutEdit = (data) => {
    setIsModalOpen(false);
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

  const renderMenuItemChildren = (option, props, index) => (

    <div key={option.id}>
      <div key={index + 1}>
        <strong>
          {" "}
          {posLanguage === 1 ? (
            option.product_marathi_name
          ) : posLanguage === 2 ? (
            option.product_english_name
          ) : (
            <>
              {option.product_english_name}/ {option.product_marathi_name}
            </>
          )}
          {showPrice == 1 ? (" / " + option.price_mrp) : showPrice == 2 ? " / " + option.price_sales : (" / " + option.price_mrp + " / " + option.price_sales)}
        </strong>
      </div>
    </div>
  );

  const loadCustomerOptions = async (inputValue) => {
    try {
      // Await the result from the API call
      const response = await http.get(`/customers/search?q=${inputValue}`);

      // Log the response to debug
      console.log(response.data);

      // Map the data to the structure expected by react-select and return it
      return response.data.map(customer => ({
        value: customer.customer_id,
        label: customer.customer_name, // Use customer name as the label
      }));

    } catch (error) {
      console.error("Error fetching customer options:", error);
      return []; // Return an empty array in case of error
    }
  };


  return (
    <React.Fragment>
      <ToastContainer />
      <Confirmation
        show={deleteModal}
        onDeleteClick={handleDeleteOrder}
        onCloseClick={() => setDeleteModal(false)}
      ></Confirmation>
      <Modal
        id="myModals"
        isOpen={modalForPrint}
        size="sm"
        toggle={() => {
          setModalForPrint(!modalForPrint);
        }}
      >
        <ModalBody style={{ margin: "0", padding: "0" }}>
          <div className="" id="printable-area">
            <div
              className=""
              id="section-to-print"
              style={{ width: size + "mm" }}
            >
              <div style={{ textAlign: "center" }}>
                <span style={{ fontWeight: billingSettings.business_name_weight, fontSize: `${billingSettings.business_name_size}px` }}>
                  {companyDetails ? companyDetails.business_name : ""}
                </span>
                <br />
                <span style={{ fontWeight: billingSettings.address_weight, fontSize: `${billingSettings.address_size}px` }}>
                  {companyDetails
                    ? companyDetails.business_billing_address
                    : ""}
                  <br />
                  <span style={{ fontWeight: billingSettings.mobile_weight, fontSize: `${billingSettings.mobile_size}px` }}>
                    Mob No:
                    {companyDetails
                      ? companyDetails.business_company_phone_no
                      : ""}</span>
                  <br />
                  {companyDetails && companyDetails.business_gst_no && (
                    <div>GST NO. {companyDetails.business_gst_no}</div>
                  )}
                </span>
              </div>
              <div>
                <div style={{ borderBottom: "1px solid black" }}></div>
                <div style={{display:"flex",justifyContent:"space-between"}}>
                  <b style={{ fontSize: "12px" }}>
                    Bill No. &nbsp;&nbsp;
                    {masterDetails ? masterDetails.master_invoice_no : ""}{" "}
                    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                  </b>
                  <b style={{ fontSize: "12px", marginLeft: "1px" }}>
 
                    {masterDetails ? masterDetails.master_bill_date : ""}  
                  </b>
                </div>
                {/* <div style={{ margin: "2px 0px" }}>
                  <b style={{ fontSize: "12px" }}>
                    Bill Type: Cash
                  </b>
                  <b
                    className=""
                    style={{ fontSize: "12px", marginLeft: "25px" }}
                  >
                    Operator: {userDetails.full_name}
                  </b>
                </div> */}
                <div>
                  <b className="ml-3" style={{ fontSize: "12px" }}>
                    Bill To :{" "}
                    {customerDetails ? customerDetails.customer_name : ""}{" "}
                  </b>
                  <div style={{ borderBottom: "1px dashed black" }}></div>
                </div>
              </div>
              <table style={{ textAlign: "left", width: size + "mm" }}>
                <thead>
                  <tr>
                    <th
                      style={{
                        fontSize: "12px",
                        borderBottom: "1px dashed black",
                      }}
                    >
                      #
                    </th>
                    <th
                      style={{
                        fontSize: "12px",
                        borderBottom: "1px dashed black",
                      }}
                    >
                      Product Name
                    </th>
                    <th
                      style={{
                        fontSize: "12px",
                        borderBottom: "1px dashed black",
                      }}
                    >
                      Qty
                    </th>
                    {billingSettings.mrp_status == 1 &&<th
                      style={{
                        fontSize: "12px",
                        borderBottom: "1px dashed black",
                      }}
                    >
                      MRP{" "}
                    </th>}
                    <th
                      style={{
                        fontSize: "12px",
                        borderBottom: "1px dashed black",
                      }}
                    >
                      Rate
                    </th>
                    <th
                      style={{
                        fontSize: "12px",
                        borderBottom: "1px dashed black",
                      }}
                    >
                      Total
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {productsList.map((product, index) => (
                    <tr
                      key={index}
                      style={{ fontSize: "13px", fontWeight: "normal" }}
                    >
                      <td style={{ textAlign: "left", fontWeight: billingSettings.product_name_weight, fontSize: `${billingSettings.product_name_size}px` }}>{index + 1}</td>
                      <td style={{ textAlign: "left", fontWeight: billingSettings.product_name_weight, fontSize: `${billingSettings.product_name_size}px` }}>
                        {posBillLang === 1 ? (
                          (product.product_marathi_name || "").substring(0, `${parseInt(billingSettings.marathi_name_length)}`)
                        ) : posBillLang === 2 ? (
                          (product.product_english_name || "").substring(0, `${parseInt(billingSettings.english_name_length)}`)
                        ) : (
                          <>
                            {(product.product_english_name || "").substring(
                              0,
                              `${parseInt(billingSettings.english_name_length)}`
                            )}
                            /{" "}
                            {(product.product_marathi_name || "").substring(
                              0,
                              `${parseInt(billingSettings.marathi_name_length)}`
                            )}
                          </>
                        )}
                      </td>
                      <td style={{ textAlign: "right", fontWeight: billingSettings.all_amount_weight, fontSize: `${billingSettings.all_amount_size}px` }}>
                        {Number.isInteger(product.pos_qty)
                          ? product.pos_qty.toFixed(0)
                          : product.pos_qty.toFixed(2)}
                      </td>
                      {billingSettings.mrp_status == 1 &&<td style={{ textAlign: "right", fontWeight: billingSettings.all_amount_weight, fontSize: `${billingSettings.all_amount_size}px` }}>
                        {Number.isInteger(product.pos_mrp)
                          ? product.pos_mrp.toFixed(0)
                          : product.pos_mrp.toFixed(2)}
                      </td>}
                      <td style={{ textAlign: "right", fontWeight: billingSettings.all_amount_weight, fontSize: `${billingSettings.all_amount_size}px` }}>
                        {product.master_payment_term == 1 ?
                          (Number.isInteger(product.pos_salePrice)
                            ? product.pos_salePrice.toFixed(0)
                            : product.pos_salePrice.toFixed(2))
                          :
                          (Number.isInteger(product.pos_price_credit)
                            ? product.pos_price_credit.toFixed(0)
                            : product.pos_price_credit.toFixed(2))
                        }

                      </td>
                      <td style={{ textAlign: "right", fontWeight: billingSettings.all_amount_weight, fontSize: `${billingSettings.all_amount_size}px` }}>
                        {product.master_payment_term == 1 ?
                          Number.isInteger(
                            product.pos_salePrice * product.pos_qty
                          )
                            ? (product.pos_salePrice * product.pos_qty).toFixed(0)
                            : (product.pos_salePrice * product.pos_qty).toFixed(
                              2
                            ) : Number.isInteger(
                              product.pos_price_credit * product.pos_qty
                            )
                            ? (product.pos_price_credit * product.pos_qty).toFixed(0)
                            : (product.pos_price_credit * product.pos_qty).toFixed(
                              2
                            )}




                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div>
                <div
                  style={{
                    marginTop: "2px",
                  }}
                ></div>
              </div>

              <div>
                <div style={{ borderBottom: "1px dashed black" }}></div>
                <div
                  style={{ display: "flex", justifyContent: "space-around" }}
                >
                  <p
                    style={{
                      fontWeight: billingSettings.total_qty_weight, fontSize: `${billingSettings.total_qty_size}px`,
                      marginTop: "0px",
                    }}
                  >
                    <span style={{ fontWeight: billingSettings.total_qty_weight, fontSize: `${billingSettings.total_qty_size}px` }}> Total Qty: </span>
                    <b style={{ fontWeight: billingSettings.total_qty_weight, fontSize: `${billingSettings.total_qty_size}px` }}>
                      <span style={{ fontWeight: billingSettings.total_qty_weight, fontSize: `${parseInt(billingSettings.total_qty_size) + 5}px` }}>
                        {" "}
                        : {masterDetails.master_qty}
                      </span>
                    </b>
                  </p>
                  <p
                    style={{
                      fontSize: "8px",
                      marginTop: "0px",
                      fontWeight: "bold",
                    }}
                  >
                    <span style={{ fontWeight: billingSettings.total_bill_weight, fontSize: `${billingSettings.total_bill_size}px` }}> Total Bill : </span>
                    <b>
                      <span style={{ fontWeight: billingSettings.total_bill_weight, fontSize: `${parseInt(billingSettings.total_bill_size) + 5}px` }}>
                        {" "}
                        &#8377;.{" "}
                        {Math.round(masterDetails.master_total_bill_amt)}
                      </span>
                    </b>
                  </p>
                </div>

                <div>
                  <div
                    style={{
                      borderBottom: "1px solid black",
                      marginTop: "-5px",
                    }}
                  ></div>

                  {billingSettings.discount_total_status == 1 && <div
                    style={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <p
                      style={{
                        fontSize: "8px",
                        marginTop: "0px",
                        fontWeight: "bold",
                      }}
                    >
                      <span style={{ fontWeight: billingSettings.saving_amount_weight, fontSize: `${parseInt(billingSettings.saving_amount_size)}px` }}>आपली बचत : </span>

                      <b>
                        <span style={{ fontWeight: billingSettings.saving_amount_weight, fontSize: `${parseInt(billingSettings.saving_amount_size) + 5}px` }}>
                          {" "}
                          &#8377;.{" "}
                          {masterDetails.master_total_bill_mrp -
                            masterDetails.master_total_bill_amt}
                        </span>
                      </b>
                    </p>
                  </div>}
                </div>
                {companyDetails.business_qr_code != undefined && companyDetails.business_qr_code !== null && (
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-around",
                      marginTop: "10px",
                    }}
                  >
                    <span style={{ fontWeight: "bold", fontSize: "12px" }}>
                      ऑनलाइन पेमेंट साठी <br /> स्कॅन करा.
                    </span>
                    <div>
                      <div>
                        {companyDetails.business_qr_code && <img
                          src={`${IMG_API_URL}/business_images/${companyDetails.business_qr_code}`}
                          alt="Business QR"
                          style={{ height: "150px", width: "150px" }}
                        />}
                      </div>
                    </div>
                  </div>
                )}

                <span style={{ fontWeight: "bold", fontSize: "12px" }}>
                  {companyDetails
                    ? companyDetails.business_terms_conditions
                    : ""}
                </span>
                <span
                  style={{
                    fontWeight: "bold",
                    fontSize: "17px",
                    marginLeft: "69px",
                  }}
                >
                  धन्यवाद परत भेट द्या.
                </span>
                <br />
                <span
                  style={{
                    fontWeight: "bold",
                    fontSize: "12px",
                    marginTop: "5px",
                  }}
                >
                  Software by BillerPOS, Baramati
                </span>
              </div>
            </div>
          </div>
        </ModalBody>
        <ModalFooter>
          <Button
            color="primary"
            size="sm"
            onClick={() => {
              handlePrint();
              dispatch(setPrintingDialogState(false));
            }}
          >
            Print
          </Button>
          <Button
            size="sm"
            color="danger"
            onClick={() => {
              setModalForPrint(!modalForPrint);
            }}
          >
            Close
          </Button>
        </ModalFooter>
      </Modal>
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
              {multiplePrices.map((price, index) => (
                <tr
                  key={index}
                  onClick={(e) => {
                    setProductIntoTheCart(price);
                    setmodal_standard(!modal_standard);
                    setFocusedIndex(null);
                  }}
                  ref={(el) => {
                    buttonsRef.current[index] = el;
                  }}
                  style={focusedIndex == index ? { backgroundColor: "#E7EAE5" } : { backgroundColor: "white" }}
                >
                  <td>{index + 1}</td>
                  <td> {" "}
                    {price.product_english_name ??
                      currentMultipleProductDetails}
                  </td>
                  <td>&#8377; {price.price_mrp}</td>
                  <td>&#8377; {price.price_purchase}</td>
                  <td>&#8377; {price.price_sales}</td>
                  <td>&#8377; {price.price_credit}</td>
                </tr>
              ))}
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
      <Modal
        id="myModals"
        isOpen={modalForHistory}
        size="xl"
        toggle={() => {
          setModalForHistory(!modalForHistory);
        }}
      >
        <ModalBody>
          <h5 className="fs-15">Last POS Bills</h5>
          <table
            role="table"
            className="align-middle table-nowrap table table-hover"
          >
            <thead className="table-light text-muted text-uppercase">
              <tr>
                <th title="Toggle SortBy" style={{ cursor: "pointer" }}>
                  Sr.No
                </th>
                <th title="Toggle SortBy" style={{ cursor: "pointer" }}>
                  INV No.
                </th>
                <th title="Toggle SortBy" style={{ cursor: "pointer" }}>
                  Customer Name
                </th>
                <th title="Toggle SortBy" style={{ cursor: "pointer" }}>
                  Bill Date
                </th>

                <th title="Toggle SortBy" style={{ cursor: "pointer" }}>
                  Qty
                </th>
                <th title="Toggle SortBy" style={{ cursor: "pointer" }}>
                  Grand Total
                </th>
                <th title="Toggle SortBy" style={{ cursor: "pointer" }}>
                  Payment Mode
                </th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {posBillList.map((item, index) => (
                <tr key={index}>
                  <td>
                    <a
                      className="fw-medium link-primary"
                      href="/apps-ecommerce-order-details"
                    >
                      {index + 1}
                    </a>
                  </td>
                  <td>{item.master_invoice_no}</td>
                  <td>{item.customer_name}</td>
                  <td>{item.master_bill_date}</td>
                  <td>{item.master_qty}</td>
                  <td>&#8377; {item.master_total_bill_amt}</td>
                  <td>{item.payment_type}</td>
                  <td>
                    <ul className="list-inline hstack gap-2 mb-0">
                      <li className="list-inline-item">
                        <button
                          onClick={() => {
                            showInvoiceModel(
                              item.master_id,
                              item.master_customer_id
                            );
                          }}
                          className="text-primary d-inline-block btn btn-sm"
                        >
                          <i className="ri-eye-fill fs-16"></i>
                        </button>
                      </li>
                      <li className="list-inline-item edit">
                        <Link
                          to={{
                            pathname: `/pos-bill-edit/${item.master_id}/${item.master_customer_id}/${item.master_payment_mode_id}`,
                          }}
                          className="text-primary d-inline-block edit-item-btn btn btn-sm"
                        >
                          <i className="ri-pencil-fill fs-16"></i>
                        </Link>
                      </li>
                    </ul>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </ModalBody>
        <ModalFooter>
          <Button
            color="danger"
            onClick={() => {
              setModalForHistory(!modalForHistory);
            }}
          >
            Close
          </Button>
        </ModalFooter>
      </Modal>
      {/* <Navbar className="mb-0 shadow">
        <div className="btn ">POS</div>
       
        <div className="float-right">
          <Link
            to={"/dashboard"}
            className="text-white"
            onClick={() => {
              dispatch(removeAllProducts());
              dispatch(setTotalAmounts());
            }}
          >
            <Button color="danger" className="btn-label rounded-pill">
              <i className="ri-user-smile-line label-icon align-middle fs-16 me-2"></i>
              Dashboard
            </Button>
          </Link>
          <Link
            to={"/pos/list"}
            className="text-white"
            onClick={() => {
              dispatch(removeAllProducts());
              dispatch(setTotalAmounts());
            }}
          >
            <Button color="primary" className="ml-2 btn-label rounded-pill">
              <i className="ri-user-smile-line label-icon align-middle fs-16 me-2"></i>
              POS Bills List
            </Button>
          </Link>
        </div>
      </Navbar> */}

      <Navbar className="mb-0 shadow">
        <Nav className="arrow-navtabs nav-tabs-custom  pb-0">
          {tabs.map((tab, index) => (
            <NavItem className="nav nav-pills bg-primary  mb-3 m-1" key={index}>
              <NavLink
                className={classnames({ active: activeTab == tab.id })}

              >
                <div className="d-flex text-white justify-content-between">
                  <div className="" onClick={() => {
                    toggleTab(tab.id);
                  }}
                    style={{ cursor: "pointer" }}
                  >
                    {tab.title}
                  </div>
                  {index != 0 &&
                    <div onClick={() => {
                      removeTab(index);
                    }} className="float-right mx-2 " style={{ cursor: "grabbing" }} >X</div>}

                </div>
              </NavLink>
            </NavItem>
          ))}
          <NavItem>
            <button ref={addTabRef} onClick={addTab} className="btn add-tab">
              <div style={{ fontSize: "20px" }} className="  rounded-circle fw-bold" >+</div>
            </button>
          </NavItem>

        </Nav>
        {/* <ModalBody>
          <TabContent activeTab={activeTab}>
            <TabPane tabId="1">
              <Row>
                Bye
              </Row>
            </TabPane>
            <TabPane tabId="2">
              <Row>
                Hello
              </Row>
            </TabPane>
          </TabContent>
        </ModalBody> */}
        <div className="float-right">
          <Link
            to={"/dashboard"}
            className="text-white"
            onClick={() => {
              dispatch(removeAllProducts({
                tab_id: 0
              }));
              dispatch(setTotalAmounts());
            }}
          >
            <Button color="danger" className="btn-label rounded-pill">
              <i className="ri-user-smile-line label-icon align-middle fs-16 me-2"></i>
              Dashboard
            </Button>
          </Link>
          <Link
            to={"/pos/list"}
            className="text-white"
            onClick={() => {
              dispatch(removeAllProducts({
                tab_id: 0
              }));
              dispatch(setTotalAmounts());
            }}
          >
            <Button color="primary" className="ml-2 btn-label rounded-pill">
              <i className="ri-user-smile-line label-icon align-middle fs-16 me-2"></i>
              POS Bills List
            </Button>
          </Link>
        </div>
      </Navbar>
      <div className="page-content" id="hide_scroll">
        <Container fluid>

          <Row>
            <Col lg={9} style={{ marginTop: "-80px" }}>
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
                  <TabContent activeTab={activeTab}>
                    {tabs.map((tab, index) => (
                      <TabPane tabId={tab.id} key={index}>
                        <Row>
                          <Col sm={12} className="mt-2">
                            <ScrollToBottom className="scroll-containers">
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
                                      Qty
                                    </th>
                                    <th scope="col">MRP</th>
                                    <th scope="col">{((paymentTerm.length > 0 && paymentTerm.filter((item) => item.tab_id == tab_id).length > 0) && paymentTerm.filter((item) => item.tab_id == tab_id)[0].label == "Cash") ? "Sale Price" : "Credit Price"} </th>
                                    <th scope="col">Total</th>
                                    <th scope="col">Action</th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {cartProductsFromTheStore.filter((item) => item.tab_id == tab_id).map((item, index) => (
                                    <POSProductRow
                                      paymentTerm={paymentTerm.filter((item) => item.tab_id == tab_id)[0].label}
                                      // key={item.product_id}
                                      tabId={tabId}
                                      key={index}
                                      product={item}
                                      index={index}
                                      getindex={ProdcutEdit}
                                    />
                                  ))}
                                </tbody>
                              </Table>
                            </ScrollToBottom>
                          </Col>
                        </Row>
                      </TabPane>
                    ))}
                  </TabContent>
                </CardBody>
              </Card>
            </Col>
            <Col lg={3} style={{ marginTop: "-80px" }}>
              <Card className="fs-6 mb-2">
                <CardBody className="pt-2 pb-1">
                  <div className="d-flex justify-content-between">
                    <h5 className="fw-bold">Customer Details</h5>
                    <button
                      type="button"
                      className="btn btn-primary btn-sm"
                      id="create-btn"
                      onClick={() => {
                        Set_C_model(true);
                        setIsModalOpen(false);
                      }}
                    >
                      <i className="ri-add-line align-bottom me-1"></i>
                    </button>
                  </div>

                  {customerOptions.length === 0 ? (
                    ""
                  ) : (
                    <div className="form-icon right">
                      <div onKeyUp={(e) => console.log(e)}>
                        {tabs.map((item, index) => {
                          return item.id == tabId ? (
                            <AsyncSelect
                              ref={customerRef}
                              cacheOptions
                              loadOptions={loadCustomerOptions} // function to fetch filtered options based on input
                              defaultOptions={customerOptions[index]} // default options for the current tab
                              placeholder="Cash Sale"
                              name="group_type"
                              id="group_type"
                              className="fw-bold"
                              style={{ backgroundColor: "rgb(248 245 224)" }}

                              // Set the current value based on the selected customer type for the active tab
                              value={customerType.filter(i => i.tab_id == tabId)[0]}

                              onChange={(selectedOption) => {
                                // Manage state updates per tab when the customer type changes
                                setCustomerType([
                                  ...customerType.filter(item => item.tab_id != tabId), // Remove the previous entry for the current tab
                                  { tab_id: tabId, ...selectedOption }, // Add the new selection for the current tab
                                ]);

                                // Fetch customer details based on the selected option's value
                                getCustomerDetails(selectedOption.value);
                              }}
                            />
                          ) : "";
                        })}
                      </div>
                      <div style={{ marginTop: "10px" }}>
                        {/* <label htmlFor="">
                          <b className="fw-bold">Customer Name :</b>{" "}
                          {currentCustomerDetails.customer_name ?? "No Data"}
                        </label> 
                        <br />*/}
                        <label htmlFor="">
                          <b className="fw-bold">Mobile No :</b>{" "}
                          {currentCustomerDetails.customer_mobile ?? ""}
                        </label>
                        <br />

                        <label htmlFor="">
                          <b
                            className="fw-bold"
                            style={{ marginTop: "-20px !important" }}
                          >
                            Address :
                          </b>{" "}
                          {currentCustomerDetails.customer_billing_address ??
                            ""}{" "}
                        </label>
                        <br />
                        <label htmlFor="">
                          <b className="fw-bold">Credit Amt :</b>{" "}
                          {currentCustomerDetails.customer_credit_amount ??
                            "0"}
                        </label>
                      </div>
                    </div>
                  )}
                  <h6 className="fw-bold">Payment Term</h6>
                  {tabs.map((item, index) => {
                    return item.id == tabId ? (
                      <Select
                        options={paymentTermModes[index]}
                        style={{ width: "200px" }}
                        name="group_type"
                        id="group_type"
                        className="fw-bold"
                        value={paymentTerm.filter(i => i.tab_id == tabId)[0]}
                        onChange={(selectedOption) => {
                          if (selectedOption.label === "Credit") {
                            dispatch(setCreditTotalAmounts());
                            dispatch(setTotalPayable(0));
                            updateTotalBillTypes(0, selectedOption.label);
                          } else {
                            dispatch(setTotalAmounts());
                          }
                          setPaymentTerm([...paymentTerm.filter(item => item.tab_id != tabId), selectedOption]);
                        }}
                      />
                    ) : null
                  })}
                  <div className="d-flex justify-content-between">
                    <div className="d-flex align-items-center">
                      {isVisible ? (
                        <Input
                          onClick={handleVisibility}
                          style={{ width: "70px" }}
                          placeholder="Enter Amount"
                          className="mt-1"
                          autoFocus={true}
                          onChange={(e) => updateTotalBillTypes(e.target.value, paymentTerm.filter(item => item.tab_id == tabId)[0].label)}
                          value={enteredBillAmount}
                        />
                      ) : (
                        <p className="fs-5 mt-2" onClick={handleVisibility}>
                          Rs. {totalPayable}
                        </p>
                      )}
                    </div>
                    <div className="ms-3">
                      <div className="d-flex justify-content-between">
                        <p className="mt-2 pt-1" onClick={handleVisibility}>
                          {" "}
                          Remaining Amt: Rs. {remainingFromStore}
                        </p>
                      </div>
                    </div>
                  </div>
                  <h6 className="fw-bold">Bill Date</h6>
                  <Flatpickr
                    className="form-control"
                    options={{
                      dateFormat: "d/m/Y",
                      defaultDate: "today",
                    }}
                    onChange={(selectedDates) => {
                      const selectedDate = selectedDates[0];

                      // Format the date as DD/MM/YYYY
                      const day = selectedDate.getDate().toString().padStart(2, "0");
                      const month = (selectedDate.getMonth() + 1).toString().padStart(2, "0");
                      const year = selectedDate.getFullYear();

                      // Extract hours and minutes
                      const hours = selectedDate.getHours();
                      const minutes = selectedDate.getMinutes();

                      // Convert to 12-hour format and AM/PM
                      const ampm = hours >= 12 ? "PM" : "AM";
                      const hours12 = hours % 12 || 12; // Adjust for 12-hour format
                      const formattedTime = `${hours12}:${minutes.toString().padStart(2, "0")} ${ampm}`;

                      // Combine date and time
                      const formattedDateTime = `${day}/${month}/${year} ${formattedTime}`;

                      const updatedPrimaryInformation = {
                        ...posData.PrimaryImformation,
                        master_bill_date: formattedDateTime, // Update with formatted date and time
                      };

                      const updatedPosData = {
                        ...posData,
                        PrimaryImformation: updatedPrimaryInformation,
                      };

                      setPosData(updatedPosData);

                    }}
                  />
                  <br />
                  {/* </CardBody>
              </Card>
              <Card className="fs-6 mb-2 pb-0">
                <CardBody className="pt-2 pb-0"> */}

                  <h6 className="mb-2 fw-bold" onClick={handleVisibility}>
                    Payment Details
                  </h6>
                  {tabs.map((item, index) => {
                    return item.id == tabId ? (
                      <Select
                        options={paymentModes[index]}
                        style={{ width: "200px" }}
                        name="group_type"
                        id="group_type"
                        className="fw-bold"
                        value={paymentType.filter(i => i.tab_id == tabId)[0]}
                        // placeholder={defaultPaymentTerm.label}
                        onChange={(selectedOption) => {
                          setPaymentType([...paymentType.filter(item => item.tab_id != tabId), selectedOption]);
                        }}
                      />
                    ) : null
                  })}


                </CardBody>
              </Card>
              <Card className="fs-6 mb-2">
                <CardBody className="pt-2">
                  <h5 className="mb-2 fw-bold">Bill Details</h5>
                  <table className="table table-borderless mb-0 fw-bold table-sm">
                    <tbody>
                      <tr className="table-active bg-danger text-white">
                        <th style={{ lineHeight: "410%" }}>Total Amount:</th>
                        <td className="text-end">
                          <span className="fw-semibold" id="cart-total">
                            <h4 className="fw-bold display-6 text-white pr-2">
                              &#8377; {Math.round(totalBillAMT)}
                            </h4>
                          </span>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </CardBody>
              </Card>
              <Card>
                <CardBody className="d-flex justify-content-around">
                  {saveButtonLoading ? (
                    <Spinner animation="border" role="status">
                      <span className="visually-hidden">Loading...</span>
                    </Spinner>
                  ) : (
                    <button
                      className="btn btn-primary"
                      ref={saveButtonRef}
                      onClick={saveBill}
                    >
                      Save Bill
                    </button>
                  )}
                  <button
                    className="btn btn-success"
                    onClick={() => {
                      dispatch(removeAllProducts({
                        tab_id: tabId
                      }));
                      dispatch(setTotalAmounts());
                      searchInputRef.current.focus();
                    }}
                  >
                    Clear
                  </button>
                </CardBody>
              </Card>
            </Col>
          </Row>




          <div className="container-fluid fixed-bottom fs-5">
            <Row>
              <Col sm={1} className="bg-primary text-white fw-bold pt-2">
                <button
                  className="btn btn-light"
                  onClick={() => {
                    showHistory();
                  }}
                >
                  History
                </button>
              </Col>
              <Col
                sm={3}
                className="bg-dark text-white fw-bold p-3 text-center "
              >
                Last Bill :{" "}
                {lastBillDetails === undefined || lastBillDetails === null
                  ? "-"
                  : lastBillDetails.master_invoice_no}{" "}
                | Amt : &#8377;{" "}
                {lastBillDetails === undefined
                  ? "-"
                  : lastBillDetails.master_total_bill_amt}
                &nbsp; | &nbsp;&nbsp;
                <WhatsAppButton
                  billDetails={lastBillDetails ? lastBillDetails : []}
                  color="white"
                />
              </Col>
              <Col sm={2} className="bg-info text-white fw-bold p-3">
                Total Qty : {totalQty}
              </Col>
              <Col sm={2} className="bg-primary text-white fw-bold p-3">
                Total MRP : &#8377; {totalMRP.toFixed(2)}
              </Col>
              <Col sm={2} className="bg-secondary text-white fw-bold p-3">
                Total Dis : &#8377;{" "}
                {(Number(totalMRP) - Number(totalSale)).toFixed(2)}
              </Col>
              <Col sm={2} className="bg-success text-white fw-bold p-3">
                Total Bill : &#8377; {Math.round(totalSale)}
              </Col>
            </Row>
          </div>
        </Container>
      </div>
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
      {UpdatemodalStates === true ? (
        <ProductUpdate
          modalStates={UpdatemodalStates}
          setModalStates={() => {
            setUpdateModalStates(false);
            setIsModalOpen(true);
          }}
          checkchang={handleCallback}
          edit_data={FindData}
        />
      ) : (
        ""
      )}
      {C_model === true ? (
        <CustomerAdd
          modalStates={C_model}
          setModalStates={() => {
            Set_C_model(false);
            setIsModalOpen(true);
          }}
          checkchang={handleCallback}
        />
      ) : (
        ""
      )}
    </React.Fragment>
  );
};

export default POSCreate;
