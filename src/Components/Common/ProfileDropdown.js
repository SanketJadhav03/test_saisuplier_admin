import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import {
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownToggle,
} from "reactstrap";

//import images
import avatar1 from "../../assets/images/users/avatar-1.jpg";
import { createSelector } from "reselect";
import { setInvoiceDetails } from "../../store/pos/POSSlice";
import { Link } from "react-router-dom";
import AuthUser from "../../helpers/Authuser";

const ProfileDropdown = () => {
  const selectDashboardData = createSelector(
    (state) => state.Profile.user,
    (user) => user
  );

  const { http, logout,permission } = AuthUser();
  const [businessProfileData, setBusinessProfileData] = useState({});
  useEffect(() => {
    http
      .get("/business_index")
      .then(function (response) {
        if (response.data.length > 0) {
          setBusinessProfileData(response.data[0]);
        }
      })
      .catch(function (response) {
        console.log(response);
      });
  }, []);
  // Inside your component
  const user = useSelector(selectDashboardData);

  const [userName, setUserName] = useState("");
  useEffect(() => {
    if (sessionStorage.getItem("authUser")) {
      const obj = JSON.parse(sessionStorage.getItem("authUser"));
      setUserName(obj.user.full_name ? obj.user.full_name : "Admin");
    }
  }, [userName, user]);

  //Dropdown Toggle
  const [isProfileDropdown, setIsProfileDropdown] = useState(false);
  const toggleProfileDropdown = () => {
    setIsProfileDropdown(!isProfileDropdown);
  };
  return (
    <React.Fragment>
      <Dropdown
        isOpen={isProfileDropdown}
        toggle={toggleProfileDropdown}
        className="ms-sm-3 header-item topbar-user"
      >
        <DropdownToggle tag="button" type="button" className="btn shadow-none">
          <span className="d-flex align-items-center">
            <img
              className="rounded-circle header-profile-user"
              src={avatar1}
              alt="Header Avatar"
            />
            <span className="text-start ms-xl-2">
              <span className="d-none d-xl-inline-block ms-1 fw-medium user-name-text">
                {businessProfileData != null ? businessProfileData.business_name : "Admin"}
              </span>
              <span className="d-none d-xl-block ms-1 fs-12 text-muted user-name-sub-text">
                Welcome {userName.split(" ")[0]} !
              </span>
            </span>
          </span>
        </DropdownToggle>
        <DropdownMenu className="dropdown-menu-end">
          {/* <h6 className="dropdown-header">Welcome Admin !</h6> */}
          {permission.find(permission => permission.permission_category === "BUSINESSPROFILE" && permission.permission_path === "0") 
            && 
          <DropdownItem>
            {" "}
            <Link to={process.env.PUBLIC_URL + "/business-setting"}>
              {" "}
              <i className="mdi mdi-account-circle text-muted fs-16 align-middle me-1"></i>
              <span className="align-middle">Company Profile</span>
            </Link>
          </DropdownItem>
          }
          {permission.find(permission => permission.permission_category === "USERPROFILE" && permission.permission_path === "0") 
            && 
          <DropdownItem>
            <Link to={process.env.PUBLIC_URL + "/profile"}>
              <i className="mdi mdi-message-text-outline text-muted fs-16 align-middle me-1"></i>{" "}
              <span className="align-middle">User Profile</span>
            </Link>
          </DropdownItem>
          }
          {/* <DropdownItem href={process.env.PUBLIC_URL + "#"}><i
                        className="mdi mdi-calendar-check-outline text-muted fs-16 align-middle me-1"></i> <span
                            className="align-middle">Taskboard</span></DropdownItem>
                    <DropdownItem href={process.env.PUBLIC_URL + "/pages-faqs"}><i
                        className="mdi mdi-lifebuoy text-muted fs-16 align-middle me-1"></i> <span
                            className="align-middle">Help</span></DropdownItem>
                    <div className="dropdown-divider"></div>
                    <DropdownItem href={process.env.PUBLIC_URL + "/pages-profile"}><i
                        className="mdi mdi-wallet text-muted fs-16 align-middle me-1"></i> <span
                            className="align-middle">Balance : <b>$5971.67</b></span></DropdownItem>
                    <DropdownItem href={process.env.PUBLIC_URL + "/pages-profile-settings"}><span
                        className="badge bg-success-subtle text-success mt-1 float-end">New</span><i
                            className="mdi mdi-cog-outline text-muted fs-16 align-middle me-1"></i> <span
                                className="align-middle">Settings</span></DropdownItem> */}
          {/* <DropdownItem href={process.env.PUBLIC_URL + "/auth-lockscreen-basic"}><i
                        className="mdi mdi-lock text-muted fs-16 align-middle me-1"></i> <span className="align-middle">Lock screen</span></DropdownItem> */}
          <DropdownItem >
            <i className="mdi mdi-logout text-muted fs-16 align-middle me-1"></i>{" "}
            <span className="align-middle" data-key="t-logout" onClick={logout}>
              Logout
            </span>
          </DropdownItem>
        </DropdownMenu>
      </Dropdown>
    </React.Fragment>
  );
};

export default ProfileDropdown;
