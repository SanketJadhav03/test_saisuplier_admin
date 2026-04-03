import React, { useEffect, useState, useCallback, useRef } from "react";
import { Card, Modal, ModalHeader, ModalBody, Label, Input, Row, Col, Container, Button } from "reactstrap";
import { toast, ToastContainer } from "react-toastify";
import DeleteModal from "../../Components/Common/DeleteModal";
import Select from "react-select";
import "react-toastify/dist/ReactToastify.css";
import JsBarcode from "jsbarcode";
import AuthUser from "../../helpers/Authuser";
import { IMG_API_URL } from "../../helpers/url_helper";
const BillingSettings = () => {
    const [billingSettings, setBillingSettings] = useState({

        marathi_name_length:12,
        english_name_length:12,
        business_name_size: 12,
        business_name_weight: "normal", 
        address_size: 12,
        address_weight: "normal",

        mobile_size: 12,
        mobile_weight: "normal",

        product_name_size: 12,
        product_name_weight: "normal",


        all_amount_size: 12,
        all_amount_weight: "normal",

        total_qty_size:10,
        total_qty_weight:"normal",

        total_bill_size:12,
        total_bill_weight:"bold",

        saving_amount_size:12,
        saving_amount_weight:"normal",
 

    });
    const getBillingSettings = async () => {
        http
            .get("/billing_settings/list")
            .then((res) => {
                if (res.data) {
                    setDataStatus(true);
                    console.log(res.data);
                    setBillingSettings(res.data);
                }
            })
            .catch((err) => {
                console.log(err);
            })
    }
    useEffect(()=>{
        getBillingSettings();
    },[]);

    const [dataStatus, setDataStatus] = useState(false);
    
 
   

    const { http } = AuthUser();
    const SubmitData = () => {
        http
            .post("/billing_settings/store", billingSettings)
            .then((res) => {
                if (res.data.status == 0) {
                    setDataStatus(true);
                    toast.success(res.data.message);
                } else {
                    toast.error(res.data.message);
                }
            }).catch((err) => {
                console.log(err);
            })
    }
    const UpdateData = () => {
        console.log(billingSettings);
        http
            .post("/billing_settings/update", billingSettings)
            .then((res) => {
                if (res.data.status == 0) {
                    toast.success(res.data.message);
                } else {
                    toast.error(res.data.message);
                }
            }).catch((err) => {
                console.log(err);
            })
    }
    const increaseFontSize = (name) => {
        setBillingSettings((prev) => ({
            ...prev,
            [name]: Math.min(prev[name] + 1, 50), // Max font size limit
        }));
    };

    const decreaseFontSize = (name) => {
        setBillingSettings((prev) => ({
            ...prev,
            [name]: Math.max(prev[name] - 1, 5), // Min font size limit
        }));
    };


    // From Electron
    const [printers, setPrinters] = useState([]);
    const [selectedPrinter, setSelectedPrinter] = useState('');
    useEffect(() => {
        // Fetch printers when running in Electron
        if (window.electron) {
            window.electron.getPrinters().then((printersList) => {
                setPrinters(printersList);
                if (printersList.length > 0) {
                    setSelectedPrinter(printersList[0].name);
                }
            });
        }
    }, []);

    
    const productsList = [
        {
            product_english_name: "Product A",
            product_marathi_name: "उत्पादन ए",
            pos_qty: 2,
            pos_mrp: 200,
            pos_salePrice: 150
          },
    ];
    const companyDetails = {
        business_name: "XYZ Store",
        business_billing_address: "123 Main St, Cityville",
        business_company_phone_no: "123-456-7890",
        business_gst_no: "27ABCDE1234F1Z5",
        business_terms_conditions: "Terms and conditions apply.",
        business_qr_code: "qr_code.png" // This would be the filename of the QR code image
      };
      
      const masterDetails = {
        master_invoice_no: "1001",
        master_bill_date: "2024-07-31",
        master_total_bill_amt: 1500.00,
        master_total_bill_mrp: 2000.00,
        master_qty: 10
      };
      const posBillLang = 2; // 1 for Marathi, 2 for English, 3 for both
const formattedTime = "12:45 PM";
const IMG_API_URL = "https://example.com/images";
    return (
        <div className="page-content">
            <Container fluid>
                <Row>
                    <Col lg={12}>
                        <Card className="border card-border-success p-3 shadow-lg">
                            <div className="row">
                                <div className="col-4">
                                   
                                    <div className="mb-3">
                                        <Label classN ame="form-label h5 fw-bold d-flex justify-content-between">
                                            <div className="h4 ">Billing Settings</div>
                                        </Label>


                                        <div className="business_name mt-4  ">
                                            <div className=" d-flex ">
                                                

                                                <div className="h5">

                                                    Business Name
                                                </div>
                                            </div>
                                            <div className="d-flex  ">
                                                <div className="d-flex">
                                                    <div className="btn btn-outline-primary" style={{ height: "35px" }} onClick={() => decreaseFontSize("business_name_size")}>-</div>
                                                    <Input
                                                        type="number"
                                                        value={billingSettings.business_name_size}
                                                        onChange={(e) =>
                                                            setBillingSettings({
                                                                ...billingSettings,
                                                                business_name_size: parseInt(e.target.value),
                                                            })
                                                        }
                                                        className="border border-primary "
                                                        style={{ height: "35px", width: '100px', textAlign: 'center' }}
                                                    />
                                                    <div className="btn btn-outline-primary " style={{ height: "35px" }} onClick={() => increaseFontSize("business_name_size")}>+</div>
                                                </div>


                                                <div>
                                                    <input
                                                        checked={billingSettings.business_name_weight == "normal"}
                                                        type="radio"
                                                        className="btn-check shadow"
                                                        value="normal"
                                                        name="business_name_weight"
                                                        onChange={(e) => {
                                                            setBillingSettings({
                                                                ...billingSettings,
                                                                business_name_weight: e.target.value,
                                                            });
                                                        }}
                                                        id="business_name_weight_normal"
                                                        autoComplete="off"
                                                    />
                                                    <label className="btn btn-outline-success mx-2" htmlFor="business_name_weight_normal">
                                                        Normal
                                                    </label>
                                                    <input
                                                        checked={billingSettings.business_name_weight == "bold"}
                                                        type="radio"
                                                        className="btn-check shadow"
                                                        value="bold"
                                                        name="business_name_weight"
                                                        onChange={(e) => {
                                                            setBillingSettings({
                                                                ...billingSettings,
                                                                business_name_weight: e.target.value,
                                                            });
                                                        }}
                                                        id="business_name_weight_bold"
                                                        autoComplete="off"
                                                    />
                                                    <label className="btn btn-outline-success mx-2" htmlFor="business_name_weight_bold">
                                                        Bold
                                                    </label>

                                                </div>


                                            </div>
                                        </div>
                                        {/* Business End */}

                                        {/* Address */}

                                        <div className="Address mt-4">
                                            <div className=" d-flex ">
                                                 

                                                <div className="h5">

                                                    Address
                                                </div>
                                            </div>
                                            <div className="d-flex  ">
                                                <div className="d-flex">
                                                    <div className="btn btn-outline-primary" style={{ height: "35px" }} onClick={() => decreaseFontSize("address_size")}>-</div>
                                                    <Input
                                                        type="number"
                                                        value={billingSettings.address_size}
                                                        onChange={(e) =>
                                                            setBillingSettings({
                                                                ...billingSettings,
                                                                address_size: parseInt(e.target.value),
                                                            })
                                                        }
                                                        className="border border-primary "
                                                        style={{ height: "35px", width: '100px', textAlign: 'center' }}
                                                    />
                                                    <div className="btn btn-outline-primary " style={{ height: "35px" }} onClick={() => increaseFontSize("address_size")}>+</div>
                                                </div>


                                                <div>
                                                    <input
                                                        checked={billingSettings.address_weight == "normal"}
                                                        type="radio"
                                                        className="btn-check shadow"
                                                        value="normal"
                                                        name="address_weight"
                                                        onChange={(e) => {
                                                            setBillingSettings({
                                                                ...billingSettings,
                                                                address_weight: e.target.value,
                                                            });
                                                        }}
                                                        id="address_weight_normal"
                                                        autoComplete="off"
                                                    />
                                                    <label className="btn btn-outline-success mx-2" htmlFor="address_weight_normal">
                                                        Normal
                                                    </label>
                                                    <input
                                                        checked={billingSettings.address_weight == "bold"}
                                                        type="radio"
                                                        className="btn-check shadow"
                                                        value="bold"
                                                        name="address_weight"
                                                        onChange={(e) => {
                                                            setBillingSettings({
                                                                ...billingSettings,
                                                                address_weight: e.target.value,
                                                            });
                                                        }}
                                                        id="address_weight_bold"
                                                        autoComplete="off"
                                                    />
                                                    <label className="btn btn-outline-success mx-2" htmlFor="address_weight_bold">
                                                        Bold
                                                    </label>

                                                </div>


                                            </div>
                                        </div>
                                        {/* Mobile */}

                                        <div className="mobile mt-4">
                                            <div className=" d-flex ">
                                                

                                                <div className="h5">

                                                    Mobile
                                                </div>
                                            </div>
                                            <div className="d-flex  ">
                                                <div className="d-flex">
                                                    <div className="btn btn-outline-primary" style={{ height: "35px" }} onClick={() => decreaseFontSize("mobile_size")}>-</div>
                                                    <Input
                                                        type="number"
                                                        value={billingSettings.mobile_size}
                                                        onChange={(e) =>
                                                            setBillingSettings({
                                                                ...billingSettings,
                                                                mobile_size: parseInt(e.target.value),
                                                            })
                                                        }
                                                        className="border border-primary "
                                                        style={{ height: "35px", width: '100px', textAlign: 'center' }}
                                                    />
                                                    <div className="btn btn-outline-primary " style={{ height: "35px" }} onClick={() => increaseFontSize("mobile_size")}>+</div>
                                                </div>


                                                <div>
                                                    <input
                                                        checked={billingSettings.mobile_weight == "normal"}
                                                        type="radio"
                                                        className="btn-check shadow"
                                                        value="normal"
                                                        name="mobile_weight"
                                                        onChange={(e) => {
                                                            setBillingSettings({
                                                                ...billingSettings,
                                                                mobile_weight: e.target.value,
                                                            });
                                                        }}
                                                        id="mobile_weight_normal"
                                                        autoComplete="off"
                                                    />
                                                    <label className="btn btn-outline-success mx-2" htmlFor="mobile_weight_normal">
                                                        Normal
                                                    </label>
                                                    <input
                                                        checked={billingSettings.mobile_weight == "bold"}
                                                        type="radio"
                                                        className="btn-check shadow"
                                                        value="bold"
                                                        name="mobile_weight"
                                                        onChange={(e) => {
                                                            setBillingSettings({
                                                                ...billingSettings,
                                                                mobile_weight: e.target.value,
                                                            });
                                                        }}
                                                        id="mobile_weight_bold"
                                                        autoComplete="off"
                                                    />
                                                    <label className="btn btn-outline-success mx-2" htmlFor="mobile_weight_bold">
                                                        Bold
                                                    </label>

                                                </div>


                                            </div>
                                        </div>
                                        {/* Product Start */}
                                        <div className="product Name mt-4">
                                            <div className=" d-flex ">
                                                

                                                <div className="h5">

                                                    Product Name
                                                </div>
                                            </div>
                                            <div className="d-flex  ">
                                                <div className="d-flex">
                                                    <div className="btn btn-outline-primary" style={{ height: "35px" }} onClick={() => decreaseFontSize("product_name_size")}>-</div>
                                                    <Input
                                                        type="number"
                                                        value={billingSettings.product_name_size}
                                                        onChange={(e) =>
                                                            setBillingSettings({
                                                                ...billingSettings,
                                                                product_name_size: parseInt(e.target.value),
                                                            })
                                                        }
                                                        className="border border-primary "
                                                        style={{ height: "35px", width: '100px', textAlign: 'center' }}
                                                    />
                                                    <div className="btn btn-outline-primary " style={{ height: "35px" }} onClick={() => increaseFontSize("product_name_size")}>+</div>
                                                </div>


                                                <div>
                                                    <input
                                                        checked={billingSettings.product_name_weight == "normal"}
                                                        type="radio"
                                                        className="btn-check shadow"
                                                        value="normal"
                                                        name="product_name_weight"
                                                        onChange={(e) => {
                                                            setBillingSettings({
                                                                ...billingSettings,
                                                                product_name_weight: e.target.value,
                                                            });
                                                        }}
                                                        id="product_name_weight_normal"
                                                        autoComplete="off"
                                                    />
                                                    <label className="btn btn-outline-success mx-2" htmlFor="product_name_weight_normal">
                                                        Normal
                                                    </label>
                                                    <input
                                                        checked={billingSettings.product_name_weight == "bold"}
                                                        type="radio"
                                                        className="btn-check shadow"
                                                        value="bold"
                                                        name="product_name_weight"
                                                        onChange={(e) => {
                                                            setBillingSettings({
                                                                ...billingSettings,
                                                                product_name_weight: e.target.value,
                                                            });
                                                        }}
                                                        id="product_name_weight_bold"
                                                        autoComplete="off"
                                                    />
                                                    <label className="btn btn-outline-success mx-2" htmlFor="product_name_weight_bold">
                                                        Bold
                                                    </label>

                                                </div>


                                            </div>
                                        </div>
                                        {/* Product End */}

                                        {/* All Amount qty mrp rate Total */} 
                                        <div className="all_amount mt-4">
                                            <div className=" d-flex ">
                                                

                                                <div className="h5">

                                                    Amount ( Qty ,MRP ,Rate, Total )
                                                </div>
                                            </div>
                                            <div className="d-flex  ">
                                                <div className="d-flex">
                                                    <div className="btn btn-outline-primary" style={{ height: "35px" }} onClick={() => decreaseFontSize("all_amount_size")}>-</div>
                                                    <Input
                                                        type="number"
                                                        value={billingSettings.all_amount_size}
                                                        onChange={(e) =>
                                                            setBillingSettings({
                                                                ...billingSettings,
                                                                all_amount_size: parseInt(e.target.value),
                                                            })
                                                        }
                                                        className="border border-primary "
                                                        style={{ height: "35px", width: '100px', textAlign: 'center' }}
                                                    />
                                                    <div className="btn btn-outline-primary " style={{ height: "35px" }} onClick={() => increaseFontSize("all_amount_size")}>+</div>
                                                </div>


                                                <div>
                                                    <input
                                                        checked={billingSettings.all_amount_weight == "normal"}
                                                        type="radio"
                                                        className="btn-check shadow"
                                                        value="normal"
                                                        name="all_amount_weight"
                                                        onChange={(e) => {
                                                            setBillingSettings({
                                                                ...billingSettings,
                                                                all_amount_weight: e.target.value,
                                                            });
                                                        }}
                                                        id="all_amount_weight_normal"
                                                        autoComplete="off"
                                                    />
                                                    <label className="btn btn-outline-success mx-2" htmlFor="all_amount_weight_normal">
                                                        Normal
                                                    </label>
                                                    <input
                                                        checked={billingSettings.all_amount_weight == "bold"}
                                                        type="radio"
                                                        className="btn-check shadow"
                                                        value="bold"
                                                        name="all_amount_weight"
                                                        onChange={(e) => {
                                                            setBillingSettings({
                                                                ...billingSettings,
                                                                all_amount_weight: e.target.value,
                                                            });
                                                        }}
                                                        id="all_amount_weight_bold"
                                                        autoComplete="off"
                                                    />
                                                    <label className="btn btn-outline-success mx-2" htmlFor="all_amount_weight_bold">
                                                        Bold
                                                    </label>

                                                </div>


                                            </div>
                                        </div>


                                     

                                        {/* Barcode Number End */}


                                        {/* <div className="mt-3"> 
                                            <label htmlFor="printer" className="h5">Select Printer </label>
                                            <Select
                                                id="printer"
                                                value={printers.find(printer => billingSettings.barcode_printer == printer.value)}
                                                onChange={(e) => {
                                                    setBillingSettings({
                                                        ...billingSettings,
                                                        barcode_printer: e.value
                                                    })
                                                }}
                                                options={printers.map((printer) => (
                                                    { label: printer.name, value: printer.name }
                                                ))}
                                            />
                                        </div>
 */}

                                    </div>

                                </div>
                                <div className="col-4 mt-5">
                                <div className="total_qty mt-4">
                                            <div className=" d-flex ">
                                                

                                                <div className="h5">

                                                    Total Qty
                                                </div>
                                            </div>
                                            <div className="d-flex  ">
                                                <div className="d-flex">
                                                    <div className="btn btn-outline-primary" style={{ height: "35px" }} onClick={() => decreaseFontSize("total_qty_size")}>-</div>
                                                    <Input
                                                        type="number"
                                                        value={billingSettings.total_qty_size}
                                                        onChange={(e) =>
                                                            setBillingSettings({
                                                                ...billingSettings,
                                                                total_qty_size: parseInt(e.target.value),
                                                            })
                                                        }
                                                        className="border border-primary "
                                                        style={{ height: "35px", width: '100px', textAlign: 'center' }}
                                                    />
                                                    <div className="btn btn-outline-primary " style={{ height: "35px" }} onClick={() => increaseFontSize("total_qty_size")}>+</div>
                                                </div>


                                                <div>
                                                    <input
                                                        checked={billingSettings.total_qty_weight == "normal"}
                                                        type="radio"
                                                        className="btn-check shadow"
                                                        value="normal"
                                                        name="total_qty_weight"
                                                        onChange={(e) => {
                                                            setBillingSettings({
                                                                ...billingSettings,
                                                                total_qty_weight: e.target.value,
                                                            });
                                                        }}
                                                        id="total_qty_weight_normal"
                                                        autoComplete="off"
                                                    />
                                                    <label className="btn btn-outline-success mx-2" htmlFor="total_qty_weight_normal">
                                                        Normal
                                                    </label>
                                                    <input
                                                        checked={billingSettings.total_qty_weight == "bold"}
                                                        type="radio"
                                                        className="btn-check shadow"
                                                        value="bold"
                                                        name="total_qty_weight"
                                                        onChange={(e) => {
                                                            setBillingSettings({
                                                                ...billingSettings,
                                                                total_qty_weight: e.target.value,
                                                            });
                                                        }}
                                                        id="total_qty_weight_bold"
                                                        autoComplete="off"
                                                    />
                                                    <label className="btn btn-outline-success mx-2" htmlFor="total_qty_weight_bold">
                                                        Bold
                                                    </label>

                                                </div>


                                            </div>
                                        </div>


                                        {/* Sale Price End */}
                                        {/* Date STart */}
                                        <div className="total_bill mt-4">
                                            <div className=" d-flex ">
                                                 

                                                <div className="h5">

                                                    Total Bill
                                                </div>
                                            </div>
                                            <div className="d-flex  ">
                                                <div className="d-flex">
                                                    <div className="btn btn-outline-primary" style={{ height: "35px" }} onClick={() => decreaseFontSize("total_bill_size")}>-</div>
                                                    <Input
                                                        type="number"
                                                        value={billingSettings.total_bill_size}
                                                        onChange={(e) =>
                                                            setBillingSettings({
                                                                ...billingSettings,
                                                                total_bill_size: parseInt(e.target.value),
                                                            })
                                                        }
                                                        className="border border-primary "
                                                        style={{ height: "35px", width: '100px', textAlign: 'center' }}
                                                    />
                                                    <div className="btn btn-outline-primary " style={{ height: "35px" }} onClick={() => increaseFontSize("total_bill_size")}>+</div>
                                                </div>


                                                <div>
                                                    <input
                                                        checked={billingSettings.total_bill_weight == "normal"}
                                                        type="radio"
                                                        className="btn-check shadow"
                                                        value="normal"
                                                        name="total_bill_weight"
                                                        onChange={(e) => {
                                                            setBillingSettings({
                                                                ...billingSettings,
                                                                total_bill_weight: e.target.value,
                                                            });
                                                        }}
                                                        id="total_bill_weight_normal"
                                                        autoComplete="off"
                                                    />
                                                    <label className="btn btn-outline-success mx-2" htmlFor="total_bill_weight_normal">
                                                        Normal
                                                    </label>
                                                    <input
                                                        checked={billingSettings.total_bill_weight == "bold"}
                                                        type="radio"
                                                        className="btn-check shadow"
                                                        value="bold"
                                                        name="total_bill_weight"
                                                        onChange={(e) => {
                                                            setBillingSettings({
                                                                ...billingSettings,
                                                                total_bill_weight: e.target.value,
                                                            });
                                                        }}
                                                        id="total_bill_weight_bold"
                                                        autoComplete="off"
                                                    />
                                                    <label className="btn btn-outline-success mx-2" htmlFor="total_bill_weight_bold">
                                                        Bold
                                                    </label>

                                                </div>


                                            </div>
                                        </div>
                                        {/* Date End */}
                                        {/* Barcode Number Sart */}

                                        <div className="saving_amount_ mt-4">
                                            <div className=" d-flex ">
                                                
                                                <div className="h5">

                                                    Saving Amount
                                                </div>
                                            </div>
                                            <div className="d-flex  ">
                                                <div className="d-flex">
                                                    <div className="btn btn-outline-primary" style={{ height: "35px" }} onClick={() => decreaseFontSize("saving_amount_size")}>-</div>
                                                    <Input
                                                        type="number"
                                                        value={billingSettings.saving_amount_size}
                                                        onChange={(e) =>
                                                            setBillingSettings({
                                                                ...billingSettings,
                                                                saving_amount_size: parseInt(e.target.value),
                                                            })
                                                        }
                                                        className="border border-primary "
                                                        style={{ height: "35px", width: '100px', textAlign: 'center' }}
                                                    />
                                                    <div className="btn btn-outline-primary " style={{ height: "35px" }} onClick={() => increaseFontSize("saving_amount_size")}>+</div>
                                                </div>


                                                <div>
                                                    <input
                                                        checked={billingSettings.saving_amount_weight == "normal"}
                                                        type="radio"
                                                        className="btn-check shadow"
                                                        value="normal"
                                                        name="saving_amount_weight"
                                                        onChange={(e) => {
                                                            setBillingSettings({
                                                                ...billingSettings,
                                                                saving_amount_weight: e.target.value,
                                                            });
                                                        }}
                                                        id="saving_amount_weight_normal"
                                                        autoComplete="off"
                                                    />
                                                    <label className="btn btn-outline-success mx-2" htmlFor="saving_amount_weight_normal">
                                                        Normal
                                                    </label>
                                                    <input
                                                        checked={billingSettings.saving_amount_weight == "bold"}
                                                        type="radio"
                                                        className="btn-check shadow"
                                                        value="bold"
                                                        name="saving_amount_weight"
                                                        onChange={(e) => {
                                                            setBillingSettings({
                                                                ...billingSettings,
                                                                saving_amount_weight: e.target.value,
                                                            });
                                                        }}
                                                        id="saving_amount_weight_bold"
                                                        autoComplete="off"
                                                    />
                                                    <label className="btn btn-outline-success mx-2" htmlFor="saving_amount_weight_bold">
                                                        Bold
                                                    </label>

                                                </div>


                                            </div>
                                        </div>


                                        <div className="product_length_ mt-4">
                                            <div className=" d-flex ">
                                                
                                                <div className="h5">

                                                    Marathi Name Length
                                                </div>
                                            </div>
                                            <div className="d-flex  ">
                                                <div className="d-flex">
                                                    <div className="btn btn-outline-primary" style={{ height: "35px" }} onClick={() => decreaseFontSize("marathi_name_length")}>-</div>
                                                    <Input
                                                        type="number"
                                                        value={billingSettings.marathi_name_length}
                                                        onChange={(e) =>
                                                            setBillingSettings({
                                                                ...billingSettings,
                                                                marathi_name_length: parseInt(e.target.value),
                                                            })
                                                        }
                                                        className="border border-primary "
                                                        style={{ height: "35px", width: '100px', textAlign: 'center' }}
                                                    />
                                                    <div className="btn btn-outline-primary " style={{ height: "35px" }} onClick={() => increaseFontSize("marathi_name_length")}>+</div>
                                                </div> 

                                            </div>
                                        </div>
                                        <div className="product_length_ mt-4">
                                            <div className=" d-flex ">
                                                
                                                <div className="h5">

                                                    English Name Length
                                                </div>
                                            </div>
                                            <div className="d-flex  ">
                                                <div className="d-flex">
                                                    <div className="btn btn-outline-primary" style={{ height: "35px" }} onClick={() => decreaseFontSize("english_name_length")}>-</div>
                                                    <Input
                                                        type="number"
                                                        value={billingSettings.english_name_length}
                                                        onChange={(e) =>
                                                            setBillingSettings({
                                                                ...billingSettings,
                                                                english_name_length: parseInt(e.target.value),
                                                            })
                                                        }
                                                        className="border border-primary "
                                                        style={{ height: "35px", width: '100px', textAlign: 'center' }}
                                                    />
                                                    <div className="btn btn-outline-primary " style={{ height: "35px" }} onClick={() => increaseFontSize("english_name_length")}>+</div>
                                                </div> 

                                            </div>
                                        </div>


                                </div>
                                <div className="col-4">
                                   
    <div className="" id="printable-area">
      <div className="" id="section-to-print" style={{width:"80mm"}} >
        <div style={{ textAlign: "center" }}>
          <span style={{ fontWeight: billingSettings.business_name_weight, fontSize: `${billingSettings.business_name_size}px` }}>
            {companyDetails ? companyDetails.business_name : ""}
          </span>
          <br />
          <span style={{ fontWeight: billingSettings.address_weight, fontSize: `${billingSettings.address_size}px`  }}>
            {companyDetails ? companyDetails.business_billing_address : ""}
            <br />
            <span  style={{ fontWeight: billingSettings.mobile_weight, fontSize: `${billingSettings.mobile_size}px`  }}>

            Mob No: {companyDetails ? companyDetails.business_company_phone_no : ""}
            </span>
            <br />
            {companyDetails && companyDetails.business_gst_no && (
              <div>GST NO. {companyDetails.business_gst_no}</div>
            )}
          </span>
        </div>

        <div>
          <div style={{ borderBottom: "1px solid black" }}></div>
          <div>
            <b style={{ fontSize: "12px" }}>
              Bill No. {masterDetails ? masterDetails.master_invoice_no : ""}
            </b>
            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
            <b style={{ fontSize: "12px", marginLeft: "1px" }}>
              Date - Time: {masterDetails ? masterDetails.master_bill_date : ""} - {formattedTime}
            </b>
          </div>

          <div>
            <b style={{ fontSize: "12px" }}>
              Bill To : {companyDetails ? companyDetails.customer_name : ""}
            </b>
            <div style={{ borderBottom: "1px dashed black" }}></div>
          </div>
        </div>

        <table style={{ textAlign: "left", width: "80mm" }}>
          <thead>
            <tr>
              <th style={{ fontSize: "12px", borderBottom: "1px dashed black" }}>#</th>
              <th style={{ fontSize: "12px", borderBottom: "1px dashed black" }}>Product Name</th>
              <th style={{ fontSize: "12px", borderBottom: "1px dashed black" }}>Qty</th>
              <th style={{ fontSize: "12px", borderBottom: "1px dashed black" }}>MRP</th>
              <th style={{ fontSize: "12px", borderBottom: "1px dashed black" }}>Rate</th>
              <th style={{ fontSize: "12px", borderBottom: "1px dashed black" }}>Total</th>
            </tr>
          </thead>
          <tbody>
            {productsList.map((product, index) => (
              <tr key={index} style={{ fontSize: "13px", fontWeight: "normal" }}>
                <td style={{ textAlign: "left", fontWeight: billingSettings.product_name_weight, fontSize: `${billingSettings.product_name_size}px`}}>{index + 1}</td>
                <td style={{ textAlign: "left",fontWeight: billingSettings.product_name_weight, fontSize: `${billingSettings.product_name_size}px` }}>
                  {posBillLang === 1 ? (
                    (product.product_marathi_name || "").substring(0, `${parseInt(billingSettings.marathi_name_length)}`)
                  ) : posBillLang === 2 ? (
                    (product.product_english_name || "").substring(0,  `${parseInt(billingSettings.english_name_length)}`)
                  ) : (
                    <>
                      {(product.product_english_name || "").substring(0,  `${parseInt(billingSettings.english_name_length)}`)} /{" "}
                      {(product.product_marathi_name || "").substring(0,  `${parseInt(billingSettings.marathi_name_length)}`)}
                    </>
                  )}
                </td>
                <td style={{ textAlign: "right", fontWeight: billingSettings.all_amount_weight, fontSize: `${billingSettings.all_amount_size}px` }}>
                  {Number.isInteger(product.pos_qty)
                    ? product.pos_qty.toFixed(0)
                    : product.pos_qty.toFixed(2)}
                </td>
                <td style={{ textAlign: "right", fontWeight: billingSettings.all_amount_weight, fontSize: `${billingSettings.all_amount_size}px` }}>
                  {Number.isInteger(product.pos_mrp)
                    ? product.pos_mrp.toFixed(0)
                    : product.pos_mrp.toFixed(2)}
                </td>
                <td style={{ textAlign: "right", fontWeight: billingSettings.all_amount_weight, fontSize: `${billingSettings.all_amount_size}px` }}>
                  {Number.isInteger(product.pos_salePrice)
                    ? product.pos_salePrice.toFixed(0)
                    : product.pos_salePrice.toFixed(2)}
                </td>
                <td style={{ textAlign: "right", fontWeight: billingSettings.all_amount_weight, fontSize: `${billingSettings.all_amount_size}px` }}>
                  {Number.isInteger(product.pos_salePrice * product.pos_qty)
                    ? (product.pos_salePrice * product.pos_qty).toFixed(0)
                    : (product.pos_salePrice * product.pos_qty).toFixed(2)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <div>
          <div style={{ borderBottom: "1px dashed black" }}></div>
          <div style={{ display: "flex", justifyContent: "space-around" }}>
            <p style={{  fontWeight: billingSettings.total_qty_weight, fontSize: `${billingSettings.total_qty_size}px` }}>
              <span style={{ fontWeight: billingSettings.total_qty_weight, fontSize: `${billingSettings.total_qty_size}px`}}> Total Qty: </span>
              <b style={{ fontWeight: billingSettings.total_qty_weight, fontSize: `${billingSettings.total_qty_size}px` }}>
                <span style={{ fontWeight: billingSettings.total_qty_weight, fontSize: `${parseInt(billingSettings.total_qty_size)+5}px` }}>
                  : {masterDetails.master_qty}
                </span>
              </b>
            </p>
            <p style={{ fontSize: "8px", fontWeight: "bold" }}>
            <span style={{ fontWeight: billingSettings.total_bill_weight, fontSize: `${billingSettings.total_bill_size}px` }}> Total Bill : </span>
              <b>
                <span style={{ fontWeight: billingSettings.total_bill_weight, fontSize: `${parseInt(billingSettings.total_bill_size)+5}px` }}>
                  &#8377; {Math.round(masterDetails.master_total_bill_amt)}
                </span>
              </b>
            </p>
          </div>

          <div style={{ borderBottom: "1px solid black", marginTop: "-5px" }}></div>

          <div style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
            <p style={{ fontSize: "8px", fontWeight: "bold" }}>
              <span style={{ fontWeight: billingSettings.saving_amount_weight, fontSize: `${parseInt(billingSettings.saving_amount_size)}px` }}>आपली बचत : </span>
              <b>
                <span style={{ fontWeight: billingSettings.saving_amount_weight, fontSize: `${parseInt(billingSettings.saving_amount_size)+5}px` }}>
                  &#8377;{" "}
                  {masterDetails.master_total_bill_mrp - masterDetails.master_total_bill_amt}
                </span>
              </b>
            </p>
          </div>

          {companyDetails.business_qr_code && (
            <div style={{ display: "flex", justifyContent: "space-around", marginTop: "10px" }}>
              <span style={{ fontWeight: "bold", fontSize: "12px" }}>
                ऑनलाइन पेमेंट साठी <br /> स्कॅन करा.
              </span>
              <div>
                <img
                  src={`${IMG_API_URL}/business_images/${companyDetails.business_qr_code}`}
                  alt="Business QR"
                  style={{ height: "150px", width: "150px" }}
                />
              </div>
            </div>
          )}

          <p style={{ fontWeight: "bold", fontSize: "12px" }}>
            {companyDetails ? companyDetails.business_terms_conditions : ""}
          </p>
          <span style={{ fontWeight: "bold", fontSize: "17px", marginLeft: "69px" }}>
            धन्यवाद परत भेट द्या.
          </span>
          <br />
          <span style={{ fontWeight: "bold", fontSize: "12px", marginTop: "5px" }}>
            Software by Saisupplier Admin, Baramati - 9595775123
          </span>
        </div>
      </div>
    </div>

                                </div>
                                <div className="col-8 mt-4">
                                    {dataStatus == false ? <div className="btn w-100 btn-primary shadow-lg" onClick={() => SubmitData()}>
                                        Save Settings
                                    </div> : <div className="btn w-100 btn-secondary   shadow-lg" onClick={() => UpdateData()}>
                                        Update Settings
                                    </div>}
                                </div>
                            </div>
                        </Card>
                    </Col>
                </Row>
            </Container>
        </div>
    );
};

export default BillingSettings;
