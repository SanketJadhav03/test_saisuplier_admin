import React, { useEffect } from "react";
import invalidAudio from "../../assets/audio/error.ogg";
import validAudio from "../../assets/audio/audio_sucess.mp3";
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
import { AsyncTypeahead } from "react-bootstrap-typeahead";
import "./autoscroll.css";
import ScrollToBottom from "react-scroll-to-bottom";
import SupplierAdd from "../Suppliers/SupplierAdd";

const FranchiseSaleEdit = () => {
  const [franchiseOption, setCustomerOption] = useState([]);
  const [paymentTermOption, setPaymentTermOption] = useState([]);
  const redireaction = useNavigate();
  const [startDate, setStartDate] = useState(
    new Date().toLocaleDateString("en-US")
  );
  const [UpdatemodalStates, setUpdateModalStates] = useState(false);
  const [endDate, setEndDate] = useState(
    new Date().toLocaleDateString("en-US")
  );
  const [counts, SetCounts] = useState(0);
  const [MasterArray, SetMasterArray] = useState({});
  const [modal_standard, setmodal_standard] = useState(false);
  const [Product_Model, SetProduct_Model] = useState([]);
  const [modalStates, setModalStates] = useState(false);
  const [franchise_payment_terms, setfranchise_payment_term] = useState("");
  const [master_customer_ids, setmaster_customer_id] = useState("");
  const [Disabed, SetDisabed] = useState(false);
  const [sss, Setss] = useState("");
  const [eee, Setee] = useState("");
  const [Check, SetCheck] = useState(false);
  const [Data_View, SetData_View] = useState([]);
  const [manageCategory, setManageCategory] = useState(0);
  const [C_model, Set_C_model] = useState(false);

  // edit value set useEffect==========================================
  const { id } = useParams();
  const CallFunion = () => {
    http
      .get(`/franchisesale/edit/${id}`)
      .then(function (response) { 
        const inputDate = response.data.Master[0].franchise_start_date;
        const parts = inputDate.split("/");
        const day = parts[1];
        const month = parts[0];
        const year = parts[2];
        const formattedDate = `${day}/${month}/${year}`;
        Setss(formattedDate);
        //franchise_end_date
        const inputDates = response.data.Master[0].franchise_end_date;
        const partss = inputDates.split("/");
        const days = partss[1];
        const months = partss[0];
        const years = partss[2];
        const formattedDates = `${days}/${months}/${years}`;
        Setee(formattedDates);
        // end
        setmaster_customer_id(response.data.Master[0].supplier_id);
        setfranchise_payment_term(response.data.Master[0].payment_term_id);
        SetMasterArray(response.data.Master[0]);
        // ++++++++ end oject +++++++++++++
        // ++++++ child object chang ++++++++++
        // Function to change keys in each object in the array
        function changeKeys(array, keyMap) {
          return array.map((item) => {
            const newItem = {};
            for (const oldKey in item) {
              if (Object.prototype.hasOwnProperty.call(keyMap, oldKey)) {
                newItem[keyMap[oldKey]] = item[oldKey];
              } else {
                newItem[oldKey] = item[oldKey];
              }
            }
            return newItem;
          });
        }
        const keyMapping = {
          pos_prodcut_id: "product_id",
          pos_qty: "qty",
          pos_p_price: "price_franchise",
          pos_p_mrp: "price_mrp",
          pos_sale_price: "price_sales",
          pos_wholesale_price: "price_wholesaler",
          pos_dis_percentage: "dis_pre",
          pos_dis_value: "dis_value",
          pos_basic_total: "basic_total",
          pos_gst_percentage: "tax_percentage",
          pos_gst_value: "gst_value",
          pos_net_total: "sub_total",
          pos_online_price: "price_online",
          pos_distributor_price: "price_distributor",
        };

        const newArray = changeKeys(response.data.Child, keyMapping);
        SetData_View(newArray);
        SetCheck(true);
        SetCount(Count + 1);
      })
      .catch(function (error) {
        console.log(error);
      });
  };
  // end array======================================================
  useEffect(() => {
    document.title = "Saisupplier Admin | Franchise Update ";

    const start = new Date(startDate);
    const end = new Date(endDate);
    const timeDifference = end - start;
    const daysDifference = timeDifference / (1000 * 3600 * 24);
    const dayss = isNaN(daysDifference) ? 0 : daysDifference;
    SetMasterArray({
      ...MasterArray,
      master_due_days: dayss,
      master_start_date: startDate,
      master_end_date: endDate,
      master_total_qty: totalQty,
      master_total_franchise: Total_purchse,
      master_total_basic: totalBasic,
      master_total_discount: Total_Discount,
      master_total_gst: Total_GST,
      master_total_bill_amt: Total_Net,
      master_customer_id: master_customer_ids,
      master_payment_term: franchise_payment_terms,
    });
  }, [startDate, endDate, counts]);
  // end count days
  const { http } = AuthUser();
  const [BasicInformtion, SetBasicInformtion] = useState([]);
  const [BasiceINF, SetBasiceINF] = useState(1); 
  const [Count, SetCount] = useState(1);
   useEffect(() => {
      http
        .get("/payment_term/list?page=1&limit=100")
        .then(function (response) {
          
          if (response.data.length > 0) {
            setPaymentTermOption(response.data.map((item) => {
              return {
                value: item.payment_term_id,  // Assuming ID is used as value
                label: item.payment_term_type // Display name in dropdown
              };
            }));
          }
        })
        .catch(function (error) {
          console.log(error);
        });
      http
        .get("/franchise/list")
        .then(function (response) {
          
          if (response.data.length > 0) {
            setCustomerOption(response.data.map((item) => {
              return {
                value: item.franchise_id,  // Assuming ID is used as value
                label: item.franchise_name // Display name in dropdown
              };
            }));
          }
        })
        .catch(function (error) {
          console.log(error);
        });
      }, [Count]); 
  // ####################################### franchise product price ########################################
  const [searchList, SetSearchList] = useState([]);
  const [Data_product, SetData_product] = useState([]);

  var searchInputRef = useRef();
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
          searchInputRef.current.clear();
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
  // store prodcut
  const StoreDataPrice = (data) => {
    const existingIndex = Data_View.findIndex(
      (item) => item.product_id === data.product_id
    );
    if (existingIndex !== -1) {
      const dataUP = Data_View[existingIndex];
      const Qty = dataUP.qty + 1;
      const dis_pre = dataUP.dis_pre;
      const dis_values = (Qty * dataUP.price_franchise * dis_pre) / 100; // Calculate dis_values using dis_pre
      const basic = Qty * dataUP.price_franchise - dis_values;
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
      // If the item doesn't exist, add it to the array
      const Qty = 1;
      const basic = Qty * data.price_franchise;
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
        if (!isNaN(inputValue) && inputValue >= 1) {
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
    const dis_values = (Qty * updatedProduct.price_franchise * dis_pre) / 100;
    const basic = Qty * updatedProduct.price_franchise - dis_values;
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
    let calculatedBasicTotal = 0;
    let Total_purchses = 0;
    let calculatedTotalQty = 0;
    let Total_Discounts = 0;
    let Total_GSTs = 0;
    let Total_Nets = 0;

    for (const item of Data_View) {
      calculatedBasicTotal += parseFloat(item.basic_total);
      calculatedTotalQty += item.qty;
      Total_purchses += parseFloat(item.price_franchise);
      Total_Discounts += parseFloat(item.dis_value);
      Total_GSTs += parseFloat(item.gst_value);
      Total_Nets += parseFloat(item.sub_total);
    }

    setTotalBasic(calculatedBasicTotal.toFixed(2));
    setTotalQty(calculatedTotalQty);
    setTotal_Net(Total_Nets.toFixed(2));
    setTotal_GST(Total_GSTs.toFixed(2));
    setTotal_Discount(Total_Discounts.toFixed(2));
    setTotal_purchse(Total_purchses.toFixed(2));
    SetCounts(counts + 1);
  }, [Count]);
  // crateing total end
  //######################################## end ##################################################
  // product edite
  const handleCallback = (data) => { 
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
            Data_View[i].price_fran = data.array[j].price_fran;
            Data_View[i].price_sales = data.array[j].price_sales;
            Data_View[i].price_wholesaler = data.array[j].price_wholesaler;
            Data_View[i].product_price_id = data.array[j].product_price_id;
            Data_View[i].product_tbl_id = data.array[j].product_tbl_id;
            ChangInput("price_fran", i, data.array[j].price_fran, "pk");
          }
        }
      }
    }
    SetCount(Count + 1);
    // updataed list end
    toast.success(data.message);
    setUpdateModalStates(false);
    setModalStates(false);
  };

  const [FindData, SetFind] = useState([]);
  const EditUpdate = (index) => {
    let FindArray = Data_View.filter((_, i) => i == index);
    SetFind(FindArray[0]);
    setUpdateModalStates(!UpdatemodalStates);
  };
  // end product
  const FinalArray = {
    master: MasterArray,
    prodcut: Data_View,
  };
  const child_delete = (idss) => {
    if (idss) {
      http
        .get(`/franchise/child/delete/${idss}`)
        .then(function (response) {
          console.log("delete");
        })
        .catch(function (error) {
          console.log(error);
        });
    }
  };
  const Onsubmit = () => {
    if (Data_View.length) {
      SetDisabed(true);
      http
        .put("/franchise/update", FinalArray)
        .then(function (response) {
          redireaction("/franchise-list");
          toast("Franchise Update Successfully !!!");
          SetDisabed(false);
        })
        .catch(function (error) {
          console.log(error);
          SetDisabed(false);
        });
    } else {
      toast.warn("Plase Add Prodcut Than Submit ??");
    }
  };

  return (
    <div className="page-content">
      <Container fluid>
        <Row>
          <Col lg={12}>
            <Card>
              <CardBody className="pt-2">
                <div>
                  <Row>
                    <Col lg={4}>
                      <Row>
                        <div className="mb-3">
                          <Label
                            for="lastnameInput"
                            className="form-label fw-bold  d-flex justify-content-between"
                          >
                            <span>Supplier Name</span>
                            <button
                              type="button"
                              className="btn btn-primary btn-sm"
                              style={{
                                padding: "1px 7px",
                              }}
                              id="create-btn"
                              onClick={() => {
                                Set_C_model(true);
                              }}
                            >
                              <i className="ri-add-line align-bottom me-1"></i>
                            </button>
                          </Label> 
                            <Select
                              id="contactnumberInput"
                              className="fw-bold"
                              onChange={(e) =>
                                SetMasterArray({
                                  ...MasterArray,
                                  master_customer_id: e.value,
                                })
                              }
                              
                              options={
                                BasicInformtion.customer &&
                                BasicInformtion.customer.map((customer) => ({
                                  value: customer.supplier_id,
                                  label: customer.supplier_name,
                                }))
                              }
                            /> 
                        </div>
                      </Row>
                    </Col>
                    <Col lg={8}>
                      <Row>
                        <Col lg={4}>
                          <div className="mb-3">
                            <Label
                              for="lastnameInput"
                              className="form-label fw-bold"
                            >
                              Payment Term
                            </Label>
 
                              <Select
                                name="product_category"
                                id="contactnumberInput"
                                className="fw-bold"
                                onChange={(e) =>
                                  SetMasterArray({
                                    ...MasterArray,
                                    franchise_payment_term: e.value,
                                  })
                                }
                                defaultValue={{
                                  label: MasterArray.payment_term_type,
                                  value: MasterArray.payment_term_id,
                                }}
                                options={
                                  BasicInformtion.payment_term &&
                                  BasicInformtion.payment_term.map(
                                    (payment_term) => ({
                                      value: payment_term.payment_term_id,
                                      label: payment_term.payment_term_type,
                                    })
                                  )
                                }
                              /> 
                          </div>
                        </Col>
                        <Col lg={2}>
                          <div className="mb-3">
                            <Label
                              for="lastnameInput"
                              className="form-label fw-bold"
                            >
                              Invoice No
                            </Label>
                            {Check ? (
                              <input
                                type="text"
                                className="form-control fw-bold"
                                id="lastnameInput"
                                name="product_marathi_name"
                                onChange={(e) =>
                                  SetMasterArray({
                                    ...MasterArray,
                                    franchise_invoice_no: e.target.value,
                                  })
                                }
                                value={MasterArray.franchise_invoice_no}
                              />
                            ) : (
                              ""
                            )}
                          </div>
                        </Col>
                        <Col lg={2}>
                          <div className="mb-3">
                            <Label
                              for="lastnameInput"
                              className="form-label fw-bold"
                            >
                              Invoice Date
                            </Label>
                            {Check ? (
                              <Flatpickr
                                className="form-control"
                                options={{
                                  dateFormat: "d/m/Y",
                                  defaultDate: sss,
                                }}
                                onChange={(selectedDates) => {
                                  const selectedDate = selectedDates[0];
                                  const formattedDate =
                                    selectedDate.toLocaleDateString("en-US", {
                                      day: "numeric",
                                      month: "numeric",
                                      year: "numeric",
                                    });
                                  setStartDate(formattedDate);
                                }}
                              />
                            ) : (
                              ""
                            )}
                          </div>
                        </Col>

                        <Col lg={2}>
                          <div className="mb-3">
                            <Label
                              for="lastnameInput"
                              className="form-label fw-bold"
                            >
                              Due Days
                            </Label>
                            {Check ? (
                              <Input
                                type="text"
                                className="form-control fw-bold"
                                id="lastnameInput"
                                value={MasterArray.franchise_due_days}
                                readOnly
                              />
                            ) : (
                              ""
                            )}
                          </div>
                        </Col>
                        <Col lg={2}>
                          <div className="mb-3">
                            <Label
                              for="lastnameInput"
                              className="form-label fw-bold"
                            >
                              Due Date
                            </Label>
                            {Check ? (
                              <Flatpickr
                                className="form-control"
                                options={{
                                  dateFormat: "d/m/Y",
                                  defaultDate: eee,
                                }}
                                onChange={(selectedDates) => {
                                  const selectedDate = selectedDates[0];
                                  const formattedDate =
                                    selectedDate.toLocaleDateString("en-US", {
                                      day: "numeric",
                                      month: "numeric",
                                      year: "numeric",
                                    });
                                  setEndDate(formattedDate);
                                }}
                              />
                            ) : (
                              ""
                            )}
                          </div>
                        </Col>
                      </Row>
                    </Col>
                    <Col lg={12}>
                      <Row>
                        <Col lg={4}>
                          <div className="mb-3">
                            <Label
                              for="lastnameInput"
                              className="form-label fw-bold"
                            >
                              Product Name
                            </Label>
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
                                  labelKey={(option) =>
                                    `${option.product_english_name}`
                                  }
                                  options={searchList}
                                  onSearch={(e) => console.log(e)}
                                  onChange={(data) => console.log(data)}
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
                        <Col lg={8}>
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
                                to={"/franchise-sale"}
                                className="btn btn-danger  mx-1"
                              >
                                Cancel Bill
                              </Link>
                            </div>
                          </div>
                        </Col>
                      </Row>
                    </Col>
                    <Col lg={12}>
                      <Row>
                        <Col sm={12}>
                          <ScrollToBottom className="scroll-container">
                            <Table className="align-right table-nowrap mb-0 fs-5 fw-bold text-end table-sm ">
                              <thead className="bg-light ">
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
                                  <th scope="col">P Price</th>
                                  <th scope="col">MRP</th>
                                  <th scope="col">Sale</th>
                                  <th scope="col">Wholesale</th>
                                  <th scope="col">Dis %</th>
                                  <th scope="col">Dis Value</th>
                                  <th scope="col">Basic Total</th>
                                  <th scope="col">GST % </th>
                                  <th scope="col">GST Value </th>
                                  <th scope="col">Total </th>
                                  <th scope="col">Action</th>
                                </tr>
                              </thead>
                              <tbody>
                                {Data_View.map((item, index) => (
                                  <tr key={index}>
                                    <td className="text-start">{index + 1}</td>
                                    <td className="text-start">
                                      {item.product_english_name.slice(0, 15)}
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
                                          min="0"
                                          max="1000"
                                          onChange={(e) =>
                                            ChangInput(e, index, "qty")
                                          }
                                          value={item.qty}
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
                                    <td>
                                      <input
                                        type="number"
                                        className="input-step light text-end fw-bold"
                                        style={{ height: "30.5px" }}
                                        min="0"
                                        max="1000"
                                        onChange={(e) =>
                                          ChangInput(e, index, "price_franchise")
                                        }
                                        value={item.price_franchise}
                                      />
                                    </td>
                                    <td>{item.price_mrp}</td>
                                    <td>{item.price_sales}</td>
                                    <td>{item.price_wholesaler}</td>
                                    <td>
                                      <input
                                        type="number"
                                        className="input-step light text-end fw-bold"
                                        style={{ height: "30.5px" }}
                                        min="0"
                                        max="1000"
                                        onChange={(e) =>
                                          ChangInput(e, index, "dis_pre")
                                        }
                                        value={item.dis_pre}
                                      />
                                    </td>
                                    <td>
                                      {item.dis_value}
                                      {/* <input
                                      type="number"
                                      className="product-quantity fw-bold text-end"
                                      min="0"
                                      max="1000"
                                      onChange={(e) =>
                                        ChangInput(e, index, "dis_value")
                                      }
                                      value={item.dis_value}
                                    /> */}
                                    </td>
                                    <td>{item.basic_total}</td>
                                    <td>{item.tax_percentage}</td>
                                    <td>{item.gst_value}</td>
                                    <td>{item.sub_total}</td>
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
                                          onClick={() => {
                                            Deleted(index);
                                            child_delete(item.franchise_id);
                                          }}
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
              </CardBody>
            </Card>
          </Col>
        </Row>
        <div className="container-fluid fixed-bottom fs-5">
          <Row>
            <Col></Col>
            <Col
              sm={1}
              className="bg-danger text-white text-center fw-bold p-3"
            >
              Qty <br />
              {totalQty}
            </Col>
            <Col
              sm={2}
              className="bg-warning text-white text-center fw-bold p-3"
            >
              Purchse Amt <br /> &#8377;
              {Total_purchse}
            </Col>
            <Col
              sm={2}
              className="bg-secondary text-white text-center fw-bold p-3"
            >
              Basic Amt <br /> &#8377;
              {totalBasic}
            </Col>
            <Col sm={2} className="bg-info text-white text-center fw-bold p-3">
              Discount Amt
              <br /> &#8377;
              {Total_Discount}
            </Col>
            <Col
              sm={1}
              className="bg-primary text-white text-center fw-bold p-3"
            >
              GST Amt
              <br /> &#8377;
              {Total_GST}
            </Col>
            <Col
              sm={2}
              className="bg-success text-white text-center fw-bold p-3"
            >
              Total Bill <br /> &#8377;
              {Total_Net}
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
                  <th>Franchise</th>
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
                  >
                    <td>{index + 1}</td>
                    <td>{price.product_english_name}</td>
                    <td>&#8377; {price.price_mrp}</td>
                    <td>&#8377; {price.price_franchise}</td>
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
        {C_model === true ? (
          <SupplierAdd
            modalStates={C_model}
            setModalStates={() => {
              Set_C_model(false);
            }}
            checkchang={handleCallback}
          />
        ) : (
          ""
        )}
        {/* model box for end box  */}
        <ToastContainer closeButton={false} />
      </Container>
    </div>
  );
};

export default FranchiseSaleEdit;
