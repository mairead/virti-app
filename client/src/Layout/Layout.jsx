import React from "react";
import  "./Layout.scss";

const Layout = ({ children }) => (
  <div className="layout">
    <img src="virti_logo.png" alt="virti logo" className="layout__logo"/>
    {children}
  </div>
);


export default Layout;