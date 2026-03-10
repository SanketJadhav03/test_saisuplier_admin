import React, { useEffect, useState, useCallback, useRef } from "react";
import { Card, Modal, ModalHeader, ModalBody, Label, Input, Row, Col, Container, Button } from "reactstrap";
import { toast, ToastContainer } from "react-toastify";
import DeleteModal from "../../Components/Common/DeleteModal";
import Select from "react-select";
import "react-toastify/dist/ReactToastify.css";
import JsBarcode from "jsbarcode";
import AuthUser from "../../helpers/Authuser";
const BarcodeSettings = () => {
  const [barcodeSettings, setBarcodeSettings] = useState({

    business_name_size: 12,
    business_name_weight: "normal",
    business_name_status: 1,
    barcode_printer: "",

    product_name_size: 12,
    product_name_weight: "normal",
    product_name_status: 1,


    sale_price_size: 12,
    sale_price_weight: "normal",
    sale_price_status: 1,
    margin_top:25,


    date_size: 12,
    date_weight: "normal",
    date_status: 1,


    barcode_number_size: 12,
    barcode_number_weight: "normal",
    barcode_number_status: 1,

    mrp_size: 12,
    mrp_weight: "normal",
    mrp_status: 1,
    margin_top: 30,

    barcode_height: 12,
    barcode_width: 10,
    barcode_weight: "normal",
    barcode_status: 1,

    barcode_size: 1,
    marathi_name_length: 25,
    english_name_length: 25,


  });

  const [dataStatus, setDataStatus] = useState(false);
  const getBarcodeSettings = async () => {
    http
      .get("/barcode_settings/list")
      .then((res) => {
        if (res.data) {
          setDataStatus(true);
          console.log(res.data);
          setBarcodeSettings(res.data);
        }
      })
      .catch((err) => {
        console.log(err);
      })
  }

  const staticData = {
    product_hsn_code: '12345678',
    marathi_name: 'उत्पादन नाव',
    product_english_name: 'Product Name',
    salePrice: '₹100',
    companyDetails: {
      business_name: 'My Company',
    },
    barcodeLanguage: 1,
  };

  useEffect(() => {
    JsBarcode(`#barcode-${staticData.product_hsn_code}`, staticData.product_hsn_code, {
      format: "CODE128",
      displayValue: false,
      width: 2,
      height: 30,
    });
    getBarcodeSettings();
  }, [staticData.product_hsn_code]);

  const handleSizeChange = (value) => {

    setBarcodeSettings({
      ...barcodeSettings,
      barcode_size: value,

    });
  };

  const { http } = AuthUser();
  const SubmitData = () => {
    http
      .post("/barcode_settings/store", barcodeSettings)
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
    console.log(barcodeSettings);
    http
      .post("/barcode_settings/update", barcodeSettings)
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
    setBarcodeSettings((prev) => ({
      ...prev,
      [name]: Math.min(prev[name] + 1, 40), // Max font size limit
    }));
  };

  const decreaseFontSize = (name) => {
    setBarcodeSettings((prev) => ({
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
  return (
    <div className="page-content">
      <Container fluid>
        <Row>
          <Col lg={12}>
            <Card className="border card-border-success p-3 shadow-lg">
              <div className="row">
                <div className="col-4 ">
                  <div className="mb-3">
                    <Label className="form-label h5 fw-bold d-flex justify-content-between">
                      <div>Barcode Size</div>
                    </Label>
                    <div>

                      <input
                        checked={barcodeSettings.barcode_size == 2}
                        type="radio"
                        className="btn-check shadow"
                        value="2"
                        name="barcode"
                        onClick={(e) => handleSizeChange(e.target.value)}
                        id="barcode-2"
                        autoComplete="off"
                      />
                      <label className="btn btn-outline-success mx-2" htmlFor="barcode-2">
                        38 X 25 mm
                      </label>
                      <input
                        checked={barcodeSettings.barcode_size == 3}
                        type="radio"
                        className="btn-check shadow"
                        value="3"
                        name="barcode"
                        onClick={(e) => handleSizeChange(e.target.value)}
                        id="barcode-3"
                        autoComplete="off"
                      />
                      <label className="btn btn-outline-success mx-2" htmlFor="barcode-3">
                        50 X 25 mm
                      </label>
                      <input
                        checked={barcodeSettings.barcode_size == 1}
                        type="radio"
                        className="btn-check shadow"
                        value="1"
                        name="barcode"
                        onClick={(e) => handleSizeChange(e.target.value)}
                        id="barcode-1"
                        autoComplete="off"
                      />
                      <label className="btn btn-outline-success mx-2" htmlFor="barcode-1">
                        38 X 25 mm  2 Up
                      </label>
                    </div>
                  </div>
                  <div className="mb-3 ">
                    <Label classN ame="form-label h5 fw-bold d-flex justify-content-between">
                      <div className="h4 ">Fields & Styles</div>
                    </Label>


                    <div className="business_name">
                      <div className=" d-flex ">
                        <div className="form-check form-switch form-switch-md mb-3" dir="ltr">
                          <Input
                            checked={barcodeSettings.business_name_status == 1}
                            type="checkbox"
                            className="form-check-input"
                            id="customSwitchsizemd"
                            onChange={(e) => {
                              const newValue = e.target.checked ? 1 : 2;
                              setBarcodeSettings(prevState => ({
                                ...prevState,
                                business_name_status: newValue,
                              }));
                            }}
                          />
                        </div>

                        <div className="h5">

                          Business Name
                        </div>
                      </div>
                      <div className="d-flex  ">
                        <div className="d-flex">
                          <div className="btn btn-outline-primary" style={{ height: "35px" }} onClick={() => decreaseFontSize("business_name_size")}>-</div>
                          <Input
                            type="number"
                            value={barcodeSettings.business_name_size}
                            onChange={(e) =>
                              setBarcodeSettings({
                                ...barcodeSettings,
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
                            checked={barcodeSettings.business_name_weight == "normal"}
                            type="radio"
                            className="btn-check shadow"
                            value="normal"
                            name="business_name_weight"
                            onChange={(e) => {
                              setBarcodeSettings({
                                ...barcodeSettings,
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
                            checked={barcodeSettings.business_name_weight == "bold"}
                            type="radio"
                            className="btn-check shadow"
                            value="bold"
                            name="business_name_weight"
                            onChange={(e) => {
                              setBarcodeSettings({
                                ...barcodeSettings,
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
                    {/* Product Start */}
                    <div className="prouct_name mt-3">
                      <div className=" d-flex ">
                        <div className="form-check form-switch form-switch-md mb-3" dir="ltr">
                          <Input
                            checked={barcodeSettings.product_name_status == 1}
                            type="checkbox"
                            className="form-check-input"
                            id="customSwitchsizemd"
                            onChange={(e) => {
                              const value = e.target.checked ? 1 : 2;
                              setBarcodeSettings({
                                ...barcodeSettings,
                                product_name_status: value,
                              });
                            }}
                          />
                        </div>

                        <div className="h5">

                          Product Name
                        </div>
                      </div>
                      <div className="d-flex  ">
                        <div className="d-flex">
                          <div className="btn btn-outline-primary" style={{ height: "35px" }} onClick={() => decreaseFontSize("product_name_size")}>-</div>
                          <Input
                            type="number"
                            value={barcodeSettings.product_name_size}
                            onChange={(e) =>
                              setBarcodeSettings({
                                ...barcodeSettings,
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
                            checked={barcodeSettings.product_name_weight == "normal"}
                            type="radio"
                            className="btn-check shadow"
                            value="normal"
                            name="product_name_weight"
                            onChange={(e) => {
                              setBarcodeSettings({
                                ...barcodeSettings,
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
                            checked={barcodeSettings.product_name_weight == "bold"}
                            type="radio"
                            className="btn-check shadow"
                            value="bold"
                            name="product_name_weight"
                            onChange={(e) => {
                              setBarcodeSettings({
                                ...barcodeSettings,
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
                    {/* Sale Price Start */}


                    <div className="prouct_name mt-3">
                      <div className=" d-flex ">
                        <div className="form-check form-switch form-switch-md mb-3" dir="ltr">
                          <Input
                            checked={barcodeSettings.sale_price_status == 1}
                            type="checkbox"
                            className="form-check-input"
                            id="customSwitchsizemd"
                            onChange={(e) => {
                              const value = e.target.checked ? 1 : 2;
                              setBarcodeSettings({
                                ...barcodeSettings,
                                sale_price_status: value,
                              });
                            }}
                          />
                        </div>

                        <div className="h5">

                          Sale Price
                        </div>
                      </div>
                      <div className="d-flex  ">
                        <div className="d-flex">
                          <div className="btn btn-outline-primary" style={{ height: "35px" }} onClick={() => decreaseFontSize("sale_price_size")}>-</div>
                          <Input
                            type="number"
                            value={barcodeSettings.sale_price_size}
                            onChange={(e) =>
                              setBarcodeSettings({
                                ...barcodeSettings,
                                sale_price_size: parseInt(e.target.value),
                              })
                            }
                            className="border border-primary "
                            style={{ height: "35px", width: '100px', textAlign: 'center' }}
                          />
                          <div className="btn btn-outline-primary " style={{ height: "35px" }} onClick={() => increaseFontSize("sale_price_size")}>+</div>
                        </div>


                        <div>
                          <input
                            checked={barcodeSettings.sale_price_weight == "normal"}
                            type="radio"
                            className="btn-check shadow"
                            value="normal"
                            name="sale_price_weight"
                            onChange={(e) => {
                              setBarcodeSettings({
                                ...barcodeSettings,
                                sale_price_weight: e.target.value,
                              });
                            }}
                            id="sale_price_weight_normal"
                            autoComplete="off"
                          />
                          <label className="btn btn-outline-success mx-2" htmlFor="sale_price_weight_normal">
                            Normal
                          </label>
                          <input
                            checked={barcodeSettings.sale_price_weight == "bold"}
                            type="radio"
                            className="btn-check shadow"
                            value="bold"
                            name="sale_price_weight"
                            onChange={(e) => {
                              setBarcodeSettings({
                                ...barcodeSettings,
                                sale_price_weight: e.target.value,
                              });
                            }}
                            id="sale_price_weight_bold"
                            autoComplete="off"
                          />
                          <label className="btn btn-outline-success mx-2" htmlFor="sale_price_weight_bold">
                            Bold
                          </label>

                        </div>


                      </div>
                    </div>


                    {/* Sale Price End */}
                    <div className="prouct_name ">
                      <div className=" d-flex ">
                        <div className="form-check form-switch form-switch-md mb-3" dir="ltr">
                          <Input
                            checked={barcodeSettings.mrp_status == 1}
                            type="checkbox"
                            className="form-check-input"
                            id="customSwitchsizemd"
                            onChange={(e) => {
                              const value = e.target.checked ? 1 : 2;
                              setBarcodeSettings({
                                ...barcodeSettings,
                                mrp_status: value,
                              });
                            }}
                          />
                        </div>

                        <div className="h5">

                          Mrp
                        </div>
                      </div>
                      <div className="d-flex  ">
                        <div className="d-flex">
                          <div className="btn btn-outline-primary" style={{ height: "35px" }} onClick={() => decreaseFontSize("mrp_size")}>-</div>
                          <Input
                            type="number"
                            value={barcodeSettings.mrp_size}
                            onChange={(e) =>
                              setBarcodeSettings({
                                ...barcodeSettings,
                                mrp_size: parseInt(e.target.value),
                              })
                            }
                            className="border border-primary "
                            style={{ height: "35px", width: '100px', textAlign: 'center' }}
                          />
                          <div className="btn btn-outline-primary " style={{ height: "35px" }} onClick={() => increaseFontSize("mrp_size")}>+</div>
                        </div>


                        <div>
                          <input
                            checked={barcodeSettings.mrp_weight == "normal"}
                            type="radio"
                            className="btn-check shadow"
                            value="normal"
                            name="mrp_weight"
                            onChange={(e) => {
                              setBarcodeSettings({
                                ...barcodeSettings,
                                mrp_weight: e.target.value,
                              });
                            }}
                            id="mrp_weight_normal"
                            autoComplete="off"
                          />
                          <label className="btn btn-outline-success mx-2" htmlFor="mrp_weight_normal">
                            Normal
                          </label>
                          <input
                            checked={barcodeSettings.mrp_weight == "bold"}
                            type="radio"
                            className="btn-check shadow"
                            value="bold"
                            name="mrp_weight"
                            onChange={(e) => {
                              setBarcodeSettings({
                                ...barcodeSettings,
                                mrp_weight: e.target.value,
                              });
                            }}
                            id="mrp_weight_bold"
                            autoComplete="off"
                          />
                          <label className="btn btn-outline-success mx-2" htmlFor="mrp_weight_bold">
                            Bold
                          </label>

                        </div>


                      </div>
                    </div>
                 
                    {/* Barcode Number Sart */}



                  </div>


                </div>
                <div className="col-4 mt-3 ">
                <div className="">
                    
                <div className="prouct_name ">
                      <div className=" d-flex ">
                        <div className="form-check form-switch form-switch-md mb-3" dir="ltr">
                          <Input
                            checked={barcodeSettings.barcode_number_status == 1}
                            type="checkbox"
                            className="form-check-input"
                            id="customSwitchsizemd"
                            onChange={(e) => {
                              const value = e.target.checked ? 1 : 2;
                              setBarcodeSettings({
                                ...barcodeSettings,
                                barcode_number_status: value,
                              });
                            }}
                          />
                        </div>

                        <div className="h5">

                          Barcode Number
                        </div>
                      </div>
                      <div className="d-flex  ">
                        <div className="d-flex">
                          <div className="btn btn-outline-primary" style={{ height: "35px" }} onClick={() => decreaseFontSize("barcode_number_size")}>-</div>
                          <Input
                            type="number"
                            value={barcodeSettings.barcode_number_size}
                            onChange={(e) =>
                              setBarcodeSettings({
                                ...barcodeSettings,
                                barcode_number_size: parseInt(e.target.value),
                              })
                            }
                            className="border border-primary "
                            style={{ height: "35px", width: '100px', textAlign: 'center' }}
                          />
                          <div className="btn btn-outline-primary " style={{ height: "35px" }} onClick={() => increaseFontSize("barcode_number_size")}>+</div>
                        </div>


                        <div>
                          <input
                            checked={barcodeSettings.barcode_number_weight == "normal"}
                            type="radio"
                            className="btn-check shadow"
                            value="normal"
                            name="barcode_number_weight"
                            onChange={(e) => {
                              setBarcodeSettings({
                                ...barcodeSettings,
                                barcode_number_weight: e.target.value,
                              });
                            }}
                            id="barcode_number_weight_normal"
                            autoComplete="off"
                          />
                          <label className="btn btn-outline-success mx-2" htmlFor="barcode_number_weight_normal">
                            Normal
                          </label>
                          <input
                            checked={barcodeSettings.barcode_number_weight == "bold"}
                            type="radio"
                            className="btn-check shadow"
                            value="bold"
                            name="barcode_number_weight"
                            onChange={(e) => {
                              setBarcodeSettings({
                                ...barcodeSettings,
                                barcode_number_weight: e.target.value,
                              });
                            }}
                            id="barcode_number_weight_bold"
                            autoComplete="off"
                          />
                          <label className="btn btn-outline-success mx-2" htmlFor="barcode_number_weight_bold">
                            Bold
                          </label>

                        </div>


                      </div>
                    </div>


                    {/* Barcode Number End */}
                 {/* Date STart */}
                 <div className="prouct_name mt-3">
                      <div className=" d-flex ">
                        <div className="form-check form-switch form-switch-md mb-3" dir="ltr">
                          <Input
                            checked={barcodeSettings.date_status == 1}
                            type="checkbox"
                            className="form-check-input"
                            id="customSwitchsizemd"
                            onChange={(e) => {
                              const value = e.target.checked ? 1 : 2;
                              setBarcodeSettings({
                                ...barcodeSettings,
                                date_status: value,
                              });
                            }}
                          />
                        </div>

                        <div className="h5">

                          Date
                        </div>
                      </div>
                      <div className="d-flex  ">
                        <div className="d-flex">
                          <div className="btn btn-outline-primary" style={{ height: "35px" }} onClick={() => decreaseFontSize("date_size")}>-</div>
                          <Input
                            type="number"
                            value={barcodeSettings.date_size}
                            onChange={(e) =>
                              setBarcodeSettings({
                                ...barcodeSettings,
                                date_size: parseInt(e.target.value),
                              })
                            }
                            className="border border-primary "
                            style={{ height: "35px", width: '100px', textAlign: 'center' }}
                          />
                          <div className="btn btn-outline-primary " style={{ height: "35px" }} onClick={() => increaseFontSize("date_size")}>+</div>
                        </div>


                        <div>
                          <input
                            checked={barcodeSettings.date_weight == "normal"}
                            type="radio"
                            className="btn-check shadow"
                            value="normal"
                            name="date_weight"
                            onChange={(e) => {
                              setBarcodeSettings({
                                ...barcodeSettings,
                                date_weight: e.target.value,
                              });
                            }}
                            id="date_weight_normal"
                            autoComplete="off"
                          />
                          <label className="btn btn-outline-success mx-2" htmlFor="date_weight_normal">
                            Normal
                          </label>
                          <input
                            checked={barcodeSettings.date_weight == "bold"}
                            type="radio"
                            className="btn-check shadow"
                            value="bold"
                            name="date_weight"
                            onChange={(e) => {
                              setBarcodeSettings({
                                ...barcodeSettings,
                                date_weight: e.target.value,
                              });
                            }}
                            id="date_weight_bold"
                            autoComplete="off"
                          />
                          <label className="btn btn-outline-success mx-2" htmlFor="date_weight_bold">
                            Bold
                          </label>

                        </div>


                      </div>
                    </div>
                    {/* Date End */}

                    <div className="product_length_ mt-4">
                      <div className=" d-flex ">

                        <div className="h5">

                          Margin Top
                        </div>
                      </div>
                      <div className="d-flex  ">
                        <div className="d-flex">
                          <div className="btn btn-outline-primary" style={{ height: "35px" }} onClick={() => decreaseFontSize("margin_top")}>-</div>
                          <Input
                            type="number"
                            value={barcodeSettings.margin_top}
                            onChange={(e) =>
                              setBarcodeSettings({
                                ...barcodeSettings,
                                margin_top: parseInt(e.target.value),
                              })
                            }
                            className="border border-primary "
                            style={{ height: "35px", width: '100px', textAlign: 'center' }}
                          />
                          <div className="btn btn-outline-primary " style={{ height: "35px" }} onClick={() => increaseFontSize("margin_top")}>+</div>
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
                            value={barcodeSettings.marathi_name_length}
                            onChange={(e) =>
                              setBarcodeSettings({
                                ...barcodeSettings,
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
                            value={barcodeSettings.english_name_length}
                            onChange={(e) =>
                              setBarcodeSettings({
                                ...barcodeSettings,
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
                    {/* Barcoe status end */}

                    <div className="mt-4">
                      <div htmlFor="printer" className="h5">Select Printer: </div>
                      <Select
                        id="printer"
                        placeholder={barcodeSettings.barcode_printer}
                        onChange={(e) => {
                          setBarcodeSettings({
                            ...barcodeSettings,
                            barcode_printer: e.value
                          })
                        }}
                        options={printers.filter(e => e.name != barcodeSettings.barcode_printer).map((printer) => (
                          { label: printer.name, value: printer.name }
                        ))}
                      />
                    </div>
                </div>

                </div>
                <div className="col-4">
                  <div
                    style={{ display: "flex", pageBreakAfter: "always" }}

                  >
                    <div
                      style={{
                        flex: 1,
                        height: "30mm", // Adjusted height for 25mm labels 
                        border: "2px solid black",
                        textAlign: "center",
                        // marginRight: innerIndex === 0 ? "5mm" : "0", // Margin for layout consistency
                      }}
                    >
                      {barcodeSettings.business_name_status == 1 && <small className="fw-bold">
                        <b style={{ fontSize: `${barcodeSettings.business_name_size}px`, fontWeight: `${barcodeSettings.business_name_weight}` }}>
                          {staticData.companyDetails && staticData.companyDetails.business_name}
                        </b>
                      </small>}

                      {barcodeSettings.barcode_status == 1 && <div style={{ marginTop:   `${barcodeSettings.margin_top}px` }}>
                        <svg id={`barcode-${staticData.product_hsn_code}`} />
                      </div>}
                      {barcodeSettings.barcode_number_status == 1 && <small style={{ fontSize: `${barcodeSettings.barcode_number_size}px`, fontWeight: barcodeSettings.barcode_number_weight }}>
                        {staticData.product_hsn_code}
                      </small>}
                      {barcodeSettings.date_status == 1 && <span style={{ fontSize: `${barcodeSettings.date_size}px`, fontWeight: `${barcodeSettings.date_weight}` }}>
                          {"pkd. "}
                          {new Date().toLocaleString("en-US", {
                            day: "2-digit",
                            month: "2-digit",
                            year: "2-digit",
                          }).replace(/(\d+)\/(\d+)\/(\d+)/, "$2/$1/$3")}
                        </span>}
                      {barcodeSettings.product_name_status == 1 && <div style={{ fontSize: `${barcodeSettings.product_name_size}px`, fontWeight: `${barcodeSettings.product_name_weight}`, marginTop: "1px" }}>
                        {staticData.barcodeLanguage === 1
                          ? staticData.marathi_name && staticData.marathi_name.length > 18
                            ? staticData.marathi_name.substring(0, 18) + ".."
                            : staticData.marathi_name
                          : staticData.product_english_name && staticData.product_english_name.length > 18
                            ? staticData.product_english_name.substring(0, 18) + ".."
                            : staticData.product_english_name}
                      </div>}
                      <div style={{ marginTop: "0px", display: "flex", justifyContent: "space-around" }}>
                        {barcodeSettings.mrp_status == 1 && <span style={{ fontSize: `${barcodeSettings.mrp_size}px`, fontWeight: `${barcodeSettings.mrp_weight}`, marginTop: "-5x" }}>
                          MRP.
                          {/* <span style={{ fontSize: `${parseInt(barcodeSettings.sale_price_size)+5}px` }}>{staticData.salePrice}</span> */}
                          <span style={{ fontSize: `${parseInt(barcodeSettings.mrp_size) + 5}px` }}>{staticData.salePrice}</span>
                        </span>}
                        {barcodeSettings.sale_price_status == 1 && <span style={{ fontSize: `${barcodeSettings.sale_price_size}px`, fontWeight: `${barcodeSettings.sale_price_weight}`, marginTop: "-5x" }}>
                          Rate.
                          {/* <span style={{ fontSize: `${parseInt(barcodeSettings.sale_price_size)+5}px` }}>{staticData.salePrice}</span> */}
                          <span style={{ fontSize: `${parseInt(barcodeSettings.sale_price_size) + 5}px` }}>{staticData.salePrice}</span>
                        </span>}
                       
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col-8 mt-3">
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

export default BarcodeSettings;
