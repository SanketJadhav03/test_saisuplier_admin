import React, { useEffect, useState } from "react";
import numberToWords from "number-to-words";
import Flatpickr from "react-flatpickr";
import "./Invoice.css";
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
  Table,
  ModalFooter,
  Label,
  Input,
} from "reactstrap";
import { ToastContainer, toast } from "react-toastify";
import { Link, useNavigate } from "react-router-dom";
import AuthUser from "../../helpers/Authuser";
import DeleteModal from "../../Components/Common/DeleteModal";
import { IMG_API_URL, sendWhatsApp } from "../../helpers/url_helper";
import InfiniteScroll from "react-infinite-scroll-component";
import Select from "react-select";
import PrintModal from "./PrintModal";

const QuotationList = () => {
  const { http, checkPermission, permission } = AuthUser();
  const [Data, SetData] = useState([]);
  const [counts, Setcounts] = useState(1);
  const [rejectedModal, setRejectedModal] = useState(false);
  const [rejectedReason, setRejectedReason] = useState({});
  const [modal_standard, setmodal_standard] = useState(false);
  const [invoiceDetails] = useState(
    JSON.parse(sessionStorage.getItem("authUser")).invoiceDetails.intial_latter,
  );
  const [modal_large, setmodal_large] = useState(false);
  function tog_large() {
    setmodal_large(!modal_large);
  }
  const [activeFilter, setActiveFilter] = useState("today");
  const formatDate = (date) => date.toLocaleDateString("en-GB"); // DD/MM/YYYY
  const filters = [
    { label: "Today", value: "today" },
    { label: "Yesterday", value: "yesterday" },
    { label: "This Week", value: "this_week" },
    { label: "Last Week", value: "last_week" },
    { label: "This Month", value: "this_month" },
    { label: "Last Month", value: "last_month" },
    { label: "This Year", value: "this_year" },
    { label: "Last Year", value: "last_year" },
  ];
  const handleDateFilter = (type) => {
    let startDate = null;
    let endDate = null;

    const today = new Date();

    switch (type) {
      case "today":
        startDate = endDate = today;
        break;

      case "yesterday":
        startDate = endDate = new Date(today.setDate(today.getDate() - 1));
        break;

      case "this_week": {
        const firstDay = new Date(today);
        firstDay.setDate(today.getDate() - today.getDay());
        startDate = firstDay;
        endDate = new Date();
        break;
      }

      case "last_week": {
        const lastWeekEnd = new Date(today);
        lastWeekEnd.setDate(today.getDate() - today.getDay() - 1);

        const lastWeekStart = new Date(lastWeekEnd);
        lastWeekStart.setDate(lastWeekEnd.getDate() - 6);

        startDate = lastWeekStart;
        endDate = lastWeekEnd;
        break;
      }

      case "this_month":
        startDate = new Date(today.getFullYear(), today.getMonth(), 1);
        endDate = new Date();
        break;
      case "last_month":
        startDate = new Date(today.getFullYear(), today.getMonth() - 1, 1);
        endDate = new Date(today.getFullYear(), today.getMonth(), 0);
        break;
      case "last_year":
        startDate = new Date(today.getFullYear() - 1, 0, 1);
        endDate = new Date(today.getFullYear() - 1, 11, 31);
        break;

      case "this_year":
        startDate = new Date(today.getFullYear(), 0, 1);
        endDate = new Date();
        break;

      default:
        return;
    }

    setActiveFilter(type);

    SetFilter_data({
      ...Filter_Data,
      start_date: formatDate(startDate),
      end_date: formatDate(endDate),
    });
  };
  // infinity
  const [Pages, SetPages] = useState(1);
  const [NoMore, SetNoMore] = useState(true);
  useEffect(() => {
    document.title = "Saisupplier Admin | Quotation List";
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

  // view invoice ditails
  const [Child_data, Set_Child_data] = useState([]);
  const [Master_data, Set_Master_data] = useState([]);
  const [Business, Set_Business] = useState([]);
  const [SelectedPoID, setSelectedPoID] = useState(0);
  const View_invoce = (id) => {
    setSelectedPoID(id);
    http
      .get(`/purchase/invoice/${id}`)
      .then(function (response) {
        Set_Child_data(response.data.Child);
        Set_Business(response.data.Business[0]);
        Set_Master_data(response.data.Master);
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
    user_id: "",
    start_date: `${Number(day)}/${Number(month)}/${year}`,
    end_date: `${Number(day)}/${Number(month)}/${year}`,
    payment_method: "",
  });
  const [count, SetCount] = useState(0);
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
    Filter_data();
  }, [count + 1]);
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
    SetCount(count + 1);
    SetPages(1);
    setDeleteModal(false);
  };

  const handleDateChange = (selectedDates) => {
    if (selectedDates.length === 2) {
      const [start, end] = selectedDates;

      const start_date = start.toLocaleDateString("en-GB", {
        day: "numeric",
        month: "numeric",
        year: "numeric",
      });

      const end_date = end.toLocaleDateString("en-GB", {
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
      .post(`/quotation/filter/data`, Filter_Data)
      .then(function (response) {
        SetData(response.data);
        SetNoMore(false);
      })
      .catch(function (error) {
        console.log(error);
      });
  };
  useEffect(() => {
    Filter_data();
  }, [Filter_Data.start_date, Filter_Data.end_date]);

  const [SearchQuery, setSearchQuery] = useState("");
  const ChangInput = (e, index, field, check) => {
    const updatedProductList = [...Child_data];
    const updatedProduct = { ...updatedProductList[index] };

    if (check === 1) {
      if (field === "purchase_qty") {
        updatedProduct[field] = parseInt(updatedProduct[field]) + 1;
      } else {
        updatedProduct[field] += 1;
      }
    } else if (check === 2) {
      if (field === "purchase_qty" && updatedProduct[field] >= 2) {
        updatedProduct[field] -= 1;
      }
    } else {
      if (field === "purchase_qty") {
        const inputValue = parseInt(e.target.value);
        if (!isNaN(inputValue) && inputValue >= 0) {
          updatedProduct[field] = inputValue;
        }
      } else if (check == "pk") {
        updatedProduct[field] = parseFloat(e);
      } else {
        updatedProduct[field] = parseFloat(e.target.value);
      }
    }
    const purchase_qty = updatedProduct.purchase_qty;
    const dis_pre = updatedProduct.purchase_dis_percentage;
    const dis_values =
      (purchase_qty * updatedProduct.purchase_p_price * dis_pre) / 100;
    const basic = purchase_qty * updatedProduct.purchase_p_price - dis_values;
    const gstValue = (basic * updatedProduct.purchase_gst_percentage) / 100;
    const Subtotal = basic + gstValue;
    updatedProduct.purchase_qty = purchase_qty;
    updatedProduct.purchase_net_total = Subtotal.toFixed(2);
    updatedProductList[index] = updatedProduct;
    Set_Child_data(updatedProductList);
  };
  const navigate = useNavigate();

  const totalQty = Data.reduce((acc, item) => acc + item.purchase_total_qty, 0);
  const totalAmount = Data.reduce(
    (acc, item) =>
      acc +
      (parseFloat(
        parseFloat(item.gstTotal) + parseFloat(item.purchase_total_purchase),
      ) +
        (isNaN(item.other_charge_amount)
          ? 0
          : parseFloat(item.other_charge_amount))),
    0,
  );

  const statusMap = {
    4: "Accepted",
    5: "Rejected",
    3: "Generated",
  };

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
                <div className=" container px-4">
                  <Row className="align-items-center gy-3 pb-4">
                    <div className="col-4">
                      <div className="col-12 text-center">
                        <div className="col-sm">
                          <h3 className="text-center fw-bold mb-0">
                            Quotation List
                          </h3>
                        </div>
                      </div>
                    </div>
                    <div className="col-8 btn-group flex-wrap gap-2">
                      {filters.map((item) => (
                        <button
                          key={item.value}
                          className={`btn btn-sm rounded-pill ${
                            activeFilter === item.value
                              ? "btn-dark  text-white"
                              : "btn-outline-dark"
                          }`}
                          onClick={() => handleDateFilter(item.value)}
                        >
                          {item.label}
                        </button>
                      ))}
                    </div>
                  </Row>
                </div>

                <Row className="align-items-center mt-1 gy-3">
                  <div className="col-sm-auto row w-100 mt-3">
                    <div className="col-5">
                      <div className="fw-bold">
                        Serach by Name / Mobile Number / Email / Ifsc Code /
                        Branch Code
                      </div>
                      <input
                        className="form-control"
                        type="search"
                        placeholder="Search by Name / Mobile Number / Email / Ifsc Code / Branch Code"
                        onChange={(e) => {
                          const query = e.target.value?.toLowerCase();
                          setSearchQuery(query); // store search query in state
                        }}
                      />
                    </div>
                    <div className="col-7 d-flex gap-2 justify-content-end">
                      <div>
                        <div className="fw-bold">Start Date</div>
                        <Flatpickr
                          className="form-control"
                          style={{ width: "120px" }}
                          options={{
                            dateFormat: "d/m/Y",
                            defaultDate: "today",
                          }}
                          value={Filter_Data.start_date}
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
                            const formattedDate = `${Number(day)}/${Number(
                              month,
                            )}/${year}`;
                            SetFilter_data({
                              ...Filter_Data,
                              start_date: formattedDate,
                            });
                          }}
                        />
                      </div>
                      <div>
                        <div className="fw-bold">End Date</div>
                        <Flatpickr
                          value={Filter_Data.end_date}
                          className="form-control"
                          style={{ width: "120px" }}
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
                            const formattedDate = `${Number(day)}/${Number(
                              month,
                            )}/${year}`;
                            SetFilter_data({
                              ...Filter_Data,
                              end_date: formattedDate,
                            });
                          }}
                        />
                      </div>
                      {/* <div>
                        <button
                          className="btn mt-3 btn-info w-100"
                          onClick={Filter_data}
                        >
                          Search
                        </button>
                      </div> */}
                      {permission.find(
                        (permission) =>
                          permission.permission_category === "QUOTATION" &&
                          permission.permission_path === "2",
                      ) && (
                        <Link
                          to="/quotation-create"
                          type="button"
                          className="btn mt-3 fw-bold btn-success add-btn"
                          id="create-btn"
                        >
                          <i className="ri-add-line align-bottom me-1"></i>{" "}
                          Create Quotation
                        </Link>
                      )}
                    </div>
                    {/* <button
                        type="button"
                        className="btn btn-primary"
                        onClick={() => setmodal_standard(!modal_standard)}
                      >
                        <i className="ri-file-download-line align-bottom me-1"></i>
                        Filter
                      </button> */}

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
                            {Check ? (
                              <Select
                                id="contactnumberInput"
                                className="fw-bold"
                                onChange={(e) =>
                                  SetFilter_data({
                                    ...Filter_Data,
                                    user_id: e.value,
                                  })
                                }
                                options={
                                  Payemnt.customer &&
                                  Payemnt.customer.map((customer) => ({
                                    value: customer.user_id,
                                    label: customer.user_name,
                                  }))
                                }
                              />
                            ) : (
                              ""
                            )}
                          </Col>
                          <Col xl={12} md={12} style={{ marginBottom: "10px" }}>
                            <div className="col-sm-auto ">
                              <div className="input-group">
                                <Flatpickr
                                  className="form-control border-1 dash-filter-picker shadow"
                                  options={{
                                    mode: "range",
                                    dateFormat: "d-M-Y",
                                  }}
                                  placeholder="Enter Start Date And End Date"
                                  onChange={handleDateChange}
                                />
                                <div className="input-group-text bg-primary border-primary text-white">
                                  <i className="ri-calendar-2-line"></i>
                                </div>
                              </div>
                            </div>
                          </Col>
                          <Col xl={12} md={12} style={{ marginBottom: "10px" }}>
                            {Check ? (
                              <Select
                                name="product_category"
                                id="contactnumberInput"
                                className="fw-bold"
                                onChange={(e) =>
                                  SetFilter_data({
                                    ...Filter_Data,
                                    payment_method: e.value,
                                  })
                                }
                                options={
                                  Payemnt.payment_term &&
                                  Payemnt.payment_term.map((payment_term) => ({
                                    value: payment_term.payment_term_id,
                                    label: payment_term.payment_term_type,
                                  }))
                                }
                              />
                            ) : (
                              ""
                            )}
                          </Col>
                          <Col xl={12} md={12} style={{ marginBottom: "10px" }}>
                            <button
                              className="btn btn-success w-100"
                              onClick={() => {
                                setmodal_standard(!modal_standard);
                              }}
                            >
                              Filter
                            </button>
                          </Col>
                          <Col xl={12} md={12} style={{ marginBottom: "10px" }}>
                            <button
                              className="btn btn-info w-100"
                              onClick={() => {
                                setmodal_standard(!modal_standard);
                              }}
                            >
                              Show All Bills
                            </button>
                          </Col>
                        </Row>
                      </ModalBody>
                      {/* <ModalFooter>
                          <Button
                            color="danger"
                            onClick={() => {
                              setmodal_standard(!modal_standard);
                            }}
                          >
                            Close
                          </Button>
                        </ModalFooter> */}
                    </Modal>
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
                            Order No
                          </th>
                          <th
                            title="Toggle SortBy"
                            style={{ cursor: "pointer" }}
                          >
                            Bank / Business Info
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
                            Grand total
                          </th>
                          <th
                            title="Toggle SortBy"
                            style={{ cursor: "pointer" }}
                          >
                            Quotation Status
                          </th>
                          <th
                            title="Toggle SortBy"
                            style={{ cursor: "pointer" }}
                          >
                            Generate Invoice
                          </th>
                          <th>Action</th>
                        </tr>
                      </thead>
                      {permission.find(
                        (permission) =>
                          permission.permission_category === "QUOTATION" &&
                          permission.permission_path === "1",
                      ) ? (
                        <tbody>
                          {[
                            ...new Map(
                              (Data || [])
                                .filter((item) => {
                                  const query =
                                    SearchQuery?.toLowerCase() || "";
                                  return (
                                    item.master_name
                                      ?.toLowerCase()
                                      .includes(query) ||
                                    item.user_name
                                      ?.toLowerCase()
                                      .includes(query) ||
                                    item.purchase_invoice_no
                                      ?.toLowerCase()
                                      .includes(query) ||
                                    item.user_unique_id
                                      ?.toLowerCase()
                                      .includes(query) ||
                                    item.master_ifsc
                                      ?.toLowerCase()
                                      .includes(query) ||
                                    item.user_mobile
                                      ?.toString()
                                      .toLowerCase()
                                      .includes(query) ||
                                    item.master_mobile
                                      ?.toString()
                                      .toLowerCase()
                                      .includes(query) ||
                                    item.user_email
                                      ?.toLowerCase()
                                      .includes(query)
                                  );
                                })
                                .map((item) => [
                                  item.purchase_invoice_no,
                                  item,
                                ]),
                            ).values(),
                          ]
                            .sort((a, b) =>
                              // This sorts them in ascending order (1, 2, 3...)
                              a.purchase_invoice_no
                                .toString()
                                .localeCompare(
                                  b.purchase_invoice_no.toString(),
                                  undefined,
                                  { numeric: true, sensitivity: "base" },
                                ),
                            )
                            .reverse()
                            .map((item, index) => (
                              <tr key={index}>
                                <td>
                                  <a
                                    className="fw-medium link-primary"
                                    href="/apps-ecommerce-order-details"
                                  >
                                    {index + 1}
                                  </a>
                                </td>
                                <td>{item.purchase_start_date}</td>
                                <td>
                                  {/* {invoiceDetails ? invoiceDetails : ""}- */}
                                  PO-{item.purchase_invoice_no}
                                </td>
                                <td style={{ maxWidth: "120px" }}>
                                  <div
                                    style={{
                                      whiteSpace: "normal",
                                      wordBreak: "break-word",
                                    }}
                                  >
                                    {item.user_type == 1
                                      ? item.user_name
                                      : item.master_name}
                                    {item.user_type == 3
                                      ? ` - ${item.master_branch_name}`
                                      : " "}
                                    {item.user_type == 3
                                      ? ` - ${item.master_branch_code}`
                                      : " "}
                                  </div>
                                </td>
                                <td>{item.purchase_total_qty}</td>
                                {/* <td>{item.payment_term_type}</td> */}

                                <td>
                                  ₹{" "}
                                  {(() => {
                                    const gst = Number(item.gstTotal);
                                    const purchase = Number(
                                      item.purchase_total_purchase,
                                    );
                                    const other = Number(
                                      item.other_charge_amount,
                                    );
                                    const weightAmount = Number(
                                      item.transport_types_total_charge,
                                    );

                                    const total =
                                      (isNaN(gst) ? 0 : gst) +
                                      (isNaN(purchase) ? 0 : purchase) +
                                      (isNaN(other) ? 0 : other) +
                                      (isNaN(weightAmount) ? 0 : weightAmount);

                                    return total.toFixed(2);
                                  })()}
                                </td>
                                <td style={{ maxWidth: "140px" }}>
                                  <div
                                    style={{
                                      whiteSpace: "normal",
                                      wordBreak: "break-word",
                                    }}
                                  >
                                    <mark className="px-2 rounded shadow">
                                      {item.purchase_status == "5" &&
                                        "Rejected"}
                                      {item.purchase_status == "6" &&
                                        "Objection"}
                                      {item.purchase_status == "2" && "Pending"}
                                      {item.purchase_status == "4" &&
                                        "Approve"}{" "}
                                      by{" "}
                                      {item.user_type == 1
                                        ? item.user_name
                                        : item.master_name}
                                    </mark>
                                  </div>
                                </td>
                                <td>
                                  {item.purchase_status == "5" ? (
                                    <button
                                      className="btn btn-danger btn-sm d-flex align-items-center gap-2 shadow"
                                      onClick={() => {
                                        setRejectedReason(item);
                                        //console.log(item);
                                        setRejectedModal(true);
                                      }}
                                    >
                                      <i className="mdi mdi-close fs-5"></i>
                                      Rejected
                                    </button>
                                  ) : item.purchase_status == "6" ? (
                                    <button
                                      className="btn btn-outline-dark btn-sm d-flex align-items-center gap-2 shadow"
                                      onClick={() => {
                                        setRejectedReason(item);
                                        
                                       // console.log(item.purchase_rejected_reason);
                                        setRejectedModal(true);
                                      }}
                                    >
                                      <i className="mdi mdi-alert-circle text-outline-dark fs-5"></i>
                                      Objection
                                    </button>
                                  ) : item.purchase_status == "3" ? (
                                    <button
                                      className="btn btn-success btn-sm d-flex align-items-center gap-2 shadow"
                                       
                                    >
                                      <i className="mdi mdi-check fs-5"></i>
                                      Invoice Generated
                                    </button>
                                  ) : (
                                    <button
                                      className="btn btn-outline-warning btn-sm d-flex align-items-center gap-2 shadow text-dark fw-bold"
                                      onClick={() =>
                                        navigate(
                                          `/generate-invoice/${item.purchase_prchase_id}`,
                                        )
                                      }
                                    >
                                      <i className="mdi mdi-send-outline fs-5"></i>
                                      Generate Invoice
                                    </button>
                                  )}
                                </td>
                                <td>
                                  <ul className="list-inline hstack gap-2 mb-0">
                                    <li className="list-inline-item whatsapp">
                                      <div
                                        className="btn btn-success btn-sm"
                                        onClick={() => {
                                          sendWhatsApp(
                                            item.user_mobile,
                                            [item.master_name],
                                            "quotation_sent",
                                          );
                                        }}
                                      >
                                        <i className="ri-whatsapp-line  "></i>
                                      </div>
                                    </li>
                                    <li className="list-inline-item edit">
                                      <button
                                        className="text-primary d-inline-block edit-item-btn border-0 bg-transparent"
                                        onClick={() =>
                                          View_invoce(item.purchase_prchase_id)
                                        }
                                      >
                                        <i className="ri-printer-line fs-16" />
                                      </button>
                                    </li>

                                    {item.purchase_status != "3" &&
                                      permission.find(
                                        (permission) =>
                                          permission.permission_category ===
                                            "QUOTATION" &&
                                          permission.permission_path === "3",
                                      ) && (
                                        <li className="list-inline-item edit">
                                          <Link
                                            to={`/quotation-edit/${item.purchase_prchase_id}`}
                                            className="text-primary d-inline-block edit-item-btn border-0 bg-transparent"
                                          >
                                            <i className="ri-pencil-fill fs-16" />
                                          </Link>
                                        </li>
                                      )}

                                    {item.purchase_status != "3" &&
                                      permission.find(
                                        (permission) =>
                                          permission.permission_category ===
                                            "QUOTATION" &&
                                          permission.permission_path === "4",
                                      ) && (
                                        <li className="list-inline-item">
                                          <button
                                            onClick={() =>
                                              onClickDelete(
                                                item.purchase_prchase_id,
                                              )
                                            }
                                            className="text-danger d-inline-block remove-item-btn  border-0 bg-transparent"
                                          >
                                            <i className="ri-delete-bin-5-fill fs-16" />
                                          </button>
                                        </li>
                                      )}
                                    {item.purchase_status == "3" && (
                                      <li>Completed</li>
                                    )}
                                  </ul>
                                </td>
                              </tr>
                            ))}
                        </tbody>
                      ) : (
                        <tbody className="text-center text-danger fw-bold">
                          <tr>
                            <td colSpan={9}>You Are not Allowed !</td>
                          </tr>
                        </tbody>
                      )}
                    </table>
                  </InfiniteScroll>
                </div>
              </CardBody>
            </Card>
          </Col>
        </Row>

        <Modal
          isOpen={rejectedModal}
          size="md"
          toggle={() => setRejectedModal(!rejectedModal)}
          centered
        >
          <ModalHeader toggle={() => setRejectedModal(false)}>
            Reason Section
          </ModalHeader>

          <ModalBody>
            <div className="mb-3">
              <Label htmlFor="reject-reason" className="form-label">
                Reason:
              </Label>
              {rejectedReason.purchase_rejected_reason || "null"}
            </div>
          </ModalBody>

          <ModalFooter>
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => setRejectedModal(false)}
            >
              Close
            </button>
          </ModalFooter>
        </Modal>
        {/* Large Modal */}
        {modal_large ? (
          <PrintModal
            status={2}
            id={SelectedPoID}
            modal_large={modal_large}
            togg_large={() => tog_large(false)}
          />
        ) : (
          ""
        )}
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

export default QuotationList;
