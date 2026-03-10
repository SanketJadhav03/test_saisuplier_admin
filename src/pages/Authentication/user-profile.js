import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  Card,
  CardBody,
  CardHeader,
  Col,
  Container,
  Form,
  Input,
  Label,
  Nav,
  NavItem,
  NavLink,
  Row,
  TabContent,
  TabPane,
} from "reactstrap";
import classnames from "classnames";
import Flatpickr from "react-flatpickr";

//import images
import progileBg from "../../assets/images/profile-bg.jpg";
import avatar1 from "../../assets/images/users/avatar-1.jpg";
import { ToastContainer, toast } from "react-toastify";
import AuthUser from "../../helpers/Authuser";
import { IMG_API_URL } from "../../helpers/url_helper";

const Settings = () => {
  const { http, https, user } = AuthUser();
  const [activeTab, setActiveTab] = useState("1");
  const [userDetail, setUserDetail] = useState({}); 
  useEffect(() => {
    if (sessionStorage.getItem("authUser")) {
      const obj = JSON.parse(sessionStorage.getItem("authUser")); 
      setUserDetail(obj.user);

      http
        .get(`/user/show/${obj.user.user_id}`)
        .then(function (response) {
          setUserDetail(response.data);
        })
        .catch(function (error) {
          console.log(error);
        }); 

    }
  }, []);

  const tabChange = (tab) => {
    if (activeTab !== tab) setActiveTab(tab);
  };

  document.title = "Profile Settings";

  const [tempDetail, setTempDetail] = useState({
    new_pass: "",
    confirm_pass: "",
    old_pass: "",
    user_id: user.user.user_id,
  });
  const getPassword = (e) => {
    setTempDetail({
      ...tempDetail,
      [e.target.name]: e.target.value,
    });
  };
  const changePassword = () => {
    if (tempDetail.new_pass === tempDetail.confirm_pass) {
      http
        .post("/user/update/pass", tempDetail)
        .then((res) => { 
          if (res.data.status == 1) {
            toast.success(res.data.message)
          } else if (res.data.status == 2) {
            toast.warn(res.data.message);
          } else {
            toast.warn(res.data.message);
          }
        }).catch((err) => {
          console.log(err);
        })
    } else {
      toast.error("Password cannot matched");
    }
  };

  const handleData = (e) => {
    setUserDetail({
      ...userDetail,
      [e.target.name]: e.target.value,
    });
  };
 const savePrimaryData = () => {
  const formData = new FormData();

  // Append all fields except file
  for (const key in userDetail) {
    if (userDetail[key] !== undefined && userDetail[key] !== null && key !== 'profile_photo') {
      formData.append(key, userDetail[key]);
    }
  }

  // Conditionally append image if exists
  if (userDetail.profile_photo) {
    formData.append("profile_photo", userDetail.profile_photo); // File object
  }

  https
    .put("/user/update", formData)
    .then(function (response) {
      if (response.data.status === 1) {
        toast.success(response.data.message);
        // window.location.href = window.location.href;
      } else {
        toast.error(response.data.message);
      }
    })
    .catch(function (error) {
      console.log(error);
      toast.error("Something went wrong.");
    });
};

  return (
    <React.Fragment>
      <div className="page-content ">
        <Container fluid>
          <div className="position-relative mx-n4 mt-n4">
            <div className="profile-wid-bg profile-setting-img">
              <img src={progileBg} className="profile-wid-img" alt="" />
            </div>
          </div>
          <Row>
            <Col xxl={3}>
              <Card className="mt-n5 ">
                <CardBody className="p-4">
                  <div className="text-center">
                    <div className="fw-bold profile-user position-relative d-inline-block mx-auto  mb-4">
                      <img
                        src={userDetail.profile_photo && typeof userDetail.profile_photo === 'object' ? URL.createObjectURL(userDetail.profile_photo) : userDetail && userDetail.profile_photo ? `${IMG_API_URL}/users/${userDetail.profile_photo}` : avatar1}
                        className="rounded-circle avatar-xl img-thumbnail user-profile-image"
                        alt="user-profile"
                      />
                      <div className="avatar-xs p-0 rounded-circle profile-photo-edit">
                        <input
                          id="profile-img-file-input"
                          type="file"
                          className="profile-img-file-input"
                          accept="image/png, image/gif, image/jpeg"
                          onChange={(e) => {
                            setUserDetail({
                              ...userDetail,
                              profile_photo: e.target.files[0],
                            })
                          }}
                        />
                        <Label
                          htmlFor="profile-img-file-input"
                          className="profile-photo-edit avatar-xs"
                        >
                          <span className="avatar-title rounded-circle bg-light text-body">
                            <i className="ri-camera-fill"></i>
                          </span>
                        </Label>
                      </div>
                    </div>
                    <h5 className="fs-16 mb-1">{userDetail.full_name}</h5>
                    {/* <p className="text-muted mb-0">Lead Designer / Developer</p> */}
                  </div>
                </CardBody>
              </Card>

            </Col>

            <Col xxl={9}>
              <Card className="mt-xxl-n5">
                <CardHeader>
                  <Nav
                    className="nav-tabs-custom rounded card-header-tabs border-bottom-0"
                    role="tablist"
                  >
                    <NavItem>
                      <NavLink
                        className={classnames({ active: activeTab === "1" })}
                        onClick={() => {
                          tabChange("1");
                        }}
                      >
                        <i className="fas fa-home"></i>
                        Personal Details
                      </NavLink>
                    </NavItem>
                    <NavItem>
                      <NavLink
                        to="#"
                        className={classnames({ active: activeTab === "2" })}
                        onClick={() => {
                          tabChange("2");
                        }}
                        type="button"
                      >
                        <i className="far fa-user"></i>
                        Change Password
                      </NavLink>
                    </NavItem>
                  </Nav>
                </CardHeader>
                <CardBody className="p-4">
                  <TabContent activeTab={activeTab}>
                    <TabPane tabId="1">
                      <Form>
                        <Row>
                          <Col lg={6}>
                            <div className="mb-3">
                              <Label
                                htmlFor="firstnameInput"
                                className="form-label"
                              >
                                First Name
                              </Label>
                              <Input
                                type="text"
                                className="form-control"
                                id="firstnameInput"
                                placeholder="Enter your firstname"
                                name="name"
                                onChange={handleData}
                                value={userDetail.full_name}
                              />
                            </div>
                          </Col>
                          <Col lg={6}>
                            <div className="mb-3">
                              <Label
                                htmlFor="firstnameInput"
                                className="form-label"
                              >
                                Role
                              </Label>
                              <Input
                                readOnly
                                type="text"
                                className="form-control"
                                id="firstnameInput01"
                                placeholder="Enter your firstname"
                                onChange={handleData}
                                value={userDetail.role_name || "User"}
                              />
                            </div>
                          </Col>
                          <Col lg={6}>
                            <div className="mb-3">
                              <Label
                                htmlFor="phonenumberInput"
                                className="form-label"
                              >
                                Phone Number
                              </Label>
                              <Input
                                type="text"
                                className="form-control"
                                id="phonenumberInput"
                                placeholder="Enter your phone number"
                                onChange={handleData}
                                value={userDetail.mobile_number}
                                name="mobile_no"
                              />
                            </div>
                          </Col>
                          <Col lg={6}>
                            <div className="mb-3">
                              <Label
                                htmlFor="emailInput"
                                className="form-label"
                              >
                                Email Address
                              </Label>
                              <Input
                                type="email"
                                className="form-control"
                                id="emailInput"
                                placeholder="Enter your email"
                                onChange={handleData}
                                value={userDetail.email}
                                name="email"
                              />
                            </div>
                          </Col>
                          <button
                            type="button"
                            className="btn btn-primary"
                            onClick={() => savePrimaryData()}
                          >
                            <i className="ri-save-3-line align-bottom me-1"></i>
                            Update
                          </button>
                        </Row>
                      </Form>
                    </TabPane>

                    <TabPane tabId="2">
                      <Form>
                        <Row className="g-2">
                          <Col lg={4}>
                            <div>
                              <Label
                                htmlFor="oldpasswordInput"
                                className="form-label"
                              >
                                Old Password
                              </Label>
                              <Input
                                type="text"
                                className="form-control"
                                id="oldpasswordInput"
                                name="old_pass"
                                placeholder="Old password"
                                onChange={getPassword}
                              />
                            </div>
                          </Col>

                          <Col lg={4}>
                            <div>
                              <Label
                                htmlFor="newpasswordInput"
                                className="form-label"
                              >
                                New Password{" "}
                                <span className="text-danger">*</span>
                              </Label>
                              <Input
                                required
                                type="password"
                                className="form-control"
                                id="newpasswordInput"
                                name="new_pass"
                                onChange={getPassword}
                                placeholder="New password"
                              />
                            </div>
                          </Col>

                          <Col lg={4}>
                            <div>
                              <Label
                                htmlFor="confirmpasswordInput"
                                className="form-label"
                              >
                                Confirm Password{" "}
                                <span className="text-danger">*</span>
                              </Label>
                              <Input
                                required
                                type="password"
                                onChange={getPassword}
                                className="form-control"
                                id="confirmpasswordInput"
                                name="confirm_pass"
                                placeholder="Confirm password"
                              />
                            </div>
                          </Col>

                          <Col lg={12}>
                            <div className="text-end mt-3">
                              <button
                                type="button"
                                className="btn btn-success"
                                onClick={() => changePassword()}
                              >
                                Change Password
                              </button>
                            </div>
                          </Col>
                        </Row>
                      </Form>
                    </TabPane>
                  </TabContent>
                </CardBody>
              </Card>
            </Col>
          </Row>
          <ToastContainer limit={1} />
        </Container>
      </div>
    </React.Fragment>
  );
};

export default Settings;
