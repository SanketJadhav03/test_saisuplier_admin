import React, { useState, useEffect } from "react";
import {
  Card,
  CardBody,
  Col,
  Container,
  CardHeader,
  Row,
  Input,
} from "reactstrap";
import { toast, ToastContainer } from "react-toastify";
import DeleteModal from "../../Components/Common/DeleteModal";
import SeoAdd from "./SeoAdd";
import SeoEdit from "./SeoEdit";
import SeoView from "./SeoView";
import AuthUser from "../../helpers/Authuser";

const SeoList = () => {
  const [modalStates, setModalStates] = useState(false);
  const [UpdatemodalStates, setUpdateModalStates] = useState(false);
  const [seoData, setSeoData] = useState([]);
  const [FindData, setFindData] = useState([]);
  const [deleteModal, setDeleteModal] = useState(false);
  const [ID, setID] = useState();
  const [editModal, setEditModal] = useState(false);
  const [editData, setEditData] = useState(null);

  const { http } = AuthUser();

  useEffect(() => {
    document.title = "SEO List | Saisupplier Admin";
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await http.get(`/seo`);
      setSeoData(response.data || []);
    } catch (error) {
      console.log(error);
    }
  };

  const onClickDelete = (id) => {
    setID(id);
    setDeleteModal(true);
  };

  const handleDelete = async (event) => {
    if (event._reactName === "onClick") {
      try {
        const response = await http.delete(`/seo/${ID}`);
        toast.success(response.data.message);
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

  const handleEdit = (index) => {
    setFindData(seoData[index]);
    setUpdateModalStates(true);
  };

  const handleEdit2 = (index) => {
    setEditData(seoData[index]);
    setEditModal(true);
  };

  const handleStatusChange = async (id, newStatusStr) => {
    const newStatus = parseInt(newStatusStr, 10); // "0" or "1" → 0 or 1
    try {
      await http.put(`/seo/activate/${id}`, {
        is_active: newStatus,
      });
      toast.success("Status updated");
      fetchData();
    } catch (error) {
      toast.error("Failed to update status");
      console.error(error);
    }
  };

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
                <Row className="align-items-center gy-3">
                  <div className="col-sm">
                    <h5 className="card-title mb-0">SEO List</h5>
                  </div>
                  <div className="col-sm-auto">
                    <div className="d-flex gap-1 flex-wrap">
                      <button
                        type="button"
                        className="btn btn-success fw-bold"
                        onClick={() => setModalStates(true)}
                      >
                        <i className="ri-add-line align-bottom me-1"></i> Add SEO
                      </button>
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
                        <th>Meta Description</th>
                        <th>Keywords</th>
                        <th>Canonical URL</th>
                        <th>Status</th>
                        <th>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {seoData.map((item, index) => (
                        <tr key={index}>
                          <td>{index + 1}</td>
                          <td>{item.meta_description}</td>
                          <td>
                            {Array.isArray(item.keywords)
                              ? item.keywords.join(", ")
                              : item.keywords}
                          </td>
                          <td>{item.canonical_url}</td>
                          <td>
                            <Input
                              type="select"
                              className="form-select form-select-sm"
                              value={item.is_active ? "1" : "0"}
                              onChange={(e) =>
                                handleStatusChange(item.seo_id, e.target.value)
                              }
                              style={{ width: "120px" }}
                            >
                              <option value="1">Active</option>
                              <option value="0">Inactive</option>
                            </Input>
                          </td>
                          <td>
                            <ul className="list-inline hstack gap-2 mb-0">
                              <li className="list-inline-item">
                                <button
                                  className="text-info border-0 bg-transparent"
                                  onClick={() => handleEdit(index)}
                                  title="View"
                                >
                                  <i className="ri-eye-line fs-16" />
                                </button>
                              </li>
                              <li className="list-inline-item">
                                <button
                                  className="text-primary border-0 bg-transparent"
                                  onClick={() => handleEdit2(index)}
                                  title="Edit"
                                >
                                  <i className="ri-edit-2-line fs-16" />
                                </button>
                              </li>
                              <li className="list-inline-item">
                                <button
                                  className="text-danger border-0 bg-transparent"
                                  onClick={() => onClickDelete(item.seo_id)}
                                  title="Delete"
                                >
                                  <i className="ri-delete-bin-5-line fs-16" />
                                </button>
                              </li>
                            </ul>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {modalStates && (
                  <SeoAdd
                    modalStates={modalStates}
                    setModalStates={() => setModalStates(false)}
                    checkchang={handleCallback}
                  />
                )}
                {UpdatemodalStates && (
                  <SeoView
                    modalStates={UpdatemodalStates}
                    setModalStates={() => setUpdateModalStates(false)}
                    checkchang={handleCallback}
                    edit_data={FindData}
                  />
                )}
                {editModal && (
                  <SeoEdit
                    modalStates={editModal}
                    setModalStates={setEditModal}
                    edit_data={editData}
                    checkchang={handleCallback}
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

export default SeoList;
