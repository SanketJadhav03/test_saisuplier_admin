import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import SimpleBar from "simplebar-react";
//import logo
import logoSm from "../assets/images/logo-sm.png";
import logoDark from "../assets/images/logo512.png";
import logoLight from "../assets/images/logo.964c5ebf.svg";
import ajspireLogo from "../assets/images/ajspire.png";

//Import Components
import VerticalLayout from "./VerticalLayouts/index";
import TwoColumnLayout from "./TwoColumnLayout";
import { Container } from "reactstrap";
import HorizontalLayout from "./HorizontalLayout";

const Sidebar = ({ layoutType }) => {
  useEffect(() => {
    var verticalOverlay = document.getElementsByClassName("vertical-overlay");
    if (verticalOverlay) {
      verticalOverlay[0].addEventListener("click", function () {
        document.body.classList.remove("vertical-sidebar-enable");
      });
    }
  });

  const addEventListenerOnSmHoverMenu = () => {
    // add listener Sidebar Hover icon on change layout from setting
    if (
      document.documentElement.getAttribute("data-sidebar-size") === "sm-hover"
    ) {
      document.documentElement.setAttribute(
        "data-sidebar-size",
        "sm-hover-active"
      );
    } else if (
      document.documentElement.getAttribute("data-sidebar-size") ===
      "sm-hover-active"
    ) {
      document.documentElement.setAttribute("data-sidebar-size", "sm-hover");
    } else {
      document.documentElement.setAttribute("data-sidebar-size", "sm-hover");
    }
  };
  return (
    <React.Fragment>
      <div className="app-menu navbar-menu">
        <div className="navbar-brand-box">
          <Link to="/dashboard" className="logo logo-dark">
            <span className="logo-sm">
              <img src={logoDark} alt="" width={50} />
            </span>
            <span className="logo-lg">
              <img src={logoDark} alt="" width={150} />
            </span>
          </Link>

          <Link to="/dashboard" className="logo logo-light">
            <span className="logo-sm">
              <img src={logoLight} alt="" width={50} />
            </span>
            <span className="logo-lg">
              <img src={logoLight} alt="" width={160} />
            </span>
          </Link>
          <button
            onClick={addEventListenerOnSmHoverMenu}
            type="button"
            className="btn btn-sm p-0 fs-20 header-item float-end btn-vertical-sm-hover"
            id="vertical-hover"
          >
            <i className="ri-record-circle-line"></i>
          </button>
        </div>
        {layoutType === "horizontal" ? (
          <div id="scrollbar">
            <Container fluid>
              <div id="two-column-menu"></div>
              <ul className="navbar-nav" id="navbar-nav">
                <HorizontalLayout />
              </ul>
            </Container>
          </div>
        ) : layoutType === "twocolumn" ? (
          <React.Fragment>
            <TwoColumnLayout />
            <div className="sidebar-background"></div>
          </React.Fragment>
        ) : (
          <React.Fragment>
            <SimpleBar id="scrollbar" className="h-100">
              <Container fluid>
                <div id="two-column-menu"></div>
                <ul className="navbar-nav" id="navbar-nav">
                  <VerticalLayout layoutType={layoutType} />
                </ul>
              </Container>
            </SimpleBar>
            <div className="sidebar-background"></div>
          </React.Fragment>
        )}
        {/* <div className="navbar-brand-box" style={{ marginTop: "-60px" }}>
          <a href="https://ajspire.com" className="logo logo-light">
            <span className="logo-sm">
              <img src={ajspireLogo} alt="" height={65} />
            </span>
            <span className="logo-lg">
              <img src={ajspireLogo} width={180} alt="" height={80} />
            </span>
          </a>
        </div> */}
      </div>
      <div className="vertical-overlay"></div>
    </React.Fragment>
  );
};

export default Sidebar;
