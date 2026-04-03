import React, { useState, useEffect, useRef } from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';
import Select from 'react-select';
import {
  Card,
  CardHeader,
  CardBody,
  Row,
  Col,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  FormGroup,
  Label,
  Input,
} from 'reactstrap';
import Flatpickr from 'react-flatpickr';
import AsyncSelect from 'react-select/async';
import AuthUser from '../../helpers/Authuser';
import OrderDetailsModal from '../orders/OrderDetailsModal';
import { toast } from 'react-toastify';

const POSList = () => {
  // State declarations
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const { http, user } = AuthUser();
  const [posBills, setPosBills] = useState([]);
  const [noMore, setNoMore] = useState(false);
  const [modal_standard, setmodal_standard] = useState(false);
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [statusModalOpen, setStatusModalOpen] = useState(false);
  const [selectedStatusOrder, setSelectedStatusOrder] = useState(null);
  const [newStatus, setNewStatus] = useState('');
  const [OrderDescription, setOrderDescription] = useState('');
  const [trackingDescription, setTrackingDescription] = useState('');
  const [statusUpdating, setStatusUpdating] = useState(false);
  const [businessData, setBusinessData] = useState({});
  const [trackingModalOpen, setTrackingModalOpen] = useState(false);
  const [printContent, setPrintContent] = useState('');

  // Status options
  const statusOptions = [
    { value: '1', label: 'New Order' },
    { value: '2', label: 'Approval' },
    { value: '3', label: 'Packing' },
    { value: '4', label: 'Dispatch' },
    { value: '5', label: 'Rejected' },
    { value: '6', label: 'Delivered' },
  ];

  // Helper functions
  const pad = (n) => String(n).padStart(2, '0');

  const formatToDDMMYYYY = (dateObj) => {
    const dd = pad(dateObj.getDate());
    const mm = pad(dateObj.getMonth() + 1);
    const yyyy = dateObj.getFullYear();
    return `${dd}/${mm}/${yyyy}`;
  };

  // API functions
  const getAllPosList = async (start = null, end = null) => {
    try {
      const payload = {};
      if (start && end) {
        payload.startDate = start;
        payload.endDate = end;
      }
      const res = await http.post('/pos/list', payload);
      setPosBills(res.data);
      setNoMore(false);
    } catch (error) {
      console.error('Failed to fetch POS bills:', error);
    }
  };

  const getOrderDescription = async (master_id) => {
    try {
      await http.post("/order/status", { master_id })
        .then((res) => {
          setOrderDescription(res.data[0]?.order_description || '');
        })
        .catch((e) => {
          console.log(e);
        });
    } catch (error) {
      console.log(error);
    }
  };

  const getBusinessDetails = async () => {
    try {
      await http.get("/business_index")
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

  // Print Functions
  const prepareInvoiceContent = (order) => {
    const currentDate = new Date().toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });

    const formattedOrderDate = new Date(order.master_bill_date).toLocaleDateString('en-US', {
      day: 'numeric',
      year: 'numeric',
      month: 'long'
    });

    const paymentMethod = order.master_payment_mode_id === "1" ? "Cash" : "Online";

    const statusText =
      order.master_bill_status === 1 ? "New Order" :
        order.master_bill_status === 2 ? "Approved" :
          order.master_bill_status === 3 ? "Packing" :
            order.master_bill_status === 4 ? "Dispatch" :
              order.master_bill_status === 5 ? "Rejected" :
                order.master_bill_status === 6 ? "Delivered" : "Unknown";

    const statusClass =
      order.master_bill_status === 1 ? "status-new" :
        order.master_bill_status === 2 ? "status-approved" :
          order.master_bill_status === 3 ? "status-packing" :
            order.master_bill_status === 4 ? "status-dispatch" :
              order.master_bill_status === 5 ? "status-rejected" :
                order.master_bill_status === 6 ? "status-delivered" : "";

    const subtotal = parseFloat(order.master_total_bill_amt);
    const taxRate = 0;
    const taxAmount = 0;
    const grandTotal = parseFloat(order.master_total_bill_amt);

    const itemsRows = order.items && order.items.length > 0 ?
      order.items.map((item, index) => `
        <tr>
          <td>${index + 1}</td>
          <td>
            <div class="product-name">${item.product_name || 'Product'}</div>
            <div class="product-sku">SKU: ${item.product_sku || 'N/A'}</div>
          </td>
          <td>${item.product_description ? item.product_description.replace(/<[^>]*>/g, '') : ''}</td>
          <td class="text-right">₹${parseFloat(item.price || 0).toFixed(2)}</td>
          <td class="text-center">${item.quantity || 1}</td>
          <td class="text-right">₹${(parseFloat(item.price || 0) * parseFloat(item.quantity || 1)).toFixed(2)}</td>
        </tr>
      `).join('') :
      `<tr><td colspan="6" class="text-center">No items found</td></tr>`;

    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8" />
        <title>Invoice #${order.master_invoice_no}</title>
        <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600&display=swap" rel="stylesheet">
        <style>
          body {
            font-family: 'Poppins', sans-serif;
            font-size: 14px;
            color: #333;
            margin: 0;
            padding: 20px;
          }
          .invoice-container {
            max-width: 800px;
            margin: 0 auto;
            padding: 30px;
            border: 1px solid #e0e0e0;
            box-shadow: 0 0 20px rgba(0,0,0,0.1);
            background: white;
          }
          .invoice-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 30px;
            padding-bottom: 20px;
            border-bottom: 2px solid #f0f0f0;
          }
          .invoice-logo {
            width: 120px;
          }
          .logo-img {
            max-width: 100%;
            max-height: 80px;
          }
          .logo-placeholder {
            width: 80px;
            height: 80px;
            background: #4a6cf7;
            color: white;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 36px;
            font-weight: bold;
            border-radius: 8px;
          }
          .invoice-title {
            text-align: right;
          }
          .invoice-title h1 {
            font-size: 28px;
            margin: 0;
            color: #4a6cf7;
          }
          .invoice-number {
            font-size: 16px;
            color: #666;
            margin-top: 5px;
          }
          .invoice-meta {
            display: flex;
            justify-content: space-between;
            margin-bottom: 30px;
          }
          .business-info h3 {
            margin: 0 0 10px 0;
            font-size: 18px;
            color: #333;
          }
          .business-info p {
            margin: 5px 0;
            font-size: 14px;
            color: #666;
          }
          .invoice-details {
            text-align: right;
          }
          .detail-row {
            margin-bottom: 8px;
          }
          .detail-label {
            font-weight: 500;
            color: #555;
          }
          .detail-value {
            margin-left: 10px;
            color: #333;
          }
          .customer-info {
            margin-bottom: 30px;
            padding: 20px;
            background: #f9f9f9;
            border-radius: 8px;
          }
          .customer-info h3 {
            margin: 0 0 15px 0;
            font-size: 18px;
            color: #4a6cf7;
          }
          .customer-details p {
            margin: 5px 0;
            font-size: 14px;
          }
          .invoice-items {
            margin-bottom: 30px;
          }
          .invoice-items table {
            width: 100%;
            border-collapse: collapse;
          }
          .invoice-items th {
            background: #4a6cf7;
            color: white;
            padding: 12px 10px;
            text-align: left;
            font-weight: 500;
          }
          .invoice-items td {
            padding: 12px 10px;
            border-bottom: 1px solid #f0f0f0;
          }
          .invoice-items tr:last-child td {
            border-bottom: none;
          }
          .product-name {
            font-weight: 500;
          }
          .product-sku {
            font-size: 12px;
            color: #666;
          }
          .invoice-summary {
            width: 300px;
            margin-left: auto;
            margin-bottom: 30px;
          }
          .summary-row {
            display: flex;
            justify-content: space-between;
            padding: 10px 0;
            border-bottom: 1px solid #f0f0f0;
          }
          .summary-label {
            font-weight: 500;
          }
          .grand-total {
            font-weight: bold;
            font-size: 16px;
            border-bottom: none;
            margin-top: 10px;
          }
          .invoice-footer {
            display: flex;
            justify-content: space-between;
            margin-top: 40px;
            padding-top: 20px;
            border-top: 2px solid #f0f0f0;
          }
          .terms {
            width: 60%;
          }
          .terms h4 {
            margin: 0 0 10px 0;
            font-size: 16px;
            color: #4a6cf7;
          }
          .terms p {
            margin: 5px 0;
            font-size: 12px;
            color: #666;
          }
          .signature {
            text-align: center;
          }
          .signature-line {
            width: 200px;
            height: 1px;
            background: #333;
            margin: 0 auto 10px auto;
          }
          .signature p {
            margin: 0;
            font-size: 14px;
          }
          .thank-you {
            text-align: center;
            margin-top: 30px;
            font-style: italic;
            color: #4a6cf7;
          }
          .status-badge {
            display: inline-block;
            padding: 4px 10px;
            border-radius: 20px;
            font-size: 12px;
            font-weight: 500;
          }
          .status-new { background: #fff3cd; color: #856404; }
          .status-approved { background: #d4edda; color: #155724; }
          .status-packing { background: #cce5ff; color: #004085; }
          .status-dispatch { background: #e2e3e5; color: #383d41; }
          .status-rejected { background: #f8d7da; color: #721c24; }
          .status-delivered { background: #d1ecf1; color: #0c5460; }
          @page {
            size: A4;
            margin: 10mm;
          }
          @media print {
            body {
              padding: 0;
              background: white;
            }
            .invoice-container {
              box-shadow: none;
              border: none;
              padding: 0;
            }
          }
        </style>
      </head>
      <body>
        <div class="invoice-container">
          <div class="invoice-header">
            <div class="invoice-logo">
              ${businessData.business_logo ?
        `<img src="${businessData.business_logo}" alt="${businessData.business_name}" class="logo-img">` :
        `<div class="logo-placeholder">${businessData.business_name?.charAt(0) || 'B'}</div>`
      }
            </div>
            <div class="invoice-title">
              <h1>INVOICE</h1>
              <div class="invoice-number">#${order.master_invoice_no}</div>
            </div>
          </div>
          
          <div class="invoice-meta">
            <div class="meta-left">
              <div class="business-info">
                <h3>${businessData?.business_name || 'Your Business'}</h3>
                <p>${businessData?.business_address || 'Business Address'}</p>
                <p>Phone: ${businessData?.business_phone || 'N/A'}</p>
                <p>Email: ${businessData?.business_email || 'N/A'}</p>
                <p>GSTIN: ${businessData?.business_gst_no || 'N/A'}</p>
              </div>
            </div>
            <div class="meta-right">
              <div class="invoice-details">
                <div class="detail-row">
                  <span class="detail-label">Invoice Date:</span>
                  <span class="detail-value">${currentDate}</span>
                </div>
                <div class="detail-row">
                  <span class="detail-label">Order Date:</span>
                  <span class="detail-value">${order.master_bill_date}</span>
                </div>
                <div class="detail-row">
                  <span class="detail-label">Payment Method:</span>
                  <span class="detail-value">${paymentMethod}</span>
                </div>
                <div class="detail-row">
                  <span class="detail-label">Status:</span>
                  <span class="detail-value status-badge ${statusClass}">${statusText}</span>
                </div>
              </div>
            </div>
          </div>
          
          <div class="customer-info">
            <h3>Bill To:</h3>
            <div class="customer-details">
              <p><strong>${order.user_name || 'Customer Name'}</strong></p>
              <p>${order.user_address || 'Customer Address'}</p>
              <p>Phone: ${order.user_phone || 'N/A'}</p>
            </div>
          </div>
          
          <div class="invoice-items">
            <table>
              <thead>
                <tr>
                  <th width="5%">#</th>
                  <th width="30%">Item</th>
                  <th width="35%">Description</th>
                  <th width="10%" class="text-right">Price</th>
                  <th width="10%" class="text-center">Qty</th>
                  <th width="10%" class="text-right">Amount</th>
                </tr>
              </thead>
              <tbody>
                ${itemsRows}
              </tbody>
            </table>
          </div>
          
          <div class="invoice-summary">
            <div class="summary-row">
              <span class="summary-label">Subtotal:</span>
              <span class="summary-value">₹${subtotal.toFixed(2)}</span>
            </div>
            <div class="summary-row">
              <span class="summary-label">Tax (${taxRate}%):</span>
              <span class="summary-value">₹${taxAmount.toFixed(2)}</span>
            </div>
            <div class="summary-row grand-total">
              <span class="summary-label">Grand Total:</span>
              <span class="summary-value">₹${grandTotal.toFixed(2)}</span>
            </div>
          </div>
          
          <div class="invoice-footer">
            <div class="terms">
              <h4>Terms & Conditions</h4>
              <p>Goods once sold will not be taken back or exchanged.</p>
              <p>Please make all checks payable to ${businessData.business_name || 'Your Business'}.</p>
            </div>
            <div class="signature">
              <div class="signature-line"></div>
              <p>Authorized Signature</p>
            </div>
          </div>
          
          <div class="thank-you">
            <p>Thank you for your business!</p>
          </div>
        </div>
      </body>
      </html>
    `;
  };

  const prepareReportContent = () => {
    const currentDate = new Date().toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });

    const formattedStartDate = formatToDDMMYYYY(startDate);
    const formattedEndDate = formatToDDMMYYYY(endDate);
    const dateRange = formattedStartDate === formattedEndDate
      ? formattedStartDate
      : `${formattedStartDate} to ${formattedEndDate}`;

    const ordersRows = posBills.map((order, index) => {
      const formattedOrderDate = order.master_bill_date;
      // new Date().toLocaleDateString('en-US', {
      //   day: 'numeric',
      //   month: 'short',
      //   year: 'numeric'
      // });

      const statusText =
        order.master_bill_status === 1 ? "New Order" :
          order.master_bill_status === 2 ? "Approved" :
            order.master_bill_status === 3 ? "Packing" :
              order.master_bill_status === 4 ? "Dispatch" :
                order.master_bill_status === 5 ? "Rejected" :
                  order.master_bill_status === 6 ? "Delivered" : "Unknown";

      return `
        <tr>
          <td>${index + 1}</td>
          <td>${order.master_invoice_no}</td>
          <td>${order.user_name || 'Customer'}</td>
          <td>${formattedOrderDate}</td>
          <td>${order.master_qty}</td>
          <td class="text-right">₹${parseFloat(order.master_total_bill_amt || 0).toFixed(2)}</td>
          <td>${order.master_payment_mode_id === "1" ? "Cash" : "Online"}</td>
          <td><span class="status-badge status-${statusText.toLowerCase().replace(' ', '-')}">${statusText}</span></td>
        </tr>
      `;
    }).join('');

    const totalAmount = posBills.reduce((sum, order) => sum + parseFloat(order.master_total_bill_amt || 0), 0);
    const totalQty = posBills.reduce((sum, order) => sum + parseInt(order.master_qty || 0), 0);

    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8" />
        <title>POS Orders Report</title>
        <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600&display=swap" rel="stylesheet">
        <style>
          body {
            font-family: 'Poppins', sans-serif;
            font-size: 14px;
            color: #333;
            margin: 0;
            padding: 20px;
          }
          .report-container {
            max-width: 1000px;
            margin: 0 auto;
            padding: 30px;
            background: white;
          }
          .report-header {
            display: flex;
            align-items: center;
            margin-bottom: 30px;
            padding-bottom: 20px;
            border-bottom: 2px solid #f0f0f0;
          }
          .report-logo {
            width: 80px;
            margin-right: 20px;
          }
          .report-title {
            flex: 1;
          }
          .report-title h1 {
            margin: 0;
            color: #4a6cf7;
            font-size: 28px;
          }
          .report-subtitle {
            margin: 5px 0 0 0;
            font-size: 16px;
            color: #666;
          }
          .report-date {
            margin: 5px 0 0 0;
            font-size: 14px;
            color: #999;
          }
          .report-meta {
            display: flex;
            margin-bottom: 20px;
          }
          .meta-row {
            margin-right: 30px;
          }
          .meta-label {
            font-weight: 500;
            color: #555;
          }
          .meta-value {
            margin-left: 10px;
            color: #333;
          }
          .report-items table {
            width: 100%;
            border-collapse: collapse;
          }
          .report-items th {
            background: #4a6cf7;
            color: white;
            padding: 12px 10px;
            text-align: left;
            font-weight: 500;
          }
          .report-items td {
            padding: 10px;
            border-bottom: 1px solid #f0f0f0;
          }
          .report-summary {
            width: 300px;
            margin-left: auto;
            margin-top: 30px;
          }
          .report-footer {
            margin-top: 40px;
            padding-top: 20px;
            border-top: 2px solid #f0f0f0;
            text-align: center;
            font-size: 14px;
            color: #666;
          }
          .status-badge {
            display: inline-block;
            padding: 4px 10px;
            border-radius: 20px;
            font-size: 12px;
            font-weight: 500;
          }
          .status-new { background: #fff3cd; color: #856404; }
          .status-approved { background: #d4edda; color: #155724; }
          .status-packing { background: #cce5ff; color: #004085; }
          .status-dispatch { background: #e2e3e5; color: #383d41; }
          .status-rejected { background: #f8d7da; color: #721c24; }
          .status-delivered { background: #d1ecf1; color: #0c5460; }
          @page {
            size: A4;
            margin: 10mm;
          }
          @media print {
            body {
              padding: 0;
              background: white;
            }
            .report-container {
              padding: 0;
            }
          }
        </style>
      </head>
      <body>
        <div class="report-container">
          <div class="report-header">
            <div class="report-logo">
              ${businessData.business_logo ?
        `<img src="${businessData.business_logo}" alt="${businessData.business_name}" class="logo-img">` :
        `<div class="logo-placeholder">${businessData.business_name?.charAt(0) || 'B'}</div>`
      }
            </div>
            <div class="report-title">
              <h1>POS Orders Report</h1>
              <p class="report-subtitle">${businessData.business_name || 'Your Business'}</p>
              <p class="report-date">Generated on: ${currentDate}</p>
            </div>
          </div>
          
          <div class="report-meta">
            <div class="meta-row">
              <span class="meta-label">Date Range:</span>
              <span class="meta-value">${dateRange}</span>
            </div>
            <div class="meta-row">
              <span class="meta-label">Total Orders:</span>
              <span class="meta-value">${posBills.length}</span>
            </div>
          </div>
          
          <div class="report-items">
            <table>
              <thead>
                <tr>
                  <th width="5%">#</th>
                  <th width="15%">INV No.</th>
                  <th width="20%">Customer</th>
                  <th width="15%">Date</th>
                  <th width="10%">Qty</th>
                  <th width="15%" class="text-right">Amount</th>
                  <th width="10%">Payment</th>
                  <th width="10%">Status</th>
                </tr>
              </thead>
              <tbody>
                ${ordersRows}
              </tbody>
            </table>
          </div>
          
          <div class="report-summary">
            <div class="summary-row">
              <span class="summary-label">Total Orders:</span>
              <span class="summary-value">${posBills.length}</span>
            </div>
            <div class="summary-row">
              <span class="summary-label">Total Quantity:</span>
              <span class="summary-value">${totalQty}</span>
            </div>
            <div class="summary-row grand-total">
              <span class="summary-label">Total Amount:</span>
              <span class="summary-value">₹${totalAmount.toFixed(2)}</span>
            </div>
          </div>
          
          <div class="report-footer">
            <p>${businessData.business_name || 'Your Business'} | ${businessData.business_phone || 'Phone'} | ${businessData.business_email || 'Email'}</p>
          </div>
        </div>
      </body>
      </html>
    `;
  };

  const handlePrintInvoice = (order) => {
    if (!order) return;

    const content = prepareInvoiceContent(order);
    setPrintContent(content);

    // Create a hidden iframe for printing
    const iframe = document.createElement('iframe');
    iframe.style.position = 'fixed';
    iframe.style.right = '0';
    iframe.style.bottom = '0';
    iframe.style.width = '0';
    iframe.style.height = '0';
    iframe.style.border = '0';
    document.body.appendChild(iframe);

    const doc = iframe.contentWindow.document;
    doc.open();
    doc.write(content);
    doc.close();

    iframe.onload = () => {
      iframe.contentWindow.focus();
      iframe.contentWindow.print();
      setTimeout(() => {
        document.body.removeChild(iframe);
      }, 1000);
    };
  };

  const handlePrint = () => {
    if (posBills.length === 0) {
      toast.warning('No orders to print');
      return;
    }

    const content = prepareReportContent();
    setPrintContent(content);

    // Create a hidden iframe for printing
    const iframe = document.createElement('iframe');
    iframe.style.position = 'fixed';
    iframe.style.right = '0';
    iframe.style.bottom = '0';
    iframe.style.width = '0';
    iframe.style.height = '0';
    iframe.style.border = '0';
    document.body.appendChild(iframe);

    const doc = iframe.contentWindow.document;
    doc.open();
    doc.write(content);
    doc.close();

    iframe.onload = () => {
      iframe.contentWindow.focus();
      iframe.contentWindow.print();
      setTimeout(() => {
        document.body.removeChild(iframe);
      }, 1000);
    };
  };

  const downloadCSV = () => {
    if (posBills.length === 0) {
      toast.warning('No orders to export');
      return;
    }

    const headers = [
      'Invoice No',
      'Customer Name',
      'Order Date',
      'Quantity',
      'Amount',
      'Payment Mode',
      'Status'
    ];

    const csvContent = [
      headers.join(','),
      ...posBills.map(order => [
        `${order.master_invoice_no}`,
        `"${order.user_name || ''}"`,
        order.master_bill_date,
        order.master_qty,
        order.master_total_bill_amt,
        order.master_payment_mode_id === "1" ? "Cash" : "Online",
        order.master_bill_status === 1 ? "New Order" :
          order.master_bill_status === 2 ? "Approved" :
            order.master_bill_status === 3 ? "Packing" :
              order.master_bill_status === 4 ? "Dispatch" :
                order.master_bill_status === 5 ? "Rejected" :
                  order.master_bill_status === 6 ? "Delivered" : "Unknown"
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);

    link.setAttribute('href', url);
    link.setAttribute('download', `pos_orders_${new Date().toISOString().slice(0, 10)}.csv`);
    link.style.visibility = 'hidden';

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const filterData = () => {
    const formattedStart = formatToDDMMYYYY(startDate);
    const formattedEnd = formatToDDMMYYYY(endDate);
    getAllPosList(formattedStart, formattedEnd);
  };

  const handleViewOrder = (order) => {
    setSelectedOrder(order);
    setIsModalOpen(true);
  };

  const handleStatusClick = (order, selectedOption) => {
    setSelectedStatusOrder(order);
    getOrderDescription(order.master_id);
    setNewStatus(selectedOption?.value || order.master_status?.toString() || '');
    setStatusModalOpen(true);
  };

  const handleTrackingUpdate = async () => {
    if (trackingDescription.trim() === '') {
      toast.success('Please enter tracking details.');
      return;
    }
    http.post("/order/tracking", {
      master_tracking_details: trackingDescription,
      master_id: selectedStatusOrder?.master_id
    }).then((res) => {
      toast.success('Tracking details updated successfully!');
      setPosBills((prev) =>
        prev.map((item) =>
          item.master_invoice_no === selectedStatusOrder?.master_invoice_no
            ? { ...item, master_tracking_details: trackingDescription }
            : item
        )
      );
      setTrackingModalOpen(false);
    }).catch((e) => {
      console.error('Failed to update tracking details:', e);
      alert('Failed to update tracking details');
    });
  }

  const handleStatusUpdate = async (order, selectedOption) => {
    setStatusUpdating(true);
    try {
      await http.post('/order/update-status', {
        master_id: order?.master_id,
        master_status: parseInt(selectedOption?.value),
      });
      toast.success('Status updated successfully!');
      setPosBills((prev) =>
        prev.map((item) =>
          item.master_invoice_no === order?.master_invoice_no
            ? { ...item, master_status: parseInt(newStatus) }
            : item
        )
      );

      setStatusModalOpen(false);
    } catch (error) {
      console.error('Failed to update status:', error);
      alert('Failed to update status');
    }
    setStatusUpdating(false);
  };

  // Effects
  useEffect(() => {
    getBusinessDetails();
    const todayStr = formatToDDMMYYYY(new Date());
    getAllPosList(todayStr, todayStr);
  }, []);

  return (
    <div className="page-content">
      <Row>
        <Col lg={12}>
          <Card id="orderList">
            <CardHeader className="card-header border-0">
              <Row className="align-items-center gy-3">
                <div className="col-sm">
                  <h5 className="card-title mb-0">All Orders</h5>
                </div>
                <div className="col-sm-auto">
                  <div className="d-flex gap-1 flex-wrap">
                    <div>
                      <Flatpickr
                        className="form-control"
                        options={{
                          dateFormat: 'd/m/Y',
                          defaultDate: startDate,
                        }}
                        value={startDate}
                        onChange={(dates) => setStartDate(dates[0])}
                      />
                    </div>
                    <div>
                      <Flatpickr
                        className="form-control"
                        options={{
                          dateFormat: 'd/m/Y',
                          defaultDate: endDate,
                        }}
                        value={endDate}
                        onChange={(dates) => setEndDate(dates[0])}
                      />
                    </div>
                    <div>
                      <button className="btn btn-success w-100" onClick={filterData}>
                        Search
                      </button>
                    </div>
                    <button type="button" className="btn btn-secondary" onClick={handlePrint}>
                      <i className="ri-printer-line align-bottom me-1"></i> Print Report
                    </button>
                    <button type="button" className="btn btn-info" onClick={downloadCSV}>
                      <i className="ri-file-download-line align-bottom me-1"></i> Export CSV
                    </button>
                    <button
                      type="button"
                      className="btn btn-success"
                      onClick={() => setmodal_standard(!modal_standard)}
                    >
                      <i className="ri-filter-line align-bottom me-1"></i> Filter
                    </button>
                  </div>
                </div>

                <Modal
                  id="myModal"
                  isOpen={modal_standard}
                  toggle={() => setmodal_standard(!modal_standard)}
                >
                  <ModalBody>
                    <Row className="my-3">
                      <Col xl={12} md={12} style={{ marginBottom: '10px' }}>
                        <div className="input-group">
                          <span className="input-group-text" id="basic-addon1">
                            <i className="ri-user-line"></i>
                          </span>
                          <AsyncSelect
                            placeholder="Select Customer Name"
                            loadOptions={(inputValue) =>
                              new Promise((resolve) => {
                                resolve([
                                  { value: 'ABC Corp.', label: 'ABC Corp.' },
                                  { value: 'XYZ Ltd.', label: 'XYZ Ltd.' },
                                ]);
                              })
                            }
                          />
                        </div>
                      </Col>
                    </Row>
                  </ModalBody>
                  <ModalFooter>
                    <Button color="danger" onClick={() => setmodal_standard(!modal_standard)}>
                      Close
                    </Button>
                  </ModalFooter>
                </Modal>
              </Row>
            </CardHeader>

            <CardBody className="pt-0">
              <div className='table-responsive'>
                <table className="table align-middle table-nowrap table-hover">
                  <thead className="table-light text-muted text-uppercase">
                    <tr>
                      <th>Sr.No</th>
                      <th>INV No.</th>
                      <th>Order Type</th>
                      <th>Customer Name</th>
                      <th>Bill Date</th>
                      <th>Qty</th>
                      <th>Grand Total</th>
                      <th>Payment Mode</th>
                      <th>Tracking Details</th>
                      <th>Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {posBills.map((item, index) => (
                      <tr key={index}>
                        <td>{index + 1}</td>
                        <td>{item.master_invoice_no}</td>
                        <td>{item.master_type == 2 ? "Sample" : "Regular"}</td>
                        <td>{item.user_name}</td>
                        <td>{item.master_bill_date}</td>
                        <td>{item.master_qty}</td>
                        <td>&#8377; {item.master_total_bill_amt}</td>
                        <td>{item.payment_type === 1 ? 'Cash' : 'Online'}</td>
                        <td>
                          <button
                            className='btn btn-outline-info btn-sm d-flex align-items-center'
                            onClick={() => {
                              setSelectedStatusOrder(item);
                              setTrackingModalOpen(true);
                              setTrackingDescription(item.master_tracking_details)
                            }}
                          >
                            {item.master_tracking_details ?
                              <i className="ri-eye-fill me-2 fs-16"></i> :
                              <i className="ri-add-fill me-2 fs-16"></i>
                            }
                            Tracking
                          </button>
                        </td>
                        <td style={{ minWidth: 150 }}>
                          <Select
                            onChange={(selectedOption) => handleStatusUpdate(item, selectedOption)}
                            options={statusOptions}
                            defaultValue={statusOptions.find(opt =>
                              opt.value === item.master_bill_status.toString()
                            )}
                            isSearchable={true}
                            menuPortalTarget={document.body}           // 👈 Render dropdown in body
                            styles={{
                              menuPortal: base => ({ ...base, zIndex: 9999 }),  // 👈 Ensure it's on top
                            }}
                          />

                        </td>
                        <td>
                          <div className="d-flex gap-2">
                            <Button
                              color="light"
                              size="sm"
                              onClick={() => handleViewOrder(item)}
                              className="btn-icon"
                            >
                              <i className="ri-eye-line"></i>
                            </Button>
                            <Button
                              color="light"
                              size="sm"
                              onClick={() => handlePrintInvoice(item)}
                              className="btn-icon text-primary"
                            >
                              <i className="ri-printer-line"></i>
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardBody>
          </Card>
        </Col>
      </Row>

      {/* Order Details Modal */}
      {isModalOpen && (
        <OrderDetailsModal
          order={selectedOrder}
          onClose={() => setIsModalOpen(false)}
        />
      )}

      {/* Status Update Modal */}
      <Modal isOpen={statusModalOpen} toggle={() => setStatusModalOpen(false)} centered>
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
            <Label for="descriptionTextarea">Description</Label>
            <Input
              type="textarea"
              id="descriptionTextarea"
              placeholder="Enter status description..."
              value={OrderDescription}
              onChange={(e) => setOrderDescription(e.target.value)}
            />
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
            onClick={() => handleStatusUpdate(selectedStatusOrder, { value: newStatus })}
            disabled={statusUpdating}
          >
            {statusUpdating ? 'Updating...' : 'Update Status'}
          </Button>
        </ModalFooter>
      </Modal>

      {/* Tracking Update Modal */}
      <Modal isOpen={trackingModalOpen} toggle={() => setTrackingModalOpen(false)} centered>
        <ModalHeader toggle={() => setTrackingModalOpen(false)}>
          Update Tracking Details
        </ModalHeader>
        <ModalBody>
          <FormGroup>
            <Input
              rows={10}
              type="textarea"
              id="trackingTextarea"
              placeholder="Enter tracking details..."
              value={trackingDescription}
              onChange={(e) => setTrackingDescription(e.target.value)}
            />
          </FormGroup>
        </ModalBody>
        <ModalFooter>
          <Button
            color="danger"
            className='d-flex align-items-center'
            onClick={() => setTrackingModalOpen(false)}
          >
            <i className="ri-close-line fs-16 me-1"></i>
            Cancel
          </Button>
          <Button
            color="primary"
            className='d-flex align-items-center'
            onClick={handleTrackingUpdate}
          >
            <i className="ri-save-line fs-16 me-1"></i>
            Save Information
          </Button>
        </ModalFooter>
      </Modal>
    </div>
  );
};

export default POSList;