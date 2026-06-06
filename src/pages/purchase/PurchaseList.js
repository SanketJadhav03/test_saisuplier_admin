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
} from "reactstrap";
import { ToastContainer, toast } from "react-toastify";
import { Link, useNavigate } from "react-router-dom";
import AuthUser from "../../helpers/Authuser";
import DeleteModal from "../../Components/Common/DeleteModal";
import { IMG_API_URL, sendWhatsApp } from "../../helpers/url_helper";
import InfiniteScroll from "react-infinite-scroll-component";
import Select from "react-select";
import PrintModal from "./PrintModal";

const PurchaseList = () => {
  const { http, checkPermission, permission } = AuthUser();
  const [Data, SetData] = useState([]);
  const [counts, Setcounts] = useState(1);
  const [modal_standard, setmodal_standard] = useState(false);
  const [invoiceDetails] = useState(
    JSON.parse(sessionStorage.getItem("authUser")).invoiceDetails.intial_latter,
  );
  const [modal_large, setmodal_large] = useState(false);
  function tog_large() {
    setmodal_large(!modal_large);
  }
  // infinity
  const [Pages, SetPages] = useState(1);
  const [NoMore, SetNoMore] = useState(true);
  useEffect(() => {
    document.title = "Saisupplier Admin | Purchase Index";

    // http
    //   .get(`/purchase/list?page=${Pages}&limit=30`)
    //   .then(function (response) {
    //     SetData([...Data, ...response.data]);
    //     SetPages(Pages + 1);
    //     if (response.data.length === 0) {
    //       SetNoMore(false);
    //     }
    //   })
    //   .catch(function (error) {
    //     console.log(error);
    //     SetNoMore(false);
    //   });
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
  const [SearchQuery, setSearchQuery] = useState("");

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
   handleDateFilter("this_month");
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
      .post(`/purchase/filter/data`, Filter_Data)
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

  const [activeFilter, setActiveFilter] = useState("this_month");
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
  const navigate = useNavigate();
  const generatingQuatation = (id) => {
    http
      .get(`/generate/quotation/${id}`)
      .then(function (response) {
        toast.success(response.data.message);
        navigate(`/quotation-edit/${id}`);
      })
      .catch(function (error) {
        console.log(error);
      });
  };
  const totalQty = Data.reduce((acc, item) => acc + item.purchase_total_qty, 0);
  const totalAmount = Data.reduce(
    (acc, item) => acc + item.purchase_total_bill_amount,
    0,
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
                <div className="container px-4">
                  <Row className="align-items-center gy-3 pb-4">
                    <div className="col-4">
                      <div className="col-12 text-center">
                        <div className="col-sm">
                          <h3 className="text-center fw-bold mb-0">
                            Purchase List({" "}
                            {
                              [
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
                                          .includes(query) ||
                                        item.master_pincode
                                          ?.toLowerCase()
                                          .includes(query) ||
                                        item.master_branch_name
                                          ?.toLowerCase()
                                          .includes(query)
                                      );
                                    })
                                    .map((item) => [
                                      item.purchase_invoice_no,
                                      item,
                                    ]),
                                ).values(),
                              ]?.length
                            }{" "}
                            )
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
                <Row className="g-4 mt-2">
                  <Col lg={4}>
                    <Card className="h-100 border-0 shadow-sm rounded-4">
                      <CardBody className="p-4">
                        <div className="d-flex align-items-center">
                          <div
                            className="rounded-circle bg-primary bg-opacity-10 d-flex align-items-center justify-content-center"
                            style={{ width: "60px", height: "60px" }}
                          >
                            <i className="ri-user-line fs-3 text-primary"></i>
                          </div>

                          <div className="ms-3">
                            <h4 className="mb-1 fw-semibold">
                              ({" "}
                              {
                                [
                                  ...new Map(
                                    (Data || [])
                                      .filter((item) => {
                                         
                                        return item.purchase_status == "1";
                                      })
                                      .map((item) => [
                                        item.purchase_invoice_no,
                                        item,
                                      ]),
                                  ).values(),
                                ]?.length
                              }{" "}
                              )
                            </h4>
                            <p className="text-muted mb-0">
                              Purchase send
                            </p>
                          </div>
                        </div>
                      </CardBody>
                    </Card>
                  </Col>

                  <Col lg={4}>
                    <Card className="h-100 border-0 shadow-sm rounded-4">
                      <CardBody className="p-4">
                        <div className="d-flex align-items-center">
                          <div
                            className="rounded-circle bg-success bg-opacity-10 d-flex align-items-center justify-content-center"
                            style={{ width: "60px", height: "60px" }}
                          >
                            <i className="ri-bar-chart-line fs-3 text-success"></i>
                          </div>

                          <div className="ms-3">
                            <h4 className="mb-1 fw-semibold">
                               ({" "}
                              {
                                [
                                  ...new Map(
                                    (Data || [])
                                      .filter((item) => {                                          
                                        return item.purchase_status == "2" || item.purchase_status == "3" ;
                                      })
                                      .map((item) => [
                                        item.purchase_invoice_no,
                                        item,
                                      ]),
                                  ).values(),
                                ]?.length
                              }{" "}{console.log(Data)}
                              )
                            </h4>
                            <p className="text-muted mb-0">Quotation Generated</p>
                          </div>
                        </div>
                      </CardBody>
                    </Card>
                  </Col>
                  <Col lg={4}>
                    <Card className="h-100 border-0 shadow-sm rounded-4">
                      <CardBody className="p-4">
                        <div className="d-flex align-items-center">
                          <div
                            className="rounded-circle bg-danger bg-opacity-10 d-flex align-items-center justify-content-center"
                            style={{ width: "60px", height: "60px" }}
                          >
                            <i className="ri-close-circle-line fs-3 text-danger"></i>
                          </div>

                          <div className="ms-3">
                            <h4 className="mb-1 fw-bold">
                              ({" "}
                              {
                                [
                                  ...new Map(
                                    (Data || [])
                                      .filter((item) => {
                                        const query =
                                          SearchQuery?.toLowerCase() || "";
                                        return item.purchase_status == "5";
                                      })
                                      .map((item) => [
                                        item.purchase_invoice_no,
                                        item,
                                      ]),
                                  ).values(),
                                ]?.length
                              }{" "}
                              )
                            </h4>
                            <p className="text-muted mb-0">
                              Rejected Quotation
                            </p>
                          </div>
                        </div>
                      </CardBody>
                    </Card>
                  </Col>
                </Row>

                <Row className="align-items-center mt-1 gy-3">
                  <div className="col-sm-auto row w-100 mt-3">
                    <div className="col-5">
                      <div className="fw-bold">
                        Serach by Name / Mobile Number / Email / Ifsc Code /
                        Branch Code/ Branch Name / Pincode
                      </div>
                      <input
                        className="form-control"
                        type="search"
                        placeholder="Search by Name / Mobile Number / Email / Ifsc Code / Branch Code/ Branch Name / Pincode"
                        onChange={(e) => {
                          const query = e.target.value.trim()?.toLowerCase();
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
                          to="/purchase-create"
                          type="button"
                          className="btn mt-3 fw-bold btn-success add-btn"
                          id="create-btn"
                        >
                          <i className="ri-add-line align-bottom me-1"></i>{" "}
                          Create Purchase
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
                            PO No
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
                            Created By
                          </th>
                          <th
                            title="Toggle SortBy"
                            style={{ cursor: "pointer" }}
                          >
                            Qty
                          </th>
                          {/* <th
                            title="Toggle SortBy"
                            style={{ cursor: "pointer" }}
                          >
                            Payment Term
                          </th> */}
                          <th
                            title="Toggle SortBy"
                            style={{ cursor: "pointer" }}
                          >
                            Generate Quotation
                          </th>
                          <th>Action</th>
                        </tr>
                      </thead>
                      {permission.find(
                        (permission) =>
                          permission.permission_category === "PURCHASEORDER" &&
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
                                      .includes(query) ||
                                    item.master_pincode
                                      ?.toLowerCase()
                                      .includes(query) ||
                                    item.master_branch_name
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
                                <td>{item?.purchase_start_date}</td>
                                <td>
                                  {/* {invoiceDetails ? invoiceDetails : ""}- */}
                                  PO-{item?.purchase_invoice_no}
                                </td>

                                <td style={{ maxWidth: "120px" }}>
                                  <div
                                    style={{
                                      whiteSpace: "normal",
                                      wordBreak: "break-word",
                                    }}
                                  >
                                    {item?.user_type == 1
                                      ? item.user_name
                                      : item.master_name}
                                    {item?.user_type == 3
                                      ? ` - ${item.master_branch_name}`
                                      : " "}
                                    {item?.user_type == 3
                                      ? ` - ${item.master_branch_code}`
                                      : " "}
                                  </div>
                                </td>

                                <td>{item.created_user_name || "Customer"}</td>
                                <td>{item.purchase_total_qty}</td>
                                {/* <td>{item.payment_term_type}</td> */}
                                <td>
                                  <div>
                                    {item.purchase_status != "1" ? (
                                      <div
                                        className=" w-75 btn btn-success btn-sm d-flex align-items-center   gap-2 shadow"
                                        onClick={() =>
                                          navigate(
                                            `/quotation-edit/${item.purchase_prchase_id}`,
                                          )
                                        }
                                      >
                                        <i className="mdi mdi-file-check-outline fs-5"></i>
                                        Quotation Generated
                                      </div>
                                    ) : (
                                      <div
                                        className="w-75 btn btn-outline-warning btn-sm d-flex align-items-center gap-2 shadow text-dark fw-bold"
                                        onClick={() =>
                                          navigate(
                                            `/quotation-edit/${item.purchase_prchase_id}`,
                                          )
                                        }
                                      >
                                        <i className="mdi mdi-file-plus-outline fs-5"></i>
                                        Generate Quotation
                                      </div>
                                    )}
                                  </div>
                                </td>
                                <td>
                                  <ul className="list-inline hstack gap-2 mb-0">
                                    {/* <li className="list-inline-item whatsapp">
                                      <div
                                        className="btn btn-success btn-sm"
                                        onClick={() => {
                                          sendWhatsApp(
                                            item.user_mobile,
                                            [
                                              item.master_name,
                                              `${item.master_invoice_no}`,
                                              item.master_bill_date,
                                              (
                                                parseFloat(
                                                  (
                                                    parseFloat(item.gstTotal) +
                                                    parseFloat(
                                                      item.master_total_bill_amt,
                                                    )
                                                  )?.toFixed(2),
                                                ) +
                                                parseFloat(
                                                  item.other_charge_amount,
                                                ) +
                                                parseFloat(
                                                  item.transport_types_total_charge,
                                                )
                                              )?.toFixed(2),
                                            ],
                                            "invoice_create",
                                          );
                                        }}
                                      >
                                        <i className="ri-whatsapp-line  "></i>
                                      </div>
                                    </li> */}
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

                                    {item.purchase_status == "1" &&
                                      permission.find(
                                        (permission) =>
                                          permission.permission_category ===
                                            "PURCHASEORDER" &&
                                          permission.permission_path === "3",
                                      ) && (
                                        <li className="list-inline-item edit">
                                          <Link
                                            to={`/purchase-edit/${item.purchase_prchase_id}`}
                                            className="text-primary d-inline-block edit-item-btn border-0 bg-transparent"
                                          >
                                            <i className="ri-pencil-fill fs-16" />
                                          </Link>
                                        </li>
                                      )}

                                    {permission.find(
                                      (permission) =>
                                        permission.permission_category ===
                                          "PURCHASEORDER" &&
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
                                  </ul>
                                </td>
                              </tr>
                            ))}
                        </tbody>
                      ) : (
                        <tbody className="text-center text-danger fw-bold">
                          <tr>
                            <td colSpan={8}>You Are not Allowed !</td>
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
        {/* Large Modal */}
        <ToastContainer closeButton={false} limit={1} />
      </Container>
      <div className="container-fluid fixed-bottom fs-5">
        <Row>
          <Col sm={2}></Col>
          <Col sm={10} className="bg-dark text-white fw-bold p-3 text-center">
            QTY : {totalQty.toFixed(2)}
          </Col>
          {/* <Col sm={5} className="bg-success text-white fw-bold p-3 text-center">
            Total Amount : &#8377; {totalAmount.toFixed(2)}
          </Col> */}
        </Row>
      </div>
      {modal_large && (
        <PrintModal
          status={1}
          id={SelectedPoID}
          modal_large={modal_large}
          togg_large={() => tog_large(false)}
        />
      )}
    </div>
  );
};

export default PurchaseList;
