import React, { useEffect, useState } from "react";
import {
  Card,
  CardBody,
  Col,
  Container,
  CardHeader,
  Nav,
  Row,
  Alert,
} from "reactstrap";
import TaxAdd from "./TaxAdd";
import TaxUpdate from "./TaxUpdate";
import { toast, ToastContainer } from "react-toastify";
import DeleteModal from "../../Components/Common/DeleteModal";
import AuthUser from "../../helpers/Authuser";
import InfiniteScroll from "react-infinite-scroll-component";

const TaxView = () => {
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
    SetTaxData([]);
    SetPages(1);
    if (data._reactName == "onClick") {
      http
        .delete(`/tax/delete/${ID}`)
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

    setDeleteModal(false);
  };

  // shortcuts for opening add form
  useEffect(() => {
    document.title = "Taxs | Saisupplier Admin";

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

  const [counts, Setcounts] = useState(1);
  const [TaxData, SetTaxData] = useState([]);
  // infinity
  const [Pages, SetPages] = useState(1);
  const [NoMore, SetNoMore] = useState(true);
  useEffect(() => {
    http
      .get(`/tax/list?page=${Pages}&limit=30`)
      .then(function (response) {
        SetTaxData([...TaxData, ...response.data]);
        SetPages(Pages + 1);
        if (response.data.length === 0) {
          SetNoMore(false);
        }
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
    let FindArray = TaxData.filter((_, i) => i == index);
    SetFind(FindArray[0]);
    setUpdateModalStates(!UpdatemodalStates);
  };

  //   end Alert
  const handleCallback = (data, status) => {
    SetTaxData([]);
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
                    <h5 className="card-title mb-0">Tax </h5>
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
                        Tax
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
                  <InfiniteScroll
                    dataLength={TaxData.length}
                    next={fetchData}
                    hasMore={NoMore}
                  >
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
                            Tax Name
                          </th>
                          <th
                            title="Toggle SortBy"
                            style={{ cursor: "pointer" }}
                          >
                            Tax Percentage
                          </th>
                          <th>Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {TaxData.map((item, index) => (
                          <tr key={index}>
                            <td>
                              <a
                                className="fw-medium link-primary"
                                href="/apps-ecommerce-order-details"
                              >
                                {index + 1}
                              </a>
                            </td>
                            <td>{item.tax_name}</td>
                            <td>{item.tax_percentage}</td>

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
                                    onClick={() => onClickDelete(item.tax_id)}
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
                  </InfiniteScroll>
                </div>

                {modalStates === true ? (
                  <TaxAdd
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
                  <TaxUpdate
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

export default TaxView;
