import Select from "react-select";
import React, { useState, useEffect, useCallback } from "react";
import { Button, Card, CardBody, Col, Container, Row } from "reactstrap";
import AuthUser from "../../helpers/Authuser";

const Dashboardmain = () => {
  const [counters, setCounters] = useState({
    total_leads: 0,
    total_purchases: 0,
    total_quotations: 0,
    total_invoices: 0,
  });
  const [chartData, setChartData] = useState([
    {
      title: "Lead Conversion",
      color: "#4b38b3",
      data: [0, 0, 0, 0, 0, 0, 0],
      labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
      chartType: "bar",
    },
    {
      title: "Daily Revenue",
      color: "#48bb78",
      data: [0, 0, 0, 0, 0, 0, 0],
      labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
      chartType: "bar",
    },
    {
      title: "Customer Traffic",
      color: "#4299e1",
      data: [0, 0, 0, 0, 0, 0, 0],
      labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
      chartType: "bar",
    },
    {
      title: "Order Distribution",
      color: "#f6ad55",
      chartType: "pie",
      data: [
        { label: "Invoices", value: 0, color: "#f6ad55" },
        { label: "Quotations", value: 0, color: "#fbd38d" },
        { label: "Purchases", value: 0, color: "#fffaf0" },
      ],
    },
  ]);
  // To store the list data for tables or details
  const [leads, setLeads] = useState([]);
  const [invoices, setInvoices] = useState([]);

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
        setCounters(res.data.counters);
        setLeads(res.data.leads);
        setInvoices(res.data.invoices);
      })
      .catch((err) => {
        console.log(err);
      });
  };
  // Inside your Row for "Order Analytics"
  const orderStats = [
    {
      title: "Leads",
      count: counters.total_leads,
      color: "#f6ad55",
      bg: "#fffaf0",
    },
    {
      title: "Quotations",
      count: counters.total_quotations,
      color: "#4299e1",
      bg: "#ebf8ff",
    },
    {
      title: "Invoices",
      count: counters.total_invoices,
      color: "#48bb78",
      bg: "#f0fff4",
    },
    {
      title: "Purchases",
      count: counters.total_purchases,
      color: "#b794f4",
      bg: "#faf5ff",
    },
  ];

  useEffect(() => {
    // Create mapping for days where 0 = Sunday, 1 = Monday...
    // We align this to your labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]
    // This means Monday is index 0 in the chart array, Sunday is index 6.
    const revenueByDay = [0, 0, 0, 0, 0, 0, 0];
    const leadsByDay = [0, 0, 0, 0, 0, 0, 0];

    const getChartIndex = (date) => {
      const day = date.getDay(); // 0 (Sun) to 6 (Sat)
      return day === 0 ? 6 : day - 1; // Converts Sun to 6, Mon to 0, Tue to 1...
    };

    invoices.forEach((inv) => {
      if (inv.master_bill_date) {
        const [d, m, y] = inv.master_bill_date.split("/");
        const date = new Date(`${y}-${m}-${d}`);
        revenueByDay[getChartIndex(date)] += parseFloat(
          inv.master_final_total || 0,
        );
      }
    });

    leads.forEach((lead) => {
      if (lead.inquiry_date) {
        const date = new Date(lead.inquiry_date);
        leadsByDay[getChartIndex(date)] += 1;
      }
    });

    const total =
      counters.total_invoices +
        counters.total_quotations +
        counters.total_purchases || 1;
    const getPercent = (val) => Math.round((val / total) * 100);

    // Use a functional update to avoid chartData dependency loop
    setChartData((prev) => [
      { ...prev[0], data: leadsByDay },
      { ...prev[1], data: revenueByDay },
      { ...prev[2], data: [10, 20, 15, 30, 45, 20, 10] }, // Traffic placeholder
      {
        ...prev[3],
        data: [
          {
            label: "Invoices",
            value: getPercent(counters.total_invoices),
            color: "#f6ad55",
          },
          {
            label: "Quotations",
            value: getPercent(counters.total_quotations),
            color: "#4299e1",
          },
          {
            label: "Purchases",
            value: getPercent(counters.total_purchases),
            color: "#b794f4",
          },
        ],
      },
    ]);
  }, [
    invoices,
    leads,
    counters.total_invoices,
    counters.total_quotations,
    counters.total_purchases,
  ]);
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
            {/* <Row className="justify-content-center g-3">
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
            </Row> */}
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
            {orderStats.map((item, idx) => (
              <Col
                key={idx}
                xs={12}
                sm={6}
                lg={3}
                style={{
                  borderLeft: `2px solid ${item.color}`,
                  borderRadius: "8px",
                }}
              >
                <Card
                  className="border-0 shadow-sm h-100 rounded-4"
                  style={{ borderLeft: `5px solid ${item.color}` }}
                >
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
                      <i className="ri-numbers-line fs-4"></i>
                    </div>
                    <div>
                      <div
                        className="text-uppercase fw-bold text-muted mb-1"
                        style={{ fontSize: "11px" }}
                      >
                        {item.title}
                      </div>
                      <h3 className="fw-bold mb-0">
                        {item?.count?.toLocaleString()}
                      </h3>
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
          {chartData.map((graph, idx) => (
            <Col key={idx} lg={6} md={12}>
              <Card className="border-0 shadow-sm rounded-4 overflow-hidden h-100 transition-all border-top-0">
                {/* Premium Top Border Accent */}
                <div
                  style={{
                    height: "4px",
                    background: graph.color,
                    opacity: 0.8,
                  }}
                />

                <CardBody className="p-4">
                  <div className="d-flex justify-content-between align-items-center mb-4">
                    <div>
                      <h5
                        className="fw-bold m-0 text-dark"
                        style={{ fontSize: "16px" }}
                      >
                        {graph.title}
                      </h5>
                      <small
                        className="text-muted"
                        style={{ fontSize: "11px" }}
                      >
                        Performance Analytics
                      </small>
                    </div>
                    <span
                      className="badge rounded-pill"
                      style={{
                        backgroundColor: `${graph.color}15`,
                        color: graph.color,
                        fontSize: "11px",
                        padding: "6px 12px",
                      }}
                    >
                      {graph.chartType === "pie"
                        ? "Distribution"
                        : "Weekly View"}
                    </span>
                  </div>

                  {/* --- Dynamic Chart Logic --- */}
                  {graph.chartType === "bar" ? (
                    <div
                      className="d-flex align-items-end justify-content-between px-3"
                      style={{
                        height: "220px",
                        background:
                          "linear-gradient(to bottom, #ffffff, #f8fafc)",
                        borderRadius: "16px",
                        paddingBottom: "15px",
                        border: "1px solid #f1f5f9",
                      }}
                    >
                      {graph.data.map((value, i) => {
                        const max = Math.max(...graph.data) || 1;
                        const percentage = (value / max) * 100;
                        return (
                          <div
                            key={i}
                            className="text-center"
                            style={{ width: "10%" }}
                          >
                            <div
                              className="transition-all"
                              title={`${graph.labels[i]}: ${value}`}
                              style={{
                                height: `${Math.max(percentage * 1.8, 5)}px`, // Minimum 5px height for visibility
                                backgroundColor: graph.color,
                                borderRadius: "6px 6px 2px 2px",
                                opacity: 0.85,
                                boxShadow: `0 4px 12px ${graph.color}30`,
                              }}
                            />
                            <div
                              className="mt-2 text-muted fw-bold"
                              style={{ fontSize: "10px" }}
                            >
                              {graph.labels[i]}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    /* --- PIE CHART SECTION --- */
                    <Row
                      className="align-items-center justify-content-center"
                      style={{ minHeight: "220px" }}
                    >
                      <Col xs={6} className="d-flex justify-content-center">
                        <div
                          style={{
                            width: "150px",
                            height: "150px",
                            borderRadius: "50%",
                            background: `conic-gradient(
                      ${graph.data[0].color} 0% ${graph.data[0].value}%, 
                      ${graph.data[1].color} ${graph.data[0].value}% ${graph.data[0].value + graph.data[1].value}%, 
                      ${graph.data[2].color} ${graph.data[0].value + graph.data[1].value}% 100%
                    )`,
                            boxShadow: "0 10px 20px rgba(0,0,0,0.05)",
                            position: "relative",
                          }}
                        >
                          <div
                            style={{
                              position: "absolute",
                              top: "50%",
                              left: "50%",
                              transform: "translate(-50%, -50%)",
                              width: "80px",
                              height: "80px",
                              borderRadius: "50%",
                              backgroundColor: "white",
                              display: "flex",
                              flexDirection: "column",
                              alignItems: "center",
                              justifyContent: "center",
                              boxShadow: "inset 0 2px 4px rgba(0,0,0,0.05)",
                            }}
                          >
                            <span
                              style={{ fontSize: "16px", fontWeight: "900" }}
                            >
                              {graph.data[0].value}%
                            </span>
                            <span
                              style={{
                                fontSize: "8px",
                                color: "#94a3b8",
                                fontWeight: "bold",
                              }}
                            >
                              TOP
                            </span>
                          </div>
                        </div>
                      </Col>
                      <Col xs={6}>
                        <div className="d-flex flex-column gap-2">
                          {graph.data.map((slice, i) => (
                            <div
                              key={i}
                              className="d-flex align-items-center p-2 rounded-3 hover-bg-light"
                            >
                              <div
                                className="rounded-circle me-2"
                                style={{
                                  width: "10px",
                                  height: "10px",
                                  backgroundColor: slice.color,
                                }}
                              />
                              <div style={{ lineHeight: "1.2" }}>
                                <p
                                  className="m-0 text-muted fw-bold"
                                  style={{ fontSize: "10px" }}
                                >
                                  {slice.label}
                                </p>
                                <h6
                                  className="m-0 fw-bold"
                                  style={{ fontSize: "13px" }}
                                >
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
              </Card>
            </Col>
          ))}
        </Row>
      </div>
    </div>
  );
};

export default Dashboardmain;
