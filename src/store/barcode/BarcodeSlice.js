import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    products: [],
    totalSalesPrice: 0,
    totalMRP: 0,
    totalDiscount: 0,
    totalBillAmount: 0,
    totalQty: 0,
    isVisibilityForAmount: false,
};

const barcodeSlice = createSlice({
    name: 'BarcodeSlice',
    initialState: initialState,
    reducers: {
        addProductToStore: (state, action) => {
            state.products = [...state.products, ...action.payload];
        },
        deleteProductFromStore: (state, action) => {
            const productNoToDelete = action.payload;
            state.products = state.products.filter(product => product.product_id !== productNoToDelete);
        },
        setTotalAmounts: (state) => {
            console.log(state);
            state.totalSalesPrice = 0;
            state.totalMRP = 0;
            state.totalDiscount = 0;
            state.totalBillAmount = 0;
            state.totalQty = 0;
            for (const product of state.products) {
                state.totalMRP += product.mrp * product.qty;
                state.totalQty += product.qty;
                state.totalSalesPrice += product.salePrice * product.qty;
                state.totalBillAmount += product.salePrice * product.qty;
            }
        },
        updateSingleProduct: (state, action) => {
            const { product_id, newSalePrice, marathi, english, purchase, online, price_credit, wholesaler, mrp, barcode } = action.payload;
            const productToUpdate = state.products.find(product => product.product_id === product_id);
            if (productToUpdate) {
                productToUpdate.salePrice = newSalePrice;
                productToUpdate.product_name = english;
                productToUpdate.marathi_name = marathi;
                productToUpdate.online_price = online;
                productToUpdate.price_credit = price_credit;
                productToUpdate.purchase_price = purchase;
                productToUpdate.mrp = mrp;
                productToUpdate.wholesaler_price = wholesaler;
                productToUpdate.product_hsn_code = barcode;
            }
        },
        updateMassQuantity: (state, action) => {
            const { product_id, newQty } = action.payload;
            const productToUpdate = state.products.find(product => product.product_id === product_id);
            if (productToUpdate) {
                productToUpdate.qty = newQty
                productToUpdate.totalPrice = productToUpdate.qty * productToUpdate.salePrice;
            }
        },
        increaseProductQuantity: (state, action) => {
            const { productNo, newQuantity } = action.payload;
            const productToUpdate = state.products.find(product => product.product_id === productNo);
            if (productToUpdate) {
                productToUpdate.qty = productToUpdate.qty + 1;
            }
        },
        decreaseProductQuantity: (state, action) => {
            const { productNo, newQuantity } = action.payload;
            const productToUpdate = state.products.find(product => product.product_id === productNo);
            if (productToUpdate) {
                productToUpdate.qty = productToUpdate.qty - 1;
            }
        },
        setVisibility: (state, action) => {
            state.isVisibilityForAmount = action.payload
        },
        removeAllProducts: (state, action) => {
            state.products = [];
        }
    },
});

export const { addProductToStore, deleteProductFromStore, setTotalAmounts, updateSingleProduct, increaseProductQuantity, decreaseProductQuantity, setVisibility, removeAllProducts, updateMassQuantity } = barcodeSlice.actions;

export default barcodeSlice.reducer;
