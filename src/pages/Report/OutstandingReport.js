import React, { useEffect, useRef, useState } from "react";
import {
    Card,
    CardBody,
    Col,
    Container,
    CardHeader,
    Nav,
    Modal,
    ModalBody,
    Row,
} from "reactstrap";
import { ToastContainer, toast } from "react-toastify";
import AuthUser from "../../helpers/Authuser";
import InfiniteScroll from "react-infinite-scroll-component";
import Flatpickr from "react-flatpickr";
import Select from "react-select";
import axios from "axios";
import { identity } from "@fullcalendar/core/internal";
import BillHeader from "./BillHeader";
const OutstandingReport = () => {
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
        link.setAttribute('download', 'outStandingReport.csv');
        document.body.appendChild(link);
        link.click();
    };

    const [billDetails, setBillDetails] = useState([]);
    // ------------------------ Filter ----------------------------
    const [getFilterData, setFilterData] = useState({
        startDate: new Date().toLocaleDateString("en-GB"),
        endDate: new Date().toLocaleDateString("en-GB"),
    });
    // CUSTOM FUNCTIONS
    // const [tempMrp, setTempMrp] = useState(0);
    // const getbillDetailsList = async (page) => {
    //     const response = await http.get(`/customers/list?page=${page}&limit=30`);
    //     setBillDetails(response.data);
    //     if (response.data.length > 0) {
    //         let mrpTemp = 0;
    //         for (let i = 0; i < response.data.length; i++) {
    //             mrpTemp = mrpTemp + response.data[i].customer_credit_amount;
    //         }
    //         setTempMrp(mrpTemp);
    //         setBillDetails(response.data);
    //     }
    // };
    const fetchReceipt = async () => {
        try {
            await http.get("/reciept/total")
                .then((response) => {
                    console.log(response.data);
                    setTempReceipt(response.data);
                })
                .catch((err) => {
                    console.log(err);
                })
        } catch (err) {
            console.error(err);
        }
    }
    // const [tempCustomer, setTempCustomer] = useState([]);
    const [tempReceipt, setTempReceipt] = useState([]);
    useEffect(() => {
        fetchReceipt();
        handleFilterData();

    }, []);


    const handleFilterData = () => {

        if (getFilterData.startDate && getFilterData.endDate) {
            http
                .post("/outstandigreport/filter/data", getFilterData)
                .then(function (response) {
                    if (response.data.length > 0) {
                        console.log(response.data);
                        setBillDetails(response.data);
                    }
                })
                .catch(function (err) {
                    console.log(err);
                });

        }
    };
    return (
        <div className="page-content">
            <table
                ref={tableRef}
                style={{ display: "none" }}
                role="table"
                id="tableToPrint"
                className="text-center bg-white table"
            >
                <BillHeader title="Outstanding Report"/>
                <thead className="thead-light text-uppercase">
                    <tr>
                        <th title="Toggle SortBy" style={{ cursor: "pointer" }}>
                            Sr No
                        </th>
                        <th title="Toggle SortBy" style={{ cursor: "pointer" }}>
                            Customer Name
                        </th>
                        <th title="Toggle SortBy" style={{ cursor: "pointer" }}>
                            City
                        </th>
                        <th title="Toggle SortBy" style={{ cursor: "pointer" }}>
                            Mobile
                        </th>
                        <th title="Toggle SortBy" style={{ cursor: "pointer" }}>
                            Balance
                        </th>
                    </tr>
                </thead>
                <tbody>
                    {billDetails.map((item, index) => (
                        <tr key={index}>
                            <td>
                                <input type="checkbox" onClick={() => {
                                    toast.success("Customer Id " + item.customer_id)
                                }} />
                            </td>
                            <td>
                                {item.customer_name}
                            </td>
                            <td>
                                {item.customer_city}
                            </td>
                            <td>
                                {item.customer_mobile}
                            </td>
                            <td>
                                {tempReceipt.map((data, i) => (
                                    data.receipt_customer_name == item.customer_id ?
                                        item.total_bill_pending_amount - data.receipt_total_amount
                                        :
                                        ""
                                ))}
                            </td>
                        </tr>
                    ))}

                </tbody>
            </table>
            <Container fluid>
                <Row>
                    <Col lg={12}>
                        <Card>
                            <CardHeader className="card-header border-0">
                                <Row className="align-items-center">
                                    <div className="col-sm">
                                        <h5 className="card-title mb-0">Outstanding Report</h5>
                                    </div>
                                    <div className="col-sm-auto">
                                        <div className="d-flex gap-1 flex-wrap">


                                            <div>
                                                <Flatpickr
                                                    className="form-control"
                                                    options={{
                                                        dateFormat: "d/m/Y",
                                                        defaultDate: "today",
                                                    }}
                                                    name="payment_date"
                                                    placeholder="Enter start date"
                                                    onChange={(selectedDates) => {
                                                        const selectedDate = selectedDates[0];

                                                        const formattedDate =
                                                            selectedDate.toLocaleDateString("en-GB", {
                                                                day: "numeric",
                                                                month: "numeric",
                                                                year: "numeric",
                                                            });
                                                        setFilterData({
                                                            ...getFilterData,
                                                            startDate: formattedDate,
                                                        });
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
                                                    placeholder="Select End date"
                                                    name="payment_date"
                                                    onChange={(selectedDates) => {
                                                        const selectedDate = selectedDates[0];

                                                        const formattedDate =
                                                            selectedDate.toLocaleDateString("en-GB", {
                                                                day: "numeric",
                                                                month: "numeric",
                                                                year: "numeric",
                                                            });
                                                        setFilterData({
                                                            ...getFilterData,
                                                            endDate: formattedDate,
                                                        });
                                                    }}
                                                />
                                            </div>
                                            <div>
                                                <button
                                                    className="btn btn-primary w-100 me-1"
                                                    onClick={() => {
                                                        setBillDetails([]);
                                                        handleFilterData();
                                                    }}
                                                >
                                                    Search
                                                </button>
                                            </div>
                                            <div>

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
                                            </div>
                                            <div>

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
                                                    Customer Name
                                                </th>
                                                <th title="Toggle SortBy" style={{ cursor: "pointer" }}>
                                                    City
                                                </th>
                                                <th title="Toggle SortBy" style={{ cursor: "pointer" }}>
                                                    Mobile
                                                </th>
                                                <th title="Toggle SortBy" style={{ cursor: "pointer" }}>
                                                    Balance
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {billDetails.map((item, index) => (
                                                <tr key={index}>
                                                    <td>
                                                        <input type="checkbox" onClick={() => {
                                                            toast.success("Customer Id " + item.customer_id)
                                                        }} />
                                                    </td>
                                                    <td>
                                                        {item.customer_name}
                                                    </td>
                                                    <td>
                                                        {item.customer_city}
                                                    </td>
                                                    <td>
                                                        {item.customer_mobile}
                                                    </td>
                                                    <td>
                                                        {tempReceipt.map((data, i) => (
                                                            data.receipt_customer_name == item.customer_id ?
                                                                item.total_bill_pending_amount - data.receipt_total_amount
                                                                :
                                                                ""
                                                        ))}
                                                    </td>
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
                        <Col sm={10} className="bg-dark text-center text-white fw-bold p-3">
                            MRP: {""}
                        </Col>

                    </Row>
                </div>
            </Container>
        </div>
    );
};

export default OutstandingReport;
