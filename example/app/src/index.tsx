import KeepAliveLayout from "@waffle/keepalive";
import React from "react";
import { createRoot } from "react-dom/client";
import { Link,HashRouter,Routes,Route,useLocation,Outlet } from "react-router-dom";
import Layout from './layout';
import Home from './pages/home';
import {Users, Me} from './pages/user';

const App = () => {
  return (
    <KeepAliveLayout keepalive={[/./]}>
        <HashRouter>
            <Routes>
                <Route path='/' element={<Layout />}>
                    <Route path="/" element={<Home />} />
                    <Route path="/users" element={<Users />} />
                </Route>
            </Routes>
        </HashRouter>
    </KeepAliveLayout>
  );
}

const root = createRoot(document.getElementById("waffle") as Element);
root.render(React.createElement(App));
