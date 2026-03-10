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
import SalesManAdd from "./SalesManAdd";
import SalesManUpdate from "./SalesManUpdate";
import AuthUser from "../../helpers/Authuser";
import SalesManView from "./SalesManView"; 

const SalesMan = () => {
  const [modalStates, setModalStates] = useState(false);
  const [UpdatemodalStates, setUpdateModalStates] = useState(false);
  const [ViewmodalStates, setViewModalStates] = useState(false);
  //   Delete Aleart
  const { checkPermission, http, permission } = AuthUser();
  const [deleteModal, setDeleteModal] = useState(false);
  const [ID, setID] = useState();
  const onClickDelete = (data) => {
    setID(data);
    setDeleteModal(true);
  };

  // Editable data
  const [findData, setFindData] = useState();
  const onClickEdit = (index) => {
    let FindArray = getSalesManData.filter((_, i) => i == index);
    setFindData(FindArray[0]);
    setUpdateModalStates(!UpdatemodalStates);
  };
  const onClickView = (index) => {
    let FindArray = getSalesManData.filter((_, i) => i == index);
    setFindData(FindArray[0]);
    setViewModalStates(!ViewmodalStates);
  };
  const [counts, setCounts] = useState(1);
  const handleDeleteOrder = (data) => {
    if (data._reactName == "onClick") {
      http
        .delete(`/salesman/delete/${ID}`)
        .then(function (response) {
          toast.success("SalesMan  removed!!");
          setCounts(counts + 1);
        })
        .catch(function (error) {
          console.log(error);
        });
    }
    setSalesManData([]); 
    setDeleteModal(false);
  };

  // shortcuts for opening add form
  useEffect(() => {
    document.title = "SalesMan | Saisupplier Admin";

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
    setSalesManData([]);
    if (status == 0) {
      toast.success(data);
      setModalStates(false);
      setUpdateModalStates(false);
    } else {
      toast.warn(data);
    }

    setCounts(counts + 1);
  };
  // Get data
  const [getSalesManData, setSalesManData] = useState([]); 
  useEffect(() => {
    http
      .get(`/salesman/list`)
      .then(function (response) {
        setSalesManData(response.data);
      })
      .catch(function (error) {
        console.log(error); 
      });
  }, [counts]);
  const fetchData = () => {
    setCounts(counts + 1);
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
                    <h5 className="card-title mb-0">SalesMan </h5>
                  </div>
                  <div className="col-sm-auto">
                    <div className="d-flex gap-1 flex-wrap">
                      {permission.find(permission => permission.permission_category === "SUPPLIER" && permission.permission_path === "2")
                        &&
                        <button
                          type="button"
                          className="btn fw-bold btn-success add-btn"
                          id="create-btn"
                          onClick={() => setModalStates(!modalStates)}
                        >
                          <i className="ri-add-line align-bottom me-1"></i> Add
                          SalesMan
                        </button>
                      }
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
                          <th
                            title="Toggle SortBy"
                            style={{ cursor: "pointer" }}
                          >
                            Sr No
                          </th>
                          <th
                            title="Toggle SortBy"
                            style={{ cursor: "pointer" }}
                          >
                            SalesMan Name
                          </th>
                          <th
                            title="Toggle SortBy"
                            style={{ cursor: "pointer" }}
                          >
                            SalesMan Email
                          </th>
                          <th
                            title="Toggle SortBy"
                            style={{ cursor: "pointer" }}
                          >
                            Mobile No
                          </th>
                          <th>Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {getSalesManData.map((item, index) => (
                          <tr key={index}>
                            <td>{index + 1}</td>
                            <td>{item.salesman_name}</td> 
                            <td>{item.salesman_email}</td>
                            <td>{item.salesman_mobile}</td> 

                            <td>
                              <ul className="list-inline hstack gap-2 mb-0">
                                {
                                  checkPermission('SalesMan Show') ?
                                    <li className="list-inline-item edit">
                                      <button
                                        className="text-primary d-inline-block edit-item-btn border-0 bg-transparent"
                                        onClick={() => onClickView(index)}
                                      >
                                        <i className="ri-eye-fill fs-16" />
                                      </button>
                                    </li> : ""
                                }
                                {permission.find(permission => permission.permission_category === "SUPPLIER" && permission.permission_path === "3")
                                  &&
                                  <li className="list-inline-item edit">
                                    <button
                                      className="text-primary d-inline-block edit-item-btn border-0 bg-transparent"
                                      onClick={() => onClickEdit(index)}
                                    >
                                      <i className="ri-pencil-fill fs-16" />
                                    </button>
                                  </li>}
                                {permission.find(permission => permission.permission_category === "SUPPLIER" && permission.permission_path === "4")
                                  &&
                                  <li className="list-inline-item">
                                     
                                      <button
                                        onClick={() =>
                                          onClickDelete(item.salesman_id)
                                        }
                                        className="text-danger d-inline-block remove-item-btn  border-0 bg-transparent"
                                      >
                                        <i className="ri-delete-bin-5-fill fs-16" />
                                      </button> 
                                  </li>}
                              </ul>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table> 
                </div>

                {modalStates === true ? (
                  <SalesManAdd
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
                  <SalesManUpdate
                    modalStates={UpdatemodalStates}
                    setModalStates={() => {
                      setUpdateModalStates(false);
                    }}
                    checkchang={handleCallback}
                    edit_data={findData}
                  />
                ) : (
                  ""
                )}
                {ViewmodalStates === true ? (
                  <SalesManView
                    modalStates={ViewmodalStates}
                    setModalStates={() => {
                      setViewModalStates(false);
                    }}
                    checkchang={handleCallback}
                    edit_data={findData}
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

export default SalesMan;
