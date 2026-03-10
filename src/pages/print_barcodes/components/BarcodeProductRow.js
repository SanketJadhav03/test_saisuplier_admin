import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { Col, Input, Row } from "reactstrap";
import { useDispatch } from "react-redux";
import {
  deleteProductFromStore,
  setTotalAmounts,
  updateSingleProduct,
  increaseProductQuantity,
  decreaseProductQuantity,
  setVisibility,
  updateMassQuantity,
} from "../../../store/barcode/BarcodeSlice";
import AuthUser from "../../../helpers/Authuser";

const BarcodeProductRow = ({
  product,
  index,
  updateTotal,
  getindex,
  showToast,
}) => {
  const dispatch = useDispatch();
  const [quantity, setQuantity] = useState(2);
  const [salePrice, setSalePrice] = useState(product.salePrice);
  const qtyRef = useRef(null);
  const checkForOdd = (count) => {
    // if (count % 2 === 0) {
    //   showToast();
    //   return false;
    // }
    return true;
  };
  const countDown = () => {
    if (quantity > 0 && quantity != 1) {
      setQuantity((prevQuantity) => prevQuantity - 1);
      checkForOdd(quantity);
      dispatch(
        decreaseProductQuantity({
          productNo: product.product_id,
          newQuantity: quantity - 1,
        })
      );
      dispatch(setTotalAmounts());
      dispatch(setVisibility(false));
    }
  };
  const { http } = AuthUser();

  const [posLanguage, setPosLanguage] = useState(1);
  const getDetails = async () => {
    const resp = await http.get("/billing-settings/details");
    setPosLanguage(resp.data.pos_bill_language);
  };

  const countUp = () => {
    setQuantity((prevQuantity) => prevQuantity + 1);
    dispatch(
      increaseProductQuantity({
        productNo: product.product_id,
        newQuantity: quantity,
      })
    );
    checkForOdd(quantity);
    dispatch(setTotalAmounts());
    dispatch(setVisibility(false));
  };

  useEffect(() => {
    getDetails();
    console.log(product);
  }, [quantity, product.product_id, updateTotal, dispatch]);

  const CallBack = (index) => {
    getindex(index);
  };
  return (
    <tr className="text-end" key={product.product_hsn_code}>
      <th scope="row" className="text-start">
        <span>{`${index + 1}`}</span>
      </th>
      <td className="text-start">
        <strong>
          {" "}
          {posLanguage === 1 ? (
            product.marathi_name
          ) : posLanguage === 2 ? (
            product.product_name
          ) : (
            <>
              {product.product_name}/ {product.marathi_name}
            </>
          )}
        </strong>
      </td>
      <td className="text-start">{product.product_hsn_code}</td>
      <td className="text-end" style={{ width: "100px" }}>
        <Row className="gy-4">
          <Col sm={12}>
            <div className="input-step light">
              <button type="button" className="minus" onClick={countDown}>
                –
              </button>
              <input
                type="number"
                className="product-quantity fw-bold"
                value={quantity}
                ref={qtyRef}
                min="0"
                max="1000"
                onFocus={() => {
                  if (qtyRef.current) {
                    qtyRef.current.select();
                  }
                }}
                onChange={(e) => {
                  setQuantity(Number(e.target.value));
                  dispatch(
                    updateMassQuantity({
                      product_id: product.product_id,
                      newQty: Number(e.target.value),
                    })
                  );
                  updateSingleProduct({
                    product_id: product.product_id,
                    newSalePrice: Number(salePrice),
                  });
                  dispatch(setTotalAmounts());
                }}
              />
              <button type="button" className="plus" onClick={countUp}>
                +
              </button>
            </div>
          </Col>
        </Row>
      </td>
      <td style={{ width: "100px" }}>&#8377; {product.mrp}</td>
      <td style={{ width: "100px" }}>&#8377; {product.salePrice}</td>
      <td style={{ width: "100px" }}>&#8377; {product.purchase_price}</td>
      <td style={{ width: "100px" }}>&#8377; {product.online_price}</td>
      <td style={{ width: "100px" }}>&#8377; {product.wholesaler_price}</td>
      <td style={{ width: "80px" }}>
        <div className="d-flex justify-content-around">
          <li className="list-inline-item edit">
            <i
              className=" ri-edit-line fs-18 text-primary"
              onClick={() => {
                CallBack(product.product_id);
              }}
            ></i>
          </li>
          <li className="list-inline-item">
            <span
              to="#"
              className="text-danger d-inline-block remove-item-btn cursor-pointer"
              onClick={() => {
                dispatch(deleteProductFromStore(product.product_id));
                dispatch(setVisibility(false));
                dispatch(setTotalAmounts());
              }}
            >
              <i className="ri-delete-bin-5-fill fs-16"></i>
            </span>
          </li>
        </div>
      </td>
    </tr>
  );
};

export default BarcodeProductRow;
