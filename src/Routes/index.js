import React from "react";
import { Routes, Route } from "react-router-dom";

//Layouts
import NonAuthLayout from "../Layouts/NonAuthLayout";
import VerticalLayout from "../Layouts/index";
//routes
import { authProtectedRoutes, publicRoutes } from "./allRoutes";
import { AuthProtected } from "./AuthProtected";
import POSCreate from "../pages/Pos/POSCreate";
import POSEdit from "../pages/Pos/POSEdit";
import StockList from "../pages/Stock/StockList";

const Index = () => {
  return (
    <React.Fragment>
      <Routes>
        <Route>
          {publicRoutes.map((route, idx) => (
            <Route
              path={route.path}
              element={<NonAuthLayout>{route.component}</NonAuthLayout>}
              key={idx}
              exact={true}
            />
          ))}
        </Route>

        <Route>
          {authProtectedRoutes.map((route, idx) => (
            <Route
              path={route.path}
              element={
                <AuthProtected>
                  <VerticalLayout>{route.component}</VerticalLayout>
                </AuthProtected>
              }
              key={idx}
              exact={true}
            />
          ))}
        </Route>
        <Route>
          <Route
            path={"pos/create/:tab_id?"}
            element={
              <AuthProtected>
                {/* <VerticalLayout> */}
                <POSCreate />
                {/* </VerticalLayout> */}
              </AuthProtected>
            }
          />
        </Route>
        <Route>
          <Route
            path={"/pos-bill-edit/:billId/:customerId/:paymentModeId"}
            element={
              <AuthProtected>
                {/* <VerticalLayout> */}
                <POSEdit />
                {/* </VerticalLayout> */}
              </AuthProtected>
            }
          />
        </Route>
        <Route>
          <Route
            path={"/stock-list"}
            element={
              <AuthProtected>
                <StockList />
              </AuthProtected>
            }
          />
        </Route>
      </Routes>
    </React.Fragment>
  );
};

export default Index;
