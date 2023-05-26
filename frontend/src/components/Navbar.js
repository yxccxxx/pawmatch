import React from "react";
import { Link } from "react-router-dom";

const NavBar = props => {
    return (
        <nav className="navbar" style={{ paddingTop: "5px" }}>
        <div
            className="container"
            style={{ paddingLeft: "32px", paddingRight: "32px" }}
        >
        <div className="navbar-brand">
          <a className="navbar-item" href="/">
            <i className="fas fa-paw" /><i className="fas fa-plus mr-1 ml-1" /><i className="fas fa-paw" />
            <p className="ml-2 mr-6">PawMatch</p>
          </a>
          <a
            role="button"
            className="navbar-burger"
            aria-label="menu"
            aria-expanded="false"
            data-target="navbarMenu"
          >
            <span aria-hidden="true"></span>
            <span aria-hidden="true"></span>
            <span aria-hidden="true"></span>
          </a>
        </div>
        {props.isSignedIn && (
          <div id="navbarMenu" className="navbar-menu">
          <div className="navbar-start">
              <Link to='/discover' className="navbar-item">
                  Discover
              </Link>
              <Link to='/event' className="navbar-item">
                  Events
              </Link>
          </div>
          <div className="navbar-end">
            <Link to="/profile" className="navbar-item">
              {/* <i className="material-icons">person_outline</i>
              <div>{props.username}</div> */}
              My Profile
            </Link>
            <div className="navbar-item">
              <Link to='/logout' className="button">
                  Log Out
              </Link>
            </div>
          </div>
        </div>
        )}
        {!props.isSignedIn && (
          <div id="navbarMenu" className="navbar-menu">
            <div className="navbar-start">
                <Link to='/discover' className="navbar-item">
                    Discover
                </Link>
                <Link to='/event' className="navbar-item">
                    Events
                </Link>
            </div>
            <div className="navbar-end">
              <div className="navbar-item">
                <Link to='/login' className="button">
                  Log In
                </Link>
              </div>
            </div>
          </div>
        )}
        
      </div>
    </nav>
    );
};

export default NavBar;