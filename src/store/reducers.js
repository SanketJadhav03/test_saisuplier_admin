import { combineReducers } from "redux";

// Front
import Layout from "./layouts/reducer";

// Authentication
import Login from "./auth/login/reducer";
import Account from "./auth/register/reducer";
import ForgetPassword from "./auth/forgetpwd/reducer";
import Profile from "./auth/profile/reducer";
import POSSlice from "./pos/POSSlice";
import barcodeSlice from "./barcode/BarcodeSlice";

//Ecommerce
import Ecommerce from "./ecommerce/reducer";
import DashboardEcommerce from "./dashboardEcommerce/reducer";
import permissionsSlice from "./permissions/PermissionsSlice"
const rootReducer = combineReducers({
  Layout,
  Login,
  Account,
  ForgetPassword,
  Profile,
  Ecommerce,
  DashboardEcommerce,
  POSSlice,
  barcodeSlice,
  permissionsSlice
});
export default rootReducer;
