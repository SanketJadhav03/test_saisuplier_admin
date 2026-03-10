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
import { ToastContainer } from "react-toastify";
import AuthUser from "../../helpers/Authuser";
import Flatpickr from "react-flatpickr";
import Select from "react-select";
import BillHeader from "./BillHeader";

const POSRegister = () => {
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
    link.setAttribute('download', 'posRegister.csv');
    document.body.appendChild(link);
    link.click();
  };


  const [Customers, SetCustomer] = useState([]);
  //   CURRENT DATE
  function formatCurrentDate() {
    const currentDate = new Date();
    const day = currentDate.getDate().toString().padStart(2, "0");
    const month = (currentDate.getMonth() + 1).toString().padStart(2, "0");
    const year = currentDate.getFullYear();
    return `${day}/${month}/${year}`;
  }
  //   filter data
  const [IdCustomer, SetIdCustomer] = useState("");
  const [StartDate, SetStartDate] = useState(formatCurrentDate);
  const [endDate, SetEndDate] = useState(formatCurrentDate);
  useEffect(() => {
    http
      .get("/customers/list?page=1&limit=100")
      .then(function (response) {
        SetCustomer(response.data);
      })
      .catch(function (err) {
        console.log(err);
      });
    OnSubmited();
  }, []);

  const [TableData, SetTabelData] = useState([]);
  const OnSubmited = () => {
    const Object = {
      customerName: IdCustomer,
      startDate: StartDate,
      endDate: endDate,
    };
    http
      .post("/ledger/reports", Object)
      .then(function (response) {
        SetTabelData(response.data);
      })
      .catch(function (err) {
        console.log(err);
      });
  };
  //invoiceDetails
  const [invoiceDetails] = useState(
    JSON.parse(sessionStorage.getItem("authUser")).invoiceDetails.intial_latter
  );
  //   const totalQty = Data.reduce((acc, item) => acc + item.purchase_total_qty, 0);
  //   const totalAmount = Data.reduce(
  //     (acc, item) => acc + item.purchase_total_purchase,
  //     0
  //   );
  return (
    <div className="page-content">
      <table
        ref={tableRef}
        style={{ display: "none" }}
        role="table"
        id="tableToPrint"
        className="text-center bg-white table"
      >
       <BillHeader title="Pos Register"/>
        <thead className="thead-light  text-uppercase">
          <tr>
            <th title="Toggle SortBy" style={{ cursor: "pointer" }}>
              Sr No
            </th>
            <th title="Toggle SortBy" style={{ cursor: "pointer" }}>
              Date
            </th>

            <th title="Toggle SortBy" style={{ cursor: "pointer" }}>
              Type
            </th>
            <th title="Toggle SortBy" style={{ cursor: "pointer" }}>
              Name
            </th>
            <th title="Toggle SortBy" style={{ cursor: "pointer" }}>
              Invoiec No
            </th>
            <th title="Toggle SortBy" style={{ cursor: "pointer" }}>
              Debit
            </th>
            <th title="Toggle SortBy" style={{ cursor: "pointer" }}>
              Credit
            </th>
            <th title="Toggle SortBy" style={{ cursor: "pointer" }}>
              Balance
            </th>
          </tr>
        </thead>
        <tbody>
          {TableData.map((item, index) => (
            <tr key={index}>
              <td>{index + 1}</td>
              <td>{item.master_bill_date}</td>
              <td>{item.master_bill_type}</td>
              <td>{item.customer_name}</td>
              <td>
                {invoiceDetails ? invoiceDetails : ""}-
                {item.master_invoice_no}
              </td>
              <td>{item.master_paid_amount}</td>
              <td>
                {item.master_total_bill_amt -
                  item.master_paid_amount}
              </td>
              <td>{item.master_total_bill_amt}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <Container fluid>
        <Row>
          <Col lg={12}>
            <Card>
              <CardHeader className="card-header border-0">
                <Row className="align-items-center gy-3">
                  <div className="col-sm">
                    <h5 className="card-title mb-0">POS Register Report</h5>
                  </div>
                  <div className="col-sm-auto">
                    <div className="d-flex gap-1 flex-wrap">
                      <div>
                        <Select
                          options={Customers.map((item) => ({
                            value: item.customer_id,
                            label: item.customer_name,
                          }))}
                          name="group_type"
                          id="group_type"
                          className="fw-bold"
                          placeholder="Select Customer"
                          style={{ backgroundColor: "rgb(248 245 224)" }}
                          onChange={(e) => {
                            SetIdCustomer(e.value);
                          }}
                        ></Select>
                      </div>
                      <div>
                        <Flatpickr
                          className="form-control"
                          options={{
                            dateFormat: "d/m/Y",
                            defaultDate: "today",
                          }}
                          onChange={(selectedDates) => {
                            const selectedDate = selectedDates[0];
                            const day = selectedDate
                              .getDate()
                              .toString()
                              .padStart(2, "0");
                            const month = (selectedDate.getMonth() + 1)
                              .toString()
                              .padStart(2, "0");
                            const year = selectedDate.getFullYear();
                            const formattedDate = `${day}/${month}/${year}`;
                            SetStartDate(formattedDate);
                          }}
                        />
                      </div>
                      <div>
                        <Flatpickr
                          className="form-control"
                          options={{
                            dateFormat: "d/m/Y",
                            defaultDate: "today",
                          }}
                          onChange={(selectedDates) => {
                            const selectedDate = selectedDates[0];
                            const day = selectedDate
                              .getDate()
                              .toString()
                              .padStart(2, "0");
                            const month = (selectedDate.getMonth() + 1)
                              .toString()
                              .padStart(2, "0");
                            const year = selectedDate.getFullYear();
                            const formattedDate = `${day}/${month}/${year}`;
                            SetEndDate(formattedDate);
                          }}
                        />
                      </div>
                      <button
                        type="button"
                        className="btn btn-primary"
                        onClick={OnSubmited}
                      >
                        Search
                      </button>
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
                          Type
                        </th>
                        <th title="Toggle SortBy" style={{ cursor: "pointer" }}>
                          Name
                        </th>
                        <th title="Toggle SortBy" style={{ cursor: "pointer" }}>
                          Invoiec No
                        </th>
                        <th title="Toggle SortBy" style={{ cursor: "pointer" }}>
                          Debit
                        </th>
                        <th title="Toggle SortBy" style={{ cursor: "pointer" }}>
                          Credit
                        </th>
                        <th title="Toggle SortBy" style={{ cursor: "pointer" }}>
                          Balance
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {TableData.map((item, index) => (
                        <tr key={index}>
                          <td>{index + 1}</td>
                          <td>{item.master_bill_date}</td>
                          <td>{item.master_bill_type}</td>
                          <td>{item.customer_name}</td>
                          <td>
                            {invoiceDetails ? invoiceDetails : ""}-
                            {item.master_invoice_no}
                          </td>
                          <td>{item.master_paid_amount}</td>
                          <td>
                            {item.master_total_bill_amt -
                              item.master_paid_amount}
                          </td>
                          <td>{item.master_total_bill_amt}</td>
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
              Opening Balance : &#8377;
            </Col>
            <Col sm={2} className="bg-primary text-white fw-bold p-3">
              Total Debit Amt : &#8377;
            </Col>
            <Col
              sm={3}
              className="bg-warning text-white fw-bold p-3 text-center "
            >
              Total Credit Amt : &#8377;
            </Col>
            <Col sm={3} className="bg-secondary text-white fw-bold p-3">
              Balance Amt : &#8377;
            </Col>
          </Row>
        </div>
      </Container>
    </div>
  );
};

export default POSRegister;
