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
import ReactDOM from "react-dom/client";
import {
  Route,
  Navigate,
  createBrowserRouter,
  createRoutesFromElements,
  RouterProvider,
  Outlet
} from "react-router-dom";

import "assets/plugins/nucleo/css/nucleo.css";
import "@fortawesome/fontawesome-free/css/all.min.css";
import "assets/scss/argon-dashboard-react.scss";

import { UserProvider } from "contexts/UserContext";
import UserLayout from "layouts/User";
import AuthLayout from "layouts/Auth";
import Login from "views/Login";
import Register from "views/Register";
import Profile from "views/Profile";
import Dashboard from "views/Dashboard";
import Topologies, {Topology, TopologyCreate} from "views/Topologies";
import Networks, {Network, NetworkCreate} from "views/Networks";
import VirtualMachines, {VmCreate} from "views/VirtualMachines";
import TopologyService from "services/topology";
import AuthService from "services/auth";
import UserService from "services/user";
import NetworkService from "services/network";

const Root = () => {
  return (
    <>
      <Outlet />
    </>
  );
};

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<Root />}>
      <Route
        path="/user"
        element={
          <UserProvider>
            <UserLayout />
          </UserProvider>
        } >
        <Route
          path="dashboard"
          element={<Dashboard />}
        />
        <Route
          path="profile"
          element={<Profile />}
        />
        <Route
          path="topologies"
          element={<Topologies />}
          loader = {
            () => {
              const user_info = AuthService.getCurrentUser();
              return UserService.topologies(user_info.id);
            }
          }
        />
        <Route
          path="topologies/create"
          element={<TopologyCreate />}
          action = {
            async ({request}) => {
              let formData = await request.formData();
              console.log(formData);
              return null
            }
          }
        />
        <Route
          path="topologies/:topologyId"
          element={<Topology />}
          loader = {
            ({params}) => {
              return TopologyService.get(params.topologyId);
            }
          }
        />
        <Route
          path="networks"
          element={<Networks />}
          loader = {
            () => {
              const user_info = AuthService.getCurrentUser();
              return UserService.networks(user_info.id);
            }
          }
        />
        <Route
          path="networks/create"
          element={<NetworkCreate />}
          action = {
            async ({request}) => {
              let formData = await request.formData();
              console.log(formData);
              return null
            }
          }
        />
        <Route
          path="networks/:networkId"
          element={<Network />}
          loader = {
            async ({params}) => {
              const network = await NetworkService.get(params.networkId);
              const attachedVms = await NetworkService.attachedVms(params.networkId);
              return {network, attachedVms}
            }
          }
        />
        <Route
          path="virtual-machines"
          element={<VirtualMachines />}
          loader = {
            () => {
              const user_info = AuthService.getCurrentUser();
              return UserService.vms(user_info.id);
            }
          }
        />
        <Route
          path="virtual-machines/create"
          element={<VmCreate />}
          action = {
            async ({request}) => {
              let formData = await request.formData();
              console.log(formData);
              return null
            }
          }
        />
        <Route
          path="virtual-machines/:vmId"
          element={<VirtualMachines />}
        />
        <Route path="*" element={<Navigate to="/user/dashboard" replace />} />
      </Route>
      <Route path="/auth" element={<AuthLayout />} >
        <Route path="login" element={<Login />} />
        <Route path="register" element={<Register />} />
      </Route>
      <Route path="*" element={<Navigate to="/auth/login" replace />} />
    </Route>
  )
);

ReactDOM.createRoot(document.getElementById("root")).render(
  <RouterProvider router={router} />
)
