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
import UserUpdate from "./UserUpdate";
import AuthUser from "../../../helpers/Authuser";
import { useEffect } from "react";
import UserCreateModal from "./UserCreateModal";

const UsersList = () => {
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
        .delete(`/user/delete/${ID}`)
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
  };

  const [counts, Setcounts] = useState(1);
  const [User, setUser] = useState([]);
  useEffect(() => {
    http
      .get("/user/list")
      .then(function (response) {
        console.log(response.data);

        if (response.data.users.length > 0) {
          response.data.users.shift(); // Removes the first element
        }
        setUser(response.data.users);
      })
      .catch(function (error) {
        console.log(error);
      });
  }, [counts]);

  // Edit Data
  const [FindData, SetFind] = useState([]);
  const EditUpdate = (index) => {
    let FindArray = User.filter((_, i) => i === index);
    console.log(FindArray[0]);
    SetFind(FindArray[0]);
    setUpdateModalStates(!UpdatemodalStates);
  };
  // shortcut to get add form
  // shortcuts for opening add form
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.altKey && event.key === "a") {
        event.preventDefault();
        setModalStates(true);
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);
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
                    <h5 className="card-title mb-0">User </h5>
                  </div>
                  <div className="col-sm-auto">
                    <div className="d-flex gap-1 flex-wrap">
                      <button
                        type="button"
                        className="btn fw-bold btn-success add-btn"
                        id="create-btn"
                        onClick={() => setModalStates(!modalStates)}
                      >
                        <i className="ri-add-line align-bottom me-1"></i> Add
                        User
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
                  <table
                    role="table"
                    className="align-middle table-nowrap table table-hover"
                  >
                    <thead className="table-light text-muted text-uppercase">
                      <tr>
                        <th title="Toggle SortBy" style={{ cursor: "pointer" }}>
                          Sr No
                        </th>
                        <th title="Toggle SortBy" style={{ cursor: "pointer" }}>
                          User Name
                        </th>
                        <th title="Toggle SortBy" style={{ cursor: "pointer" }}>
                          User Email
                        </th>
                        <th title="Toggle SortBy" style={{ cursor: "pointer" }}>
                          Mobile Number
                        </th>
                        <th title="Toggle SortBy" style={{ cursor: "pointer" }}>
                          User Role
                        </th>
                        <th>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {User.map((item, index) => (
                        <tr key={index}>
                          <td>
                            <a
                              className="fw-medium link-primary"
                              href="/apps-ecommerce-order-details"
                            >
                              {index + 1}
                            </a>
                          </td>
                          <td>{item.full_name}</td>
                          <td>{item.email}</td>
                          <td>{item.mobile_number}</td>
                          <td>{item.role_name}</td>
                          <td>
                            <ul className="list-inline hstack gap-2 mb-0">
                              <li className="list-inline-item edit">
                                <button
                                  className="text-primary d-inline-block edit-item-btn border-0 bg-transparent"
                                  onClick={() => EditUpdate(index)}
                                >
                                  <i className="ri-pencil-fill fs-16" />
                                </button>
                              </li>
                              <li className="list-inline-item">
                                <button
                                  onClick={() => onClickDelete(item.user_id)}
                                  className="text-danger d-inline-block remove-item-btn  border-0 bg-transparent"
                                >
                                  <i className="ri-delete-bin-5-fill fs-16" />
                                </button>
                              </li>
                            </ul>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {modalStates === true ? (
                  <UserCreateModal
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
                  <UserUpdate
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
                <ToastContainer closeButton={false} limit={1} />
              </CardBody>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default UsersList;
