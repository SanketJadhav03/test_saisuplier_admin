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
import DeleteModal from "../../Components/Common/DeleteModal";
import OurClientAdd from "./OurClientAdd";
import OurClientUpdate from "./OurClientUpdate";
import AuthUser from "../../helpers/Authuser";
import { useEffect } from "react";
import { IMG_API_URL } from "../../helpers/url_helper";
import InfiniteScroll from "react-infinite-scroll-component";
import D_img from "../D_img";

const OurClientList = () => {
  const [modalStates, setModalStates] = useState(false);
  const [UpdatemodalStates, setUpdateModalStates] = useState(false);
  const { http, permission } = AuthUser();
  //   Delete Aleart
  const [deleteModal, setDeleteModal] = useState(false);
  const [ID, SetID] = useState();
  const onClickDelete = (data) => {
    SetID(data);
    setDeleteModal(true);
  };
  const handleDeleteOrder = (data) => {
    if (data._reactName == "onClick") {
      http
        .delete(`/ourClient/delete/${ID}`)
        .then(function (response) {
          if (response.data.status == 0) {
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
    Setcounts(1);
    setDeleteModal(false);
  };

  // shortcuts for opening add form
  useEffect(() => {
    document.title = "OurClients | Saisupplier Admin";

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

  //   end Alert
  const handleCallback = (data, status) => {
    SetOurClient([]);
    SetPages(1);
    if (status == 0) {
      toast.success(data);
    } else {
      toast.warn(data);
    }
    setModalStates(false);
    setUpdateModalStates(false);
    Setcounts(counts + 1);
  };

  const [counts, Setcounts] = useState(1);
  const [OurClient, SetOurClient] = useState([]);
  // infinity
  const [Pages, SetPages] = useState(1);
  const [NoMore, SetNoMore] = useState(true);
  useEffect(() => {
    http
      .get(`/ourClient/list`)
      .then(function (response) {
        SetOurClient(response.data);
      })
      .catch(function (error) {
        console.log(error);
        SetNoMore(false);
      });
  }, [counts]);
  const fetchData = () => {
    Setcounts(counts + 1);
  };
  // Edit Data
  const [FindData, SetFind] = useState([]);
  const EditUpdate = (index) => {
    let FindArray = OurClient.filter((_, i) => i == index);
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
                    <h5 className="card-title mb-0">OurClient </h5>
                  </div>
                  <div className="col-sm-auto">
                    {permission.find(
                      (permission) =>
                        permission.permission_category === "OURCLIENTS" &&
                        permission.permission_path === "2"
                    ) && (
                      <div className="d-flex gap-1 flex-wrap">
                        <button
                          type="button"
                          className="btn fw-bold btn-success add-btn"
                          id="create-btn"
                          onClick={() => setModalStates(!modalStates)}
                        >
                          <i className="ri-add-line align-bottom me-1"></i> Add
                          OurClient
                        </button>
                      </div>
                    )}
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
                          OurClient Name
                        </th>
                        <th title="Toggle SortBy" style={{ cursor: "pointer" }}>
                          OurClient Image
                        </th>
                        <th>Action</th>
                      </tr>
                    </thead>
                    {permission.find(
                      (permission) =>
                        permission.permission_category === "OURCLIENTS" &&
                        permission.permission_path === "1"
                    ) ? (
                      <tbody>
                        {OurClient.map((item, index) => (
                          <tr key={index}>
                            <td>
                              <a
                                className="fw-medium link-primary"
                                href="/apps-ecommerce-order-details"
                              >
                                {index + 1}
                              </a>
                            </td>
                            <td>{item.ourClient_name}</td>
                            <td>
                              {item.ourClient_img ? (
                                <img
                                  src={`${IMG_API_URL}/ourClients/${item.ourClient_img}`}
                                  alt={item.ourClient_img}
                                  width={"100px"}
                                />
                              ) : (
                                <D_img />
                              )}
                            </td>

                            <td>
                              <ul className="list-inline hstack gap-2 mb-0">
                                {permission.find(
                                  (permission) =>
                                    permission.permission_category ===
                                      "OURCLIENTS" &&
                                    permission.permission_path === "3"
                                ) && (
                                  <li className="list-inline-item edit">
                                    <button
                                      className="text-primary d-inline-block edit-item-btn border-0 bg-transparent"
                                      onClick={() => EditUpdate(index)}
                                    >
                                      <i className="ri-pencil-fill fs-16" />
                                    </button>
                                  </li>
                                )}
                                {item.ourClient_id != 1
                                  ? permission.find(
                                      (permission) =>
                                        permission.permission_category ===
                                          "OURCLIENTS" &&
                                        permission.permission_path === "4"
                                    ) && (
                                      <li className="list-inline-item">
                                        <button
                                          onClick={() =>
                                            onClickDelete(item.ourClient_id)
                                          }
                                          className="text-danger d-inline-block remove-item-btn  border-0 bg-transparent"
                                        >
                                          <i className="ri-delete-bin-5-fill fs-16" />
                                        </button>
                                      </li>
                                    )
                                  : ""}
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

                {modalStates === true ? (
                  <OurClientAdd
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
                  <OurClientUpdate
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

export default OurClientList;
