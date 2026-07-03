// components/CustomerHistory.jsx
import React, { useState, useEffect } from "react";
import {
  User,
  ShoppingBag,
  FileText,
  CreditCard,
  TrendingUp,
  Phone,
  Mail,
  MapPin,
  Search,
  RefreshCw,
  Download,
  Eye,
  X,
} from "lucide-react";
import Select from "react-select";
import DatePicker from "react-datepicker";
import { format } from "date-fns";
import "react-datepicker/dist/react-datepicker.css";
import AuthUser from "../../helpers/Authuser";
import { toast } from "react-toastify";

const CustomerHistory = () => {
  const { http } = AuthUser();
  const [loading, setLoading] = useState(false);
  const [customerData, setCustomerData] = useState(null);
  const [customersList, setCustomersList] = useState([]);
  const [customerOptions, setCustomerOptions] = useState([]);
  const [activeTab, setActiveTab] = useState("leads");
  const [selectedCustomer, setSelectedCustomer] = useState(null);

  const [filters, setFilters] = useState({
    customerId: "",
    startDate: null,
    endDate: null,
  });

  // ============================================
  // FETCH CUSTOMERS LIST
  // ============================================
  const fetchCustomersList = async () => {
    try {
      const response = await http.get("/users/list");

      if (response.data && response.data.data) {
        const options = response.data.data.map((customer) => ({
          value: customer.user_id,
          label: `${customer.master_name} ${customer.user_name}`,
          email: customer.master_email || customer.email,
          mobile: customer.master_mobile || customer.mobile,
        }));
        setCustomerOptions(options);
        setCustomersList(response.data.data);
      }
    } catch (error) {
      console.error("Error fetching customers list:", error);
    }
  };

  // ============================================
  // FETCH CUSTOMER DATA
  // ============================================
  const fetchCustomerData = async () => {
    if (!filters.customerId) return;

    setLoading(true);
    try {
      const params = {};

      if (filters.customerId) {
        params.customerId = filters.customerId;
      }

      if (filters.startDate) {
        params.startDate = format(filters.startDate, "dd/MM/yyyy");
      }
      if (filters.endDate) {
        params.endDate = format(filters.endDate, "dd/MM/yyyy");
      }

      const response = await http.post("/customers", params);
      console.log("Customer Data Response:", response.data);

      if (response.data) {
        setCustomerData(response.data);
      }
    } catch (error) {
      console.error("Error fetching customer data:", error);
      toast.error("Failed to fetch customer data");
    } finally {
      setLoading(false);
    }
  };

  // ============================================
  // HANDLE FUNCTIONS
  // ============================================
  const handleCustomerSelect = (option) => {
    if (option) {
      setSelectedCustomer(option);
      setFilters({
        ...filters,
        customerId: option.value,
      });
    } else {
      setSelectedCustomer(null);
      setFilters({
        ...filters,
        customerId: "",
      });
      setCustomerData(null);
    }
  };

  const handleFilterChange = (key, value) => {
    setFilters({
      ...filters,
      [key]: value,
    });
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  const handleSearch = () => {
    fetchCustomerData();
  };

  const resetFilters = () => {
    setFilters({
      customerId: "",
      startDate: null,
      endDate: null,
    });
    setSelectedCustomer(null);
    setCustomerData(null);
  };

  const clearDates = () => {
    setFilters({
      ...filters,
      startDate: null,
      endDate: null,
    });
  };

  const handleStartDateChange = (date) => {
    setFilters({
      ...filters,
      startDate: date,
    });
  };

  const handleEndDateChange = (date) => {
    setFilters({
      ...filters,
      endDate: date,
    });
  };

  // ============================================
  // FORMAT FUNCTIONS
  // ============================================
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount || 0);
  };

  const getStatusBadge = (status) => {
    const statusMap = {
      1: { label: "Active", class: "bg-success" },
      2: { label: "Inactive", class: "bg-danger" },
      3: { label: "Pending", class: "bg-warning" },
      Delivered: { label: "Delivered", class: "bg-success" },
      Processing: { label: "Processing", class: "bg-warning" },
      Shipped: { label: "Shipped", class: "bg-info" },
      Accepted: { label: "Accepted", class: "bg-success" },
      Pending: { label: "Pending", class: "bg-warning" },
      Expired: { label: "Expired", class: "bg-danger" },
      Paid: { label: "Paid", class: "bg-success" },
      Unpaid: { label: "Unpaid", class: "bg-danger" },
      Overdue: { label: "Overdue", class: "bg-warning" },
      Converted: { label: "Converted", class: "bg-success" },
      New: { label: "New", class: "bg-primary" },
      Contacted: { label: "Contacted", class: "bg-info" },
      Qualified: { label: "Qualified", class: "bg-secondary" },
    };
    return (
      statusMap[status] || { label: status || "N/A", class: "bg-secondary" }
    );
  };

  // ============================================
  // USE EFFECTS
  // ============================================
  useEffect(() => {
    fetchCustomersList();
  }, []);

  useEffect(() => {
    if (filters.customerId) {
      fetchCustomerData();
    }
  }, [filters.customerId]);

  // ============================================
  // RENDER STAT CARD
  // ============================================
  const StatCard = ({ icon: Icon, title, value, count, variant, onClick }) => {
    const variants = {
      primary: "bg-primary bg-opacity-10 text-primary",
      info: "bg-info bg-opacity-10 text-info",
      success: "bg-success bg-opacity-10 text-success",
      warning: "bg-warning bg-opacity-10 text-warning",
    };

    return (
      <div
        className="card"
        style={{ cursor: onClick ? "pointer" : "default" }}
        onClick={onClick}
      >
        <div className="card-body">
          <div className="d-flex align-items-center">
            <div className="flex-shrink-0 me-3">
              <div
                className={`avatar-sm rounded-circle d-flex align-items-center justify-content-center ${variants[variant]}`}
                style={{ width: "48px", height: "48px" }}
              >
                <Icon
                  className="font-size-20"
                  style={{ width: "24px", height: "24px" }}
                />
              </div>
            </div>
            <div className="flex-grow-1 overflow-hidden">
              <p className="text-muted text-truncate mb-1">{title}</p>
              <h5 className="mb-1">{formatCurrency(value)}</h5>
              <p className="text-muted mb-0 font-size-13">
                {count} {title}
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // ============================================
  // RENDER TABLES
  // ============================================
  const renderLeadsTable = () => {
    const leads = customerData?.leads || [];

    if (leads.length === 0) {
      return (
        <div className="text-center py-5">
          <TrendingUp
            className="mx-auto mb-3 text-muted"
            style={{ width: "48px", height: "48px" }}
          />
          <h5>No Leads Found</h5>
          <p className="text-muted">No leads available for this customer</p>
        </div>
      );
    }

    return (
      <div className="table-responsive">
        <table className="table table-nowrap align-middle mb-0">
          <thead className="table-light">
            <tr>
              <th>#</th>
              <th>Customer Name</th>
              <th>Email</th>
              <th>Mobile</th>
              <th>Date</th>
              <th>Stage</th>
            </tr>
          </thead>
          <tbody>
            {leads.map((lead, index) => {
              const stage = lead.stage_name || "N/A";
              const stageColor = lead.stage_color || "secondary";
              return (
                <tr key={lead.lead_id || index}>
                  <td>{index + 1}</td>
                  <td className="fw-medium">{lead.customer_name || "N/A"}</td>
                  <td>{lead.customer_email || "N/A"}</td>
                  <td>{lead.customer_mobile || "N/A"}</td>
                  <td>{lead.inquiry_date || "N/A"}</td>
                  <td>
                    <span className={`badge bg-${stageColor}`}>{stage}</span>
                  </td>
                </tr>
              );
            })}
          </tbody>
          <tfoot className="table-light">
            <tr>
              <td colSpan="5" className="text-end fw-bold">
                Total Leads
              </td>
              <td className="fw-bold">{leads.length}</td>
            </tr>
          </tfoot>
        </table>
      </div>
    );
  };

  const renderInvoicesTable = () => {
    const invoices = customerData?.invoices || [];

    if (invoices.length === 0) {
      return (
        <div className="text-center py-5">
          <CreditCard
            className="mx-auto mb-3 text-muted"
            style={{ width: "48px", height: "48px" }}
          />
          <h5>No Invoices Found</h5>
          <p className="text-muted">No invoices available for this customer</p>
        </div>
      );
    }

    // Calculate totals
    const totalQty = invoices.reduce(
      (sum, inv) => sum + (parseFloat(inv.master_qty) || 0),
      0,
    );
    const totalSubtotal = invoices.reduce(
      (sum, inv) => sum + (parseFloat(inv.master_total_bill_amt) || 0),
      0,
    );
    const totalGST = invoices.reduce(
      (sum, inv) => sum + (parseFloat(inv.gstTotal) || 0),
      0,
    );
    const totalOtherCharges = invoices.reduce(
      (sum, inv) => sum + (parseFloat(inv.other_charge_amount) || 0),
      0,
    );
    const totalTransportCharges = invoices.reduce(
      (sum, inv) => sum + (parseFloat(inv.transport_types_total_charge) || 0),
      0,
    );
    const totalAmount = invoices.reduce((sum, inv) => {
      const amount =
        parseFloat(
          (
            parseFloat(inv.gstTotal || 0) +
            parseFloat(inv.master_total_bill_amt || 0)
          )?.toFixed(2) || 0,
        ) +
        parseFloat(inv.other_charge_amount || 0) +
        parseFloat(inv.transport_types_total_charge || 0);
      return sum + (isNaN(amount) ? 0 : amount);
    }, 0);

    return (
      <div className="table-responsive">
        <table className="table align-middle table-nowrap table-hover">
          <thead className="table-light text-muted text-uppercase">
            <tr>
              <th>Sr.No</th>
              <th>INV No.</th>
              <th>Order Type</th>
              <th>Bank / Business Info</th>
              <th>Bill Date</th>
              <th>Payment Mode</th>
              <th className="text-end">Qty</th>
              <th className="text-end">Subtotal</th>
              <th className="text-end">GST</th>
              <th className="text-end">Other Charges</th>
              <th className="text-end">Transport</th>
              <th className="text-end">Total Amount</th>
            </tr>
          </thead>
          <tbody>
            {invoices.map((item, index) => {
              const qty = parseFloat(item.master_qty) || 0;
              const subtotal = parseFloat(item.master_total_bill_amt) || 0;
              const gst = parseFloat(item.gstTotal) || 0;
              const otherCharges = parseFloat(item.other_charge_amount) || 0;
              const transportCharges =
                parseFloat(item.transport_types_total_charge) || 0;
              const total = subtotal + gst + otherCharges + transportCharges;

              return (
                <tr key={item.master_id || index}>
                  <td>{index + 1}</td>
                  <td>{item.master_invoice_no}</td>
                  <td>{item.created_user_name || "Customer"}</td>
                  <td style={{ maxWidth: "120px" }}>
                    <div
                      style={{
                        whiteSpace: "normal",
                        wordBreak: "break-word",
                      }}
                    >
                      {item.user_type == 1 ? item.user_name : item.master_name}
                      {item.user_type == 3
                        ? ` - ${item.master_branch_name}`
                        : " "}
                      {item.user_type == 3
                        ? ` - ${item.master_branch_code}`
                        : " "}
                    </div>
                  </td>
                  <td>{item.master_bill_date}</td>
                  <td>
                    {item.payment_id == "2" ? (
                      <div className="d-flex align-items-center justify-content-center gap-2 btn btn-sm btn-outline-info">
                        {item.payment_type}
                        <i className="ri-file-info-line fs-16 align-bottom me-1"></i>
                      </div>
                    ) : (
                      item.payment_type
                    )}
                  </td>
                  <td className="text-end">{qty.toFixed(2)}</td>
                  <td className="text-end">{formatCurrency(subtotal)}</td>
                  <td className="text-end">{formatCurrency(gst)}</td>
                  <td className="text-end">{formatCurrency(otherCharges)}</td>
                  <td className="text-end">
                    {formatCurrency(transportCharges)}
                  </td>
                  <td className="text-end fw-bold">{formatCurrency(total)}</td>
                </tr>
              );
            })}
          </tbody>
          <tfoot className="table-light">
            <tr>
              <td></td>
              <td colSpan="5" className="text-end fw-bold">
                Total
              </td>
              <td className="text-end fw-bold">{totalQty.toFixed(2)}</td>
              <td className="text-end fw-bold">
                {formatCurrency(totalSubtotal)}
              </td>
              <td className="text-end fw-bold">{formatCurrency(totalGST)}</td>
              <td className="text-end fw-bold">
                {formatCurrency(totalOtherCharges)}
              </td>
              <td className="text-end fw-bold">
                {formatCurrency(totalTransportCharges)}
              </td>
              <td className="text-end fw-bold">
                {formatCurrency(totalAmount)}
              </td>
            </tr>
          </tfoot>
        </table>
      </div>
    );
  };

  const renderQuotationsTable = () => {
    const quotations = customerData?.quotations || [];

    if (quotations.length === 0) {
      return (
        <div className="text-center py-5">
          <FileText
            className="mx-auto mb-3 text-muted"
            style={{ width: "48px", height: "48px" }}
          />
          <h5>No Quotations Found</h5>
          <p className="text-muted">
            No quotations available for this customer
          </p>
        </div>
      );
    }

    // Calculate totals
    const totalQty = quotations.reduce(
      (sum, q) => sum + (parseFloat(q.purchase_total_qty) || 0),
      0,
    );
    const totalSubtotal = quotations.reduce(
      (sum, q) => sum + (parseFloat(q.purchase_total_purchase) || 0),
      0,
    );
    const totalGST = quotations.reduce(
      (sum, q) => sum + (parseFloat(q.gstTotal) || 0),
      0,
    );
    const totalOtherCharges = quotations.reduce(
      (sum, q) => sum + (parseFloat(q.other_charge_amount) || 0),
      0,
    );
    const totalTransportCharges = quotations.reduce(
      (sum, q) => sum + (parseFloat(q.transport_types_total_charge) || 0),
      0,
    );
    const totalAmount = quotations.reduce((sum, q) => {
      const amount =
        parseFloat(
          (
            parseFloat(q.gstTotal || 0) +
            parseFloat(q.purchase_total_purchase || 0)
          )?.toFixed(2) || 0,
        ) +
        parseFloat(q.other_charge_amount || 0) +
        parseFloat(q.transport_types_total_charge || 0);
      return sum + (isNaN(amount) ? 0 : amount);
    }, 0);

    return (
      <div className="table-responsive">
        <table className="table table-nowrap align-middle mb-0">
          <thead className="table-light text-muted text-uppercase">
            <tr>
              <th>#</th>
              <th>Quotation No.</th>
              <th>Date</th>
              <th>Customer</th>
              <th className="text-end">Qty</th>
              <th className="text-end">Subtotal</th>
              <th className="text-end">GST</th>
              <th className="text-end">Other Charges</th>
              <th className="text-end">Transport</th>
              <th className="text-end">Total Amount</th>
            </tr>
          </thead>
          <tbody>
            {quotations.map((quotation, index) => {
              const qty = parseFloat(quotation.purchase_total_qty) || 0;
              const subtotal =
                parseFloat(quotation.purchase_total_purchase) || 0;
              const gst = parseFloat(quotation.gstTotal) || 0;
              const otherCharges =
                parseFloat(quotation.other_charge_amount) || 0;
              const transportCharges =
                parseFloat(quotation.transport_types_total_charge) || 0;
              const total = subtotal + gst + otherCharges + transportCharges;

              return (
                <tr key={quotation.purchase_prchase_id || index}>
                  <td>{index + 1}</td>
                  <td className="fw-medium">
                    {quotation.purchase_invoice_no || "N/A"}
                  </td>
                  <td>{quotation.purchase_start_date || "N/A"}</td>
                  <td>{quotation.master_name || "N/A"}</td>
                  <td className="text-end">{qty.toFixed(2)}</td>
                  <td className="text-end">{formatCurrency(subtotal)}</td>
                  <td className="text-end">{formatCurrency(gst)}</td>
                  <td className="text-end">{formatCurrency(otherCharges)}</td>
                  <td className="text-end">
                    {formatCurrency(transportCharges)}
                  </td>
                  <td className="text-end fw-bold">{formatCurrency(total)}</td>
                </tr>
              );
            })}
          </tbody>
          <tfoot className="table-light">
            <tr>
              <td colSpan="4" className="text-end fw-bold">
                Total
              </td>
              <td className="text-end fw-bold">{totalQty.toFixed(2)}</td>
              <td className="text-end fw-bold">
                {formatCurrency(totalSubtotal)}
              </td>
              <td className="text-end fw-bold">{formatCurrency(totalGST)}</td>
              <td className="text-end fw-bold">
                {formatCurrency(totalOtherCharges)}
              </td>
              <td className="text-end fw-bold">
                {formatCurrency(totalTransportCharges)}
              </td>
              <td className="text-end fw-bold">
                {formatCurrency(totalAmount)}
              </td>
            </tr>
          </tfoot>
        </table>
      </div>
    );
  };

  const renderPurchasesTable = () => {
    const purchases = customerData?.purchase || [];

    if (purchases.length === 0) {
      return (
        <div className="text-center py-5">
          <ShoppingBag
            className="mx-auto mb-3 text-muted"
            style={{ width: "48px", height: "48px" }}
          />
          <h5>No Purchases Found</h5>
          <p className="text-muted">No purchases available for this customer</p>
        </div>
      );
    }

    // Calculate totals
    const totalQty = purchases.reduce(
      (sum, p) => sum + (parseFloat(p.purchase_total_qty) || 0),
      0,
    );
    const totalSubtotal = purchases.reduce(
      (sum, p) => sum + (parseFloat(p.purchase_total_purchase) || 0),
      0,
    );
    const totalGST = purchases.reduce(
      (sum, p) => sum + (parseFloat(p.gstTotal) || 0),
      0,
    );
    const totalOtherCharges = purchases.reduce(
      (sum, p) => sum + (parseFloat(p.other_charge_amount) || 0),
      0,
    );
    const totalTransportCharges = purchases.reduce(
      (sum, p) => sum + (parseFloat(p.transport_types_total_charge) || 0),
      0,
    );
    const totalAmount = purchases.reduce((sum, p) => {
      const amount =
        parseFloat(
          (
            parseFloat(p.gstTotal || 0) +
            parseFloat(p.purchase_total_purchase || 0)
          )?.toFixed(2) || 0,
        ) +
        parseFloat(p.other_charge_amount || 0) +
        parseFloat(p.transport_types_total_charge || 0);
      return sum + (isNaN(amount) ? 0 : amount);
    }, 0);

    return (
      <div className="table-responsive">
        <table className="table table-nowrap align-middle mb-0">
          <thead className="table-light text-muted text-uppercase">
            <tr>
              <th>#</th>
              <th>Purchase No.</th>
              <th>Date</th>
              <th>Customer</th>
              <th className="text-end">Qty</th>
              <th className="text-end">Subtotal</th>
              <th className="text-end">GST</th>
              <th className="text-end">Other Charges</th>
              <th className="text-end">Transport</th>
              <th className="text-end">Total Amount</th>
            </tr>
          </thead>
          <tbody>
            {purchases.map((purchase, index) => {
              const qty = parseFloat(purchase.purchase_total_qty) || 0;
              const subtotal =
                parseFloat(purchase.purchase_total_purchase) || 0;
              const gst = parseFloat(purchase.gstTotal) || 0;
              const otherCharges =
                parseFloat(purchase.other_charge_amount) || 0;
              const transportCharges =
                parseFloat(purchase.transport_types_total_charge) || 0;
              const total = subtotal + gst + otherCharges + transportCharges;

              return (
                <tr key={purchase.purchase_prchase_id || index}>
                  <td>{index + 1}</td>
                  <td className="fw-medium">
                    {purchase.purchase_invoice_no || "N/A"}
                  </td>
                  <td>{purchase.purchase_start_date || "N/A"}</td>
                  <td>{purchase.master_name || "N/A"}</td>
                  <td className="text-end">{qty.toFixed(2)}</td>
                  <td className="text-end">{formatCurrency(subtotal)}</td>
                  <td className="text-end">{formatCurrency(gst)}</td>
                  <td className="text-end">{formatCurrency(otherCharges)}</td>
                  <td className="text-end">
                    {formatCurrency(transportCharges)}
                  </td>
                  <td className="text-end fw-bold">{formatCurrency(total)}</td>
                </tr>
              );
            })}
          </tbody>
          <tfoot className="table-light">
            <tr>
              <td colSpan="4" className="text-end fw-bold">
                Total
              </td>
              <td className="text-end fw-bold">{totalQty.toFixed(2)}</td>
              <td className="text-end fw-bold">
                {formatCurrency(totalSubtotal)}
              </td>
              <td className="text-end fw-bold">{formatCurrency(totalGST)}</td>
              <td className="text-end fw-bold">
                {formatCurrency(totalOtherCharges)}
              </td>
              <td className="text-end fw-bold">
                {formatCurrency(totalTransportCharges)}
              </td>
              <td className="text-end fw-bold">
                {formatCurrency(totalAmount)}
              </td>
            </tr>
          </tfoot>
        </table>
      </div>
    );
  };

  // ============================================
  // RENDER TAB CONTENT
  // ============================================
  const renderTabContent = () => {
    switch (activeTab) {
      case "leads":
        return renderLeadsTable();
      case "invoices":
        return renderInvoicesTable();
      case "quotations":
        return renderQuotationsTable();
      case "purchases":
        return renderPurchasesTable();
      default:
        return null;
    }
  };

  // ============================================
  // RENDER FILTERS
  // ============================================
  const renderFilters = () => (
    <div className="row g-3 mb-4">
      {/* Customer Selector */}
      <div className="col-md-4">
        <label className="form-label fw-medium">Select Customer</label>
        <Select
          options={customerOptions}
          value={selectedCustomer}
          onChange={handleCustomerSelect}
          placeholder="Search and select customer..."
          isClearable
          isSearchable
          formatOptionLabel={(option) => (
            <div>
              <div className="fw-medium">{option.label}</div>
              <small className="text-muted">
                {option.email} | {option.mobile}
              </small>
            </div>
          )}
          styles={{
            control: (provided) => ({
              ...provided,
              minHeight: "42px",
            }),
          }}
        />
      </div>

      {/* Date Range */}
      <div className="col-md-4">
        <label className="form-label fw-medium">Date Range</label>
        <div className="d-flex gap-2">
          <DatePicker
            className="form-control"
            placeholderText="Start Date"
            selected={filters.startDate}
            onChange={handleStartDateChange}
            dateFormat="dd/MM/yyyy"
            maxDate={filters.endDate || new Date()}
            isClearable
          />
          <DatePicker
            className="form-control"
            placeholderText="End Date"
            selected={filters.endDate}
            onChange={handleEndDateChange}
            dateFormat="dd/MM/yyyy"
            minDate={filters.startDate}
            maxDate={new Date()}
            isClearable
          />
        </div>
      </div>

      {/* Action Buttons */}
      <div className="col-md-4 d-flex align-items-end gap-2">
        <button
          className="btn btn-primary"
          onClick={handleSearch}
          disabled={!filters.customerId}
        >
          <Search style={{ width: "16px", height: "16px" }} className="me-1" />
          Search
        </button>
        <button className="btn btn-outline-secondary" onClick={resetFilters}>
          <RefreshCw
            style={{ width: "16px", height: "16px" }}
            className="me-1"
          />
          Reset
        </button>
        {customerData && (
          <button
            className="btn btn-outline-success"
            onClick={() => console.log("Export")}
          >
            <Download style={{ width: "16px", height: "16px" }} />
          </button>
        )}
      </div>
    </div>
  );

  // ============================================
  // RENDER CUSTOMER DETAILS
  // ============================================
  // ============================================
  // RENDER CUSTOMER DETAILS
  // ============================================
  const renderCustomerDetails = () => {
    if (!customerData || !selectedCustomer) return null;

    // Get first purchase record for customer info
    const firstPurchase = customerData.purchase?.[0] || {};
    const firstInvoice = customerData.invoices?.[0] || {};

    // Calculate totals for statistics
    const totalLeadsValue = 0; // Leads don't have amount, just count
    const totalPurchasesValue =
      customerData.purchase?.reduce((sum, p) => {
        const purchase = Number(p.purchase_total_purchase) || 0;
        const gst = Number(p.gstTotal) || 0;
        const other = Number(p.other_charge_amount) || 0;
        const transport = Number(p.transport_types_total_charge) || 0;

        return sum + purchase + gst + other + transport;
      }, 0) || 0;

    const totalQuotationsValue =
      customerData.quotations?.reduce((sum, q) => {
        const purchase = Number(q.purchase_total_purchase) || 0;
        const gst = Number(q.gstTotal) || 0;
        const other = Number(q.other_charge_amount) || 0;
        const transport = Number(q.transport_types_total_charge) || 0;

        return sum + purchase + gst + other + transport;
      }, 0) || 0;
    const totalInvoicesValue =
      customerData.invoices?.reduce((sum, inv) => {
        const amount =
          parseFloat(
            (
              parseFloat(inv.gstTotal || 0) +
              parseFloat(inv.master_total_bill_amt || 0)
            )?.toFixed(2) || 0,
          ) +
          parseFloat(inv.other_charge_amount || 0) +
          parseFloat(inv.transport_types_total_charge || 0);
        return sum + (isNaN(amount) ? 0 : amount);
      }, 0) || 0;

    return (
      <>
        {/* Customer Profile */}
        <div className="card mb-4">
          <div className="card-body">
            <div className="row align-items-center">
              <div className="col-md-8">
                <div className="d-flex align-items-center gap-3">
                  <div className="avatar-lg rounded-circle bg-primary bg-opacity-10 d-flex align-items-center justify-content-center">
                    <span className="font-size-24 text-primary fw-bold">
                      {selectedCustomer.label?.charAt(0).toUpperCase() || "N/A"}
                    </span>
                  </div>
                  <div>
                    <h5 className="mb-1">{selectedCustomer.label}</h5>
                    <div className="d-flex flex-wrap align-items-center gap-2">
                      <span className="badge bg-success">Active</span>
                      <span className="text-muted">|</span>
                      <span className="d-flex align-items-center gap-1">
                        <Mail style={{ width: "14px", height: "14px" }} />
                        {selectedCustomer.email ||
                          firstPurchase.master_email ||
                          "N/A"}
                      </span>
                      <span className="d-flex align-items-center gap-1">
                        <Phone style={{ width: "14px", height: "14px" }} />
                        {selectedCustomer.mobile ||
                          firstPurchase.master_mobile ||
                          "N/A"}
                      </span>
                      <span className="d-flex align-items-center gap-1">
                        <MapPin style={{ width: "14px", height: "14px" }} />
                        {firstPurchase.master_address ||
                          firstInvoice.master_address ||
                          "N/A"}
                      </span>
                    </div>
                    <div className="mt-2">
                      <small className="text-muted">
                        GST:{" "}
                        {firstPurchase.master_gst ||
                          firstInvoice.master_gst ||
                          "N/A"}{" "}
                        | Type:{" "}
                        {firstPurchase.master_type == 1
                          ? "Customer"
                          : firstPurchase.master_type == 2
                            ? "Business"
                            : "Bank"}
                      </small>
                    </div>
                  </div>
                </div>
              </div>
              {/* <div className="col-md-4">
              <div className="d-flex gap-2 justify-content-end">
                <button className="btn btn-sm btn-outline-primary">
                  <Eye style={{ width: '16px', height: '16px' }} className="me-1" />
                  View Profile
                </button>
              </div>
            </div> */}
            </div>
          </div>
        </div>

        {/* Statistics Cards */}
        <div className="row g-3 mb-4">
          <div className="col-md-3">
            <StatCard
              icon={TrendingUp}
              title="Total Leads"
              value={totalLeadsValue}
              count={customerData.leadCount || 0}
              variant="warning"
              onClick={() => handleTabChange("leads")}
            />
          </div>
          <div className="col-md-3">
            <StatCard
              icon={ShoppingBag}
              title="Total Purchases"
              value={totalPurchasesValue}
              count={customerData.purchaseCount || 0}
              variant="primary"
              onClick={() => handleTabChange("purchases")}
            />
          </div>
          <div className="col-md-3">
            <StatCard
              icon={FileText}
              title="Total Quotations"
              value={totalQuotationsValue}
              count={customerData.quotationCount || 0}
              variant="info"
              onClick={() => handleTabChange("quotations")}
            />
          </div>
          <div className="col-md-3">
            <StatCard
              icon={CreditCard}
              title="Total Invoices"
              value={totalInvoicesValue}
              count={customerData.invoiceCount || 0}
              variant="success"
              onClick={() => handleTabChange("invoices")}
            />
          </div>
        </div>
      </>
    );
  };

  // ============================================
  // MAIN RENDER
  // ============================================
  return (
    <div className="page-content">
      <div className="container-fluid">
        {/* Page Title */}
        <div className="row">
          <div className="col-12">
            <div className="page-title-box d-sm-flex align-items-center justify-content-between">
              <h4 className="mb-sm-0">Customer History</h4>
              <div className="page-title-right">
                <ol className="breadcrumb m-0">
                  <li className="breadcrumb-item">
                    <a href="#">Customers</a>
                  </li>
                  <li className="breadcrumb-item active">Customer History</li>
                </ol>
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        {renderFilters()}

        {/* Loading State */}
        {loading && (
          <div className="text-center py-5">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
            <p className="mt-2 text-muted">Loading customer data...</p>
          </div>
        )}

        {/* Customer Details */}
        {!loading &&
          customerData &&
          selectedCustomer &&
          renderCustomerDetails()}

        {/* Tabs Section */}
        {!loading && customerData && selectedCustomer && (
          <div className="row">
            <div className="col-12">
              <div className="card">
                <div className="card-header">
                  <ul className="nav nav-tabs card-header-tabs" role="tablist">
                    <li className="nav-item">
                      <button
                        className={`nav-link ${activeTab === "leads" ? "active" : ""}`}
                        onClick={() => handleTabChange("leads")}
                      >
                        <TrendingUp
                          className="me-1"
                          style={{ width: "16px", height: "16px" }}
                        />
                        Leads ({customerData.leadCount || 0})
                      </button>
                    </li>
                    <li className="nav-item">
                      <button
                        className={`nav-link ${activeTab === "purchases" ? "active" : ""}`}
                        onClick={() => handleTabChange("purchases")}
                      >
                        <ShoppingBag
                          className="me-1"
                          style={{ width: "16px", height: "16px" }}
                        />
                        Purchases ({customerData.purchaseCount || 0})
                      </button>
                    </li>
                    <li className="nav-item">
                      <button
                        className={`nav-link ${activeTab === "quotations" ? "active" : ""}`}
                        onClick={() => handleTabChange("quotations")}
                      >
                        <FileText
                          className="me-1"
                          style={{ width: "16px", height: "16px" }}
                        />
                        Quotations ({customerData.quotationCount || 0})
                      </button>
                    </li>
                    <li className="nav-item">
                      <button
                        className={`nav-link ${activeTab === "invoices" ? "active" : ""}`}
                        onClick={() => handleTabChange("invoices")}
                      >
                        <CreditCard
                          className="me-1"
                          style={{ width: "16px", height: "16px" }}
                        />
                        Invoices ({customerData.invoiceCount || 0})
                      </button>
                    </li>
                  </ul>
                </div>
                <div className="card-body">{renderTabContent()}</div>
              </div>
            </div>
          </div>
        )}

        {/* No Customer Selected */}
        {!loading && !customerData && !selectedCustomer && (
          <div className="text-center py-5">
            <User
              className="mx-auto mb-3 text-muted"
              style={{ width: "64px", height: "64px" }}
            />
            <h4>Select a Customer</h4>
            <p className="text-muted">
              Search and select a customer to view their history
            </p>
          </div>
        )}

        {/* No Results */}
        {!loading && selectedCustomer && !customerData && (
          <div className="text-center py-5">
            <Search
              className="mx-auto mb-3 text-muted"
              style={{ width: "64px", height: "64px" }}
            />
            <h4>No Data Found</h4>
            <p className="text-muted">No records found for this customer</p>
            <button className="btn btn-primary" onClick={resetFilters}>
              Clear Filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default CustomerHistory;
