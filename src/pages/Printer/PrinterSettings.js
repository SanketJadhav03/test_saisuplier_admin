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

const PrinterSettings = () => {
    useEffect(() => {
        document.title = "Printer Settings | Saisupplier Admin";
        return () => { };
    }, []);

    const saveData = async () => {
        // Convert empty input values to 0
        const sizeValue = size === "" ? "0" : size;
        const marginTopValue = marginTop === "" ? "0" : marginTop;
        const marginBottomValue = marginBottom === "" ? "0" : marginBottom;
        const marginLeftValue = marginLeft === "" ? "0" : marginLeft;
        const marginRightValue = marginRight === "" ? "0" : marginRight;

        localStorage.setItem("bill_size", sizeValue);
        localStorage.setItem("marginTop", marginTopValue);
        localStorage.setItem("marginBottom", marginBottomValue);
        localStorage.setItem("marginLeft", marginLeftValue);
        localStorage.setItem("marginRight", marginRightValue);

        toast.success("Bill size updated successfully!");
    };

    const [size, setSize] = useState("");
    const [marginRight, setMarginRight] = useState("");
    const [marginLeft, setMarginLeft] = useState("");
    const [marginTop, setMarginTop] = useState("");
    const [marginBottom, setMarginBottom] = useState("");

    useEffect(() => {
        const lsValue = localStorage.getItem("bill_size");
        const top = localStorage.getItem("marginTop");
        const bottom = localStorage.getItem("marginBottom");
        const left = localStorage.getItem("marginLeft");
        const right = localStorage.getItem("marginRight");

        setSize(lsValue !== null ? lsValue : "80"); // Default value as a string
        setMarginRight(right !== null ? right : "");
        setMarginLeft(left !== null ? left : "");
        setMarginTop(top !== null ? top : "");
        setMarginBottom(bottom !== null ? bottom : "");
    }, []);

    return (
        <div className="page-content">
            <Container fluid>
                <Row>
                    <Col lg={12}>
                        <Card>
                            <CardHeader className="card-header border-0">
                                <Row className="align-items-center gy-3">
                                    <div className="col-sm">
                                        <h5 className="card-title mb-0">Printer Settings</h5>
                                    </div>
                                    <div className="col-sm-auto">
                                        <div className="d-flex gap-1 flex-wrap"></div>
                                    </div>
                                </Row>
                            </CardHeader>
                            <CardBody className="pt-0">
                                <Label>Bill Size in MM</Label>
                                <Input
                                    name="size"
                                    placeholder="Bill Size in MM"
                                    value={size}
                                    onChange={(e) => setSize(e.target.value)}
                                />
                                <br />
                                <Row>
                                    <Col>
                                        <Label>Margin Left</Label>
                                        <Input
                                            name="marginLeft"
                                            placeholder="Margin Left"
                                            value={marginLeft}
                                            onChange={(e) => setMarginLeft(e.target.value)}
                                        />
                                        <br />
                                    </Col>
                                    <Col>
                                        <Label>Margin Right</Label>
                                        <Input
                                            name="marginRight"
                                            placeholder="Margin Right"
                                            value={marginRight}
                                            onChange={(e) => setMarginRight(e.target.value)}
                                        />
                                        <br />
                                    </Col>
                                    <Col>
                                        <Label>Margin Bottom</Label>
                                        <Input
                                            name="marginBottom"
                                            placeholder="Margin Bottom"
                                            value={marginBottom}
                                            onChange={(e) => setMarginBottom(e.target.value)}
                                        />
                                        <br />
                                    </Col>
                                    <Col>
                                        <Label>Margin Top</Label>
                                        <Input
                                            name="marginTop"
                                            placeholder="Margin Top"
                                            value={marginTop}
                                            onChange={(e) => setMarginTop(e.target.value)}
                                        />
                                        <br />
                                    </Col>
                                </Row>
                                <button
                                    type="button"
                                    className="btn btn-success"
                                    onClick={saveData}
                                >
                                    Save
                                </button>
                                <ToastContainer closeButton={false} limit={1} />
                            </CardBody>
                        </Card>
                    </Col>
                </Row>
            </Container>
        </div>
    );
};

export default PrinterSettings;
