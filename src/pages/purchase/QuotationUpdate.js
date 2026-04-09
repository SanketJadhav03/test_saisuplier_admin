import React, { useEffect } from "react";
import invalidAudio from "../../assets/audio/error.ogg";
import validAudio from "../../assets/audio/audio_sucess.mp3";
import { AsyncTypeahead } from "react-bootstrap-typeahead";
import "./autoscroll.css";
import {
  Card,
  CardBody,
  Col,
  Container,
  Modal,
  ModalFooter,
  ModalBody,
  Button,
  Row,
  Label,
  Input,
  Table,
  FormGroup,
} from "reactstrap";
import { ToastContainer, toast } from "react-toastify";
import Select from "react-select";
import Flatpickr from "react-flatpickr";
import { useState } from "react";
import AuthUser from "../../helpers/Authuser";
import { useRef } from "react";
import ProductAdd from "../Products/ProductAdd";
import ProductUpdate from "../Products/ProductUpdate";
import { Link, useNavigate, useParams } from "react-router-dom";
import ScrollToBottom from "react-scroll-to-bottom";
import SupplierAdd from "../Suppliers/SupplierAdd";
import { API_URL, IMG_API_URL, sendMail } from "../../helpers/url_helper";
import UserAddModal from "../Users/UserAddModal";
import ShippingModal from "./ShippingModal";
import { FiEye, FiFile, FiFileText, FiX, FiUpload } from "react-icons/fi";
import ContactPerson from "./ContactPersons";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";

