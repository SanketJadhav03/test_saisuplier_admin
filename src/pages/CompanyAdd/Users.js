import React, { useEffect, useState, useCallback } from "react";
import { Card, Modal, ModalBody, Label, Input, Row, Col } from "reactstrap";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer, toast } from "react-toastify";
import { useRef } from "react";
import Select from "react-select";
import AuthUser from "../../helpers/Authuser";
import CustomInput from "../Unit/Input";
import { Link, useNavigate } from "react-router-dom";

const Users = (props) => {
  const [modal, setModal] = useState(true);
  const [rolesList, setRolesList] = useState([]);
  const [passwordShow, setPasswordShow] = useState(false);
  const { https, http } = AuthUser();
  const redirect = useNavigate();
  const [usersData, setUsersData] = useState({
    user_role: 1,
    user_name: "",
    user_email: "",
    user_password: "",
  });
  useEffect(() => {
    setModal(true);
    getRolesList();
    toggle();
  }, [props.modalStates]);

  // GETTING ROLES LIST
  const getRolesList = async () => {
    try {
      const apiResponse = await https.get("/role/list");
      setRolesList(apiResponse.data);
    } catch (error) {
      console.log(error);
    }
  };
  const toggle = useCallback(() => {
    if (modal) {
      setModal(true);
    } else {
      setModal(true);
    }
  }, [modal]);

  const [checkNameStatus, setCheckStatus] = useState({});
  const [msg, setMsg] = useState("");
  const SubmitData = () => {
    if (usersData.user_name === "") {
      setCheckStatus({
        borderColor: "red",
        borderStyle: "groove",
      });
      setMsg("User cannot be empty!");
    } else {
      http
        .post("/user/register", usersData)
        .then(async function (response) {
          console.log(response.data);
          if (response.data.status === 1) {
            toast.error(response.data.msg);
          } else {
            toast.success(response.data.msg);
            redirect("/company");
          }
        })
        .catch(function (error) {
          console.log(error);
        });
    }
  };
  useEffect(() => {
    http
      .get(`/check/nows`)
      .then(function (response) {
        if (response.data.status) {
          redirect("/login");
        }
      })
      .catch(function (error) {
        console.log(error);
      });
  }, []);
  const handleUser = (e) => {
    setCheckStatus({});
    setMsg("");
    setUsersData({ ...usersData, [e.target.name]: e.target.value });
  };

  // shortcuts for save and close
  const submitButtonRef = useRef();
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.altKey && event.key === "Escape") {
        event.preventDefault();
      }
      if (
        (event.altKey && event.key === "s") ||
        (event.altKey && event.key === "S")
      ) {
        event.preventDefault();
        submitButtonRef.current.click();
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  return (
    <div>
      <Modal id="showModal" size="xl" isOpen={modal}>
        <div className="text-center">
          <img
            src={require("../../assets/images/logo-light2.png")}
            className="profile-wid-img"
            alt=""
          />
        </div>
        <div className="bg-light p-3 text-center fs-2">Create Admin</div>
        <span className="tablelist-form">
          <ModalBody>
            <Card className="border card-border-success p-3 shadow-lg">
              <div className="mb-3">
                <Row>
                  <Col lg={6}>
                    <Label
                      htmlFor="categoryname-field"
                      className="form-label fw-bold d-flex justify-content-between  mt-2"
                    >
                      <div>
                        User Name<span style={{ color: "red" }}> *</span>
                      </div>
                      <div style={{ color: "red" }}>{msg}</div>
                    </Label>
                    <CustomInput
                      checkNameStatus={checkNameStatus}
                      id="role-name-field"
                      className="form-control fw-bold"
                      placeholder="User Name"
                      type="text"
                      name="user_name"
                      onChange={handleUser}
                    />
                  </Col>
                  <Col lg={6}>
                    <Label
                      htmlFor="categoryname-field"
                      className="form-label fw-bold d-flex justify-content-between  mt-2"
                    >
                      User Email
                    </Label>
                    <Input
                      id="role-name-field"
                      className="form-control fw-bold"
                      placeholder="User Email"
                      type="text"
                      name="user_email"
                      onChange={handleUser}
                    />
                  </Col>
                  <Col lg={6}>
                    <Label
                      htmlFor="categoryname-field"
                      className="form-label fw-bold d-flex justify-content-between  mt-2"
                    >
                      Mobile No
                    </Label>
                    <Input
                      id="role-name-field"
                      className="form-control fw-bold"
                      placeholder="Mobile No"
                      type="number"
                      name="user_mobile"
                      onChange={handleUser}
                    />
                  </Col>
                  <Col lg={6}>
                    <Label
                      htmlFor="categoryname-field"
                      className="form-label fw-bold d-flex justify-content-between  mt-2"
                    >
                      Role
                    </Label>
                    <Select
                      placeholder={rolesList[0] ? rolesList[0].role_name : ""}
                      options={rolesList.map((role) => ({
                        value: role.role_id,
                        label: role.role_name,
                      }))}
                      name="customer_group_type"
                      id="customer_group_type"
                      className=" fw-bold"
                      onChange={(opt) =>
                        setUsersData({ ...usersData, user_role: opt.value })
                      }
                    />
                  </Col>
                  <Col lg={12}>
                    <Label
                      htmlFor="categoryname-field"
                      className="form-label fw-bold d-flex justify-content-between  mt-2"
                    >
                      Password
                    </Label>
                    <span className="d-flex">
                      <Input
                        id="role-name-field"
                        className="form-control fw-bold"
                        placeholder="Password"
                        type={passwordShow ? "text" : "password"}
                        name="user_password"
                        onChange={handleUser}
                      />
                      <button
                        className="btn btn-success text-white position-absolute end-0 top-2"
                        type="button"
                        id="password-addon"
                        onClick={() => setPasswordShow(!passwordShow)}
                      >
                        <i className="ri-eye-fill align-middle"></i>
                      </button>
                    </span>
                  </Col>
                  <Col lg={12} className="mt-3 text-end">
                    <Link
                      to={"/back-up"}
                      className="fs-5"
                      style={{ textDecoration: "underline" }}
                    >
                      you have already registered backup Now
                    </Link>
                  </Col>
                </Row>
              </div>
            </Card>
          </ModalBody>
          <div className="modal-footer">
            <button
              ref={submitButtonRef}
              name="close"
              id="close"
              type="button"
              className="btn btn-primary"
              onClick={() => SubmitData()}
            >
              <i className="ri-save-3-line align-bottom me-1"></i>
              Save
            </button>
          </div>
        </span>
      </Modal>
      <ToastContainer closeButton={false} limit={1} />
    </div>
  );
};

export default Users;
