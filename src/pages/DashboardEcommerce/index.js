import Select from "react-select";
import React, { useState, useEffect, useCallback } from "react";
import { Button, Card, CardBody, Col, Container, Row } from "reactstrap";
import AuthUser from "../../helpers/Authuser";

const Dashboardmain = () => {
  const getFormattedDate = (date) => date.toISOString().split("T")[0];
  const [filters, setFilters] = useState({
    start_date: getFormattedDate(new Date()),
    end_date: getFormattedDate(new Date()),
    customer_id: "",
    user_id: "",
    activeFilterType: "today", // To track which quick filter is active
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
  console.log("filters", filters);

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
      start_date: getFormattedDate(start),
      end_date: getFormattedDate(end),
      activeFilterType: value,
    }));
  };
  const { http } = AuthUser();
  const filterData = () => {
    http
      .post("/dashbord/filter", filters)
      .then((res) => {
        console.log(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  };
  useEffect(() => {
    filterData();
  }, [filters]);
  return (
    <div
      className="page-content"
      style={{ backgroundColor: "#f8f9fa", minHeight: "100vh" }}
    >
      <Container fluid className="py-2">
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
      {/* --- Performance Insights Section --- */}
      <div className="px-2 mt-5">
        <div className="d-flex align-items-center mb-4">
          <div
            className="bg-primary rounded-pill me-3"
            style={{ width: "6px", height: "24px", background: "#4b38b3" }}
          />
          <h4 className="fw-bold m-0 text-dark">Performance Insights</h4>
        </div>

        <Row className="g-4">
          {[
            {
              title: "Lead Conversion",
              color: "#4b38b3",
              data: [40, 70, 55, 90, 65, 80, 50],
              labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
              chartType: "bar",
            },
            {
              title: "Daily Revenue",
              color: "#48bb78",
              data: [30, 45, 60, 25, 80, 95, 70],
              labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
              chartType: "bar",
            },
            {
              title: "Customer Traffic",
              color: "#4299e1",
              data: [85, 40, 30, 50, 70, 40, 90],
              labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
              chartType: "bar",
            },
            {
              title: "Employee Efficiency",
              color: "#f6ad55", // Orange
              data: [
                { label: "High", value: 65, color: "#f6ad55" }, // Main Color
                { label: "Medium", value: 25, color: "#fbd38d" }, // Lighter shade
                { label: "Low", value: 10, color: "#fffaf0" }, // Very light shade
              ],
              total: 100, // For calculating the pie calculation
              chartType: "pie",
            },
          ].map((graph, idx) => (
            <Col key={idx} lg={6} md={12}>
              <Card className="border-0 shadow-sm rounded-4 overflow-hidden h-100 transition-all">
                <CardBody className="p-4">
                  <div className="d-flex justify-content-between align-items-center mb-4">
                    <h5
                      className="fw-bold m-0 text-dark"
                      style={{ fontSize: "16px" }}
                    >
                      {graph.title}
                    </h5>
                    <span
                      className="badge rounded-pill"
                      style={{
                        backgroundColor: `${graph.color}15`,
                        color: graph.color,
                        fontSize: "11px",
                      }}
                    >
                      {graph.chartType === "pie"
                        ? "Distribution"
                        : "Weekly View"}
                    </span>
                  </div>

                  {/* --- Chart Area --- */}
                  {graph.chartType === "bar" ? (
                    // --- Premium Bar Chart (Existing Style) ---
                    <div
                      className="d-flex align-items-end justify-content-between px-2"
                      style={{
                        height: "220px",
                        background: "#fbfbfd",
                        borderRadius: "16px",
                        paddingBottom: "10px",
                        position: "relative",
                      }}
                    >
                      {/* (Bar chart code is same as before, truncated for brevity) */}
                      {graph.data.map((value, i) => (
                        <div
                          key={i}
                          className="text-center"
                          style={{ width: "10%", zIndex: 1 }}
                        >
                          <div
                            className="transition-all"
                            style={{
                              height: `${value * 1.8}px`,
                              backgroundColor: graph.color,
                              borderRadius: "6px 6px 4px 4px",
                              opacity: 0.85,
                            }}
                          />
                          <div
                            className="mt-2 text-muted fw-bold"
                            style={{ fontSize: "10px" }}
                          >
                            {graph.labels[i]}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    // --- Premium Pie Chart (Pure JSX/CSS) ---
                    <Row
                      className="align-items-center"
                      style={{
                        height: "220px",
                        background: "#fbfbfd",
                        borderRadius: "16px",
                      }}
                    >
                      <Col xs={6} className="d-flex justify-content-center">
                        <div
                          style={{
                            width: "160px",
                            height: "160px",
                            borderRadius: "50%",
                            // --- Radial Gradient creates the pie slices ---
                            background: `conic-gradient(
                        ${graph.data[0].color} 0% ${graph.data[0].value}%, 
                        ${graph.data[1].color} ${graph.data[0].value}% ${graph.data[0].value + graph.data[1].value}%, 
                        ${graph.data[2].color} ${graph.data[0].value + graph.data[1].value}% 100%
                      )`,
                            boxShadow: "0 5px 15px rgba(0,0,0,0.05)",
                            // To add a 'premium' center glow
                            position: "relative",
                          }}
                        >
                          {/* Optional center cut-out (Donut look) for more premium feel */}
                          <div
                            style={{
                              position: "absolute",
                              top: "50%",
                              left: "50%",
                              transform: "translate(-50%, -50%)",
                              width: "70px",
                              height: "70px",
                              borderRadius: "50%",
                              backgroundColor: "#fbfbfd",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              fontWeight: "bold",
                              fontSize: "18px",
                              color: "#333",
                            }}
                          >
                            65%{" "}
                            <span style={{ fontSize: "10px", color: "#777" }}>
                              HIGH
                            </span>
                          </div>
                        </div>
                      </Col>
                      <Col xs={6}>
                        {/* --- Legend --- */}
                        <div className="d-flex flex-column gap-3">
                          {graph.data.map((slice, i) => (
                            <div key={i} className="d-flex align-items-center">
                              <div
                                className="rounded-circle me-3"
                                style={{
                                  width: "12px",
                                  height: "12px",
                                  backgroundColor: slice.color,
                                  border: `2px solid #fff`,
                                  boxShadow: "0 0 0 1px #e2e8f0",
                                }}
                              />
                              <div>
                                <p
                                  className="text-uppercase fw-bold m-0 text-muted"
                                  style={{
                                    fontSize: "10px",
                                    letterSpacing: "1px",
                                  }}
                                >
                                  {slice.label}
                                </p>
                                <h6 className="fw-extrabold m-0 text-dark">
                                  {slice.value}%
                                </h6>
                              </div>
                            </div>
                          ))}
                        </div>
                      </Col>
                    </Row>
                  )}
                </CardBody>

                {/* Premium Footer (Same Style as before) */}
                <div className="bg-light px-4 py-3 border-top border-light d-flex align-items-center">
                  {/* (Footer code is same as before) */}
                  <button
                    className="btn btn-sm btn-white ms-auto shadow-sm border text-muted fw-bold"
                    style={{ fontSize: "11px" }}
                  >
                    VIEW DETAILS
                  </button>
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
