import React, { Component } from "react";
import { Link } from "react-router-dom";

class Navbar extends Component {
  render() {
    return (
      <div className="navbar-fixed">
        <nav className="z-depth-0">
          <div className="nav-wrapper white">
            <Link
              to="/"
              style={{
                fontFamily: "monospace",
                width: "100vw"
              }}
              className="col s5 brand-logo center black-text"
            >
              FULL STACK APP
            </Link>
          </div>
        </nav>
      </div>
    );
  }
}
export default Navbar;
