import React, { useState } from "react";
import {
  Card,
  CardBody,
  Col,
  Container,
  CardHeader,
  Nav,
  Row,
} from "reactstrap";
import Flatpickr from "react-flatpickr";
import { toast, ToastContainer } from "react-toastify";
import DeleteModal from "../../Components/Common/DeleteModal";
import CallLogsEdit from "./CallLogsEdit";
import AuthUser from "../../helpers/Authuser";
import { useEffect } from "react";
import { IMG_API_URL } from "../../helpers/url_helper";
import InfiniteScroll from "react-infinite-scroll-component";
import D_img from "../D_img";

const CallLogsList = () => {
  const [modalStates, setModalStates] = useState(false);
  const [UpdatemodalStates, setUpdateModalStates] = useState(false);
  const { http } = AuthUser();
  const [counts, Setcounts] = useState(1);
  const [callLog, SetCalllog] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  // infinity
  const [Pages, SetPages] = useState(1);
  const [NoMore, SetNoMore] = useState(true);
  const currentDate = new Date();
  const day = currentDate.getDate().toString().padStart(2, "0");
  const month = (currentDate.getMonth() + 1).toString().padStart(2, "0");
  const year = currentDate.getFullYear();
  const [activeFilter, setActiveFilter] = useState("today");
  const formatDate = (date) => date.toLocaleDateString("en-GB");
  const [Filter_Data, SetFilter_data] = useState({
    start_date: `${day}/${month}/${year}`,
    end_date: `${day}/${month}/${year}`,
  });
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
  useEffect(() => {
    document.title = "CallLogs | Saisupplier Admin";

    http
      .get(`/callLog/list`)
      .then(function (response) {
        SetCalllog([...response.data.data]);
        console.log(callLog);
        SetPages(Pages + 1);
        if (response.data.length === 0) {
          SetNoMore(false);
        }
        console.log("Use Effect is w");
      })
      .catch(function (error) {
        console.log(error);
        SetNoMore(false);
      });
  }, [counts]);
  const fetchData = () => {
    Setcounts(counts + 1);
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
        .delete(`/callLog/delete/${ID}`)
        .then(function (response) {
          if (response.data.status == 0) {
            toast.success(response.data.message);
          } else {
            toast.warn(response.data.message);
          }
          Setcounts(counts + 1);
        })
        .catch(function (error) {
          console.log(error);
        });
    }
    SetCalllog([]);
    SetPages(1);
    setDeleteModal(false);
  };

  // shortcuts for opening add form
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.altKey && event.key === "a") {
        event.preventDefault();
        setModalStates(true);
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);
  //   end Alert
  const handleCallback = (data, status) => {
    SetCalllog([]);
    SetPages(1);
    if (status == 0) {
      toast.success(data);
      Setcounts(counts + 1);
    } else {
      toast.warn(data);
      Setcounts(counts + 1);
    }
    setModalStates(false);
    setUpdateModalStates(false);
  };
  // Edit Data
  const [FindData, SetFind] = useState([]);
  const EditUpdate = (index) => {
    let FindArray = callLog.filter((_, i) => i == index);
    SetFind(FindArray[0]);
    setUpdateModalStates(!UpdatemodalStates);
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
                <Row className="align-items-center gy-3">
                  <h3 className="text-center fw-bold mb-0">Call Logs</h3>
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
                <Row className="align-items-center gy-3">
                  <div className="col-sm">
                    <h5 className="card-title mb-0">Call Logs</h5>
                  </div>
                  <div className="col-sm-auto">
                    <div className="d-flex gap-3 flex-wrap align-items-end">
                      {/* Start Date */}
                      <div>
                        <div className="fw-bold mb-1">Start     Date</div>
                        <Flatpickr
                          className="form-control"
                          style={{ width: "140px" }}
                          options={{
                            dateFormat: "d/m/Y",
                            defaultDate: "today",
                          }}
                          value={Filter_Data.start_date}
                          onChange={(selectedDates) => {
                            if (!selectedDates.length) return;

                            const d = selectedDates[0];
                            const formattedDate = `${d.getDate().toString().padStart(2, "0")}/${(
                              d.getMonth() + 1
                            )
                              .toString()
                              .padStart(2, "0")}/${d.getFullYear()}`;

                            SetFilter_data({
                              ...Filter_Data,
                              start_date: formattedDate,
                            });
                          }}
                        />
                      </div>

                      {/* End Date */}
                      <div>
                        <div className="fw-bold mb-1">End Date</div>
                        <Flatpickr
                          className="form-control"
                          style={{ width: "140px" }}
                          options={{
                            dateFormat: "d/m/Y",
                            defaultDate: "today",
                          }}
                          value={Filter_Data.end_date}
                          onChange={(selectedDates) => {
                            if (!selectedDates.length) return;

                            const d = selectedDates[0];
                            const formattedDate = `${d.getDate().toString().padStart(2, "0")}/${(
                              d.getMonth() + 1
                            )
                              .toString()
                              .padStart(2, "0")}/${d.getFullYear()}`;

                            SetFilter_data({
                              ...Filter_Data,
                              end_date: formattedDate,
                            });
                          }}
                        />
                      </div>

                      {/* Search */}
                      <div style={{ minWidth: "260px" }}>
                        <div className="fw-bold mb-1">Search Area</div>
                        <input
                          type="search"
                          placeholder="Search by Name / Mobile / Call Type"
                          className="form-control fw-bold rounded"
                          onChange={(e) =>
                            setSearchQuery(e.target.value.toLowerCase())
                          }
                        />
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
                  <InfiniteScroll
                    dataLength={callLog.length}
                    next={fetchData}
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
                            Phone Number
                          </th>
                          <th
                            title="Toggle SortBy"
                            style={{ cursor: "pointer" }}
                          >
                            Call logs Type
                          </th>
                          <th
                            title="Toggle SortBy"
                            style={{ cursor: "pointer" }}
                          >
                            Call Logs Date
                          </th>
                          <th
                            title="Toggle SortBy"
                            style={{ cursor: "pointer" }}
                          >
                            Call Logs Time
                          </th>
                          <th
                            title="Toggle SortBy"
                            style={{ cursor: "pointer" }}
                          >
                            Call Logs Duration
                          </th>
                          <th
                            title="Toggle SortBy"
                            style={{ cursor: "pointer" }}
                          >
                            Call Logs createdAt
                          </th>
                          <th
                            title="Toggle SortBy"
                            style={{ cursor: "pointer" }}
                          >
                            Call Logs updatedAt
                          </th>
                          <th
                            title="Toggle SortBy"
                            style={{ cursor: "pointer" }}
                          >
                            Lead created By
                          </th>
                          <th>Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {[
                          ...new Map(
                            (callLog || [])
                              .filter((item) => {
                                const query = searchQuery?.toLowerCase() || "";
                                return (
                                  item.number?.toLowerCase().includes(query) ||
                                  item.full_name
                                    ?.toLowerCase()
                                    .includes(query) ||
                                  item.type?.toLowerCase().includes(query)
                                );
                              })
                              .map((item) => [item.id, item]), // dedupe key
                          ).values(),
                        ].map((item, index) => (
                          <tr key={index}>
                            <td>
                              <a
                                className="fw-medium link-primary"
                                href="/apps-ecommerce-order-details"
                              >
                                {index + 1}
                              </a>
                            </td>

                            <td>{item.number}</td>
                            <td>{item.type}</td>
                            <td>{item.date}</td>
                            <td>{item.time}</td>
                            <td>{item.duration}</td>
                            <td>{item.createdAt}</td>
                            <td>{item.updatedAt}</td>
                            <td>{item.full_name}</td>

                            <td>
                              <ul className="list-inline hstack gap-2 mb-0">
                                <li className="list-inline-item edit">
                                  <button
                                    className="text-primary d-inline-block edit-item-btn border-0 bg-transparent"
                                    onClick={() => EditUpdate(index)}
                                  >
                                    <i className="ri-pencil-fill fs-16" />
                                  </button>
                                </li>

                                <li className="list-inline-item">
                                  {item.category_id !== 1 && (
                                    <button
                                      onClick={() =>
                                        onClickDelete(item.id)
                                      }
                                      className="text-danger d-inline-block remove-item-btn border-0 bg-transparent"
                                    >
                                      <i className="ri-delete-bin-5-fill fs-16" />
                                    </button>
                                  )}
                                </li>
                              </ul>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </InfiniteScroll>
                </div>

                {/* {modalStates === true ? (
                  <CategoryAdd
                    modalStates={modalStates}
                    setModalStates={() => {
                      setModalStates(false);
                    }}
                    checkchang={handleCallback}
                  />
                ) : (
                  ""
                )} */}
                {UpdatemodalStates === true ? (
                  <CallLogsEdit
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
                <ToastContainer closeButton={false} limit={1} />
              </CardBody>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default CallLogsList;
