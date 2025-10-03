import React from "react";
import "./Footer.css";
import GMT_Logo_white from "../../assets/GMT_Logo_white.png";

const Footer = () => {
  return (
    <footer className="footer_main">
      <div className="footer-columns">
        <div className="footer-logo">
          <img
            src={GMT_Logo_white}
            alt="Great Minds Logo"
            className="footer-logo-img"
          />
          {/* <h3>Great Minds</h3> */}
          <p>
            Great Minds discuss ideas, Average mindsdiscuss events, Small minds discuss people.
          </p>
        </div>

        <div className="footer-links">
          <h4>Get There..</h4>
          <ul>
            <li>Dashboard</li>
            <li>Certification</li>
            <li>Contact us</li>
          </ul>
        </div>

        <div className="footer-subscribe">
        </div>
      </div>

      <div className="footer-bottom">
        <p>Copyright 2025 © Great Minds. All Rights Reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
