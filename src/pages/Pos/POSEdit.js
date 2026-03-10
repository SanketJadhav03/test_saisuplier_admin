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
  Spinner,
  Table,
} from "reactstrap";
import POSProductRow from "./components/POSProductRow";
import {
  Link,
  json,
  useLocation,
  useNavigate,
  useParams,
} from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import AuthUser from "../../helpers/Authuser";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer, toast } from "react-toastify";
import invalidAudio from "../../assets/audio/error.ogg";
import validAudio from "../../assets/audio/audio_sucess.mp3";
import {
  addMassAssignment,
  addProductToStore,
  increaseProductQuantity,
  makeLastProductEditable,
  setCreditTotalAmounts,
  setTotalAmounts,
  setTotalPayable,
  setTotalRemaining,
  setVisibility,
  updatePayable,
} from "../../store/pos/POSSlice";
import Select from "react-select";
import { useCallback } from "react";
import ProductAdd from "../Products/ProductAdd";
import Flatpickr from "react-flatpickr";
import { removeAllProducts } from "../../store/pos/POSSlice";
import { AsyncTypeahead } from "react-bootstrap-typeahead";
import ProductUpdate from "../Products/ProductUpdate";
import CustomerAdd from "../Customers/CustomerAdd";
import { IMG_API_URL } from "../../helpers/url_helper";
import ScrollToBottom from "react-scroll-to-bottom";
import "../purchase/autoscroll.css";
import Confirmation from "../../Components/Common/Confirmation";

