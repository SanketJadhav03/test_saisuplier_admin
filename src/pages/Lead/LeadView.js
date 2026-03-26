import React, { useState, useEffect, useCallback } from "react";
// Removed global axios import to ensure we only use your custom 'http' helper
import Flatpickr from "react-flatpickr";
import "flatpickr/dist/themes/material_blue.css"; // Choose your preferred theme
import {
  Card,
  CardBody,
  Col,
  Container,
  Row,
  Badge,
  UncontrolledDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
  Input,
  Button,
  Label,
  Spinner,
} from "reactstrap";
import AuthUser from "../../helpers/Authuser";
import { toast } from "react-toastify";
import Select from "react-select";
import { Link, useNavigate } from "react-router-dom";
const LeadProView = () => {
  const { http } = AuthUser();
  const navigate = useNavigate();
  // 1. States for Data
  const [leads, setLeads] = useState([]);
  const [stages, setStages] = useState([]);
  const [sources, setSources] = useState([]);
  const [priorities, setPriorities] = useState([]);
  const [references, setReferences] = useState([]);
  const [loading, setLoading] = useState(true);

  const getFormattedDate = (date) => date.toISOString().split("T")[0];
  // 2. States for Filters
  const [filters, setFilters] = useState({
    search: "",
    startDate: getFormattedDate(new Date()),
    endDate: getFormattedDate(new Date()),
    priorityId: "",
    activeFilterType: "today",
  });
  const dateQuickFilters = [
    { label: "Today", value: "today" },
    { label: "Yesterday", value: "yesterday" },
    { label: "This Week", value: "this_week" },
    { label: "Last Week", value: "last_week" },
    { label: "This Month", value: "this_month" },
    { label: "Last Month", value: "last_month" },
    { label: "This Year", value: "this_year" },
    { label: "Last Year", value: "last_year" },
  ];

  const handleQuickFilter = (value) => {
    const now = new Date();
    let start = new Date();
    let end = new Date();

    switch (value) {
      case "today":
        break; // Default is now
      case "yesterday":
        start.setDate(now.getDate() - 1);
        end.setDate(now.getDate() - 1);
        break;
      case "this_week":
        start.setDate(now.getDate() - now.getDay()); // Sunday
        break;
      case "last_week":
        start.setDate(now.getDate() - now.getDay() - 7);
        end.setDate(now.getDate() - now.getDay() - 1);
        break;
      case "this_month":
        start = new Date(now.getFullYear(), now.getMonth(), 1);
        break;
      case "last_month":
        start = new Date(now.getFullYear(), now.getMonth() - 1, 1);
        end = new Date(now.getFullYear(), now.getMonth(), 0);
        break;
      case "this_year":
        start = new Date(now.getFullYear(), 0, 1);
        break;
      case "last_year":
        start = new Date(now.getFullYear() - 1, 0, 1);
        end = new Date(now.getFullYear() - 1, 11, 31);
        break;
      default:
        break;
    }

    setFilters((prev) => ({
      ...prev,
      startDate: getFormattedDate(start),
      endDate: getFormattedDate(end),
      activeFilterType: value,
    }));
  };

  // 3. Fetch Metadata (Stages, Sources, etc.)
  useEffect(() => {
    const fetchMetadata = async () => {
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
    fetchMetadata();
  }, []); // Added http as a dependency

  // 4. Fetch Leads (Using your http helper)
  const fetchLeads = async () => {
    setLoading(true);

    try {
      const response = await http.post("/filter/lead", {
        search: filters.search,
        startDate: filters.startDate,
        endDate: filters.endDate,
        // priority_id: filters.priorityId,
      });

      setLeads(response.data.data || []);
    } catch (err) {
      console.error("Leads fetch error:", err);
    } finally {
      setLoading(false);
    }
  }; // Added http as a dependency

  useEffect(() => {
    fetchLeads();
  }, [filters.startDate, filters.endDate, filters.search, filters.priorityId]);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div
      className="page-content"
      style={{ backgroundColor: "#f3f3f9", minHeight: "100vh" }}
    >
      <Container fluid>
        {/* Filter Section */}
        <Card className="border-0 shadow-sm mb-4 rounded-3">
          <CardBody className="p-3">
            <div className="d-flex align-items-center justify-content-center mb-4">
              <div className="text-center">
                <h3 className="fw-bold mb-0 text-dark">Search </h3>
              </div>
            </div>
            <div className="d-flex align-items-center justify-content-center">
              <div className="d-flex flex-wrap gap-2 mb-3">
                {dateQuickFilters.map((f) => {
                  // Determine if this specific button is the "active" one
                  const isActive = filters.activeFilterType === f.value;

                  return (
                    <Button
                      key={f.value}
                      size="sm"
                      className="shadow-sm border-0 px-3 rounded-pill fw-medium"
                      onClick={() => handleQuickFilter(f.value)}
                      style={{
                        backgroundColor: isActive ? "#4b38b3" : "white",
                        color: isActive ? "white" : "black",
                        transition: "all 0.2s ease", // Smooth color transition
                      }}
                    >
                      {f.label}
                    </Button>
                  );
                })}
              </div>
            </div>

            <Row className="g-3 align-items-end">
              <Col lg={1}></Col>
              <Col lg={3}>
                <Label className="fw-semibold text-muted small">SEARCH</Label>
                <Input
                  name="search"
                  value={filters.search}
                  onChange={handleFilterChange}
                  type="text"
                  placeholder="Customer or Mobile..."
                />
              </Col>
              <Col lg={2}>
                <Label className="fw-semibold text-muted small">
                  START DATE
                </Label>
                <Flatpickr
                  name="startDate"
                  className="form-control d-block" // Ensures it looks like a standard Bootstrap input
                  placeholder="Select Date"
                  value={filters.startDate}
                  onChange={(date) => {
                    handleFilterChange({
                      target: {
                        name: "startDate",
                        value: getFormattedDate(date[0]),
                      },
                    });
                  }}
                  options={{
                    dateFormat: "Y-m-d",
                    altInput: true,
                    altFormat: "d/m/Y",
                  }}
                />
              </Col>
              <Col lg={2}>
                <Label className="fw-semibold text-muted small">END DATE</Label>
                <Flatpickr
                  name="endDate"
                  className="form-control d-block"
                  placeholder="Select Date"
                  value={filters.endDate}
                  onChange={(date) => {
                    handleFilterChange({
                      target: {
                        name: "endDate",
                        value: getFormattedDate(date[0]),
                      },
                    });
                  }}
                  options={{
                    dateFormat: "Y-m-d",
                    altInput: true,
                    altFormat: "d/m/Y",
                    minDate: filters.startDate, // Optional: Prevent selecting end date before start date
                  }}
                />
              </Col>
              <Col lg={2}>
                <Label className="fw-semibold text-muted small">PRIORITY</Label>
                <Select
                  name="priorityId"
                  placeholder="All Priorities"
                  isClearable
                  // Map your priorities data to the format react-select expects: { value, label }
                  options={[
                    { value: "", label: "All Priorities" },
                    ...priorities.map((p) => ({
                      value: p.id,
                      label: p.name,
                    })),
                  ]}
                  // Find the current selected object based on your filter state
                  value={
                    filters.priorityId === ""
                      ? { value: "", label: "All Priorities" }
                      : priorities
                          .map((p) => ({ value: p.id, label: p.name }))
                          .find((opt) => opt.value === filters.priorityId) ||
                        null
                  }
                  onChange={(selectedOption) => {
                    handleFilterChange({
                      target: {
                        name: "priorityId",
                        // If cleared or "All" selected, send empty string
                        value: selectedOption ? selectedOption.value : "",
                      },
                    });
                  }}
                />
              </Col>
              <Col lg={2}>
                <Link
                  to={"/add-leads"}
                  className="btn btn-primary rounded-3 shadow-sm px-4"
                >
                  <i className="ri-add-line me-1 fw-bold"></i> Add Lead
                </Link>
              </Col>
            </Row>
          </CardBody>
        </Card>
        <div className="bg-white rounded-4 shadow-sm p-4 border border-light-subtle">
          {loading ? (
            <div className="text-center py-5">
              <Spinner color="primary" type="grow" />
              <p className="text-muted mt-2 fw-medium">Loading your leads...</p>
            </div>
          ) : (
            <div className="kanban-wrapper d-flex overflow-auto pb-4 gap-4 px-2">
              {stages.map((stage) => {
                // Determine the theme color from the stage object
                const themeColor = stage.color || "primary";
                const columnLeads = leads.filter(
                  (l) => l.stage_id === stage.id,
                );

                return (
                  <div
                    key={stage.id}
                    className="kanban-column shadow-sm bg-light-subtle rounded-3"
                    style={{ borderTop: `4px solid var(--vz-${themeColor})` }} // Velzon dynamic color variable
                  >
                    {/* Column Header */}
                    <div className="kanban-header d-flex align-items-center justify-content-between p-3 bg-white rounded-top">
                      <div className="d-flex align-items-center gap-2">
                        <h6 className="column-title mb-0 fw-bold text-uppercase fs-12 tracking-wider">
                          {stage.name}
                        </h6>
                        <Badge pill color={themeColor} className="ms-1">
                          {columnLeads.length}
                        </Badge>
                      </div>
                      <UncontrolledDropdown>
                        <DropdownToggle
                          tag="button"
                          className="btn btn-ghost-muted btn-sm p-0 shadow-none"
                        >
                          <i className="ri-more-2-fill fs-16"></i>
                        </DropdownToggle>
                        <DropdownMenu end>
                          <DropdownItem>
                            <i className="ri-settings-4-line me-2"></i>Stage
                            Settings
                          </DropdownItem>
                          <DropdownItem className="text-danger">
                            <i className="ri-delete-bin-line me-2"></i>Archive
                            All
                          </DropdownItem>
                        </DropdownMenu>
                      </UncontrolledDropdown>
                    </div>

                    {/* Scrollable Card Container */}
                    <div
                      className="kanban-card-container px-3 pt-3"
                      style={{ minHeight: "150px" }}
                    >
                   {columnLeads.map((lead) => (
  <Card
    key={lead.lead_id}
    className="lead-card border-0 shadow-sm mb-3 card-animate"
    style={{
      borderLeft: `3px solid ${
        lead.priority_name === "High" ? "#f06548" : lead.priority_name === "Medium" ? "#f7b84b" : "#299cdb"
      }`,
    }}
  >
    <CardBody className="p-3">
      {/* Header: Priority & Stage */}
      <div className="d-flex justify-content-between align-items-start mb-3">
        <div className="d-flex gap-2">
          <Badge
            color={lead.priority_name === "High" ? "danger" : lead.priority_name === "Medium" ? "warning" : "info"}
            className="rounded-pill px-2"
          >
            {lead.priority_name || "Normal"}
          </Badge>
          <Badge color="soft-success" className="text-success border-0">
            {lead.stage_name}
          </Badge>
        </div>

        <UncontrolledDropdown>
          <DropdownToggle tag="span" className="btn btn-soft-secondary btn-sm cursor-pointer">
            <i className="ri-more-fill"></i>
          </DropdownToggle>
          <DropdownMenu end>
            <DropdownItem onClick={() => navigate(`/lead-details/${lead.lead_id}`)}>
              <i className="ri-eye-line me-2 align-bottom text-muted"></i> View Detail
            </DropdownItem>
            <DropdownItem onClick={() => navigate(`/update-leads/${lead.lead_id}`)}>
              <i className="ri-pencil-line me-2 align-bottom text-muted"></i> Edit
            </DropdownItem>
          </DropdownMenu>
        </UncontrolledDropdown>
      </div>

      {/* Customer Name */}
      <div className="mb-3">
        <h6 className="fs-14 fw-bold mb-1 text-dark">{lead.customer_name}</h6>
        <div className="text-muted fs-12">
          <i className="ri-phone-line me-1 text-success"></i> {lead.customer_mobile}
        </div>
      </div>

      {/* STAFF INFO SECTION (Created By & Assigned To) */}
      <div className="bg-light rounded-3 p-2 mb-3 border border-light">
        <div className="row g-0 align-items-center">
          {/* Created By */}
          <div className="col-5">
            <p className="text-muted mb-1 fs-10 text-uppercase fw-medium">Created By</p>
            <div className="d-flex align-items-center">
              <div className="flex-grow-1">
                <h6 className="mb-0 fs-12 fw-semibold text-truncate" style={{maxWidth: '80px'}}>
                  {lead.created_employee_name || "System"}
                </h6>
              </div>
            </div>
          </div>

          {/* Arrow Icon */}
          <div className="col-2 text-center">
            <i className="ri-arrow-right-s-line text-muted fs-16"></i>
          </div>

          {/* Assigned To */}
          <div className="col-5 text-end">
            <p className="text-muted mb-1 fs-10 text-uppercase fw-medium">Assigned To</p>
            <div className="d-flex align-items-center justify-content-end">
              <h6 className="mb-0 fs-12 fw-semibold text-primary text-truncate" style={{maxWidth: '80px'}}>
                {lead.assigned_employee_name || "Pending"}
              </h6>
            </div>
          </div>
        </div>
      </div>

      {/* Footer: Date & Source */}
      <div className="pt-2 border-top border-top-dashed d-flex justify-content-between align-items-center text-muted fs-11">
        <div>
          <i className="ri-calendar-event-line me-1 text-primary"></i>
          {new Date(lead.inquiry_date).toLocaleDateString("en-GB", {
            day: "2-digit",
            month: "short",
            year: "numeric",
          })}
        </div>
        <div className="fw-medium">
          <i className="ri-global-line me-1 text-primary"></i>
          {lead.source_name || "Direct"}
        </div>
      </div>
    </CardBody>
  </Card>
))}
                    </div>

                    {/* Fixed Footer Button */}
                    <div className="p-3 mt-auto">
                      <Link
                        to={`/add-leads/${stage.id}`}
                        className={`btn btn-soft-${themeColor} w-100 py-2 border-dashed d-flex align-items-center justify-content-center`}
                      >
                        <i className="ri-add-line me-1 fs-16"></i> Add Lead
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </Container>

      {/* Internal Styles */}
      <style>{`
  .kanban-wrapper::-webkit-scrollbar { height: 7px; }
  .kanban-wrapper::-webkit-scrollbar-thumb { background: #e2e8f0; border-radius: 10px; }

  .kanban-column {
    background-color: #f8f9fa; 
    border-radius: 16px;
    min-width: 320px;
    max-width: 320px;
    display: flex;
    flex-direction: column;
    height: calc(100vh - 280px); /* Adjust based on your header height */
    border: 1px solid #eef0f2;
  }

  .kanban-header {
    padding: 18px 20px;
    background: #ffffff;
    border-radius: 16px 16px 0 0;
    border-bottom: 1px solid #f1f3f5;
  }

  .stage-indicator {
    width: 6px;
    height: 18px;
    background: #4b38b3;
    border-radius: 10px;
    margin-right: 12px;
  }

  .column-title {
    font-size: 13px;
    font-weight: 700;
    color: #343a40;
    text-transform: uppercase;
    letter-spacing: 0.8px;
  }

  .count-badge {
    background: #f1f3f9;
    color: #4b38b3;
    font-size: 11px;
    padding: 2px 8px;
    border-radius: 6px;
    margin-left: 10px;
    font-weight: 600;
  }

  .kanban-card-container {
    padding: 15px;
    overflow-y: auto;
    flex-grow: 1;
  }

  /* Lead Card Styling */
  .lead-card {
    background: #ffffff;
    border-radius: 12px;
    transition: all 0.25s cubic-bezier(0.02, 0.01, 0.47, 1);
    cursor: grab;
  }

  .lead-card:hover {
    transform: translateY(-5px);
    box-shadow: 0 10px 25px rgba(75, 56, 179, 0.1) !important;
  }

  .lead-name {
    color: #2d3748;
    font-size: 14.5px;
    font-weight: 600;
  }

  .lead-phone {
    font-size: 13px;
    color: #718096;
  }

  .priority-badge {
    font-size: 10px;
    font-weight: 600;
    padding: 4px 8px;
    border-radius: 5px;
  }

  /* Dynamic Priority Colors */
  .priority-badge.high { background: #fff5f5; color: #e53e3e; }
  .priority-badge.medium { background: #fffaf0; color: #dd6b20; }
  .priority-badge.normal { background: #f0f5ff; color: #3182ce; }

  .source-tag { font-size: 11px; color: #a0aec0; font-weight: 500; }
  .date-tag { font-size: 11px; color: #cbd5e0; }

  .btn-add-task {
    background: #ffffff;
    border: 1px dashed #cbd5e0;
    color: #718096;
    font-weight: 600;
    font-size: 13px;
    border-radius: 10px;
    transition: 0.2s;
  }

  .btn-add-task:hover {
    background: #4b38b3;
    color: white !important;
    border-style: solid;
    border-color: #4b38b3;
  }

  .btn-icon-sm {
    padding: 2px 6px;
    color: #a0aec0;
    background: transparent;
    border: none;
  }
`}</style>
    </div>
  );
};

export default LeadProView;
