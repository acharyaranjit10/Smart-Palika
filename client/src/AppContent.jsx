// src/AppContent.jsx
import React, { useState, useEffect, useMemo } from "react";
import {
  Routes,
  Route,
  Navigate,
  Link,
  useLocation
} from "react-router-dom";
import { useAuth } from "./context/AuthContext";
import api from "./api/axios";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ComplaintForm from "./pages/ComplaintForm";
import UserDashboard from "./pages/UserDashboard";
import AdminDashboard from "./pages/AdminDashboard";
import ProfilePage from "./pages/ProfilePage";
const logo = new URL("./assets/logo1.png", import.meta.url).href;

export default function AppContent() {
  const { user, isLoading } = useAuth();
  const location = useLocation();
  const [complaints, setComplaints] = useState([]);

  const fetchComplaints = async () => {
    if (!user?.user) return;
    try {
      const token = localStorage.getItem("token");
      const pathname = location.pathname;
      let endpoint = "/complaints";
      if (pathname === "/admin" && user.user.role === "admin") {
        endpoint = "/complaints/admin";
      }
      const response = await api.get(endpoint, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setComplaints(response.data);
      // console.log("Fetched from:", endpoint);
    } catch (err) {
      console.error("Error fetching complaints:", err);
    }
  };

  useEffect(() => {
    fetchComplaints();
  }, [user, location.pathname]);

  const getUserComplaints = () => {
    if (!user?.user) return [];
    return complaints.filter((c) => c.userId === user.user.userId);
  };

  const getAdminComplaints = () => {
    if (!user?.user || user.user.role !== "admin") return [];
    const admin = user.user;
    if (admin.adminLevel === "ward") {
      const wardNo = Number(admin.ward.number);
      const municipalityName = admin.municipality.name;
      return complaints.filter(
        (c) => Number(c.wardNo) === wardNo && c.municipality === municipalityName
      );
    }
    if (admin.adminLevel === "municipality") {
      const municipalityName = admin.municipality.name;
      return complaints.filter((c) => c.municipality === municipalityName);
    }
    if (admin.adminLevel === "province") {
      const provinceName = admin.province.name;
      return complaints.filter((c) => c.province === provinceName);
    }
    return complaints;
  };

  const filteredAdminComplaints = useMemo(() => {
    return getAdminComplaints();
  }, [complaints, user]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-lg text-gray-600">Loading authentication...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />
      <main className="flex-grow">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route
            path="/login"
            element={user ? <Navigate to="/dashboard" /> : <Login />}
          />
          <Route
            path="/register"
            element={user ? <Navigate to="/dashboard" /> : <Register />}
          />
          <Route
            path="/submit-complaint"
            element={
              user ? (
                <ComplaintForm onSuccess={fetchComplaints} />
              ) : (
                <Navigate to="/login" />
              )
            }
          />
          <Route
            path="/dashboard"
            element={
              user ? (
                <UserDashboard complaints={getUserComplaints()} />
              ) : (
                <Navigate to="/" />
              )
            }
          />
          <Route
            path="/admin"
            element={
              user?.user?.role === "admin" ? (
                <AdminDashboard
                  complaints={filteredAdminComplaints}
                  updateComplaintStatus={async (id, status) => {
                    try {
                      const token = localStorage.getItem("token");
                      await api.put(`/complaints/${id}/status`, { status }, {
                        headers: { Authorization: `Bearer ${token}` },
                      });
                    //   setComplaints((prev) =>
                    //     prev.map((c) =>
                    //       c._id === id
                    //         ? {
                    //             ...c,
                    //             status,
                    //             statusHistory: [
                    //               ...(c.statusHistory || []),
                    //               { status, date: new Date().toISOString() },
                    //             ],
                    //           }
                    //         : c
                    //     )
                    //   );
                    await fetchComplaints();
                    } catch (err) {
                      console.error("Failed to update status:", err);
                    }
                  }}
                />
              ) : (
                <Navigate to="/" />
              )
            }
          />
          <Route path="*" element={<Navigate to="/" />} />
          <Route
  path="/profile"
  element={user ? <ProfilePage /> : <Navigate to="/login" />}
/>
        </Routes>
      </main>

       <footer className="bg-nepal-blue text-white py-8">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              <div>
                <div className="flex items-center mb-4">
                  <img
                    src={logo}
                    alt="Smart Palika Logo"
                    className="h-12 mr-3 rounded-full"
                  />
                  <h3 className="text-xl font-bold text-white">Smart Palika</h3>
                </div>
                <p className="text-gray-300">
                  A citizen-centric platform for reporting and tracking civic
                  issues
                </p>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-4 text-white">
                  Quick Links
                </h3>
                <ul className="space-y-2">
                  <li>
                    <Link to="/" className="text-gray-300 hover:text-white">
                      Home
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/submit-complaint"
                      className="text-gray-300 hover:text-white"
                    >
                      File Complaint
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/dashboard"
                      className="text-gray-300 hover:text-white"
                    >
                      Dashboard
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/admin"
                      className="text-gray-300 hover:text-white"
                    >
                      Admin Panel
                    </Link>
                  </li>
                </ul>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-4 text-white">
                  Contact Us
                </h3>
                <ul className="space-y-2 text-gray-300">
                  <li className="flex items-start">
                    <span className="mr-2">📧</span>
                    <span>info@egov-np.gov.np</span>
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2">📞</span>
                    <span>+977-1-1234567</span>
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2">📍</span>
                    <span>Singhadurbar, Kathmandu</span>
                  </li>
                </ul>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-4 text-white">
                  Follow Us
                </h3>
                <div className="flex space-x-4">
                  <a
                    href="#"
                    className="bg-white/10 hover:bg-white/20 p-2 rounded-full"
                  >
                    <span className="sr-only text-white">Facebook</span>
                    {/* Facebook SVG */}
                  </a>
                  <a
                    href="#"
                    className="bg-white/10 hover:bg-white/20 p-2 rounded-full"
                  >
                    <span className="sr-only text-white">Twitter</span>
                    {/* Twitter SVG */}
                  </a>
                  <a
                    href="#"
                    className="bg-white/10 hover:bg-white/20 p-2 rounded-full"
                  >
                    <span className="sr-only text-white">Instagram</span>
                    {/* Instagram SVG */}
                  </a>
                </div>
              </div>
            </div>

            <div className="border-t border-blue-400/30 mt-8 pt-6 text-center text-gray-300">
              <p>© {new Date().getFullYear()} Government of Nepal. All rights reserved.</p>
              <p className="mt-2 text-sm">Designed with ❤️ for the people of Nepal</p>
            </div>
          </div>
        </footer>
    </div>
  );
}