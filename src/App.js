import React, { Suspense } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import AdminLayout from "./views/AdminDashboard/AdminLayout";
import AdminDashboard from "./views/AdminDashboard/Dashboard";
import AdminUsers from "./views/AdminDashboard/CheckUsers";
import Blogs from "./views/Blog/Blogs";
import ProtectedRoute from "./components/PrivateRoute"; // adjust path
import EditProfile from "./views/UserDashboard/EditProfile";
import ForgotPassword from "./views/UserDashboard/ForgotPassword";
import ResetPassword from "./views/UserDashboard/ResetPassword";
import Settings from "./views/UserDashboard/Settings";

const Home = React.lazy(() => import("./components/home"));
const Layout = React.lazy(() => import("./views/Layout/Layout"));
const Login = React.lazy(() => import("./views/UserDashboard/Login"));
const Register = React.lazy(() => import("./views/UserDashboard/Register"));
const Navbar = React.lazy(() => import("./views/UserDashboard/Navbar"));
const Cards = React.lazy(() => import("./views/UserDashboard/Cards"));
const Activity = React.lazy(() => import("./views/UserDashboard/Activity"));
const Profile = React.lazy(() => import("./views/UserDashboard/Profile"));
const UserBlog = React.lazy(() => import("./views/UserDashboard/DisplayBlog"));
const ChangePassword = React.lazy(() =>
  import("./views/UserDashboard//ChangePassword"),
);

const NotAuthorized = React.lazy(() => import("./components/UnauthorizedPage"));

function App() {
  return (
    <BrowserRouter>
      <Suspense fallback={<div>Loading...</div>}>
        <Routes>
          {/* Default page */}
          <Route path="/" element={<Login />} />

          <Route path="/register" element={<Register />} />

          <Route path="/not-authorized" element={<NotAuthorized />} />
          <Route path="/change-password" element={<ChangePassword />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="/edit-profile" element={<EditProfile />} />

          <Route element={<ProtectedRoute adminOnly={true} />}>
            <Route path="/admin" element={<AdminLayout />}>
              <Route path="dashboard" element={<AdminDashboard />} />
              <Route path="users" element={<AdminUsers />} />
              <Route path="blogs" element={<Blogs />} />
              <Route path="profile" element={<Profile />} />
            </Route>
          </Route>

          {/* Protected / main app */}
          <Route element={<ProtectedRoute />}>
            <Route path="/app" element={<Layout />}>
              <Route path="home" element={<Home />} />
              <Route path="navbar" element={<Navbar />} />
              <Route path="card" element={<Cards />} />
              <Route path="activity" element={<Activity />} />
              <Route path="profile" element={<Profile />} />
              <Route path="read-blogs" element={<UserBlog />} />
              <Route path="settings" element={<Settings />} />
            </Route>
          </Route>
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}

export default App;
