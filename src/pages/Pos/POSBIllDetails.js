import React, { useEffect, useState, useMemo, useCallback } from "react";
import {
  Card,
  CardBody,
  Col,
  Container,
  CardHeader,
  Nav,
  Row,
} from "reactstrap";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import TableContainer from "../../Components/Common/TableContainer";

//redux
import { useSelector } from "react-redux";

import 'react-toastify/dist/ReactToastify.css';

import { createSelector } from "reselect";
import AuthUser from "../../helpers/Authuser";
const POSBillDetailsList = () => {

  const navigate = useNavigate();

  const { http } = AuthUser();
  const [POSBillDetails, setPOSBillDetails] = useState([]);
  const { billId } = useParams();

  const getPOSBillDetails = async () => {
    const response = await http.get(`/pos/${billId}`);
    setPOSBillDetails(response.data)
  }

  // FILTERING THE POS BILLS
  const selectLayoutState = (state) => state.Ecommerce;
  const selectLayoutProperties = createSelector(
    selectLayoutState,
    (ecom) => ({
      orders: ecom.orders,
      isOrderSuccess: ecom.isOrderSuccess,
      error: ecom.error,
    })
  );


  useEffect(() => {
    getPOSBillDetails();
  }, []);

  // Column
  const columns = useMemo(
    () => [

      {
        Header: "Item Name",
        accessor: "product_english_name",
        filterable: false,
      },
      {
        Header: "MRP",
        accessor: "pos_mrp",
        filterable: false,
        Cell: (cell) => {
          const productData = cell.row.original;
          return (
            <p> &#8377; {productData.pos_mrp}</p>
          );
        },
      },
      {
        Header: "Qty", accessor: "pos_qty", Cell: (cell) => {
          const productData = cell.row.original;
          return (
            <p> {productData.pos_qty}</p>
          );
        },
      },
      {
        Header: "Sale Price",
        accessor: "pos_salePrice",
        Cell: (cell) => {
          const productData = cell.row.original;
          return (
            <p> &#8377;  {productData.pos_salePrice}</p>
          );
        },
      },
      {
        Header: "Purchase Price",
        accessor: "pos_purchase_price",
        filterable: false,
        Cell: (cell) => {
          const productData = cell.row.original;
          return (
            <p> &#8377; {productData.pos_purchase_price}</p>
          );
        },
      },
      {
        Header: "Wholesaler Price",
        accessor: "pos_wholesaler",
        filterable: false,
        Cell: (cell) => {
          const productData = cell.row.original;
          return (
            <p> &#8377; {productData.pos_wholesaler}</p>
          );
        },
      },
      {
        Header: "Online Price",
        accessor: "pos_online",
        filterable: false,
        Cell: (cell) => {
          const productData = cell.row.original;
          return (
            <p> &#8377; {productData.pos_online}</p>
          );
        },
      },

    ],
    []
  );

  document.title = "Orders | eBilling Ajspire Technologies Pvt. Ltd.";
  return (
    <div className="page-content">
      <Container fluid>
        <Row>
          <Col lg={12}>
            <Card id="orderList">
              <CardHeader className="card-header border-0">
                <Row className="align-items-center gy-3">
                  <div className="col-sm">
                    <h5 className="card-title mb-0">POS Bill Details</h5>
                  </div>
                  <div className="col-sm-auto">
                    <div className="d-flex gap-1 flex-wrap">
                      <button type="button" className="btn btn-danger" onClick={() => { navigate("/pos/list") }}>
                        Back
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
                  >
                  </Nav>
                  <TableContainer
                    columns={columns}
                    data={(POSBillDetails || [])}
                    isGlobalFilter={false}
                    isAddUserList={false}
                    customPageSize={8}
                    divClass="table-responsive table-card mb-1"
                    tableClass="align-middle table-nowrap"
                    theadClass="table-light text-muted text-uppercase"
                    isOrderFilter={true}
                    SearchPlaceholder='Search for order ID, customer, order status or something...'
                  />
                </div>
              </CardBody>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default POSBillDetailsList;


