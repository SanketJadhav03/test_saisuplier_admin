import React, { useState } from "react";
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
import AuthUser from "../../helpers/Authuser";
import { useEffect } from "react";

const LoyaltyPoints = () => {
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
        if (data._reactName == "onClick") {
            http
                .delete(`/loyality/points/delete/${ID}`)
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
        document.title = "Brands | Saisupplier Admin";

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
        Setcounts(counts + 1);
    };

    const [counts, Setcounts] = useState(1);

    // Edit Data
    const [btnStatus,setBtnStatus] = useState(true);
    const EditUpdate = (index) => {
        let FindArray = rangeData.filter((_, i) => i == index);
        setBtnStatus(false);
        setRange(FindArray[0]);
        setUpdateModalStates(!UpdatemodalStates);
    };

    // 
    const [rangeData, setRangeData] = useState([]);
    useEffect(() => {
        fetchData();

    }, [counts]);
    const fetchData = async () => {
        await http
            .get("/loyality/points/list")
            .then((response) => {
                setRangeData(response.data);
            })
            .catch((err) => {
                console.log(err);
            })
    }
    const [range, setRange] = useState({
        loyality_min_range: "",
        loyality_max_range: "",
        loyality_reward_points: ""
    })
    const handleRange = (e) => {
        setRange({
            ...range,
            [e.target.name]: e.target.value
        })
    }
    const verifyRange = ()=>{
        if(parseInt(range.loyality_min_range)>parseInt(range.loyality_max_range)){
            toast.error("Min range can't be greater than Max range !");
        }else if(parseInt(range.loyality_min_range)===parseInt(range.loyality_max_range)){
            toast.warn("Min and max range can't be same !");
        }else{
            addRange();
        }
    }
    const addRange = () => {
        if (range.loyality_max_range!=0 && range.loyality_min_range!=0 && range.loyality_reward_points!=0) {
            http
                .post("/loyality/points/store", range)
                .then((response) => {
                   if(response.data.status == 1){
                    toast.warn(response.data.message);
                   }else{
                    toast.success(response.data.message);
                    setRange({
                        loyality_min_range: "",
                        loyality_max_range: "",
                        loyality_reward_points: ""
                    });
                   }
                    
                    fetchData();
                    Setcounts(1);
                })
                .catch((err) => {
                    console.log(err);
                })
        } else {
            toast.warning("All field compulsory!");
        }
    }
    const updateRange = () => {
        if (range.loyality_max_range && range.loyality_min_range && range.loyality_reward_points) {
            http
                .put("/loyality/points/update", range)
                .then((response) => {
                    setBtnStatus(true);
                    toast.success("Record updated successfully!");
                    setRange({
                        loyality_min_range: "",
                        loyality_max_range: "",
                        loyality_reward_points: ""
                    });
                    fetchData();
                    Setcounts(1);
                })
                .catch((err) => {
                    console.log(err);
                })
        } else {
            toast.warning("All field compulsory!");
        }
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
                                        <div className="row">
                                            <div className="col-3 card-title text-center fw-bold ">
                                                Set Min Range
                                                <input type="number" onChange={handleRange} name="loyality_min_range" value={range.loyality_min_range} className="form-control" />
                                            </div>
                                            <div className="col-3 card-title text-center fw-bold ">
                                                Set Max Range
                                                <input type="number" onChange={handleRange} name="loyality_max_range" className="form-control" value={range.loyality_max_range} />
                                            </div>
                                            <div className="col-3 card-title text-center fw-bold ">
                                                Points
                                                <input value={range.loyality_reward_points} type="number" onChange={handleRange} name="loyality_reward_points" className="form-control" />
                                            </div>
                                            <div className="col-3 px-2 py-2 text-center mt-3">
                                               { btnStatus?<button
                                                    type="button"
                                                    className="btn fw-bold btn-success w-100"
                                                    id="create-btn"
                                                    onClick={() => verifyRange()}
                                                >
                                                    Add to List
                                                </button>
                                                :
                                                <button
                                                    type="button"
                                                    className="btn fw-bold btn-success w-100"
                                                    id="create-btn"
                                                    onClick={() => updateRange()}
                                                >
                                                    Update List
                                                </button>
                                               }
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
                                                <th
                                                    title="Toggle SortBy"
                                                    style={{ cursor: "pointer" }}
                                                >
                                                    Min Range
                                                </th>
                                                <th
                                                    title="Toggle SortBy"
                                                    style={{ cursor: "pointer" }}
                                                >
                                                    Max Range
                                                </th>
                                                <th
                                                    title="Toggle SortBy"
                                                    style={{ cursor: "pointer" }}
                                                >
                                                    Points
                                                </th>
                                                <th
                                                    title="Toggle SortBy"
                                                    style={{ cursor: "pointer" }}
                                                >
                                                    Action
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {rangeData.map((item, index) => (
                                                <tr key={index}>
                                                    <td>
                                                        {item.loyality_min_range}
                                                    </td>
                                                    <td>
                                                        {item.loyality_max_range}
                                                    </td>
                                                    <td>
                                                        {item.loyality_reward_points}
                                                    </td>
                                                    <td>
                                                        <button
                                                        onClick={()=>EditUpdate(index)}
                                                            className="text-primary d-inline-block remove-item-btn  border-0 bg-transparent"
                                                        >
                                                            <i className="ri-pencil-fill fs-16" />
                                                        </button>
                                                        <button
                                                        onClick={()=>onClickDelete(item.loyality_id)}
                                                            className="text-danger d-inline-block remove-item-btn  border-0 bg-transparent"
                                                        >
                                                            <i className="ri-delete-bin-5-fill fs-16" />
                                                        </button>
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
            </Container>
        </div>
    );
};

export default LoyaltyPoints;
