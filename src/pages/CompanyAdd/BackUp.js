import React, { useEffect, useState } from "react";
import {
  Card,
  CardBody,
  Col,
  Container,
  Input,
  Label,
  Row,
  Button,
  Form,
  Modal,
  ModalBody,
} from "reactstrap";
import ParticlesAuth from "../AuthenticationInner/ParticlesAuth";
import AuthUser from "../../helpers/Authuser";
//redux
import { Link, useNavigate } from "react-router-dom";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer, toast } from "react-toastify";
import logoLight from "../../assets/images/logo-light.png";
import IconBxSync from "../../Layouts/Sync";

const BackUp = () => {
  const navigate = useNavigate();
  const [userLogin, setUserLogin] = useState([]);
  const [clicked, setClicked] = useState(false);
  const [passwordShow, setPasswordShow] = useState(false);
  const { http } = AuthUser();
  document.title = "Saisupplier Admin | BackUp";
  const [Btn, SetBtn] = useState(false);
  const [bpos_id, setBpos_id] = useState("");
  const [counts, setcounts] = useState(1);
  const OnSubmit = () => {
    SetBtn(true);
    setClicked(true);
    http
      .post(`/check/back-up`, userLogin)
      .then(function (response) {
        if (response.data.status == 3) {
          setBpos_id(response.data.data.user_id);
          setcounts(counts + 1);
        } else {
          toast.error(response.data.msg);
          setClicked(false);
        }
        SetBtn(false);
      })
      .catch(function (error) {
        console.log(error);
        SetBtn(false);
        toast.error("Contect to admin");
        setClicked(false);
      });
  };
  useEffect(() => {
    if (bpos_id) {
      console.log("hiii");
      http
        .post(`/gets`, { id: bpos_id })
        .then(function (response) {
          toast.success("Sync Successfully Login Now !!");
          setClicked(false);
          navigate("/login");
        })
        .catch(function (error) {
          console.log(error);
        });
    }
  }, [counts, bpos_id]);

  useEffect(() => {
    const handleKeyPress = (e) => {
      if ((e.ctrlKey && e.key === "r") || (e.ctrlKey && e.key === "R")) {
        e.preventDefault();
      }
    };

    document.addEventListener("keydown", handleKeyPress);

    return () => {
      document.removeEventListener("keydown", handleKeyPress);
    };
  }, []);
  return (
    <React.Fragment>
      <ParticlesAuth>
        <ToastContainer />
        <div className="auth-page-content">
          <Container>
            <Row>
              <Col lg={12}>
                <div className="text-center mt-sm-5 mb-4 text-white-50">
                  <div>
                    <Link to="/" className="d-inline-block auth-logo">
                      <img src={logoLight} alt="" height="100" width="300" />
                    </Link>
                  </div>
                </div>
              </Col>
            </Row>

            <Row className="justify-content-center">
              <Col md={8} lg={6} xl={5}>
                <Card className="mt-4">
                  <CardBody className="p-4">
                    <div className="text-center mt-2">
                      <h5 className="text-primary">
                        Enter User Name And Password And BackUp Now
                      </h5>
                    </div>
                    <div className="p-2 mt-4">
                      <Form
                        onSubmit={(e) => {
                          e.preventDefault();
                        }}
                        action="#"
                      >
                        <div className="mb-3">
                          <Label htmlFor="email" className="form-label">
                            BackUp Email
                          </Label>
                          <Input
                            name="email"
                            className="form-control"
                            placeholder="Enter Email"
                            type="text"
                            required={true}
                            onChange={(e) => {
                              setUserLogin({
                                ...userLogin,
                                email: e.target.value,
                              });
                            }}
                          />
                        </div>

                        <div className="mb-3">
                          <Label
                            className="form-label"
                            htmlFor="password-input"
                          >
                            BackUp Password
                          </Label>
                          <div className="position-relative auth-pass-inputgroup mb-3">
                            <Input
                              name="password"
                              type={passwordShow ? "text" : "password"}
                              className="form-control pe-5"
                              placeholder="Enter Password"
                              required={true}
                              onChange={(e) => {
                                setUserLogin({
                                  ...userLogin,
                                  password: e.target.value,
                                });
                              }}
                            />
                            <button
                              className="btn btn-link position-absolute end-0 top-0 text-decoration-none text-muted"
                              type="button"
                              id="password-addon"
                              onClick={() => setPasswordShow(!passwordShow)}
                            >
                              <i className="ri-eye-fill align-middle"></i>
                            </button>
                          </div>
                        </div>

                        <div className="form-check">
                          <Input
                            className="form-check-input"
                            type="checkbox"
                            value=""
                            id="auth-remember-check"
                          />
                          <Label
                            className="form-check-label"
                            htmlFor="auth-remember-check"
                          >
                            Remember me
                          </Label>
                        </div>

                        <div className="mt-4">
                          <Button
                            color="success"
                            disabled={Btn}
                            className="btn btn-success w-100"
                            type="submit"
                            onClick={OnSubmit}
                          >
                            Back Up Now
                          </Button>
                          <Link
                            to={"/"}
                            color="primary"
                            className="btn btn-primary w-100 mt-2"
                            type="submit"
                          >
                            Back
                          </Link>
                        </div>
                      </Form>
                    </div>
                  </CardBody>
                </Card>
              </Col>
            </Row>
          </Container>
        </div>
      </ParticlesAuth>
      <Modal isOpen={clicked} centered={true}>
        <ModalBody className="py-3 px-5 mt-2">
          <div className="mt-2 text-center">
            <img
              src={require("../../assets/images/red.jpg")}
              alt="worng.png"
              width="40%"
            />
            <div className="mt-4 pt-2 fs-15 mx-4 mx-sm-5">
              <h4>Don't Colse App</h4>
              <p className="text-muted mx-4 mb-0">
                Processing For Backup Don't Close application{" "}
              </p>
              <h4>
                <IconBxSync className={"clickedss"}></IconBxSync>
              </h4>
            </div>
          </div>
        </ModalBody>
      </Modal>
    </React.Fragment>
  );
};

export default BackUp;
