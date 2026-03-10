import React, { useEffect, useState } from "react";
import {
  Card,
  CardBody,
  Col,
  Container,
  Modal,
  ModalBody,
  CardHeader,
  Nav,
  Row,
} from "reactstrap";
import { ToastContainer } from "react-toastify";
import AuthUser from "../../helpers/Authuser";
import InfiniteScroll from "react-infinite-scroll-component";
import Flatpickr from "react-flatpickr";
import Select from "react-select";
const ProductWiseProfit = () => {


  // ------------------------ Filter ----------------------------
  const [modal_standard, setmodal_standard] = useState(false);
  const [counts,setcouts] = useState(1);
  const [btn, setbtn] = useState(false);
  const [getFilterData, setFilterData] = useState({
    startDate: "",
    endDate: "",
    partyName: ""
  })
  const handleFilterData = () => {
    // http
    //   .post("/productwiseprofit/filter/data", getFilterData)
    //   .then(function (response) {
    //     setBillDetails(response.data);
    //     setFilterData({
    //       startDate: "",
    //       endDate: "",
    //       partyName: ""
    //     })
    //   })
    //   .catch(function (err) {
    //     console.log(err);
    //   })
    console.log(getFilterData);
    setmodal_standard(false);
    setbtn(true);
  }
 
  // ............................................................
  const [getData, setData] = useState({});
  const [ValueStatus, setValueStatus] = useState(false);
  const { http } = AuthUser();
  const [billDetails, setBillDetails] = useState([]);
  const [page, setPage] = useState(1);
  const [noMore, setNoMore] = useState(true);


  // CUSTOM FUNCTIONS
  const getbillDetailsList = async (page) => {
    const response = await http.get(`/pos_child/list?page=${page}`);
    const newData = response.data.map((billDetails) => {
      const obj = JSON.parse(sessionStorage.getItem("authUser"));
      return {
        ...billDetails,
        master_invoice_no: `${obj.invoiceDetails.intial_latter}-${billDetails.master_invoice_no}`,
      };
    });
    if (response.data.length === 0) {
      setNoMore(false);
    }
    setBillDetails([...billDetails, ...newData]);
  };
  const loadNextData = async () => {
    const nextPage = page + 1;
    getbillDetailsList(nextPage);
    setPage(nextPage);
  };
  useEffect(() => {
    getbillDetailsList(1);
    http
      .get("/pos_child/total")
      .then(function (response) {
        if (response.data.length > 0) {
          setValueStatus(true);
          setData(response.data[0]);
        }
      })
      .catch(function (err) {
        console.log(err);
      });
  }, [counts]);
  return (
    <div className="page-content">
      <Container fluid>
        <Row>
          <Col lg={12}>
            <Card>
              <CardHeader className="card-header border-0">
                <Row className="align-items-center gy-3">
                  <div className="col-sm">
                    <h5 className="card-title mb-0">Bill Wise List</h5>
                  </div>
                  <div className="col-sm-auto">
                    <div className="d-flex gap-1 flex-wrap">
                      {btn ? <button
                        type="button"
                        className="btn btn-danger"
                        onClick={() => {
                          setBillDetails([]);
                          setcouts(counts + 1);
                          setPage(1);
                          setbtn(false);
                        }}
                      >
                        Filter Cancel
                      </button>
                        : ""}
                      <button
                        type="button"
                        className="btn btn-primary"
                        onClick={() => setmodal_standard(!modal_standard)}
                      >
                        <i className="ri-file-download-line align-bottom me-1"></i>
                        Filter
                      </button>
                      <Modal
                        id="myModal"
                        isOpen={modal_standard}
                        toggle={() => {
                          setmodal_standard(!modal_standard);
                        }}
                      >
                        <ModalBody>
                          <Row className="my-3">
                            <Col
                              xl={12}
                              md={12}
                              style={{ marginBottom: "10px" }}
                            >
                              <div className="col-sm-auto">
                                <div className="input-group">
                                  <Flatpickr
                                    className="form-control"
                                    options={{
                                      dateFormat: "d/m/Y",
                                      // defaultDate: startDate,
                                    }}
                                    name="payment_date"
                                    placeholder="Enter start date"
                                    onChange={(selectedDates) => {
                                      const selectedDate = selectedDates[0];

                                      const formattedDate = selectedDate.toLocaleDateString(
                                        "en-GB",
                                        {
                                          day: "numeric",
                                          month: "numeric",
                                          year: "numeric",
                                        }
                                      );
                                      setFilterData({ ...getFilterData, startDate: formattedDate });
                                    }}
                                  />
                                  <div className="input-group-text bg-primary border-primary text-white">
                                    <i className="ri-calendar-2-line"></i>
                                  </div>
                                </div>
                              </div>
                            </Col>
                            <Col
                              xl={12}
                              md={12}
                              style={{ marginBottom: "10px" }}
                            >
                              <div className="col-sm-auto ">
                                <div className="input-group">
                                  <Flatpickr
                                    className="form-control"
                                    options={{
                                      dateFormat: "d/m/Y",
                                      // defaultDate: startDate,
                                    }}
                                    placeholder="Select End date"
                                    name="payment_date"
                                    onChange={(selectedDates) => {
                                      const selectedDate = selectedDates[0];

                                      const formattedDate = selectedDate.toLocaleDateString(
                                        "en-GB",
                                        {
                                          day: "numeric",
                                          month: "numeric",
                                          year: "numeric",
                                        }
                                      );
                                      setFilterData({ ...getFilterData, endDate: formattedDate });
                                    }}
                                  />
                                  <div className="input-group-text bg-primary border-primary text-white">
                                    <i className="ri-calendar-2-line"></i>
                                  </div>
                                </div>
                              </div>
                            </Col>
                            <Col
                              xl={12}
                              md={12}
                              style={{ marginBottom: "10px" }}
                            >
                              <Select
                                name="product_category"
                                id="contactnumberInput"
                                className="fw-bold"
                                onChange={(e) => {
                                  setFilterData({
                                    ...getFilterData,
                                    partyName: e.value
                                  })
                                }}
                                // options={tempCustomer.map((item) => ({
                                //   value: item.customer_id,
                                //   label: item.customer_name
                                // }))}
                              />
                            </Col>
                            <Col
                              xl={12}
                              md={12}
                              style={{ marginBottom: "10px" }}
                            >
                              <button
                                className="btn btn-success w-100"
                                onClick={handleFilterData}
                              >
                                Filter
                              </button>
                            </Col>
                            <Col
                              xl={12}
                              md={12}
                              style={{ marginBottom: "10px" }}
                            >
                              <button
                                className="btn btn-info w-100"
                                onClick={() => {
                                  setbtn(false);
                                  setmodal_standard(!modal_standard);
                                }}
                              >
                                Show All Bills
                              </button>
                            </Col>
                          </Row>
                        </ModalBody>
                      </Modal>
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
                    dataLength={billDetails.length}
                    next={loadNextData}
                    hasMore={noMore}
                  ></InfiniteScroll>
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
                          Product Name
                        </th>
                        <th title="Toggle SortBy" style={{ cursor: "pointer" }}>
                          Quantity
                        </th>
                        <th title="Toggle SortBy" style={{ cursor: "pointer" }}>
                          MRP
                        </th>
                        <th title="Toggle SortBy" style={{ cursor: "pointer" }}>
                          Purchase Price
                        </th>
                        <th title="Toggle SortBy" style={{ cursor: "pointer" }}>
                          Sales Price
                        </th>
                        <th title="Toggle SortBy" style={{ cursor: "pointer" }}>
                          Total Price
                        </th>
                        <th>Profit</th>
                      </tr>
                    </thead>
                    <tbody>
                      {billDetails.map((item, index) => (
                        <tr key={index}>
                          <td>{index + 1}</td>
                          <td>{item.product_english_name}</td>
                          <td>{(item.pos_qty)}</td>
                          <td>{(item.pos_mrp).toFixed(2)}</td>
                          <td>{(item.pos_purchase_price).toFixed(2)}</td>
                          <td>{(item.pos_salePrice).toFixed(2)}</td>
                          <td>{(item.pos_totalPrice).toFixed(2)}</td>
                          <td>{((item.pos_salePrice - item.pos_purchase_price) * item.pos_qty).toFixed(2)}</td>
                        </tr>
                      ))}

                    </tbody>
                  </table>

                </div>


                <ToastContainer closeButton={false} limit={1} />
              </CardBody>
            </Card>
          </Col>
        </Row>
        <div className="container-fluid fixed-bottom fs-5">
          <Row>
            <Col sm={2}></Col>
            <Col sm={2} className="bg-dark text-white fw-bold p-3">
              MRP : &#8377; {ValueStatus ? getData.total_pos_mrp : ""}
            </Col>
            <Col sm={2} className="bg-primary text-white fw-bold p-3">
              Qty : {ValueStatus ? getData.total_pos_qty : ""}
            </Col>
            <Col
              sm={2}
              className="bg-warning text-white fw-bold p-3 text-center "
            >
              PurchasePrice : {ValueStatus ? getData.total_pos_purchase_price : ""}

            </Col>
            <Col sm={2} className="bg-secondary text-white fw-bold p-3">
              SalePrice : &#8377; {ValueStatus ? getData.total_pos_salePrice.toFixed(2) : ""}
            </Col>
            <Col sm={2} className="bg-success text-white fw-bold p-3">
              Profit : &#8377; {ValueStatus ? ((getData.total_pos_salePrice - getData.total_pos_purchase_price) * getData.total_pos_qty).toFixed(2) : ""}
            </Col>
          </Row>
        </div>
      </Container>
    </div>
  );
};

export default ProductWiseProfit;
