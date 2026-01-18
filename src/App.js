import React, { Suspense } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

const Home = React.lazy(() => import("./components/home"));
const Landing = React.lazy(() => import("./views/UserDashboard/Landing"));
const Layout = React.lazy(() => import("./views/Layout/Layout"));
const Login = React.lazy(() => import("./views/UserDashboard/Login"));
const Register = React.lazy(() => import("./views/UserDashboard/Register"));
const Navbar = React.lazy(() => import("./views/UserDashboard/Navbar"));
const HotItems = React.lazy(() => import("./views/UserDashboard/HotItem"));
const Products = React.lazy(() => import("./views/UserDashboard/Product"));
const Resources = React.lazy(() => import("./views/UserDashboard/Resource"));
const Finance = React.lazy(() => import("./views/UserDashboard/Finance"));
const Profile = React.lazy(() => import("./views/UserDashboard/Profile"));

function App() {
  return (
    <BrowserRouter>
      <Suspense fallback={<div>Loading...</div>}>
        <Routes>
          {/* Default page */}
          <Route path="/" element={<Login />} />

          <Route path="/register" element={<Register />} />

          {/* Protected / main app */}
          <Route path="/app" element={<Layout />}>
            <Route index element={<Landing />} />
            <Route path="home" element={<Home />} />
            <Route path="navbar" element={<Navbar />} />
            <Route path="hot" element={<HotItems />} />
            <Route path="products" element={<Products />} />
            <Route path="resources" element={<Resources />} />
            <Route path="finance" element={<Finance />} />
            <Route path="profile" element={<Profile />} />
          </Route>
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}

export default App;
