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
  FormFeedback,
  Alert,
  Spinner,
} from "reactstrap";
import ParticlesAuth from "../AuthenticationInner/ParticlesAuth";
import AuthUser from "../../helpers/Authuser";

//redux
import { useSelector, useDispatch } from "react-redux";

import { Link, useNavigate } from "react-router-dom";
import { API_URL } from "../../helpers/url_helper";
// foouck
// Formik validation
import * as Yup from "yup";
import { useFormik } from "formik";

// actions
import { resetLoginFlag } from "../../store/actions";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer, toast } from "react-toastify";
import logoLight from "../../assets/images/logo.964c5ebf.svg";

import withRouter from "../../Components/Common/withRouter";
import { createSelector } from "reselect";
import axios from "axios";
import { setInvoiceDetails } from "../../store/pos/POSSlice";
import { storePermissions } from "../../store/permissions/PermissionsSlice";

const Login = (props) => {
  const dispatch = useDispatch();
  const [isSyncing, setIsSyncing] = useState(false);
  const { http } = AuthUser();
    const handleSync = () => {
        setIsSyncing(true);
        http.get("/alter/tables").then((res) => {
            console.log("altered");
            setIsSyncing(false)

        }).catch((e) => {
            console.log(e);

        })
    }
  const selectLayoutState = (state) => state.Account;
  const selectLayoutProperties = createSelector(
    selectLayoutState,
    (layout) => ({
      user: layout.user,
      errorMsg: layout.errorMsg,
      loading: layout.loading,
      error: layout.error,
    })
  );
  // Inside your component
  const { user, errorMsg, loading, error } = useSelector(
    selectLayoutProperties
  );

  const navigate = useNavigate();
  const [userLogin, setUserLogin] = useState([]);
  const [passwordShow, setPasswordShow] = useState(false);
  const { checkSubscription } = AuthUser();
  useEffect(() => {
    // checkSubscription().then((resp) => {
    //   if (!resp) {
    //     navigate("/subscription");
    //   }
    // });

    if (user && user) {
      const updatedUserData =
        process.env.REACT_APP_DEFAULTAUTH === "firebase"
          ? user.multiFactor.user.email
          : user.user.email;
      setUserLogin({
        email: updatedUserData,
        password: user.user.confirm_password ? user.user.confirm_password : "",
      });
    }
  }, [user]);

  const validation = useFormik({
    // enableReinitialize : use this flag when initial values needs to be changed
    enableReinitialize: true,

    initialValues: {
      email: userLogin.email || "" || "",
      password: userLogin.password || "" || "",
    },
    validationSchema: Yup.object({
      email: Yup.string().required("Please Enter Your Email"),
      password: Yup.string().required("Please Enter Your Password"),
    }),
    onSubmit: async (values) => {
      // const resp = await checkSubscription();
      // if (!resp) {
      //   toast.error("Your Activation Key is expired !");
      //   return;
      // }
      try {
        // Perform your custom authentication logic here
        const response = await axios.post(`${API_URL}/user/login`, values, {
          headers: {
            "Content-Type": "application/json",
          },
        });
        if (response.statuss === 1501) {
          return toast.error("Your activation key is expired !");
        }
        if (response.statuss === 1500) {
          navigate("/subscription");
          return toast.warning("You are already logged in other device");
        }
        if (response.authentication) {
          sessionStorage.removeItem("authUser");
          sessionStorage.setItem("authUser", JSON.stringify(response));          
          sessionStorage.setItem("token", JSON.stringify(response.token));
          dispatch(setInvoiceDetails(response.invoiceDetails));
          dispatch(storePermissions(response.permissions));
          navigate("/dashboard");
        } else {
          toast.error("Authentication failed");
        }
      } catch (error) {
        toast.error("Authentication failed");
        console.error("Error during authentication:", error);
      }
    },
  });

  useEffect(() => {
    if (error) {
      setTimeout(() => {
        dispatch(resetLoginFlag());
      }, 3000);
    }
  }, [dispatch, error]);

  const [greeting, setGreeting] = useState("");

  useEffect(() => {
    // Get the current hour of the day
    const currentHour = new Date().getHours();

    // Function to determine the appropriate greeting based on the time
    function getGreeting() {
      if (currentHour >= 5 && currentHour < 12) {
        return "Good Morning";
      } else if (currentHour >= 12 && currentHour < 17) {
        return "Good Afternoon";
      } else {
        return "Good Evening";
      }
    }

    // Set the greeting message
    setGreeting(getGreeting());
  }, []);
  document.title = "Saisupplier Admin | Login";
  return (
    <React.Fragment>
      <ParticlesAuth>
        <ToastContainer />
        <div className="auth-page-content">
          <Container>
            <Row>
              <Col lg={12}>
                <div className="text-center  mb-4 text-white-50">
                  <div>
                    <Link to="/" className="d-inline-block auth-logo">
                      <img src={logoLight} alt="" height="150" width="200" />
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
                        Hello <span className="text-success"> {greeting}</span>{" "}
                        ,Welcome Back !
                      </h5>
                    </div>
                    {errorMsg && errorMsg ? (
                      <Alert color="danger"> {errorMsg} </Alert>
                    ) : null}
                    <div className="p-2 mt-4">
                      <Form
                        onSubmit={(e) => {
                          e.preventDefault();
                          validation.handleSubmit();
                          return false;
                        }}
                        action="#"
                      >
                        <div className="mb-3">
                          <Label htmlFor="email" className="form-label">
                            Email
                          </Label>
                          <Input
                            name="email"
                            className="form-control"
                            placeholder="Enter Email"
                            type="text"
                            onChange={validation.handleChange}
                            onBlur={validation.handleBlur}
                            value={validation.values.email || ""}
                            invalid={
                              validation.touched.email &&
                                validation.errors.email
                                ? true
                                : false
                            }
                          />
                          {validation.touched.email &&
                            validation.errors.email ? (
                            <FormFeedback type="invalid">
                              {validation.errors.email}
                            </FormFeedback>
                          ) : null}
                        </div>

                        <div className="mb-3">
                          <Label
                            className="form-label"
                            htmlFor="password-input"
                          >
                            Password
                          </Label>
                          <div className="position-relative auth-pass-inputgroup mb-3">
                            <Input
                              name="password"
                              value={validation.values.password || ""}
                              type={passwordShow ? "text" : "password"}
                              className="form-control pe-5"
                              placeholder="Enter Password"
                              onChange={validation.handleChange}
                              onBlur={validation.handleBlur}
                              invalid={
                                validation.touched.password &&
                                  validation.errors.password
                                  ? true
                                  : false
                              }
                            />
                            {validation.touched.password &&
                              validation.errors.password ? (
                              <FormFeedback type="invalid">
                                {validation.errors.password}
                              </FormFeedback>
                            ) : null}
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
                          <div className="float-end">
                            <Link to="/forgot-password" className="text-muted">
                              Forgot password?
                            </Link>
                          </div>
                        </div>

                        <div className="mt-4">
                          <Button
                            color="success"
                            disabled={error ? null : loading ? true : false}
                            className="btn btn-success w-100"
                            type="submit"
                          >
                            {error ? null : loading ? (
                              <Spinner size="sm" className="me-2">
                                {" "}
                                Loading...{" "}
                              </Spinner>
                            ) : null}
                            Sign In
                          </Button>
                          {isSyncing ? <p className="text-cneter">Please Wait  Syncing....</p> : <div className="text-center mt-4">

"If something's missing, <span style={{ color: 'blue', cursor: 'pointer' }} onClick={handleSync}>Click here to Sync!</span>!"
</div>}
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
    </React.Fragment>
  );
};

export default withRouter(Login);
