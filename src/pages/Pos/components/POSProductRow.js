import React, { useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  deleteProductFromStore,
  setTotalAmounts,
  decreaseProductQuantity,
  increaseProductQuantity,
  setVisibilityForSale,
  updateSingleProduct,
  updateMassQuantity,
  updateMRPPrice,
  makeLastProductEditable,
  updateCreditSingleProduct,
  setCreditTotalAmounts,
} from "../../../store/pos/POSSlice";
import { Input } from "reactstrap";
import { useEffect } from "react";
import AuthUser from "../../../helpers/Authuser";

const POSProductRow = ({ product, index, getindex ,paymentTerm,tabId}) => { 
  
  const dispatch = useDispatch();
  const [quantity, setQuantity] = useState(product.qty);
  const [salePrice, setSalePrice] = useState(product.salePrice); 
  const [creditPrice, setcreditPrice] = useState(product.price_credit); 
  
  const [quantityVisiblityState, setQuantityVisiblityState] = useState(false);
  const [salePriceVisibility, setsalePriceVisibility] = useState(false);
  const [creditPriceVisibility, setcreditPriceVisibility] = useState(false);
  const [lastProduct, setLastProduct] = useState(0);

  // REF

  const lastQtyRef = useRef(null);
  const lastSalePriceRef = useRef(null);
  const lastCreditPriceRef = useRef(null);

  // REDUX SELECTERS
  const isEditableQty = useSelector((state) => state.POSSlice.isQtyEditable);
  const cartProductsFromTheStore = useSelector(
    (state) => state.POSSlice.products
  );

  const handleQuantityEdit = () => {
    setQuantityVisiblityState(!quantityVisiblityState);
  };
  const handleSalePriceVisibility = () => {
    setsalePriceVisibility(!salePriceVisibility);
  };
  const handleCreditPriceVisibility = () => {
    setcreditPriceVisibility(!creditPriceVisibility);
  };

  const selectAllText = (event) => {
    return event.target.select();
  };

  const countDown = () => {
    dispatch(makeLastProductEditable(false));
    if (product.qty > 0) {
      setQuantity((prevQuantity) => prevQuantity - 1);
      dispatch(
        decreaseProductQuantity({
          product_id: product.product_id,
          newQuantity: quantity - 1,
          tab_id:tabId,
          paymentTerm:paymentTerm 
        })
      );
      if(paymentTerm == "Cash"){
      dispatch(setTotalAmounts());
      }else{
        dispatch(setCreditTotalAmounts());
      }
    }
  };

  const countUp = () => {
    dispatch(makeLastProductEditable(false));
    setQuantity((prevQuantity) => prevQuantity + 1);
    dispatch(
      increaseProductQuantity({
        product_id: product.product_id,
        newQuantity: quantity,
        tab_id:tabId,
        paymentTerm:paymentTerm
      })
    );
    if(paymentTerm == "Cash"){
      dispatch(setTotalAmounts());
      }else{
        dispatch(setCreditTotalAmounts());
      }
  };

  const handleForQty = () => {
    if (lastQtyRef.current) {
      lastQtyRef.current.focus();
    }
  };
  const handleForSale = () => {
    setsalePriceVisibility(true);
    if (lastSalePriceRef.current) {
      lastSalePriceRef.current.focus();
    }
  };
  const handleForCredit = () => {
    setcreditPrice(true);
    if (lastCreditPriceRef.current) {
      lastCreditPriceRef.current.focus();
    }
  };
  const { http } = AuthUser();

  // FINDING THE LAST PRODUCT
  const findLastProduct = () => {
    setLastProduct(
      cartProductsFromTheStore[cartProductsFromTheStore.length - 1].product_id
    );
  };
  useEffect(() => {
    getDetails();
    findLastProduct();
    const handleShortCut = (e) => {
      if (e.ctrlKey && e.key === ",") {
        setQuantityVisiblityState(true);
        setsalePriceVisibility(false);
        if (lastProduct === product.product_id) {
          handleForQty();
        }
      }

      if (e.ctrlKey && e.key === ".") {
        setsalePriceVisibility(true);
        setQuantityVisiblityState(false);
        if (lastProduct === product.product_id) {
          handleForSale();
        }
      }
      if (e.ctrlKey && e.key === "ArrowUp") {
        if (lastProduct === product.product_id) {
          countUp();
        }
      }
      if (e.ctrlKey && e.key === "ArrowDown") {
        if (lastProduct === product.product_id) {
          countDown();
        }
      }
    };
    window.addEventListener("keydown", handleShortCut);
    return () => {
      window.removeEventListener("keydown", handleShortCut);
    };
  }, [
    cartProductsFromTheStore,
    isEditableQty,
    product.product_id,
    lastProduct,
    quantity,
  ]);
  const [posLanguage, setPosLanguage] = useState(1);
  const getDetails = async () => {
    const resp = await http.get("/billing-settings/details");
    setPosLanguage(resp.data.pos_bill_language);
  };
  const CallBack = (index) => {
    getindex(index);
  }; 
  useEffect(()=>{
    paymentTerm == "Cash"?
    dispatch(setTotalAmounts())
    : dispatch(setCreditTotalAmounts())
  },[paymentTerm])
  return (
    <tr
      className="text-end"
      key={product.product_id}
      style={{
        background: lastProduct === product.product_id ? "#D0E7D2" : "white",
        lineHeight: "30px",
      }}
    >
      <th scope="row" className="text-start">
        {index + 1}
      </th>
      <td className="text-start" onClick={handleSalePriceVisibility}>
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
      <td className="text-end" style={{ width: "100px" }}>
        <div className="input-step light">
          <button type="button" className="minus" onClick={countDown}>
            –
          </button>
          {quantityVisiblityState ? (
            <input
              type="number"
              className="product-quantity fw-bold"
              value={quantity}
              min="0"
              max="1000"
              autoFocus
              ref={lastQtyRef}
              onFocus={selectAllText}
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
          ) : (
            <p onClick={handleQuantityEdit} className="mx-3">
              {product.qty}
            </p>
          )}
          <button type="button" className="plus" onClick={countUp}>
            +
          </button>
        </div>
      </td>
      <td style={{ width: "100px" }} onClick={handleSalePriceVisibility}>
        &#8377; {product.mrp}
      </td>
      {paymentTerm == "Cash"?<td style={{ width: "100px" }}>
        {salePriceVisibility ? (
          <Input
            type="number"
            className="product-quantity fw-bold text-end fs-5 bg-light"
            style={{ height: "30px" }}
            value={salePrice}
            ref={lastSalePriceRef}
            autoFocus
            onFocus={selectAllText}
            min="0"
            max="1000"
            onChange={(e) => {
              setSalePrice(e.target.value);
              dispatch(
                updateSingleProduct({
                  product_id: product.product_id,
                  newSalePrice: Number(e.target.value),
                })
              );
              dispatch(setTotalAmounts());
            }}
          />
        ) : (
          <span
            className="form-control fs-5 fw-bold"
            style={{ height: "30px", lineHeight: "15px" }}
            onClick={handleSalePriceVisibility}
          >
            <b>&#8377; {product.salePrice}</b>
          </span>
        )}
      </td>:
      <td style={{ width: "100px" }} onClick={handleCreditPriceVisibility}>
      {creditPriceVisibility ? (
          <Input
            type="number"
            className="product-quantity fw-bold text-end fs-5 bg-light"
            style={{ height: "30px" }}
            value={creditPrice}
            ref={lastCreditPriceRef}
            autoFocus
            onFocus={selectAllText}
            min="0"
            max="1000"
            onChange={(e) => {
              setcreditPrice(e.target.value);
              dispatch(
                updateCreditSingleProduct({
                  product_id: product.product_id,
                  newCreditPrice: Number(e.target.value),
                })
              );
              dispatch(setCreditTotalAmounts());
            }}
          />
        ) : (
          <span
            className="form-control fs-5 fw-bold"
            style={{ height: "30px", lineHeight: "15px" }}
            onClick={handleCreditPriceVisibility}
          >
            <b>&#8377; {product.price_credit}</b>
          </span>
        )}
      </td>}
      <td style={{ width: "100px" }} onClick={handleSalePriceVisibility}>
        &#8377; {paymentTerm == "Cash" ? (Number(product.salePrice) * Number(product.qty)):(Number(product.price_credit) * Number(product.qty))}
      </td>
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
                dispatch(deleteProductFromStore({
                  product_id: product.product_id,
                  tab_id: tabId,
                })); 
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

export default POSProductRow;
