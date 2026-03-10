import React, { useEffect, useRef, useState } from "react";
import {
  Card,
  CardBody,
  Col,
  Container,
  CardHeader,
  Nav,
  Row,
} from "reactstrap";
import { ToastContainer, toast } from "react-toastify";
import AuthUser from "../../helpers/Authuser";
import Select from "react-select";
import Flatpickr from "react-flatpickr";
import BillHeader from "./BillHeader";
const BillWiseProfit = () => {
  const { http } = AuthUser();

  const tableRef = useRef(null);
  const handlePrint = () => {
    const table = tableRef.current;

    if (table) {
      table.style.display = 'table';
      let printContents = document.getElementById('tableToPrint').outerHTML;
      let originalContents = document.body.innerHTML;
      document.body.innerHTML = printContents;
      window.print();
      window.location.reload();
      document.body.innerHTML = originalContents;
    }
  };
  const downloadCSV = () => {
    const table = document.getElementById('tableToPrint');
    const rows = table.querySelectorAll('tr');
    let csvContent = 'data:text/csv;charset=utf-8,';
    rows.forEach((row) => {
      const rowData = [];
      const cols = row.querySelectorAll('td, th');
      cols.forEach((col, index) => {
        rowData.push(index === cols.length - 1 ? col.textContent : `${col.textContent},`);
      });
      csvContent += rowData.join('') + '\n';
    });
    const encodedURI = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedURI);
    link.setAttribute('download', 'billwiseProfit.csv');
    document.body.appendChild(link);
    link.click();
  };
  // ------------------------ Filter ----------------------------
  const [initialLetter, setInitialLetter] = useState(
    JSON.parse(sessionStorage.getItem("authUser"))
  );
  const [tempCustomer, setTempCustomer] = useState([]);
  function formatCurrentDate() {
    const currentDate = new Date();
    const day = currentDate.getDate().toString().padStart(2, "0");
    const month = (currentDate.getMonth() + 1).toString().padStart(2, "0");
    const year = currentDate.getFullYear();
    return `${day}/${month}/${year}`;
  }
  const [getFilterData, setFilterData] = useState({
    startDate: formatCurrentDate(),
    endDate: formatCurrentDate(),
  });
  const handleFilterData = () => {
    setData({
      total_pos_master_mrp: 0,
      total_pos_master_qty: 0,
    });
    if (getFilterData.startDate && getFilterData.endDate) {
      http
        .post("/billwiseprofit/filter/data", getFilterData)
        .then(function (response) {
          console.log("Test",response.data);
          
          if (response.data.length > 0) {
            let tempQty = 0;
            let tempMrp = 0;
            for (let i = 0; i < response.data.length; i++) {
              tempQty += response.data[i].master_qty;
              tempMrp += response.data[i].master_total_bill_mrp;
            }
            setData({
              ...getData,
              total_pos_master_qty: tempQty,
              total_pos_master_mrp: tempMrp,
            });
            setBillDetails(response.data);
          }
        })
        .catch(function (err) {
          console.log(err);
        });
    }
  };
  useEffect(() => {
    http
      .get("/all_customers")
      .then(function (response) {
        setTempCustomer(response.data);
      })
      .catch(function (err) {
        console.log(err);
      });
  }, []);
  // ............................................................

  const [billDetails, setBillDetails] = useState([]);
  const [counts, setcouts] = useState(1);

  const [getData, setData] = useState({
    total_pos_master_mrp: 0,
    total_pos_master_qty: 0,
  });
  // const [ValueStatus, setValueStatus] = useState([]);
  useEffect(() => {
    handleFilterData();
  }, [counts]);

  const Total_Purchase = billDetails.reduce(
    (acc, item) => acc + item.total_purchase_pricess,
    0
  );
  const Total_sale = billDetails.reduce(
    (acc, item) => acc + item.master_total_bill_amt,
    0
  );
  const Total_Profit = billDetails.reduce((acc, item) => {
    const profit = item.master_total_bill_amt - item.total_purchase_pricess;
    return acc + profit;
  }, 0);
  return (
    <div className="page-content">
      <table
        ref={tableRef}
        style={{ display: "none" }}
        role="table"
        id="tableToPrint"
        className="text-center bg-white table"
      >
       <BillHeader title="Bill Wise Profit"/>
        <thead className="thead-light  text-uppercase">
          <tr>
            <th title="Toggle SortBy" style={{ cursor: "pointer" }}>
              Date
            </th>
            <th title="Toggle SortBy" style={{ cursor: "pointer" }}>
              Bill No.
            </th>
            <th title="Toggle SortBy" style={{ cursor: "pointer" }}>
              Name
            </th>

            <th title="Toggle SortBy" style={{ cursor: "pointer" }}>
              Quantity
            </th>
            <th title="Toggle SortBy" style={{ cursor: "pointer" }}>
              MRP
            </th>
            <th>Purchase Price</th>
            <th>Sale Price</th>
            <th>Profit/Loss</th>
            <th>Percentage</th>
          </tr>
        </thead>
        <tbody>
          {billDetails.map((item, index) => (
            <tr key={index}>
              <td>{item.master_bill_date}</td>
              <td>
                {initialLetter.invoiceDetails.intial_latter +
                  "-" +
                  item.master_invoice_no}
              </td>
              <td>{item.customer_name}</td>
              <td>{item.master_qty}</td>
              <td>{item.master_total_bill_mrp}</td>
              <td>{item.total_purchase_pricess}</td>
              <td>{item.master_paid_amount}</td>
              <td>
                {item.master_paid_amount -
                  item.total_purchase_pricess}
              </td>
              <td>
                {(
                  ((item.master_paid_amount -
                    item.total_purchase_pricess) /
                    item.master_total_bill_mrp) *
                  100
                ).toFixed(2) + "%"}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <Container fluid>
        <Row>
          <Col lg={12}>
            <Card id="orderList">
              <CardHeader className="card-header border-0">
                <Row className="align-items-center g">
                  <div className="col-sm">
                    <h5 className="card-title mb-0">Bill Wise List</h5>
                  </div>
                  <div className="col-sm-auto">
                    <div className="d-flex gap-1 flex-wrap">
                      <div >

                        <Select name="product_category" id="contactnumberInput" className="w-100 fw-bold" 
                        onChange={(e) => { setFilterData({ ...getFilterData, partyName: e.value }); }} options={tempCustomer.map((item) => ({ value: item.customer_id, label: item.customer_name }))} />
                      </div>

                      <div>
                        <div >
                          <Flatpickr className="form-control" options={{ dateFormat: "d/m/Y", defaultDate: "today" }} name="payment_date" placeholder="Enter start date" onChange={(selectedDates) => { const selectedDate = selectedDates[0]; const formattedDate = selectedDate.toLocaleDateString("en-GB", { day: "numeric", month: "numeric", year: "numeric" }); setFilterData({ ...getFilterData, startDate: formattedDate }); }} />
                        </div>
                      </div>
                      <div >
                        <Flatpickr className="form-control" options={{ dateFormat: "d/m/Y", defaultDate: "today" }} placeholder="Select End date" name="payment_date" onChange={(selectedDates) => { const selectedDate = selectedDates[0]; const formattedDate = selectedDate.toLocaleDateString("en-GB", { day: "numeric", month: "numeric", year: "numeric" }); setFilterData({ ...getFilterData, endDate: formattedDate }); }} />
                      </div>
                      <div>
                        <button className="btn btn-success w-100" onClick={() => { setBillDetails([]); handleFilterData(); }}>Search</button>
                      </div>
                      <button
                        type="button"
                        className="btn btn-secondary"
                        onClick={() => {
                          handlePrint();
                        }}
                      >
                        <i className="ri-file-download-line align-bottom me-1"></i>{" "}
                        Print
                      </button>
                      <button
                        type="button"
                        className="btn btn-info"
                        onClick={() => downloadCSV()}
                      >
                        <i className="ri-file-download-line align-bottom me-1"></i>{" "}
                        Export
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

                 <div className="table-responsive">
                 <table
                    role="table"
                    className="align-middle table-nowrap table table-hover"
                  >
                    <thead className="table-light text-muted text-uppercase">
                      <tr>
                        <th title="Toggle SortBy" style={{ cursor: "pointer" }}>
                          Date
                        </th>
                        <th title="Toggle SortBy" style={{ cursor: "pointer" }}>
                          Bill No.
                        </th>
                        <th title="Toggle SortBy" style={{ cursor: "pointer" }}>
                          Name
                        </th>

                        <th title="Toggle SortBy" style={{ cursor: "pointer" }}>
                          Quantity
                        </th>
                        <th title="Toggle SortBy" style={{ cursor: "pointer" }}>
                          MRP
                        </th>
                        <th>Purchase Price</th>
                        <th>Sale Price</th>
                        <th>Profit/Loss</th>
                        <th>Percentage</th>
                      </tr>
                    </thead>
                    <tbody>
                      {billDetails.filter((item)=> getFilterData.partyName  ? item.master_customer_id == getFilterData.partyName: getFilterData.startDate ? item.master_bill_date >= getFilterData.startDate && item.master_bill_date <= getFilterData.endDate:true).map((item, index) => (
                        <tr key={index}>
                          <td>{item.master_bill_date}</td>
                          <td>
                            {initialLetter.invoiceDetails.intial_latter +
                              "-" +
                              item.master_invoice_no}
                          </td>
                          <td>{item.customer_name}</td>
                          <td>{item.master_qty}</td>
                          <td>{item.master_total_bill_mrp}</td>
                          <td>{item.total_purchase_pricess}</td>
                          <td>{item.master_paid_amount}</td>
                          <td>
                            {item.master_total_bill_amt -
                              item.total_purchase_pricess}
                          </td>
                          <td>
                            {
                              ((((item.master_total_bill_amt -
                                item.total_purchase_pricess) *item.master_qty) / item.master_paid_amount ) * 100
                            ).toFixed(2) + "%"}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                 </div>
                </div>

                <ToastContainer closeButton={false} limit={1} />
              </CardBody>
            </Card>
          </Col>
        </Row>
        <div className="container-fluid fixed-bottom fs-5">
          <Row>
            <Col sm={2}></Col>
            <Col sm={2} className="bg-primary text-white fw-bold p-3">
              Qty : {getData.total_pos_master_qty}
            </Col>
            <Col
              sm={2}
              className="bg-warning text-white fw-bold p-3 text-center "
            >
              PurchasePrice : &#8377; {Total_Purchase}
            </Col>
            <Col sm={2} className="bg-dark text-white fw-bold p-3">
              MRP : &#8377; {getData.total_pos_master_mrp}
            </Col>
            <Col sm={2} className="bg-secondary text-white fw-bold p-3">
              SalePrice : &#8377; {Total_sale}
            </Col>
            <Col sm={2} className="bg-success text-white fw-bold p-3">
              Profit : &#8377; {Total_Profit}
            </Col>
          </Row>
        </div>
      </Container>
    </div>
  );
};

export default BillWiseProfit;
