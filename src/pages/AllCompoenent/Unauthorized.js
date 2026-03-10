
import React from "react";
import {
    Card,
    CardBody,
    Col,
    Container,
    Row,
} from "reactstrap";
const Unauthorized = () => {
    document.title = "Saisupplier Admin | Unauthorized";
    return (
        <div className="page-content">
            <Container fluid>
                <Row>
                    <Col lg={12}>
                        <Card id="orderList">
                            <CardBody className="pt-0 text-center">
                                <div className="py-5">
                                    <h1>You are not authorized !</h1>
                                </div>
                            </CardBody>
                        </Card>
                    </Col>
                </Row>
            </Container>
        </div >
    );
};

export default Unauthorized;