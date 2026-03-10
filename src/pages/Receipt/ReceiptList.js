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
import ReceiptAdd from "./ReceiptAdd";
import ReceiptUpdate from "./ReceiptUpdate";
import AuthUser from "../../helpers/Authuser";
import ReceiptView from "./ReceiptView";

const ReceiptList = () => {
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
  const handleDeleteOrder = (data) => {
    if (data._reactName == "onClick") {
      http
        .delete(`/receipt/delete/${ID}`)
        .then(function (response) {
          if (response.data.status == 0) {
            toast.success(response.data.message);
          } else {
            toast.warn(response.data.message);
          }
          setCounts(counts + 1);
        }).catch(function (error) {
          console.log(error);
        });
    }
    setDeleteModal(false);
  };

  // Select All data and display
  const [counts, setCounts] = useState(1);
  const [Receipt, setReceipt] = useState([]);
  useEffect(() => {
    http
      .get("/receipt/list")
      .then(function (response) {
        setReceipt(response.data);
      }).catch(function (error) {
        console.log(error);
      });

  }, [counts])

  // find data for update 

  const [findData, setFindData] = useState();
  const EditUpdate = (index) => {
    let FindArray = Receipt.filter((_, i) => i == index);
    setFindData(FindArray[0]);
    setUpdateModalStates(!UpdatemodalStates);
  }

  const onClickView = (index) => {
    let FindArray = Receipt.filter((_, i) => i == index);
    setFindData(FindArray[0]);
    setViewModalStates(!ViewmodalStates);
  }

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
    if (status == 0) {
      toast.success(data);
    } else {
      toast.warn(data);
    }
    setModalStates(false);
    setUpdateModalStates(false);
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
                    <h5 className="card-title mb-0">Receipt </h5>
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
                        Receipt
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
                          Date
                        </th>
                        <th title="Toggle SortBy" style={{ cursor: "pointer" }}>
                          Customer Name
                        </th>
                        <th title="Toggle SortBy" style={{ cursor: "pointer" }}>
                          Payment Mode
                        </th>


                        <th title="Toggle SortBy" style={{ cursor: "pointer" }}>
                          Credit Amount
                        </th>
                        <th title="Toggle SortBy" style={{ cursor: "pointer" }}>
                          Paid Amount
                        </th>
                        <th>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {Receipt.map((item, index) => (
                        <tr key={index}>

                          <td>


                            <a
                              className="fw-medium link-primary"
                              href="/apps-ecommerce-order-details"
                            >
                              {index + 1}
                            </a>
                          </td>
                          <td>{item.receipt_date}</td>
                          <td>{item.customer_name}</td>
                          <td>{item.payment_type}</td>
                          <td>{item.receipt_credit_amount}</td>
                          <td>{item.receipt_total_amount}</td>

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
                                  onClick={() =>
                                    EditUpdate(index)
                                  }
                                >
                                  <i className="ri-pencil-fill fs-16" />
                                </button>
                              </li>
                              <li className="list-inline-item">
                                <button
                                  onClick={() => onClickDelete(item.receipt_id)}
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
                  <ReceiptAdd
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
                  <ReceiptUpdate
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
                  <ReceiptView
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

export default ReceiptList;
