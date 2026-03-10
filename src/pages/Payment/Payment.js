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
import PaymentAdd from "./PaymentAdd";
import PaymentUpdate from "./PaymentUpdate";
import AuthUser from "../../helpers/Authuser";
import PaymentView from "./PaymentView";
import InfiniteScroll from "react-infinite-scroll-component";

const Payment = () => {
  const [modalStates, setModalStates] = useState(false);
  const [UpdatemodalStates, setUpdateModalStates] = useState(false);
  const [ViewmodalStates, setViewModalStates] = useState(false);
  //   Delete Aleart
  const { http } = AuthUser();
  const [deleteModal, setDeleteModal] = useState(false);
  const [ID, setID] = useState();
  const onClickDelete = (data) => {
    setID(data);
    setDeleteModal(true);
  };

  // Editable data
  const [findData, setFindData] = useState();
  const onClickEdit = (index) => {
    let FindArray = getPaymentData.filter((_, i) => i == index);
    setFindData(FindArray[0]);
    setUpdateModalStates(!UpdatemodalStates);
  };
  const onClickView = (index) => {
    let FindArray = getPaymentData.filter((_, i) => i == index);
    setFindData(FindArray[0]);
    setViewModalStates(!ViewmodalStates);
  };
  const [counts, setCounts] = useState(1);
  const handleDeleteOrder = (data) => {
    if (data._reactName == "onClick") {
      http
        .delete(`/party_payment/delete/${ID}`)
        .then(function (response) {
          if (response.data.status == 0) {
            toast.success(response.data.message);
          } else {
            toast.warn(response.data.message);
          }
          setCounts(counts + 1);
        })
        .catch(function (error) {
          console.log(error);
        });
    }
    setPaymentData([]);
    SetPages(1);
    setDeleteModal(false);
  };

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
  //   end Alert
  const handleCallback = (data, status) => {
    setPaymentData([]);
    SetPages(1);
    if (status == 0) {
      toast.success(data);
    } else {
      toast.warn(data);
    }
    setModalStates(false);
    setUpdateModalStates(false);
    setCounts(counts + 1);
  };
  // Get data
  const [getPaymentData, setPaymentData] = useState([]);
  // infinity
  const [Pages, SetPages] = useState(1);
  const [NoMore, SetNoMore] = useState(true);
  useEffect(() => {
    http
      .get(`/party_payment/list?page=${Pages}&limit=30`)
      .then(function (response) {
        setPaymentData([...getPaymentData, ...response.data]);
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
                    <h5 className="card-title mb-0">Payments </h5>
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
                        Payments
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
                    dataLength={getPaymentData.length}
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
                            Date
                          </th>
                          <th
                            title="Toggle SortBy"
                            style={{ cursor: "pointer" }}
                          >
                            Party Name
                          </th>
                          <th
                            title="Toggle SortBy"
                            style={{ cursor: "pointer" }}
                          >
                            Payment Mode
                          </th>
                          <th
                            title="Toggle SortBy"
                            style={{ cursor: "pointer" }}
                          >
                            Expenses Type
                          </th>

                          <th
                            title="Toggle SortBy"
                            style={{ cursor: "pointer" }}
                          >
                            Credit Amount
                          </th>
                          <th
                            title="Toggle SortBy"
                            style={{ cursor: "pointer" }}
                          >
                            Paid Amount
                          </th>
                          <th>Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {getPaymentData.map((item, index) => (
                          <tr key={index}>
                            <td>{index + 1}</td>
                            <td>{item.payment_date}</td>
                            <td>{item.supplier_name}</td>
                            <td>{item.payment_type}</td>
                            <td>{item.expenses_type}</td>
                            <td>{item.credit_amount}</td>
                            <td>{item.total_amount}</td>

                            <td>
                              <ul className="list-inline hstack gap-2 mb-0">
                                <li className="list-inline-item edit">
                                  <button
                                    className="text-primary d-inline-block edit-item-btn border-0 bg-transparent"
                                    onClick={() => onClickView(index)}
                                  >
                                    <i className=" ri-printer-line fs-16" />
                                  </button>
                                </li>
                                <li className="list-inline-item edit">
                                  <button
                                    className="text-primary d-inline-block edit-item-btn border-0 bg-transparent"
                                    onClick={() => onClickEdit(index)}
                                  >
                                    <i className="ri-pencil-fill fs-16" />
                                  </button>
                                </li>
                                <li className="list-inline-item">
                                  <button
                                    onClick={() =>
                                      onClickDelete(item.party_payment_id)
                                    }
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
                  <PaymentAdd
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
                  <PaymentUpdate
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
                  <PaymentView
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

export default Payment;
