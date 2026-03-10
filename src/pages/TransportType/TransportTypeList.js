import React, { useEffect, useState } from "react";
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
import TransportTypeAdd from "./TransportTypeAdd"; // updated name
import TransportTypeUpdate from "./TransportTypeUpdate"; // updated name
import AuthUser from "../../helpers/Authuser";
import InfiniteScroll from "react-infinite-scroll-component";

const TransportTypeList = () => {
  const [modalStates, setModalStates] = useState(false);
  const [UpdatemodalStates, setUpdateModalStates] = useState(false);
  const { http } = AuthUser();

  // Delete alert
  const [deleteModal, setDeleteModal] = useState(false);
  const [ID, SetID] = useState();
  const [counts, Setcounts] = useState(1);

  const onClickDelete = (data) => {
    SetID(data);
    setDeleteModal(true);
  };

  // Shortcut for opening modal
  useEffect(() => {
    document.title = "Transport Types | Saisupplier Admin";

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

  const handleDeleteOrder = (data) => {
    if (data._reactName === "onClick") {
      http
        .delete(`/transport_types/delete/${ID}`)
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
    SetPayemntData([]);
    setDeleteModal(false);
  };

  // Callback after add/update
  const handleCallback = (data, status) => {
    SetPayemntData([]);
    if (status === 0) {
      toast.success(data);
    } else {
      toast.warn(data);
    }

    setModalStates(false);
    setUpdateModalStates(false);
    Setcounts(counts + 1);
  };

  const [PaymentData, SetPayemntData] = useState([]);

  // Infinity scroll

  useEffect(() => {
    http
      .get(`/transport_types/list`)
      .then(function (response) {
        SetPayemntData(response.data);
      })
      .catch(function (error) {
        console.log(error);
      });
  }, [counts]);

  const fetchData = () => {
    Setcounts(counts + 1);
  };

  // Edit
  const [FindData, SetFind] = useState([]);
  const EditUpdate = (index) => {
    let FindArray = PaymentData.filter((_, i) => i === index);
    SetFind(FindArray[0]);
    setUpdateModalStates(!UpdatemodalStates);
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
                    <h5 className="card-title mb-0">Transport Types</h5>
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
                        Transport Type
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
                        <th>Sr No</th>
                        <th>Type</th>
                        <th>Charge</th>
                        <th>Description</th>
                        <th>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {PaymentData.map((item, index) => (
                        <tr key={index}>
                          <td>{index + 1}</td>
                          <td>{item.transport_types_type}</td>
                          <td>{item.transport_types_charge}</td>
                          <td>{item.transport_types_description}</td>
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
                                {item.transport_types_id !== 1 ? (
                                  <button
                                    onClick={() =>
                                      onClickDelete(item.transport_types_id)
                                    }
                                    className="text-danger d-inline-block remove-item-btn border-0 bg-transparent"
                                  >
                                    <i className="ri-delete-bin-5-fill fs-16" />
                                  </button>
                                ) : (
                                  ""
                                )}
                              </li>
                            </ul>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {modalStates && (
                  <TransportTypeAdd
                    modalStates={modalStates}
                    setModalStates={() => {
                      setModalStates(false);
                    }}
                    checkchang={handleCallback}
                  />
                )}

                {UpdatemodalStates && (
                  <TransportTypeUpdate
                    modalStates={UpdatemodalStates}
                    setModalStates={() => {
                      setUpdateModalStates(false);
                    }}
                    checkchang={handleCallback}
                    edit_data={FindData}
                  />
                )}
              </CardBody>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default TransportTypeList;
