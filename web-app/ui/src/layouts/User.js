import React from "react";
import { useLocation, Outlet } from "react-router-dom";

import UserNavbar from "components/Navbars/UserNavbar";
import Sidebar from "components/Sidebar/Sidebar";
import {SessionStore} from "services/store";

const UserLayout = (props) => {
  const user = SessionStore.getUser();
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
          innerLink: "/dashboard",
          imgAlt: "...",
          imgSrc: require("assets/img/brand/argon-react.png"),
        }}
      />
      <div className="main-content" ref={mainContent}>
          <UserNavbar {...props} brandText={'TODO'} user={user} />
          <Outlet />
      </div>
    </>
  );
};

export default UserLayout;
