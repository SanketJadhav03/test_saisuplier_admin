import React, { useEffect, useState } from "react";
import numberToWords from "number-to-words";
import Flatpickr from "react-flatpickr";
import "../purchase/Invoice.css";
import {
  Card,
  CardBody,
  Col,
  Container,
  CardHeader,
  Nav,
  Row,
  Modal,
  ModalHeader,
  ModalBody,
} from "reactstrap";
import { ToastContainer, toast } from "react-toastify";
import { Link } from "react-router-dom";
import AuthUser from "../../helpers/Authuser";
import DeleteModal from "../../Components/Common/DeleteModal";
import { IMG_API_URL } from "../../helpers/url_helper";
import InfiniteScroll from "react-infinite-scroll-component";
import Select from "react-select"; 
const FranchiseSaleList = () => {
  const { http, checkPermission, permission } = AuthUser();
  const [Data, SetData] = useState([]);
  const [counts, Setcounts] = useState(1);
  const [modal_standard, setmodal_standard] = useState(false);
  const [invoiceDetails] = useState(
    JSON.parse(sessionStorage.getItem("authUser")).invoiceDetails.intial_latter
  ); 
  const [modal_large, setmodal_large] = useState(false);
  function tog_large() {
    setmodal_large(!modal_large);
  }
  // infinity
  const [Pages, SetPages] = useState(1);
  const [NoMore, SetNoMore] = useState(true);
  useEffect(() => {
    document.title = "Saisupplier Admin | Franchise Index";
    http
      .get(`/franchisesale/list`)
      .then(function (response) { 
        SetData(response.data);  
      })
      .catch(function (error) {
        console.log(error);
        SetNoMore(false);
      });
  }, [counts]);
  const fetchData = () => {
    if (NoMore) {
      Setcounts(counts + 1);
    }
  };
  //   Delete Aleart
  const [deleteModal, setDeleteModal] = useState(false);
  const [ID, SetID] = useState();
  const onClickDelete = (data) => {
    SetID(data);
    setDeleteModal(true);
  };
  const handleDeleteOrder = (data) => {
    if (data._reactName == "onClick") {
      http
        .delete(`/purchase/deleted/${ID}`)
        .then(function (response) {
          toast.error("Product removed successfully!!");
          Setcounts(counts + 1);
        })
        .catch(function (error) {
          console.log(error);
        });
    }
    SetData([]);
    SetPages(1);
    setDeleteModal(false);
  };

  // view invoice ditails
  const [Child_data, Set_Child_data] = useState([]);
  const [Master_data, Set_Master_data] = useState({});
  const [Business, Set_Business] = useState({});

  const View_invoce = async (id) => {
    http
      .get(`/franchisesale/invoice/${id}`)
      .then(function (response) {  
        Set_Child_data(response.data.Child);
        Set_Business(response.data.Business[0]);
        Set_Master_data(response.data.Master[0]);
      })
      .catch(function (error) {
        console.log(error);
      });
    setmodal_large(!false);
  };
  const handlePrint = () => {
    const printableArea = document.getElementById("printable-area");
    const clonedContent = printableArea.cloneNode(true);
    const printFrame = document.createElement("iframe");
    printFrame.style.display = "none";
    document.body.appendChild(printFrame);
    printFrame.onload = () => {
      const printDocument =
        printFrame.contentDocument || printFrame.contentWindow.document;
      const styleElement = document.createElement("style");
      styleElement.textContent = `
      @import url('https://cdn.jsdelivr.net/npm/bootstrap@5.3.1/dist/css/bootstrap.min.css');

        .formss {
            border: 1px solid black;
        }
  
        .invocess {
            border: 1px solid black;
            border-collapse: collapse;
            padding: 2px;
        }
  
        #per {
            padding-top: 0px;
            padding-bottom: 0px;
            text-align: right;
        }
  
        .header {
            display: flex;
            justify-content: space-around;
            align-items: center;
            margin: 0px auto;
        }
      `;
      printDocument.head.appendChild(styleElement);
      printDocument.body.appendChild(clonedContent);
      printFrame.contentWindow.print();
    };
    printFrame.src = "about:blank";
  };
  //  Filter data
  const [Payemnt, SetPayment] = useState();
  const [Check, SetCheck] = useState(false);
  const currentDate = new Date();
  const day = currentDate.getDate().toString().padStart(2, "0");
  const month = (currentDate.getMonth() + 1).toString().padStart(2, "0");
  const year = currentDate.getFullYear();
  const [Filter_Data, SetFilter_data] = useState({
    franchise_id: "",
    start_date: `${Number(month)}/${Number(day)}/${year}`,
    end_date: `${Number(month)}/${Number(day)}/${year}`,
    payment_method: "",
  });
  useEffect(() => {
    http
      .get(`/purchase/information`)
      .then(function (response) {
        SetPayment(response.data);
        SetCheck(true);
      })
      .catch(function (error) {
        console.log(error);
      });
  }, []);

  const handleDateChange = (selectedDates) => {
    if (selectedDates.length === 2) {
      const [start, end] = selectedDates;

      const start_date = start.toLocaleDateString("en-US", {
        day: "numeric",
        month: "numeric",
        year: "numeric",
      });

      const end_date = end.toLocaleDateString("en-US", {
        day: "numeric",
        month: "numeric",
        year: "numeric",
      });
      SetFilter_data({
        ...Filter_Data,
        start_date: start_date,
        end_date: end_date,
      });
    }
  };
  const Filter_data = () => {
    http
      .post(`/franchisesale/filter/data`, Filter_Data)
      .then(function (response) {
        SetData(response.data);
        SetNoMore(false);
      })
      .catch(function (error) {
        console.log(error);
      });
  };
  const totalQty = Data.reduce((acc, item) => acc + item.master_qty, 0);
  const totalAmount = Data.reduce(
    (acc, item) => acc + item.master_total_bill_amt,
    0
  );
  return (
    <div className="page-content">
      <DeleteModal
        show={deleteModal}
        onDeleteClick={handleDeleteOrder}
        onCloseClick={() => setDeleteModal(false)}
      />
      <Container fluid>
        <Row>
          <Col lg={12}>
            <Card>
              <CardHeader className="card-header border-0">
                <Row className="align-items-center gy-3">
                  <div className="col-sm">
                    <h5 className="card-title mb-0">Franchise Sales</h5>
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
                            const formattedDate = `${Number(month)}/${Number(
                              day
                            )}/${year}`;
                            SetFilter_data({
                              ...Filter_Data,
                              start_date: formattedDate,
                            });
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
                            const formattedDate = `${Number(month)}/${Number(
                              day
                            )}/${year}`;
                            SetFilter_data({
                              ...Filter_Data,
                              end_date: formattedDate,
                            });
                          }}
                        />
                      </div>
                      <div>
                        <button
                          className="btn btn-info w-100"
                          onClick={Filter_data}
                        >
                          Search
                        </button>
                      </div>  
                      {permission.find(permission => permission.permission_category === "SALE" && permission.permission_path === "2") 
                        &&  
                        <Link
                          to="/franchise-sale-create"
                          type="button"
                          className="btn fw-bold btn-success add-btn"
                          id="create-btn"
                        >
                          <i className="ri-add-line align-bottom me-1"></i> Add
                          Sale
                        </Link>
                      }
                    </div>
                  </div>
                </Row>
              </CardHeader>

              <CardBody className="pt-0">
                <div>
                  <Nav
                    className="nav-tabs nav-tabs-custom nav-success"
                    role="tablist"
                  ></Nav>
                  <InfiniteScroll
                    dataLength={Data.length}
                    // next={fetchData}
                    hasMore={NoMore}
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
                            Sr No
                          </th>
                          <th
                            title="Toggle SortBy"
                            style={{ cursor: "pointer" }}
                          >
                            Date
                          </th>
                          <th
                            title="Toggle SortBy"
                            style={{ cursor: "pointer" }}
                          >
                            Invoice No
                          </th>
                          <th
                            title="Toggle SortBy"
                            style={{ cursor: "pointer" }}
                          >
                            Franchise Name
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
                            Payment Term
                          </th>
                          <th
                            title="Toggle SortBy"
                            style={{ cursor: "pointer" }}
                          >
                            Grand total
                          </th>
                          <th>Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {Data.map((item, index) => (
                          <tr key={index}>
                            <td>
                              <a
                                className="fw-medium link-primary"
                                href="/apps-ecommerce-order-details"
                              >
                                {index + 1}
                              </a>
                            </td>
                            <td>{item.master_bill_date}</td>
                            <td>
                              {invoiceDetails ? invoiceDetails : ""}-
                              {item.master_invoice_no}
                            </td>
                            <td>{item.franchise_name}</td>
                            <td>{item.master_qty}</td>
                            <td>{item.payment_type}</td>
                            <td>{item.master_total_bill_amt}</td>
                            <td>
                              <ul className="list-inline hstack gap-2 mb-0">
                                {checkPermission("Purchase Create") ? (
                                  <li className="list-inline-item edit">
                                    <button
                                      className="text-primary d-inline-block edit-item-btn border-0 bg-transparent"
                                      onClick={() =>
                                        View_invoce(item.master_id)
                                      }
                                    >
                                      <i className="ri-printer-line fs-16" />
                                    </button>
                                  </li>
                                ) : (
                                  ""
                                )}

                                {/* {permission.find(permission => permission.permission_category === "SALE" && permission.permission_path === "3") 
                                  && 
                                  <li className="list-inline-item edit">
                                    <Link
                                      to={`/franchise-sale-edit/${item.master_id}`}
                                      className="text-primary d-inline-block edit-item-btn border-0 bg-transparent"
                                    >
                                      <i className="ri-pencil-fill fs-16" />
                                    </Link>
                                  </li>
                                } */}

                                {/* {checkPermission("Purchase Delete") ? ( */}
                                {permission.find(permission => permission.permission_category === "SALE" && permission.permission_path === "4") 
                                  && 
                                <li className="list-inline-item">
                                  <button
                                    onClick={() =>
                                      onClickDelete(item.master_id)
                                    }
                                    className="text-danger d-inline-block remove-item-btn  border-0 bg-transparent"
                                  >
                                    <i className="ri-delete-bin-5-fill fs-16" />
                                  </button>
                                </li>
                                }
                                {/* ) : (
                                  ""
                                )} */}
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
        {/* Large Modal */}
        <Modal
          size="xl"
          isOpen={modal_large}
          toggle={() => {
            tog_large();
          }}
        >
          <ModalHeader
            className="modal-title"
            id="myLargeModalLabel"
            toggle={() => {
              tog_large();
            }}
          >
            Invoice
          </ModalHeader>
          <ModalBody>
            <form className="formss" id="printable-area">
              <center>
                <div className="header">
                  {Business && Business.business_logo ? (
                    <img
                      src={`${IMG_API_URL}/business_images/${Business.business_logo}`}
                      alt={Business.business_logo}
                      style={{ marginTop: 14, marginBottom: 4 }}
                      width={120}
                      height={120}
                    />
                  ) : (
                    ""
                  )}

                  <div style={{ width: "400px" }}>
                    <b>
                      <h3 style={{ marginTop: 14, marginBottom: 4 }}>
                        ||
                        {Business && Business.business_name
                          ? Business.business_name
                          : ""}
                        ||
                      </h3>
                    </b>
                    <table>
                      <tbody>
                        <tr>
                          <th>Buniess Branch</th>
                          <th>
                            :{" "}
                            {Business && Business.business_branch_name
                              ? Business.business_branch_name
                              : ""}
                          </th>
                        </tr>
                        <tr>
                          <th>Buniess Email</th>
                          <th>
                            :{" "}
                            {Business && Business.business_company_email
                              ? Business.business_company_email
                              : ""}
                          </th>
                        </tr>
                        <tr>
                          <th>Buniess Mobile</th>
                          <th>
                            :{" "}
                            {Business && Business.business_company_phone_no
                              ? Business.business_company_phone_no
                              : ""}
                          </th>
                        </tr>
                        <tr>
                          <th>Buniess GST No </th>
                          <th>
                            :
                            {Business && Business.business_gst_no
                              ? Business.business_gst_no
                              : ""}
                          </th>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                  <div />
                </div>
                <div
                  style={{
                    marginTop: 10,
                    marginBottom: 10,
                    borderTop: "solid 1px",
                  }}
                />
                <h4>
                  <b>FRANCHISE SALE INVOICE</b>
                </h4>
                <table
                  style={{ width: "100%", border: "none" }}
                  className="invocess"
                >
                  <tbody>
                    <tr>
                      <td
                        className="invocess"
                        style={{ border: "none", borderTop: "1px solid black" }}
                      >
                        <b>Franchise Name </b>: {Master_data && Master_data.franchise_name}
                        <br />
                        <b>
                          Address &nbsp;&nbsp; &nbsp;&nbsp; &nbsp;&nbsp;
                          &nbsp;&nbsp; :{Master_data && Master_data.franchise_address}
                        </b>
                        <br />
                        <b>
                          State &nbsp;&nbsp;&nbsp;&nbsp; &nbsp;&nbsp;
                          &nbsp;&nbsp; &nbsp;&nbsp; &nbsp;&nbsp;&nbsp; : ----
                        </b>
                        <br />
                        <b>
                          Phone &nbsp;&nbsp;
                          &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                          :{Master_data && Master_data.franchise_mobile}
                        </b>
                        <br />
                      </td>
                      <td
                        className="invocess"
                        style={{ borderBottom: "none", borderRight: "none" }}
                      >
                        <b>
                          INVOICE NO.&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                          :&nbsp;
                          {invoiceDetails ? invoiceDetails : ""}-
                          {Master_data && Master_data.master_invoice_no}
                        </b>
                        <br />
                        <b>
                          Date&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                        </b>
                        : {Master_data && Master_data.master_bill_date}
                        <br />
                        <b> Payment Type&nbsp;&nbsp;&nbsp;&nbsp;</b>:&nbsp;
                        {Master_data && Master_data.payment_type}
                        <br />
                        <b>Supplier Type&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</b>
                        :&nbsp;
                        {Master_data && Master_data.franchise_group_name}
                        <br />
                      </td>
                    </tr>
                  </tbody>
                </table>
                <table
                  style={{ width: "100%", border: "none" }}
                  className="invocess"
                >
                  <tbody>
                    <tr>
                      <th className="invocess" style={{ borderLeft: "none" }}>
                        SR NO:
                      </th>
                      <th className="invocess">Product/Services</th>
                      <th className="invocess">HSN</th>
                      <th className="invocess">Qty.(unit)</th>
                      <th className="invocess">Rate</th>
                      <th className="invocess">
                        Dis <br /> (%)
                      </th>
                      <th className="invocess">Taxable Value</th>
                      <th className="invocess">GST (%) / Amt </th>
                      <th className="invocess">Total</th>
                    </tr>
                    {Child_data.map((item, index) => (
                      <tr key={index}>
                        <td
                          className="invocess"
                          id="per"
                          style={{ textAlign: "center", borderLeft: "none" }}
                        >
                          {index + 1}
                        </td>
                        <td
                          className="invocess"
                          id="per"
                          style={{ textAlign: "left" }}
                        >
                          {item.product_english_name}
                        </td>
                        <td className="invocess" id="per">
                          {item.product_hsn_code}
                        </td>
                        <td className="invocess" id="per">
                          {item.pos_qty}
                        </td>
                        <td className="invocess" id="per">
                          {item.pos_purchase_price}
                        </td>
                        <td className="invocess" id="per">
                          {item.pos_dis_value} <br />(
                          {item.pos_dis_percentage}
                          %)
                        </td>
                        <td className="invocess" id="per">
                          {item.pos_basic_total}
                        </td>
                        <td className="invocess" id="per">
                          {item.pos_gst_percentage} % &nbsp; /&nbsp;&nbsp;
                          {item.pos_gst_value}
                        </td>
                        <td className="invocess" id="per">
                          {item.pos_totalPrice}
                        </td>
                      </tr>
                    ))}

                    <tr style={{ borderStyle: "hidden" }}>
                      <td className="invocess" style={{ height: 24 }} />
                      <td className="invocess" style={{ height: 24 }} />
                      <td className="invocess" style={{ height: 24 }} />
                      <td className="invocess" style={{ height: 24 }} />
                      <td className="invocess" style={{ height: 24 }} />
                      <td className="invocess" style={{ height: 24 }} />
                      <td className="invocess" style={{ height: 24 }} />
                      <td className="invocess" style={{ height: 24 }} />
                      <td className="invocess" style={{ height: 24 }} />
                    </tr>
                    <tr />
                    <tr style={{ borderTop: "1px solid grey" }}>
                      <td
                        className="invocess"
                        id="per"
                        colSpan={3}
                        style={{ textAlign: "center", borderLeft: "none" }}
                      >
                        <b>Total</b>
                      </td>
                      <td className="invocess" id="per">
                        {Master_data && Master_data.pos_total_qty}
                      </td>
                      <td className="invocess" id="per">
                        {Master_data && Master_data.pos_total_purchase}
                      </td>
                      <td className="invocess" id="per">
                        {Master_data && Master_data.pos_total_discount}
                      </td>
                      <td className="invocess" id="per">
                        {Master_data && Master_data.pos_total_basic}
                      </td>
                      <td className="invocess" id="per">
                        {Master_data && Master_data.pos_total_gst}
                      </td>
                      <td
                        className="invocess"
                        id="per"
                        style={{ borderRight: "none" }}
                      >
                        <b> {Master_data && Master_data.master_total_bill_amt}</b>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </center>
              <div style={{ display: "flex" }}>
                <table
                  style={{ width: "66%", float: "left", border: "none" }}
                  className="invocess"
                >
                  <tbody>
                    <tr>
                      <th
                        className="invocess"
                        style={{
                          width: "8%",
                          borderTop: "none",
                          borderLeft: "none",
                        }}
                      >
                        GST %
                      </th>
                      <th
                        className="invocess"
                        style={{ width: "18%", borderTop: "none" }}
                      >
                        Taxable value
                      </th>
                      <th
                        className="invocess"
                        style={{ width: "10%", borderTop: "none" }}
                      >
                        CGST
                      </th>
                      <th
                        className="invocess"
                        style={{ width: "10%", borderTop: "none" }}
                      >
                        SGST
                      </th>
                      <th
                        className="invocess"
                        style={{ width: "10%", borderTop: "none" }}
                      >
                        IGST
                      </th>
                      <th
                        className="invocess"
                        style={{
                          width: "10%",
                          borderTop: "none",
                          borderRight: "none",
                        }}
                      >
                        Total GST
                      </th>
                    </tr>
                  </tbody>
                  <tbody>
                    <tr>
                      <td
                        className="invocess"
                        id="per"
                        style={{ borderLeft: "none" }}
                      >
                        -
                      </td>
                      <td className="invocess" id="per">
                        -
                      </td>
                      <td className="invocess" id="per">
                        -
                      </td>
                      <td className="invocess" id="per">
                        -
                      </td>
                      <td className="invocess" id="per">
                        -
                      </td>
                      <td
                        className="invocess"
                        id="per"
                        style={{ borderRight: "none" }}
                      >
                        -
                      </td>
                    </tr>
                    <tr>
                      <td
                        className="invocess"
                        id="per"
                        style={{ borderLeft: "none" }}
                      >
                        -
                      </td>
                      <td className="invocess" id="per">
                        -
                      </td>
                      <td className="invocess" id="per">
                        -
                      </td>
                      <td className="invocess" id="per">
                        -
                      </td>
                      <td className="invocess" id="per">
                        -
                      </td>
                      <td
                        className="invocess"
                        id="per"
                        style={{ borderRight: "none" }}
                      >
                        -
                      </td>
                    </tr>
                    <tr>
                      <td
                        className="invocess"
                        id="per"
                        style={{ borderLeft: "none" }}
                      >
                        -
                      </td>
                      <td className="invocess" id="per">
                        -
                      </td>
                      <td className="invocess" id="per">
                        -
                      </td>
                      <td className="invocess" id="per">
                        -
                      </td>
                      <td className="invocess" id="per">
                        -
                      </td>
                      <td
                        className="invocess"
                        id="per"
                        style={{ borderRight: "none" }}
                      >
                        -
                      </td>
                    </tr>
                    <tr>
                      <td
                        className="invocess"
                        id="per"
                        style={{ borderLeft: "none" }}
                      >
                        -
                      </td>
                      <td className="invocess" id="per">
                        -
                      </td>
                      <td className="invocess" id="per">
                        -
                      </td>
                      <td className="invocess" id="per">
                        -
                      </td>
                      <td className="invocess" id="per">
                        -
                      </td>
                      <td
                        className="invocess"
                        id="per"
                        style={{ borderRight: "none" }}
                      >
                        -
                      </td>
                    </tr>
                    <tr>
                      <td
                        className="invocess"
                        id="per"
                        style={{ borderLeft: "none" }}
                      >
                        -
                      </td>
                      <td className="invocess" id="per">
                        -
                      </td>
                      <td className="invocess" id="per">
                        -
                      </td>
                      <td className="invocess" id="per">
                        -
                      </td>
                      <td className="invocess" id="per">
                        -
                      </td>
                      <td
                        className="invocess"
                        id="per"
                        style={{ borderRight: "none" }}
                      >
                        -
                      </td>
                    </tr>
                    <tr />
                    <tr style={{ borderStyle: "hidden" }}>
                      <td
                        className="invocess"
                        rowSpan={3}
                        colSpan={6}
                        align="left"
                        style={{ paddingTop: 25 }}
                      >
                        <center>
                          <b>
                            Amount in words :
                            {Master_data && Master_data.master_total_bill_amt &&
                              Master_data.master_total_bill_amt ? (
                              <span id="word">
                                {numberToWords.toWords(
                                  Math.round(
                                    Master_data.master_total_bill_amt
                                  )
                                )}
                              </span>
                            ) : (
                              ""
                            )}
                          </b>
                        </center>
                      </td>
                    </tr>
                  </tbody>
                </table>
                <table
                  style={{ width: "34%", float: "left", border: "none" }}
                  className="invocess"
                >
                  <tbody>
                    <tr>
                      <td
                        className="invocess"
                        style={{ width: "74%", borderTop: "none" }}
                      >
                        <b>Total Amt Before Tax</b>
                      </td>
                      <td
                        className="invocess"
                        id="per"
                        style={{
                          width: "26%",
                          borderTop: "none",
                          borderRight: "none",
                        }}
                      >
                        {Master_data && Master_data.pos_total_basic}
                      </td>
                    </tr>
                    <tr>
                      <td className="invocess">
                        <b> Total Discount Amt (-)</b>
                      </td>
                      <td
                        className="invocess"
                        style={{ borderRight: "none" }}
                        id="per"
                      >
                        {Master_data && Master_data.pos_total_discount}
                      </td>
                    </tr>
                    <tr>
                      <td className="invocess">
                        <b> Total GST Amt</b>
                      </td>
                      <td
                        className="invocess"
                        style={{ borderRight: "none" }}
                        id="per"
                      >
                        {Master_data && Master_data.pos_total_gst}
                      </td>
                    </tr>
                    <tr>
                      <td className="invocess">
                        <b> Other Charges</b>
                      </td>
                      <td
                        className="invocess"
                        style={{ borderRight: "none" }}
                        id="per"
                      >
                        0
                      </td>
                    </tr>
                    <tr>
                      <td className="invocess">
                        <b> Net Total</b>
                      </td>
                      <td
                        className="invocess"
                        style={{ borderRight: "none", textAlign: "right" }}
                        id="final__total"
                      >
                        {Master_data && Master_data.pos_total_bill_amount}
                      </td>
                    </tr>
                    <tr>
                      <td className="invocess">
                        <b> RoundOff Amount</b>
                      </td>
                      <td
                        className="invocess"
                        style={{ borderRight: "none", textAlign: "right" }}
                        id="round__off"
                      >
                        {Master_data && (
                          Master_data.master_total_bill_amt -
                          Math.floor(Master_data.master_total_bill_amt)
                        ).toFixed(2)}
                      </td>
                    </tr>
                    <tr>
                      <td className="invocess">
                        <b>Grand Total</b>
                      </td>
                      <td
                        className="invocess"
                        style={{ borderRight: "none", textAlign: "right" }}
                      >
                        <b>
                          <input
                            type="hidden"
                            id="gt_totall"
                            defaultValue="{{ $total + $item->other_charge_amt }}"
                          />
                          {Master_data && Math.round(Master_data.master_total_bill_amt)}
                        </b>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <table
                style={{
                  width: "100%",
                  border: "none",
                  borderTop: "1px solid",
                }}
                className="invocess"
              >
                <tbody>
                  <tr>
                    <th
                      className="invocess"
                      rowSpan={6}
                      align="left"
                      style={{
                        borderLeft: "none",
                        borderRight: "none",
                        fontSize: "smaller",
                      }}
                    >
                      <table>
                        <tbody>
                          <tr>
                            <th>Bank Name</th>
                            <th>
                              :{" "}
                              {Business && Business.business_bank_name
                                ? Business.business_bank_name
                                : ""}
                            </th>
                          </tr>
                          <tr>
                            <th>Bank Branch</th>
                            <th>
                              :{" "}
                              {Business && Business.business_branch_name
                                ? Business.business_branch_name
                                : ""}
                            </th>
                          </tr>
                          <tr>
                            <th>Bank Account Holder</th>
                            <th>
                              :{" "}
                              {Business && Business.business_name
                                ? Business.business_name
                                : ""}
                            </th>
                          </tr>
                          <tr>
                            <th>Bank Account No</th>
                            <th>
                              :{" "}
                              {Business && Business.business_account_number
                                ? Business.business_account_number
                                : ""}
                            </th>
                          </tr>
                          <tr>
                            <th>Bank Branch IFSC</th>
                            <th>
                              :{" "}
                              {Business && Business.business_ifsc_code
                                ? Business.business_ifsc_code
                                : ""}
                            </th>
                          </tr>
                        </tbody>
                      </table>
                    </th>
                  </tr>
                </tbody>
              </table>
              <table
                style={{ width: "100%", border: "none" }}
                className="invocess"
              >
                <tbody>
                  <tr>
                    <td className="invocess" style={{ border: "none" }}>
                      <b>Terms And Conditions</b>
                      <br />
                      <div
                        dangerouslySetInnerHTML={{
                          __html:
                            Business && Business.business_terms_conditions
                              ? Business.business_terms_conditions
                              : "",
                        }}
                      ></div>

                      <br />
                      <br />
                    </td>
                    <td className="invocess">
                      We here by certify that the above particulars given are
                      true &amp; correct.
                      <br />
                      <b>
                        For,||{" "}
                        {Business && Business.business_name
                          ? Business.business_name
                          : ""}{" "}
                        ||
                      </b>
                      <br />
                      <br />
                      <b style={{ border: "none", float: "right" }}>
                        {Business.business_logo && Business.business_logo ? (
                          <img
                            src={`${IMG_API_URL}/business_images/${Business.business_signature}`}
                            alt={Business.business_signature}
                            height={"100px"}
                            width={"100%"}
                          />
                        ) : (
                          ""
                        )}
                        <br />
                        Authorized Signature
                      </b>
                    </td>
                  </tr>
                </tbody>
              </table>
            </form>
          </ModalBody>
          <div className="hstack gap-2 justify-content-center my-2">
            <button
              type="button"
              onClick={() => {
                tog_large();
              }}
              className="btn btn-danger"
            >
              <i className="ri-close-line me-1 align-middle" />
              Close
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              onClick={() => handlePrint()}
            >
              <i className="ri-save-3-line align-bottom me-1"></i>
              Print
            </button>
          </div>
        </Modal>
        <ToastContainer closeButton={false} limit={1} />
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
    </div>
  );
};

export default FranchiseSaleList;