const POSEdit = () => {


  const [billingSettings,setBillingSettings]=useState({
    english_name_length:11,
    marathi_name_length:11,
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

        total_qty_size:10,
        total_qty_weight:"normal",

        total_bill_size:12,
        total_bill_weight:"bold",

        saving_amount_size:12,
        saving_amount_weight:"normal",
 
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
useEffect(()=>{
    getBillingSettings();
},[]);


  const { billId, customerId, paymentModeId } = useParams();

  // USE STATES
  const [customersList, setCustomersList] = useState([]);
  const [paymentModesList, setpaymentModesList] = useState([]);
  const [paymentTermList, setPaymentTermList] = useState([]);
  const [products, setProducts] = useState([]);
  const [multiplePrices, setMultiplePrices] = useState([]);
  const [enteredBillAmount, setEnteredBillAmount] = useState(0);
  const [focusForSearch, SetFocusForSearch] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(true);
  const [Prodcut, setProdcut] = useState(false);
  const [lastBillDetails, setLastBillDetails] = useState({});
  const [isPickerOpened, setIsPickerOpened] = useState(false);
  const [manageCategory, setManageCategory] = useState(0);
  const [C_model, Set_C_model] = useState(false);
  const [currentCustomerDetails, setCurrentCustomerDetails] = useState({});
  const [size, setSize] = useState(null);
  const handleCallbackUpdate = (data,status,customer) => {
    
    if (data.customer !== undefined) {
      setProductIntoTheCart(data.customer[0],data.update);
    }
    toast.success(data.message);
    setProdcut(false);
    setIsModalOpen(true);
    setUpdateModalStates(false);
    Set_C_model(false);
     
  };
  const handleCallback = (data,status,customer) => {
    console.log(data);
    if (status==0) { // for customer
      setManageCategory(1);
      getcustomer(); 
      const updatedPrimaryInformation = {
        ...posData.PrimaryImformation,
        master_customer_id:  customer.customer_id,
      }; 
      const updatedPosData = {
        ...posData,
        PrimaryImformation: updatedPrimaryInformation,
      };
      toast.success(data); // customer
      setCustomerType({label: customer.customer_name,value: customer.customer_id});
      setPosData(updatedPosData);
      getCustomerDetails(customer.customer_id);
    }
    if (data.customer !== undefined) {
      setProductIntoTheCart(data.customer);
    }
    toast.success(data.message);
    setProdcut(false);
    setIsModalOpen(true);
    setUpdateModalStates(false);
    Set_C_model(false);
    
    // if (data.message == "Product updated successfully") {
    //   setProductIntoTheCart(data.array[0]);
    // }
    // toast.success(data.message);
    // setProdcut(false);
    // setUpdateModalStates(false);
    // setIsModalOpen(true);
    // Set_C_model(false);
    // if (data.message == "Customer create successfully!") {
    //   setManageCategory(1);
    //   getcustomer();
    //   const updatedPrimaryInformation = {
    //     ...posData.PrimaryImformation,
    //     master_customer_id: data.customer.customer_id,
    //   };
    //   const updatedPosData = {
    //     ...posData,
    //     PrimaryImformation: updatedPrimaryInformation,
    //   };
    //   setPosData(updatedPosData);
    //   getCustomerDetails(data.customer.customer_id);
    // }
  };

  const flatpickrRef = useRef(null);

  // const handleButtonClick = () => {
  //   setIsPickerOpened(true);
  //   if (flatpickrRef.current) {
  //     flatpickrRef.current.flatpickr.open(); // Open the date picker calendar view
  //     flatpickrRef.current.flatpickr.setDate(
  //       posData.PrimaryImformation.master_bill_date
  //     );
  //   }
  // };
  const [saveButtonLoading, setSaveButtonLoading] = useState(false);

  const saveButtonRef = useRef();

  // REDUX TOOLKIT SELECTORS
  const totalMRP = useSelector((state) => state.POSSlice.totalMRP);
  const totalQty = useSelector((state) => state.POSSlice.totalQty);
  const totalSale = useSelector((state) => state.POSSlice.totalSalesPrice);
  const totalBillAMT = useSelector((state) => state.POSSlice.totalBillAmount);
  const [defaultCustomer, setDefaultCustomer] = useState({});
  const [defaultPaymentMode, setDefaultPaymentMode] = useState({});
  const [defaultPaymentTerm, setDefaultPaymentTermMode] = useState({});

  const getPOSBillDetails = async () => {
    try {
      const response = await http.get(`/pos/get/${billId}`);
      const productsArray = response.data.map((data) => ({
        product_id: data.product_id,
        product_name: data.product_english_name,
        marathi_name: data.product_marathi_name,
        product_price_id: data.pos_product_tbl_id,
        qty: data.pos_qty,
        mrp: data.pos_mrp,
        salePrice: data.pos_salePrice,
        price_credit: data.pos_price_credit,
        product_hsn_code: data.pos_barcode,
        totalPrice: data.pos_totalPrice,
        is_Synced: data.is_Synced,
        pos_prodcut_id: data.pos_prodcut_id,
      }));

      const posBillsDetails = await http.get(`/pos/bills/single/${billId}`);
       setPaymentTerm({
        label : posBillsDetails.data[0].master_payment_term == 1 ? "Cash": "Credit",
        value : posBillsDetails.data[0].master_payment_term == 1 ? 1: 2
      })
      dispatch(addMassAssignment(productsArray));
      if(posBillsDetails.data[0].master_payment_term == 1){
      dispatch(setTotalAmounts());
    }else{
        dispatch(setCreditTotalAmounts());
      }
      dispatch(setTotalPayable(posBillsDetails.data[0].master_paid_amount));
      dispatch(
        setTotalRemaining(
          posBillsDetails.data[0].master_total_bill_amt -
            posBillsDetails.data[0].master_paid_amount
        )
      ); 
      setPaymentType(paymentModeId);
      // setCustomerType(customerId);
      console.log("Check POs Details ",posBillsDetails.data[0]);
      
      const updatedPrimaryInformation = {
        ...posData.PrimaryImformation,
        master_payment_mode_id: paymentModeId,
        master_payment_term: posBillsDetails.data[0].master_payment_term,
        master_customer_id: customerId,
        // master_bill_date: posBillsDetails.data[0]?.master_bill_date,
        master_total_bill_amt: totalBillAMT,
        is_Synced: posBillsDetails.data[0].isSynced,
      };
      const updatedPosData = {
        ...posData,
        PrimaryImformation: updatedPrimaryInformation,
      };
      setPosData(updatedPosData);
    } catch (error) {
      // Handle error
      console.error("Error fetching POS bill details:", error);
    }
  };

  // GETTING CUSTOMER DETAILS
  const getCustomerDetails = async (customerID) => {
    const customer = await http.get(`/customers/show/${customerID}`);
    setCurrentCustomerDetails(customer.data);
  };

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
  const customerOptions = customersList.map((item) => ({
    value: item.customer_id,
    label: item.customer_name,
  }));
  // POS DATA OBJECT
  const [posData, setPosData] = useState({
    productPricre: [],
    PrimaryImformation: {
      master_payment_mode_id: paymentModeId,
      master_customer_id: customerId,
      master_total_bill_amt: totalBillAMT,
      master_bill_type: 1,
      // master_bill_date: null,
      master_id: billId,
      master_qty: null,
    },
  });

  const paymentModes = paymentModesList.map((item) => ({
    value: item.payment_id,
    label: item.payment_type,
  }));
  const paymentTermModes = paymentTermList.map((item) => ({
    value: item.payment_term_id,
    label: item.payment_term_type,
  }));

  const [searchTerm, setSearchTerm] = useState("");

  // GETTING CUSTOMERS LIST FROM API
  const { http } = AuthUser();

  const [masterDetails, setMasterDetails] = useState({});
  const [productsList, setproductsList] = useState([]);
  const [customerDetails, setCustomerDetails] = useState({});
  const [formattedTime, setFormattedTime] = useState();
  const [modalForPrint, setModalForPrint] = useState(false);

  const getcustomer = async () => {
    // fetching the customers
    const customersResponse = await http.get(
      "/user/list?page=1&limit=100"
    );
    setCustomersList(customersResponse.data);
    const paymentResponse = await http.get(
      "/payment_mode/list?page=1&limit=100"
    );
    setpaymentModesList(paymentResponse.data);
    const paymentTermResponse = await http.get(
      "/payment_term/list?page=1&limit=100"
    );
    setPaymentTermList(paymentTermResponse.data);
  };
  useEffect(() => { 
    getDataForPOS();
  }, [cartProductsFromTheStore]);
  const getDataForPOS = useCallback(async () => {
    // fetching the customers
    const customersResponse = await http.get(
      "/customers/list?page=1&limit=10000"
    );
    setCustomersList(customersResponse.data);

    // fetching the payment modes &&& methods
    const paymentResponse = await http.get(
      "/payment_mode/list?page=1&limit=1000"
    );
    setpaymentModesList(paymentResponse.data);
    const firstCustomer = customersResponse.data.find(
      (customer) => customer.customer_id === Number(customerId)
    );
    const paymentTermResponse = await http.get(
      "/payment_term/list?page=1&limit=100"
    );
    setPaymentTermList(paymentTermResponse.data);
    const firstPaymentMode = paymentResponse.data.find(
      (paymentMode) => paymentMode.payment_id === Number(paymentModeId)
    ); 
    getCustomerDetails(firstCustomer.customer_id);
    if (firstCustomer) {
      setDefaultCustomer({
        label: firstCustomer.customer_name,
        value: firstCustomer.customer_id,
      });
      setDefaultPaymentMode({
        label: firstPaymentMode.payment_type,
        value: firstPaymentMode.payment_id,
      });
      
      const updatedPrimaryInformation = {
        ...posData.PrimaryImformation,
        master_customer_id: firstCustomer.customer_id,
        master_payment_mode_id: firstPaymentMode.payment_id,
      };
      const updatedPosData = {
        ...posData,
        PrimaryImformation: updatedPrimaryInformation,
      };
      setPosData(updatedPosData);
    }
    const response = await http.get("/pos/bills/history");
    setLastBillDetails(response.data[response.data.length - 1]);
    const obj = JSON.parse(sessionStorage.getItem("authUser"));
    const newDataInvoice = response.data.map((POSBillDetails) => ({
      ...POSBillDetails,
      master_invoice_no: `${obj.invoiceDetails.intial_latter}-${POSBillDetails.master_invoice_no}`,
    }));
    setPosBillList(newDataInvoice.reverse());
  }, [http]);
  const [searchResults, setSearchResults] = useState(products);
  const [searchList, SetSearchList] = useState([]);
  const dispatch = useDispatch();

  // SHOWING INVOICE MODEL
  const showInvoiceModel = async (masterID, customer) => {
    const productsDetails = await http.get(`/pos/get/${masterID}`);
    setproductsList(productsDetails.data);
    const companyDetailsResponse = await http.get("/business_index");
    setCompanyDetails(companyDetailsResponse.data[0]);
    const billMaster = await http.get(`/pos/bills/single/${masterID}`);
    const details = billMaster.data[0];
    const obj = JSON.parse(sessionStorage.getItem("authUser"));
    setUserDetails(obj.user);

    setMasterDetails({
      ...details,
      master_invoice_no: `${obj.invoiceDetails.intial_latter}-${details.master_invoice_no}`,
    });
    const d = new Date(billMaster.data[0].updatedAt); 

    // Convert to IST (UTC+5:30)
    const offset = 5.5 * 60; // IST is UTC+5:30, which is 330 minutes
    const utcMinutes = d.getUTCMinutes() + d.getUTCHours() * 60;
    const istMinutes = utcMinutes + offset;
  
    // Create a new Date object for IST time
    const istDate = new Date(d.getTime() + (istMinutes - utcMinutes) * 60 * 1000);
  
    // Extract the hours and minutes from the IST date
    const hours = istDate.getHours();
    const minutes = istDate.getMinutes();
  
    // Convert to AM/PM format
    const ampm = hours >= 12 ? "PM" : "AM";
  
    // Adjust hours to 12-hour format
    const hours12 = hours % 12 || 12;
  
    // Create a formatted time string
    const formattedTime = `${hours12}:${
      minutes < 10 ? "0" : ""
    }${minutes} ${ampm}`;
    setFormattedTime(formattedTime);

    const customerData = await http.get(`/customers/show/${customer}`);
    setCustomerDetails(customerData.data);
    setModalForPrint(!modalForPrint);
  };

  const StoreDataPrice = (data) => {
    setProductIntoTheCart(data);
  };
  const [Product_Model, SetProduct_Model] = useState([]);
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
          if(response.data.length>1){
            const result = Data_product.filter((product) => {
              return (product.price_barcode === e.target.value || product.price_qrcode === e.target.value );
            });
            SetProduct_Model(result);
            setMultiplePrices(result);
            setmodal_standard(true);
            SetSearchList([]);
            searchInputRef.current.clear();
          }else{
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

  const handleVisibility = () => {
    if (customerType == 1) {
      return;
    }
    if (customerType.value !== 1) {
      dispatch(setVisibility(isVisible ? false : true));
    }

    if (!isVisible) {
      setEnteredBillAmount(totalPayable);
      // setRemaining()
    }
  };
  const updateTotalBillTypes = (billAmount) => {
    setTimeout(()=>{
      setEnteredBillAmount(billAmount); 
      dispatch(updatePayable({billAmount:billAmount,paymentTerm:paymentTerm})); 
    },500);
    // setRemaining(remainingFromStore)
  };

  // SETTING THE PRODUCT INTO THE CART
  const setProductIntoTheCart = async (prices,update) => { 
    const productDetails = await getProductInfo(prices.product_tbl_id);
    const productMap = {
      product_id: productDetails.product_id,
      product_name: productDetails.product_english_name,
      marathi_name: productDetails.product_marathi_name,
      product_price_id: prices.product_price_id,
      qty: 1,
      mrp: prices.price_mrp,
      salePrice: prices.price_sales,
      price_credit: prices.price_credit,
      product_hsn_code: prices.price_barcode,
      totalPrice: prices.price_sales,
    };
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
        setEnteredBillAmount(totalBillAMT);

        (update != 1 && dispatch(
          increaseProductQuantity({
            paymentTerm: paymentTerm.label,
            product_id: productDetails.product_id,
            newQuantity,
          })
        ));
        if(paymentTerm.label == "Cash"){
          dispatch(setTotalAmounts());
        }
        else{
          dispatch(setCreditTotalAmounts());
        }
      }
    } else {
      dispatch(addProductToStore([productMap]));
      if(paymentTerm.label == "Cash"){
        dispatch(setTotalAmounts());
      }
      else{
        dispatch(setCreditTotalAmounts());
      }
      setEnteredBillAmount(totalBillAMT);
    }
    setSearchTerm("");
  };

  // FETCHING SINGLE PRODUCT DETAILS
  const getProductInfo = async (productId) => {
    const response = await http.get(`/products/single-product/${productId}`);
    return response.data.productDetails;
  };
  const [modalStates, setModalStates] = useState(false);

  const buttonsRef = useRef([]);
  const [focusedIndex, setFocusedIndex] = useState(1);
  const [currentMultipleProductDetails, setCurrentMultipleProductDetails] =
    useState("");
  const [companyDetails, setCompanyDetails] = useState({});
  const [userDetails, setUserDetails] = useState({});

  const searchInputRef = useRef();
  const [posLanguage, setPosLanguage] = useState(1);
  const [posBillLang, setposBillLang] = useState(1);
  const getDetails = async () => {
    const resp = await http.get("/billing-settings/details");
    setPosLanguage(resp.data.pos_bill_language);
    setposBillLang(resp.data.pos_bill_print_language);
  };
  const renderMenuItemChildren = (option, props, index) => (
    <div key={option.id}>
      <div key={option.id}>
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
        </strong>
      </div>
    </div>
  );

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

  const navigate = useNavigate();

  // SAVING THE BILL
  const saveBill = async () => {
    if (cartProductsFromTheStore.length === 0) {
      alert("You must add at least 1 product into the list");
      return;
    }
    updateProductsInPosData();
    dispatch(setVisibility(false));
    const data = sessionStorage.getItem("authUser");
    const jsonData = JSON.parse(data);
    // Use the latest posData for the API call
    const updatedPosData = {
      ...posData,
      productPricre: cartProductsFromTheStore,
      PrimaryImformation: {
        ...posData.PrimaryImformation,
        master_qty: totalQty,
        master_total_bill_mrp: totalMRP,
        master_user_id: jsonData.user.user_id,
        master_paid_amount: totalPayable,
        master_total_bill_amt: Math.round(totalBillAMT),
      },
    };
    console.log(updatedPosData);
    
    try {
      setSaveButtonLoading(true);
      const resp = await http.put("/pos/update", {
        posData: updatedPosData,
      });
      dispatch(removeAllProducts({
tab_id:0
}));
      dispatch(setTotalAmounts());
      showInvoiceModel(billId, customerId);
      setSaveButtonLoading(false);
      const response = await http.get("/pos/bills/history");
      setLastBillDetails(response.data[0]);
      setModalForPrint(false);
      setTimeout(() => {
        handlePrint();
        navigate("/pos/create/1");
      }, 1000);
      setManageCategory(0);
    } catch (error) {
      setSaveButtonLoading(false);
    }
  };
  const [deleteModal, setDeleteModal] = useState(false);

  const handleDeleteOrder = (data) => {
    if (data._reactName == "onClick") {
      dispatch(removeAllProducts({
tab_id:0
}));
      dispatch(setTotalAmounts());
      setDeleteModal(false);
      toast.success("Remove Bill SuccessFully !!");
    }
  };
  useEffect(() => {
    const lsValue = localStorage.getItem("bill_size");
    getDetails();
    if (lsValue != null || lsValue != undefined) {
      setSize(lsValue);
    } else {
      setSize(80);
    }
    const handleShortCut = (e) => {
      if (e.altKey && e.key === "Enter") {
        searchInputRef.current.focus();
      }
      if ((e.altKey && e.key == "c") || (e.altKey && e.key == "C")) {
        setDeleteModal(true);
      }

      const totalButtons = buttonsRef.current.length;
      if ((e.altKey && e.key === "s") || (e.altKey && e.key == "S")) {
        if (isModalOpen) {
          saveButtonRef.current.click();
        }
        // TODO: Handle the search functionality here
      // } else if (e.altKey && e.key === "ArrowUp") {
      } else if ( e.key === "ArrowUp") {
        setFocusedIndex(
          (prevIndex) => (prevIndex - 1 + totalButtons) % totalButtons
        );
      // } else if (e.altKey && e.key === "ArrowDown") {
      } else if ( e.key === "ArrowDown") {
        setFocusedIndex((prevIndex) => (prevIndex + 1) % totalButtons);
      } else if (e.key === "Enter") {
        // Trigger a click event on the focused button
        const focusedButton = buttonsRef.current[focusedIndex];
        if (focusedButton) {
          focusedButton.click();
        }
      }
      // product shorut cut add
      if ((e.altKey && e.key === "p") || (e.altKey && e.key === "P")) {
        setUpdateModalStates(true);
      }
      if (
        (e.ctrlKey && e.altKey && e.key === "c") ||
        (e.ctrlKey && e.altKey && e.key === "C")
      ) {
        Set_C_model(true);
      }
    };
    getPOSBillDetails();
    window.addEventListener("keydown", handleShortCut);
    return () => {
      window.removeEventListener("keydown", handleShortCut);
      dispatch(removeAllProducts({
tab_id:0
}));
    };
  }, [dispatch, isModalOpen]);

  useEffect(() => {
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
        //
      }
    });
  }, [focusedIndex]);

  document.title = "POS Create - Ajspire Technologies";
  const [customerType, setCustomerType] = useState({
    label: "Cash Sale",
    value: "1",
  });
  const [paymentType, setPaymentType] = useState("Cash");
  const [paymentTerm, setPaymentTerm] = useState({label: "Cash",value:1,});
  const [modal_standard, setmodal_standard] = useState(false)
  const [modalForHistory, setModalForHistory] = useState(false);
  const [posBillList, setPosBillList] = useState([]);

  const showHistory = async () => {
    setModalForHistory(!modalForHistory);
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
    };
    printFrame.src = "about:blank";
    setModalForPrint(false);
  };
  // Prodcut edit
  const [UpdatemodalStates, setUpdateModalStates] = useState(false);
  const [FindData, SetFind] = useState([]);
  const ProdcutEdit = (data) => {
    setIsModalOpen(true);
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
                <span style={{  fontWeight: billingSettings.business_name_weight, fontSize: `${billingSettings.business_name_size}px` }}>
                  {companyDetails ? companyDetails.business_name : ""}
                </span>
                <br />
                <span style={{ fontWeight: billingSettings.address_weight, fontSize: `${billingSettings.address_size}px`  }}>
                  {companyDetails
                    ? companyDetails.business_billing_address
                    : ""}
                  <br />
                  <span  style={{ fontWeight: billingSettings.mobile_weight, fontSize: `${billingSettings.mobile_size}px`  }}>
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
                  {billingSettings.mrp_status == 1 &&  <th
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
                      <td style={{ textAlign: "left" , fontWeight: billingSettings.product_name_weight, fontSize: `${billingSettings.product_name_size}px`}}>
                        {posBillLang === 1 ? (
                          (product.product_marathi_name || "").substring(0,  `${parseInt(billingSettings.marathi_name_length)}`)
                        ) : posBillLang === 2 ? (
                          (product.product_english_name || "").substring(0,  `${parseInt(billingSettings.english_name_length)}`)
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
                      <td style={{ textAlign: "right",fontWeight: billingSettings.all_amount_weight, fontSize: `${billingSettings.all_amount_size}px` }}>
                        {Number.isInteger(product.pos_qty)
                          ? product.pos_qty.toFixed(0)
                          : product.pos_qty.toFixed(2)}
                      </td>
                      {billingSettings.mrp_status == 1 && <td style={{ textAlign: "right",fontWeight: billingSettings.all_amount_weight, fontSize: `${billingSettings.all_amount_size}px` }}>
                        {Number.isInteger(product.pos_mrp)
                          ? product.pos_mrp.toFixed(0)
                          : product.pos_mrp.toFixed(2)}
                      </td>}
                      <td style={{ textAlign: "right", fontWeight: billingSettings.all_amount_weight, fontSize: `${billingSettings.all_amount_size}px` }}>
                        { paymentTerm.label == "Cash" ?
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
                        {paymentTerm.label == "Cash"?
                          Number.isInteger(
                          product.pos_salePrice * product.pos_qty
                        )
                          ? (product.pos_salePrice * product.pos_qty).toFixed(0)
                          : (product.pos_salePrice * product.pos_qty).toFixed(
                            2
                          ): Number.isInteger(
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
                    <span style={{fontWeight: billingSettings.total_qty_weight, fontSize: `${billingSettings.total_qty_size}px` }}> Total Qty: </span>
                    <b style={{ fontWeight: billingSettings.total_qty_weight, fontSize: `${billingSettings.total_qty_size}px` }}>
                      <span style={{ fontWeight: billingSettings.total_qty_weight, fontSize: `${parseInt(billingSettings.total_qty_size)+5}px` }}>
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
                    <span style={{ fontWeight: billingSettings.total_bill_weight, fontSize: `${billingSettings.total_bill_size}px`}}> Total Bill : </span>
                    <b>
                      <span style={{ fontWeight: billingSettings.total_bill_weight, fontSize: `${parseInt(billingSettings.total_bill_size)+5}px` }}>
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

                {billingSettings.discount_total_status == 1 &&  <div
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
                        <span style={{ fontWeight: billingSettings.saving_amount_weight, fontSize: `${parseInt(billingSettings.saving_amount_size)+5}px` }}>
                          {" "}
                          &#8377;.{" "}
                          {masterDetails.master_total_bill_mrp -
                            masterDetails.master_total_bill_amt}
                        </span>
                      </b>
                    </p>
                  </div>}
                </div>
                {companyDetails.business_qr_code !== null && (
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
            onClick={() => {
              handlePrint();
              navigate("/pos/list");
            }}
          >
            Print
          </Button>
          <Button
            color="danger"
            onClick={() => {
              setModalForPrint(!modalForPrint);
              navigate("/pos/list");
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
                  key={Math.random(Math.random() * Math.random())}
                  onClick={() => {
                    setProductIntoTheCart(price);
                    setmodal_standard(!modal_standard);
                    setFocusedIndex(null);
                    console.log(price);
                  }}
                  ref={(el) => (buttonsRef.current[index] = el)}
                  style={focusedIndex == index ? {backgroundColor:"#E7EAE5"}:{backgroundColor:"white"}}
                >
                  <td>{index + 1}</td>
                  <td>
                    {" "}
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
      <Navbar className="mb-0 shadow">
        <div>Ajspire Technologies</div>
        <div className="float-right">
          <Button color="danger" className="btn-label rounded-pill">
            <i className="ri-user-smile-line label-icon align-middle fs-16 me-2"></i>
            <Link
              to={"/dashboard"}
              className="text-white"
              onClick={() => {
                dispatch(removeAllProducts({}));
                dispatch(setTotalAmounts());
              }}
            >
              Dashboard
            </Link>
          </Button>
          <Button color="primary" className="ml-2 btn-label rounded-pill">
            <i className="ri-user-smile-line label-icon align-middle fs-16 me-2"></i>
            <Link
              to={"/pos/list"}
              className="text-white"
              onClick={() => {
                dispatch(removeAllProducts({
tab_id:0
}));
                dispatch(setTotalAmounts());
              }}
            >
              POS Bills List
            </Link>
          </Button>
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
                          setProdcut(true);
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
                              <th scope="col">{paymentTerm.label == "Cash" ? "Sale Price" : "Credit Price"}</th>
                              <th scope="col">Total</th>
                              <th scope="col">Action</th>
                            </tr>
                          </thead>
                          <tbody>
                            {cartProductsFromTheStore.map((item, index) => (
                              <POSProductRow
                              tabId={0}
                              paymentTerm={paymentTerm.label}
                                key={item.product_id}
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

                  <div className="form-icon right">
                    {/* <Input type="email" className="form-control form-control-icon" id="iconrightInput" style={{ backgroundColor: "rgb(248 245 224)" }} placeholder="Search or add customer" /> */}
                    <Select
                      options={customerOptions}
                      name="group_type"
                      id="group_type"
                      className="fw-bold"
                      placeholder={customerType}
                      style={{ backgroundColor: "rgb(248 245 224)" }}
                      value={customerType}
                      onChange={(selectedOption) => {
                        const updatedPrimaryInformation = {
                          ...posData.PrimaryImformation,
                          master_customer_id: selectedOption.value,
                        };
                        const updatedPosData = {
                          ...posData,
                          PrimaryImformation: updatedPrimaryInformation,
                        };

                        setPosData(updatedPosData);
                        setCustomerType(selectedOption);
                        getCustomerDetails(selectedOption.value);
                      }}
                    />
                    <div style={{ marginTop: "10px" }}>
                      <label htmlFor="">
                        <b className="fw-bold">Customer Name :</b>{" "}
                        {currentCustomerDetails.customer_name ?? "No Data"}
                      </label>
                      <br />
                      <label htmlFor="">
                        <b className="fw-bold">Customer Mobile :</b>{" "}
                        {currentCustomerDetails.customer_mobile ?? "No Data"}
                      </label>
                      <br />
                      <label htmlFor="">
                        <b
                          className="fw-bold"
                          style={{ marginTop: "-20px !important" }}
                        >
                          Customer Address :
                        </b>{" "}
                        {currentCustomerDetails.customer_billing_address ??
                          "No Data"}{" "}
                        {/* // */}
                      </label>
                      <br />
                      <label htmlFor="">
                        <b className="fw-bold">Customer Credit :</b>{" "}
                        {currentCustomerDetails.customer_credit_amount ??
                          "No Data"}
                      </label>
                    </div>
                  </div>
                  <br />
                  <h5 className="fw-bold">
                    Payment Term
                  </h5>
                  <Select
                    options={paymentTermModes}
                    style={{ width: "200px" }}
                    name="group_type"
                    id="group_type" 
                    className="fw-bold"
                    value={paymentTerm}
                    onChange={(selectedOption) => {
                      if (selectedOption.label === "Credit") {
                        dispatch(setCreditTotalAmounts()); 
                        dispatch(setTotalPayable(0));
                        updateTotalBillTypes(0);
                     
                      } else {
                        dispatch(setTotalAmounts());
                      }
                      const updatedPrimaryInformation = {
                        ...posData.PrimaryImformation,
                        master_payment_term: selectedOption.value,
                      };
                      const updatedPosData = {
                        ...posData,
                        PrimaryImformation: updatedPrimaryInformation,
                      };
                      setPosData(updatedPosData);
                      setPaymentTerm(selectedOption);
                    }}
                  />
                  {/* 
                  {isPickerOpened === true ? (
                    <Flatpickr
                      className="form-control"
                      options={{
                        dateFormat: "d/m/Y",
                        defaultDate:
                          posData.PrimaryImformation.master_bill_date,
                      }}
                      onChange={(selectedDates) => {
                        const selectedDate = selectedDates[0];
                        const day = selectedDate.getDate();
                        const month = selectedDate.getMonth() + 1; // Months are zero-based, so adding 1
                        const year = selectedDate.getFullYear();

                        const formattedDate = `${day}/${month}/${year} `;
                        console.log(formattedDate);

                        const updatedPrimaryInformation = {
                          ...posData.PrimaryImformation,
                          master_bill_date: formattedDate,
                        };

                        const updatedPosData = {
                          ...posData,
                          PrimaryImformation: updatedPrimaryInformation,
                        };

                        setPosData(updatedPosData);
                      }}
                      ref={flatpickrRef}
                    />
                  ) : (
                    ""
                  )} */}
                  <br />
                {/* </CardBody>
              </Card>
              <Card className="fs-6 mb-2 pb-0">
                <CardBody className="pt-2 pb-0"> */}
                  <h5 className="mb-2 fw-bold" onClick={handleVisibility}>
                    Payment Details
                  </h5>
                  <Select
                    options={paymentModes}
                    style={{ width: "200px" }}
                    name="group_type"
                    id="group_type"
                    placeholder={defaultPaymentMode.label}
                    className="fw-bold"
                    value={paymentType}
                    onChange={(selectedOption) => {
                     
                      const updatedPrimaryInformation = {
                        ...posData.PrimaryImformation,
                        master_payment_mode_id: selectedOption.value,
                      };
                      const updatedPosData = {
                        ...posData,
                        PrimaryImformation: updatedPrimaryInformation,
                      };
                      setPosData(updatedPosData);
                      setPaymentType(selectedOption);
                    }}
                  />
                  <div className="d-flex justify-content-between">
                    <div className="d-flex align-items-center">
                      {isVisible ? (
                        <Input
                          onClick={handleVisibility}
                          style={{ width: "70px" }}
                          placeholder="Enter Amount"
                          className="mt-1"
                          autoFocus={true}
                          onChange={(e) => updateTotalBillTypes(e.target.value)}
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
                              &#8377; {totalBillAMT.toFixed(2)}
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
                    className="btn btn-danger"
                    onClick={() => {
                      dispatch(removeAllProducts({
tab_id:0
}));
                      dispatch(setTotalAmounts());
                      navigate("/pos/list");
                    }}
                  >
                    Cancel Bill
                  </button>
                  <button
                    className="btn btn-success"
                    onClick={() => {
                      dispatch(removeAllProducts({
tab_id:0
}));
                      dispatch(setTotalAmounts());
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
                Last Bill Inv. No : {lastBillDetails.master_id} | Amount :
                &#8377; {lastBillDetails.master_total_bill_amt}
              </Col>
              <Col sm={2} className="bg-warning text-white fw-bold p-3">
                Total Qty : {totalQty}
              </Col>
              <Col sm={2} className="bg-primary text-white fw-bold p-3">
                Total MRP : &#8377; {totalMRP.toFixed(2)}
              </Col>
              <Col sm={2} className="bg-secondary text-white fw-bold p-3">
                Total Discount : &#8377;{" "}
                {(Number(totalMRP) - Number(totalSale)).toFixed(2)}
              </Col>
              <Col sm={2} className="bg-success text-white fw-bold p-3">
                Total Bill :&#8377; {totalSale.toFixed(2)}
              </Col>
            </Row>
          </div>
        </Container>
      </div>
      {Prodcut === true ? (
        <ProductAdd
          modalStates={Prodcut}
          setModalStates={() => {
            setProdcut(false);
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
          checkchang={handleCallbackUpdate}
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

export default POSEdit;
