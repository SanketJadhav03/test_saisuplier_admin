import React, { useState, useRef } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
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
import ProductAdd from "./ProductAdd";
import ProductUpdate from "./ProductUpdate";
import { useEffect } from "react";
import AuthUser from "../../helpers/Authuser";
import ProductView from "./ProductView";
import D_img from "../D_img";
import { IMG_API_URL } from "../../helpers/url_helper";

const ProductsList = () => {
  const [modalStates, setModalStates] = useState(false);
  const [UpdatemodalStates, setUpdateModalStates] = useState(false);
  const [ViewmodalStates, setViewModalStates] = useState(false);
  const { checkPermission, http, permission } = AuthUser();
  //   Delete Aleart
  const [deleteModal, setDeleteModal] = useState(false);
  const [ID, SetID] = useState();
  const onClickDelete = (data) => {
    SetID(data);
    setDeleteModal(true);
  };

  const [counts, Setcounts] = useState(1);
  const [ProductData, SetProductData] = useState([]);
  // infinity
  useEffect(() => {
    http
      .get(`/products/list`)
      .then(function (response) {
        if (response.data.length > 0) {
          SetProductData(response.data);
        }
      })
      .catch(function (error) {
        console.log(error);
      });
  }, [counts]);

  const fetchData = () => {
    Setcounts(counts + 1);
  };
  //   end Alert
  const handleCallback = (data, status) => {
    if (data.status == 0) {
      toast.success(data.message);
    } else {
      toast.warn(data.message);
    }
    setModalStates(false);
    setUpdateModalStates(false);
    SetProductData([]);
    Setcounts(counts + 1);
  };
  const handleDeleteOrder = (data) => {
    if (data._reactName == "onClick") {
      http
        .delete(`/products/delete/${ID}`)
        .then(function (response) {
          SetProductData(ProductData.filter((_, i) => _.product_id !== ID));
          if (response.data.status == 0) {
            toast.success(response.data.message);
          } else {
            toast.warn(response.data.message);
          }
          SetProductData([]);
          Setcounts(counts + 1);
        })
        .catch(function (error) {
          console.log(error);
        });
    }
    setDeleteModal(false);
  };
  // Edit Data
  const [FindData, SetFind] = useState([]);

  const EditUpdate = (index) => {
    let FindArray = ProductData.filter((_, i) => i == index);
    SetFind(FindArray[0]);
    setUpdateModalStates(!UpdatemodalStates);
  };
  const oneView = (index) => {
    let FindArray = ProductData.filter((_, i) => i == index);
    SetFind(FindArray[0]);
    setViewModalStates(!ViewmodalStates);
  };

  const AddProduct = useRef();
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.altKey && event.key === "a") {
        event.preventDefault();
        AddProduct.current.click();
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);
  // Search prodcut
  const Search_product = (e) => {
    if (e.target.value != "") {
      http
        .get(`/product/information_barcode_onkeyup/${e.target.value}`)
        .then(function (response) {
          SetProductData(response.data);
        })
        .catch(function (error) {
          console.log(error);
        });
    } else {
      SetProductData([]);
      Setcounts(counts + 1);
    }
  };
  const toggleProductStatus = (productId, currentStatus) => {
    const newStatus = currentStatus == 1 ? 0 : 1;

    // API call example
    http
      .post("/products/status", {
        product_id: productId,
        product_status: newStatus,
      })
      .then((res) => {
        toast.success(res.data.message);
        Setcounts(counts + 1);
      });
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
                    <h5 className="card-title mb-0">Product List</h5>
                  </div>

                  <div className="col-sm-auto">
                    <div className="d-flex gap-1 flex-wrap">
                      <input
                        type="text"
                        style={{
                          width: "200px",
                          padding: "5px",
                          border: "1px solid #ccc",
                          borderRadius: "4px",
                        }}
                        placeholder="Search Product....."
                        onChange={(e) => Search_product(e)}
                      />
                      {permission.find(
                        (permission) =>
                          permission.permission_category === "PRODUCTS" &&
                          permission.permission_path === "2",
                      ) && (
                        <button
                          type="button"
                          className="btn fw-bold btn-success add-btn"
                          id="create-btn"
                          onClick={() => setModalStates(!modalStates)}
                          ref={AddProduct}
                        >
                          <i className="ri-add-line align-bottom me-1"></i> Add
                          Product
                        </button>
                      )}
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
                          Image
                        </th>
                        <th title="Toggle SortBy" style={{ cursor: "pointer" }}>
                          Product Name
                        </th>
                        <th title="Toggle SortBy" style={{ cursor: "pointer" }}>
                          TAX
                        </th>

                        <th title="Toggle SortBy" style={{ cursor: "pointer" }}>
                          Category
                        </th>
                        <th title="Toggle SortBy" style={{ cursor: "pointer" }}>
                          Sub Category
                        </th>
                        <th title="Toggle SortBy" style={{ cursor: "pointer" }}>
                          Product Status
                        </th>
                        <th>Action</th>
                      </tr>
                    </thead>
                    {permission.find(
                      (permission) =>
                        permission.permission_category === "PRODUCTS" &&
                        permission.permission_path == "2",
                    ) ? (
                      <tbody>
                        {ProductData.map((item, index) => (
                          <tr key={index}>
                            <td>
                              <a
                                className="fw-medium link-primary"
                                href="/apps-ecommerce-order-details"
                              >
                                {index + 1}
                              </a>
                            </td>
                            <td>
                              {item.product_image ? (
                                <img
                                  src={`${IMG_API_URL}/products/${item.product_image}`}
                                  alt="old-product-img"
                                  className="h-auto"
                                  width={"100px"}
                                />
                              ) : (
                                <D_img />
                              )}
                            </td>
                            <td
                              style={{
                                maxWidth: "160px",
                                whiteSpace: "normal",
                                wordBreak: "break-word",
                                overflowWrap: "anywhere",
                                lineHeight: "1.4",
                              }}
                              title={item.product_english_name} // tooltip on hover
                            >
                              {item.product_english_name}
                            </td>
                            <td>{item.tax_name}</td>
                            <td>{item.category_name}</td>
                            <td>{item.bank_name}</td>
                            <td>
                              <span
                                className={`badge ${item.product_status ? "bg-success" : "bg-danger"}`}
                              >
                                {item.product_status ? "Active" : "Inactive"}
                              </span>
                            </td>
                            <td>
                              <ul className="list-inline hstack gap-2 mb-0">
                                <li className="list-inline-item edit d-flex align-items-center gap-2">
                                  {/* Status Switch */}
                                  <div className="form-check form-switch m-0">
                                    <input
                                      className="form-check-input"
                                      type="checkbox"
                                      checked={item.product_status == 1}
                                      onChange={() =>
                                        toggleProductStatus(
                                          item.product_id,
                                          item.product_status,
                                        )
                                      }
                                    />
                                  </div>
                                </li>

                                {/* <li className="list-inline-item edit">
                                    <button
                                      className="text-primary d-inline-block edit-item-btn border-0 bg-transparent"
                                      onClick={() => oneView(index)}
                                    >
                                      <i className="ri-eye-fill fs-16" />
                                    </button>
                                  </li>  */}
                                {permission.find(
                                  (permission) =>
                                    permission.permission_category ===
                                      "PRODUCTS" &&
                                    permission.permission_path === "3",
                                ) && (
                                  <li className="list-inline-item edit">
                                    <button
                                      className="text-primary d-inline-block edit-item-btn border-0 bg-transparent"
                                      onClick={() => EditUpdate(index)}
                                    >
                                      <i className="ri-pencil-fill fs-16" />
                                    </button>
                                  </li>
                                )}
                                {permission.find(
                                  (permission) =>
                                    permission.permission_category ===
                                      "PRODUCTS" &&
                                    permission.permission_path === "4",
                                ) && (
                                  <li className="list-inline-item">
                                    <button
                                      onClick={() =>
                                        onClickDelete(item.product_id)
                                      }
                                      className="text-danger d-inline-block remove-item-btn  border-0 bg-transparent"
                                    >
                                      <i className="ri-delete-bin-5-fill fs-16" />
                                    </button>
                                  </li>
                                )}
                              </ul>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    ) : (
                      <tbody>
                        <tr>
                          <td colSpan={11}>
                            <div className="text-center text-danger fw-bold">
                              You are not Allowed!
                            </div>
                          </td>
                        </tr>
                      </tbody>
                    )}
                  </table>
                </div>
              </CardBody>
            </Card>
          </Col>
        </Row>
        {modalStates === true ? (
          <ProductAdd
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
          <ProductUpdate
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
        {ViewmodalStates === true ? (
          <ProductView
            modalStates={ViewmodalStates}
            setModalStates={() => {
              setViewModalStates(false);
            }}
            checkchang={handleCallback}
            edit_data={FindData}
          />
        ) : (
          ""
        )}
        <ToastContainer closeButton={false} limit={1} />
      </Container>
    </div>
  );
};

export default ProductsList;
