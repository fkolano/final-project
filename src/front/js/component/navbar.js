import React from "react";
import { Link } from "react-router-dom";
import logo from "./logo.png";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";

export const Navbar = () => {
  $(document).ready(function () {
    $(".menu-icon").on("click", function () {
      $("nav ul").toggleClass("showing");
    });
  });

  // Scrolling Effect

  $(window).on("scroll", function () {
    if ($(window).scrollTop()) {
      $("nav").addClass("black");
    } else {
      $("nav").removeClass("black");
    }
  });
  return (
    <div className="wrapper">
      <header>
        <nav>
          <div className="menu-icon">
            <i className="fa fa-bars fa-2x"></i>
          </div>
          <img src={logo} className="logo w-25 p-3" />
          <div className="menu">
            <div className="button-div">
              <Link to={"/signup"}>
                <button class="button-84">Sign up</button>
              </Link>
              <Link to={"/login"}>
                <button class="button-84">Log In</button>
              </Link>
              <Nav.Link
                as={Link}
                to="/bookmarks"
                onClick={(e) => {
                  actions.getBookmarkData();
                }}
              >
                My Bookmarks
              </Nav.Link>
              <Nav.Link
                as={Link}
                to="/"
                onClick={(e) => {
                  // sessionStorage.clear();
                  sessionStorage.setItem(
                    "user",
                    JSON.stringify({
                      token: "",
                      email: "",
                      id: "",
                    })
                  );
                  actions.handleLogout();
                }}
              >
                Log out
              </Nav.Link>
            </div>
          </div>
        </nav>
      </header>
    </div>
  );

  MyNavbar.propTypes = {
    loggedIn: PropTypes.bool,
    handleLogout: PropTypes.func,
    query: PropTypes.string,
    setQuery: PropTypes.func,
  };
};
