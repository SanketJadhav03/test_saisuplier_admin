import React, { useState, useEffect } from 'react';
import { Button, Card, CardBody, Col, Container, Input, Row } from 'reactstrap';
import AuthUser from '../../../helpers/Authuser';
import { API_URL } from '../../../helpers/url_helper';
import { useNavigate } from 'react-router-dom'
import { ToastContainer, toast } from 'react-toastify';

const Subscription = () => {
    document.title = "Saisupplier Admin | Activation";
    const { http } = AuthUser(); 

    const navigate = useNavigate();

    const [activationKey, setActivationKey] = useState(null)


    const getActivationKey = async () => {
        if (!navigator.onLine) {
            toast.error("No internet connection available. Please check your internet connection.");
            return;
        }
        const resp = await http.get(`${API_URL}/generate-key`);
        console.log(resp);
        if (resp.data.response.code == 100) {
            toast.warning(resp.data.response.message)
        } else {
            toast.success(resp.data.response.message)
        }
    }

    const handleSubmit = async () => {


        if (activationKey == null) {
            toast.warning("Please generate activation key");
            return;
        }

        try {
            const resp = await http.post(`${API_URL}/set-key`, { key: activationKey });

            if (resp.data.dataResponse.code === 200) {
                toast.success(resp.data.dataResponse.msg);
                navigate("/login");
            } else {
                toast.warning(resp.data.dataResponse.msg);
            }
        } catch (error) {
            console.error("An error occurred:", error);
            toast.error("An error occurred while making the request. Please try again later.");
        }
    }
    return (
        <React.Fragment>
            <ToastContainer />
            <div className="auth-page-wrapper auth-bg-cover py-5 d-flex justify-content-center align-items-center min-vh-100">
                <div className="bg-overlay"></div>
                <div className="auth-page-content overflow-hidden pt-lg-5">
                    <Container>
                        <Row className="justify-content-center">
                            <Col xl={5}>
                                <Card className="overflow-hidden">
                                    <CardBody className="p-4">
                                        <div className="text-center">
                                            <img src="https://img.themesbrand.com/velzon/images/auth-offline.gif" alt="" height="210" />
                                         
                                            <br />
                                            <Button className="btn-border btn btn-danger" onClick={getActivationKey}
                                            ><i className="ri-key align-bottom"></i> Activation Request</Button>
                                            <br />
                                            <br />
                                            <Input
                                                name="activationKey"
                                                className="form-control"
                                                placeholder="Activation Key"
                                                type="text"
                                                value={activationKey}
                                                onChange={(e) => setActivationKey(e.target.value)}
                                            />
                                            <br />
                                            <Button color="success" className="btn-border" onClick={handleSubmit}
                                            ><i className="ri-key align-bottom"></i> Activate</Button>
                                            <br />

                                        </div>
                                    </CardBody>
                                </Card>
                            </Col>
                        </Row>
                    </Container>
                </div>
            </div>
        </React.Fragment>
    );
};

export default Subscription;





























