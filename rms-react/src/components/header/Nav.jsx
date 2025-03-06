import React, { useState } from "react";
import { Link } from "react-router-dom";
import logo from "../../assets/images/logo.svg";

const Nav = ({ cmp }) => {
  
  const [dropdown, setDropdown] = useState(null);

  return (
    <div className="home-header-container-nav">
      <div className="home-header-container-nav-left">
        <div className="home-header-container-nav-left__branding">
          <img src={logo} alt="logo" />
        </div>
      </div>
      <div className="home-header-container-nav-right">
        <Link className={cmp === "home" ? "active-menu" : ""} to="/">
          Home
        </Link>
        <Link className={cmp === "about" ? "active-menu" : ""} to="/about">
          About Us
        </Link>

        {/* Liens avec menu déroulant */}
        <div 
          className="nav-item-with-dropdown"
          onMouseEnter={() => setDropdown("candidates")}
          onMouseLeave={() => setDropdown(null)}
        >
          <Link className={cmp === "candidates" ? "active-menu" : ""} to="/">
            Candidates
          </Link>
          {dropdown === "candidates" && (
            <div className="dropdown-menu">
              <Link to="/sign-in">Sign In</Link>
              <Link to="/signup-candidat">Sign Up</Link>
            </div>
          )}
        </div>

        <div 
          className="nav-item-with-dropdown"
          onMouseEnter={() => setDropdown("recruiter")}
          onMouseLeave={() => setDropdown(null)}
        >
          <Link className={cmp === "recruiter" ? "active-menu" : ""} to="/">
            Recruiter
          </Link>
          {dropdown === "recruiter" && (
            <div className="dropdown-menu">
              <Link to="/sign-in">Sign In</Link>
              <Link to="/signup-recruteur">Sign Up</Link>
            </div>
          )}
        </div>

        <div 
          className="nav-item-with-dropdown"
          onMouseEnter={() => setDropdown("admin")}
          onMouseLeave={() => setDropdown(null)}
        >
          <Link className={cmp === "admin" ? "active-menu" : ""} to="/">
            Admin
          </Link>
          {dropdown === "admin" && (
            <div className="dropdown-menu">
              <Link to="/sign-in">Sign In</Link>
              <Link to="/signup-admin">Sign Up</Link>
            </div>
          )}
        </div>

        <Link className={cmp === "jobs" ? "active-menu" : ""} to="/jobs">
          Listed Jobs
        </Link>
      </div>
    </div>
  );
};

export default Nav;
