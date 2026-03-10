import React, { useState, useEffect } from "react";
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
import DeleteModal from "../../Components/Common/DeleteModal";
import CategoryAdd from "./ContactView";
import CategoryEdit from "./ContactView";
import AuthUser from "../../helpers/Authuser";

const ContactList = () => {
  const [modalStates, setModalStates] = useState(false);
  const [UpdatemodalStates, setUpdateModalStates] = useState(false);
  const [CategoryData, SetCategoryData] = useState([]);
  const [FindData, SetFind] = useState([]);
  const [deleteModal, setDeleteModal] = useState(false);
  const [ID, SetID] = useState();

  const { http, permission } = AuthUser();

  useEffect(() => {
    document.title = "Contact List | Saisupplier Admin";
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await http.get(`/contact_us/list`);
      SetCategoryData(response.data || []);
    } catch (error) {
      console.log(error);
    }
  };

  const onClickDelete = (id) => {
    SetID(id);
    setDeleteModal(true);
  };

  const handleDeleteOrder = async (event) => {
    if (event._reactName === "onClick") {
      try {
        const response = await http.delete(`/category/delete/${ID}`);
        if (response.data.status === 0) {
          toast.success(response.data.message);
        } else {
          toast.warn(response.data.message);
        }
        fetchData();
      } catch (error) {
        console.log(error);
      }
      setDeleteModal(false);
    }
  };

  const handleCallback = (message, status) => {
    fetchData();
    if (status === 0) toast.success(message);
    else toast.warn(message);
    setModalStates(false);
    setUpdateModalStates(false);
  };

  const EditUpdate = (index) => {
    const findItem = CategoryData[index];
    SetFind(findItem);
    setUpdateModalStates(true);
  };

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
                    <h5 className="card-title mb-0">Contact's List</h5>
                  </div>
                  <div className="col-sm-auto">
                    <div className="d-flex gap-1 flex-wrap">
                      {/* <button
                                                type="button"
                                                className="btn btn-success fw-bold add-btn"
                                                onClick={() => setModalStates(true)}
                                            >
                                                <i className="ri-add-line align-bottom me-1"></i> Add Contact
                                            </button> */}
                    </div>
                  </div>
                </Row>
              </CardHeader>

              <CardBody className="pt-0">
                <div>
                  <Nav
                    className="nav-tabs nav-tabs-custom nav-success"
                    role="tablist"
                  />
                  <table className="align-middle table-nowrap table table-hover">
                    <thead className="table-light text-muted text-uppercase">
                      <tr>
                        <th>Sr No</th>
                        <th>Contact Us Name</th>
                        <th>Contact Us Email</th>
                        <th>Contact Us Subject</th>
                        <th>Contact Message</th>
                        <th>Action</th>
                      </tr>
                    </thead>
                    {permission.find(
                      (p) =>
                        p.permission_category === "CONTACTUS" &&
                        p.permission_path === "1"
                    ) ? (
                      <tbody>
                        {CategoryData.map((item, index) => (
                          <tr key={index}>
                            <td>{index + 1}</td>
                            <td>{item.contact_us_name}</td>
                            <td>{item.contact_us_email}</td>
                            <td>{item.contact_us_subject}</td>
                            <td>
                              {item.contact_us_message.length > 50
                                ? `${item.contact_us_message.slice(0, 50)}...`
                                : item.contact_us_message}
                            </td>
                            <td>
                              <ul className="list-inline hstack gap-2 mb-0">
                                {permission.find(
                                  (p) =>
                                    p.permission_category === "CONTACTUS" &&
                                    p.permission_path === "2"
                                ) && (
                                  <li className="list-inline-item">
                                    <button
                                      className="text-primary border-0 bg-transparent"
                                      onClick={() => EditUpdate(index)}
                                    >
                                      <i className="ri-eye-fill fs-16" />
                                    </button>
                                  </li>
                                )}
                                {permission.find(
                                  (p) =>
                                    p.permission_category === "CONTACTUS" &&
                                    p.permission_path === "3"
                                ) && (
                                  <li className="list-inline-item">
                                    {item.category_id !== 1 && (
                                      <button
                                        className="text-danger border-0 bg-transparent"
                                        onClick={() =>
                                          onClickDelete(item.category_id)
                                        }
                                      >
                                        <i className="ri-delete-bin-5-fill fs-16" />
                                      </button>
                                    )}
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

                {modalStates && (
                  <CategoryAdd
                    modalStates={modalStates}
                    setModalStates={() => setModalStates(false)}
                    checkchang={handleCallback}
                  />
                )}
                {UpdatemodalStates && (
                  <CategoryEdit
                    modalStates={UpdatemodalStates}
                    setModalStates={() => setUpdateModalStates(false)}
                    checkchang={handleCallback}
                    edit_data={FindData}
                  />
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

export default ContactList;
