import React, { useEffect, useState } from "react";
import {
    Card,
    CardBody,
    Col,
    Container,
    CardHeader,
    Row,
    Input,
    Label,
} from "reactstrap";
import { toast, ToastContainer } from "react-toastify";
import AuthUser from "../../helpers/Authuser";

const LanguageSettings = () => {
    const { http } = AuthUser();

    const [productNameLanguage, setProductNameLanguage] = useState(1);
    const [billLanguage, setBillLanguage] = useState(1);
    const [showPrice, setShowPrice] = useState(1);
    const [POSBillPrintLanguage, setPOSBillPrintLanguage] = useState(1)


    // GETTING OLD VALUES 
    const getPreviousDetails = async () => {
        const resp = await http.get("/billing-settings/details");
        console.log(resp);
        setProductNameLanguage(resp.data.barcode_product_name_type)
        setBillLanguage(resp.data.pos_bill_language)
        setPOSBillPrintLanguage(resp.data.pos_bill_print_language)
        setShowPrice(resp.data.pos_bill_show_price)
    }

    // shortcuts for opening add form
    useEffect(() => {
        document.title = "Printer Settings | Saisupplier Admin";
        getPreviousDetails();
        return () => {
        };
    }, []);

    const updateSettings = async () => {
        try {
            console.log(POSBillPrintLanguage);
            const response = await http.post("/billing-settings/update", { productNameLanguage, billLanguage, POSBillPrintLanguage,showPrice })
        } catch (error) {
            // console.log(error);
        }
        toast.success("Data updated successfully !")
    }
    const [size, setSize] = useState(null)

    useEffect(() => {
        const lsValue = localStorage.getItem('bill_size')
        if (lsValue != null || lsValue != undefined) {
            setSize(lsValue)
        }
        else {
            setSize(80)
        }
        return () => {
        }
    }, [])

    return (
        <div className="page-content">
            <Container fluid>
                <Row>
                    <Col lg={12}>
                        <Card>
                            <CardHeader className="card-header border-0">
                                <Row className="align-items-center gy-3">
                                    <div className="col-sm">
                                        <h5 className="card-title mb-0">Billing Settings</h5>
                                    </div>
                                    <div className="col-sm-auto">
                                        <div className="d-flex gap-1 flex-wrap">
                                        </div>
                                    </div>
                                </Row>
                            </CardHeader>
                            <CardBody className="pt-0">
                                <Row>
                                    <Col>
                                        <div className="form-group">
                                            <h3>Barcode Settings</h3>
                                            <hr />
                                            <div className="form-check">
                                                <input type="radio" className="form-check-input" id="marathiRadio" name="language" value={productNameLanguage} checked={productNameLanguage === 1 ? true : false} onChange={(e) => setProductNameLanguage(1)} />
                                                <label className="form-check-label" htmlFor="marathiRadio">Marathi</label>
                                            </div>
                                            <div className="form-check">
                                                <input type="radio" className="form-check-input" id="englishRadio" name="language" value={productNameLanguage} checked={productNameLanguage === 2 ? true : false} onChange={(e) => setProductNameLanguage(2)} />
                                                <label className="form-check-label" htmlFor="englishRadio">English</label>
                                            </div>
                                        </div>
                                    </Col>
                                    <Col>
                                        <div className="form-group">
                                            <h3>POS Language</h3>
                                            <hr />
                                           <div className="row">
                                           <div className="col-6">
                                           <div className="form-check">
                                                <input type="radio" className="form-check-input" id="marathiRadio1" name="language1" value={billLanguage} checked={billLanguage === 1 ? true : false} onChange={(e) => setBillLanguage(1)} />
                                                <label className="form-check-label" htmlFor="marathiRadio1">Marathi</label>
                                            </div>
                                            <div className="form-check">
                                                <input type="radio" className="form-check-input" id="englishRadio1" name="language1" value={billLanguage} checked={billLanguage === 2 ? true : false} onChange={(e) => setBillLanguage(2)} />
                                                <label className="form-check-label" htmlFor="englishRadio1">English</label>
                                            </div>
                                            <div className="form-check">
                                                <input type="radio" className="form-check-input" id="bothRadio1" name="language1" value={billLanguage} checked={billLanguage === 3 ? true : false} onChange={(e) => setBillLanguage(3)} />
                                                <label className="form-check-label" htmlFor="bothRadio1">Both</label>
                                            </div>
                                           </div>
                                           <div className="col-6">
                                           <div className="form-check">
                                                <input type="radio" 
                                                className="form-check-input" id="showPrice1" name="showPrice" value={showPrice} checked={showPrice == 1 ? true : false} onChange={(e) => setShowPrice(1)} />
                                                <label className="form-check-label" htmlFor="marathiRadio1">MRP</label>
                                            </div>
                                            <div className="form-check">
                                                <input type="radio" className="form-check-input" id="showPrice1" name="showPrice" value={showPrice} checked={showPrice == 2 ? true : false} onChange={(e) => setShowPrice(2)} />
                                                <label className="form-check-label" htmlFor="showPrice1">Sale Price</label>
                                            </div>
                                            <div className="form-check">
                                                <input type="radio" className="form-check-input" id="showPrice1" name="showPrice" value={showPrice} checked={showPrice == 3 ? true : false} onChange={(e) => setShowPrice(3)} />
                                                <label className="form-check-label" htmlFor="showPrice1">Both</label>
                                            </div>
                                            
                                           </div>
                                           </div>
                                        </div>
                                    </Col>
                                    <Col>
                                        <div className="form-group">
                                            <h3>Bill Print Language</h3>
                                            <hr />

                                            <div className="form-check">
                                                <input type="radio" className="form-check-input" id="billPrint1" name="billPrint" value={POSBillPrintLanguage} checked={POSBillPrintLanguage === 1 ? true : false} onChange={(e) => setPOSBillPrintLanguage(1)} />
                                                <label className="form-check-label" htmlFor="billPrint1">Marathi</label>
                                            </div>
                                            <div className="form-check">
                                                <input type="radio" className="form-check-input" id="billPrint2" name="billPrint" value={POSBillPrintLanguage} checked={POSBillPrintLanguage === 2 ? true : false} onChange={(e) => setPOSBillPrintLanguage(2)} />
                                                <label className="form-check-label" htmlFor="billPrint2">English</label>
                                            </div>
                                            <div className="form-check">
                                                <input type="radio" className="form-check-input" id="billPrint3" name="billPrint" value={POSBillPrintLanguage} checked={POSBillPrintLanguage === 3 ? true : false} onChange={(e) => setPOSBillPrintLanguage(3)} />
                                                <label className="form-check-label" htmlFor="billPrint3">Both</label>
                                            </div>
                                        </div>
                                    </Col>
                                </Row>
                                <br />
                                <button type="button" className="btn btn-success" onClick={updateSettings}>Save</button>
                                <ToastContainer closeButton={false} limit={1} />
                            </CardBody>
                        </Card>
                    </Col>
                </Row>
            </Container>
        </div>
    );
};

export default LanguageSettings;