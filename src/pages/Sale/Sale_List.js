import React, { useEffect, useRef, useState } from "react";
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
  ModalFooter,
  Button,
  FormGroup,
  Label,
  Input,
} from "reactstrap";
import { ToastContainer, toast } from "react-toastify";
import { Link } from "react-router-dom";
import AuthUser from "../../helpers/Authuser";
import DeleteModal from "../../Components/Common/DeleteModal";
import { IMG_API_URL, sendMail, sendWhatsApp } from "../../helpers/url_helper";
import InfiniteScroll from "react-infinite-scroll-component";
import Select from "react-select";
import Sale_Edit from "./Sale_Edit";
import Sale_Print_Modal from "./Sale_Print_Modal";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import LabelPrint from "../purchase/LabelPrint";
import PaymentPreviewModal from "./PaymentPreviewModal";
const Sale_List = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState(null);

  const toggleModal = () => setModalOpen(!modalOpen);

  const handlePreview = (payment) => {
    setSelectedPayment(payment);
    setModalOpen(true);
  };
  const videoRef = useRef(null);
  const { http, https, checkPermission, permission } = AuthUser();
  const [Data, SetData] = useState([]);
  const [selectedstatus, setSelectedStatus] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  const [counts, Setcounts] = useState(1);
  const [showVideo, setShowVideo] = useState(false);
  const [modal_standard, setmodal_standard] = useState(false);
  const [invoiceDetails] = useState(
    JSON.parse(sessionStorage.getItem("authUser")).invoiceDetails.intial_latter,
  );
  const [SelectedSaleID, setSelectedSaleID] = useState(0);
  const [modal_large, setmodal_large] = useState(false);
  const [editModal, setEditModal] = useState(false);
  const [selectedSale, setSelectedSale] = useState(null);
  const [Child_data, Set_Child_data] = useState([]);
  const [Master_data, Set_Master_data] = useState({});
  const [Business, Set_Business] = useState({});
  const [Payemnt, SetPayment] = useState();
  const [Check, SetCheck] = useState(false);
  const currentDate = new Date();
  const day = currentDate.getDate().toString().padStart(2, "0");
  const month = (currentDate.getMonth() + 1).toString().padStart(2, "0");
  const year = currentDate.getFullYear();
  const [Filter_Data, SetFilter_data] = useState({
    customer_id: "",
    start_date: `${day}/${month}/${year}`,
    end_date: `${day}/${month}/${year}`,
    payment_method: "",
  });
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

  const [Pages, SetPages] = useState(1);
  const [NoMore, SetNoMore] = useState(true);
  const [deleteModal, setDeleteModal] = useState(false);
  const [ID, SetID] = useState();

  const [statusModalOpen, setStatusModalOpen] = useState(false);
  const [selectedStatusOrder, setSelectedStatusOrder] = useState(null);
  const [newStatus, setNewStatus] = useState("");
  const [OrderDescription, setOrderDescription] = useState("");
  const [imagePreview, setImagePreview] = useState(null);
  const [trackingDescription, setTrackingDescription] = useState("");
  const [statusUpdating, setStatusUpdating] = useState(false);
  const [businessData, setBusinessData] = useState({});
  const [trackingModalOpen, setTrackingModalOpen] = useState(false);

  const statusOptions = [
    { value: "1", label: "New Order" },
    { value: "2", label: "Approval" },
    { value: "3", label: "Packing" },
    { value: "4", label: "Dispatch" },
    { value: "5", label: "Rejected" },
    { value: "6", label: "Delivered" },
  ];
  useEffect(() => {
    document.title = "Saisupplier Admin | Sales List";
    Filter_data();
  }, []);

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

  function tog_large() {
    setmodal_large(!modal_large);
  }

  const handleTrackingUpdate = async () => {
    if (trackingDescription.trim() === "") {
      toast.success("Please enter transport details.");
      return;
    }
    http
      .post("/order/tracking", {
        master_tracking_details: trackingDescription,
        master_id: selectedStatusOrder?.master_id,
      })
      .then((res) => {
        toast.success("Transport details updated successfully!");
        SetData((prev) =>
          prev.map((item) =>
            item.master_invoice_no === selectedStatusOrder?.master_invoice_no
              ? { ...item, master_tracking_details: trackingDescription }
              : item,
          ),
        );
        setTrackingModalOpen(false);
      })
      .catch((e) => {
        console.error("Failed to update transport details:", e);
        alert("Failed to update transport details");
      });
    sendMail(
      "dispatched",
      {
        Name: selectedStatusOrder.user_name,
        Order_Number: `${selectedStatusOrder.master_invoice_no}`,
        transport_details: trackingDescription,
      },
      selectedStatusOrder.user_email,
    );
  };
  const fileToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });
  };

  const handleStatusUpdate = async (order, selectedOption) => {
    setStatusUpdating(true);
    try {
      await https.post("/order/update-status", {
        master_id: order?.master_id,
        master_status: parseInt(selectedOption?.value),
        master_dispatch_img: OrderDescription,
      });
      toast.success("Status updated successfully!");
      Setcounts(counts + 1);

      setStatusModalOpen(false);
    } catch (error) {
      console.error("Failed to update status:", error);
      alert("Failed to update status");
    }
    setStatusUpdating(false);
    if (selectedOption?.value == 4) {
      if (OrderDescription) {
        // ✅ Convert file to base64 first
        fileToBase64(OrderDescription).then((base64Image) => {
          sendMail(
            "dispatched",
            {
              Name: selectedStatusOrder.user_name,
              Order_Number: `${selectedStatusOrder.master_invoice_no}`,
              transport_details: trackingDescription,
              image: base64Image, // send as base64
            },
            selectedStatusOrder.user_email,
          );
          // base64Image = null;
        });
      } else {
        // ✅ If no image selected, just send normal data
        sendMail(
          "dispatched",
          {
            Name: selectedStatusOrder.user_name,
            Order_Number: `${selectedStatusOrder.master_invoice_no}`,
            transport_details: trackingDescription,
            image: null,
          },
          selectedStatusOrder.user_email,
        );
      }
    }
    Filter_data();
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

  const getBusinessDetails = async () => {
    try {
      await http
        .get("/business_index")
        .then((res) => {
          setBusinessData(res.data);
        })
        .catch((e) => {
          console.log(e);
        });
    } catch (error) {
      console.log(error);
    }
  };
  const View_invoce = async (id) => {
    setSelectedSaleID(id);
    http
      .get(`/sale/invoice/${id}`)
      .then(function (response) {
        Set_Child_data(response.data.Child);
        if (response.data.Business.length > 0) {
          Set_Business(response.data.Business[0]);
        }
        Set_Master_data(response.data.Master[0]);
      })
      .catch(function (error) {
        console.log(error);
      });
    setmodal_large(!false);
  };

  const handleEditSale = (saleData) => {
    setSelectedSale(saleData);
    setEditModal(true);
  };
  const [searchQuery, setSearchQuery] = useState("");

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
        .formss { border: 1px solid black; }
        .invocess { border: 1px solid black; border-collapse: collapse; padding: 2px; }
        #per { padding-top: 0px; padding-bottom: 0px; text-align: right; }
        .header { display: flex; justify-content: space-around; align-items: center; margin: 0px auto; }
      `;
      printDocument.head.appendChild(styleElement);
      printDocument.body.appendChild(clonedContent);
      printFrame.contentWindow.print();
    };
    printFrame.src = "about:blank";
  };

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

  const handleFileSelect = (file) => {
    if (!file) return;

    setOrderDescription(file);

    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview({
        url: reader.result,
        type: file.type,
      });
    };
    reader.readAsDataURL(file);
  };

  const openCamera = async () => {
    try {
      setShowVideo(true); // Show video first so the <video> element renders

      // Wait for the video element to render
      setTimeout(async () => {
        if (videoRef.current) {
          const stream = await navigator.mediaDevices.getUserMedia({
            video: true,
          });
          videoRef.current.srcObject = stream;
          videoRef.current.play();
        }
      }, 100); // 100ms delay ensures video element exists
    } catch (err) {
      console.error("Camera not accessible:", err);
      alert("Cannot access camera: " + err.message);
    }
  };

  // Capture photo from video
  const takePhoto = () => {
    const canvas = document.createElement("canvas");
    canvas.width = videoRef.current.videoWidth;
    canvas.height = videoRef.current.videoHeight;
    canvas.getContext("2d").drawImage(videoRef.current, 0, 0);

    // Convert canvas to a File object
    canvas.toBlob((blob) => {
      const file = new File([blob], "captured-photo.png", {
        type: "image/png",
      });
      handleFileSelect(file); // <-- reuse existing function
    });

    // Stop camera
    const stream = videoRef.current.srcObject;
    stream.getTracks().forEach((track) => track.stop());
    setShowVideo(false);
  };

  const Filter_data = () => {
    http
      .post(`/sale/filter/data`, Filter_Data)
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

  const totalQty = [
    ...new Map(
      (Data || [])
        .filter((item) => {
          const query = searchQuery?.toLowerCase() || "";
          return (
            item.user_name?.toLowerCase().includes(query) ||
            item.master_name?.toLowerCase().includes(query) ||
            item.user_unique_id?.toLowerCase().includes(query) ||
            item.master_ifsc?.toLowerCase().includes(query) ||
            item.user_mobile?.toString().includes(query) ||
            item.master_mobile?.toString().includes(query) ||
            item.user_email?.toLowerCase().includes(query)
          );
        })
        .map((item) => [item.master_invoice_no, item]), // ✅ dedupe by user_id
    ).values(),
  ]
    .filter((temp) =>
      selectedstatus != 0 ? temp.master_bill_status == selectedstatus : true,
    )
    .reduce((acc, item) => acc + item.master_qty, 0);
  const totalAmount = [
    ...new Map(
      (Data || [])
        .filter((item) => {
          const query = searchQuery?.toLowerCase() || "";
          return (
            item.user_name?.toLowerCase().includes(query) ||
            item.master_name?.toLowerCase().includes(query) ||
            item.user_unique_id?.toLowerCase().includes(query) ||
            item.master_ifsc?.toLowerCase().includes(query) ||
            item.user_mobile?.toString().includes(query) ||
            item.master_mobile?.toString().includes(query) ||
            item.user_email?.toLowerCase().includes(query)
          );
        })
        .map((item) => [item.master_invoice_no, item]), // ✅ dedupe by user_id
    ).values(),
  ]
    .filter((temp) =>
      selectedstatus != 0 ? temp.master_bill_status == selectedstatus : true,
    )
    .reduce(
      (acc, item) =>
        acc +
        (parseFloat(
          Number(item.gstTotal) + Number(item.master_total_bill_amt),
        ) +
          parseFloat(item.other_charge_amount)) +
        parseFloat(item.transport_types_total_charge),
      0,
    );

  const [Customer, setCustomer] = useState([]);
  useEffect(() => {
    http
      .get("/users/list")
      .then(function (response) {
        if (response.data?.data?.length != 0) {
          setCustomer(response.data.data);
        }
      })
      .catch(function (error) {
        console.log(error);
      });
  }, []);
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
                      <div className="col-12">
                        <h3 className="text-center fw-bold mb-0">
                          {selectedstatus == 0
                            ? "All"
                            : statusOptions.find(
                                (option) => option.value == selectedstatus,
                              )?.label}{" "}
                          Invoices ({" "}
                          {
                            [
                              ...new Map(
                                (Data || [])
                                  .filter((item) => {
                                    const query =
                                      searchQuery?.toLowerCase() || "";
                                    return (
                                      item.user_name
                                        ?.toLowerCase()
                                        .includes(query) ||
                                      item.master_name
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
                                        .includes(query) ||
                                      item.master_mobile
                                        ?.toString()
                                        .includes(query) ||
                                      item.user_email
                                        ?.toLowerCase()
                                        .includes(query)
                                    );
                                  })
                                  .map((item) => [
                                    item.master_invoice_no,
                                    item,
                                  ]), // ✅ dedupe by user_id
                              ).values(),
                            ].filter((temp) =>
                              selectedstatus != 0
                                ? temp.master_bill_status == selectedstatus
                                : true,
                            )?.length
                          }{" "}
                          )
                        </h3>
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

                <Row className="row align-items-center gy-3">
                  <div className="col-sm-auto row w-100 mt-4  ">
                    <div className="col-5">
                      <div className="fw-bold mb- ">Search Area</div>
                      <input
                        type="search"
                        placeholder="Search by Name / Unique Id / Mobile Number / Email / Ifsc Code"
                        className="form-control w-100 fw-bold rounded"
                        onChange={(e) => {
                          const query = e.target.value?.toLowerCase();
                          setSearchQuery(query); // store search query in state
                        }}
                      />
                    </div>
                    <div className="col-7 ">
                      <div className="fw-bold d-flex justify-content-end gap-1">
                        <div>
                          <div className="fw-bold">Select Status</div>
                          <div className="fw-bold">
                            <Select
                              styles={{
                                container: (base) => ({
                                  ...base,
                                  width: 160,
                                }),
                              }}
                              options={[
                                { value: 0, label: "All " },
                                ...statusOptions,
                              ]}
                              onChange={(selectedOption) => {
                                setSelectedStatus(selectedOption.value);
                              }}
                            ></Select>
                          </div>
                        </div>
                        <div>
                          <div className="fw-bold">Start Date</div>
                          <Flatpickr
                            className="form-control"
                            style={{ width: "130px" }}
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
                            style={{ width: "130px" }}
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
                            className="btn btn-info mt-3 w-100"
                            onClick={Filter_data}
                          >
                            <i className="ri-search-line align-bottom me-1"></i>
                            Search
                          </button>
                        </div> */}

                        {permission.find(
                          (permission) =>
                            permission.permission_category === "INVOICE" &&
                            permission.permission_path === "2",
                        ) && (
                          <div className="mt-3">
                            <Link
                              to="/sale-create"
                              type="button"
                              className="btn fw-bold btn-success add-btn "
                              id="create-btn"
                            >
                              <i className="ri-add-line align-bottom me-1"></i>{" "}
                              Add Invoice
                            </Link>
                          </div>
                        )}
                      </div>
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
                  <InfiniteScroll dataLength={Data.length} hasMore={NoMore}>
                    <table className="table align-middle table-nowrap table-hover">
                      <thead className="table-light text-muted text-uppercase">
                        <tr>
                          <th>Sr.No</th>
                          <th>INV No.</th>
                          <th>Order Type</th>
                          <th>Bank / Business Info</th>
                          <th>Bill Date</th>
                          <th>Qty</th>
                          <th>Amount</th>
                          <th>Payment Mode</th>

                          {permission.find(
                            (permission) =>
                              permission.permission_category === "INVOICE" &&
                              permission.permission_path === "2",
                          ) && <th>Transport Details</th>}
                          {permission.find(
                            (permission) =>
                              permission.permission_category === "INVOICE" &&
                              permission.permission_path === "3",
                          ) && <th>Status</th>}
                          <th>Actions</th>
                        </tr>
                      </thead>
                      {permission.find(
                        (permission) =>
                          permission.permission_category === "INVOICE" &&
                          permission.permission_path === "3",
                      ) ? (
                        <tbody>
                          {[
                            ...new Map(
                              (Data || [])
                                .filter((item) => {
                                  const query =
                                    searchQuery?.toLowerCase() || "";
                                  return (
                                    item.user_name
                                      ?.toLowerCase()
                                      .includes(query) ||
                                    item.master_name
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
                                      .includes(query) ||
                                    item.master_mobile
                                      ?.toString()
                                      .includes(query) ||
                                    item.user_email
                                      ?.toLowerCase()
                                      .includes(query)
                                  );
                                })
                                .map((item) => [item.master_invoice_no, item]), // ✅ dedupe by user_id
                            ).values(),
                          ]
                            .filter((temp) =>
                              selectedstatus != 0
                                ? temp.master_bill_status == selectedstatus
                                : true,
                            )
                            .map((item, index) => (
                              <tr key={index}>
                                <td>{index + 1}</td>
                                <td>{item.master_invoice_no}</td>
                                <td>
                                  {item.purchase_type == 2
                                    ? "Sample"
                                    : "Regular"}
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
                                <td>{item.master_bill_date}</td>
                                <td>{item.master_qty}</td>

                                <td>
                                  &#8377;{" "}
                                  {(
                                    parseFloat(
                                      (
                                        parseFloat(item.gstTotal) +
                                        parseFloat(item.master_total_bill_amt)
                                      )?.toFixed(2),
                                    ) +
                                    parseFloat(item.other_charge_amount) +
                                    parseFloat(
                                      item.transport_types_total_charge,
                                    )
                                  )?.toFixed(2)}
                                </td>

                                <td>
                                  {item.payment_id == "2" ? (
                                    <div
                                      onClick={() => {
                                        handlePreview(item);
                                      }}
                                      className="d-flex align-items-center justify-content-center gap-2 btn btn-sm btn-outline-info"
                                    >
                                      {item.payment_type}
                                      <i className="ri-file-info-line fs-16 align-bottom me-1"></i>
                                    </div>
                                  ) : (
                                    item.payment_type
                                  )}
                                </td>
                                {permission.find(
                                  (permission) =>
                                    permission.permission_category ===
                                      "INVOICE" &&
                                    permission.permission_path === "2",
                                ) && (
                                  <td>
                                    <button
                                      className="btn btn-outline-info btn-sm d-flex align-items-center"
                                      onClick={() => {
                                        setSelectedStatusOrder(item);
                                        setTrackingModalOpen(true);
                                        setTrackingDescription(
                                          item.master_tracking_details,
                                        );
                                      }}
                                    >
                                      {item.master_tracking_details ? (
                                        <i className="ri-eye-fill me-2 fs-16"></i>
                                      ) : (
                                        <i className="ri-add-fill me-2 fs-16"></i>
                                      )}
                                      Track Details
                                    </button>
                                  </td>
                                )}
                                {permission.find(
                                  (permission) =>
                                    permission.permission_category ===
                                      "INVOICE" &&
                                    permission.permission_path === "3",
                                ) && (
                                  <td style={{ minWidth: 150 }}>
                                    {item.master_bill_status != 6 ? (
                                      <Select
                                        onChange={(selectedOption) => {
                                          if (selectedOption.value == 4) {
                                            setSelectedStatusOrder(item);
                                            setStatusModalOpen(true);
                                            setNewStatus(selectedOption.value);
                                          } else {
                                            handleStatusUpdate(
                                              item,
                                              selectedOption,
                                            );
                                          }
                                        }}
                                        options={statusOptions.filter((opt) =>
                                          item.master_bill_status == 4
                                            ? opt.value >=
                                              item.master_bill_status
                                            : opt.value >=
                                                item.master_bill_status &&
                                              opt.value <=
                                                item.master_bill_status + 1,
                                        )}
                                        value={statusOptions.find(
                                          (opt) =>
                                            opt.value ==
                                            item.master_bill_status.toString(),
                                        )}
                                        isSearchable={true}
                                        menuPortalTarget={document.body} // 👈 Render dropdown in body
                                        styles={{
                                          menuPortal: (base) => ({
                                            ...base,
                                            zIndex: 9999,
                                          }), // 👈 Ensure it's on top
                                        }}
                                      />
                                    ) : (
                                      <div className=" d-flex justify-content-center align-items-center">
                                        <span className="w-auto d-flex justify-content-between align-items-center btn btn-sm btn-success">
                                          {" "}
                                          Order Has Been Delivered
                                          <i className="ri-check-line"></i>
                                        </span>
                                      </div>
                                    )}
                                  </td>
                                )}
                                <td>
                                  <div className="d-flex gap-2 justify-content-center">
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
                                    <Link
                                      to={`/sale-edit/${item.master_id}`}
                                      className="btn btn-light btn-sm btn-icon text-primary"
                                    >
                                      <i className="ri-edit-2-line"></i>
                                    </Link>
                                    <Button
                                      color="light"
                                      size="sm"
                                      onClick={() => {
                                        setSelectedSaleID(item.master_id);
                                        setIsOpen(true);
                                      }}
                                      className="btn-icon text-primary"
                                    >
                                      <i className="ri-price-tag-3-line"></i>
                                    </Button>

                                    <Button
                                      color="light"
                                      size="sm"
                                      onClick={() =>
                                        View_invoce(item.master_id)
                                      }
                                      className="btn-icon text-primary"
                                    >
                                      <i className="ri-printer-line"></i>
                                    </Button>
                                  </div>
                                </td>
                              </tr>
                            ))}
                        </tbody>
                      ) : (
                        <tbody>
                          <tr>
                            <td colSpan={11}>
                              <div className="text-center text-danger fw-bold">
                                You are not Allowed!
                              </div>
                            </td>
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
      {/* update status modal */}
      <Modal
        isOpen={statusModalOpen}
        toggle={() => setStatusModalOpen(false)}
        centered
      >
        <ModalHeader toggle={() => setStatusModalOpen(false)}>
          Update Status
        </ModalHeader>
        <ModalBody>
          <FormGroup>
            <Label for="statusSelect">Select New Status</Label>
            <Select
              id="statusSelect"
              options={statusOptions}
              value={statusOptions.find((opt) => opt.value === newStatus)}
              onChange={(selectedOption) => setNewStatus(selectedOption.value)}
              placeholder="-- Select Status --"
            />
          </FormGroup>
          <FormGroup>
            <Label>Upload Dispatch Image</Label>
            <div className="d-flex gap-2 mb-3">
              <Button
                color="primary"
                outline
                className="flex-fill"
                onClick={() =>
                  document.getElementById("file-upload-input").click()
                }
              >
                <i className="ri-upload-2-line me-2"></i>
                Upload File
              </Button>

              <Button
                color="success"
                outline
                className="flex-fill"
                onClick={openCamera}
              >
                <i className="ri-camera-line me-2"></i>
                Take Photo
              </Button>
            </div>
            {/* Hidden file input */}
            <Input
              id="file-upload-input"
              type="file"
              accept="image/*,video/*"
              style={{ display: "none" }}
              onChange={(e) => handleFileSelect(e.target.files[0])}
            />

            {/* Video preview for live camera */}
            {showVideo && (
              <div className="text-center mb-3">
                <video
                  ref={videoRef}
                  style={{ width: "100%", maxHeight: "300px" }}
                />
                <Button color="primary" className="mt-2" onClick={takePhoto}>
                  Capture Photo
                </Button>
              </div>
            )}
            {/* Display preview */}
            {imagePreview && (
              <div className="mt-3 text-center">
                <Label className="fw-bold mb-2 d-block">Preview</Label>

                {imagePreview.type.startsWith("image") ? (
                  <img
                    src={imagePreview.url}
                    alt="Preview"
                    style={{
                      maxWidth: "100%",
                      maxHeight: "300px",
                      borderRadius: "10px",
                      border: "1px solid #ddd",
                    }}
                  />
                ) : imagePreview.type.startsWith("video") ? (
                  <video
                    src={imagePreview.url}
                    controls
                    style={{
                      maxWidth: "100%",
                      maxHeight: "300px",
                      borderRadius: "10px",
                      border: "1px solid #ddd",
                    }}
                  />
                ) : null}

                <div className="mt-2">
                  <Button
                    color="danger"
                    size="sm"
                    outline
                    onClick={() => setImagePreview(null)}
                  >
                    <i className="ri-delete-bin-line me-1"></i>
                    Remove
                  </Button>
                </div>
              </div>
            )}
          </FormGroup>
        </ModalBody>
        <ModalFooter>
          <Button
            color="secondary"
            onClick={() => setStatusModalOpen(false)}
            disabled={statusUpdating}
          >
            Cancel
          </Button>
          <Button
            color="primary"
            onClick={() =>
              handleStatusUpdate(selectedStatusOrder, { value: newStatus })
            }
            disabled={statusUpdating}
          >
            {statusUpdating ? "Updating..." : "Update Status"}
          </Button>
        </ModalFooter>
      </Modal>

      {/* Tracking Update Modal */}
      <Modal
        size="lg"
        isOpen={trackingModalOpen}
        toggle={() => setTrackingModalOpen(false)}
        centered
      >
        <ModalHeader toggle={() => setTrackingModalOpen(false)}>
          Update Transport Details
        </ModalHeader>
        <ModalBody>
          <FormGroup>
            <CKEditor
              editor={ClassicEditor}
              data={trackingDescription}
              onChange={(event, editor) => {
                const data = editor.getData();
                setTrackingDescription(data);
              }}
            />
          </FormGroup>
        </ModalBody>
        <ModalFooter>
          <Button
            color="danger"
            className="d-flex align-items-center"
            onClick={() => setTrackingModalOpen(false)}
          >
            <i className="ri-close-line fs-16 me-1"></i>
            Cancel
          </Button>
          <Button
            color="primary"
            className="d-flex align-items-center"
            onClick={handleTrackingUpdate}
          >
            <i className="ri-save-line fs-16 me-1"></i>
            Save Information
          </Button>
        </ModalFooter>
      </Modal>
      {modal_large && (
        <Sale_Print_Modal
          id={SelectedSaleID}
          modal_large={modal_large}
          togg_large={() => tog_large(false)}
        />
      )}
      {modalOpen && (
        <PaymentPreviewModal
          isOpen={modalOpen}
          toggle={toggleModal}
          payment={selectedPayment}
        />
      )}
      {isOpen && (
        <LabelPrint
          isOpen={isOpen}
          id={SelectedSaleID}
          toggle={() => {
            setIsOpen(!isOpen);
          }}
        />
      )}
    </div>
  );
};

export default Sale_List;
