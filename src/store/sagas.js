import { all, fork } from "redux-saga/effects";
//layout
import LayoutSaga from "./layouts/saga";
//Auth
import AccountSaga from "./auth/register/saga";
import AuthSaga from "./auth/login/saga";
import ForgetSaga from "./auth/forgetpwd/saga";
import ProfileSaga from "./auth/profile/saga";

import ecommerceSaga from "./ecommerce/saga";

// Dashboard Ecommerce
import dashboardEcommerceSaga from "./dashboardEcommerce/saga";

export default function* rootSaga() {
  yield all([
    fork(LayoutSaga),
    fork(AccountSaga),
    fork(AuthSaga),
    fork(ForgetSaga),
    fork(ProfileSaga),
    fork(ecommerceSaga),
    fork(dashboardEcommerceSaga),
  ]);
}
