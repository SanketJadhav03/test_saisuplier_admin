import React, { useEffect, useState, useMemo, useCallback, useRef } from "react";
import {
  Card,
  CardBody,
  Col,
  Container,
  CardHeader,
  Row,
  Input,
  Modal,
  ModalBody,
  ModalFooter,
  Button,
} from "reactstrap";
import { Link, useNavigate } from "react-router-dom";
import AuthUser from "../../helpers/Authuser";
import Flatpickr from "react-flatpickr";
import QRCode from "qrcode.react";
import AsyncSelect from 'react-select/async';

//redux
import { useSelector, useDispatch } from "react-redux";

import "react-toastify/dist/ReactToastify.css";

import ExportCSVModal from "../../Components/Common/ExportCSVModal";
import { createSelector } from "reselect";
import Select from "react-select";
import InfiniteScroll from "react-infinite-scroll-component";
import { IMG_API_URL } from "../../helpers/url_helper";
import WhatsAppButton from "./components/WhatsAppMessage";
import { ToastContainer } from "react-toastify";

const POSOrders = () => {
  
  
  const [billingSettings,setBillingSettings]=useState({
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
  const { http, checkPermission,permission,user } = AuthUser();
  const [posBills, setPosBills] = useState([]);
  const [page, setPage] = useState(1);
  const [noMore, setNoMore] = useState(true);  

  const downloadCSV = () => {
    const table = document.getElementById('tableToPrint');
    const rows = table.querySelectorAll('tr');

    let csvContent = 'data:text/csv;charset=utf-8,';

    rows.forEach((row) => {
      const rowData = [];
      const cols = row.querySelectorAll('td, th');

      cols.forEach((col, index) => {
        rowData.push(index === cols.length - 1 ? col.textContent : `${col.textContent},`);
      });

      csvContent += rowData.join('') + '\n';
    });

    const encodedURI = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedURI);
    link.setAttribute('download', 'posList.csv');
    document.body.appendChild(link);
    link.click();
  };
 
  
  const paymentTypeOptions = [
    { value: "", label: "Payemnt Type" },
    { value: "1", label: "Cash" },
    { value: "2", label: "Online" },
    { value: "3", label: "Credit" },
  ];
  function formatCurrentDate() {
    const currentDate = new Date();
    const day = currentDate.getDate().toString().padStart(2, "0");
    const month = (currentDate.getMonth() + 1).toString().padStart(2, "0");
    const year = currentDate.getFullYear();
    return `${day}/${month}/${year}`;
  }
  const [activeTab, setActiveTab] = useState("1");
  const [customerName, setCustomerName] = useState("");
  const [endDate, setEndDate] = useState(formatCurrentDate);
  const [startDate, setStartDate] = useState(formatCurrentDate);
  const [paymentMode, setPaymentMode] = useState("");
  const [modal_standard, setmodal_standard] = useState(false);

  // FILTERING THE POS BILLS
  const filterData = async () => {
console.log(user.user.user_id);

    const apiResponse = await http.get(`/pos/list`);
    console.log(apiResponse);
    
    setPosBills([]);
    const newData = apiResponse.data.map((billDetails) => {
      const obj = JSON.parse(sessionStorage.getItem("authUser"));
      return {
        ...billDetails,
        master_invoice_no: `${obj.invoiceDetails.intial_latter}-${billDetails.master_invoice_no}`,
      };
    });
    setNoMore(false);
  
    
    setPosBills(newData);
    setmodal_standard(false);
    setCustomerName("");
    setPaymentMode("");
  };
  const loadNextData = async () => {
    const nextPage = page + 1;
    // getPOSBillsList(nextPage);
    filterData();
    setPage(nextPage);
  };

  const [posBillLang, setposBillLang] = useState(1);
  const getDetails = async () => {
    const resp = await http.get("/billing-settings/details");
    setposBillLang(resp.data.pos_bill_print_language);
  };

  const selectLayoutState = (state) => state.Ecommerce;
  const selectLayoutProperties = createSelector(selectLayoutState, (ecom) => ({
    orders: ecom.orders,
    isOrderSuccess: ecom.isOrderSuccess,
    error: ecom.error,
  }));

  const [Customer, setCustomer] = useState([]);
  useEffect(() => {
    http
      .get("/all_customers")
      .then(function (response) {
        if (response.data.length != 0) {
          setCustomer(response.data);
        }
      })
      .catch(function (error) {
        console.log(error);
      });
  }, [])


  useEffect(() => {
    filterData();
    const lsValue = localStorage.getItem("bill_size");
    getDetails();
    if (lsValue != null || lsValue != undefined) {
      setSize(lsValue);
    } else {
      setSize(80);
    }
    // getPOSBillsList(1);
  }, []);

  const [modalForHistory, setModalForHistory] = useState(false);

  const [masterDetails, setMasterDetails] = useState({});
  const [productsList, setproductsList] = useState([]);
  const [customerDetails, setCustomerDetails] = useState({});
  const [formattedTime, setFormattedTime] = useState(null);
  const [companyDetails, setCompanyDetails] = useState({});
  const [userDetails, setUserDetails] = useState({});
  const [paymentModeDetails, setPaymentModeDetails] = useState({});
  const [size, setSize] = useState(null);

  // SHOWING INVOICE MODEL
  const showInvoiceModel = async (masterID, customer) => {
    const productsDetails = await http.get(`/get/${masterID}`);
    const companyDetailsResponse = await http.get("/business_index");

    setCompanyDetails(companyDetailsResponse.data[0]);
    setproductsList(productsDetails.data);
    const billMaster = await http.get(`/pos/bills/single/${masterID}`);
    const details = billMaster.data[0];
    const paymentMode = await http.get(
      `/payment_mode/show/${details.master_payment_mode_id}`
    );
    setPaymentModeDetails(paymentMode);
    const obj = JSON.parse(sessionStorage.getItem("authUser"));
    setUserDetails(obj.user);
    setMasterDetails({
      ...details,
      master_invoice_no: `${obj.invoiceDetails.intial_latter}-${details.master_invoice_no}`,
    });
    const d = new Date(billMaster.data[0].updatedAt);
    // Extract the hours and minutes from the parsed date
    const hours = d.getUTCHours(); // Use getUTCHours to get hours in UTC time
    const minutes = d.getUTCMinutes(); // Use getUTCMinutes to get minutes in UTC time

    // Convert to AM/PM format
    const ampm = hours >= 12 ? "PM" : "AM";

    // Adjust hours to 12-hour format
    const hours12 = hours % 12 || 12;

    // Create a formatted time string
    const formattedTime = `${hours12}:${minutes < 10 ? "0" : ""
      }${minutes} ${ampm}`;
    setFormattedTime(formattedTime);

    const customerData = await http.get(`/customers/show/${customer}`);
    setCustomerDetails(customerData.data);
    setModalForHistory(!modalForHistory);
  };

const navigate = useNavigate();
  const tableRef = useRef(null);
  const handlePrint = () => {
    const table = tableRef.current;

    if (table) {
      table.style.display = 'table';
      let printContents = document.getElementById('tableToPrint').outerHTML;
      let originalContents = document.body.innerHTML;
      document.body.innerHTML = printContents;
      window.print();
      navigate("/pos/list");
      document.body.innerHTML = originalContents;
    }
  };
  const handlePrint1 = () => {
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
           navigate("/pos/list");
        };
      } else {
        // For browsers that don't support onafterprint event
        setTimeout(() => {
           navigate("/pos/list");
        }, 1000); // Refresh after a delay (adjust time as needed)
      }
    };
  
    printFrame.src = "about:blank";
    setModalForHistory(false);
  };
  
  const totalQty = posBills.filter((item)=> (item.master_user_id == user.user.user_id && user.user.role != 1) || user.user.role == 1 ).reduce((acc, item) => acc + item.master_qty, 0);
  const totalAmount = posBills.filter((item)=> (item.master_user_id == user.user.user_id && user.user.role != 1) || user.user.role == 1 ).reduce(
    (acc, item) => acc + item.master_total_bill_amt,
    0
  );
  document.title = "POS Bills | eBilling Ajspire Technologies Pvt. Ltd.";

  const loadCustomerOptions = async (inputValue) => {
    try {
      const response = await http.get(`/customers/search?q=${inputValue}`); // Fetch from the API
      return response.data.map(customer => ({
        value: customer.customer_name,
        label: customer.customer_name,
      }));
    } catch (error) {
      console.error("Error fetching customer options:", error);
      return []; // Return an empty array if there's an error
    }
  };
  
  return (
    <div className="page-content">

      <table
        ref={tableRef}
        style={{ display: "none" }}
        role="table"
        id="tableToPrint"
        className="text-center bg-white table-nowrap table"
      >
        <thead className="text-uppercase">
          <tr>
            <th
              title="Toggle SortBy"
              style={{ cursor: "pointer" }}
            >
              Sr.No
            </th>
            <th
              title="Toggle SortBy"
              style={{ cursor: "pointer" }}
            >
              INV No.
            </th>
            <th
              title="Toggle SortBy"
              style={{ cursor: "pointer" }}
            >
              User 
            </th>
            <th
              title="Toggle SortBy"
              style={{ cursor: "pointer" }}
            >
              Customer Name
            </th>
            <th
              title="Toggle SortBy"
              style={{ cursor: "pointer" }}
            >
              Bill Date
            </th>

            <th
              title="Toggle SortBy"
              style={{ cursor: "pointer" }}
            >
              Qty
            </th>
            <th
              title="Toggle SortBy"
              style={{ cursor: "pointer" }}
            >
              Grand Total
            </th>
            <th
              title="Toggle SortBy"
              style={{ cursor: "pointer" }}
            >
              Payment Mode
            </th>
          </tr>
        </thead>
        <tbody>
          {posBills.filter((item)=> (item.master_user_id == user.user.user_id && user.user.role != 1) || user.user.role == 1 ).map((item, index) => (
            <tr key={index}>
              <td>
               
                  {index + 1}
         
              </td>
              <td>{item.full_name}</td>
              <td>{item.master_invoice_no}</td>
              <td>{item.customer_name}</td>
              <td>{item.master_bill_date}</td>
              <td>{item.master_qty}</td>
              <td>&#8377; {item.master_total_bill_amt}</td>
              <td>{item.payment_type}</td>
            </tr>
          ))}
        </tbody>
      </table>

     
      {/* <ExportCSVModal
        show={isExportCSV}
        onCloseClick={() => setIsExportCSV(false)}
        data={exportData}
      /> */}
      <Container fluid>
      <Modal
        id="myModals"
        isOpen={modalForHistory}
        size="sm"
        toggle={() => {
          setModalForHistory(!modalForHistory);
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
                <div>
                  <b style={{ fontSize: "12px" }}>
                    Bill No. &nbsp;&nbsp;
                    {masterDetails ? masterDetails.master_invoice_no : ""}{" "}
                    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                  </b>
                  <b style={{ fontSize: "12px", marginLeft: "1px" }}>
                    Date - Time:{" "}
                    {masterDetails ? masterDetails.master_bill_date : ""} -{" "}
                    {formattedTime}{" "}
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
                      <td style={{ textAlign: "right",fontWeight: billingSettings.all_amount_weight, fontSize: `${billingSettings.all_amount_size}px` }}>
                        {Number.isInteger(product.pos_salePrice)
                          ? product.pos_salePrice.toFixed(0)
                          : product.pos_salePrice.toFixed(2)}
                      </td>
                      <td style={{ textAlign: "right",fontWeight: billingSettings.all_amount_weight, fontSize: `${billingSettings.all_amount_size}px` }}>
                        {Number.isInteger(
                          product.pos_salePrice * product.pos_qty
                        )
                          ? (product.pos_salePrice * product.pos_qty).toFixed(0)
                          : (product.pos_salePrice * product.pos_qty).toFixed(
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
            size="sm"
            onClick={() => {
              handlePrint1();
              // dispatch(setPrintingDialogState(false));
            }}
          >
            Print
          </Button>
          <Button
            size="sm"
            color="danger"
            onClick={() => {
              setModalForHistory(!modalForHistory);
            }}
          >
            Close
          </Button>
        </ModalFooter>
      </Modal>
        <Row>
          <Col lg={12}>
            <Card id="orderList">
              <CardHeader className="card-header border-0">
                <Row className="align-items-center gy-3">
                  <div className="col-sm">
                    <h5 className="card-title mb-0">POS Bills</h5>
                  </div>
                  <div className="col-sm-auto">
                    <div className="d-flex gap-1 flex-wrap">
                      <div>
                        <Flatpickr
                          className="form-control"
                          options={{
                            dateFormat: "d/m/Y",
                            defaultDate: "today",
                          }}
                          onChange={(selectedDates) => {
                            const selectedDate = selectedDates[0];
                            const day = selectedDate
                              .getDate()
                              .toString()
                              .padStart(2, "0");
                            const month = (selectedDate.getMonth() + 1)
                              .toString()
                              .padStart(2, "0");
                            const year = selectedDate.getFullYear();
                            const formattedDate = `${day}/${month}/${year}`;
                            setStartDate(formattedDate);
                          }}
                        />
                      </div>
                      <div>
                        <Flatpickr
                          className="form-control"
                          options={{
                            dateFormat: "d/m/Y",
                            defaultDate: "today",
                          }}
                          onChange={(selectedDates) => {
                            const selectedDate = selectedDates[0];
                            const day = selectedDate
                              .getDate()
                              .toString()
                              .padStart(2, "0");
                            const month = (selectedDate.getMonth() + 1)
                              .toString()
                              .padStart(2, "0");
                            const year = selectedDate.getFullYear();
                            const formattedDate = `${day}/${month}/${year}`;
                            setEndDate(formattedDate);
                          }}
                        />
                      </div>
                      <div>
                        <button
                          className="btn btn-success w-100"
                          onClick={() => filterData()}
                        >
                          Search
                        </button>
                      </div>
                      <button
                        type="button"
                        className="btn btn-secondary"
                        onClick={() => {
                          handlePrint();
                        }}
                      >
                        <i className="ri-file-download-line align-bottom me-1"></i>{" "}
                        Print
                      </button>
                      <button
                        type="button"
                        className="btn btn-info"
                        onClick={() => downloadCSV()}
                      >
                        <i className="ri-file-download-line align-bottom me-1"></i>{" "}
                        Export
                      </button>
                      <button
                        type="button"
                        className="btn btn-success"
                        onClick={() => setmodal_standard(!modal_standard)}
                      >
                        <i className="ri-file-download-line align-bottom me-1"></i>{" "}
                        Filter
                      </button>

                    </div>
                  </div>

                  <Modal
                    id="myModal"
                    isOpen={modal_standard}
                    toggle={() => {
                      setmodal_standard(!modal_standard);
                    }}
                  >
                    <ModalBody>
                      <Row className="my-3">
                        <Col xl={12} md={12} style={{ marginBottom: "10px" }}>
                          <div className="input-group">
                            <span
                              className="input-group-text"
                              id="basic-addon1"
                            >
                              <i className="ri-user-line"></i>
                            </span>
                            <AsyncSelect
  placeholder="Select Customer Name"
  cacheOptions
  loadOptions={loadCustomerOptions} // Function to fetch customer options asynchronously
  defaultOptions={Customer.map((group) => ({
    value: group.customer_name,
    label: group.customer_name,
  }))} // Default options can be the initial customer list
  styles={{
    control: (base) => ({
      ...base,
      width: '412px', // Set your desired width
    }),
  }}
  onChange={(selectedOption) => {
    // Manage state updates per tab when the customer name changes
    setCustomerName(selectedOption.value); // Assuming setCustomerName updates the state
    // Add any additional actions you need to perform after selecting a customer
  }}
/>
                          </div>
                        </Col>
                        <Col xl={12} md={12} style={{ marginBottom: "10px" }}>
                          <div className="input-group">
                            <span
                              className="input-group-text"
                              id="basic-addon1"
                            >
                              <i className="ri-calendar-2-line"></i>
                            </span>
                            <Flatpickr
                              placeholder="From Date"
                              onChange={(selectedDates) => {
                                const selectedDate = selectedDates[0];
                                const day = String(
                                  selectedDate.getDate()
                                ).padStart(2, "0"); // Add leading zero if needed
                                const month = String(
                                  selectedDate.getMonth() + 1
                                ).padStart(2, "0"); // Add leading zero if needed
                                const year = selectedDate.getFullYear();
                                const formattedDate = `${day}/${month}/${year}`;
                                setStartDate(formattedDate);
                              }}
                              className="form-control"
                              options={{
                                dateFormat: "d/m/Y",
                                defaultDate: "today",
                              }}
                            />
                          </div>
                        </Col>
                        <Col xl={12} md={12} style={{ marginBottom: "10px" }}>
                          <div className="input-group">
                            <span
                              className="input-group-text"
                              id="basic-addon1"
                            >
                              <i className="ri-calendar-2-line"></i>
                            </span>
                            <Flatpickr
                              placeholder="To Date"
                              onChange={(selectedDates) => {
                                const selectedDate = selectedDates[0];
                                const day = String(
                                  selectedDate.getDate()
                                ).padStart(2, "0"); // Add leading zero if needed
                                const month = String(
                                  selectedDate.getMonth() + 1
                                ).padStart(2, "0"); // Add leading zero if needed
                                const year = selectedDate.getFullYear();
                                const formattedDate = `${day}/${month}/${year}`;
                                setEndDate(formattedDate);
                              }}
                              className="form-control"
                              options={{
                                dateFormat: "d/m/Y",
                                defaultDate: "today",
                              }}
                            />
                          </div>
                        </Col>
                        <Col xl={12} md={12} style={{ marginBottom: "10px" }}>
                          <Select
                            options={paymentTypeOptions}
                            name="paymentType"
                            placeholder="Select Payment Mode"
                            onChange={(value) => setPaymentMode(value.value)}
                          />
                        </Col>
                        <Col xl={12} md={12} style={{ marginBottom: "10px" }}>
                          <button
                            className="btn btn-success w-100"
                            onClick={filterData}
                          >
                            Filter
                          </button>
                        </Col>
                        <Col xl={12} md={12} style={{ marginBottom: "10px" }}>
                          <button
                            className="btn btn-info w-100"
                            onClick={() => {
                              // getPOSBillsList(1);
                              filterData();
                              setmodal_standard(!modal_standard);
                            }}
                          >
                            Show All Bills
                          </button>
                        </Col>
                      </Row>
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
                </Row>
              </CardHeader>

              <CardBody className="pt-0">
                <div>
                  <InfiniteScroll
                    dataLength={posBills.length}
                    next={loadNextData}
                    hasMore={noMore}
                  >
                    <table
                      role="table"
                      className="align-middle table-nowrap table table-hover"
                    >
                      <thead className="table-light text-muted text-uppercase">
                        <tr>
                          <th
                            title="Toggle SortBy"
                            style={{ cursor: "pointer" }}
                          >
                            Sr.No
                          </th>
                          <th
                            title="Toggle SortBy"
                            style={{ cursor: "pointer" }}
                          >
                            User
                          </th>
                          <th
                            title="Toggle SortBy"
                            style={{ cursor: "pointer" }}
                          >
                            INV No.
                          </th>
                          <th
                            title="Toggle SortBy"
                            style={{ cursor: "pointer" }}
                          >
                            Customer Name
                          </th>
                          <th
                            title="Toggle SortBy"
                            style={{ cursor: "pointer" }}
                          >
                            Bill Date
                          </th>

                          <th
                            title="Toggle SortBy"
                            style={{ cursor: "pointer" }}
                          >
                            Qty
                          </th>
                          <th
                            title="Toggle SortBy"
                            style={{ cursor: "pointer" }}
                          >
                            Grand Total
                          </th>
                          <th
                            title="Toggle SortBy"
                            style={{ cursor: "pointer" }}
                          >
                            Payment Mode
                          </th>
                          <th>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {posBills.filter((item)=> (item.master_user_id == user.user.user_id && user.user.role != 1) || user.user.role == 1 ).map((item, index) => (
                          <tr key={index}>
                            <td>
                              <a
                                className="fw-medium link-primary"
                                href="/apps-ecommerce-order-details"
                              >
                                {index + 1}
                              </a>
                            </td>
                            <td>{item.full_name}</td>
                            <td>{item.master_invoice_no}</td>
                            <td>{item.customer_name}</td>
                            <td>{item.master_bill_date}</td>
                            <td>{item.master_qty}</td>
                            <td>&#8377; {item.master_total_bill_amt}</td>
                            <td>{item.payment_type}</td>
                            <td>
                              <ul className="list-inline hstack gap-2 mb-0">
                                <li className="list-inline-item">
                                  <WhatsAppButton
                                    billDetails={item}
                                    color="white"
                                  />
                                </li>
                                {checkPermission("POS Show") ? (
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
                                      <i className="ri-printer-line fs-16"></i>
                                    </button>
                                  </li>
                                ) : (
                                  ""
                                )}
                                {permission.find(permission => permission.permission_category === "POS" && permission.permission_path === "3") 
                                  && 
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
                                }
                              </ul>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </InfiniteScroll>
                </div>
              </CardBody>
            </Card>
          </Col>
        </Row>
      </Container>
      <div className="container-fluid fixed-bottom fs-5">
        <Row>
          <Col sm={2}></Col>
          <Col sm={5} className="bg-dark text-white fw-bold p-3 text-center">
            QTY : {totalQty.toFixed(2)}
          </Col>
          <Col sm={5} className="bg-success text-white fw-bold p-3 text-center">
            Total Amount : &#8377; {totalAmount.toFixed(2)}
          </Col>
        </Row>
      </div>
      <ToastContainer closeButton={false} />
    </div>
  );
};

export default POSOrders;
