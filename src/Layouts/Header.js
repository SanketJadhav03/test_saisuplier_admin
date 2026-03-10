import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Button,
  Dropdown,
  DropdownMenu,
  DropdownToggle,
  Form,
} from "reactstrap";
import "./sync.css";
//import images
import logoSm from "../assets/images/logo-sm.png";
import logoDark from "../assets/images/logo-dark.png";
import logoLight from "../assets/images/logo-light.png";

//import Components
import NotificationDropdown from "../Components/Common/NotificationDropdown";
import ProfileDropdown from "../Components/Common/ProfileDropdown";
import LightDark from "../Components/Common/LightDark";

import { changeSidebarVisibility } from "../store/actions";
import { createSelector } from "reselect";
import AuthUser from "../helpers/Authuser";
import { useDispatch, useSelector } from "react-redux";
import { storePermissions } from "../store/permissions/PermissionsSlice";
import IconBxSync from "./Sync";
import { ToastContainer, toast } from "react-toastify";

const Header = ({ onChangeLayoutMode, layoutModeType, headerClass }) => {
  
  const dispatch = useDispatch();
  const sidebarVisibilityData = createSelector(
    (state) => state.Layout.sidebarVisibilitytype,
    (sidebarVisibilitytype) => sidebarVisibilitytype
  );

  const [greeting, setGreeting] = useState("");
  const { http, permission } = AuthUser();

  useEffect(() => {
    // Get the current hour of the day
    const currentHour = new Date().getHours();

    // Function to determine the appropriate greeting based on the time
    function getGreeting() {
      if (currentHour >= 5 && currentHour < 12) {
        return "Good Morning";
      } else if (currentHour >= 12 && currentHour < 17) {
        return "Good Afternoon";
      } else {
        return "Good Evening";
      }
    }

    // Set the greeting message
    setGreeting(getGreeting());
    getUserPermissions();
  }, []);

  const getUserPermissions = async () => {
    const roleIDD = JSON.parse(sessionStorage.getItem("authUser")).user.role;
    const apiResponse = await http.get(`/get/permissions/${roleIDD}`);
    dispatch(storePermissions(apiResponse.data));
  };

  // Inside your component
  const sidebarVisibilitytype = useSelector(sidebarVisibilityData);

  const toogleMenuBtn = () => {
    var windowSize = document.documentElement.clientWidth;
    dispatch(changeSidebarVisibility("show"));
    if (windowSize > 767)
      document.querySelector(".hamburger-icon").classList.toggle("open");
    //For collapse horizontal menu
    if (document.documentElement.getAttribute("data-layout") === "horizontal") {
      document.body.classList.contains("menu")
        ? document.body.classList.remove("menu")
        : document.body.classList.add("menu");
    }
    //For collapse vertical and semibox menu
    if (
      sidebarVisibilitytype === "show" &&
      (document.documentElement.getAttribute("data-layout") === "vertical" ||
        document.documentElement.getAttribute("data-layout") === "semibox")
    ) {
      if (windowSize < 1025 && windowSize > 767) {
        document.body.classList.remove("vertical-sidebar-enable");
        document.documentElement.getAttribute("data-sidebar-size") === "sm"
          ? document.documentElement.setAttribute("data-sidebar-size", "")
          : document.documentElement.setAttribute("data-sidebar-size", "sm");
      } else if (windowSize > 1025) {
        document.body.classList.remove("vertical-sidebar-enable");
        document.documentElement.getAttribute("data-sidebar-size") === "lg"
          ? document.documentElement.setAttribute("data-sidebar-size", "sm")
          : document.documentElement.setAttribute("data-sidebar-size", "lg");
      } else if (windowSize <= 767) {
        document.body.classList.add("vertical-sidebar-enable");
        document.documentElement.setAttribute("data-sidebar-size", "lg");
      }
    }
    //Two column menu
    if (document.documentElement.getAttribute("data-layout") === "twocolumn") {
      document.body.classList.contains("twocolumn-panel")
        ? document.body.classList.remove("twocolumn-panel")
        : document.body.classList.add("twocolumn-panel");
    }
  };

  const [clicked, setClicked] = useState(false);
  const handleClick = () => {

    setClicked(true);
    window.location.reload();
    // http
    //   .get("/sync")
    //   .then(function (response) {
    //     if (response.data.status == 1) {
    //       setClicked(false);
    //       toast.success(response.data.msg);
    //     } else {
    //       toast.error("Please Contact To Admin");
    //     }
    //   })
    //   .catch(function (error) {
    //     console.log(error);
    //     setClicked(false);
    //     toast.error("Please Contact To Admin");
    //   });
  };
  return (
    <React.Fragment>
      <header id="page-topbar" className={headerClass}>
        <div className="layout-width">
          <div className="navbar-header">
            <div className="d-flex">
              <div className="navbar-brand-box horizontal-logo">
                <Link to="/" className="logo logo-dark">
                  <span className="logo-sm">
                    <img src={logoSm} alt="" height="22" />
                  </span>
                  <span className="logo-lg">
                    <img src={logoDark} alt="" height="17" />
                  </span>
                </Link>

                <Link to="/" className="logo logo-light">
                  <span className="logo-sm">
                    <img src={logoSm} alt="" height="22" />
                  </span>
                  <span className="logo-lg">
                    <img src={logoLight} alt="" height="17" />
                  </span>
                </Link>
              </div>

              <button
                onClick={toogleMenuBtn}
                type="button"
                className="btn btn-sm px-3 fs-16 header-item vertical-menu-btn topnav-hamburger shadow-none"
                id="topnav-hamburger-icon"
              >
                <span className="hamburger-icon">
                  <span></span>
                  <span></span>
                  <span></span>
                </span>
              </button>
            </div>

            <div className="d-flex align-items-center justify-content-between w-100 ms-1">
              <Link  onClick={handleClick}>
                <IconBxSync className={clicked ? "clickedss" : ""}></IconBxSync>
              </Link>
  
              <div
                className="text-center mt-2" 
              >
                <h5 className="text-primary">
                  Hello <span className="text-success"> {greeting}</span> 😊,
                  Welcome Back !
                </h5>
              </div>
              {permission.find(permission => permission.permission_category === "POS" && permission.permission_path === "2") 
                && 
              <Link to={"/pos/create/1"}>
                <Button color="danger" className="btn-label rounded-pill">
                  {" "}
                  <i className="mdi mdi-calculator label-icon align-middle fs-16 me-2"></i>{" "}
                  POS{" "}
                </Button>
              </Link>
              }
              {/* ) : (
                ""
              )} */}
              {/* Dark/Light Mode set */}

              <div className="d-flex">
                <LightDark
                layoutMode={layoutModeType}
                onChangeLayoutMode={onChangeLayoutMode}
              />

              {/* NotificationDropdown */}
              {/* <NotificationDropdown /> */}

              {/* ProfileDropdown */}
              <ProfileDropdown />
              </div>
            </div>
          </div>
        </div>
      </header>
      <ToastContainer closeButton={false} limit={1} />
    </React.Fragment>
  );
};

export default Header;