const QuoatationUpdate = (props) => {
  const [preview, setPreview] = useState(null); // holds the file URL
  const [shippingModal, setShippingModal] = useState(false);
  const [selectedAddress, setSelectedAddress] = useState();
  const [customerDetails, setCustomers] = useState({});

  const [otherCharges, setOtherCharges] = useState([]);
  const [selectPriceOption, setPriceOption] = useState({
    value: "price_sales",
    label: "Sale Price",
  });
  const [selectOtherCharge, setOtherCharge] = useState({
    value: "0",
    label: "Select Charge",
  });
  const priceOptions = [
    { value: "price_sales", label: "Sale Price" },
    { value: "price_wholesaler", label: "Wholesaler Price" },
    { value: "price_distributor", label: "Distributor Price" },
  ];
  const redireaction = useNavigate();
  const [customerModal, setCustomerModal] = useState(false);
  const [startDate, setStartDate] = useState(
    `${new Date().getDate()}/${
      new Date().getMonth() + 1
    }/${new Date().getDay()}/${new Date().getFullYear()}`,
  );
  const [UpdatemodalStates, setUpdateModalStates] = useState(false);
  const [endDate, setEndDate] = useState(
    `${new Date().getDate()}/${new Date().getMonth() + 1}/${
      new Date().getMonth() + 1
    }/${new Date().getDay()}/${new Date().getFullYear()}`,
  );
  const [selectedTransport, setSelectedTransport] = useState(null);
  const [daysCount, setDaysCount] = useState(0);
  const [counts, SetCounts] = useState(0);
  const [MasterArray, SetMasterArray] = useState({ purchase_notes: "" });
  const [modal_standard, setmodal_standard] = useState(false);
  const [Product_Model, SetProduct_Model] = useState([]);
  const [modalStates, setModalStates] = useState(false);
  const [purchase_payment_terms, setpurchase_payment_term] = useState("");
  const [Check, SetCheck] = useState(false);
  const [Disabed, SetDisabed] = useState(false);
  const [manageCategory, setManageCategory] = useState(0);
  const [C_model, Set_C_model] = useState(false);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [isCategoryLoading, setIsCategoryLoading] = useState(false);
  const [isProductLoading, setIsProductLoading] = useState(false);
  const [initialLoadComplete, setInitialLoadComplete] = useState(false);
  const [totalWeight, setTotalWeight] = useState(0);
  const { id } = useParams();
  const [totalQty, setTotalQty] = useState(0);
  // Fetch existing purchase data
  const fetchPurchaseData = () => {
    http
      .get(`/purchase/invoice/${id}`)
      .then(function (response) {
        const masterData = response.data.Master[0];
        console.log(masterData);
        const childData = response.data.Child;
        console.log(childData);
        const customer = response.data.customer;
        // Format dates
        const formatDate = (inputDate) => {
          if (!inputDate || inputDate.split("/").length !== 3) return inputDate;
          const [day, month, year] = inputDate.split("/");
          return `${month}/${day}/${year}`;
        };

        setTotalQty(masterData.purchase_total_qty);
        setEndDate(formatDate(masterData.purchase_end_date));
        setPriceOption(
          priceOptions.find(
            (option) => option.value == masterData.selectPriceOption,
          ),
        );
        setpurchase_payment_term(masterData.payment_term_id);
        setCustomers(customer);
        // Map child data to match the required format
        const formattedChildData = childData.map((item) => ({
          product_id: item.purchase_prodcut_id,
          attachment: item.attachment,

          category_name: item.category_name,
          qty: parseInt(item.purchase_qty), // Ensure quantity is integer
          price_purchase: item.purchase_p_price,
          price_mrp: item.purchase_p_mrp,
          price_sales: item.purchase_sale_price,
          product_weight: item.product_weight || 0,
          price_wholesaler: item.purchase_wholesale_price,
          dis_pre: item.purchase_dis_percentage,
          dis_value: item.purchase_dis_value,
          basic_total: item.purchase_basic_total,
          tax_percentage: item.purchase_gst_percentage,
          gst_value: item.purchase_gst_value,
          sub_total: item.purchase_net_total,
          price_online: item.purchase_online_price,
          price_distributor: item.purchase_distributor_price,
          note: item.purchase_note,
          product_english_name: item.product_english_name,
          product_price_id: item.product_price_id,
          purchase_id: item.purchase_id,
        }));

        SetMasterArray({
          ...masterData,
          purchase_notes: masterData.purchase_notes || "",
        });
          
        setOtherCharge({
          ...selectOtherCharge,
          value: masterData.other_charge_id || "0",
        });
        SetData_View(formattedChildData);

        SetCheck(true);
      })
      .catch(function (error) {
        console.log(error);
      });
  };

  const [transportDetails, setTransportDetails] = useState([]);
  useEffect(() => {
    http
      .get("/transport_types/list")
      .then((res) => {
        setTransportDetails(res.data);
        if (transportDetails.length > 0 && !selectedTransport) {
          setSelectedTransport(transportDetails[0]);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);
  useEffect(() => {
    document.title = "Saisupplier Admin | Purchase Update";
    const start = new Date(startDate);
    const end = new Date(endDate);
    const timeDifference = end - start;
    const daysDifference = timeDifference / (1000 * 3600 * 24);
    const dayss = isNaN(daysDifference) ? 0 : daysDifference;
    setDaysCount(dayss);
    SetMasterArray({
      ...MasterArray,
      purchase_due_days: dayss,
      purchase_end_date: endDate,
      purchase_total_qty: totalQty,
      purchase_total_purchase: Total_purchse,
      purchase_total_basic: totalBasic,
      purchase_total_discount: Total_Discount,
      purchase_total_gst: Total_GST,
      purchase_total_bill_amount: Total_Net,
      purchase_payment_term: purchase_payment_terms,
    });
  }, [startDate, endDate, Check, counts, purchase_payment_terms]);

  const { http, https } = AuthUser();
  const [BasicInformtion, SetBasicInformtion] = useState([]);
  const [BasiceINF, SetBasiceINF] = useState(1);
  const [shipping, setShipping] = useState([]);
  useEffect(() => {
    http
      .get("/purchase/information")
      .then(function (response) {
        if (response.data) {
          SetBasicInformtion(response.data);
        }
        fetchPurchaseData();
      })
      .catch(function (error) {
        console.log(error);
      });
  }, [BasiceINF]);
  const [shippingCount, setShippingCount] = useState(1);
  const getAddressDetails = async (user_id) => {
    const { data } = await http.get(`/addresses/${user_id}`);

    if (data && data.length > 0) {
      setShipping(data);

      // find default address
      const defaultAddr = data.find(
        (addr) => addr.shipping_id == MasterArray.master_address_id,
      );

      if (defaultAddr) {
        // store id
        setSelectedAddress(defaultAddr); // store whole object
      } else {
        setSelectedAddress(data[0]);
      }
    } else {
      setShipping([]);
      setSelectedAddress({});
    }
  };
  useEffect(() => {
    if (MasterArray.purchase_customer_id) {
      getAddressDetails(MasterArray.purchase_customer_id);
    }
  }, [shippingCount, MasterArray.purchase_customer_id]);
  // Fetch categories
  const fetchCategories = async () => {
    setIsCategoryLoading(true);
    try {
      const response = await http.get(`${API_URL}/category/list`);
      setCategories(response.data);
      setIsCategoryLoading(false);
    } catch (error) {
      console.error("Failed to load categories:", error);
      setIsCategoryLoading(false);
    }
  };
  const fetchOtherCharges = async () => {
    try {
      const response = await http.get(`${API_URL}/other_charges/list`);
      setOtherCharges(response.data);
    } catch (error) {
      console.error("Failed to load categories:", error);
    }
  };
  useEffect(() => {
    fetchCategories();
    fetchOtherCharges();
  }, []);

  const [FindData, SetFind] = useState([]);
  const EditUpdate = (index) => {
    let FindArray = Data_View.filter((_, i) => i == index);
    SetFind(FindArray[0]);
    setUpdateModalStates(!UpdatemodalStates);
  };

  // product edite
  const handleCallback = (data) => {
    if (data.message == "Supplier create successfully!") {
      setManageCategory(1);
      Set_C_model(false);
      SetMasterArray({
        ...MasterArray,
        purchase_customer_id: data.supplier.purchase_customer_id,
      });
      SetBasiceINF(BasiceINF + 1);
    }
    if (data.message == "Product updated successfully") {
      for (let j = 0; j < data.array.length; j++) {
        const matchingProductId = data.array[j].product_price_id;
        for (let i = 0; i < Data_View.length; i++) {
          if (Data_View[i].product_price_id === matchingProductId) {
            Data_View[i].price_barcode = data.array[j].price_barcode;
            Data_View[i].price_distributor = data.array[j].price_distributor;
            Data_View[i].price_mrp = data.array[j].price_mrp;
            Data_View[i].price_online = data.array[j].price_online;
            Data_View[i].price_opening_qty = data.array[j].price_opening_qty;
            Data_View[i].price_opening_value =
              data.array[j].price_opening_value;
            Data_View[i].price_purchase = data.array[j].price_purchase;
            Data_View[i].price_sales = data.array[j].price_sales;
            Data_View[i].price_wholesaler = data.array[j].price_wholesaler;
            Data_View[i].product_price_id = data.array[j].product_price_id;
            Data_View[i].product_tbl_id = data.array[j].product_tbl_id;
            ChangInput("price_purchase", i, data.array[j].price_purchase, "pk");
          }
        }
      }
    }
    SetCount(Count + 1);
    toast.success(data.message);
    setUpdateModalStates(false);
    setModalStates(false);
  };

  // Product search functionality
  const [searchList, SetSearchList] = useState([]);
  const [Data_product, SetData_product] = useState([]);
  const [Data_View, SetData_View] = useState([]);
  const [Count, SetCount] = useState(1);
  const searchInputRef = useRef(null);

  const loadProducts = async (input = "", isInitialLoad = false) => {
    setIsProductLoading(true);
    try {
      const encodedInput = input ? encodeURIComponent(input) : -1;
      let endpoint = `/product/information_barcode_onkeyup/${encodedInput}`;

      if (selectedCategory && selectedCategory !== "") {
        endpoint += `?category_id=${selectedCategory}`;
      }

      const response = await http.get(endpoint);
      const data = response.data;

      // Set unique products for suggestion (autocomplete)
      const uniqueProducts = data.filter(
        (value, index, self) =>
          index ===
          self.findIndex(
            (v) => v.product_english_name === value.product_english_name,
          ),
      );

      SetSearchList(uniqueProducts);
      SetData_product(data);

      if (isInitialLoad) {
        setInitialLoadComplete(true);
      }
    } catch (error) {
      console.error("Error fetching product data:", error);
    } finally {
      setIsProductLoading(false);
    }
  };

  const getProductsByName = async (e, press) => {
    let input = typeof e === "string" ? e : e?.target?.value?.trim();
    const keyPressed = press?.key;

    if (e?.type === "click" && initialLoadComplete) {
      // On click, show all products if we haven't already
      if (searchList.length === 0) {
        loadProducts("");
      }
      return;
    }

    if (!input && !initialLoadComplete) {
      // Initial load with empty input
      loadProducts("", true);
      return;
    }

    if (keyPressed === "Enter") {
      handleEnterPress(input);
    } else {
      // Normal typing - debounce the API calls
      if (input.length > 1 || input.length === 0) {
        loadProducts(input);
      }
    }
  };

  const handleEnterPress = (input) => {
    const matchingProducts = Data_product.filter(
      (product) =>
        product.product_english_name.toLowerCase() === input.toLowerCase(),
    );

    if (Data_product.length === 0) {
      new Audio(invalidAudio).play();
      toast.error("Invalid Barcode or Product Name");
      return;
    }

    if (matchingProducts.length === 1) {
      SetSearchList([]);
      StoreDataPrice(matchingProducts[0]);
      searchInputRef.current.clear();
    } else if (matchingProducts.length > 1) {
      SetProduct_Model(matchingProducts);
      setmodal_standard(true);
      SetSearchList([]);
      searchInputRef.current.clear();
    } else if (Data_product.length === 1) {
      SetSearchList([]);
      StoreDataPrice(Data_product[0]);
      searchInputRef.current.clear();
    } else if (Data_product.length > 1) {
      const barcodeMatches = Data_product.filter(
        (product) =>
          product.price_barcode === input || product.price_qrcode === input,
      );
      if (barcodeMatches.length > 0) {
        SetProduct_Model(barcodeMatches);
        setmodal_standard(true);
        SetSearchList([]);
        searchInputRef.current.clear();
      }
    }
  };

  const handleInputFocus = () => {
    if (!initialLoadComplete || searchList.length === 0) {
      loadProducts("");
    }
  };

  const handleCategoryChange = (selectedOption) => {
    setSelectedCategory(selectedOption.value);
    SetSearchList([]);
    if (searchInputRef.current) {
      searchInputRef.current.clear();
    }
    loadProducts("");
  };

  // store product
  const StoreDataPrice = (data) => {
    const existingIndex = Data_View.findIndex(
      (item) => item.product_id === data.product_id,
    );
    if (existingIndex !== -1) {
      const dataUP = Data_View[existingIndex];
      const Qty = dataUP.qty + 1;
      const dis_pre = dataUP.dis_pre;
      const dis_values = (Qty * dataUP.price_purchase * dis_pre) / 100;
      const basic = Qty * dataUP.price_purchase - dis_values;
      const gstValue = (basic * dataUP.tax_percentage) / 100;
      const Subtotal = basic + gstValue;
      const updatedData = [...Data_View];
      updatedData[existingIndex] = {
        ...dataUP,
        qty: Qty,
        dis_pre: dis_pre,
        dis_value: dis_values,
        basic_total: basic.toFixed(2),
        gst_value: gstValue.toFixed(2),
        sub_total: Subtotal.toFixed(2),
      };
      SetData_View(updatedData);
      SetCount(Count + 1);
    } else {
      const Qty = 1;
      const basic = Qty * data.price_purchase;
      const gstValue = (basic * data.tax_percentage) / 100;
      const Subtotal = basic + gstValue;
      const newItem = {
        ...data,
        qty: Qty,
        dis_pre: 0,
        dis_value: 0,
        basic_total: basic.toFixed(2),
        gst_value: gstValue.toFixed(2),
        sub_total: Subtotal.toFixed(2),
      };
      SetData_View([...Data_View, newItem]);
      SetCount(Count + 1);
    }
    const audio = new Audio(validAudio);
    audio.play();
  };

  // onchang value update
  const ChangInput = (e, index, field, check) => {
    const updatedProductList = [...Data_View];
    const updatedProduct = { ...updatedProductList[index] };

    if (field === "note") {
      updatedProduct.note = e.target.value;
    } else if (check === 1) {
      // Increment by 1 (integer)
      updatedProduct[field] = parseInt(updatedProduct[field]) + 1;
    } else if (check === 2) {
      // Decrement by 1 (integer), minimum 1
      updatedProduct[field] = Math.max(1, parseInt(updatedProduct[field]) - 1);
    } else {
      if (field === "qty") {
        const inputValue = Number(e.target.value);
        if (!isNaN(inputValue)) {
          // Ensure integer value, minimum 1
          updatedProduct[field] = Math.max(1, Math.floor(inputValue));
        }
      } else if (check == "pk") {
        updatedProduct[field] = e;
      } else {
        updatedProduct[field] = e.target.value;
      }
    }

    // Only recalculate totals if quantity is changed
    if (field === "qty") {
      const Qty = parseInt(updatedProduct.qty); // Ensure quantity is integer
      const dis_pre = updatedProduct.dis_pre;
      const dis_values = (Qty * updatedProduct.price_purchase * dis_pre) / 100;
      const basic = Qty * updatedProduct.price_purchase - dis_values;
      const gstValue = (basic * updatedProduct.tax_percentage) / 100;
      const Subtotal = basic + gstValue;

      updatedProduct.qty = Qty;
      updatedProduct.dis_pre = dis_pre;
      updatedProduct.dis_value = dis_values.toFixed(2);
      updatedProduct.basic_total = basic.toFixed(2);
      updatedProduct.gst_value = gstValue.toFixed(2);
      updatedProduct.sub_total = Subtotal.toFixed(2);
    }

    updatedProductList[index] = updatedProduct;
    SetData_View(updatedProductList);
    SetCount(Count + 1);
  };

  const Deleted = (index_number) => {
    const itemToDelete = Data_View[index_number];
    if (itemToDelete.purchase_id) {
      // If this is an existing item, call API to delete
      http
        .get(`/purchase/child/delete/${itemToDelete.purchase_id}`)
        .then(function (response) {
          console.log("Deleted from server");
        })
        .catch(function (error) {
          console.log(error);
        });
    }

    SetData_View(Data_View.filter((product, index) => index !== index_number));
    SetCount(Count + 1);
    const audio = new Audio(invalidAudio);
    audio.play();
  };

  // crateing total
  const [totalBasic, setTotalBasic] = useState(0);

  const [Total_purchse, setTotal_purchse] = useState(0);
  const [Total_Discount, setTotal_Discount] = useState(0);
  const [Total_GST, setTotal_GST] = useState(0);
  const [Total_Net, setTotal_Net] = useState(0);

  useEffect(() => {
    let calculatedBasicTotal = 0;
    let Total_purchses = 0;
    let calculatedTotalQty = 0;
    let Total_Discounts = 0;
    let Total_GSTs = 0;
    let Total_Nets = 0;
    let total_Weight = 0;

    for (const item of Data_View) {
      calculatedBasicTotal += parseFloat(item.basic_total);
      calculatedTotalQty += parseInt(item.qty); // Ensure integer quantity
      Total_purchses +=
        parseFloat(item[selectPriceOption.value]) * parseInt(item.qty);
      Total_Discounts += parseFloat(item.dis_value);
      Total_GSTs +=
        (parseFloat(item[selectPriceOption.value]) *
          parseInt(item.qty) *
          item.tax_percentage) /
        100;
      Total_Nets += parseFloat(item.sub_total);
      total_Weight += parseInt(item.qty) * parseFloat(item.product_weight || 0);
    }

    setTotalBasic(calculatedBasicTotal.toFixed(2));
    setTotalQty(calculatedTotalQty);
    setTotal_Net(Total_Nets.toFixed(2));
    setTotalWeight(total_Weight.toFixed(2));
    setTotal_GST(Total_GSTs.toFixed(2));
    setTotal_Discount(Total_Discounts.toFixed(2));
    setTotal_purchse(Total_purchses.toFixed(2));
  }, [MasterArray, Data_View]);

  const prepareDataForAPI = () => {
    // Prepare master data

    // Prepare product data in the required format
    const productData = Data_View.map((item) => ({
      product_id: item.product_id,
      attachment: item.attachment || null,
      qty: parseInt(item.qty), // Ensure quantity is integer
      price_purchase: item.price_purchase,
      price_mrp: item.price_mrp,
      price_sales: item.price_sales,
      purchase_note: item.note,
      price_wholesaler: item.price_wholesaler,
      dis_pre: item.dis_pre,
      dis_value: item.dis_value,
      basic_total: item.basic_total,
      tax_percentage: item.tax_percentage,
      purchase_weight: item.product_weight || 0,
      gst_value: item.gst_value,
      sub_total: item[selectPriceOption.value] * parseInt(item.qty),
      price_online: item.price_online,
      price_distributor: item.price_distributor,
      purchase_id: item.purchase_id, // Include for updates
      
    }));

    const masterData = {
      ...MasterArray,

      purchase_total_bill_amount: productData.reduce(
        (acc, item) => acc + item.sub_total,
        0,
      ),
      master_qty: totalQty,
      purchase_total_qty: totalQty,
      master_address_id: selectedAddress?.shipping_id,
      purchase_status: props.status,
      purchase_total_purchase: Total_purchse,
      other_charge_id: selectOtherCharge.value,
      selectPriceOption: selectPriceOption.value,
      purchase_payment_term: purchase_payment_terms,
      purchase_prchase_id: id,
    };
    return {
      master: masterData,
      prodcut: productData,
    };
  };

  const [contact_persons, setContact_persons] = useState([]);
  const [contactModal, setContactModal] = useState(false);
  const [contactCount, setContactCount] = useState(1);
  const getContactPersons = async (master_id) => {
    const { data } = await http.get(`/contact/persons/${master_id}`);
    if (data && data.length > 0) {
      SetMasterArray({
        ...MasterArray,
        contact_person_id: MasterArray.contact_person_id,
      });
      setContact_persons(data);
    } else {
      setContact_persons([]);
    }
  };

  useEffect(() => {
    if (customerDetails && customerDetails.master_id) {
      getContactPersons(customerDetails.master_id);
    } else {
      setContact_persons([]);
    }
  }, [contactCount, customerDetails]);

  const sendQuoatation = (purchase_id) => {
    http
      .get(`/send/quotation/${purchase_id}`)
      .then((res) => {
        // sendMail("send_quotation",{
        //   Name: customerDetails.user_name,
        // },
        // customerDetails.user_email)
      })
      .catch((e) => {
        console.log("Sending Quotation");
      });
  };
  const Onsubmit = () => {
    if (Data_View.length) {
      const finalData = prepareDataForAPI();
      console.log(finalData);
      if (!finalData.master.master_address_id) {
        toast.warning("Please enter address before submitting");
        return; // stop further execution
      }
      SetDisabed(true);

      https
        .put("/purchase/update", finalData)
        .then(function (response) {
          if (props.status == 3) {
            sendQuoatation(finalData.master.purchase_prchase_id);
          }
          redireaction("/quotation-list");
          toast.success("Quotation Updated Successfully!");
          SetDisabed(false);
        })
        .catch(function (error) {
          console.log(error);
          toast.error("Error updating purchase");
          SetDisabed(false);
        });
    } else {
      toast.warn("Please Add Products Before Submitting");
    }
  };

  const selectValue = customerDetails
    ? {
        value: customerDetails.user_id,
        label:
          customerDetails.user_type == 1
            ? customerDetails.user_name
            : `${customerDetails.master_name}${
                customerDetails.master_branch_code
                  ? "-" + customerDetails.master_branch_code
                  : ""
              }`,
        item: customerDetails,
      }
    : null; // if nothing selected

  return (
    <div className="page-content">
      <Container fluid>
        <Row>
          <Col lg={12}>
            <Card>
              <CardBody className="pt-2">
                <div>
                  <Row className="mt-2 border-bottom pb-3">
                    <Col
                      lg={12}
                      className="d-flex justify-content-between align-items-center mb-2"
                    >
                      <h4 className="mb-1 fw-bold">
                        {props.status == 2 ? (
                          <>
                          
                            <FiFileText size={20} /> Generate Quotation
                          </>
                        ) : (
                          <>
                            <FiFile size={20} /> Generate Invoice
                          </>
                        )}
                      </h4>
                      <div className="d-flex gap-2 align-items-center">
                        <Label
                          for="lastnameInput"
                          className="form-label fw-bold d-flex justify-content-between"
                        >
                          <span>Date: </span>
                        </Label>
                        <Flatpickr
                          className="form-control"
                          options={{
                            dateFormat: "d/m/Y",
                          }}
                          value={MasterArray?.purchase_start_date}
                          onChange={(selectedDates) => {
                            const selectedDate = selectedDates[0];
                            const formattedDate =
                              selectedDate.toLocaleDateString("en-GB", {
                                day: "numeric",
                                month: "numeric",
                                year: "numeric",
                              });
                            SetMasterArray({
                              ...MasterArray,
                              purchase_start_date: formattedDate,
                            });
                          }}
                        />
                      </div>
                    </Col>
                  </Row>
                  <Row className="mt-2 ">
                    <Col lg={12} className="mb-3">
                      <Row>
                        <Col lg={4}>
                          <div className="mb-3">
                            <Label
                              for="lastnameInput"
                              className="form-label fw-bold d-flex justify-content-between"
                            >
                              <span>Bill To</span>
                            </Label>
                            {Check ? (
                              <div className="form-icon right rounded d-flex bg-primary align-items-center">
                                <div className="w-100">
                                  <Select
                                    id="contactnumberInput"
                                    className="fw-bold"
                                    value={selectValue}
                                    onChange={(e) => {
                                      SetMasterArray({
                                        ...MasterArray,
                                        purchase_customer_id: e.value,
                                      });
                                      setCustomers(e.item);
                                    }}
                                    options={
                                      BasicInformtion.customer &&
                                      BasicInformtion.customer.map(
                                        (customer) => ({
                                          value: customer.user_id,
                                          label:
                                            customer.user_type == 1
                                              ? customer.user_name
                                              : `${customer.master_name}${
                                                  customer?.master_branch_code
                                                    ? "-" +
                                                      customer.master_branch_code
                                                    : ""
                                                }`,
                                          item: customer,
                                        }),
                                      )
                                    }
                                    filterOption={(option, inputValue) => {
                                      const c = option.data.item;
                                      const s = inputValue.toLowerCase();

                                      return (
                                        c.master_name
                                          ?.toLowerCase()
                                          .includes(s) ||
                                        c.user_name
                                          ?.toLowerCase()
                                          .includes(s) ||
                                        c.master_bank_name
                                          ?.toLowerCase()
                                          .includes(s) ||
                                        c.master_branch_name
                                          ?.toLowerCase()
                                          .includes(s) ||
                                        c.master_bank_code
                                          ?.toLowerCase()
                                          .includes(s) ||
                                        c.master_ifsc?.toLowerCase().includes(s)
                                      );
                                    }}
                                  />
                                </div>
                                <div>
                                  <button
                                    type="button"
                                    style={{
                                      padding: "1px 7px",
                                      fontSize: "15px",
                                    }}
                                    id="create-btn"
                                    className="btn btn-primary btn-sm"
                                    onClick={() => {
                                      setCustomerModal(!customerModal);
                                    }}
                                  >
                                    +
                                  </button>
                                </div>
                              </div>
                            ) : (
                              ""
                            )}
                          </div>
                          <div className="card rounded shadow-lg px-2 my-1  ms-2">
                            {customerDetails ? (
                              <div>
                                <p className="mb-1">
                                  <strong>UID: </strong>{" "}
                                  {customerDetails.user_unique_id}
                                </p>
                                <p className="mb-1">
                                  <strong>Name: </strong>{" "}
                                  {customerDetails.user_type == 1
                                    ? customerDetails.user_name
                                    : customerDetails.master_name}
                                </p>
                                <p className="mb-1">
                                  <strong>Email:</strong>{" "}
                                  {customerDetails.user_type == 1
                                    ? customerDetails.user_email
                                    : customerDetails.master_email}
                                </p>
                                <p className="mb-1">
                                  <strong>Phone:</strong>{" "}
                                  {customerDetails.user_type == 1
                                    ? customerDetails.user_mobile
                                    : customerDetails.master_mobile}
                                </p>
                                {customerDetails.user_type != 1 && (
                                  <p className="mb-1">
                                    <strong>GST No:</strong>{" "}
                                    {customerDetails.master_gst || "N/A"}
                                  </p>
                                )}
                              </div>
                            ) : (
                              <p className="text-muted">No customer selected</p>
                            )}
                          </div>
                        </Col>
                        <Col lg={5}>
                          <div className="mb-3">
                            <Label
                              for="lastnameInput"
                              className="form-label fw-bold d-flex justify-content-between"
                            >
                              <span>Ship To</span>
                            </Label>
                            <div className="form-icon right rounded d-flex bg-primary align-items-center">
                              <div className="w-100">
                                <Select
                                  className="fw-bold"
                                  options={shipping.map((item) => ({
                                    item: item,
                                    value: item.shipping_id, // actual value (unique ID)
                                    label: `${item.address_line1}, ${item.city} - ${item.pincode} - ${item.addressType}`, // label shown in dropdown
                                  }))}
                                  onChange={(selectedOption) => {
                                    setSelectedAddress(selectedOption.item); // store selected shipping_id
                                  }}
                                  value={
                                    shipping
                                      .map((item) => ({
                                        value: item.shipping_id,
                                        label: `${item.address_line1}, ${item.city} - ${item.pincode} - ${item.addressType}`,
                                      }))
                                      .find(
                                        (opt) =>
                                          opt.value ==
                                          selectedAddress?.shipping_id,
                                      ) ||
                                    shipping
                                      .map((item) => ({
                                        value: item.shipping_id,
                                        label: `${item.address_line1}, ${item.city} - ${item.pincode} - ${item.addressType}`,
                                      }))
                                      .find(
                                        (opt) =>
                                          shipping.find(
                                            (s) => s.defaultAddress == 1,
                                          )?.shipping_id === opt.value,
                                      ) ||
                                    null
                                  }
                                  placeholder="Select Shipping Address"
                                />
                              </div>

                              <div>
                                <button
                                  type="button"
                                  style={{
                                    padding: "1px 7px",
                                    fontSize: "15px",
                                  }}
                                  id="create-btn"
                                  className="btn btn-primary btn-sm"
                                  onClick={() => {
                                    setShippingModal(!customerModal);
                                  }}
                                >
                                  +
                                </button>
                              </div>
                            </div>
                          </div>
                          {/* Shipping Address */}
                          <div className="card rounded shadow-lg px-3 py-1 ms-2">
                            {selectedAddress ? (
                              <div className="">
                                <div className="">
                                  <strong>
                                    Address ({" "}
                                    {selectedAddress.addressType
                                      ?.charAt(0)
                                      .toUpperCase() +
                                      selectedAddress.addressType?.slice(
                                        1,
                                      )}{" "}
                                    ) :
                                  </strong>
                                </div>
                                <div className="mb-1">
                                  {selectedAddress.address_line1},{" "}
                                  {selectedAddress.address_line2}
                                </div>
                                <div className="d-flex justify-content-between">
                                  <p className="mb-1">
                                    <strong>City:</strong>{" "}
                                    {selectedAddress.city}
                                  </p>
                                  <p className="mb-1">
                                    <strong>State:</strong>{" "}
                                    {selectedAddress.state}
                                  </p>
                                  <p className="mb-1">
                                    <strong>Pincode:</strong>{" "}
                                    {selectedAddress.pincode}
                                  </p>
                                </div>
                                {/* {selectedAddress.defaultAddress && (
                                                        <span className="badge bg-primary">Default</span>
                                                      )} */}
                              </div>
                            ) : (
                              <p className="text-muted">
                                No shipping address selected
                              </p>
                            )}
                          </div>
                        </Col>
                        <Col lg={3}>
                          <div className="mb-3">
                            <Label
                              htmlFor="lastnameInput"
                              className="form-label fw-bold d-flex justify-content-between"
                            >
                              <span>Select Contact</span>
                            </Label>
                            <div className="form-icon right rounded d-flex bg-primary align-items-center">
                              <div className="w-100">
                                <Select
                                  options={contact_persons.map((person) => ({
                                    value: person.child_id,
                                    label: person.child_name,
                                  }))}
                                  value={
                                    contact_persons
                                      .map((person) => ({
                                        value: person.child_id,
                                        label: person.child_name,
                                      }))
                                      .find(
                                        (opt) =>
                                          opt.value ==
                                          MasterArray?.contact_person_id,
                                      ) || null
                                  }
                                  onChange={(selectedOption) => {
                                    SetMasterArray({
                                      ...MasterArray,
                                      contact_person_id: selectedOption.value,
                                    });
                                  }}
                                  placeholder="Select Contact Person"
                                  className="fw-bold"
                                />
                              </div>
                              <div>
                                <button
                                  type="button"
                                  style={{
                                    padding: "1px 7px",
                                    fontSize: "15px",
                                  }}
                                  id="create-btn"
                                  className="btn btn-primary btn-sm"
                                  onClick={() => setContactModal(!contactModal)}
                                >
                                  +
                                </button>
                              </div>
                            </div>
                          </div>

                          {/* Show Selected Contact Details */}
                          {MasterArray?.contact_person_id && (
                            <div className="card rounded fw-bold">
                              <div className="px-3 py-2">
                                {(() => {
                                  const selectedContact = contact_persons.find(
                                    (p) =>
                                      p.child_id ==
                                      MasterArray.contact_person_id,
                                  );
                                  return selectedContact ? (
                                    <>
                                      <div>
                                        Name: {selectedContact.child_name}
                                      </div>
                                      <div>
                                        Email: {selectedContact.child_email}
                                      </div>
                                      <div>
                                        Mobile: {selectedContact.child_mobile}
                                      </div>
                                      <div>
                                        Designation:{" "}
                                        {selectedContact.child_designation}
                                      </div>
                                    </>
                                  ) : (
                                    <div>No contact details found</div>
                                  );
                                })()}
                              </div>
                            </div>
                          )}
                        </Col>
                      </Row>
                    </Col>
                    <Col lg={3}>
                      <div className="mb-3">
                        <Label
                          for="lastnameInput"
                          className="form-label fw-bold"
                        >
                          Category Name
                        </Label>
                        <Select
                          isLoading={isCategoryLoading}
                          options={[
                            { value: "", label: "All Categories" },
                            ...categories.map((category) => ({
                              value: category.category_id,
                              label: category.category_name,
                            })),
                          ]}
                          onChange={handleCategoryChange}
                          value={
                            selectedCategory
                              ? {
                                  value: selectedCategory,
                                  label:
                                    categories.find(
                                      (c) => c.category_id == selectedCategory,
                                    )?.category_name || "Selected Category",
                                }
                              : { value: "", label: "All Categories" }
                          }
                        />
                      </div>
                    </Col>
                    <Col lg={4}>
                      <div className="mb-3">
                        <Label
                          for="lastnameInput"
                          className="form-label fw-bold"
                        >
                          Product Name
                        </Label>
                        <div className="form-icon right">
                          <div className="input-group">
                            <AsyncTypeahead
                              id="async-pagination-example"
                              placeholder="Search Products by name or Scan Barcode..."
                              // autoFocus
                              ref={searchInputRef}
                              labelKey={(option) =>
                                `${option.product_english_name}`
                              }
                              options={searchList}
                              isLoading={isProductLoading}
                              minLength={0}
                              onSearch={(query) => getProductsByName(query, {})}
                              onChange={(selected) => {
                                if (selected && selected.length > 0) {
                                  StoreDataPrice(selected[0]);
                                  searchInputRef.current.clear();
                                }
                              }}
                              onKeyDown={(e) => {
                                if (e.key == "Enter") {
                                  getProductsByName(e.target.value, e);
                                }
                              }}
                              onFocus={handleInputFocus}
                              renderMenuItemChildren={(option) => (
                                <div>
                                  <span>{option.product_english_name}</span>
                                  <div className="text-muted small">
                                    Barcode: {option.price_barcode} | MRP: ₹
                                    {option.price_mrp}
                                  </div>
                                </div>
                              )}
                            />
                            <span
                              className="input-group-text"
                              id="basic-addon2"
                              onClick={() => setModalStates(!modalStates)}
                            >
                              <div className="d-flex">
                                <button className="bg-primary text-white">
                                  +
                                </button>
                              </div>
                            </span>
                          </div>
                        </div>
                      </div>
                    </Col>
                    {props.status != 1 && (
                      <Col
                        lg={2}
                        className=" d-flex align-items-center justify-content-start mb-3"
                      >
                        <div className="w-100">
                          <Label
                            for="lastnameInput"
                            className="form-label fw-bold d-flex justify-content-between"
                          >
                            <span>Price Option</span>
                          </Label>
                          <Select
                            value={selectPriceOption}
                            onChange={(e) => setPriceOption(e)}
                            options={priceOptions}
                            placeholder="Select Price Type"
                            className="w-100 fw-bold"
                          />
                        </div>
                      </Col>
                    )}
                    <Col
                      lg={3}
                      className=" d-flex align-items-center justify-content-start mb-3"
                    >
                      <div className="w-100">
                        <Label
                          for="lastnameInput"
                          className="form-label fw-bold d-flex justify-content-between"
                        >
                          <span> Other Charges</span>
                        </Label>
                        <Select
                          value={
                            otherCharges?.find(
                              (temp) =>
                                temp.other_charges_id ==
                                selectOtherCharge.value,
                            )
                              ? {
                                  value: selectOtherCharge.value,
                                  label: otherCharges?.find(
                                    (temp) =>
                                      temp.other_charges_id ==
                                      selectOtherCharge.value,
                                  )?.other_charges_name,
                                }
                              : { value: "0", label: "Select Charge" }
                          }
                          onChange={(selectedOption) =>
                            setOtherCharge(selectedOption)
                          }
                          options={[
                            { value: "0", label: "Select Charge" },
                            ...otherCharges.map((category) => ({
                              value: category.other_charges_id,
                              label: category.other_charges_name,
                            })),
                          ]}
                          placeholder="Select Other Charge"
                          className="w-100 fw-bold"
                        />
                      </div>
                      {selectOtherCharge.value != "0" && (
                        <div className="w-100">
                          <Label
                            for="lastnameInput"
                            className="form-label fw-bold d-flex justify-content-between"
                          >
                            <span> Charge Amount</span>
                          </Label>
                          <Input
                            value={MasterArray.other_charge_amount}
                            onChange={(e) =>
                              SetMasterArray({
                                ...MasterArray,
                                other_charge_amount: e.target.value,
                              })
                            }
                            placeholder="Charge Amt"
                            className="w-100 fw-bold"
                          />
                        </div>
                      )}
                    </Col>
                    <Col lg="9"></Col>
                    {MasterArray.purchase_status != 3 && (
                      <Col
                        lg={3}
                        className="d-flex align-items-center justify-content-center mb-4"
                      >
                        <div className="w-100">
                          <div className="text-end mt-4  d-lg-flex gap-1">
                            <button
                              className="btn btn-success d-flex align-items-center justify-content-center gap-1   mx-1"
                              onClick={() => Onsubmit()}
                              disabled={Disabed}
                            >
                              {props.status == 2 ? (
                                <>
                                  <FiFileText size={16} /> Generate Quotation
                                </>
                              ) : (
                                <>
                                  <FiFile size={16} /> Generate Invoice
                                </>
                              )}
                            </button>

                            <Link
                              to={"/quotation-list"}
                              className="btn btn-danger d-flex align-items-center justify-content-center gap-1 "
                            >
                              <FiX size={18} /> Cancel
                            </Link>
                          </div>
                        </div>
                      </Col>
                    )}
                    <Col lg={12}>
                      <Row>
                        <Col sm={12}>
                          <ScrollToBottom className="scroll-container">
                            <Table className="align-right table-nowrap mb-0 fs-5 fw-bold text-center table-sm ">
                              <thead className="bg-light">
                                <tr>
                                  <th>No.</th>
                                  <th>Category</th>
                                  <th>Item Name</th>
                                  <th>Add Note</th>
                                  <th>Attachments</th>
                                  <th>Qty</th>
                                  <th>Rate</th>
                                  <th>Taxable</th>
                                  <th>Gst %</th>
                                  <th>Gst Value</th>
                                  <th>Total</th>
                                  <th>Action</th>
                                </tr>
                              </thead>
                              <tbody>
                                {Data_View.map((item, index) => (
                                  <tr key={index}>
                                    <td>{index + 1}</td>
                                    <td>{item.category_name}</td>

                                    <td>
                                      <div
                                        style={{
                                          maxWidth: "180px",
                                          whiteSpace: "normal",
                                          wordBreak: "break-word",
                                        }}
                                      >
                                        {item.product_english_name}
                                      </div>
                                    </td>
                                    <td
                                      style={{
                                        maxWidth: "150px",
                                        whiteSpace: "normal",
                                        wordBreak: "break-word",
                                      }}
                                    >
                                      <input
                                        type="text"
                                        value={item.note || ""}
                                        onChange={(e) => {
                                          ChangInput(e, index, "note");
                                        }}
                                        className="form-control"
                                        placeholder={
                                          "Add " +
                                          item.product_english_name +
                                          " Notes"
                                        }
                                      />{" "}
                                    </td>
                                    <td>
                                      {item.attachment ? (
                                        <>
                                          <button
                                            type="button"
                                            className="btn btn-sm btn-info me-2"
                                            onClick={() =>
                                              setPreview(
                                                `${IMG_API_URL}/poattachments/${item.attachment}`,
                                              )
                                            }
                                          >
                                            <FiEye /> Preview
                                          </button>

                                          <label className="btn btn-sm btn-warning mb-0">
                                            <FiUpload /> Change File
                                            <input
                                              type="file"
                                              accept="image/*,.pdf,.doc,.docx"
                                              className="form-control w-100"
                                              hidden
                                              onChange={(e) => {
                                                Data_View[index].attachment =
                                                  e.target.files[0];
                                              }}
                                            />
                                          </label>
                                        </>
                                      ) : (
                                        <label className="btn btn-sm btn-secondary mb-0">
                                          <FiUpload /> Upload File
                                          <input
                                            type="file"
                                            accept="image/*,.pdf,.doc,.docx"
                                            className="form-control w-100"
                                            hidden
                                            onChange={(e) => {
                                              Data_View[index].attachment =
                                                e.target.files[0];
                                            }}
                                          />
                                        </label>
                                      )}
                                    </td>
                                    <td>
                                      <div
                                        className="input-step light"
                                        style={{ height: "30.5px" }}
                                      >
                                        <button
                                          type="button"
                                          className="minus"
                                          onClick={(e) =>
                                            ChangInput(e, index, "qty", 2)
                                          }
                                        >
                                          –
                                        </button>
                                        <input
                                          type="number"
                                          className="product-quantity fw-bold"
                                          min="1"
                                          step="1"
                                          onChange={(e) =>
                                            ChangInput(e, index, "qty")
                                          }
                                          value={parseInt(item.qty)} // Ensure displayed value is integer
                                        />
                                        <button
                                          type="button"
                                          className="plus"
                                          onClick={(e) =>
                                            ChangInput(e, index, "qty", 1)
                                          }
                                        >
                                          +
                                        </button>
                                      </div>
                                    </td>
                                    <td className="d-flex justify-content-center align-items-center">
                                      <input
                                        type="text"
                                        className="form-control fs-14 fw-bold"
                                        placeholder="Enter Value"
                                        value={
                                          item[selectPriceOption.value] || ""
                                        }
                                        onChange={(e) =>
                                          ChangInput(
                                            e,
                                            index,
                                            `${selectPriceOption.value}`,
                                          )
                                        }
                                        style={{ width: "170px" }}
                                      />
                                    </td>

                                    <td>
                                      {(
                                        Number(item[selectPriceOption.value]) *
                                        Number(item.qty)
                                      )?.toFixed(2)}
                                    </td>
                                    <td>{Number(item.tax_percentage)} %</td>
                                    <td>
                                      {(
                                        (Number(item[selectPriceOption.value]) *
                                          Number(item.qty) *
                                          Number(item.tax_percentage)) /
                                        100
                                      )?.toFixed(2)}
                                    </td>
                                    <td>
                                      {(
                                        (Number(item[selectPriceOption.value]) *
                                          Number(item.qty) *
                                          Number(item.tax_percentage)) /
                                          100 +
                                        Number(item[selectPriceOption.value]) *
                                          Number(item.qty)
                                      )?.toFixed(2)}
                                    </td>
                                    <td>
                                      <div className="d-flex justify-content-around">
                                        {/* <span
                                          className="text-danger d-inline-block remove-item-btn cursor-pointer"
                                          onClick={() => EditUpdate(index)}
                                        >
                                          <i className="ri-edit-line fs-18 text-primary"></i>
                                        </span> */}
                                        <span
                                          className="text-danger d-inline-block remove-item-btn cursor-pointer"
                                          onClick={() => Deleted(index)}
                                        >
                                          <i className="ri-delete-bin-5-fill fs-16"></i>
                                        </span>
                                      </div>
                                    </td>
                                  </tr>
                                ))}
                              </tbody>
                            </Table>
                          </ScrollToBottom>
                        </Col>
                      </Row>
                    </Col>
                  </Row>
                </div>
                <Row className="align-items-stretch">
                  {/* Left Column */}
                  <Col lg={12}>
                    <FormGroup className="d-flex">
                      <div className="w-25 fw-bold">
                        <label>Total Weight</label>
                        <div>{totalWeight}</div>
                      </div>
                      <div className="w-75 d-flex">
                        <div className="w-50">
                          <label> Transport Types</label>
                          <Select
                            value={selectedTransport}
                            placeholder={
                              transportDetails
                                ?.map((item) => ({
                                  label: `${item.transport_types_type} / ₹${item.transport_types_charge}`,
                                  value: item.transport_types_id,
                                }))
                                .find(
                                  (opt) =>
                                    opt.value ==
                                    MasterArray.purchase_transport_type,
                                )?.label || null
                            }
                            options={transportDetails.map((item) => ({
                              label: `${item.transport_types_type} / ₹${item.transport_types_charge}`,
                              value: item.transport_types_id,
                              charge: item.transport_types_charge, // 🔥 important
                            }))}
                            onChange={(option) => {
                              const chargePer100gm = parseFloat(
                                option.charge || 0,
                              );
                              const amount =
                                (totalWeight / 100) * chargePer100gm;

                              SetMasterArray({
                                ...MasterArray,
                                purchase_transport_type: option.value,
                                transport_types_total_charge: amount,
                              });
                            }}
                          ></Select>
                        </div>
                        <div className="w-50">
                          <label>Total Amount</label>
                          <Input
                            className="form-control fw-bold"
                            value={MasterArray.transport_types_total_charge}
                          />
                        </div>
                      </div>
                    </FormGroup>
                  </Col>
                  <Col lg={12}>
                    <div className="h-100 d-flex flex-column">
                      <Label
                        for="lastnameInput"
                        className="form-label fw-bold d-flex justify-content-between"
                      >
                        <span>Notes</span>
                      </Label>
                      <CKEditor
                        editor={ClassicEditor}
                        data={MasterArray?.purchase_notes}
                        onChange={(e, editor) => {
                          SetMasterArray({
                            ...MasterArray,
                            purchase_notes: editor.getData(),
                          });
                        }}
                        placeholder="Notes"
                        className="fw-bold flex-grow-1"
                        rows={3}
                        style={{ resize: "none" }}
                      />
                    </div>
                  </Col>

                  {/* Right Column */}
                </Row>
              </CardBody>
            </Card>
          </Col>
        </Row>
        <div className="container-fluid fixed-bottom fs-5">
          <Row className="text-white fw-bold">
            <Col></Col>
            <Col
              sm={1}
              className="text-center p-3 rounded-start"
              style={{
                background: "linear-gradient(135deg, #d74545ff, #d9534f)", // soft red
              }}
            >
              Total Qty <br />
              {totalQty}
            </Col>

            <Col
              sm={3}
              className="text-center p-3"
              style={{
                background: "linear-gradient(135deg, #495057, #343a40)", // elegant dark grey
              }}
            >
              Taxable Value <br /> &#8377;
              {Total_purchse}
            </Col>

            <Col
              sm={3}
              className="text-center p-3"
              style={{
                background: "linear-gradient(135deg, #6a11cb, #2575fc)", // blue gradient
              }}
            >
              Total GST Amt <br /> &#8377;
              {Total_GST}
            </Col>

            <Col
              sm={3}
              className="text-center p-3 rounded-end"
              style={{
                background: "linear-gradient(135deg, #28a745, #20c997)", // green gradient
              }}
            >
              Total Bill <br /> &#8377;
              {(
                Number(Total_GST) +
                Number(Total_purchse) +
                Number(MasterArray.other_charge_amount || 0)
              )?.toFixed(2)}
            </Col>
          </Row>
        </div>
        {/* model box for price  */}
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
                {Product_Model.map((price, index) => (
                  <tr
                    key={index}
                    onClick={() => {
                      StoreDataPrice(price);
                      setmodal_standard(!modal_standard);
                    }}
                    style={{ cursor: "pointer" }}
                  >
                    <td>{index + 1}</td>
                    <td>{price.product_english_name}</td>
                    <td>&#8377; {price.price_mrp}</td>
                    <td>&#8377; {price.price_purchase}</td>
                    <td>&#8377; {price.price_sales}</td>
                    <td>&#8377; {price.price_online}</td>
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
        {preview && (
          <div
            className="modal fade show d-block"
            tabIndex="-1"
            role="dialog"
            onClick={() => setPreview(null)}
          >
            <div className="modal-dialog modal-lg" role="document">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">Attachment Preview</h5>
                  <button
                    type="button"
                    className="btn-close"
                    onClick={() => setPreview(null)}
                  ></button>
                </div>
                <div className="modal-body text-center">
                  {preview.endsWith(".pdf") ? (
                    <iframe
                      src={preview}
                      width="100%"
                      height="500px"
                      title="Preview"
                    ></iframe>
                  ) : (
                    <img src={preview} alt="Preview" className="img-fluid" />
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
        {modalStates === true ? (
          <ProductAdd
            modalStates={modalStates}
            setModalStates={() => {
              setModalStates(false);
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
            }}
            checkchang={handleCallback}
            edit_data={FindData}
          />
        ) : (
          ""
        )}
        {shippingModal == true ? (
          <ShippingModal
            modalStates={shippingModal}
            setModalStates={() => {
              setShippingCount(shippingCount + 1);
              setShippingModal(false);
            }}
            purchase_customer_ids={MasterArray?.purchase_customer_id}
          />
        ) : (
          ""
        )}
        {customerModal === true ? (
          <UserAddModal
            modalStates={customerModal}
            setModalStates={() => setCustomerModal(false)}
            checkchang={handleCallback}
          />
        ) : (
          ""
        )}
        {contactModal == true ? (
          <ContactPerson
            modalStates={contactModal}
            setModalStates={() => {
              setContactCount(contactCount + 1);
              setContactModal(false);
            }}
            setContactCount={setContactCount}
            contactCount={contactCount}
            master_id={customerDetails ? customerDetails.master_id : ""}
          />
        ) : (
          ""
        )}
        <ToastContainer closeButton={false} />
      </Container>
    </div>
  );
};

export default QuoatationUpdate;
