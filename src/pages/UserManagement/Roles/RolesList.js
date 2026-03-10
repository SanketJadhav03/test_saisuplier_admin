import React, { useState } from "react";
import {
    Card,
    CardBody,
    Col,
    Container,
    CardHeader,
    Nav,
    Row,
} from "reactstrap";
import { toast, ToastContainer } from "react-toastify";
import DeleteModal from "../../../Components/Common/DeleteModal";
import RoleUpdate from "./RoleUpdate";
import AuthUser from "../../../helpers/Authuser";
import { useEffect } from "react";
import RoleCreateModal from "./RoleCreateModal";
import jsPDF from "jspdf";

const RolesList = () => {
    const [modalStates, setModalStates] = useState(false);
    const [UpdatemodalStates, setUpdateModalStates] = useState(false);
    const { http } = AuthUser();
    
    //   Delete Aleart
    const [deleteModal, setDeleteModal] = useState(false);
    const [ID, SetID] = useState();
    const onClickDelete = (data) => {
        SetID(data);
        setDeleteModal(true);
    };
    const handleDeleteOrder = (data) => {
        if (data._reactName === "onClick") {
            http
                .delete(`/role/delete/${ID}`)
                .then(function (response) {
                    if (response.data.status === 0) {
                        toast.success(response.data.message);
                    } else {
                        toast.warn(response.data.message);
                    }
                    Setcounts(counts + 1);
                })
                .catch(function (error) {
                    console.log(error);
                });
        }
        setDeleteModal(false);
    };

    //   end Alert
    const handleCallback = (data) => {
        toast.success(data);
        setModalStates(false);
        setUpdateModalStates(false);
        Setcounts(counts + 1);
        getRoles();
    };

    const [counts, Setcounts] = useState(1);
    const [Role, setRole] = useState([]);
    useEffect(() => {
        document.title = "Roles | Institute";
        getRoles();
    }, [counts]);

    const getRoles = () => {
        http
            .get("/role/list")
            .then(function (response) {
                setRole(response.data);
            })
            .catch(function (error) {
                console.log(error);
            });
    };

    // Edit Data
    const [FindData, SetFind] = useState([]);
    const EditUpdate = (index) => {
        let FindArray = Role.filter((_, i) => i === index);
        SetFind(FindArray[0]);
        setUpdateModalStates(!UpdatemodalStates);
    };

    // shortcuts for opening add form
    useEffect(() => {
        const handleKeyDown = (event) => {
            if (
                (event.altKey && event.key === "a") ||
                (event.altKey && event.key === "A")
            ) {
                event.preventDefault();
                setModalStates(true);
            }
        };

        window.addEventListener("keydown", handleKeyDown);

        return () => {
            window.removeEventListener("keydown", handleKeyDown);
        };
    }, []);
    //   end Alert
    const generatePDF = () => {
        const doc = new jsPDF();

        // Set table headers
        const headers = [
            "#",
            "role_name",
        ];
        // Set table rows
        const data = Role.map((item, index) => [
            index + 1,
            item.role_name,
        ]);

        // Set table style
        doc.setFontSize(12);
        doc.text("role List", 14, 15);
        doc.autoTable({
            head: [headers],
            body: data,
            startY: 20,
        });

        // Save the PDF
        doc.save("roleList.pdf");

        toast.success("PDF generated successfully!");
    };

    const convertToCSVexcel = () => {
        let csvContent =
            "#,role_name";

        Role.forEach((item, index) => {
            csvContent += `${index + 1},"${item.role_name}" \n`;
        });

        const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });

        const link = document.createElement("a");
        if (link.download !== undefined) {
            const url = URL.createObjectURL(blob);
            link.setAttribute("href", url);
            link.setAttribute("download", "roleList.csv");
            link.style.visibility = "hidden";
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        }
        toast.success("CSV generated successfully!");
    };
    return (
        <div className="page-content">
            <DeleteModal
                show={deleteModal}
                onDeleteClick={handleDeleteOrder}
                onCloseClick={() => setDeleteModal(false)}
            />
            <Container fluid>
                <Row>
                    <Col lg={12}>
                        <Card>
                            <CardHeader className="card-header border-0">
                                <Row className="align-items-center gy-3">
                                    <div className="col-sm">
                                        <h5 className="card-title mb-0">Role </h5>
                                    </div>
                                    <div className="col-sm-auto">
                                        <div className="d-flex gap-1 flex-wrap">
                                            {/* {permission.find(permission => permission.permission_category === "ROLES" && permission.permission_path == "2") && ( */}
                                                <button
                                                    type="button"
                                                    className="btn fw-bold btn-success add-btn"
                                                    id="create-btn"
                                                    onClick={() => setModalStates(!modalStates)}
                                                >
                                                    <i className="ri-add-line align-bottom me-1"></i> Add
                                                    Role
                                                </button>
                                                {/* )} */}
                                            <button
                                                type="button"
                                                className="btn fw-bold btn-info add-btn"
                                                id="create-btn"
                                                onClick={convertToCSVexcel}
                                            >
                                                <i className="ri-file-download-line align-bottom me-1"></i>{" "}
                                                Export
                                            </button>
                                            <button
                                                type="button"
                                                className="btn fw-bold btn-danger add-btn"
                                                id="create-btn"
                                                onClick={generatePDF}
                                            >
                                                <i className="ri-file-download-line align-bottom me-1"></i>{" "}
                                                PDF
                                            </button>
                                        </div>
                                    </div>
                                </Row>
                            </CardHeader>

                            <CardBody className="pt-0">
                                <div>
                                    <Nav
                                        className="nav-tabs nav-tabs-custom nav-success"
                                        role="tablist"
                                    ></Nav>
                                    {/* {permission.find(permission => permission.permission_category === "ROLES" && permission.permission_path === "1") && ( */}
                                        <table
                                            role="table"
                                            className="align-middle table-nowrap table table-hover"
                                        >
                                            <thead className="table-light text-muted text-uppercase">
                                                <tr>
                                                    <th title="Toggle SortBy" style={{ cursor: "pointer" }}>
                                                        #
                                                    </th>
                                                    <th title="Toggle SortBy" style={{ cursor: "pointer" }}>
                                                        Role Name
                                                    </th>
                                                    <th>Action</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {Role.map((item, index) => (
                                                    <tr key={index}>
                                                        <td>
                                                            <a
                                                                className="fw-medium link-primary"
                                                                href="/apps-ecommerce-order-details"
                                                            >
                                                                {index + 1}
                                                            </a>
                                                        </td>
                                                        <td>{item.role_name}</td>
                                                        <td>
                                                            <ul className="list-inline hstack gap-2 mb-0">
                                                                <li className="list-inline-item edit">
                                                                    {/* {permission.find(permission => permission.permission_category === "ROLES" && permission.permission_path === "3") && ( */}
                                                                        <button
                                                                            className="text-primary d-inline-block edit-item-btn border-0 bg-transparent"
                                                                            onClick={() => EditUpdate(index)}
                                                                        >
                                                                            <i className="ri-pencil-fill fs-16" />
                                                                        </button>
                                                                        {/* )} */}
                                                                </li>
                                                                <li className="list-inline-item">
                                                                    {/* {permission.find(permission => permission.permission_category === "ROLES" && permission.permission_path === "4") && ( */}
                                                                       {item.role_id != 1 ? (
                                                                            <button
                                                                                onClick={() => onClickDelete(item.role_id)}
                                                                                className="text-danger d-inline-block remove-item-btn  border-0 bg-transparent"
                                                                            >
                                                                                <i className="ri-delete-bin-5-fill fs-16" />
                                                                            </button>
                                                                        ) : (
                                                                            ""
                                                                        )}
                                                                        {/* )} */}
                                                                </li>
                                                            </ul>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    {/* )} */}
                                </div>

                                {modalStates === true ? (
                                    <RoleCreateModal
                                        modalStates={modalStates}
                                        setModalStates={() => {
                                            setModalStates(false);
                                        }}
                                        checkchang={handleCallback}
                                    />
                                ) : (
                                    ""
                                )}
                                {UpdatemodalStates === true ? (
                                    <RoleUpdate
                                        modalStates={UpdatemodalStates}
                                        setModalStates={() => {
                                            setUpdateModalStates(false);
                                        }}
                                        checkchang={handleCallback}
                                        edit_data={FindData}
                                    />
                                ) : (
                                    ""
                                )}
                            </CardBody>
                        </Card>
                    </Col>
                </Row>
            </Container>
        </div>
    );
};

export default RolesList;