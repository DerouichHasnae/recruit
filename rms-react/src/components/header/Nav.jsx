import React, { useState } from "react";
import { Link } from "react-router-dom";
import logo from "../../assets/images/logo.svg";

const Nav = ({ cmp: activeMenu }) => {
  const [dropdown, setDropdown] = useState(null); // Gérer l'état du menu déroulant
  const [cmp, setCmp] = useState(null); // Gérer l'état de l'élément actif

  return (
    <div className="home-header-container-nav">
      <div className="home-header-container-nav-left">
        <div className="home-header-container-nav-left__branding">
          <img src={logo} alt="logo" />
        </div>
      </div>
      <div className="home-header-container-nav-right">
        <Link className={activeMenu === "home" ? "active-menu" : ""} to="/">
          Home
        </Link>
        <Link className={activeMenu === "about" ? "active-menu" : ""} to="/about">
          About Us
        </Link>

        {/* Liens avec menu déroulant */}
        <div
          className="nav-item-with-dropdown"
          onMouseEnter={() => setDropdown("user")} // Activer le menu déroulant pour "Utilisateur"
          onMouseLeave={() => setDropdown(null)} // Désactiver le menu déroulant
        >
          <Link className={activeMenu === "user" ? "active-menu" : ""} to="/">
            Utilisateur
          </Link>
          {dropdown === "user" && (
            <div className="dropdown-menu">
              {/* Option pour Candidates */}
              <div
                onMouseEnter={() => setCmp("candidates")}
                onMouseLeave={() => setCmp(null)}
              >
                <Link to="/candidates">Candidates</Link>
                {cmp === "candidates" && (
                  <div className="sub-dropdown-menu">
                    <Link to="/sign-in">Sign In</Link>
                    <Link to="/signup-candidat">Sign Up</Link>
                  </div>
                )}
              </div>

              {/* Option pour Recruiter */}
              <div
                onMouseEnter={() => setCmp("recruiter")}
                onMouseLeave={() => setCmp(null)}
              >
                <Link to="/recruiter">Recruiter</Link>
                {cmp === "recruiter" && (
                  <div className="sub-dropdown-menu">
                    <Link to="/sign-in">Sign In</Link>
                    <Link to="/signup-recruteur">Sign Up</Link>
                  </div>
                )}
              </div>

              {/* Option pour Admin */}
              <div
                onMouseEnter={() => setCmp("admin")}
                onMouseLeave={() => setCmp(null)}
              >
                <Link to="/admin">Admin</Link>
                {cmp === "admin" && (
                  <div className="sub-dropdown-menu">
                    <Link to="/sign-in">Sign In</Link>
                    <Link to="/signup-admin">Sign Up</Link>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        <Link className={activeMenu === "jobs" ? "active-menu" : ""} to="/jobs">
          Listed Jobs
        </Link>
      </div>
    </div>
  );
};

export default Nav;