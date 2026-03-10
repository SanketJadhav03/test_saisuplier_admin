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

import { toast, ToastContainer } from "react-toastify";
import DeleteModal from "../../Components/Common/DeleteModal";
import AuthUser from "../../helpers/Authuser";
import YearAdd from "./YearAdd";
import YearEdit from "./YearEdit";

const Yearlist = () => {
  const [modalStates, setModalStates] = useState(false);
  const [UpdatemodalStates, setUpdateModalStates] = useState(false);
  const {http} = AuthUser();
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
        .delete(`/year/delete/${ID}`)
        .then(function (response) {
          if(response.data.status==0){
            toast.success(response.data.message);
          }else{
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
    document.title = "Year Maintain | Saisupplier Admin"

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
  const handleCallback = (data,status) => {
    if(status==0){
      toast.success(data);
    }else{
      toast.warn(data);
    }
    setModalStates(false);
    setUpdateModalStates(false);
    Setcounts(counts + 1);
  };
  const [counts, Setcounts] = useState(1);
  const [YearData, SetYearData] = useState([]);
  useEffect(() => {
    http
      .get("/yeares")
      .then(function (response) {
        SetYearData(response.data);
      })
      .catch(function (error) {
        console.log(error);
      });
  }, [counts]);

  // Edit Data
  const [FindData, SetFind] = useState([]);
  const EditUpdate =(index)=>{
    let FindArray = YearData.filter((_, i) => i == index);
    SetFind(FindArray[0]);
    setUpdateModalStates(!UpdatemodalStates);
  }
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
                    <h5 className="card-title mb-0">Year </h5>
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
                        Year
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
                        Start Year
                        </th>
                        <th title="Toggle SortBy" style={{ cursor: "pointer" }}>
                        End Year
                        </th>
                        <th title="Toggle SortBy" style={{ cursor: "pointer" }}>
                        Intial Latter
                        </th>
                        <th title="Toggle SortBy" style={{ cursor: "pointer" }}>
                        Action
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                    {YearData.map((item, index) => (
                        <tr key={index}>
                          <td>
                            <a
                              className="fw-medium link-primary"
                              href="/apps-ecommerce-order-details"
                            >
                              {index + 1}
                            </a>
                          </td>
                          <td>{item.start_year_date}</td>
                          <td>{item.end_year_date}</td>
                          <td>{item.intial_latter}</td>

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
                                {item.year_id!=1?<button
                                  onClick={() => onClickDelete(item.year_id)}
                                  className="text-danger d-inline-block remove-item-btn  border-0 bg-transparent"
                                >
                                  <i className="ri-delete-bin-5-fill fs-16" />
                                </button>:""}
                              </li>
                            </ul>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {modalStates === true ? (
                  <YearAdd
                    modalStates={modalStates}
                    setModalStates={() => {
                      setModalStates(false);
                    }}
                    checkchang={handleCallback}
                  />
                ) : (
                  ""
                )}
                {UpdatemodalStates === true?(
                  <YearEdit
                    modalStates={modalStates}
                    setModalStates={() => {
                      setModalStates(false);
                    }}
                    edit_data={FindData}
                    checkchang={handleCallback}
                  />
                ):(
                  ""
                )

                }
                
                <ToastContainer closeButton={false} limit={1} />
              </CardBody>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default Yearlist;
