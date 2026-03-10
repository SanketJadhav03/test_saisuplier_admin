import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    tab_id: 1,
    products: [],
    totalSalesPrice: 0,
    totalMRP: 0,
    totalDiscount: 0,
    totalBillAmount: 0,
    totalPayable: 0,


    // new Peices
    totalCardAmount: 0,
    totalSalesAgent: 0,
    totalMargin: 0,
    totalPurchaseAmount: 0,
    totalPackingAmount: 0,
    totalFranchiseAmount: 0,
    totalMartAmount: 0,
    totalWholesalerAmount: 0,
    totalDistributorAmount: 0,
    totalOnlineAmount: 0,
    // new prices end

    totalRemaining: 0,
    totalQty: 0,
    isVisibilityForAmount: false,
    isVisibilityForSalePrice: false,
    isQtyEditable: false,
    invoiceDetails: {},
    isPrintingDialogOpening: false
};

const roundToTwoDecimalPlaces = (value) => Math.round(value * 100) / 100;

const posSlice = createSlice({
    name: 'POSSLICE',
    initialState: initialState,
    reducers: {
        addTabId: (state, action) => {
            const { tab_id } = action.payload;
            state.tab_id = tab_id;
        },
        addProductToStore: (state, action) => {
            state.products = [...state.products, ...action.payload];
        },
        deleteProductFromStore: (state, action) => {
            const { product_id, tab_id } = action.payload;

            state.products = state.products.filter((product, index) => tab_id == 0 ? product.product_id != product_id : (product.tab_id == tab_id ? product.product_id != product_id : true));
        },
        setTotalAmounts: (state) => {
            state.totalSalesPrice = roundToTwoDecimalPlaces(0);
            state.totalMRP = roundToTwoDecimalPlaces(0);
            state.totalDiscount = roundToTwoDecimalPlaces(0);
            state.totalBillAmount = roundToTwoDecimalPlaces(0);
            state.totalQty = roundToTwoDecimalPlaces(0);
            state.totalPayable = roundToTwoDecimalPlaces(0);
            // New Prices
            state.totalCardAmount = roundToTwoDecimalPlaces(0);
            state.totalSalesAgent = roundToTwoDecimalPlaces(0);
            state.totalMargin = roundToTwoDecimalPlaces(0);
            state.totalPurchaseAmount = roundToTwoDecimalPlaces(0);
            state.totalPackingAmount = roundToTwoDecimalPlaces(0);
            state.totalFranchiseAmount = roundToTwoDecimalPlaces(0);
            state.totalMartAmount = roundToTwoDecimalPlaces(0);
            state.totalWholesalerAmount = roundToTwoDecimalPlaces(0);
            state.totalDistributorAmount = roundToTwoDecimalPlaces(0);
            state.totalOnlineAmount = roundToTwoDecimalPlaces(0);


            state.totalRemaining = roundToTwoDecimalPlaces(0);
            for (const product of state.products) {

                if (product.tab_id == state.tab_id) {
                    state.totalMRP += roundToTwoDecimalPlaces(product.mrp * product.qty);
                    state.totalQty += roundToTwoDecimalPlaces(product.qty);
                    state.totalSalesPrice += roundToTwoDecimalPlaces(product.salePrice * product.qty);
                    state.totalBillAmount += roundToTwoDecimalPlaces(product.salePrice * product.qty);
                    state.totalPayable += roundToTwoDecimalPlaces(product.salePrice * product.qty);

                    // New Prices
                    state.totalCardAmount += roundToTwoDecimalPlaces(product.price_card * product.qty);
                    state.totalSalesAgent += roundToTwoDecimalPlaces(product.sales_agent * product.qty);
                    state.totalMargin += roundToTwoDecimalPlaces(product.margin * product.qty);
                    state.totalPurchaseAmount += roundToTwoDecimalPlaces(product.price_purchase * product.qty);
                    state.totalPackingAmount += roundToTwoDecimalPlaces(product.price_cost * product.qty);
                    state.totalFranchiseAmount += roundToTwoDecimalPlaces(product.price_fran * product.qty);
                    state.totalMartAmount += roundToTwoDecimalPlaces(product.price_mart * product.qty);
                    state.totalWholesalerAmount += roundToTwoDecimalPlaces(product.price_wholesaler * product.qty);
                    state.totalDistributorAmount += roundToTwoDecimalPlaces(product.price_distributor * product.qty);
                    state.totalOnlineAmount += roundToTwoDecimalPlaces(product.price_online * product.qty);
                    // New Prices End

                } else if (product.tab_id == undefined) {
                    state.totalMRP += roundToTwoDecimalPlaces(product.mrp * product.qty);
                    state.totalQty += roundToTwoDecimalPlaces(product.qty);
                    state.totalSalesPrice += roundToTwoDecimalPlaces(product.salePrice * product.qty);
                    state.totalBillAmount += roundToTwoDecimalPlaces(product.salePrice * product.qty);
                    state.totalPayable += roundToTwoDecimalPlaces(product.salePrice * product.qty);
                    // New Prices
                    state.totalCardAmount += roundToTwoDecimalPlaces(product.price_card * product.qty);
                    state.totalSalesAgent += roundToTwoDecimalPlaces(product.sales_agent * product.qty);
                    state.totalMargin += roundToTwoDecimalPlaces(product.margin * product.qty);
                    state.totalPurchaseAmount += roundToTwoDecimalPlaces(product.price_purchase * product.qty);
                    state.totalPackingAmount += roundToTwoDecimalPlaces(product.price_cost * product.qty);
                    state.totalFranchiseAmount += roundToTwoDecimalPlaces(product.price_fran * product.qty);
                    state.totalMartAmount += roundToTwoDecimalPlaces(product.price_mart * product.qty);
                    state.totalWholesalerAmount += roundToTwoDecimalPlaces(product.price_wholesaler * product.qty);
                    state.totalDistributorAmount += roundToTwoDecimalPlaces(product.price_distributor * product.qty);
                    state.totalOnlineAmount += roundToTwoDecimalPlaces(product.price_online * product.qty);
                    // New Prices End
                }
            }
        },
        setCreditTotalAmounts: (state) => {
            state.totalSalesPrice = roundToTwoDecimalPlaces(0);
            state.totalMRP = roundToTwoDecimalPlaces(0);
            state.totalDiscount = roundToTwoDecimalPlaces(0);
            state.totalBillAmount = roundToTwoDecimalPlaces(0);
            state.totalQty = roundToTwoDecimalPlaces(0);
            state.totalPayable = roundToTwoDecimalPlaces(0);
            state.totalRemaining = roundToTwoDecimalPlaces(0);
            for (const product of state.products) {
                if (product.tab_id == state.tab_id) {
                    state.totalMRP += roundToTwoDecimalPlaces(product.mrp * product.qty);
                    state.totalQty += roundToTwoDecimalPlaces(product.qty);
                    state.totalSalesPrice += roundToTwoDecimalPlaces(product.price_credit * product.qty);
                    state.totalBillAmount += roundToTwoDecimalPlaces(product.price_credit * product.qty);
                    state.totalPayable += roundToTwoDecimalPlaces(product.price_credit * product.qty);
                } else if (product.tab_id == undefined) {
                    state.totalMRP += roundToTwoDecimalPlaces(product.mrp * product.qty);
                    state.totalQty += roundToTwoDecimalPlaces(product.qty);
                    state.totalSalesPrice += roundToTwoDecimalPlaces(product.price_credit * product.qty);
                    state.totalBillAmount += roundToTwoDecimalPlaces(product.price_credit * product.qty);
                    state.totalPayable += roundToTwoDecimalPlaces(product.price_credit * product.qty);
                }
            }
        },
        updateSingleProduct: (state, action) => {
            const { product_id, newSalePrice, newCreditPrice, paymentTerm } = action.payload;

            const productToUpdate = state.products.find(product => product.product_id == product_id);
            if (productToUpdate) {
                productToUpdate.salePrice = newSalePrice;
                productToUpdate.price_credit = newCreditPrice;
                productToUpdate.totalPrice = roundToTwoDecimalPlaces(paymentTerm && paymentTerm == "Cash" ? newSalePrice : newCreditPrice * productToUpdate.qty);
            }
        },
        updateCreditSingleProduct: (state, action) => {
            const { product_id, newCreditPrice } = action.payload;
            const productToUpdate = state.products.find(product => product.product_id === product_id);
            if (productToUpdate) {
                productToUpdate.price_credit = newCreditPrice;
                productToUpdate.totalPrice = roundToTwoDecimalPlaces(newCreditPrice * productToUpdate.qty);
            }
        },
        updateMRPPrice: (state, action) => {
            const { product_id, newMRPPrice } = action.payload;
            const productToUpdate = state.products.find(product => product.product_id === product_id);
            if (productToUpdate) {
                productToUpdate.mrp = newMRPPrice;
            }
        },
        updateMassQuantity: (state, action) => {
            const { product_id, newQty } = action.payload;
            const productToUpdate = state.products.find(product => product.product_id === product_id);
            if (productToUpdate) {
                productToUpdate.qty = newQty;
                productToUpdate.totalPrice = roundToTwoDecimalPlaces(newQty * productToUpdate.salePrice);
            }
        },
        increaseProductQuantity: (state, action) => {
            const { product_id, tab_id, paymentTerm } = action.payload;
            const productToUpdate = state.products.find(product => product.product_id === product_id && (tab_id ? product.tab_id == tab_id : true));

            if (productToUpdate) {
                productToUpdate.qty = roundToTwoDecimalPlaces(productToUpdate.qty + 1);
                productToUpdate.totalPrice = roundToTwoDecimalPlaces(paymentTerm == "Cash" ? (productToUpdate.qty * productToUpdate.salePrice) : (productToUpdate.qty * productToUpdate.price_credit));
            }
        },
        decreaseProductQuantity: (state, action) => {
            const { product_id, tab_id, paymentTerm } = action.payload;
            const productToUpdate = state.products.find(product => product.product_id === product_id && (tab_id ? product.tab_id == tab_id : true));
            if (productToUpdate) {
                productToUpdate.qty = roundToTwoDecimalPlaces(productToUpdate.qty - 1);
                productToUpdate.totalPrice = roundToTwoDecimalPlaces(paymentTerm == "Cash" ? (productToUpdate.qty * productToUpdate.salePrice) : (productToUpdate.qty * productToUpdate.price_credit));
            }
        },
        setVisibility: (state, action) => {
            state.isVisibilityForAmount = action.payload;
        },
        setVisibilityForSale: (state, action) => {
            state.isVisibilityForSalePrice = action.payload;
        },
        updatePayable: (state, action) => {
            const { billAmount, paymentTerm } = action.payload;
            state.totalPayable = roundToTwoDecimalPlaces(0);


            for (const product of state.products) {
                if (product.tab_id == state.tab_id) {
                    if (paymentTerm == "Cash") {
                        state.totalPayable += roundToTwoDecimalPlaces(product.salePrice * product.qty);
                    } else {
                        state.totalPayable += roundToTwoDecimalPlaces(product.price_credit * product.qty);
                    }
                } else if (product.tab_id == undefined) {
                    if (paymentTerm == "Cash") {
                        state.totalPayable += roundToTwoDecimalPlaces(product.salePrice * product.qty);
                    } else {
                        state.totalPayable += roundToTwoDecimalPlaces(product.price_credit * product.qty);
                    }
                }
            }
            state.totalRemaining = roundToTwoDecimalPlaces(state.totalPayable - billAmount);
            state.totalPayable = roundToTwoDecimalPlaces(billAmount);
        },
        makeLastProductEditable: (state, action) => {
            state.isQtyEditable = action.payload;
        },
        removeAllProducts: (state, action) => {
            const { tab_id } = action.payload;
            if (tab_id != 0) {
                state.products = state.products.filter((product) => product.tab_id != tab_id);
            } else {
                state.products = [];
            }
        },
        addMassAssignment: (state, action) => {
            state.products = action.payload;
        },
        setInvoiceDetails: (state, action) => {
            state.invoiceDetails = action.payload
        },
        setPrintingDialogState: (state, action) => {
            state.isPrintingDialogOpening = action.payload
        },
        setTotalPayable: (state, action) => {
            state.totalPayable = action.payload
        },
        setTotalCardAmount: (state, action) => {
            state.totalCardAmount = action.payload
        },
        setTotalRemaining: (state, action) => {
            state.totalRemaining = action.payload
        }
    },
});

export const {
    addProductToStore,
    addTabId,
    deleteProductFromStore,
    setTotalAmounts,
    setCreditTotalAmounts,
    updateSingleProduct,
    updateCreditSingleProduct,
    increaseProductQuantity,
    updateMRPPrice,
    decreaseProductQuantity,
    setVisibility,
    setVisibilityForSale,
    updatePayable,
    updateMassQuantity,
    makeLastProductEditable,
    removeAllProducts,
    addMassAssignment,
    setPrintingDialogState,
    setInvoiceDetails,
    setTotalPayable,
    settotalCardAmount,
    setTotalRemaining
} = posSlice.actions;

export default posSlice.reducer;
