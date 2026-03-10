/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState, useCallback } from "react";
import { Card, Modal, ModalHeader, ModalBody, Label, Input, Col, Row } from "reactstrap";
import "react-toastify/dist/ReactToastify.css";
import AuthUser from "../../../helpers/Authuser";
import CustomInput from "../../Unit/Input";
import { toast } from "react-toastify";

const RoleUpdate = (props) => {
    const [modal, setModal] = useState(false);
    const [roleName, setRoleName] = useState(props.edit_data.role_name);
    const { http } = AuthUser();

    const Close = () => {
        setModal(false);
        props.setModalStates();
    };

    const [permissionsList, setPermissionsList] = useState([]);
    const [oldpermissionsList, setoldPermissionsList] = useState([]);

    useEffect(() => {
        setModal(false);
        getPermissionsList();
        getoldPermissionsList();
        toggle();
    }, [props.modalStates]);

    useEffect(() => {
        // Compare old permissions with current permissions
        const initialPermissionsLists = oldpermissionsList.map((oldPermission) => oldPermission.permission_id);
        setPermissionsLists(initialPermissionsLists);
    }, [oldpermissionsList]);

    const getoldPermissionsList = async () => {
        try {
            const apiResponse = await http.get(`/role/show/${props.edit_data.role_id}`);
            setoldPermissionsList(apiResponse.data.rolesAndPermissionsData);
        } catch (error) {
            console.log(error);
        }
    };

    const getPermissionsList = async () => {
        try {
            const apiResponse = await http.get(`/permissions`);
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

    const [permissionsLists, setPermissionsLists] = useState([]);
    const [checkNameStatus, setCheckStatus] = useState({});
    const [msg, setMsg] = useState("");

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

    const handleCheckboxChange = (e) => {
        const permissionId = parseInt(e.target.value);

        const isChecked = permissionsLists.includes(permissionId);

        if (isChecked) {
            setPermissionsLists((prev) => prev.filter((id) => id !== permissionId));
        } else {
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

        let updatedPermissionsLists;
        if (allChecked) {
            updatedPermissionsLists = permissionsLists.filter(
                (id) => !categoryPermissions.includes(id)
            );
        } else {
            updatedPermissionsLists = [
                ...permissionsLists,
                ...categoryPermissions.filter((id) => !permissionsLists.includes(id)),
            ];
        }

        setPermissionsLists(updatedPermissionsLists);

        // Update the state of the category checkbox
        const categoryCheckbox = document.getElementById(category);

        if (categoryCheckbox) {
            categoryCheckbox.checked = !allChecked;
        }
    };

    const renderPermissionTableRows = (category) => {
        // Check if all permissions under this category are checked
        const allPermissionsChecked = permissionsList
            .filter((permission) => permission.permission_category === category)
            .every((permission) => permissionsLists.includes(permission.permission_id));

        return (
            <Col lg={4} style={{ cursor: "pointer" }}>
                <div className="text-uppercase p-2" style={{ backgroundColor: "teal", color: "white" }}>
                    <input
                        type="checkbox"
                        className="m-1"
                        value={category}
                        id={category}
                        onClick={() => handleToggleAll(category)}
                        checked={allPermissionsChecked}
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
                                    onChange={(e) => handleCheckboxChange(e)}
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
        console.log({
            role_id: props.edit_data.role_id,
            role_name: roleName,
            permissionList: permissionsLists,
        });
        
        try {
            const response = await http.put("/role/update", {
                role_id: props.edit_data.role_id,
                role_name: roleName,
                permissionList: permissionsLists,
            });

            if (response.data) {
                toast.error(response.data.error);
                setModal(!modal);
                props.checkchang("Role updated successfully!!");
            } else {
                setModal(!modal);
                props.checkchang("Role updated successfully!!");
            }
        } catch (error) {
            console.error(error);
            toast.error(error.response.error);
            setModal(!modal);
            props.checkchang("Failed to create a role");
        }
    };

    const handleRole = (e) => {
        setCheckStatus({});
        setMsg("");
        setRoleName(e.target.value);
    };

    return (
        <div>
            <Modal id="showModal" size="xl" isOpen={modal} toggle={toggle} centered>
                <ModalHeader className="bg-light p-3 " toggle={toggle}>
                    Update Role
                </ModalHeader>
                <span className="tablelist-form">
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
                                        <Input
                                            id="role-name-field"
                                            className="form-control fw-bold"
                                            placeholder={props.edit_data.role_name}
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
                            name="close"
                            id="close"
                            type="button"
                            className="btn btn-primary"
                            onClick={() => SubmitData()}
                        >
                            <i className="ri-save-3-line align-bottom me-1"></i>
                            Update
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
                </span>
            </Modal>
        </div>
    );
};

export default RoleUpdate;