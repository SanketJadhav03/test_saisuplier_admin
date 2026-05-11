import React, { useEffect, useState } from "react";
import { Modal, ModalBody, ModalFooter, ModalHeader } from "reactstrap";
import AuthUser from "../../helpers/Authuser";
import { IMG_API_URL, sendMail } from "../../helpers/url_helper";
import html2pdf from "html2pdf.js";
import { toast } from "react-toastify";
const Sale_Print_Modal = (props) => {
  const { http } = AuthUser();
  const [childData, setChildData] = useState([]);
  const [masterData, setMasterData] = useState({});
  const [businessData, setBusinessData] = useState({});
  const [customer, setCustomer] = useState({});
  useEffect(() => {
    http
      .get(`/sale/invoice/${props.id}`)
      .then(function (response) {
        if (response.data) {
          setChildData(response.data.Child);
          setCustomer(response.data.customer);
          setBusinessData(response.data.Business[0]);
          setMasterData(response.data.Master[0]);
          
        }
      })
      .catch(function (error) {
        console.log(error);
      });
  }, []);
  function convertNumberToWords(amount) {
    const words = [
      "",
      "One",
      "Two",
      "Three",
      "Four",
      "Five",
      "Six",
      "Seven",
      "Eight",
      "Nine",
      "Ten",
      "Eleven",
      "Twelve",
      "Thirteen",
      "Fourteen",
      "Fifteen",
      "Sixteen",
      "Seventeen",
      "Eighteen",
      "Nineteen",
      "Twenty",
      "Thirty",
      "Forty",
      "Fifty",
      "Sixty",
      "Seventy",
      "Eighty",
      "Ninety",
    ];

    function inWords(num) {
      if (num === 0) return "Zero";

      let output = "";

      const crore = Math.floor(num / 10000000);
      if (crore > 0) {
        output += inWords(crore) + " Crore ";
        num %= 10000000;
      }

      const lakh = Math.floor(num / 100000);
      if (lakh > 0) {
        output += inWords(lakh) + " Lakh ";
        num %= 100000;
      }

      const thousand = Math.floor(num / 1000);
      if (thousand > 0) {
        output += inWords(thousand) + " Thousand ";
        num %= 1000;
      }

      const hundred = Math.floor(num / 100);
      if (hundred > 0) {
        output += inWords(hundred) + " Hundred ";
        num %= 100;
      }

      if (num > 0) {
        if (num < 20) {
          output += words[num] + " ";
        } else {
          const tens = Math.floor(num / 10);
          const units = num % 10;
          output += words[18 + tens] + " "; // correct tens mapping
          if (units > 0) output += words[units] + " ";
        }
      }

      return output.trim();
    }

    // split into rupees and paise
    const rupees = Math.floor(amount);
    const paise = Math.round((amount - rupees) * 100);

    let result = `Rupees ${inWords(rupees)}`;
    if (paise > 0) {
      result += ` and ${inWords(paise)} Paise`;
    }
    return result + " Only";
  }
console.log(masterData);
  const getPrice = (item) => {
    switch (masterData.selectPriceOption) {
      case "price_sales":
        return item.pos_salePrice;
      case "price_wholesaler":
        return item.pos_wholesaler;
      case "price_distributor":
        return item.pos_distributor_price;
      default:
        return 0;
    }
  };

  const handlePrint = () => {
    const printableArea = document.getElementById("printable-area");
    if (!printableArea) {
      alert("Printable area not found.");
      return;
    }

    const clonedContent = printableArea.cloneNode(true);
    const printFrame = document.createElement("iframe");

    // Hide the iframe
    printFrame.style.position = "fixed";
    printFrame.style.right = "0";
    printFrame.style.bottom = "0";
    printFrame.style.width = "0";
    printFrame.style.height = "0";
    printFrame.style.border = "0";

    printFrame.onload = () => {
      const printDocument =
        printFrame.contentDocument || printFrame.contentWindow.document;

      // Set up styles
      const styleElement = printDocument.createElement("style");
      styleElement.textContent = `
        @page {
          size: A4;
          margin-top: 2mm;
          margin-right: 0mm;
          margin-left: 0mm;
          margin-bottom: 0mm;
        }
  
        body {
          font-family: 'Segoe UI', sans-serif;
          color: #000;
        }
  
        .formss {
          border: 1px solid black;
          padding: 10px;
        }
  
        .invocess {
          border: 1px solid black;
          border-collapse: collapse;
          padding: 4px;
        }
  
        .invocess th, .invocess td {
          border: 1px solid black;
          padding: 4px;
          text-align: left;
        }
  
        #per {
          padding: 2px;
          text-align: right;
        }
  
        .header {
          display: flex;
          justify-content: space-around;
          align-items: center;
        }
  
        table {
          width: 100%;
          border-collapse: collapse;
        }
      `;

      // Optional: Add Bootstrap CDN
      const bootstrapLink = printDocument.createElement("link");
      bootstrapLink.rel = "stylesheet";
      bootstrapLink.href =
        "https://cdn.jsdelivr.net/npm/bootstrap@5.3.1/dist/css/bootstrap.min.css";

      // Clean slate
      printDocument.head.innerHTML = "";
      printDocument.body.innerHTML = "";

      // Inject styles and content
      printDocument.head.appendChild(bootstrapLink);
      printDocument.head.appendChild(styleElement);
      printDocument.body.appendChild(clonedContent);

      // Wait before printing to ensure rendering
      setTimeout(() => {
        printFrame.contentWindow.focus();
        printFrame.contentWindow.print();

        // Safe cleanup after print
        setTimeout(() => {
          if (document.body.contains(printFrame)) {
            document.body.removeChild(printFrame);
          }
        }, 1000);
      }, 500);
    };

    // Append iframe and set src to blank to trigger onload
    document.body.appendChild(printFrame);
    printFrame.src = "about:blank";
  };

  const sendToMail = async () => {
    const content = document.getElementById("printable-area");
    if (!content) {
      alert("Printable area not found.");
      return;
    }

    const opt = {
      margin: 0,
      filename: "Invoice.pdf",
      image: { type: "jpeg", quality: 0.98 },
      html2canvas: {
        scale: 2,
        useCORS: true,
      },
      jsPDF: {
        unit: "mm",
        format: "a4",
        orientation: "portrait",
      },
    };

    html2pdf()
      .from(content)
      .set(opt)
      .outputPdf("blob")
      .then((pdfBlob) => {
        const reader = new FileReader();
        reader.readAsDataURL(pdfBlob);

        reader.onloadend = () => {
          sendMail(
            "send_Invoice",
            {
              Name: customer.user_name,
              pdf: reader.result,
            },
            customer.user_email,
          );

          toast.success(`Mail Sent to ${customer.user_name} Successfully!`);
          props.togg_large();
        };
      });
  };
  const currentDate = new Date();
  const formattedDate = `${String(currentDate.getDate()).padStart(
    2,
    "0",
  )}/${String(currentDate.getMonth() + 1).padStart(
    2,
    "0",
  )}/${currentDate.getFullYear()}`;
  const tdStyle = {
    padding: 6,
    border: "1px solid #999",
    textAlign: "center",
  };
  if (props.modal_large === false) {
    return null;
  }
  const summary = childData.reduce(
    (acc, item) => {
      const weight = parseFloat(item.pos_weight) || 0;
      const qty = parseFloat(item.pos_quantity) || 0;

      acc.totalWeight += weight * qty;

      return acc;
    },
    {
      totalWeight: 0,
    },
  );

  return (
    <Modal
      style={{
        maxWidth: "200mm",
        width: "auto",
        margin: "auto",
      }}
      isOpen={props.modal_large}
      toggle={props.togg_large}
    >
      <ModalHeader className="modal-title" toggle={props.togg_large}>
        Invoice
      </ModalHeader>
      <ModalBody className="max-w-[95vw] w-auto h-[90vh] overflow-y-auto">
        <div className="flex flex-col items-center" id="printable-area">
          <div
            id="printable-area"
            className="invoice-container"
            style={{
              maxWidth: "200mm",
              width: "auto",
              margin: "auto",
              backgroundColor: "white",
              border: "1px solid black",
              fontSize: 12,
            }}
          >
            {/* Header Section with GSTIN and Invoice Type */}
            <div
              style={{
                borderBottom: "1px solid black",
                padding: 5,
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <div style={{ fontSize: 12, fontWeight: "bold" }}>
                GSTIN No. {businessData?.business_gst_no || "N/A"}
              </div>
              <div style={{ fontSize: 12, fontWeight: "bold" }}>
                RETAIL INVOICE
              </div>
            </div>

            {/* Company Name and Address Section */}
            <div
              style={{
                textAlign: "center",
                padding: 10,
                borderBottom: "1px solid black",
              }}
            >
              <h1
                style={{
                  margin: 0,
                  fontSize: 20,
                  fontWeight: "bold",
                  letterSpacing: 1,
                  color: "black",
                }}
              >
                {businessData?.business_name || "N/A"}
              </h1>

              {/* Address */}
              <div
                style={{
                  fontSize: 13,
                  marginTop: 2,
                  maxWidth: "400px", // Limit width for nice wrapping
                  margin: "8px auto 0", // Center horizontally
                  wordWrap: "break-word", // Break long words
                  whiteSpace: "pre-wrap", // Preserve line breaks if any
                }}
              >
                <div
                  dangerouslySetInnerHTML={{
                    __html: businessData?.business_billing_address || "",
                  }}
                ></div>
              </div>

              {/* Mobile Number */}
              <div style={{ fontSize: 12, marginTop: 1 }}>
                Mob. No. {businessData?.business_company_phone_no || "N/A"}
              </div>
            </div>

            {/* Customer Details and Invoice Information */}
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                border: "1px solid black",
                borderRadius: 4,
              }}
            >
              {/* 🔹 Invoice Details on Top (Horizontal Layout) */}
              <table
                style={{
                  width: "100%",
                  borderCollapse: "collapse",
                  fontSize: 11,
                  borderBottom: "1px solid black",
                }}
                cellPadding={0}
                cellSpacing={0}
              >
                <tbody>
                  <tr>
                    <td
                      style={{
                        padding: 5,
                        fontWeight: "bold",

                        borderRight: "1px solid black",
                        width: "8%",
                      }}
                    >
                      INV No.
                    </td>
                    <td style={{ padding: 8, width: "21%" }}>
                      {masterData?.master_invoice_no
                        ? "" + masterData.master_invoice_no
                        : "N/A"}
                    </td>

                    <td
                      style={{
                        padding: 5,
                        fontWeight: "bold",
                        borderLeft: "1px solid black",
                        borderRight: "1px solid black",
                        width: "10%",
                      }}
                    >
                      DATE
                    </td>
                    <td style={{ padding: 8, width: "20%" }}>
                      {masterData?.master_bill_date || "N/A"}
                    </td>
                  </tr>
                </tbody>
              </table>

              {/* 🔹 Bill To & Ship To (Half-Half) */}
              <div
                style={{
                  display: "flex",
                  borderBottom: "1px solid black",
                }}
              >
                {/* Bill To */}
                <div
                  style={{
                    flex: 1,
                    padding: 10,
                    borderRight: "1px solid black",
                  }}
                >
                  <div
                    style={{
                      fontSize: 12,
                      fontWeight: "bold",
                      marginBottom: 2,
                    }}
                  >
                    Bill To:
                  </div>
                  <div style={{ fontSize: 11, marginBottom: 1 }}>
                    <b>
                      {customer?.user_type == 1
                        ? customer?.user_name
                        : customer?.master_name}
                      {customer?.master_branch_name
                        ? ` - ${customer.master_branch_name}`
                        : ""}
                      {customer?.master_branch_code
                        ? ` - ${customer.master_branch_code}`
                        : ""}
                    </b>
                    <br />
                    {customer?.master_address && (
                      <>
                        Address: {customer?.master_address}
                        {customer?.master_dictrict &&
                          `, ${customer?.master_dictrict}`}
                        {customer?.master_taluka &&
                          `, ${customer?.master_taluka}`}
                        {customer?.master_city && `, ${customer?.master_city}`}
                        {customer?.master_state &&
                          `, ${customer?.master_state}`}
                        <br />
                        Pincode: {customer.master_pincode}
                        <br />
                      </>
                    )}
                    {customer?.master_email && (
                      <>
                        Mail: {customer?.master_email}
                        <br />
                      </>
                    )}
                    {customer?.master_gst && (
                      <>
                        GST No: {customer?.master_gst}
                        <br />
                      </>
                    )}
                    {(customer?.user_mobile || customer?.master_mobile) && (
                      <>
                        Contact No:{" "}
                        {customer?.user_mobile || customer?.master_mobile}
                        <br />
                      </>
                    )}
                  </div>
                </div>

                {/* Ship To */}
                <div style={{ flex: 1, padding: 10 }}>
                  <div
                    style={{
                      fontSize: 12,
                      fontWeight: "bold",
                      marginBottom: 2,
                    }}
                  >
                    Ship To:
                  </div>
                  <div style={{ fontSize: 11, marginBottom: 3 }}>
                    {masterData.master_address1 && (
                      <>
                        Address: {masterData.master_address1}
                        {masterData.master_address2 &&
                          `, ${masterData.master_address2}`}
                        {masterData.master_district &&
                          `, ${masterData.master_district}`}
                        {masterData.master_taluka &&
                          `, ${masterData.master_taluka}`}
                        {masterData.master_city &&
                          `, ${masterData.master_city}`}
                        {masterData.master_state &&
                          `, ${masterData.master_state}`}
                        <br />
                      </>
                    )}
                    {masterData.master_pincode && (
                      <>
                        Pincode: {masterData.master_pincode}
                        <br />
                      </>
                    )}
                  </div>
                </div>
              </div>

              {/* 🔹 Transport Details (Bottom) */}
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                }}
              >
                <div style={{ padding: 8 }}>
                  <div
                    style={{
                      fontSize: 13,
                      fontWeight: "bold",
                      marginBottom: 1,
                    }}
                  >
                    Transport Details:
                  </div>
                  <div style={{ fontSize: 13 }}>
                    <div
                      dangerouslySetInnerHTML={{
                        __html: masterData?.master_tracking_details || "N/A",
                      }}
                    ></div>
                  </div>
                </div>
                {masterData.master_dispatch_img && (
                  <div style={{ padding: 12, borderLeft: "1px solid black" }}>
                    <div
                      style={{
                        fontSize: 13,
                        fontWeight: "bold",
                        marginBottom: 1,
                      }}
                    >
                      Dispatch Image:
                    </div>
                    <div style={{ fontSize: 13 }}>
                      <img
                        width={"150px"}
                        src={`${IMG_API_URL}/order_dispatch/${masterData.master_dispatch_img}`}
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Items Table */}
            <table
              style={{
                width: "100%",
                borderCollapse: "collapse",
                fontSize: 11,
              }}
            >
              <thead>
                <tr
                  style={{
                    backgroundColor: "#e6e6e6",
                  }}
                >
                  <th
                    style={{
                      borderTop: "none",
                      padding: 8,
                      textAlign: "center",
                      width: 40,
                      fontWeight: "bold",
                    }}
                  >
                    S.N
                  </th>

                  <th
                    style={{
                      border: "1px solid black",
                      borderTop: "none",
                      padding: 5,
                      textAlign: "center",
                      width: 250,
                      fontWeight: "bold",
                    }}
                  >
                    ITEM DESCRIPTION
                  </th>

                  <th
                    style={{
                      borderTop: "none",
                      borderRight: "1px solid black",
                      padding: 8,
                      textAlign: "center",
                      width: 70,
                      fontWeight: "bold",
                    }}
                  >
                    HSN
                  </th>

                  <th
                    style={{
                      borderTop: "none",
                      borderRight: "1px solid black",
                      padding: 8,
                      textAlign: "center",
                      width: 60,
                      fontWeight: "bold",
                    }}
                  >
                    QTY
                  </th>

                  <th
                    style={{
                      borderTop: "none",
                      borderRight: "1px solid black",
                      padding: 8,
                      textAlign: "center",
                      width: 60,
                      fontWeight: "bold",
                    }}
                  >
                    RATE
                  </th>

                  <th
                    style={{
                      borderTop: "none",
                      borderRight: "1px solid black",
                      padding: 8,
                      textAlign: "center",
                      width: 80,
                      fontWeight: "bold",
                    }}
                  >
                    Taxable Value
                  </th>

                  <th
                    style={{
                      borderTop: "none",
                      borderRight: "1px solid black",
                      padding: 8,
                      textAlign: "center",
                      width: 50,
                      fontWeight: "bold",
                    }}
                  >
                    GST %
                  </th>

                  <th
                    style={{
                      borderTop: "none",
                      borderRight: "1px solid black",
                      padding: 8,
                      textAlign: "center",
                      width: 50,
                      fontWeight: "bold",
                    }}
                  >
                    GST Value
                  </th>

                  <th
                    style={{
                      borderTop: "none",
                      padding: 8,
                      textAlign: "center",
                      width: 70,
                      fontWeight: "bold",
                    }}
                  >
                    TOTAL
                  </th>
                </tr>
              </thead>

              <tbody style={{ borderTop: "none", borderLeft: "none" }}>
                {childData.map((item, index) => {
                  const rate = parseFloat(getPrice(item)); // unit price
                  const qty = parseFloat(item.pos_qty) || 0;
                  const taxableValue = parseFloat(rate * qty);
                  const gstPercent = parseFloat(item.tax_percentage) || 0;
                  const gstValue = parseFloat(
                    (taxableValue * gstPercent) / 100,
                  );
                  const total = parseFloat(taxableValue + gstValue);

                  return (
                    <tr key={index}>
                      {/* Serial Number */}
                      <td style={tdStyle}>{index + 1}</td>

                      {/* Product Name */}
                      <td style={tdStyle}>
                        {item.product_english_name || "-"}
                         <div style={{ fontSize: "10px", color: "#6c757d" }}>
                          <strong>Note:</strong> {item.pos_product_notes || "-"}
                        </div>
                      </td>

                      {/* HSN Code */}
                      <td style={tdStyle}>{item.product_hsn_code || "-"}</td>

                      {/* Quantity */}
                      <td style={tdStyle}>
                        {qty}
                        <br />
                        Nos
                      </td>

                      {/* Rate */}
                      <td style={tdStyle}>₹ {rate?.toFixed(2)}</td>

                      {/* Taxable Value */}
                      <td style={tdStyle}>{taxableValue?.toFixed(2)}</td>

                      {/* GST % */}
                      <td style={tdStyle}>{gstPercent}</td>

                      {/* GST Value */}
                      <td style={tdStyle}>{gstValue?.toFixed(2)}</td>

                      {/* Total */}
                      <td style={tdStyle}>₹ {total?.toFixed(2)}</td>
                    </tr>
                  );
                })}
         
                {/* Final Total Row */}
                {props.status != "1" && (
                  <tr>
                    <td colSpan={4} style={tdStyle}>
                      <b>Total</b>
                    </td>

                    <td style={tdStyle}>
                      {childData
                        .reduce(
                          (sum, item) =>
                            sum + getPrice(item) * (item.pos_qty || 0),
                          0,
                        )
                        .toFixed(2)}
                    </td>
                    <td style={tdStyle}>
                      {childData
                        .reduce(
                          (sum, item) =>
                            sum + getPrice(item) * (item.pos_qty || 0),
                          0,
                        )
                        .toFixed(2)}
                    </td>
                    <td style={tdStyle}>-</td>
                    <td style={tdStyle}>
                      {childData
                        .reduce(
                          (sum, item) =>
                            sum +
                            (getPrice(item) *
                              (item.pos_qty || 0) *
                              (item.tax_percentage || 0)) /
                              100,
                          0,
                        )
                        .toFixed(2)}
                    </td>
                    <td style={tdStyle}>
                      ₹{" "}
                      {childData
                        .reduce((sum, item) => {
                          const rate = parseFloat(getPrice(item));
                          const qty = parseFloat(item.pos_qty) || 0;
                          const taxableValue = parseFloat(rate * qty);
                          const gstPercent =
                            parseFloat(item.tax_percentage) || 0;
                          const gstValue = parseFloat(
                            (taxableValue * gstPercent) / 100,
                          );
                          return sum + taxableValue + gstValue;
                        }, 0)
                        .toFixed(2)}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>

            {/* Tax Summary Section */}
            <div style={{ display: "flex", borderTop: "1px solid black" }}>
              <div style={{ flex: 1, padding: 5, fontSize: 11 }}>
                <table style={{ width: "100%", borderCollapse: "collapse" }}>
                  <tbody>
                    {/* Header Row */}
                    <tr style={{ fontWeight: "bold", fontSize: 12 }}>
                      <td
                        style={{ padding: 4, borderBottom: "1px solid #ccc" }}
                      >
                        Taxable
                      </td>
                      <td
                        style={{ padding: 4, borderBottom: "1px solid #ccc" }}
                      >
                        SGST %
                      </td>
                      <td
                        style={{ padding: 4, borderBottom: "1px solid #ccc" }}
                      >
                        Amt.
                      </td>
                      <td
                        style={{ padding: 4, borderBottom: "1px solid #ccc" }}
                      >
                        CGST %
                      </td>
                      <td
                        style={{ padding: 4, borderBottom: "1px solid #ccc" }}
                      >
                        Amt.
                      </td>
                      <td
                        style={{ padding: 4, borderBottom: "1px solid #ccc" }}
                      >
                        IGST %
                      </td>
                      <td
                        style={{ padding: 4, borderBottom: "1px solid #ccc" }}
                      >
                        Amt.
                      </td>
                    </tr>

                    {/* Grouping by HSN Code */}
                    {Object.entries(
                      childData.reduce((acc, item) => {
                        const hsn = item.product_hsn_code || "NO HSN";
                        if (!acc[hsn]) acc[hsn] = [];
                        acc[hsn].push(item);
                        return acc;
                      }, {}),
                    ).map(([hsn, items], index) => {
                      // Calculations for grouped items
                      const totalTaxable = items.reduce(
                        (sum, item) =>
                          sum + getPrice(item) * (item.pos_qty || 0),
                        0,
                      );

                      const gstPercent = items[0].tax_percentage || 0;
                      const isMH = masterData?.master_state === "Maharashtra";

                      const sgstPercent = isMH ? gstPercent / 2 : 0;
                      const cgstPercent = isMH ? gstPercent / 2 : 0;
                      const igstPercent = isMH ? 0 : gstPercent;

                      const sgstAmt = (totalTaxable * sgstPercent) / 100;
                      const cgstAmt = (totalTaxable * cgstPercent) / 100;
                      const igstAmt = (totalTaxable * igstPercent) / 100;

                      return (
                        <React.Fragment key={index}>
                          {/* HSN Title Row */}
                          <tr
                            style={{
                              background: "#f2f2f2",
                              fontWeight: "bold",
                              fontSize: 12,
                            }}
                          >
                            <td colSpan={7} style={{ padding: 4 }}>
                              HSN Code: {hsn}
                            </td>
                          </tr>

                          {/* GST Breakup Row */}
                          <tr>
                            <td style={{ padding: 4 }}>
                              {totalTaxable.toFixed(2)}
                            </td>

                            {/* SGST */}
                            <td style={{ padding: 4 }}>
                              {isMH ? sgstPercent.toFixed(2) + " %" : "-"}
                            </td>
                            <td style={{ padding: 4 }}>
                              {isMH ? sgstAmt.toFixed(2) : "-"}
                            </td>

                            {/* CGST */}
                            <td style={{ padding: 4 }}>
                              {isMH ? cgstPercent.toFixed(2) + " %" : "-"}
                            </td>
                            <td style={{ padding: 4 }}>
                              {isMH ? cgstAmt.toFixed(2) : "-"}
                            </td>

                            {/* IGST */}
                            <td style={{ padding: 4 }}>
                              {!isMH ? igstPercent.toFixed(2) + " %" : "-"}
                            </td>
                            <td style={{ padding: 4 }}>
                              {!isMH ? igstAmt.toFixed(2) : "-"}
                            </td>
                          </tr>
                        </React.Fragment>
                      );
                    })}

                    {/* ===================== Grand Total Row ===================== */}
                    <tr
                      style={{
                        fontWeight: "bold",
                        borderTop: "1px solid black",
                      }}
                    >
                      <td style={{ padding: 4 }}>
                        {childData
                          .reduce(
                            (sum, item) =>
                              sum + getPrice(item) * (item.pos_qty || 0),
                            0,
                          )
                          .toFixed(2)}
                      </td>

                      <td style={{ padding: 4 }}>-</td>

                      {/* SGST Total */}
                      <td style={{ padding: 4 }}>
                        {childData
                          .reduce((sum, item) => {
                            const taxableValue =
                              getPrice(item) * (item.pos_qty || 0);
                            const gstPercent = item.tax_percentage || 0;
                            return (
                              sum +
                              (masterData?.master_state === "Maharashtra"
                                ? (taxableValue * (gstPercent / 2)) / 100
                                : 0)
                            );
                          }, 0)
                          .toFixed(2)}
                      </td>

                      <td style={{ padding: 4 }}>-</td>

                      {/* CGST Total */}
                      <td style={{ padding: 4 }}>
                        {childData
                          .reduce((sum, item) => {
                            const taxableValue =
                              getPrice(item) * (item.pos_qty || 0);
                            const gstPercent = item.tax_percentage || 0;
                            return (
                              sum +
                              (masterData?.master_state === "Maharashtra"
                                ? (taxableValue * (gstPercent / 2)) / 100
                                : 0)
                            );
                          }, 0)
                          .toFixed(2)}
                      </td>

                      <td style={{ padding: 4 }}>-</td>

                      {/* IGST Total */}
                      <td style={{ padding: 4 }}>
                        {childData
                          .reduce((sum, item) => {
                            const taxableValue =
                              getPrice(item) * (item.pos_qty || 0);
                            const gstPercent = item.tax_percentage || 0;
                            return (
                              sum +
                              (masterData?.master_state !== "Maharashtra"
                                ? (taxableValue * gstPercent) / 100
                                : 0)
                            );
                          }, 0)
                          .toFixed(2)}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* Total Amount Summary */}
              <div
                style={{
                  width: 250,
                  padding: 5,
                  fontSize: 11,
                  borderLeft: "1px solid black",
                }}
              >
                {(() => {
                  // Calculate totals from childData
                  const totalBeforeTax = childData.reduce(
                    (sum, item) => sum + getPrice(item) * (item.pos_qty || 0),
                    0,
                  );

                  const totalGST = childData.reduce((sum, item) => {
                    const taxableValue = getPrice(item) * (item.pos_qty || 0);
                    return (
                      sum + (taxableValue * (item.tax_percentage || 0)) / 100
                    );
                  }, 0);

                  // Split GST into SGST + CGST (half-half) for intra-state (Maharashtra)
                  const sgst =
                    masterData?.master_state === "Maharashtra"
                      ? totalGST / 2
                      : 0;
                  const cgst =
                    masterData?.master_state === "Maharashtra"
                      ? totalGST / 2
                      : 0;
                  const igst =
                    masterData?.master_state !== "Maharashtra" ? totalGST : 0;

                  const grandTotal = totalBeforeTax + sgst + cgst + igst;

                  return (
                    <>
                      {/* Total Before Tax */}
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          marginBottom: 1,
                          padding: "1px 0",
                        }}
                      >
                        <span>Total Amount Before Tax</span>
                        <span style={{ fontWeight: "bold" }}>
                          {totalBeforeTax.toFixed(2)}
                        </span>
                      </div>

                      {/* SGST */}
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          marginBottom: 1,
                          padding: "1px 0",
                        }}
                      >
                        <span>Add: SGST</span>
                        <span style={{ fontWeight: "bold" }}>
                          {sgst > 0 ? sgst.toFixed(2) : "-"}
                        </span>
                      </div>

                      {/* CGST */}
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          marginBottom: 1,
                          padding: "1px 0",
                        }}
                      >
                        <span>Add: CGST</span>
                        <span style={{ fontWeight: "bold" }}>
                          {cgst > 0 ? cgst.toFixed(2) : "-"}
                        </span>
                      </div>

                      {/* IGST */}
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          marginBottom: 1,
                          padding: "1px 0",
                        }}
                      >
                        <span>Add: IGST</span>
                        <span style={{ fontWeight: "bold" }}>
                          {igst > 0 ? igst.toFixed(2) : "-"}
                        </span>
                      </div>

                      {/* Grand Total */}
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          marginTop: 1,
                          borderTop: "1px solid black",
                          padding: "4px 0",
                          fontWeight: "bold",
                        }}
                      >
                        <span>Total Amount After Tax</span>
                        <span>{grandTotal.toFixed(2)}</span>
                      </div>
                    </>
                  );
                })()}
              </div>
            </div>

            {/* Total Tax Amount Section */}
            <div
              style={{
                borderTop: "1px solid black",
                padding: 8,
                fontSize: 12,
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  marginBottom: 2,
                }}
              >
                <span style={{ fontWeight: "bold" }}>Total Amount</span>
                <span style={{ fontWeight: "bold" }}>
                  {parseFloat(
                    childData
                      .reduce((sum, item) => {
                        const rate = getPrice(item);
                        const qty = item.pos_qty || 0;
                        const taxableValue = rate * qty;
                        const gstPercent = item.tax_percentage || 0;
                        const gstValue = (taxableValue * gstPercent) / 100;
                        return sum + taxableValue;
                      }, 0)
                      .toFixed(2),
                  )}
                </span>
              </div>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  marginBottom: 1,
                }}
              >
                <span style={{ fontWeight: "bold" }}>
                  Total Tax Amount : GST
                </span>
                <span style={{ fontWeight: "bold" }}>
                  {childData
                    .reduce(
                      (sum, item) =>
                        sum +
                        (getPrice(item) *
                          (item.pos_qty || 0) *
                          (item.tax_percentage || 0)) /
                          100,
                      0,
                    )
                    .toFixed(2)}
                </span>
              </div>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  marginBottom: 1,
                }}
              >
                <span style={{ fontWeight: "bold" }}>
                  Other Charges{" "}
                  {masterData?.other_charges_name &&
                    `: ${masterData.other_charges_name}`}
                </span>
                <span style={{ fontWeight: "bold" }}>
                  {masterData.other_charge_amount}
                </span>
              </div>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  marginBottom: 1,
                }}
              >
                {masterData.master_type == 2 ? (
                  <span style={{ fontWeight: "bold" }}>Delivary Charge </span>
                ) : (
                  <span style={{ fontWeight: "bold" }}>
                    Transport Charge{" "}
                    {masterData?.transport_types_type &&
                      `: ${masterData.transport_types_type} `}
                    {summary.totalWeight < 1000
                      ? ` (${summary.totalWeight} gm)`
                      : ` (${(summary.totalWeight / 1000).toFixed(2)} kg)`}
                  </span>
                )}
                <span style={{ fontWeight: "bold" }}>
                  {" "}
                  {Number(
                    masterData?.transport_types_total_charge || 0,
                  ).toFixed(2)}
                </span>
              </div>

              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  borderTop: "1px solid #ccc",
                  paddingTop: 2,
                }}
              >
                <span style={{ fontWeight: "bold", fontSize: 14 }}>
                  Total Payable Amount
                </span>
                <span style={{ fontWeight: "bold", fontSize: 14 }}>
                  ₹{" "}
                  {(
                    parseFloat(
                      childData
                        .reduce((sum, item) => {
                          const rate = getPrice(item);
                          const qty = item.pos_qty || 0;
                          const taxableValue = rate * qty;
                          const gstPercent = item.tax_percentage || 0;
                          const gstValue = (taxableValue * gstPercent) / 100;
                          return sum + taxableValue + gstValue;
                        }, 0)
                        .toFixed(2),
                    ) +
                    parseFloat(masterData.other_charge_amount) +
                    parseFloat(masterData?.transport_types_total_charge || 0)
                  )?.toFixed(2)}
                </span>
              </div>
            </div>

            {/* Amount in Words and Grand Total */}
            <div style={{ borderTop: "1px solid black", display: "flex" }}>
              <div
                style={{
                  flex: 1,
                  padding: 10,
                  fontSize: 12,
                  borderRight: "1px solid black",
                }}
              >
                <span style={{ fontWeight: "bold" }}>
                  Bill Amount In Words :{" "}
                </span>
                <span>
                  <span>
                    {convertNumberToWords(
                      parseFloat(
                        childData
                          .reduce((sum, item) => {
                            const rate = getPrice(item);
                            const qty = item.pos_qty || 0;
                            const taxableValue = rate * qty;
                            const gstPercent = item.tax_percentage || 0;
                            const gstValue = (taxableValue * gstPercent) / 100;
                            return sum + taxableValue + gstValue;
                          }, 0)
                          .toFixed(2),
                      ) +
                        parseFloat(masterData.other_charge_amount) +
                        parseFloat(
                          masterData?.transport_types_total_charge || 0,
                        ),
                    )}
                  </span>
                </span>
              </div>
              <div
                style={{
                  width: 200,
                  padding: 8,
                  textAlign: "center",
                  borderTop: "1px solid black",
                  borderLeft: "1px solid black",
                  borderBottom: "1px solid black",
                  backgroundColor: "#f0f0f0",
                }}
              >
                <div
                  style={{ fontWeight: "bold", fontSize: 15, marginBottom: 1 }}
                >
                  GRAND TOTAL
                </div>
                <div
                  style={{ fontWeight: "bold", fontSize: 17, color: "#0b5394" }}
                >
                  ₹{" "}
                  {(
                    parseFloat(
                      childData
                        .reduce((sum, item) => {
                          const rate = getPrice(item);
                          const qty = item.pos_qty || 0;
                          const taxableValue = rate * qty;
                          const gstPercent = item.tax_percentage || 0;
                          const gstValue = (taxableValue * gstPercent) / 100;
                          return sum + taxableValue + gstValue;
                        }, 0)
                        .toFixed(2),
                    ) +
                    parseFloat(masterData.other_charge_amount) +
                    parseFloat(masterData?.transport_types_total_charge || 0)
                  )?.toFixed(2)}
                </div>
              </div>
            </div>
            <div
              style={{
                borderTop: "1px solid #000000ff",
                padding: 10,
                fontSize: 12,
                marginBottom: 0,
              }}
            >
              <strong>Terms & Conditions: </strong>
              <div
                dangerouslySetInnerHTML={{
                  __html: businessData?.business_terms_conditions,
                }}
              ></div>
            </div>
            {/* Footer Section */}
            <div style={{ borderTop: "1px solid black", display: "flex" }}>
              {/* Company Bank Details */}
              <div
                style={{
                  flex: 1,
                  padding: 12,
                  fontSize: 11,
                  borderRight: "1px solid black",
                }}
              >
                <div style={{ fontWeight: "bold", marginBottom: 1 }}>
                  {businessData?.business_name || "N/A"} Bank Details
                </div>
                <div style={{ marginBottom: 2 }}>
                  IFS CODE : {businessData?.business_ifsc_code}
                </div>
                <div style={{ marginBottom: 2 }}>
                  A/C NO- {businessData?.business_account_number}
                </div>
                <div style={{ marginBottom: 1 }}>
                  BRANCH -{businessData?.business_bank_name}{" "}
                </div>
              </div>

              {/* Signature Section */}
              <div style={{ width: 200, padding: 2, textAlign: "center" }}>
                {!businessData?.business_signature ? (
                  <div style={{ height: 40, margin: "30px 0" }} />
                ) : (
                  <img
                    style={{
                      height: "100px",
                      width: "auto",
                    }}
                    className="rounded-sqaure avatar-xl img-thumbnail user-profile-image"
                    src={`${IMG_API_URL}/business_images/${businessData?.business_signature}`}
                  />
                )}
                <div
                  style={{
                    fontSize: 10,
                    borderTop: "1px solid #999",
                    paddingTop: 1,
                  }}
                >
                  Auth. Signatory
                </div>
              </div>
            </div>
          </div>
          <div
            style={{
              textAlign: "right",
              fontSize: 10,
            }}
          >
            <i>
              {masterData.full_name &&
                `Invoice Created By ${masterData.full_name}`}
            </i>
          </div>
        </div>
      </ModalBody>
      <ModalFooter>
        <div className="hstack gap-2 justify-content-center my-2">
          <button
            type="button"
            onClick={sendToMail}
            className="btn btn-success"
          >
            <i className="ri-printer-line me-1 align-middle"></i>
            Send to Mail
          </button>
          <button
            type="button"
            className="btn btn-primary"
            onClick={handlePrint}
          >
            <i className="ri-printer-line me-1 align-middle"></i>
            Print
          </button>
          <button
            type="button"
            onClick={props.togg_large}
            className="btn btn-danger"
          >
            <i className="ri-close-line me-1 align-middle" />
            Close
          </button>
        </div>
      </ModalFooter>
    </Modal>
  );
};
export default Sale_Print_Modal;
