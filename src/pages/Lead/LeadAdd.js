import React, { useEffect } from "react";
import invalidAudio from "../../assets/audio/error.ogg";
import validAudio from "../../assets/audio/audio_sucess.mp3";
import { AsyncTypeahead } from "react-bootstrap-typeahead";
import "../purchase/autoscroll.css";
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
  Table,
} from "reactstrap";
import { ToastContainer, toast } from "react-toastify";
import Select from "react-select";
import Flatpickr from "react-flatpickr";
import { useState } from "react";
import AuthUser from "../../helpers/Authuser";
import { useRef } from "react";
import ProductAdd from "../Products/ProductAdd";
import ProductUpdate from "../Products/ProductUpdate";
import { Link, useNavigate } from "react-router-dom";
import ScrollToBottom from "react-scroll-to-bottom";
import { API_URL } from "../../helpers/url_helper";
import UserAddModal from "../Users/UserAddModal";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";

const LeadAdd = (props) => {
  const [stages, setStages] = useState([]);
  const [sources, setSources] = useState([]);
  const [priorities, setPriorities] = useState([]);
  const [references, setReferences] = useState([]);
  const [customerDetails, setCustomers] = useState({});
  const [selectPriceOption, setPriceOption] = useState({
    value: "price_sales",
    label: "Sale Price",
  });
  // Helper to format Date objects to YYYY-MM-DD
  const getFormattedDate = (date) => {
    if (!date) return "";
    const d = new Date(date);
    let month = "" + (d.getMonth() + 1);
    let day = "" + d.getDate();
    const year = d.getFullYear();

    if (month.length < 2) month = "0" + month;
    if (day.length < 2) day = "0" + day;

    return [year, month, day].join("-");
  };
  const redireaction = useNavigate();
  const [customerModal, setCustomerModal] = useState(false);
  const [startDate, setStartDate] = useState(
    new Date().toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    }),
  );
  const [UpdatemodalStates, setUpdateModalStates] = useState(false);
  const [endDate, setEndDate] = useState(
    new Date().toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    }),
  );
  const [MasterArray, SetMasterArray] = useState({
    user_id: 1, // Logged in employee ID
    customer_id: null,
    inquiry_date: getFormattedDate(new Date()),
    followup_date: getFormattedDate(new Date()),
    stage_id: 1, // Default stage (e.g., New)
    priority_id: 1,
    assignto_id: 1,
    source_id: 1,
    referenceby_id: 1,
    feedback: "",
  });
  useEffect(() => {
    const fetchLeadMetadata = async () => {
      try {
        const [stg, src, pri, ref] = await Promise.all([
          http.get("/stages/list"),
          http.get("/sources/list"),
          http.get("/priority/list"),
          http.get("/reference/list"),
        ]);
        setStages(stg.data.data || []);
        setSources(src.data.data || []);
        setPriorities(pri.data.data || []);
        setReferences(ref.data.data || []);
      } catch (err) {
        console.error("Metadata fetch error:", err);
      }
    };
    fetchLeadMetadata();
  }, []);
  const [modal_standard, setmodal_standard] = useState(false);
  const [Product_Model, SetProduct_Model] = useState([]);
  const [modalStates, setModalStates] = useState(false);
  const [purchase_payment_terms, setpurchase_payment_term] = useState("");
  const [Check, SetCheck] = useState(false);
  const [Disabed, SetDisabed] = useState(false);
  const [manageCategory, setManageCategory] = useState(0);

  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [isCategoryLoading, setIsCategoryLoading] = useState(false);
  const [isProductLoading, setIsProductLoading] = useState(false);
  const [initialLoadComplete, setInitialLoadComplete] = useState(false);

  const { http } = AuthUser();
  const [BasicInformtion, SetBasicInformtion] = useState([]);
  const [BasiceINF, SetBasiceINF] = useState(1);

  useEffect(() => {
    document.title = "Saisupplier Admin | Leads Create";
    http
      .get("/purchase/information")
      .then((response) => {
        SetBasicInformtion(response.data);

        if (!manageCategory) {
          SetMasterArray({
            ...MasterArray,
            purchase_customer_id: response.data.customer[0].user_id,
          });
          setpurchase_payment_term(
            response.data.payment_term[0].payment_term_id,
          );
        }

        setCustomers(response.data.customer[0]);
        SetCheck(true);
      })
      .catch((error) => {
        console.log(error);
      });
  }, [BasiceINF]);
  const [assignToUser, setAssignToUser] = useState([]);
  useEffect(() => {
    http
      .get("/user/list")
      .then((res) => {
        setAssignToUser(res.data?.users || []);
      })
      .catch(function (err) {
        console.log(err);
      });
  }, []);

  // Fetch categories
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

  useEffect(() => {
    fetchCategories();
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
    }
    SetBasiceINF(BasiceINF + 1);
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
      const encodedInput = input != "" ? encodeURIComponent(input) : -1;
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

    if (check === 1) {
      updatedProduct[field] += 1;
    } else if (check === 2) {
      if (field === "qty" && updatedProduct[field] >= 2) {
        updatedProduct[field] -= 1;
      }
    } else {
      if (field === "qty") {
        const inputValue = Number(e.target.value);
        if (!isNaN(inputValue) && inputValue >= 0) {
          updatedProduct[field] = inputValue;
        }
      } else if (check == "pk") {
        updatedProduct[field] = parseFloat(e);
      } else {
        updatedProduct[field] = parseFloat(e.target.value);
      }
    }
    const Qty = updatedProduct.qty;
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

    updatedProductList[index] = updatedProduct;
    SetData_View(updatedProductList);
    SetCount(Count + 1);
  };

  const Deleted = (index_number) => {
    SetData_View(Data_View.filter((product, index) => index !== index_number));
    SetCount(Count + 1);
    const audio = new Audio(invalidAudio);
    audio.play();
  };

  // crateing total
  const [totalBasic, setTotalBasic] = useState(0);
  const [totalQty, setTotalQty] = useState(0);
  const [Total_purchse, setTotal_purchse] = useState(0);
  const [Total_Discount, setTotal_Discount] = useState(0);
  const [Total_GST, setTotal_GST] = useState(0);
  const [Total_Net, setTotal_Net] = useState(0);

  useEffect(() => {
    if (!Data_View?.length) return;

    const totals = Data_View.reduce(
      (acc, item) => {
        const price = Number(item[selectPriceOption?.value] || 0);
        const qty = Number(item.qty || 0);
        const discount = Number(item.dis_value || 0);
        const tax = Number(item.tax_percentage || 0);
        const weight = Number(item.product_weight || 0);
        const subTotal = Number(item.sub_total || 0);
        const basicTotal = Number(item.basic_total || 0);

        acc.basic += basicTotal;
        acc.qty += qty;
        acc.purchase += price * qty;
        acc.discount += discount;
        acc.gst += (price * qty * tax) / 100;
        acc.net += subTotal;
        acc.weight += qty * weight;

        return acc;
      },
      {
        basic: 0,
        qty: 0,
        purchase: 0,
        discount: 0,
        gst: 0,
        net: 0,
        weight: 0,
      },
    );

    setTotalBasic(totals.basic.toFixed(2));
    setTotalQty(totals.qty);
    setTotal_purchse(totals.purchase.toFixed(2));
    setTotal_Discount(totals.discount.toFixed(2));
    setTotal_GST(totals.gst.toFixed(2));
    setTotal_Net(totals.net.toFixed(2));
  }, [Data_View, selectPriceOption]);

  useEffect(() => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diff = isNaN(end - start) ? 0 : (end - start) / (1000 * 3600 * 24);
    SetMasterArray((prev) => ({
      ...prev,
      purchase_due_days: diff,
      purchase_end_date: endDate,
      purchase_total_qty: totalQty,
      purchase_total_purchase: Total_purchse,
      purchase_total_basic: totalBasic,
      purchase_total_discount: Total_Discount,
      purchase_total_gst: Total_GST,
      purchase_total_bill_amount: Total_Net,
      purchase_invoice_no: "",
      purchase_payment_term: purchase_payment_terms,
    }));
  }, [
    startDate,
    endDate,
    totalQty,
    Total_purchse,
    totalBasic,
    Total_Discount,
    Total_GST,
    Total_Net,
    purchase_payment_terms,
  ]);

  const prepareDataForAPI = () => {
    // Convert Data_View products to the specific string format for lead_product_id
    // Format: "product_id(qty),product_id(qty)"
    const productString = Data_View.map(
      (item) => `${item.product_id}(${item.qty})`,
    ).join(",");

    const finalLeadData = {
      user_id: 1, // Should come from your AuthUser context
      customer_id: customerDetails?.user_id,
      inquiry_date: MasterArray.inquiry_date,
      followup_date: MasterArray.followup_date,
      lead_product_id: productString, // Stringified for TEXT field
      stage_id: MasterArray.stage_id,
      priority_id: MasterArray.priority_id,
      assignto_id: MasterArray.assignto_id,
      referenceby_id: MasterArray.referenceby_id,
      source_id: MasterArray.source_id,
      feedback: MasterArray.feedback,
    };

    return finalLeadData;
  };
  const Onsubmit = () => {
    if (Data_View.length) {
      // SetDisabed(true);
      const finalData = prepareDataForAPI();
      SetDisabed(true);

      http
        .post("/lead/store", finalData)
        .then(function (response) {
          redireaction("/leads-list");
          toast.success("Leads Created Successfully!");
          SetDisabed(false);
        })
        .catch(function (error) {
          console.log(error);
          toast.error("Error creating Leads");
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
                customerDetails?.master_branch_code
                  ? "-" + customerDetails.master_branch_code
                  : ""
              }`,
        item: customerDetails,
      }
    : null;

  return (
    <div className="page-content">
      <Container fluid>
        <Row>
          <Col lg={12}>
            <Card>
              <CardBody className="pt-2">
                <div>
                  <Row className="mt-2 border-bottom pb-3 align-items-center">
                    <Col lg={8}>
                      <h4 className="mb-0 fw-bold d-flex align-items-center text-dark">
                        <i className="ri-user-add-fill me-2 text-primary"></i>
                        Create New Lead
                      </h4>
                    </Col>

                    <Col
                      lg={4}
                      className="d-flex justify-content-end align-items-center gap-3"
                    >
                      <Label className="fw-bold small text-uppercase mb-0 text-nowrap">
                        Inquiry Date
                      </Label>

                      <Flatpickr
                        className="form-control  shadow-sm ps-3 pe-5 py-2 fw-medium"
                        value={MasterArray.inquiry_date}
                        placeholder="Select Date"
                        options={{
                          dateFormat: "Y-m-d",
                          altInput: true,
                          altFormat: "d/m/Y",
                          allowInput: true,
                        }}
                        onChange={(date) =>
                          SetMasterArray({
                            ...MasterArray,
                            inquiry_date: getFormattedDate(date[0]),
                          })
                        }
                      />
                    </Col>
                  </Row>
                  <Row className="mt-3">
                    <Col lg={12} className="mb-3">
                      <Row>
                        <Col lg={5}>
                          <div className="mb-3">
                            <Label
                              for="lastnameInput"
                              className="form-label fw-bold d-flex justify-content-between"
                            >
                              <span>Customer </span>
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
                        </Col>
                        <Col lg={4}>
                          <div className="mb-3">
                            <Label
                              for="lastnameInput"
                              className="form-label fw-bold d-flex justify-content-between"
                            >
                              <span>Assign User</span>
                            </Label>
                            {Check ? (
                              <div className=" rounded d-flex bg-primary align-items-center">
                                <div className="w-100">
                                  <Select
                                    id="contactnumberInput"
                                    className="fw-bold"
                                    onChange={(e) => {
                                      SetMasterArray({
                                        ...MasterArray,
                                        lead_assign_to: e.value,
                                      });
                                    }}
                                    options={
                                      assignToUser &&
                                      assignToUser.map((customer) => ({
                                        value: customer.user_id,
                                        label: customer.full_name,
                                        item: customer,
                                      }))
                                    }
                                  />
                                </div>
                              </div>
                            ) : (
                              ""
                            )}
                          </div>
                        </Col>
                        {/* Follow-up Date */}
                        <Col lg={3}>
                          <Label className="fw-bold">Follow Up Date</Label>
                          <Flatpickr
                            className="form-control premium-input"
                            value={MasterArray.followup_date}
                            placeholder="Select Follow Up Date"
                            options={{
                              dateFormat: "Y-m-d", // Actual value format
                              altInput: true, // Enable user-friendly display
                              altFormat: "d/m/Y", // How the user sees it
                              allowInput: true,
                            }}
                            onChange={(date) =>
                              SetMasterArray({
                                ...MasterArray,
                                followup_date: getFormattedDate(date[0]),
                              })
                            }
                          />
                        </Col>
                      </Row>
                      <Row className="mt-2">
                        {/* Priority Selector */}
                        <Col lg={3}>
                          <Label className="fw-bold">Stages</Label>
                          <Select
                            options={stages.map((p) => ({
                              value: p.id,
                              label: p.name,
                            }))}
                            onChange={(e) =>
                              SetMasterArray({
                                ...MasterArray,
                                stage_id: e ? e.value : "",
                              })
                            }
                            // Find the object that matches the ID in your state
                            value={
                              stages
                                .map((p) => ({ value: p.id, label: p.name }))
                                .find(
                                  (opt) => opt.value === MasterArray.stage_id,
                                ) || null
                            }
                            // Optional: Add a clean class for styling
                            className="react-select-container fw-bold"
                          />
                        </Col>

                        {/* Source Selector */}
                        <Col lg={3}>
                          <Label className="fw-bold">Source</Label>
                          <Select
                            options={sources.map((s) => ({
                              value: s.id,
                              label: s.name,
                            }))}
                            onChange={(e) =>
                              SetMasterArray({
                                ...MasterArray,
                                source_id: e.value,
                              })
                            }
                            // Find the object that matches the ID in your state
                            value={
                              sources
                                .map((p) => ({ value: p.id, label: p.name }))
                                .find(
                                  (opt) => opt.value === MasterArray.source_id,
                                ) || null
                            }
                            // Optional: Add a clean class for styling
                            className="react-select-container fw-bold"
                          />
                        </Col>
                        <Col lg={3}>
                          <Label className="fw-bold">Reference</Label>
                          <Select
                            options={references.map((s) => ({
                              value: s.id,
                              label: s.name,
                            }))}
                            onChange={(e) =>
                              SetMasterArray({
                                ...MasterArray,
                                referenceby_id: e.value,
                              })
                            }
                            // Find the object that matches the ID in your state
                            value={
                              references
                                .map((p) => ({ value: p.id, label: p.name }))
                                .find(
                                  (opt) =>
                                    opt.value === MasterArray.referenceby_id,
                                ) || null
                            }
                            // Optional: Add a clean class for styling
                            className="react-select-container fw-bold"
                          />
                        </Col>
                        <Col lg={3}>
                          <Label className="fw-bold">Priority</Label>
                          <Select
                            options={priorities.map((p) => ({
                              value: p.id,
                              label: p.name,
                            }))}
                            onChange={(e) =>
                              SetMasterArray({
                                ...MasterArray,
                                priority_id: e.value,
                              })
                            }
                            // Find the object that matches the ID in your state
                            value={
                              priorities
                                .map((p) => ({ value: p.id, label: p.name }))
                                .find(
                                  (opt) =>
                                    opt.value === MasterArray.priority_id,
                                ) || null
                            }
                            // Optional: Add a clean class for styling
                            className="react-select-container fw-bold"
                          />
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
                                      (c) => c.category_id === selectedCategory,
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
                                if (e.key === "Enter") {
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
                                <div style={{ backgroundColor: "red" }}>
                                  {/* <i className="ri-barcode-line fs-4 mx-5"></i> */}
                                </div>{" "}
                                <button className="bg-primary text-white">
                                  +
                                </button>
                              </div>
                            </span>
                          </div>
                        </div>
                      </div>
                    </Col>
                    <Col lg={2}></Col>
                    <Col lg={3}>
                      <div className="mb-3">
                        <div className="text-end mt-4">
                          <button
                            className="btn btn-success mx-1"
                            onClick={() => Onsubmit()}
                            disabled={Disabed}
                          >
                            Save Bill
                          </button>
                          <Link
                            to={"/invoice"}
                            className="btn btn-danger  mx-1"
                          >
                            Cancel Bill
                          </Link>
                        </div>
                      </div>
                    </Col>
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
                                    <td
                                      style={{
                                        maxWidth: "200px",
                                        wordBreak: "break-word",
                                        overflowWrap: "break-word",
                                        whiteSpace: "normal",
                                      }}
                                    >
                                      {item.product_english_name}
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
                                        type="number"
                                        className="form-control fs-14 fw-bold"
                                        placeholder="Enter Value"
                                        value={
                                          item[selectPriceOption.value] || ""
                                        }
                                        onChange={(e) =>
                                          ChangInput(
                                            e,
                                            index,
                                            selectPriceOption.value,
                                          )
                                        }
                                        step="0.01" // allows decimals
                                        min="0" // no negative
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
                                        <span
                                          className="text-danger d-inline-block remove-item-btn cursor-pointer"
                                          onClick={() => EditUpdate(index)}
                                        >
                                          <i className="ri-edit-line fs-18 text-primary"></i>
                                        </span>
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
                {/* Feedback Section using CKEditor as requested */}
                <Row className="mt-4">
                  <Col lg={12}>
                    <Label className="fw-bold">Feedback / Discussion</Label>
                    <CKEditor
                      editor={ClassicEditor}
                      data={MasterArray.feedback}
                      onChange={(event, editor) => {
                        const data = editor.getData();
                        SetMasterArray({
                          ...MasterArray,
                          feedback: data,
                        });
                      }}
                    />
                  </Col>
                </Row>
              </CardBody>
            </Card>
          </Col>
        </Row>
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
        {customerModal === true ? (
          <UserAddModal
            modalStates={customerModal}
            setModalStates={() => setCustomerModal(false)}
            checkchang={handleCallback}
          />
        ) : (
          ""
        )}
        <ToastContainer closeButton={false} />
      </Container>
    </div>
  );
};

export default LeadAdd;
