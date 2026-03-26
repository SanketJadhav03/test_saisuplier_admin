import Select from "react-select";
import React, { useState, useEffect, useCallback } from "react";
import { Button, Card, CardBody, Col, Container, Row } from "reactstrap";

const Dashboardmain = () => {
  const getFormattedDate = (date) => date.toISOString().split("T")[0];
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
  return (
    <div
      className="page-content"
      style={{ backgroundColor: "#f8f9fa", minHeight: "100vh" }}
    >
      <Container fluid className="py-4">
        {/* --- Header & Main Filter Card --- */}
        <Card className="border-0 shadow-sm mb-5 rounded-4 overflow-hidden">
          <div
            style={{
              height: "4px",
              background: "linear-gradient(90deg, #4b38b3, #6959cd)",
            }}
          />
          <CardBody className="p-4">
            <div className="text-center mb-4">
              <h2
                className="fw-extrabold text-darker mb-1"
                style={{ letterSpacing: "-0.5px" }}
              >
                Lead Management
              </h2>
              <p className="text-muted small">
                Filter and monitor your business performance in real-time
              </p>
            </div>

            {/* Premium Quick Filters */}
            <div className="d-flex justify-content-center mb-4">
              <div className="bg-light p-1 rounded-pill d-inline-flex gap-1 shadow-inner">
                {dateQuickFilters.map((f) => {
                  const isActive = filters.activeFilterType === f.value;
                  return (
                    <Button
                      key={f.value}
                      onClick={() => handleQuickFilter(f.value)}
                      className="border-0 px-4 py-2 rounded-pill fw-semibold transition-all"
                      style={{
                        fontSize: "13px",
                        backgroundColor: isActive ? "#4b38b3" : "transparent",
                        color: isActive ? "white" : "#6c757d",
                        boxShadow: isActive
                          ? "0 4px 10px rgba(75, 56, 179, 0.3)"
                          : "none",
                      }}
                    >
                      {f.label}
                    </Button>
                  );
                })}
              </div>
            </div>

            {/* Dropdown Selectors */}
            <Row className="justify-content-center g-3">
              {[
                { label: "Select Role", width: 260 },
                { label: "Select Employee", width: 260 },
                { label: "Select Customer", width: 260 },
              ].map((item, index) => (
                <Col key={index} xs="auto">
                  <div className="px-1">
                    <label
                      className="text-uppercase fw-bold text-muted mb-2 d-block"
                      style={{ fontSize: "18px", letterSpacing: "1px" }}
                    >
                      {item.label}
                    </label>
                    <Select
                      styles={{
                        container: (base) => ({ ...base, width: item.width }),
                        control: (base, state) => ({
                          ...base,
                          borderRadius: "10px",
                          border: "1px solid #e2e8f0",
                          padding: "2px",
                          boxShadow: state.isFocused
                            ? "0 0 0 3px rgba(75, 56, 179, 0.1)"
                            : "none",
                          "&:hover": { borderColor: "#4b38b3" },
                        }),
                        placeholder: (base) => ({
                          ...base,
                          fontSize: "14px",
                          color: "#a0aec0",
                        }),
                      }}
                      options={[{ value: 0, label: "All Records" }]}
                    />
                  </div>
                </Col>
              ))}
            </Row>
          </CardBody>
        </Card>

        {/* --- Order Status Grid --- */}
        <div className="px-2">
          <div className="d-flex align-items-center mb-4">
            <div
              className="bg-primary rounded-3 me-3"
              style={{ width: "12px", height: "24px" }}
            />
            <h4 className="fw-bold m-0 text-dark">Order Analytics</h4>
          </div>

          <Row className="g-4">
            {[
              {
                title: "Pending",
                count: "124",
                color: "#f6ad55",
                bg: "#fffaf0",
              },
              {
                title: "Processing",
                count: "45",
                color: "#4299e1",
                bg: "#ebf8ff",
              },
              {
                title: "Shipped",
                count: "89",
                color: "#b794f4",
                bg: "#faf5ff",
              },
              {
                title: "Delivered",
                count: "1,240",
                color: "#48bb78",
                bg: "#f0fff4",
              },
              {
                title: "Cancelled",
                count: "12",
                color: "#f56565",
                bg: "#fff5f5",
              },
              {
                title: "On Hold",
                count: "08",
                color: "#ed64a6",
                bg: "#fff5f7",
              },
              {
                title: "Returns",
                count: "03",
                color: "#718096",
                bg: "#f7fafc",
              },
              {
                title: "Completed",
                count: "2,100",
                color: "#38b2ac",
                bg: "#e6fffa",
              },
            ].map((item, idx) => (
              <Col key={idx} xs={12} sm={6} lg={3}>
                {" "}
                <Card
                  className="border-0 shadow-sm h-100 transition-all rounded-4"
                  style={{
                    cursor: "pointer",
                    background: "white",
                    borderLeft: `5px solid ${item.color}`,
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = "translateY(-5px)";
                    e.currentTarget.style.boxShadow =
                      "0 10px 20px rgba(0,0,0,0.08)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = "translateY(0)";
                    e.currentTarget.style.boxShadow =
                      "0 0.125rem 0.25rem rgba(0,0,0,0.075)";
                  }}
                >
                  <div
                    style={{
                      height: "4px",
                      background: "linear-gradient(90deg, #4b38b3, #6959cd)",
                    }}
                  />
                  <CardBody className="p-4 d-flex align-items-center">
                    <div
                      className="rounded-circle d-flex align-items-center justify-content-center me-3"
                      style={{
                        width: "50px",
                        height: "50px",
                        backgroundColor: item.bg,
                        color: item.color,
                      }}
                    >
                      <i className="ri-stack-line fs-4"></i>{" "}
                      {/* Replace with your icons */}
                    </div>
                    <div>
                      <div
                        className="text-uppercase fw-bold text-muted mb-1"
                        style={{ fontSize: "11px", letterSpacing: "0.5px" }}
                      >
                        {item.title}
                      </div>
                      <h3 className="fw-bold mb-0">{item.count}</h3>
                    </div>
                  </CardBody>
                </Card>
              </Col>
            ))}
          </Row>
        </div>
      </Container>
      {/* --- Performance Insights Section --- */}
      {/* --- Performance Insights Section --- */}
      {/* --- Performance Insights Section --- */}
      {/* --- Performance Insights Section --- */}
      <div className="px-2 mt-5">
        <div className="d-flex align-items-center mb-4">
          <div
            className="bg-primary rounded-3 me-3"
            style={{ width: "12px", height: "24px", background: "#4b38b3" }}
          />
          <h4 className="fw-bold m-0 text-dark">Performance Insights</h4>
        </div>

        <Row className="g-4">
          {[
            {
              title: "Lead Conversion Funnel",
              subtitle: "Sales pipeline volume by stage",
              type: "infographic-bar",
              data: [
                {
                  label: "Leads",
                  value: 1200,
                  icon: "ri-user-add-line",
                  color: ["#4b38b3", "#8b5cf6"],
                }, // Purple
                {
                  label: "Contacted",
                  value: 850,
                  icon: "ri-phone-line",
                  color: ["#ec4899", "#f472b6"],
                }, // Pink
                {
                  label: "Qualified",
                  value: 450,
                  icon: "ri-award-line",
                  color: ["#f6ad55", "#fbd38d"],
                }, // Orange
                {
                  label: "Negotiation",
                  value: 200,
                  icon: "ri-discuss-line",
                  color: ["#4299e1", "#90cdf4"],
                }, // Blue
                {
                  label: "Converted",
                  value: 85,
                  icon: "ri-checkbox-circle-line",
                  color: ["#48bb78", "#9ae6b4"],
                }, // Green
              ],
            },
            {
              title: "Revenue Forecast",
              subtitle: "Monthly projected vs actual ($k)",
              type: "infographic-bar",
              data: [
                { label: "Jan", value: 45, color: ["#4b38b3", "#8b5cf6"] },
                { label: "Feb", value: 52, color: ["#ec4899", "#f472b6"] },
                { label: "Mar", value: 48, color: ["#f6ad55", "#fbd38d"] },
                { label: "Apr", value: 70, color: ["#4299e1", "#90cdf4"] },
                { label: "May", value: 65, color: ["#48bb78", "#9ae6b4"] },
                { label: "Jun", value: 85, color: ["#f1c40f", "#f4d03f"] }, // Yellow
              ],
            },
            {
              title: "Customer Acquisition",
              subtitle: "Leads by marketing channel",
              type: "infographic-bar",
              data: [
                { label: "Social", value: 80, color: ["#4b38b3", "#8b5cf6"] },
                { label: "Organic", value: 65, color: ["#ec4899", "#f472b6"] },
                { label: "Direct", value: 40, color: ["#f6ad55", "#fbd38d"] },
                { label: "Referral", value: 55, color: ["#4299e1", "#90cdf4"] },
                { label: "Email", value: 90, color: ["#48bb78", "#9ae6b4"] },
              ],
            },
            {
              title: "Employee Performance",
              subtitle: "Task distribution status",
              type: "pie",
              data: [
                { label: "Completed", value: 65, color: "#4b38b3" },
                { label: "In Progress", value: 25, color: "#6959cd" },
                { label: "Delayed", value: 10, color: "#e2e8f0" },
              ],
            },
          ].map((graph, idx) => (
            <Col key={idx} lg={6} md={12}>
              <Card className="border-0 shadow-sm rounded-4 overflow-hidden h-100">
                <CardBody className="p-4">
                  <div className="d-flex justify-content-between align-items-start mb-4">
                    <div>
                      <h5 className="fw-bold mb-1 text-dark">{graph.title}</h5>
                      <p className="text-muted small mb-0">{graph.subtitle}</p>
                    </div>
                    <button className="btn btn-link text-muted p-0">
                      <i className="ri-more-2-fill fs-5"></i>
                    </button>
                  </div>

                  {/* --- Chart Container --- */}
                  <div
                    className="d-flex align-items-center justify-content-center"
                    style={{
                      minHeight: "300px",
                      backgroundColor: "#f8fafc",
                      borderRadius: "16px",
                      padding: "20px",
                    }}
                  >
                    {graph.type === "pie" ? (
                      /* Pie Chart Logic (Unchanged) */
                      <div className="row w-100 align-items-center">
                        {/* ... Pie Chart code ... */}
                      </div>
                    ) : (
                      /* --- NEW: Colorful Infographic Bar Style --- */
                      <div
                        className="w-100 h-100 d-flex align-items-end justify-content-between px-3"
                        style={{ height: "240px", position: "relative" }}
                      >
                        {(() => {
                          const maxVal = Math.max(
                            ...graph.data.map((d) => d.value),
                          );
                          return graph.data.map((item, i) => (
                            <div
                              key={i}
                              className="d-flex flex-column align-items-center"
                              style={{ flex: 1, position: "relative" }}
                            >
                              {/* 1. Value Bubble */}
                              <div
                                className="shadow-sm transition-all"
                                style={{
                                  backgroundColor: `${item.color[0]}15`, // Translucent background
                                  color: item.color[0],
                                  padding: "4px 8px",
                                  borderRadius: "20px",
                                  fontSize: "10px",
                                  fontWeight: "800",
                                  border: `1px solid ${item.color[0]}33`,
                                  position: "absolute",
                                  top: "-35px", // Floating above the bar
                                  opacity: 0.9,
                                }}
                              >
                                {item.value.toLocaleString()}
                              </div>

                              {/* 2. Bar and Track */}
                              <div
                                style={{
                                  height: "180px", // Total Track Height
                                  width: "12px", // THIN BARS
                                  backgroundColor: "#f1f5f9", // Light Track color
                                  borderRadius: "10px",
                                  position: "relative",
                                  display: "flex",
                                  alignItems: "flex-end", // Align bars to bottom
                                  overflow: "hidden",
                                  boxShadow: "inset 0 2px 4px rgba(0,0,0,0.03)",
                                }}
                              >
                                {/* 3. The Colorful Bar with Gradient */}
                                <div
                                  className="transition-all"
                                  style={{
                                    height: `${(item.value / maxVal) * 100}%`,
                                    width: "100%",
                                    // Linear gradient from color[0] to color[1]
                                    background: `linear-gradient(180deg, ${item.color[1]} 0%, ${item.color[0]} 100%)`,
                                    borderRadius: "10px",
                                    // Color-matched glow shadow
                                    boxShadow: `0 4px 10px ${item.color[0]}44`,
                                  }}
                                />
                              </div>

                              {/* 4. X-Axis Label with Icon (if available) */}
                              <div className="d-flex flex-column align-items-center mt-3">
                                {item.icon && (
                                  <i
                                    className={`${item.icon} text-muted mb-1`}
                                    style={{ fontSize: "14px", opacity: 0.5 }}
                                  ></i>
                                )}
                                <span
                                  className="text-muted fw-bold text-center"
                                  style={{
                                    fontSize: "8px",
                                    letterSpacing: "0.8px",
                                    textTransform: "uppercase",
                                  }}
                                >
                                  {item.label}
                                </span>
                              </div>
                            </div>
                          ));
                        })()}
                      </div>
                    )}
                  </div>
                </CardBody>

                <div className="bg-light px-4 py-2 border-top border-light d-flex justify-content-between align-items-center">
                  <span className="text-success small fw-bold">
                    <i className="ri-arrow-right-up-line"></i> +14.2% Growth
                  </span>
                  <span className="text-muted small">Updated live</span>
                </div>
              </Card>
            </Col>
          ))}
        </Row>
      </div>
    </div>
  );
};

export default Dashboardmain;
