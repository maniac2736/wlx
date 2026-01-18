import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faHome,
  faBox,
  faFire,
  faBook,
  faSignInAlt,
  faUserCircle,
} from "@fortawesome/free-solid-svg-icons";
import { NavLink } from "react-router-dom";

function Navbar() {
  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light">
      <div className="container">
        <NavLink className="navbar-brand mx-5" to="/app">
          Unity Hub
        </NavLink>
        <div className="d-flex justify-content-between w-100">
          <div className="collapse navbar-collapse" id="navbarSupportedContent">
            <ul className="navbar-nav gap-3 mr-auto">
              <li className="nav-item">
                <NavLink
                  className="nav-link"
                  to="home"
                  style={({ isActive }) => {
                    return {
                      color: isActive ? "red" : "black",
                    };
                  }}
                >
                  <FontAwesomeIcon icon={faHome} /> Home
                </NavLink>
              </li>
              <li className="nav-item">
                <NavLink
                  className="nav-link"
                  to="products"
                  style={({ isActive }) => {
                    return {
                      color: isActive ? "red" : "black",
                    };
                  }}
                >
                  <FontAwesomeIcon icon={faBox} /> Products
                </NavLink>
              </li>
              <li className="nav-item">
                <NavLink
                  className="nav-link"
                  to="hot"
                  style={({ isActive }) => {
                    return {
                      color: isActive ? "red" : "black",
                    };
                  }}
                >
                  <FontAwesomeIcon icon={faFire} /> Hot Items
                </NavLink>
              </li>
              <li className="nav-item">
                <NavLink
                  className="nav-link"
                  to="resources"
                  style={({ isActive }) => {
                    return {
                      color: isActive ? "red" : "black",
                    };
                  }}
                >
                  <FontAwesomeIcon icon={faBook} /> Resources
                </NavLink>
              </li>
              <li className="nav-item">
                <NavLink
                  className="nav-link"
                  to="finance"
                  style={({ isActive }) => {
                    return {
                      color: isActive ? "red" : "black",
                    };
                  }}
                >
                  <FontAwesomeIcon icon={faBook} /> Finance
                </NavLink>
              </li>
            </ul>
          </div>
          <div className="d-flex justify-content-between">
            <ul className="navbar-nav">
              {/* <li className="nav-item">
                <NavLink
                  className="nav-link"
                  to="/login"
                  style={({ isActive }) => {
                    return {
                      color: isActive ? "red" : "black",
                    };
                  }}
                >
                  <FontAwesomeIcon icon={faSignInAlt} /> Login
                </NavLink>
              </li> */}
              <li className="nav-item">
                <NavLink
                  className="nav-link"
                  to="profile"
                  style={({ isActive }) => {
                    return {
                      color: isActive ? "blue" : "black",
                    };
                  }}
                >
                  <FontAwesomeIcon
                    icon={faUserCircle}
                    style={{ fontSize: "1.5rem" }}
                  />
                </NavLink>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
