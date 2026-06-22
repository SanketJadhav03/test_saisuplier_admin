import React, { useEffect, useState } from "react";
import {
  Card,
  CardBody,
  Col,
  Container,
  CardHeader,
  Row,
  Button,
} from "reactstrap";
import { toast, ToastContainer } from "react-toastify";
import DeleteModal from "../../Components/Common/DeleteModal";
import LabelPrint from "../purchase/LabelPrint";
import UserAddModal from "./UserAddModal";
import UserViewModal from "./UserViewModal";
import UserEditModal from "./UserEditModal";
import AuthUser from "../../helpers/Authuser";

const UserList = () => {
  const [modalStates, setModalStates] = useState(false);
  const [updateModalStates, setUpdateModalStates] = useState(false);
  const [viewModalStates, setViewModalStates] = useState(false);
  const [deleteModal, setDeleteModal] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const { http, permission } = AuthUser();

  const [userIDToDelete, setUserIDToDelete] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);

  const [users, setUsers] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMoreUsers, setHasMoreUsers] = useState(true);
  const [refreshCounter, setRefreshCounter] = useState(0);

  // Fetch users with pagination
  const fetchUsers = () => {
    http
      .get(`/users/list`)
      .then((response) => {
        const fetched = response.data?.data || [];

        setUsers(fetched);
        console.log(users);
      })
      .catch((err) => {
        console.error("Failed to fetch users", err);
        setHasMoreUsers(false);
      });
  };

  // Initial & refresh fetch
  useEffect(() => {
    setUsers([]);
    setPage(1);
    setHasMoreUsers(true);
    fetchUsers();
  }, [refreshCounter]);

  // Delete user and their contacts
  const handleDelete = async () => {
    await http
      .delete(`/users/delete/${userIDToDelete}`)
      .then(() => {
        toast.success("User deleted successfully");
        setUsers([]);
        setPage(1);
        setHasMoreUsers(true);
        setRefreshCounter((prev) => prev + 1);
      })
      .catch((error) => {
        console.log("error: ", error);
        toast.error("Failed to delete user");
      })
      .finally(() => setDeleteModal(false));
  };

  const handleCallback = (msg, status) => {
    toast["success"](msg);
    setModalStates(false);
    setUpdateModalStates(false);
    setViewModalStates(false);
    setUsers([]);
    setPage(1);
    setHasMoreUsers(true);
    setRefreshCounter((prev) => prev + 1);
  };

  const handleKeyDown = (e) => {
    if (e.altKey && e.key === "a") {
      e.preventDefault();
      setModalStates(true);
    }
  };

  useEffect(() => {
    document.title = "Users | Admin Panel";
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <div className="page-content">
      <DeleteModal
        show={deleteModal}
        onDeleteClick={handleDelete}
        onCloseClick={() => setDeleteModal(false)}
      />
      <Container fluid>
        <Row>
          <Col lg={12}>
            <Card>
              <CardHeader className="card-header border-0">
                <Row className="align-items-end gy-3">
                  <div className="col-sm d-flex align-items-center justify-content-between gap-2">
                    <div>
                      <h5 className="card-title mb-0">Users</h5>
                    </div>
                    <div className="d-flex gap-1 w-50">
                      <div className="w-100">
                        <div className="fw-bold mb-1">
                          Search by Name / Unique Id / Mobile Number / Email /
                          Ifsc Code
                        </div>
                        <input
                          type="search"
                          placeholder="Search by Name / Unique Id / Mobile Number / Email / Ifsc Code"
                          className="form-control fw-bold rounded"
                          onChange={(e) => {
                            const query = e.target.value?.toLowerCase();
                            setSearchQuery(query); // store search query in state
                          }}
                        />
                      </div>
                    </div>
                  </div>
                  <div className="col-sm-auto">
                    <div className="d-flex gap-1 flex-wrap">
                      {permission.find(
                        (p) =>
                          p.permission_category === "CUSTOMER" &&
                          p.permission_path === "2",
                      ) && (
                        <button
                          type="button"
                          className="btn fw-bold btn-success"
                          onClick={() => setModalStates(true)}
                        >
                          <i className="ri-add-line me-1"></i> Add User
                        </button>
                      )}
                    </div>
                  </div>
                </Row>
              </CardHeader>
              <CardBody className="pt-0">
                <div className="table-responsive">
                  <table className="table table-hover table-nowrap align-middle">
                    <thead className="table-light text-muted text-uppercase">
                      <tr>
                        <th>Sr No</th>
                        <th>UID</th>
                        <th>Ifsc Code</th>
                        <th>Bank / Business Info</th>
                        <th>Email</th>
                        <th>Mobile</th>
                        <th>User Type</th>
                        <th>User Created </th>
                        <th>Action</th>
                      </tr>
                    </thead>
                    {permission.find(
                      (p) =>
                        p.permission_category === "CUSTOMER" &&
                        p.permission_path === "1",
                    ) ? (
                      <tbody>
                        {[
                          ...new Map(
                            (users || [])
                              .filter((item) => {
                                const query = searchQuery?.toLowerCase() || "";

                                return (
                                  item.master_name
                                    ?.toLowerCase()
                                    .includes(query) ||
                                  item.user_name
                                    ?.toLowerCase()
                                    .includes(query) ||
                                  item.user_unique_id
                                    ?.toLowerCase()
                                    .includes(query) ||
                                  item.master_ifsc
                                    ?.toLowerCase()
                                    .includes(query) ||
                                  item.user_mobile
                                    ?.toString()
                                    .toLowerCase()
                                    .includes(query) ||
                                  item.master_mobile
                                    ?.toString()
                                    .toLowerCase()
                                    .includes(query) ||
                                  item.user_email?.toLowerCase().includes(query)
                                );
                              })
                              .map((item) => [item.user_id, item]), // ✅ dedupe by user_id
                          ).values(),
                        ].map((user, index) => (
                          <tr
                            key={user.user_id}
                            style={{
                              backgroundColor: user.createdBy_id
                                ?"#ffe5e5"
                                : "transparent",
                            }}
                          >
                            <td>{index + 1}</td>
                            <td>{user.user_unique_id}</td>
                            <td>{user.master_ifsc || ""}</td>
                            <td
                              style={{
                                maxWidth: "180px",
                                whiteSpace: "normal",
                                wordBreak: "break-word",
                              }}
                            >
                              {user.user_type == 1
                                ? user.user_name
                                : user?.master_name}
                              {user?.master_branch_name
                                ? ` - ${user?.master_branch_name}`
                                : " "}
                              {user?.master_branch_code
                                ? ` - ${user.master_branch_code}`
                                : " "}
                            </td>
                            <td
                              style={{
                                maxWidth: "180px",
                                whiteSpace: "normal",
                                wordBreak: "break-word",
                              }}
                            >
                              {user.user_email || "-"}
                            </td>
                            <td>
                              {user.user_mobile || user.master_mobile || ""}
                            </td>
                            <td>
                              {{
                                1: "Customer",
                                2: "Vendor",
                                3: "Bank",
                              }[user.user_type] || " Unknown "}
                            </td>
                            <td>
                              {new Date(user.created_at).toLocaleString(
                                "en-IN",
                                {
                                  day: "2-digit",
                                  month: "short",
                                  year: "numeric",
                                  hour: "2-digit",
                                  minute: "2-digit",
                                  hour12: true,
                                },
                              )}
                            </td>
                            <td className="text-center">
                              <ul className="list-inline d-flex justify-content-center align-items-center gap-2 mb-0">
                                {/* View */}
                                <li className="list-inline-item">
                                  <button
                                    type="button"
                                    className="btn btn-sm btn-light shadow-sm rounded-circle d-flex align-items-center justify-content-center"
                                    style={{
                                      width: "36px",
                                      height: "36px",
                                      transition: "all 0.2s ease",
                                    }}
                                    title="View"
                                    onClick={() => {
                                      setSelectedUser(user);
                                      setViewModalStates(true);
                                    }}
                                  >
                                    <i className="ri-eye-fill text-primary fs-16" />
                                  </button>
                                </li>

                                {/* print */}
                                <li className="list-inline-item">
                                  <button
                                    type="button"
                                    className="btn btn-sm btn-light shadow-sm rounded-circle d-flex align-items-center justify-content-center"
                                    style={{
                                      width: "36px",
                                      height: "36px",
                                      transition: "all 0.2s ease",
                                    }}
                                    title="Price"
                                    onClick={() => {
                                      setSelectedUser(user);
                                      setIsOpen(true);
                                    }}
                                  >
                                    <i className="ri-price-tag-3-line text-primary fs-16" />
                                  </button>
                                </li>

                                {/* Edit */}
                                {permission.find(
                                  (p) =>
                                    p.permission_category === "CUSTOMER" &&
                                    p.permission_path === "3",
                                ) && (
                                  <li className="list-inline-item">
                                    <button
                                      type="button"
                                      className="btn btn-sm btn-light shadow-sm rounded-circle d-flex align-items-center justify-content-center"
                                      style={{
                                        width: "36px",
                                        height: "36px",
                                        transition: "all 0.2s ease",
                                      }}
                                      title="Edit"
                                      onClick={() => {
                                        setSelectedUser(user);
                                        setUpdateModalStates(true);
                                      }}
                                    >
                                      <i className="ri-pencil-fill text-warning fs-16" />
                                    </button>
                                  </li>
                                )}

                                {/* Delete */}
                                {permission.find(
                                  (p) =>
                                    p.permission_category === "CUSTOMER" &&
                                    p.permission_path === "4",
                                ) && (
                                  <li className="list-inline-item">
                                    <button
                                      type="button"
                                      className="btn btn-sm btn-light shadow-sm rounded-circle d-flex align-items-center justify-content-center"
                                      style={{
                                        width: "36px",
                                        height: "36px",
                                        transition: "all 0.2s ease",
                                      }}
                                      title="Delete"
                                      onClick={() => {
                                        setUserIDToDelete(user.user_id);
                                        setDeleteModal(true);
                                      }}
                                    >
                                      <i className="ri-delete-bin-5-fill text-danger fs-16" />
                                    </button>
                                  </li>
                                )}
                              </ul>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    ) : (
                      <tbody>
                        <tr>
                          <td colSpan={11}>
                            <div className="text-center text-danger fw-bold">
                              You are not Allowed!
                            </div>
                          </td>
                        </tr>
                      </tbody>
                    )}
                  </table>
                </div>

                {/* ➕ Add User Modal */}
                {modalStates && (
                  <UserAddModal
                    modalStates={modalStates}
                    setModalStates={() => setModalStates(false)}
                    checkchang={handleCallback}
                  />
                )}

                {/* ✏️ Edit User Modal */}
                {updateModalStates && (
                  <UserEditModal
                    modalStates={updateModalStates}
                    setModalStates={() => setUpdateModalStates(false)}
                    checkchang={handleCallback}
                    edit_data={selectedUser}
                    contact_persons={selectedUser?.children || []}
                  />
                )}

                {/* 👁️ View User Modal */}
                {viewModalStates && (
                  <UserViewModal
                    modalStates={viewModalStates}
                    setModalStates={() => setViewModalStates(false)}
                    edit_data={selectedUser}
                    contact_persons={selectedUser?.children || []}
                  />
                )}
              </CardBody>
            </Card>
          </Col>
        </Row>
      </Container>
      {isOpen && (
        <LabelPrint
          isOpen={isOpen}
          user={selectedUser}
          toggle={() => {
            setIsOpen(!isOpen);
          }}
        />
      )}
    </div>
  );
};

export default UserList;
