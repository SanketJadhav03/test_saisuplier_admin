import React, { useEffect, useState } from "react";
import { use } from "react";
import { Modal, ModalBody, ModalHeader } from "reactstrap";
import AuthUser from "../../helpers/Authuser";
import { IMG_API_URL, sendMail } from "../../helpers/url_helper";
import html2pdf from "html2pdf.js";
import { toast } from "react-toastify";

const PrintModal = (props) => {
  const { http, user } = AuthUser();
  const [Child_data, Set_Child_data] = useState([]);
  const [Master_data, Set_Master_data] = useState([]);
  const [Business, Set_Business] = useState([]);
  const [customer, setCustomer] = useState({});
  useEffect(() => {
    http
      .get(`/purchase/invoice/${props.id}`)
      .then(function (response) {
        if (response.data) {
          setCustomer(response.data.customer);

          Set_Child_data(response.data.Child);

          Set_Business(
            response.data.Business.length > 0 ? response.data.Business[0] : {},
          );
          Set_Master_data(
            response.data.Master.length ? response.data.Master[0] : {},
          );
        }
      })
      .catch(function (error) {
        console.log(error);
      });
  }, [props]);

  const getPrintableHTML = () => {
    const printableArea = document.getElementById("printable-area");
    if (!printableArea) return null;

    const clonedContent = printableArea.cloneNode(true);

    const wrapper = document.createElement("div");

    const style = document.createElement("style");
    style.innerHTML = `
      @page {
        size: A4;
        margin-top: 1mm;
      }

      * {
        box-sizing: border-box;
        page-break-inside: avoid !important;
        break-inside: avoid !important;
      }

      html, body {
        width: 100%;
        margin: 0;
        padding: 0;
      }

      #printable-area {
        width: 100%;
        margin-top: 1mm;
        padding: 0;
      }
    `;

    wrapper.appendChild(style);
    wrapper.appendChild(clonedContent);

    return wrapper;
  };

  const handlePrint = () => {
    const content = getPrintableHTML();
    if (!content) {
      alert("Printable area not found.");
      return;
    }

    const printFrame = document.createElement("iframe");
    printFrame.style.position = "absolute";
    printFrame.style.top = "-9999px";
    document.body.appendChild(printFrame);

    printFrame.onload = () => {
      const doc = printFrame.contentDocument;

      document
        .querySelectorAll("link[rel='stylesheet'], style")
        .forEach((node) => doc.head.appendChild(node.cloneNode(true)));

      doc.body.appendChild(content);

      setTimeout(() => {
        printFrame.contentWindow.focus();
        printFrame.contentWindow.print();
        document.body.removeChild(printFrame);
      }, 500);
    };

    printFrame.src = "about:blank";
  };

  const sendToMail = async () => {
    const content = getPrintableHTML();
    if (!content) {
      alert("Printable area not found.");
      return;
    }

    const opt = {
      margin: 0,
      filename: "quotation.pdf",
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
            "send_quotation",
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

  const tdStyle = {
    padding: 2,
    border: "1px solid #999",
    textAlign: "center",
  };
  const currentDate = new Date();

  const formattedDate = `${String(currentDate.getDate()).padStart(
    2,
    "0",
  )}/${String(currentDate.getMonth() + 1).padStart(
    2,
    "0",
  )}/${currentDate.getFullYear()}`;

  const getPrice = (item) => {
    switch (Master_data.selectPriceOption) {
      case "price_sales":
        return item.purchase_sale_price;
      case "price_wholesaler":
        return item.purchase_wholesale_price;
      case "price_distributor":
        return item.purchase_distributor_price;
      default:
        return 0;
    }
  };
  const summary = Child_data.reduce(
    (acc, item) => {
      const weight = parseFloat(item.purchase_weight) || 0;
      const qty = parseFloat(item.purchase_qty) || 0;

      acc.totalWeight += weight * qty;

      return acc;
    },
    {
      totalWeight: 0,
    },
  );
  return (
    <div>
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
          {props.status == 1 ? "Purchase Order" : "Quotation "}
        </ModalHeader>
        <div
          style={{
            width: "195mm",
            minHeight: "137mm",
            padding: "1mm",
            margin: "auto",
            border: "1px solid black",
            fontSize: 12,
          }}
          className="formss"
          id="printable-area"
        >
          {/* Header */}
          {Business && (
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                borderBottom: "2px solid #0b5394",
                paddingBottom: 2,
                marginBottom: 2,
              }}
            >
              {Business?.business_logo ? (
                <img
                  className="rounded-sqaure avatar-xl img-thumbnail user-profile-image"
                  src={`${IMG_API_URL}/business_images/${Business?.business_logo}`}
                />
              ) : (
                <img width={"100px"}></img>
              )}
              <div style={{ textAlign: "right" }}>
                <div
                  style={{
                    fontSize: 16,
                    color: "#0b5394",
                    fontWeight: "bold",
                  }}
                >
                  {Business.business_name}
                </div>
                <span
                  dangerouslySetInnerHTML={{
                    __html: Business.business_billing_address || "",
                  }}
                ></span>
                GST No: {Business.business_gst_no || ""} <br />
                Phone: {Business.business_company_phone_no || ""} <br />
                Email: {Business.business_company_email || ""}
              </div>
            </div>
          )}

          {/* Title */}
          <div
            style={{
              textAlign: "center",
              fontSize: 16,
              fontWeight: "bold",
              color: "#0b5394",
              margin: "4px 0",
              border: "1px solid #0b5394",
              padding: 5,
              borderRadius: 6,
              textTransform: "uppercase",
            }}
          >
            {props.status == 1 ? "Purchase Order" : "Quotation "}
          </div>

          {/* PO Info */}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              marginTop: 2,
              border: "1px solid #999",
              borderRadius: 4,
              padding: 6,
            }}
          >
            <div>
              <strong style={{ color: "#0b5394" }}>PO No:</strong>
              <br />
              PO-{Master_data.purchase_invoice_no}
            </div>
            <div style={{ textAlign: "right" }}>
              <strong style={{ color: "#0b5394" }}>PO Date:</strong>
              <br />
              {Master_data.purchase_start_date}
            </div>
          </div>

          {/* Billing & Shipping */}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              marginTop: 2,
              border: "1px solid #999",
              borderRadius: 4,
              padding: 6,
            }}
          >
            {/* Bill To Section */}
            <div style={{ width: "48%" }}>
              <strong style={{ color: "#0b5394" }}>Bill To:</strong>
              <br />
              {customer?.user_type == 1
                ? customer?.user_name
                : customer?.master_name}
              {customer?.master_branch_name
                ? ` - ${customer.master_branch_name}`
                : ""}
              {customer?.master_branch_code
                ? ` - ${customer.master_branch_code}`
                : ""}
              <br />
              {customer.master_address && (
                <>
                  Address: {customer.master_address}
                  {customer.master_dictrict && `, ${customer.master_dictrict}`}
                  {customer.master_taluka && `, ${customer.master_taluka}`}
                  {customer.master_city && `, ${customer.master_city}`}
                  {customer.master_state && `, ${customer.master_state}`}
                  <br /> Pincode: {customer.master_pincode}
                  <br />
                </>
              )}
              {customer.master_email && (
                <>
                  Mail: {customer.master_email}
                  <br />
                </>
              )}
              {customer.master_gst && (
                <>
                  GST No: {customer.master_gst}
                  <br />
                </>
              )}
              {(customer.user_mobile || customer.master_mobile) && (
                <>
                  Contact No: {customer.user_mobile || customer.master_mobile}
                  <br />
                </>
              )}
            </div>
            {/* Ship To Section */}
            <div style={{ width: "48%" }}>
              <strong style={{ color: "#0b5394" }}>Ship To:</strong>
              <br />

              {/* Address Line */}
              {Master_data.address_line1 && (
                <>
                  Address: {Master_data.address_line1}
                  {Master_data.address_line2 &&
                    `, ${Master_data.address_line2}`}
                  {Master_data.district && `, ${Master_data.district}`}
                  {Master_data.taluka && `, ${Master_data.taluka}`}
                  {Master_data.city && `, ${Master_data.city}`}
                  {Master_data.state && `, ${Master_data.state}`}
                  <br />
                </>
              )}

              {/* Pincode */}
              {Master_data.pincode && (
                <>
                  Pincode: {Master_data.pincode}
                  <br />
                </>
              )}
            </div>
          </div>

          {/* Item Table */}
          <div
            style={{
              border: "1px solid #999",
              padding: 8,
              marginTop: 2,
              borderRadius: 4,
            }}
          >
            <div
              style={{
                fontWeight: "bold",
                color: "#0b5394",
                marginBottom: 2,
              }}
            >
              Item Details
            </div>
            <table
              style={{
                width: "100%",
                borderCollapse: "collapse",
                marginTop: 1,
                fontSize: 13,
              }}
            >
              <thead>
                <tr>
                  {[
                    "Sr. No.",
                    "Item Description",
                    "HSN Code",
                    "Qty",
                    ...(props.status == 2
                      ? ["Rate", "Taxable Value", "GST %", "GST Value", "Total"]
                      : []),
                  ].map((head, idx) => (
                    <th
                      key={idx}
                      style={{
                        backgroundColor: "#c9daf8",
                        color: "#000",
                        padding: 2,
                        border: "1px solid #999",
                      }}
                    >
                      {head}
                    </th>
                  ))}
                </tr>
              </thead>

              <tbody>
                {Child_data.map((item, index) => {
                  const rate = getPrice(item);
                  const qty = parseInt(item.purchase_qty) || 0;
                  const taxableValue = rate * qty;
                  const gstPercent = item.tax_percentage || 0;
                  const gstValue = (taxableValue * gstPercent) / 100;
                  const total = taxableValue + gstValue;

                  return (
                    <tr key={index}>
                      {/* Serial Number */}
                      <td style={tdStyle}>{index + 1}</td>

                      {/* Product Name */}
                      <td style={tdStyle}>
                        {item.product_english_name || "-"}
                        <div style={{ fontSize: "10px", color: "#6c757d" }}>
                          <strong>Note:</strong> {item.purchase_note || "-"}
                        </div>
                      </td>

                      {/* HSN Code */}
                      <td style={tdStyle}>{item.product_hsn_code || "-"}</td>

                      {/* Quantity (always visible) */}
                      <td style={tdStyle}>
                        {qty}
                        <br />
                        Nos
                      </td>

                      {props.status == 2 && (
                        <>
                          {/* Rate */}
                          <td style={tdStyle}>
                            ₹ {rate}
                             
                          </td>

                          {/* Taxable Value */}
                          <td style={tdStyle}>{taxableValue}</td>
                          {/* GST % */}
                          <td style={tdStyle}>{gstPercent}</td>

                          {/* GST Value */}
                          <td style={tdStyle}>{gstValue?.toFixed(2)}</td>
                          {/* Total */}
                          <td style={tdStyle}>₹ {total?.toFixed(2)}</td>
                        </>
                      )}
                    </tr>
                  );
                })}
                {props.status == "2" && (
                  <tr>
                    <td colSpan={5} style={{ ...tdStyle }}>
                      Total
                    </td>
                    <td style={tdStyle}> 
                      {Child_data.reduce(
                        (sum, item) =>
                          sum + getPrice(item) * (item.purchase_qty || 0),
                        0,
                      ).toFixed(2)}
                    </td>
                    <td style={tdStyle}>-</td>
                    <td style={tdStyle}>
                      {Child_data.reduce(
                        (sum, item) =>
                          sum +
                          (getPrice(item) *
                            (item.purchase_qty || 0) *
                            (item.tax_percentage || 0)) /
                            100,
                        0,
                      ).toFixed(2)}
                    </td>
                    <td style={tdStyle}>₹{" "} 
                      {Child_data.reduce((sum, item) => {
                        const rate = getPrice(item);
                        const qty = item.purchase_qty || 0;
                        const taxableValue = rate * qty;
                        const gstPercent = item.tax_percentage || 0;
                        const gstValue = (taxableValue * gstPercent) / 100;
                        return sum + taxableValue + gstValue;
                      }, 0).toFixed(2)}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          {props.status == "2" && (
            <div
              style={{
                display: "flex",
                border: "1px solid #999",
                marginTop: "2px",
                borderRadius: "5px",
              }}
            >
              <div style={{ flex: 1, padding: 2, fontSize: 11 }}>
                <table style={{ width: "100%", borderCollapse: "collapse" }}>
                  <tbody>
                    {/* Header Row */}
                    <tr style={{ fontWeight: "bold" }}>
                      <td
                        style={{ padding: 1, borderBottom: "1px solid #ccc" }}
                      >
                        Taxable
                      </td>
                      <td
                        style={{ padding: 1, borderBottom: "1px solid #ccc" }}
                      >
                        SGST %
                      </td>
                      <td
                        style={{ padding: 1, borderBottom: "1px solid #ccc" }}
                      >
                        Amt.
                      </td>
                      <td
                        style={{ padding: 1, borderBottom: "1px solid #ccc" }}
                      >
                        CGST %
                      </td>
                      <td
                        style={{ padding: 1, borderBottom: "1px solid #ccc" }}
                      >
                        Amt.
                      </td>
                      <td
                        style={{ padding: 1, borderBottom: "1px solid #ccc" }}
                      >
                        IGST %
                      </td>
                      <td
                        style={{ padding: 1, borderBottom: "1px solid #ccc" }}
                      >
                        Amt.
                      </td>
                    </tr>

                    {/* Group Child_data by HSN */}
                    {Object.entries(
                      Child_data.reduce((acc, item) => {
                        const hsn = item.product_hsn_code || "No HSN";
                        if (!acc[hsn]) acc[hsn] = [];
                        acc[hsn].push(item);
                        return acc;
                      }, {}),
                    ).map(([hsn, items], index) => {
                      // Calculate totals per HSN
                      const totalTaxable = items.reduce(
                        (sum, item) =>
                          sum + getPrice(item) * (item.purchase_qty || 0),
                        0,
                      );

                      const gstPercent = items[0].tax_percentage || 0;
                      const isMH = Master_data?.state == "Maharashtra";

                      const sgstPercent = isMH ? gstPercent / 2 : 0;
                      const cgstPercent = isMH ? gstPercent / 2 : 0;
                      const igstPercent = isMH ? 0 : gstPercent;

                      const sgstAmt = (totalTaxable * sgstPercent) / 100;
                      const cgstAmt = (totalTaxable * cgstPercent) / 100;
                      const igstAmt = (totalTaxable * igstPercent) / 100;

                      return (
                        <React.Fragment key={index}>
                          {/* HSN header row */}
                          <tr
                            style={{
                              background: "#f0f0f0",
                              fontWeight: "bold",
                            }}
                          >
                            <td colSpan={7} style={{ padding: 1 }}>
                              HSN Code: {hsn}
                            </td>
                          </tr>

                          {/* HSN GST row */}
                          <tr>
                            <td style={{ padding: 1 }}>
                              {totalTaxable.toFixed(2)}
                            </td>

                            {/* SGST */}
                            <td style={{ padding: 1 }}>
                              {isMH ? sgstPercent.toFixed(2) + " %" : "-"}
                            </td>
                            <td style={{ padding: 1 }}>
                              {isMH ? sgstAmt.toFixed(2) : "-"}
                            </td>

                            {/* CGST */}
                            <td style={{ padding: 1 }}>
                              {isMH ? cgstPercent.toFixed(2) + " %" : "-"}
                            </td>
                            <td style={{ padding: 1 }}>
                              {isMH ? cgstAmt.toFixed(2) : "-"}
                            </td>

                            {/* IGST */}
                            <td style={{ padding: 1 }}>
                              {!isMH ? igstPercent.toFixed(2) + " %" : "-"}
                            </td>
                            <td style={{ padding: 1 }}>
                              {!isMH ? igstAmt.toFixed(2) : "-"}
                            </td>
                          </tr>
                        </React.Fragment>
                      );
                    })}

                    {/* Grand Total Row */}
                    <tr
                      style={{
                        fontWeight: "bold",
                        borderTop: "1px solid #999",
                      }}
                    >
                      <td style={{ padding: 1 }}>
                        {Child_data.reduce(
                          (sum, item) =>
                            sum + getPrice(item) * (item.purchase_qty || 0),
                          0,
                        ).toFixed(2)}
                      </td>

                      <td style={{ padding: 1 }}>-</td>

                      <td style={{ padding: 1 }}>
                        {Child_data.reduce((sum, item) => {
                          const taxable =
                            getPrice(item) * (item.purchase_qty || 0);
                          const gstPercent = item.tax_percentage || 0;
                          return (
                            sum +
                            (Master_data?.state == "Maharashtra"
                              ? (taxable * (gstPercent / 2)) / 100
                              : 0)
                          );
                        }, 0).toFixed(2)}
                      </td>

                      <td style={{ padding: 1 }}>-</td>

                      <td style={{ padding: 1 }}>
                        {Child_data.reduce((sum, item) => {
                          const taxable =
                            getPrice(item) * (item.purchase_qty || 0);
                          const gstPercent = item.tax_percentage || 0;
                          return (
                            sum +
                            (Master_data?.state == "Maharashtra"
                              ? (taxable * (gstPercent / 2)) / 100
                              : 0)
                          );
                        }, 0).toFixed(2)}
                      </td>

                      <td style={{ padding: 1 }}>-</td>

                      <td style={{ padding: 1 }}>
                        {Child_data.reduce((sum, item) => {
                          const taxable =
                            getPrice(item) * (item.purchase_qty || 0);
                          const gstPercent = item.tax_percentage || 0;
                          return (
                            sum +
                            (Master_data?.state != "Maharashtra"
                              ? (taxable * gstPercent) / 100
                              : 0)
                          );
                        }, 0).toFixed(2)}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* Total Amount Summary */}
              <div
                style={{
                  width: 250,
                  padding: 2,
                  fontSize: 12,
                  borderLeft: "1px solid #999",
                }}
              >
                {(() => {
                  // Calculate totals from Child_data
                  const totalBeforeTax = Child_data.reduce(
                    (sum, item) =>
                      sum + getPrice(item) * (item.purchase_qty || 0),
                    0,
                  );

                  const totalGST = Child_data.reduce((sum, item) => {
                    const taxableValue =
                      getPrice(item) * (item.purchase_qty || 0);
                    return (
                      sum + (taxableValue * (item.tax_percentage || 0)) / 100
                    );
                  }, 0);

                  // Split GST into SGST + CGST (half-half) for intra-state (Maharashtra)
                  const sgst =
                    Master_data?.state == "Maharashtra"
                      ? totalGST / 2
                      : 0;
                  const cgst =
                    Master_data?.state == "Maharashtra"
                      ? totalGST / 2
                      : 0;
                  const igst =
                    Master_data?.state != "Maharashtra" ? totalGST : 0;

                  const grandTotal = totalBeforeTax + sgst + cgst + igst;

                  return (
                    <>
                      {/* Total Before Tax */}
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          marginBottom: 3,
                          padding: "2px 0",
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
                          marginBottom: 3,
                          padding: "2px 0",
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
                          marginBottom: 3,
                          padding: "2px 0",
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
                          marginBottom: 3,
                          padding: "2px 0",
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
                          marginTop: 3,
                          borderTop: "1px solid #999",
                          padding: "4px 0",
                          fontWeight: "bold",
                        }}
                      >
                        <span>Total Amount</span>
                        <span>{grandTotal.toFixed(2)}</span>
                      </div>
                    </>
                  );
                })()}
              </div>
            </div>
          )}
          {props.status != "1" && (
            <div
              style={{
                padding: 12,
                fontSize: 13,
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
                    Child_data.reduce((sum, item) => {
                      const rate = getPrice(item);
                      const qty = item.purchase_qty || 0;
                      const taxableValue = rate * qty;
                      const gstPercent = item.tax_percentage || 0;
                      const gstValue = (taxableValue * gstPercent) / 100;
                      return sum + taxableValue;
                    }, 0).toFixed(2),
                  )}
                </span>
              </div>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  marginBottom: 2,
                }}
              >
                <span style={{ fontWeight: "bold" }}>
                  Total Tax Amount : GST
                </span>
                <span style={{ fontWeight: "bold" }}>
                  {Child_data.reduce(
                    (sum, item) =>
                      sum +
                      (getPrice(item) *
                        (item.purchase_qty || 0) *
                        (item.tax_percentage || 0)) /
                        100,
                    0,
                  ).toFixed(2)}
                </span>
              </div>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  marginBottom: 2,
                }}
              >
                <span style={{ fontWeight: "bold" }}>
                  Other Charges{" "}
                  {Master_data?.other_charges_name &&
                    `: ${Master_data.other_charges_name}`}
                </span>
                <span style={{ fontWeight: "bold" }}>
                  {Master_data.other_charge_amount}
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
                  Transport Charge{" "}
                  {Master_data?.transport_types_type &&
                    `: ${Master_data.transport_types_type} `}
                  {summary.totalWeight < 1000
                    ? ` (${summary.totalWeight} gm)`
                    : ` (${(summary.totalWeight / 1000).toFixed(2)} kg)`}
                </span>

                <span style={{ fontWeight: "bold" }}>
                  {" "}
                  {Number(
                    Master_data?.transport_types_total_charge || 0,
                  ).toFixed(2)}
                </span>
              </div>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  borderTop: "1px solid #ccc",
                  paddingTop: 3,
                }}
              >
                <span style={{ fontWeight: "bold", fontSize: 13 }}>
                  Total Payable Amount After Tax 
                </span>
                <span style={{ fontWeight: "bold", fontSize: 13 }}>₹{" "} 
                  {parseFloat(
                    Child_data.reduce((sum, item) => {
                      const rate = getPrice(item);
                      const qty = item.purchase_qty || 0;
                      const taxableValue = rate * qty;
                      const gstPercent = item.tax_percentage || 0;
                      const gstValue = (taxableValue * gstPercent) / 100;
                      return sum + taxableValue + gstValue;
                    }, 0).toFixed(2),
                  ) +
                    (isNaN(Master_data.other_charge_amount)
                      ? 0
                      : parseFloat(Master_data.other_charge_amount)) +
                    (isNaN(Master_data.transport_types_total_charge)
                      ? 0
                      : parseFloat(Master_data.transport_types_total_charge))}
                </span>
              </div>
            </div>
          )}
          <div
            style={{
              border: "1px solid #999",
              padding: 5,
              marginTop: 2,
              borderRadius: 4,
              fontWeight: "bold",
            }}
          >
            <strong style={{ color: "#0b5394" }}>Note:</strong>
            <br />
            <div
              dangerouslySetInnerHTML={{
                __html: Master_data.purchase_notes || "",
              }}
            ></div>
          </div>
          {/* Total */}
          {/* <div
              style={{
                border: "1px solid #999",
                padding: 10,
                marginTop: 15,
                borderRadius: 4,
                textAlign: "right",
                fontWeight: "bold",
              }}
            >
              Total Quantity: {Master_data.purchase_total_qty || ""}
            </div> */}

          {/* Terms */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              border: "1px solid #999",
            }}
          >
            <div
              style={{
                width: "75%",

                padding: 5,
                marginTop: 4,
                borderRadius: 4,
                fontSize: 12,
                lineHeight: 1.6,
              }}
            >
              <strong style={{ color: "#0b5394" }}>Terms & Conditions: </strong>
              <div
                dangerouslySetInnerHTML={{
                  __html:
                    props.status == "1"
                      ? Business.business_terms_purchase_order
                      : Business.business_terms_quotation,
                }}
              ></div>
            </div>

            {/* Signature */}
            <div
              style={{
                width: "23%",
                padding: 5,
                marginTop: 10,
                borderRadius: 4,
                textAlign: "right",
                fontWeight: "bold",
              }}
            >
              <p style={{ margin: "4px 0" }}>Authorized Signatory</p>
              {!Business?.business_signature ? (
                <div style={{ height: 40, margin: "30px 0" }} />
              ) : (
                <img
                  className="rounded-sqaure avatar-xl img-thumbnail user-profile-image"
                  src={`${IMG_API_URL}/business_images/${Business?.business_signature}`}
                />
              )}
              <div>Designation</div>
            </div>
          </div>
        </div>
        <div style={{
          textAlign:"right",
          fontSize:10,
          fontStyle:"italic",
          paddingRight:"10px"
        }}>
          
          <i> {Master_data.full_name && `${props.status == 1 ? 'Purchase Order' : 'Quotation'} Created By ${Master_data.full_name}`}</i>

        </div>
        <div className="hstack gap-2 justify-content-center my-2">
          <button
            type="button"
            onClick={props.togg_large}
            className="btn btn-danger"
          >
            <i className="ri-close-line me-1 align-middle" />
            Close
          </button>
          <button
            type="button"
            className="btn btn-primary"
            onClick={handlePrint}
          >
            <i className="ri-printer-line me-1 align-middle"></i>
            Print
          </button>
          <button type="button" className="btn btn-info" onClick={sendToMail}>
            <i className="ri-printer-line me-1 align-middle"></i>
            Send To Mail
          </button>
        </div>
      </Modal>
    </div>
  );
};

export default PrintModal;
