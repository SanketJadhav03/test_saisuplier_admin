import React, { useState, useEffect, useCallback } from "react";
import { useParams } from "react-router-dom";
import {
  Card,
  CardBody,
  CardHeader,
  Row,
  Col,
  Button,
  Table,
  Badge,
  Input,
  Spinner,
} from "reactstrap";
import FollowUpAdd from "./FollowUpAdd";
import AuthUser from "../../helpers/Authuser";
import moment from "moment";

function FollowUpList() {
  const [leadData, setLeadData] = useState({});
  const { lead_id } = useParams();
  const { http } = AuthUser();
  const [modalState, setModalState] = useState(false);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState({
    start_date: moment().format("YYYY-MM-DD"),
    end_date: moment().format("YYYY-MM-DD"),
  });

  const fetchFollowups = async () => {
    setLoading(true);
    try {
      const response = await http.post("/followup/filter", {
        start_date: filters.start_date,
        end_date: filters.end_date,
        lead_id: lead_id,
      });
      setData(response.data.data);
      setLeadData(response.data.leads);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFollowups();
  }, [filters, lead_id]);

  const handlePrint = () => window.print();

  const handleQuickFilter = (type) => {
    let start = moment();
    let end = moment();
    if (type === "YESTERDAY") {
      start = moment().subtract(1, "d");
      end = moment().subtract(1, "d");
    } else if (type === "THIS_WEEK") {
      start = moment().startOf("week");
    } else if (type === "THIS_MONTH") {
      start = moment().startOf("month");
    } else if (type === "LAST_MONTH") {
      start = moment().subtract(1, "month").startOf("month");
      end = moment().subtract(1, "month").endOf("month");
    } else if (type === "ALL") {
      start = "2020-01-01";
      end = "2030-12-31";
    }
    setFilters({
      start_date: moment(start).format("YYYY-MM-DD"),
      end_date: moment(end).format("YYYY-MM-DD"),
    });
  };

  return (
    <div
      className="page-content"
      style={{ backgroundColor: "#f3f3f9", minHeight: "100vh" }}
    >
      <div className="container-fluid">
        {/* HEADER AREA */}
        <div className="d-flex align-items-center justify-content-between mb-4 no-print">
          <div>
            <h4 className="mb-1 fw-bold text-dark">Follow-up Activity</h4>
            <p className="text-muted mb-0">
              Detailed engagement history for Lead{" "}
              <span className="fw-bold text-primary">#{lead_id}</span>
            </p>
          </div>
          <div className="d-flex gap-2">
            <Button
              color="light"
              className="btn-icon shadow-sm"
              onClick={handlePrint}
              title="Print Report"
            >
              <i className="ri-printer-fill fs-18"></i>
            </Button>
            <Button
              color="primary"
              className="shadow-primary px-4"
              onClick={() => setModalState(true)}
            >
              <i className="ri-add-line align-bottom me-1"></i> Add New
              Follow-up
            </Button>
          </div>
        </div>
        {/* 2. COMPACT FILTER BAR */}
        <Card className="border-0 shadow-sm mb-2">
          <CardBody className="p-2 px-3">
            <div className="d-flex flex-wrap align-items-center justify-content-between gap-2">
              {/* Pill Filters */}
              <div className="d-flex gap-1">
                {["TODAY", "YESTERDAY", "THIS_WEEK", "THIS_MONTH", "ALL"].map(
                  (f) => (
                    <button
                      key={f}
                      onClick={() => handleQuickFilter(f)}
                      className={`btn btn-sm rounded-pill px-3 fw-bold border-0 ${
                        filters.start_date == moment().format("YYYY-MM-DD") 
                        &&
                        f == "TODAY"
                          ? "btn-primary shadow-sm"
                          : "btn-light text-muted"
                      }`}
                      style={{ fontSize: "11px" }}
                    >
                      {f.replace("_", " ")}
                    </button>
                  ),
                )}
              </div>

              {/* Manual Date Selection */}
              <div className="d-flex align-items-center gap-2">
                <div className="d-flex align-items-center bg-light rounded-pill px-2 py-1">
                  <Input
                    type="date"
                    size="sm"
                    className="border-0 bg-transparent shadow-none"
                    style={{ width: "130px", fontSize: "12px" }}
                    value={filters.start_date}
                    onChange={(e) =>
                      setFilters({ ...filters, start_date: e.target.value })
                    }
                  />
                  <span className="text-muted mx-1">/</span>
                  <Input
                    type="date"
                    size="sm"
                    className="border-0 bg-transparent shadow-none"
                    style={{ width: "130px", fontSize: "12px" }}
                    value={filters.end_date}
                    onChange={(e) =>
                      setFilters({ ...filters, end_date: e.target.value })
                    }
                  />
                </div>
              </div>
            </div>
          </CardBody>
        </Card>
        {/* TOP STATS CARDS */}
        <Row className="mb-3 g-3">
          {/* Main Customer Profile */}
          <Col xl={4} md={6}>
            <Card className="border-0 shadow-sm h-100">
              <CardBody className="p-3">
                <div className="d-flex align-items-center">
                  <div className="avatar-sm flex-shrink-0">
                    <div className="avatar-title bg-primary  rounded-circle fs-17 fw-bold">
                      {leadData?.customer_name?.charAt(0) || "L"}
                    </div>
                  </div>
                  <div className="ms-3 flex-grow-1">
                    <h6 className="mb-1 fs-15 fw-bold">
                      {leadData?.customer_name}
                    </h6>
                    <p className="text-muted mb-0 fs-12">
                      <i className="ri-map-pin-2-line me-1"></i>
                      {leadData?.customer_city}, {leadData?.customer_state}
                    </p>
                  </div>
                  <Badge
                    color="soft-info"
                    pill
                    className="fs-10 text-uppercase"
                  >
                    {leadData?.source_name}
                  </Badge>
                </div>
              </CardBody>
            </Card>
          </Col>

          {/* Status & Priority Card */}
          <Col xl={3} md={6}>
            <Card className="border-0 shadow-sm h-100">
              <CardBody className="p-3">
                <div className="d-flex justify-content-between align-items-center">
                  <div>
                    <p className="text-muted mb-1 fs-11 text-uppercase fw-medium">
                      Lead Stage
                    </p>
                    <Badge
                      style={{
                        backgroundColor: leadData?.stage_color || "#eff2f7",
                        color: leadData?.stage_color ? "#fff" : "#495057",
                      }}
                      className="fs-11 px-3 py-1"
                    >
                      {leadData?.stage_name || "New Lead"}
                    </Badge>
                  </div>
                  <div className="text-end">
                    <p className="text-muted mb-1 fs-11 text-uppercase fw-medium">
                      Priority
                    </p>
                    <span
                      className={`fw-bold fs-13 ${leadData?.priority_id === 3 ? "text-danger" : "text-warning"}`}
                    >
                      <i className="ri-flashlight-fill me-1"></i>{" "}
                      {leadData?.priority_name}
                    </span>
                  </div>
                </div>
              </CardBody>
            </Card>
          </Col>

          {/* Assignment Card */}
          <Col xl={5} md={12}>
            <Card className="border-0 shadow-sm h-100">
              <CardBody className="p-3">
                <Row className="align-items-center">
                  <Col xs={6} className="border-end">
                    <p className="text-muted mb-1 fs-11 text-uppercase">
                      Assigned To
                    </p>
                    <div className="fw-bold fs-13 text-truncate">
                      <i className="ri-user-follow-line text-success me-1"></i>
                      {leadData?.assigned_employee_name || "Unassigned"}
                    </div>
                  </Col>
                  <Col xs={6} className="ps-3">
                    <p className="text-muted mb-1 fs-11 text-uppercase">
                      Created By
                    </p>
                    <div className="text-muted fs-13 text-truncate">
                      {leadData?.created_employee_name}
                    </div>
                  </Col>
                </Row>
              </CardBody>
            </Card>
          </Col>
        </Row>

        {/* MAIN DATA CARD */}
        <Card className="border-0 shadow-sm">
          <CardHeader className="bg-white py-3 border-bottom-dashed">
            <h6 className="card-title mb-0">
              <i className="ri-list-settings-line align-middle me-1 text-primary"></i>{" "}
              Engagement Logs
            </h6>
          </CardHeader>
          <CardBody className="p-0">
            <div className="table-responsive">
              <Table hover className="align-middle table-nowrap mb-0">
                <thead className="table-light text-muted">
                  <tr>
                    <th className="ps-4" style={{ width: "80px" }}>
                      ID
                    </th>
                    <th style={{ width: "150px" }}>Date & Timing</th>
                    <th>Notes & Interaction Summary</th>
                    <th style={{ width: "180px" }}>Staff Involved</th>
                    <th className="text-center" style={{ width: "120px" }}>
                      Verification
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    <tr>
                      <td colSpan="6" className="text-center py-5">
                        <Spinner color="primary" />
                      </td>
                    </tr>
                  ) : (
                    data.map((item, idx) => (
                      <tr key={idx} className="cursor-pointer">
                        <td className="ps-4 fw-medium text-primary">
                          #{item.followup_id}
                        </td>
                        <td>
                          <div className="fw-bold">{item.formatted_date}</div>
                          <small className="text-muted">
                            <i className="ri-time-line me-1"></i>Next:{" "}
                            {item.followup_next_date}
                          </small>
                        </td>

                        <td className="text-wrap" style={{ minWidth: "250px" }}>
                          <p
                            className="mb-0 text-muted"
                            style={{ lineHeight: "1.4" }}
                          >
                            {item.followup_description ||
                              "Detailed notes not provided for this interaction."}
                          </p>
                        </td>
                        <td>
                          <div className="d-flex align-items-center">
                            <div className="avatar-xs flex-shrink-0 me-2">
                              <span className="avatar-title bg-primary text-white rounded-circle fw-bold small">
                                {item.assigned_to_name?.charAt(0) || "1"}
                              </span>
                            </div>
                            <div>
                              <div className="fw-medium small">
                                {item.assigned_to_name}
                              </div>
                              <Badge
                                color="soft-info"
                                className="text-uppercase"
                                style={{ fontSize: "9px" }}
                              >
                                {item.assigned_to_role}
                              </Badge>
                            </div>
                          </div>
                        </td>
                        <td className="text-center">
                          <Badge color="soft-success" pill className="px-3">
                            Validated
                          </Badge>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </Table>
            </div>
          </CardBody>
        </Card>
      </div>

      {/* CUSTOM PRINT STYLES */}
      <style>{`
        @media print {
          .no-print { display: none !important; }
          .page-content { background-color: #fff !important; padding: 0 !important; }
          .card { border: 1px solid #e9ebec !important; box-shadow: none !important; }
          .table thead th { background-color: #f3f6f9 !important; -webkit-print-color-adjust: exact; }
          body::before { 
            content: "OFFICIAL FOLLOW-UP REPORT"; 
            display: block; text-align: center; font-size: 20px; font-weight: bold; margin-bottom: 20px; 
            border-bottom: 3px double #000; padding-bottom: 10px;
          }
        }
        .card-animate:hover { transform: translateY(-5px); transition: all 0.3s ease; }
      `}</style>

      {modalState && (
        <FollowUpAdd
          modalStates={modalState}
          setModalStates={() => setModalState(false)}
          lead_id={lead_id}
          checkchang={fetchFollowups}
        />
      )}
    </div>
  );
}

export default FollowUpList;
