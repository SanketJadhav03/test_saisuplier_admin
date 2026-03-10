import React, { useEffect, useState, useCallback } from "react";
import {
  Card,
  Modal,
  ModalHeader,
  ModalBody,
  Label,
  Input,
  Row,
  Col,
} from "reactstrap";
import "react-toastify/dist/ReactToastify.css";
import { toast } from "react-toastify";
import AuthUser from "../../../helpers/Authuser";
import CustomInput from "../../Unit/Input";
import { useRef } from "react";
import Select from "react-select";

const UserUpdate = (props) => {
  const [modal, setModal] = useState(false);
  const [rolesList, setRolesList] = useState([]);
  const [roleName, setUserName] = useState("");
  const { http } = AuthUser();
  const [usersData, setUsersData] = useState(props.edit_data);
  const Close = () => {
    setModal(false);
    props.setModalStates();
  };
  useEffect(() => {
    setModal(false);
    getRolesList();
    toggle();
  }, [props.modalStates]);

  // GETTING ROLES LIST
  const getRolesList = async () => {
    try {
      const apiResponse = await http.get("/role/list");
      setRolesList(apiResponse.data);
    } catch (error) {
      console.log(error);
    }
  };
  const toggle = useCallback(() => {
    if (modal) {
      setModal(false);
      props.setModalStates();
    } else {
      setModal(true);
    }
  }, [modal]);

  const [checkNameStatus, setCheckStatus] = useState({});
  const [msg, setMsg] = useState("");
  const SubmitData = () => {
    if (usersData.full_name === "") {
      setCheckStatus({
        borderColor: "red",
        borderStyle: "groove",
      });
      setMsg("User cannot be empty!");
    } else {
      http
        .put("/user/update", usersData)
        .then(function (response) {
          if (response.data.status != 1) {
            toast.error(response.data.error);
          } else {
            props.checkchang("User update successfully!!");
          }
        })
        .catch(function (error) {
          console.log(error);
        });
    }
  };
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
        props.setModalStates(false);
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
      <Modal id="showModal" size="xl" isOpen={modal} toggle={toggle} centered>
        <ModalHeader className="bg-light p-3" toggle={toggle}>
          Update User
        </ModalHeader>
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
                      name="full_name"
                      value={usersData.full_name}
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
                      name="email"
                      value={usersData.email}
                      onChange={handleUser}
                    />
                  </Col>
                  <Col lg={6}>
                    <Label
                      htmlFor="categoryname-field"
                      className="form-label fw-bold d-flex justify-content-between  mt-2"
                    >
                      User Mobile No
                    </Label>
                    <Input
                      id="role-name-field"
                      className="form-control fw-bold"
                      placeholder="User Mobile No"
                      type="text"
                      name="mobile_number"
                      value={usersData.mobile_number}
                      onChange={handleUser}
                    />
                  </Col>
                  <Col lg={6}>
                    <Label
                      htmlFor="categoryname-field"
                      className="form-label fw-bold d-flex justify-content-between  mt-2"
                    >
                      User Role
                    </Label>
                    <Select
                      options={rolesList.map((role) => ({
                        value: role.role_id,
                        label: role.role_name,
                      }))}
                      placeholder={usersData.role_name}
                      name="customer_group_type"
                      id="customer_group_type"
                      className=" fw-bold"
                      onChange={(opt) =>
                        setUsersData({ ...usersData, role: opt.value })
                      }
                    />
                  </Col>
                  <Col lg={12}>
                    <Label
                      htmlFor="user-password-field"
                      className="form-label fw-bold d-flex justify-content-between mt-2"
                    >
                      Password
                    </Label>
                    <Input
                      id="user-password-field"
                      className="form-control fw-bold"
                      placeholder="Enter Password"
                      type="password"
                      value={usersData.password}
                      name="user_password"
                      onChange={(e) =>{
                        setUsersData({ ...usersData, password: e.target.value })
                      }}
                    />
                  </Col>
                </Row>
              </div>
            </Card>
          </ModalBody>
          <div className="modal-footer">
            <button
              name="close"
              id="close"
              type="button"
              className="btn btn-danger"
              onClick={() => Close()}
            >
              <i className="ri-close-line me-1 align-middle" />
              Close
            </button>
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
    </div>
  );
};

export default UserUpdate;
