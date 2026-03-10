import React, { useCallback, useEffect, useRef } from 'react'
import { useState } from 'react';
import AuthUser from "../../../helpers/Authuser";
import { Card, Col, Form, Label, Modal, ModalBody, ModalHeader, Row } from 'reactstrap';
import { toast } from 'react-toastify';
import CustomInput from "../../Unit/Input";

const RoleCreateModal = (props) => {
  const [modal, setModal] = useState(false);
  const [roleName, setRoleName] = useState("");
  const { http } = AuthUser();
  const Close = () => {
    setModal(false);
    props.setModalStates();
  };
  const [permissionsList, setPermissionsList] = useState([]);

  useEffect(() => {
    setModal(false);
    getPermissionsList();
    toggle();
  }, [props.modalStates]);

  // GETTING PERMISSIONS
  const getPermissionsList = async () => {
    try {
      const apiResponse = await http.get("/permissions");
      setPermissionsList(apiResponse.data);
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
  const [permissionsLists, setPermissionsLists] = useState([]);
  const [msg, setMsg] = useState("");
  // console.log(permissionsLists);

  // Function to get unique permission categories
  const getUniquePermissionCategories = () => {
    const uniqueCategories = new Set();
    permissionsList.forEach((permission) => {
      if (permission.permission_category) {
        uniqueCategories.add(permission.permission_category);
      }
    });
    return Array.from(uniqueCategories);
  };
  const uniqueCategories = getUniquePermissionCategories();
  // Function to handle toggling of all checkboxes in a category
  // const handleToggleAll = (category) => {
  //   const categoryPermissions = permissionsList
  //     .filter((permission) => permission.permission_category === category)
  //     .map((permission) => permission.permission_id);

  //   if (categoryPermissions.length > 0) {
  //     const allChecked = categoryPermissions.every((permissionId) =>
  //       permissionsLists.includes(permissionId)
  //     );

  //     const updatedPermissionsLists = allChecked
  //       ? permissionsLists.filter((id) => !categoryPermissions.includes(id))
  //       : [...permissionsLists, ...categoryPermissions];

  //     setPermissionsLists(updatedPermissionsLists);
  //   }
  // };
  const handleCheckboxChange = (e) => {
    const permissionId = parseInt(e.target.value);

    // Check if the permissionId is already in permissionsLists
    const isChecked = permissionsLists.includes(permissionId);

    if (isChecked) {
      // If already checked, remove it from the list
      setPermissionsLists((prev) => prev.filter((id) => id !== permissionId));
    } else {
      // If not checked, add it to the list
      setPermissionsLists((prev) => [...prev, permissionId]);
    }
  };

  const handleToggleAll = (category) => {
    const categoryPermissions = permissionsList
      .filter((permission) => permission.permission_category === category)
      .map((permission) => permission.permission_id);

    const allChecked = categoryPermissions.every((permissionId) =>
      permissionsLists.includes(permissionId)
    );

    if (allChecked) {
      // If all are checked, uncheck all
      const updatedPermissionsLists = permissionsLists.filter(
        (id) => !categoryPermissions.includes(id)
      );
      setPermissionsLists(updatedPermissionsLists);
    } else {
      // If not all are checked, check all while maintaining the original order
      const updatedPermissionsLists = [
        ...permissionsLists,
        ...categoryPermissions.filter((id) => !permissionsLists.includes(id)),
      ];
      setPermissionsLists(updatedPermissionsLists);
    }
  };

  const renderPermissionTableRows = (category) => {
    return (
      <Col lg={4} style={{ cursor: "pointer" }}>
        <div className="text-uppercase p-2" style={{ backgroundColor: "teal", color: "white" }}>
          <input
            type="checkbox"
            className="m-1"
            id={category}
            onClick={() => handleToggleAll(category)}
          />
          &nbsp;
          {category}
        </div>
        <div className="p-2">
          {permissionsList.map((permission) => (
            permission.permission_category === category && (
              <div
                className="d-flex"
                key={permission.permission_id}
                style={{
                  marginBottom: "5px",
                  fontSize: "15px",
                }}
              >
                <input
                  type="checkbox"
                  value={permission.permission_id}
                  onChange={(e) => handleCheckboxChange(e, permission.permission_id)}
                  checked={permissionsLists.includes(permission.permission_id)}
                />&nbsp;&nbsp;
                {permission.permission_name}
              </div>
            )
          ))}
        </div>
      </Col>
    );
  };
  const SubmitData = async () => {
    if (roleName === "") {
      setCheckStatus({
        borderColor: "red",
        borderStyle: "groove",
      });
      setMsg("Role cannot be empty!");
    } else {
      try {
        const response = await http.post("/role/store", {
          role_name: roleName,
          permissionsLists,
        });

        if (response.data.code === 1) { 
          setModal(!modal);
          props.checkchang("Role created successfully!!");
        } else { 
          toast.error("Role Failed to Create!!");
        }
      } catch (error) {
        console.error(error);
        toast.error(error.response.error);
        setModal(!modal);
        props.checkchang("Failed to create a role");
      }
    }
  };

  const handleRole = (e) => {
    setCheckStatus({});
    setMsg("");
    setRoleName(e.target.value);
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
      if (
        (event.altKey && event.key === "c") ||
        (event.altKey && event.key === "C")
      ) {
        event.preventDefault();
        props.setModalStates(false);
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
        <ModalHeader className="bg-light p-3 " toggle={toggle}>
          Add Role
        </ModalHeader>
        <span className="tablelist-form">
          <Form
            onSubmit={(e) => {
              e.preventDefault();
              SubmitData();
              return false;
            }}
            action="#"
          >
            <ModalBody>
              <Card className="border card-border-success p-3 shadow-lg">
                <div className="mb-3">
                  <Row>
                    <Col lg={12}>
                      <Label
                        htmlFor="categoryname-field"
                        className="form-label fw-bold d-flex justify-content-between"
                      >
                        <div>
                          Role Name<span style={{ color: "red" }}> *</span>
                        </div>
                        <div style={{ color: "red" }}>{msg}</div>
                      </Label>
                      <CustomInput
                        checkNameStatus={checkNameStatus}
                        id="role-name-field"
                        className="form-control fw-bold"
                        placeholder="Role Name"
                        type="text"
                        onChange={handleRole}
                      />
                    </Col>

                    <Col lg={12} className="align-middle table-nowrap border shadow table table-hover">
                      <div className="mt-3 ">
                        <Row>
                          {uniqueCategories.map((category) => renderPermissionTableRows(category))}
                        </Row>
                      </div>
                    </Col>
                  </Row>
                </div>
              </Card>
            </ModalBody>
            <div className="modal-footer">
              <button
                ref={submitButtonRef}
                name="submit"
                id="submit"
                type="submit"
                className="btn btn-primary"
              // onClick={() => SubmitData()}
              >
                <i className="ri-save-3-line align-bottom me-1"></i>
                Save
              </button>
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

            </div>
          </Form>
        </span>
      </Modal>
    </div>
  );

}

export default RoleCreateModal