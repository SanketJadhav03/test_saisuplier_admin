import React, { useEffect, useState } from "react";
import { Modal, ModalBody, ModalHeader, Button, ModalFooter } from "reactstrap";
import AuthUser from "../../helpers/Authuser";
import Select from "react-select";
import { Weight } from "lucide-react";
import ShippingModal from "./ShippingModal";
const LabelPrint = (props) => {
  const { http } = AuthUser();
  const [childData, setChildData] = useState([]);
  const [masterData, setMasterData] = useState({});
  const [businessData, setBusinessData] = useState({});
  const [customer, setCustomer] = useState({});
  const [orientation, setOrientation] = useState("vertical"); // vertical | landscape
  const [users, setUsers] = useState([]);
  const [hasMoreUsers, setHasMoreUsers] = useState(true);
  const [addresses, setAddress] = useState([]);
  const [shippingCount, setShippingCount] = useState(1);
  const [shippingModal, setShippingModal] = useState(false);
  const [selectedAddressOption, setSelectedAddressOption] = useState(null);

  useEffect(() => {
    if (!props.isOpen) return;

    const fetchInvoice = async () => {
      try {
        const response = await http.get(`/sale/invoice/${props.id}`);
        const data = response.data;

        if (data) {
          setChildData(data.Child || []);
          setCustomer(data.customer || {});
          setBusinessData(data.Business?.[0] || {});
          setMasterData(data.Master?.[0] || {});
        }
      } catch (error) {
        console.log("Error fetching data:", error);
      }
    };

    const fetchAddresses = async () => {
      try {
        const response = await http.get(`/addresses/${props?.user?.user_id}`);
        const fetched = response.data || [];
        setAddress(fetched);
        if (fetched.length > 0) {
          const newest = fetched[fetched.length - 1]; // Assuming newest is last
          const option = {
            item: newest,
            value: newest.shipping_id,
            label: `${newest?.address_line1 || ""}, ${newest.city} - ${newest?.pincode || ""} - ${newest.addressType}`,
          };
          setUsers(newest); // Updates the label preview
          setSelectedAddressOption(option); // Updates the dropdown UI
        }

        // console.log(fetched);
        setCustomer(props.user);
      } catch (err) {
        console.error("Failed to fetch users", err);
        setHasMoreUsers(false);
      }
    };

    if (props.id) {
      fetchInvoice();
    } else {
      fetchAddresses();
    }
  }, [props.id, props.user?.master_id, props.isOpen, shippingCount]);

  const stripHtml = (html = "") => {
    const temp = document.createElement("div");
    temp.innerHTML = html;
    return temp.textContent || temp.innerText || "";
  };

  function amountToWords(num) {
    if (num === null || num === undefined || num === "") return "";

    num = Number(num);

    if (isNaN(num)) return "";

    const a = [
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
    ];

    const b = [
      "",
      "",
      "Twenty",
      "Thirty",
      "Forty",
      "Fifty",
      "Sixty",
      "Seventy",
      "Eighty",
      "Ninety",
    ];

    // Convert integer part to words
    const convert = (n) => {
      if (n === 0) return "Zero";

      if (n < 20) return a[n];

      if (n < 100)
        return b[Math.floor(n / 10)] + (n % 10 ? " " + a[n % 10] : "");

      if (n < 1000)
        return (
          a[Math.floor(n / 100)] +
          " Hundred " +
          (n % 100 ? convert(n % 100) : "")
        );

      if (n < 100000)
        return (
          convert(Math.floor(n / 1000)) +
          " Thousand " +
          (n % 1000 ? convert(n % 1000) : "")
        );

      if (n < 10000000)
        return (
          convert(Math.floor(n / 100000)) +
          " Lakh " +
          (n % 100000 ? convert(n % 100000) : "")
        );

      return (
        convert(Math.floor(n / 10000000)) +
        " Crore " +
        (n % 10000000 ? convert(n % 10000000) : "")
      );
    };

    // Split rupees & paise
    const [rupees, paise] = num.toFixed(2).split(".");

    let result = convert(parseInt(rupees)) + " Rupees";

    if (parseInt(paise) > 0) {
      result += " and " + convert(parseInt(paise)) + " Paise";
    }

    return result + " Only";
  }

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

  const calculateCodAmount = (items, masterData) => {
    const itemsTotal = items.reduce((sum, item) => {
      const rate = getPrice(item);
      const qty = item.pos_qty || 0;

      const taxableValue = rate * qty;
      const gstPercent = item.tax_percentage || 0;
      const gstValue = (taxableValue * gstPercent) / 100;

      return sum + taxableValue + gstValue;
    }, 0);

    const otherCharges = parseFloat(masterData?.other_charge_amount || 0);
    const transportCharges = parseFloat(
      masterData?.transport_types_total_charge || 0,
    );

    const total =
      parseFloat(itemsTotal.toFixed(2)) + otherCharges + transportCharges;

    return Math.ceil(total);
  };

  const codamount = calculateCodAmount(childData, masterData);
  const amountinwords = amountToWords(codamount);
  const handlePrint = () => {
    const printContent = document.getElementById("label-print-area").innerHTML;
    const printWindow = window.open("", "_blank", "width=600,height=800");

    // label print style for printing
    const pageStyle = `
      @page { 
  size: ${
    props.id
      ? "100mm 150mm"
      : orientation === "vertical"
        ? "75mm 100mm"
        : "100mm 75mm"
  }; 
  margin: 0; 
}
      body { 
        margin: 0; 
        padding: 0; 
        background: white !important;
      }
      .label-box { 
        width: ${props.id ? "100mm" : (orientation=='vertical'?"75mm":"100mm")};                                                                                                                                                                                                                                                                                                                                             
        height: ${props.id ? "150mm" : (orientation=='vertical'?"100mm":"75mm")};
        padding: 10px;
        box-sizing: border-box;
        background: white;
        font-family: Arial, sans-serif;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        gap: 15px;
        font-size: 12px;
        line-height: 1.2;
        border:2px black solid;
      }
        .hrline {
      width: 100%;
      margin: 0 !important;
      padding: 0 !important;
     
     border-top: 2px solid #000000;  
   
  }
      .codbox{
        width: ${orientation === "vertical" ? "120px" : "90px"}; 
        height: ${orientation === "vertical" ? "80px" : "60px"}; 
    } 
        
    .nonbanpl{
        display:flex;
        flex-direction:column;
        justify-content: space-between;
    }
      .flex-row {
        display: flex;
      }
      
      .flex-gap-1 {
        gap: 4px;
      }
      
      .flex-gap-2 {
        gap: 15px;
      }
      
      .transportbox {
        margin-bottom: 2px;
         
        font-size: 14px;
        text-align: center;
        padding: 2px;
      }
      
      .to {
        font-size: 11px;
        margin-bottom: 2px;
        font-weight: bold;
      }
      
      .bank-name {
        font-weight: 600;
        font-size: 18px;
        text-transform: uppercase;
        line-height: 1;
        margin-bottom: 3px;
      }
      
      .address, .meta {
        margin-bottom: 2px;
        font-size: 14px;
      }
       .address-customer,.meta-customer{
       margin-bottom: 4px;
       font-size: 13px;
       word-break: break-word;
       overflow-wrap: break-word;
       inline-size: 100%;
       }
      
      .from-title {
        margin-top: 8px;
        font-weight: bold;
        font-size: 11px;
      }
      
      .from-company {
        font-weight: bold;
        font-size: 15px;
        margin-bottom: 2px;
      }
        .from-company-customer {
        font-weight: bold;
        font-size: 17px;
        margin-bottom: 3px;
      }
      
      .from-details {
        font-size: 13px;
        line-height: 1.2;
      }
        .from-details-customer {
        font-size: 14px;
        line-height: 1.2;
      }
      
      .label-print-content {
        display: flex;
        justify-content: center;
        align-items: center;
        min-height: 100vh;
        background: white !important;
      }
    `;

    printWindow.document.open();
    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Print Label</title>
        

          <style>
            ${pageStyle}
            
            @media print {
              body {
                background: white !important;
                margin: 0 !important;
                padding: 0 !important;
              }
              .label-print-content {
                display: flex !important;
                justify-content: center !important;
                align-items: center !important;
                min-height: 100vh !important;
                background: white !important;
              }
              .label-box {
                box-shadow: none !important;
                margin: 0 !important;
              }
               
        .codamount{
                fontSize: "16px",
                fontWeight: "bold",
                backgroundColor: "#000",
                color: "#fff",
                padding: "3px 8px",
                borderRadius: "4px",
                display: "inline-block",
                letterSpacing: "0.5px",
        }
                
            }
          </style>
        </head>
        <body>
          <div class="label-print-content">
            ${printContent}
          </div>
          <script>
            // Auto print and close
            window.onload = function() {
              setTimeout(function() {
                window.focus();
                window.print();
                setTimeout(function() {
                  window.close();
                }, 100);
              }, 250);
            };
          </script>
        </body>
      </html>
    `);

    printWindow.document.close();
  };

  return (
    //     <>
    //       <style>
    //         {`
    //         .label-page {
    //           display: flex;
    //           justify-content: center;
    //           align-items: center;
    //           background: #f5f5f5;
    //           min-height: 400px;
    //           padding: 20px;

    //         }

    //         .label-box {
    //           background: white;
    //           padding: 7px;
    //           box-sizing: border-box;
    //           font-family: Arial, sans-serif;
    //           display: flex;
    //           flex-direction: column;
    //           justify-content: space-between;
    //           font-size: 12px;
    //           line-height: 1.2;
    //           border:2px black solid;
    //           box-shadow: 0 2px 10px rgba(0,0,0,0.1);
    //         }

    //         .label-vertical {
    //           width: 75mm;
    //           height: 100mm;
    //         }

    //         .label-landscape {
    //           width: 100mm;
    //           height: 75mm;
    //         }

    //         .hrline {
    //     width: 100%;
    //  margin: 0 !important;
    //   padding: 0 !important;
    //   border: none;
    //   border-top: 2px solid #ccc; /* optional */

    //   }
    //         .to {
    //           font-size: 11px;
    //           margin-bottom: 4px;
    //           font-weight: bold;
    //         }

    //         .bank-name {
    //           font-weight: 800;
    //           font-size: 16px;
    //           text-transform: uppercase;
    //           line-height: 1;
    //           margin-bottom: 6px;
    //         }

    //         .address, .meta {
    //           margin-bottom: 3px;
    //           font-size: 10px;
    //         }

    //         .from-title {
    //           margin-top: 8px;
    //           font-weight: bold;
    //           font-size: 11px;
    //         }

    //         .from-company {
    //           font-weight: bold;
    //           font-size: 11px;
    //           margin-bottom: 3px;
    //         }

    //         .from-details {
    //           font-size: 10px;
    //           line-height: 1.2;
    //         }

    //         .print-controls {
    //           display: flex;
    //           justify-content: center;
    //           align-items: center;
    //           gap: 10px;
    //           flex-wrap: wrap;
    //         }

    //         /* Flex utilities */
    //         .flex-row {
    //           display: flex;
    //         }

    //         .flex-gap-1 {
    //           gap: 4px;
    //         }

    //         .flex-gap-2 {
    //           gap: 15px;
    //         }

    //         .margin-end-2 {
    //           margin-right: 8px;
    //         }

    //         .margin-start-2 {
    //           margin-left: 8px;
    //         }

    //         @media print {
    //           .modal-backdrop, .modal, .modal-header, .modal-footer,
    //           .modal-dialog, .modal-content, .modal-body {
    //             display: none !important;
    //           }
    //           body, html {
    //             background: white !important;
    //             margin: 0 !important;
    //             padding: 0 !important;
    //           }

    //         }
    //         `}
    //       </style>

    //       <Modal isOpen={props.isOpen} toggle={props.toggle} size="lg" centered>
    //         <ModalHeader toggle={props.toggle}>
    //           {props.id ? (
    //             <div className="fw-semibold fs-4 text-dark"> Print Label</div>
    //           ) : (
    //             <div
    //               className="d-flex justify-content-between align-items-center w-100 p-3 rounded shadow-sm bg-light"
    //               style={{ gap: "12px", width: "100%" }}
    //             >
    //               {/* Title */}
    //               <div className="fw-semibold fs-4 text-dark"> Print Label</div>

    //               {/* Select Box */}
    //               <div
    //                 style={{ minWidth: "260px", maxWidth: "350px", width: "100%" }}
    //               >
    //                 <Select
    //                   options={addresses.map((item) => ({
    //                     item: item,
    //                     value: item.shipping_id,
    //                     label: `${item?.address_line1 || ""}, ${item.city} - ${item?.pincode || ""} - ${item.addressType}`,
    //                   }))}
    //                   placeholder="Select Shipping Address..."
    //                   onChange={(option) => {
    //                     setUsers(option.item);
    //                   }}
    //                   styles={{
    //                     control: (base) => ({
    //                       ...base,
    //                       minHeight: "38px",
    //                       borderRadius: "8px",
    //                       boxShadow: "none",
    //                     }),
    //                     menu: (base) => ({
    //                       ...base,
    //                       zIndex: 9999,
    //                     }),
    //                   }}
    //                 />
    //               </div>
    //             </div>
    //           )}
    //         </ModalHeader>

    //         <ModalBody>
    //           {props.id ? (
    //             <div className="label-page">
    //               <div id="label-print-area">
    //                 <div
    //                   className={`label-box ${
    //                     orientation === "vertical"
    //                       ? "label-vertical"
    //                       : "label-landscape"
    //                   }`}
    //                 >
    //                   {masterData.master_payment_mode_id == 1 && (
    //                     <>
    //                       <div
    //                         style={{
    //                           display: "flex",
    //                           justifyContent: "space-between",
    //                           alignItems: "flex-start",
    //                           gap: "2px",
    //                           width: "100%",
    //                         }}
    //                       >
    //                         {/* LEFT SIDE */}
    //                         <div
    //                           style={{ display: "flex", flexDirection: "column" }}
    //                         >
    //                           {/* Transport */}
    //                           <div
    //                             id="transportbox"
    //                             style={{
    //                               marginBottom: "5px",
    //                               fontWeight: "bold",
    //                               fontSize: "14px",
    //                               textAlign: "center",
    //                             }}
    //                           >
    //                             Transport Type:{" "}
    //                             {masterData.transport_types_type || "N/A"}
    //                           </div>

    //                           {/* Order ID */}
    //                           <div
    //                             style={{
    //                               border: "1px solid #000",
    //                               padding: "2px 4px",
    //                               display: "inline-block",
    //                               backgroundColor: "#fff",
    //                               whiteSpace: "nowrap",
    //                               marginTop: "4px",
    //                               textAlign: "center",
    //                             }}
    //                           >
    //                             <div
    //                               style={{
    //                                 fontWeight: "bold",
    //                                 fontSize: "12px",
    //                               }}
    //                             >
    //                               Order ID:{" "}
    //                               {"" + masterData.master_invoice_no || ""}
    //                             </div>
    //                           </div>
    //                           <div className="mt-2" style={{ fontSize: "13px" }}>
    //                             NON-BANPL A/C No: <b>1000059729</b>
    //                           </div>
    //                         </div>

    //                         {/* RIGHT SIDE */}
    //                         <div
    //                           style={{
    //                             display: "flex",
    //                             flexDirection: "column",
    //                             alignItems: "center",
    //                             gap: "4px",
    //                           }}
    //                         >
    //                           {/* COD BOX */}
    //                           <div
    //                             style={
    //                               orientation === "landscape"
    //                                 ? {
    //                                     border: "2px solid #000",
    //                                     textAlign: "center",
    //                                     minWidth: "110px",
    //                                     minHeight: "60px",
    //                                     backgroundColor: "#fff",
    //                                     padding: "2px",
    //                                   }
    //                                 : {
    //                                     border: "2px solid #000",
    //                                     textAlign: "center",
    //                                     minWidth: "70px",
    //                                     minHeight: "40px",
    //                                     backgroundColor: "#fff",
    //                                     //paddingTop: "10px",
    //                                   }
    //                             }
    //                           >
    //                             <div
    //                               style={{
    //                                 textAlign: "center",
    //                                 fontWeight: "bold",
    //                                 fontSize: "13px",
    //                                 //marginBottom: "3px",
    //                               }}
    //                             >
    //                               COD{" "}
    //                             </div>
    //                             <div
    //                               style={{ fontSize: "15px", fontWeight: "bold" }}
    //                             >
    //                               {" "}
    //                               ₹{" "}
    //                               {(
    //                                 parseFloat(
    //                                   childData
    //                                     .reduce((sum, item) => {
    //                                       const rate = getPrice(item);
    //                                       const qty = item.pos_qty || 0;
    //                                       const taxableValue = rate * qty;
    //                                       const gstPercent =
    //                                         item.tax_percentage || 0;
    //                                       const gstValue =
    //                                         (taxableValue * gstPercent) / 100;
    //                                       return sum + taxableValue + gstValue;
    //                                     }, 0)
    //                                     .toFixed(2),
    //                                 ) +
    //                                 parseFloat(masterData.other_charge_amount) +
    //                                 parseFloat(
    //                                   masterData?.transport_types_total_charge || 0,
    //                                 )
    //                               )?.toFixed(2)}{" "}
    //                             </div>
    //                           </div>

    //                           {/* BANK / CONTRACT INFO */}
    //                           <div
    //                             style={{
    //                               fontSize: "10px",
    //                               textAlign: "center",
    //                               lineHeight: "1.2",
    //                               marginTop: "2px",
    //                             }}
    //                           >
    //                             <div style={{ fontSize: "13px" }}>
    //                               CONTRACT ID: <b>40098702</b>
    //                             </div>
    //                           </div>
    //                         </div>
    //                       </div>

    //                       {/* Divider */}
    //                       <div className="hrline"></div>
    //                     </>
    //                   )}

    //                   <div>
    //                     <div className="to">To,</div>
    //                     <div className="bank-name">
    //                       {customer?.user_type == 1
    //                         ? customer?.user_name
    //                         : customer?.master_name}
    //                       {customer?.master_branch_name
    //                         ? ` - ${customer.master_branch_name}`
    //                         : ""}
    //                       {customer?.master_branch_code
    //                         ? ` - ${customer.master_branch_code}`
    //                         : ""}
    //                     </div>

    //                     <div className="address">
    //                       {masterData.master_address1 && (
    //                         <>
    //                           {masterData.master_address1}
    //                           <br />
    //                           {masterData.master_taluka &&
    //                             `Tq. ${masterData.master_taluka}`}
    //                           {masterData.master_district &&
    //                             ` Dist. ${masterData.master_district}`}
    //                           {masterData.master_city &&
    //                             `, ${masterData.master_city}`}
    //                           {masterData.master_state &&
    //                             `, ${masterData.master_state}`}
    //                         </>
    //                       )}
    //                     </div>
    //                     {orientation === "landscape" ? (
    //                       <div className="d-flex">
    //                         <div className="meta">
    //                           <b>PIN Code:</b> {masterData.master_pincode || "N/A"}
    //                         </div>
    //                         <div className="meta">
    //                           <b>Phone:</b> {customer.user_mobile}
    //                           {customer.master_mobile &&
    //                             `, ${customer.master_mobile}`}
    //                         </div>
    //                         <div className="meta">
    //                           <b>E-Mail:</b> {customer.user_email || "N/A"}
    //                         </div>
    //                       </div>
    //                     ) : (
    //                       <div>
    //                         <div className="meta">
    //                           <b>PIN Code:</b> {masterData.master_pincode || "N/A"}
    //                         </div>
    //                         <div className="meta">
    //                           <b>Phone:</b> {customer.user_mobile}
    //                           {customer.master_mobile &&
    //                             `, ${customer.master_mobile}`}
    //                         </div>
    //                         <div className="meta">
    //                           <b>E-Mail:</b> {customer.user_email || "N/A"}
    //                         </div>
    //                       </div>
    //                     )}
    //                   </div>

    //                   <div>
    //                     <div className="to">From,</div>
    //                     <div className="from-company">Sai Suppliers (25-26)</div>
    //                     <div className="from-details">
    //                       265 Kasba Peth Shankar Market Road, Phaltan Tal Satara
    //                       415523 <br />
    //                       Contact : 9226439223 <br />
    //                     </div>
    //                   </div>
    //                 </div>
    //               </div>
    //             </div>
    //           ) : (
    //             <div className="label-page">
    //               <div id="label-print-area">
    //                 <div
    //                   className={`label-box ${
    //                     orientation === "vertical"
    //                       ? "label-vertical"
    //                       : "label-landscape"
    //                   }`}
    //                 >
    //                   <div>
    //                     <div className="to">To,</div>
    //                     <div className="bank-name">
    //                       {customer?.user_type == 1
    //                         ? customer?.user_name
    //                         : customer?.master_name}
    //                       {customer?.master_branch_name
    //                         ? ` - ${customer.master_branch_name}`
    //                         : ""}
    //                       {customer?.master_branch_code
    //                         ? ` - ${customer.master_branch_code}`
    //                         : ""}
    //                     </div>

    //                     <div className="address">
    //                       {users?.address_line1 || "" && (
    //                         <>
    //                           {users?.address_line1 || ""}
    //                           <br />
    //                           {users.taluka && `Tq. ${users.taluka}`}
    //                           {users.district && ` Dist. ${users.district}`}
    //                           {users.city && `, ${users.city}`}
    //                           {users.state && `, ${users.state}`}
    //                         </>
    //                       )}
    //                     </div>

    //                     <div className="meta">
    //                       <b>PIN Code:</b> {users?.pincode || "" || "N/A"}
    //                     </div>
    //                     <div className="meta">
    //                       <b>Phone:</b> {customer.user_mobile}
    //                       {customer.master_mobile && `, ${customer.master_mobile}`}
    //                     </div>
    //                     <div className="meta">
    //                       <b>E-Mail:</b> {customer.user_email || "N/A"}
    //                     </div>
    //                   </div>

    //                   <div>
    //                     <div className="to">From,</div>
    //                     <div className="from-company">Sai Suppliers (25-26)</div>
    //                     <div className="from-details">
    //                       265 Kasba Peth Shankar Market Road, Phaltan Tal Satara
    //                       415523 <br />
    //                       Contact : 9226439223 <br />
    //                     </div>
    //                   </div>
    //                 </div>
    //               </div>
    //             </div>
    //           )}
    //         </ModalBody>

    //         <ModalFooter>
    //           <div className="print-controls">
    //             <div className="orientation-buttons">
    //               <button
    //                 type="button"
    //                 className={`btn btn-sm margin-end-2  ${
    //                   orientation === "vertical"
    //                     ? "btn-success"
    //                     : "btn-outline-success"
    //                 }`}
    //                 onClick={() => setOrientation("vertical")}
    //               >
    //                 Vertical
    //               </button>
    //               <button
    //                 type="button"
    //                 className={`btn btn-sm ${
    //                   orientation === "landscape"
    //                     ? "btn-success"
    //                     : "btn-outline-success"
    //                 }`}
    //                 onClick={() => setOrientation("landscape")}
    //               >
    //                 Landscape
    //               </button>
    //             </div>

    //             <Button color="primary" className="ms-2" onClick={handlePrint}>
    //               <i className="ri-printer-line"></i> Print Label
    //             </Button>
    //           </div>
    //         </ModalFooter>
    //       </Modal>
    //     </>
    <>
      <style>
        {`
        .label-page {
          display: flex;
          justify-content: center;
          align-items: center;
          background: #f5f5f5;
          min-height: 400px;
          padding: 20px;
          
        }

        .label-box {
          background: white;
          padding: 7px;
          box-sizing: border-box;
          font-family: Arial, sans-serif;
          display: flex;
          flex-direction: column;
          justify-content:flex-start;
          font-size: 12px;
          gap: 15px;
          line-height: 1.2;
          border:2px black solid;
          box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        }

        .label-vertical {
          width: 75mm;
          height: 100mm;
        }
          .label-landscape {
          width: 100mm;
          height: 75mm;
        }

        .label-vertical-invoice {
          width: 100mm;
          height: 150mm;
        }
        
        

        .hrline {
    width: 100%;
      margin: 0 !important;
      padding: 0 !important;
     
     border-top: 3px solid #000000; /* optional */
   
  }
        .to {
          font-size: 11px;
          margin-bottom: 4px;
          font-weight: bold;
        }

        .bank-name {
          font-weight: 800;
          font-size: 18px;
          text-transform: uppercase;
          line-height: 1;
          margin-bottom: 4px;
        }

        .address, .meta {
          margin-bottom: 3px;
          font-size: 15px;
        }

        .address-customer,.meta-customer{
       margin-bottom: 4px;
       font-size: 13px;
       word-break: break-word;
       overflow-wrap: break-word;
       inline-size: 100%;
       }

        .from-title {
          margin-top: 8px;
          font-weight: bold;
          font-size: 11px;
        }

        .from-company {
          font-weight: bold;
          font-size: 16px;
          margin-bottom: 2px;
        }
       .from-company-customer {
        font-weight: bold;
        font-size: 17px;
        margin-bottom: 3px;
      }

        .from-details {
          font-size: 14px;
          line-height: 1.2;
        }
          .from-details-customer {
         font-size:${orientation == "landscape" ? "13px" : "15px"}
        line-height: 1.2;
      }

        .print-controls {
          display: flex;
          justify-content: center;
          align-items: center;
          gap: 10px;
          flex-wrap: wrap;
        }

        /* Flex utilities */
        .flex-row {
          display: flex;
        }

        .flex-gap-1 {
          gap: 4px;
        }

        .flex-gap-2 {
          gap: 15px;
        }

        .margin-end-2 {
          margin-right: 8px;
        }

        .margin-start-2 {
          margin-left: 8px;
        }

        @media print {
          .modal-backdrop, .modal, .modal-header, .modal-footer,
          .modal-dialog, .modal-content, .modal-body {
            display: none !important;
          }
          body, html {
            background: white !important;
            margin: 0 !important;
            padding: 0 !important;
          }
             

        }
        `}
      </style>

      <Modal isOpen={props.isOpen} toggle={props.toggle} size="lg" centered>
        <ModalHeader toggle={props.toggle}>
          {props.id ? (
            <div className="fw-semibold fs-4 text-dark"> Print Label</div>
          ) : (
            <div
              className="d-flex justify-content-between align-items-center w-100 p-3 rounded shadow-sm bg-light"
              style={{ gap: "12px", width: "100%" }}
            >
              {/* Title */}
              <div className="fw-semibold fs-4 text-dark"> Print Label</div>

              {/* Select Box */}
              <div
                style={{ minWidth: "260px", maxWidth: "350px", width: "100%" }}
              >
                <Select
                  value={selectedAddressOption}
                  options={addresses.map((item) => ({
                    item: item,
                    value: item.shipping_id,
                    label: `${item?.address_line1 || ""}, ${item.city} - ${item?.pincode || ""} - ${item.addressType}`,
                  }))}
                  placeholder="Select Shipping Address..."
                  onChange={(option) => {
                    setUsers(option.item);
                  }}
                  styles={{
                    control: (base) => ({
                      ...base,
                      minHeight: "38px",
                      borderRadius: "8px",
                      boxShadow: "none",
                    }),
                    menu: (base) => ({
                      ...base,
                      zIndex: 9999,
                    }),
                  }}
                />
              </div>
              <button
                type="button"
                style={{
                  padding: "1px 7px",
                  fontSize: "15px",
                }}
                id="create-btn"
                className="btn btn-primary btn-sm"
                onClick={() => {
                  setShippingModal(true);
                }}
              >
                +
              </button>
            </div>
          )}
        </ModalHeader>

        <ModalBody>
          {props.id ? (
            <div className="label-page">
              <div id="label-print-area">
                <div
                  className={`label-box ${
                    orientation === "vertical"
                      ? "label-vertical-invoice"
                      : "label-landscape"
                  }`}
                >
                  {masterData.master_payment_mode_id == 1 && (
                    <>
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "flex-start",
                          gap: "2px",
                          width: "100%",
                        }}
                      >
                        {/* LEFT SIDE */}
                        <div
                          style={{ display: "flex", flexDirection: "column" }}
                        >
                          {/* Transport */}
                          <div
                            className="transportbox"
                            style={{
                              // marginBottom: "5px",
                              //fontWeight: "bold",
                              fontSize: "12px",
                              textAlign: "center",
                              minWidth: "150px",
                              minHeight: "70px",
                              border: "1px solid black",
                            }}
                          >
                            <b className="fs-5">Transport Type: </b>
                            <div>
                              {stripHtml(masterData.master_tracking_details) ||
                                "N/A"}
                            </div>
                          </div>

                          {/* Order ID */}
                          <div
                            style={{
                              border: "1px solid #000",
                              padding: "2px 4px",
                              display: "inline-block",
                              backgroundColor: "#fff",
                              whiteSpace: "nowrap",
                              marginTop: "5px",
                              textAlign: "center",
                            }}
                          >
                            <div
                              style={{
                                fontWeight: "bold",
                                fontSize: "14px",
                              }}
                            >
                              Order ID:{" "}
                              {"" + masterData.master_invoice_no || ""}
                            </div>
                          </div>
                        </div>

                        {/* RIGHT SIDE */}
                        <div
                          style={{
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                            gap: "3px",
                          }}
                        >
                          {/* COD BOX */}
                          <div
                            className="codbox"
                            style={
                              orientation === "landscape"
                                ? {
                                    border: "2px solid #000",
                                    textAlign: "center",
                                    minWidth: "80px",
                                    minHeight: "60px",
                                    backgroundColor: "#fff",
                                    padding: "2px",
                                  }
                                : {
                                    border: "2px solid #000",
                                    textAlign: "center",
                                    minWidth: "180px",
                                    minHeight: "95px",
                                    backgroundColor: "#fff",
                                    paddingTop: "10px",
                                  }
                            }
                          >
                            <div
                              style={{
                                textAlign: "center",
                                fontWeight: "bold",
                                fontSize: "19px",
                                margin: "2px 2px",
                              }}
                            >
                              COD{" "}
                            </div>
                            <div
                              className="codamount"
                              style={{
                                fontSize: "19px",
                                fontWeight: "bold",
                                color: "#000",
                                backgroundColor: "#fff3cd",

                                display: "inline",
                              }}
                            >
                              {" "}
                              ₹ {calculateCodAmount(childData, masterData)}{" "}
                            </div>
                          </div>

                          {/* BANK / CONTRACT INFO */}
                        </div>
                      </div>
                      <div
                        style={{
                          fontWeight: "12px",
                          fontSize: "16px",
                          // textAlign: "center",
                        }}
                      >
                        <b>{amountinwords}</b>
                      </div>
                      <div
                        style={{
                          padding: "0px",
                          display: "flex",

                          gap: "0.5rem", // gap-2
                          justifyContent: "flex-start",
                        }}
                      >
                        <div
                          className="non-banpl"
                          style={{
                            fontSize: "14px",
                            border: "2px solid #000",
                            textAlign: "center",
                            minWidth: "80px",
                            minHeight: "45px",
                            backgroundColor: "#fff",
                            paddingTop: "2px",
                          }}
                        >
                          NON-BANPL A/C No: <b>1000059729</b>
                        </div>
                        <div
                          style={{
                            fontSize: "14px",
                            border: "2px solid #000",
                            textAlign: "center",
                            minWidth: "80px",
                            minHeight: "45px",
                            backgroundColor: "#fff",
                            paddingTop: "2px",
                          }}
                        >
                          CONTRACT ID: <b>40098702</b>
                        </div>
                      </div>

                      {/* Divider */}
                      <div className="hrline"></div>
                    </>
                  )}

                  <div>
                    <div className="to">To,</div>
                    <div className="bank-name">
                      {customer?.user_type == 1
                        ? customer?.user_name
                        : customer?.master_name}
                      {customer?.master_branch_name
                        ? ` - ${customer.master_branch_name}`
                        : ""}
                      {customer?.master_branch_code
                        ? ` - ${customer.master_branch_code}`
                        : ""}
                    </div>

                    <div className="address">
                      {masterData.master_address1 && (
                        <>
                          {masterData.master_address1}
                          <br />
                          {masterData.master_taluka &&
                            `Tq. ${masterData.master_taluka}`}
                          {masterData.master_district &&
                            ` Dist. ${masterData.master_district}`}
                          {masterData.master_city &&
                            `, ${masterData.master_city}`}
                          {masterData.master_state &&
                            `, ${masterData.master_state}`}
                        </>
                      )}
                    </div>
                    {orientation === "landscape" ? (
                      <div style={{ display: "flex" }}>
                        <div className="meta">
                          <b>PIN Code:</b> {masterData.master_pincode || "N/A"}
                        </div>
                        <div className="meta">
                          <b>Phone:</b> {customer.user_mobile}
                          {customer.master_mobile &&
                            `, ${customer.master_mobile}`}
                        </div>
                        <div className="meta">
                          <b>E-Mail:</b> {customer.user_email || "N/A"}
                        </div>
                      </div>
                    ) : (
                      <div>
                        <div className="meta">
                          <b>PIN Code:</b> {masterData.master_pincode || "N/A"}
                        </div>
                        <div className="meta">
                          <b>Phone:</b> {customer.user_mobile}
                          {customer.master_mobile &&
                            `, ${customer.master_mobile}`}
                        </div>
                        <div className="meta">
                          <b>E-Mail:</b> {customer.user_email || "N/A"}
                        </div>
                      </div>
                    )}
                  </div>

                  <div>
                    <div className="to">From,</div>
                    <div className="from-company">Sai Suppliers (25-26)</div>
                    <div className="from-details">
                      265 Kasba Peth Shankar Market Road, Phaltan Tal Satara
                      415523 <br />
                      Contact : 9226439223 <br />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="label-page">
              <div id="label-print-area">
                <div
                  className={`label-box ${
                    orientation === "vertical"
                      ? "label-vertical"
                      : "label-landscape"
                  }`}
                >
                  <div>
                    <div className="to">To,</div>
                    <div className="bank-name">
                      {customer?.user_type == 1
                        ? customer?.user_name
                        : customer?.master_name}
                      {customer?.master_branch_name
                        ? ` - ${customer.master_branch_name}`
                        : ""}
                      {customer?.master_branch_code
                        ? ` - ${customer.master_branch_code}`
                        : ""}
                    </div>

                    <div className="address-customer">
                      {users?.address_line1 ||
                        ("" && (
                          <>
                            {users?.address_line1 || ""}
                            <br />
                            {users.taluka && `Tq. ${users.taluka}`}
                            {users.district && ` Dist. ${users.district}`}
                            {users.city && `, ${users.city}`}
                            {users.state && `, ${users.state}`}
                          </>
                        ))}
                    </div>

                    <div className="meta-customer">
                      <b>PIN Code:</b> {users?.pincode || "" || "N/A"}
                    </div>
                    <div className="meta-customer">
                      <b>Phone:</b> {customer.user_mobile}
                      {customer.master_mobile && `, ${customer.master_mobile}`}
                    </div>
                    <div className="meta-customer">
                      <b>E-Mail:</b> {customer.user_email || "N/A"}
                    </div>
                  </div>

                  <div></div>

                  <div>
                    <div className="to">From,</div>
                    <div className="from-company-customer">
                      Sai Suppliers (25-26)
                    </div>
                    <div className="from-details-customer">
                      265 Kasba Peth Shankar Market Road, Phaltan Tal Satara
                      415523 <br />
                      Contact : 9226439223 <br />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </ModalBody>

        <ModalFooter>
          <div className="print-controls">
            <div className="orientation-buttons">
              <button
                type="button"
                className={`btn btn-sm margin-end-2  ${
                  orientation === "vertical"
                    ? "btn-success"
                    : "btn-outline-success"
                }`}
                onClick={() => setOrientation("vertical")}
              >
                Vertical
              </button>
              <button
                type="button"
                className={`btn btn-sm ${
                  orientation === "landscape"
                    ? "btn-success"
                    : "btn-outline-success"
                }`}
                onClick={() => setOrientation("landscape")}
              >
                Landscape
              </button>
            </div>

            <Button color="primary" className="ms-2" onClick={handlePrint}>
              <i className="ri-printer-line"></i> Print Label
            </Button>
          </div>
        </ModalFooter>
      </Modal>
      {shippingModal == true ? (
        <ShippingModal
          modalStates={shippingModal}
          setModalStates={() => {
            setShippingCount(shippingCount + 1);
            setShippingModal(false);
          }}
          purchase_customer_ids={props?.user?.user_id}
        />
      ) : (
        ""
      )}
    </>
  );
};

export default LabelPrint;
