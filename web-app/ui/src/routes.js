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
import Index from "views/Index";
import Profile from "views/Profile";
import Networks, {Network} from "views/Networks";
import Register from "views/Register";
import Login from "views/Login";
import VirtualMachines from "views/VirtualMachines";
import Topologies, {Topology} from "views/Topologies";


var routes = [
  {
    path: "/login",
    name: "Login",
    icon: "ni ni-key-25 text-info",
    component: <Login />,
    layout: "/auth",
  },
  {
    path: "/register",
    name: "Register",
    icon: "ni ni-circle-08 text-pink",
    component: <Register />,
    layout: "/auth",
  },
  {
    path: "/dashboard",
    name: "Dashboard",
    icon: "ni ni-tv-2 text-primary",
    component: <Index />,
    layout: "/user",
  },
  {
    path: "/topologies",
    name: "Topologies",
    icon: "ni ni-planet text-blue",
    component: <Topologies />,
    layout: "/user",
  },
  {
    path: "/networks",
    name: "Networks",
    icon: "ni ni-pin-3 text-orange",
    component: <Networks />,
    layout: "/user",
  },
  {
    path: "/virtual-machines",
    name: "Virtual Machines",
    icon: "ni ni-bullet-list-67 text-red",
    component: <VirtualMachines />,
    layout: "/user",
  },
  {
    path: "/profile",
    name: "User Profile",
    icon: "ni ni-single-02 text-yellow",
    component: <Profile />,
    layout: "/user",
  },
];

export var objectRoutes = [
  {
    path: "/topology/:tid",
    component: <Topology/>,
    layout: "/user",
  },
  {
    path: "/network/:nid",
    component: <Network />,
    layout: "/user",
  },
  {
    path: "/virtual-machine/:vid",
    component: <VirtualMachines />,
    layout: "/user",
  },
];
export default routes;
