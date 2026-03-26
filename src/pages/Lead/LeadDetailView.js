import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
  Card,
  CardBody,
  CardHeader,
  Col,
  Row,
  Badge,
  Spinner,
  Table,
} from "reactstrap";
import {
  Mail,
  Phone,
  Globe,
  Briefcase,
  Calendar,
  Star,
  MapPin,
  Package,
  User,
} from "lucide-react";
import AuthUser from "../../helpers/Authuser";

const LeadDetailView = () => {
  const { id } = useParams();
  const { http, user } = AuthUser();
  const navigate = useNavigate();
  const [callLogs, setCallLogs] = useState([]);
  const [leadData, setLeadData] = useState(null);
  const [allStages, setAllStages] = useState([]); // New state for dynamic stages
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAllData = async () => {
      try {
        setLoading(true);
        // Fetch both Lead and All Stages in parallel
        const [leadRes, stagesRes] = await Promise.all([
          http.get(`/lead/view/${id}`),
          http.get(`/stages/list`), // Assuming this is your endpoint to get tbl_stages
        ]);

        if (leadRes.data.success) setLeadData(leadRes.data.data);

        if (stagesRes.data.success) setAllStages(stagesRes.data.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchAllData();
  }, [id]);
  // useEffect(() => {

  //   http
  //     .get(`/customer/y/${leadData.customer_id}`)
  //     .then(function (response) {
  //       setCallLogs(response.data.data);
  //     })
  //     .catch(function (error) {
  //       console.log(error);
  //     });
  // }, [leadData.customer_id]);
  if (loading) {
    return (
      <div className="page-content text-center" style={{ marginTop: "10%" }}>
        <Spinner color="primary"> Loading... </Spinner>
      </div>
    );
  }

  if (!leadData)
    return (
      <div className="page-content text-center">
        <h5 className="mt-5">Lead not found.</h5>
      </div>
    );

  // 1. Helper to handle colors and icons from the API data
  const getStageDetails = (stageName) => {
    // Find the stage object from our API list to get its saved color
    const stageInfo = allStages.find((s) => s.name === stageName.name);
    return {
      color: stageInfo?.color || "primary",
      icon: "ri-checkbox-blank-circle-line",
    };
  };

  // 2. Find the index of where the Lead is currently
  // This uses findIndex to match the lead's stage_name with the list from your API
  const currentStageIndex = allStages.findIndex(
    (s) => s.name === leadData.stage_name,
  );
  const isOverdue =
    leadData.followup_date && new Date(leadData.followup_date) < new Date();
  const followUpColor = isOverdue ? "danger" : "success";

  return (
    <div className="page-content">
      <Row>
        {/* Left Column: Sidebar Info */}
        <Col xxl={3}>
          <Card>
            <CardBody className="text-center">
              <div className="avatar-lg p-1 img-thumbnail rounded-circle bg-light mx-auto">
                <div className="avatar-title bg-  rounded-circle fs-24 text-uppercase">
                  {leadData.customer_name?.charAt(0)}
                </div>
              </div>
              <h5 className="mt-3 mb-1">
                {leadData.master_type == 1
                  ? leadData.user_name
                  : leadData?.master_name}
              </h5>
              {leadData?.master_branch_name
                ? ` ${leadData?.master_branch_name}`
                : " "}
              {leadData?.master_branch_code
                ? ` - ${leadData.master_branch_code}`
                : " "}
              <p className="text-muted">Lead ID: #{leadData.lead_id}</p>
              <div className="d-flex gap-2 justify-content-center">
                <Badge color="danger" className="fs-11 text-uppercase">
                  {leadData.priority_name}
                </Badge>
              </div>
            </CardBody>
          </Card>

          <Card>
            <CardHeader>
              <h5 className="card-title mb-0">Contact Details</h5>
            </CardHeader>
            <CardBody>
              <div className="d-flex align-items-center mb-3">
                <div className="flex-shrink-0 avatar-xs me-3">
                  <div className="avatar-title bg-light text-primary rounded-circle">
                    <Mail size={16} />
                  </div>
                </div>
                <div className="flex-grow-1">
                  <p className="text-muted mb-1">Email</p>
                  <h6 className="mb-0">{leadData.customer_email || "N/A"}</h6>
                </div>
              </div>
              <div className="d-flex align-items-center mb-3">
                <div className="flex-shrink-0 avatar-xs me-3">
                  <div className="avatar-title bg-light text-primary rounded-circle">
                    <Phone size={16} />
                  </div>
                </div>
                <div className="flex-grow-1">
                  <p className="text-muted mb-1">Mobile</p>
                  <h6 className="mb-0">{leadData.customer_mobile}</h6>
                </div>
              </div>
              <div className="d-flex align-items-center">
                <div className="flex-shrink-0 avatar-xs me-3">
                  <div className="avatar-title bg-light text-primary rounded-circle">
                    <MapPin size={16} />
                  </div>
                </div>
                <div className="flex-grow-1">
                  <p className="text-muted mb-1">Address</p>
                  <h6 className="mb-0">{leadData.customer_city || "N/A"}</h6>
                </div>
              </div>
              <div className="d-flex align-items-center mt-3 mb-3">
                <div className="flex-shrink-0 avatar-xs me-3">
                  <div
                    className={`avatar-title rounded-circle ${isOverdue ? "bg-danger " : "bg-light text-primary"}`}
                  >
                    <Calendar size={16} />
                  </div>
                </div>
                <div className="flex-grow-1 ">
                  <div className="d-flex align-items-center gap-2">
                    <p className="text-muted mb-1">Next Follow-up</p>
                    {leadData.followup_date && (
                      <Badge
                        color={followUpColor}
                        className="text-uppercase fs-10"
                      >
                        {isOverdue ? "Overdue" : "Upcoming"}
                      </Badge>
                    )}
                  </div>
                  <h6
                    className={`mb-0 ${isOverdue ? "text-danger fw-bold" : ""}`}
                  >
                    {leadData.followup_date
                      ? new Date(leadData.followup_date).toLocaleDateString(
                          "en-GB",
                          {
                            day: "2-digit",
                            month: "short",
                            year: "numeric",
                          },
                        )
                      : "Not scheduled"}
                  </h6>
                </div>
              </div>
            </CardBody>
          </Card>
          {/* <Card>
            <CardHeader>
              <h5 className="card-title mb-0">Call Logs</h5>
            </CardHeader>
            <CardBody>
              <div className="d-flex align-items-center mb-3">
                <div className="flex-shrink-0 avatar-xs me-3">
                  <div className="avatar-title bg-light text-primary rounded-circle">
                    <Mail size={16} />
                  </div>
                </div>
                <div className="flex-grow-1">
                  <p className="text-muted mb-1">Email</p>
                  <h6 className="mb-0">{leadData.customer_email || "N/A"}</h6>
                </div>
              </div>
              <div className="d-flex align-items-center mb-3">
                <div className="flex-shrink-0 avatar-xs me-3">
                  <div className="avatar-title bg-light text-primary rounded-circle">
                    <Phone size={16} />
                  </div>
                </div>
                <div className="flex-grow-1">
                  <p className="text-muted mb-1">Mobile</p>
                  <h6 className="mb-0">{leadData.customer_mobile}</h6>
                </div>
              </div>
              <div className="d-flex align-items-center">
                <div className="flex-shrink-0 avatar-xs me-3">
                  <div className="avatar-title bg-light text-primary rounded-circle">
                    <MapPin size={16} />
                  </div>
                </div>
                <div className="flex-grow-1">
                  <p className="text-muted mb-1">Address</p>
                  <h6 className="mb-0">{leadData.customer_city || "N/A"}</h6>
                </div>
              </div>
              <div className="d-flex align-items-center mt-3 mb-3">
                <div className="flex-shrink-0 avatar-xs me-3">
                  <div
                    className={`avatar-title rounded-circle ${isOverdue ? "bg-danger " : "bg-light "}`}
                  >
                    <Calendar size={16} />
                  </div>
                </div>
                <div className="flex-grow-1 ">
                  <div className="d-flex align-items-center gap-2">
                    <p className="text-muted mb-1">Next Follow-up</p>
                    {leadData.followup_date && (
                      <Badge
                        color={followUpColor}
                        className="text-uppercase fs-10"
                      >
                        {isOverdue ? "Overdue" : "Upcoming"}
                      </Badge>
                    )}
                  </div>
                  <h6
                    className={`mb-0 ${isOverdue ? "text-danger fw-bold" : ""}`}
                  >
                    {leadData.followup_date
                      ? new Date(leadData.followup_date).toLocaleDateString(
                          "en-GB",
                          {
                            day: "2-digit",
                            month: "short",
                            year: "numeric",
                          },
                        )
                      : "Not scheduled"}
                  </h6>
                </div>
              </div>
            </CardBody>
          </Card> */}
        </Col>

        {/* Right Column: Main Content */}

        <Col xxl={9}>
          {/* Overview Card */}
          <Card>
            <CardHeader className="align-items-center d-flex flex-column flex-sm-row gap-2">
              <h4 className="card-title mb-0 flex-grow-1">Sales Lifecycle</h4>
              <div className="flex-shrink-0">
                <Badge color="info" className="badge-border">
                  Process Tracking
                </Badge>
              </div>
            </CardHeader>
            <CardBody>
              {/* Grid changes from 1 column on mobile to 3 columns on LG+ */}
              <Row className="text-center gy-3 gy-lg-0 mt-2">
                {/* Purchase Order Status */}
                <Col xs={12} lg={4} className="border-end-lg">
                  <div className="p-2">
                    <div className="avatar-sm mx-auto mb-2">
                      <div
                        className={`avatar-title rounded-3 fs-22 ${
                          leadData.lead_purchase_id
                            ? "bg-primary-subtle text-primary"
                            : "bg-light text-muted border border-dashed"
                        }`}
                      >
                        <i className="ri-shopping-basket-2-line"></i>
                      </div>
                    </div>
                    <h6 className="fs-13 mb-1">Purchase Order</h6>
                    {leadData.lead_purchase_id ? (
                      <Link
                        to={  !leadData.lead_quotation_id ? `/purchase-edit/${leadData.lead_purchase_id}` : `/quotation-edit/${leadData.lead_purchase_id}`}
                        className="fw-medium link-primary"
                      >
                        PO-{leadData.lead_purchase_id}{" "}
                        <i className="ri-external-link-line align-middle ms-1"></i>
                      </Link>
                    ) : (
                      <span className="text-muted fs-12 italic">Pending</span>
                    )}
                  </div>
                </Col>

                {/* Quotation Status */}
                <Col xs={12} lg={4} className="border-end-lg">
                  <div className="p-2">
                    <div className="avatar-sm mx-auto mb-2">
                      <div
                        className={`avatar-title rounded-3 fs-22 ${
                          leadData.lead_quotation_id
                            ? "bg-success-subtle text-success"
                            : "bg-light text-muted border border-dashed"
                        }`}
                      >
                        <i className="ri-file-list-3-line"></i>
                      </div>
                    </div>
                    <h6 className="fs-13 mb-1">Quotation</h6>
                       {leadData.lead_quotation_id ? (
                      <Link
                        to={!leadData.lead_invoice_id ?`/quotation-edit/${leadData.lead_quotation_id}`:`/sale-edit/${leadData.lead_invoice_id}`}
                        className="fw-medium link-primary"
                      >
                        PO-{leadData.lead_quotation_id}{" "}
                        <i className="ri-external-link-line align-middle ms-1"></i>
                      </Link>
                    ) : (
                      <span className="text-muted fs-12 italic">Pending</span>
                    )}
                  </div>
                </Col>

                {/* Invoice Status */}
                <Col xs={12} lg={4}>
                  <div className="p-2">
                    <div className="avatar-sm mx-auto mb-2">
                      <div
                        className={`avatar-title rounded-3 fs-22 ${
                          leadData.invoice_id
                            ? "bg-warning-subtle text-warning"
                            : "bg-light text-muted border border-dashed"
                        }`}
                      >
                        <i className="ri-bill-line"></i>
                      </div>
                    </div>
                    <h6 className="fs-13 mb-1">Invoice</h6>
                    {leadData.invoice_id ? (
                      <button className="btn btn-link btn-sm p-0 fw-medium link-warning">
                        #{leadData.invoice_no}{" "}
                        <i className="ri-download-2-line align-middle ms-1"></i>
                      </button>
                    ) : (
                      <span className="badge bg-light text-muted border fs-10">
                        Not Invoiced
                      </span>
                    )}
                  </div>
                </Col>
              </Row>

              {/* Quick Action to Convert */}
              {!leadData.invoice_data && (
                <div className="mt-2 pt-2 text-center border-top border-top-dashed">
                  <p className="text-muted mb-3 fs-13 fw-medium">
                    Ready to move this lead forward?
                  </p>
                  <div className="d-flex flex-column flex-sm-row gap-2 justify-content-center align-items-center">
                    {/* Primary Conversion Action */}
                    {!leadData.lead_purchase_id && (
                      <Link
                        className="btn btn-soft-primary btn-sm px-3 shadow-none"
                        to={`/purchase-create/${leadData.lead_id}`}
                      >
                        <i className="ri-exchange-funds-line align-bottom me-1"></i>
                        Convert to PO
                      </Link>
                    )}

                    {/* Secondary Actions */}
                    {!leadData.lead_quotation_id && (
                      <Link
                        className="btn btn-soft-primary btn-sm px-3 shadow-none"
                        to={
                          !leadData.lead_purchase_id
                            ? `/quotation-create/${leadData.lead_id}`
                            : `/quotation-edit/${leadData.lead_purchase_id}`
                        }
                      >
                        <i className="ri-file-list-3-line align-bottom me-1"></i>
                        Create Quotation
                      </Link>
                    )}

                    {/* Final Action */}
                    {!leadData.lead_invoice_id && <Link
                        className="btn btn-soft-primary btn-sm px-3 shadow-none"
                        to={
                          !leadData.lead_purchase_id
                            ? `/sale-create/${leadData.lead_id}`
                            : `/generate-invoice/${leadData.lead_purchase_id}`
                        }>
                      <i className="ri-bill-line align-bottom me-1"></i>
                      Create Invoice
                    </Link>}
                  </div>
                </div>
              )}
            </CardBody>
          </Card>
          <Card>
            <CardHeader className="align-items-center d-flex flex-column flex-lg-row gap-3">
              <h4 className="card-title mb-0 flex-grow-1">Overview</h4>

              <div className="flex-shrink-0">
                {/* This container will now only stack on very small screens */}
                <div className="d-flex align-items-center gap-3">
                  {/* Created By Section */}
                  <div className="d-flex align-items-center">
                    <div className="flex-shrink-0">
                      <div className="avatar-xxs">
                        <div className="avatar-title bg-soft-info rounded-circle fs-10">
                          <User size={12} />
                        </div>
                      </div>
                    </div>
                    <div className="flex-grow-1 ms-2">
                      <p className="text-muted mb-0 fs-11 fs-md-12">
                        Created by
                      </p>
                      <h6 className="mb-0 fs-12">
                        {leadData.created_employee_name || "System"}
                      </h6>
                    </div>
                  </div>

                  {/* Vertical Divider (Hidden on very small mobile screens to save space) */}
                  <div
                    className="vr text-muted opacity-25 d-none d-sm-block"
                    style={{ height: "25px" }}
                  ></div>

                  {/* Assigned To Section */}
                  <div className="d-flex align-items-center">
                    <div className="flex-shrink-0">
                      <div className="avatar-xxs">
                        <div className="avatar-title bg-soft-warning text-warning rounded-circle fs-10">
                          <Briefcase size={12} />
                        </div>
                      </div>
                    </div>
                    <div className="flex-grow-1 ms-2">
                      <p className="text-muted mb-0 fs-11 fs-md-12">
                        Assigned to
                      </p>
                      <h6 className="mb-0 fs-12">
                        {leadData.assigned_employee_name || "Unassigned"}
                      </h6>
                    </div>
                  </div>

                  {/* Action Buttons - Full width on mobile if needed, or grouped */}
                  {/* <div className="d-flex gap-2 ms-auto ms-md-2">
                    <button
                      type="button"
                      className="btn btn-primary btn-sm px-3"
                    >
                      <i className="ri-edit-box-line align-bottom me-1"></i>
                      <span className="d-none d-sm-inline">Update Lead</span>
                      <span className="d-inline d-sm-none">Update</span>
                    </button>
                  </div> */}
                </div>
              </div>
            </CardHeader>
            <CardBody>
              <Row>
                <Col lg={4} className="border-end">
                  <div className="p-2">
                    <h6 className="text-muted text-uppercase fw-semibold mb-3">
                      Lead Info
                    </h6>
                    <p className="mb-2 text-muted">
                      <Briefcase size={14} className="me-2" /> Source:{" "}
                      <b>{leadData.source_name}</b>
                    </p>
                    <p className="mb-2 text-muted">
                      <Star size={14} className="me-2" /> Reference:{" "}
                      <b>{leadData.reference_name || "Direct"}</b>
                    </p>
                    <p className="mb-0 text-muted">
                      <Calendar size={14} className="me-2" /> Inquiry:{" "}
                      <b>
                        {new Date(leadData.inquiry_date).toLocaleDateString()}
                      </b>
                    </p>
                  </div>
                </Col>
                <Col lg={8}>
                  <div className="p-2">
                    <h6 className="text-muted text-uppercase fw-semibold mb-3">
                      Feedback
                    </h6>
                    <p className="text-muted mb-0">
                      {leadData.feedback || "No feedback available."}
                    </p>
                  </div>
                </Col>
              </Row>
            </CardBody>
          </Card>

          {/* Products Section */}
          <Card>
            <CardHeader className="align-items-center d-flex">
              <h5 className="card-title mb-0 flex-grow-1">Stage Progress</h5>
            </CardHeader>
            <CardBody>
              <div className="position-relative m-4">
                {/* Background Connecting Line */}
                <div
                  className="position-absolute top-50 start-0 end-0 translate-middle-y bg-light"
                  style={{ height: "2px" }}
                ></div>

                {/* Dynamic Progress Fill (Primary Color) */}
                <div
                  className="position-absolute top-50 start-0 translate-middle-y bg-primary transition-all"
                  style={{
                    height: "2px",
                    width: `${(currentStageIndex / (allStages.length - 1)) * 100}%`,
                    transition: "width 0.5s ease-in-out",
                  }}
                ></div>

                <Row className="justify-content-between position-relative">
                  {allStages.map((stage, index) => {
                    const isCompleted = index <= currentStageIndex;
                    const isCurrent = index === currentStageIndex;
                    const stageDetails = getStageDetails(stage);

                    return (
                      <Col key={index} className="text-center">
                        {/* Stage Icon/Number */}
                        <div
                          className="avatar-sm mx-auto mb-3 position-relative"
                          style={{ zIndex: 2 }}
                        >
                          <div
                            className={`avatar-title rounded-circle shadow-sm ${
                              isCurrent
                                ? `bg-${stageDetails?.color} text-white`
                                : isCompleted
                                  ? "bg-soft-success text-success"
                                  : "bg-light text-muted border"
                            }`}
                          >
                            {isCompleted && !isCurrent ? (
                              <i className="ri-check-line fs-16"></i>
                            ) : (
                              <i className={`${stageDetails?.icon} fs-16`}></i>
                            )}
                          </div>
                        </div>

                        {/* Stage Name & Badge */}
                        <h6
                          className={`fs-13 mb-1 ${isCurrent ? "text-primary fw-bold" : "text-muted"}`}
                        >
                          {stage.name}
                        </h6>

                        {isCurrent && (
                          <Badge
                            color={`soft-${stageDetails?.color}`}
                            className="text-uppercase fs-10"
                          >
                            Current
                          </Badge>
                        )}
                      </Col>
                    );
                  })}
                </Row>
              </div>
            </CardBody>
          </Card>
          <Card>
            <CardHeader className="align-items-center d-flex">
              <h4 className="card-title mb-0 flex-grow-1">
                Interested Products
              </h4>
              <div className="flex-shrink-0">
                <Badge color="primary" className="fs-12">
                  {leadData.products?.length || 0} Items
                </Badge>
              </div>
            </CardHeader>
            <CardBody>
              <div className="table-responsive table-card">
                <Table className="align-middle text-center table-nowrap mb-0">
                  <thead className="table-light text-muted">
                    <tr>
                      <th scope="col">Product Name</th>
                      <th scope="col">Qty</th>
                      <th scope="col">HSN Code</th>
                      <th scope="col">Category</th>
                    </tr>
                  </thead>
                  <tbody>
                    {leadData.products && leadData.products.length > 0 ? (
                      leadData.products.map((item, index) => (
                        <tr key={index}>
                          <td>
                            <div className="d-flex align-items-center">
                              <div className="flex-shrink-0 avatar-xs me-2">
                                <div className="avatar-title bg-soft-info  rounded-circle fs-14">
                                  <Package size={14} />
                                </div>
                              </div>
                              <div className="flex-grow-1">
                                <h6 className="fs-14 mb-0">
                                  {item.product_english_name}
                                </h6>
                              </div>
                            </div>
                          </td>
                          <td>{item.quantity || 0}</td>
                          <td className={"text-center"}>
                            {item.product_hsn_code || "-"}
                          </td>
                          <td>{item.category_name || "General"}</td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="3" className="text-center text-muted p-4">
                          No products selected for this lead.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </Table>
              </div>
            </CardBody>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default LeadDetailView;
