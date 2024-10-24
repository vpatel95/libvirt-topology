/*!

=========================================================
* Argon Dashboard React - v1.2.3
=========================================================

* Product Page: https://www.creative-tim.com/product/argon-dashboard-react
* Copyright 2023 Creative Tim (https://www.creative-tim.com)
* Licensed under MIT (https://github.com/creativetimofficial/argon-dashboard-react/blob/master/LICENSE.md)

* Coded by Creative Tim

=========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

*/
import React from "react";
import { useLocation, Outlet } from "react-router-dom";
import UserNavbar from "components/Navbars/UserNavbar";
import Sidebar from "components/Sidebar/Sidebar";

const UserLayout = (props) => {
  const mainContent = React.useRef(null);
  const location = useLocation();

  React.useEffect(() => {
    document.documentElement.scrollTop = 0;
    document.scrollingElement.scrollTop = 0;
    mainContent.current.scrollTop = 0;
  }, [location]);

  return (
    <>
      <Sidebar {...props}
        logo={{
          innerLink: "/user/dashboard",
          imgAlt: "...",
          imgSrc: require("assets/img/brand/argon-react.png"),
        }}
      />
      <div className="main-content" ref={mainContent}>
          <UserNavbar {...props} brandText={'TODO'} />
          <Outlet />
      </div>
    </>
  );
};

export default UserLayout;
