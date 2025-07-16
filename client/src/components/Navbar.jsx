// src/components/Navbar.jsx
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  FiMenu, FiX, FiUser, FiLogOut, FiHome,
  FiPlusSquare, FiClipboard
} from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-hot-toast';
import logo from '../assets/circ_logo.png';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const currentUser = user?.user;
  // console.log("Current user in navbar:", currentUser);

  const handleLogout = () => {
    logout();
    toast.success('Logged out successfully');
    navigate('/');
    setIsMenuOpen(false);
  };

  return (
    <nav className="bg-nepal-blue text-white shadow-lg">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center py-4">
          <Link to="/" className="flex items-center space-x-2">
            <img src={logo} alt="Smart Palika Logo" className="h-12" />
            <span className="font-bold text-xl md:inline">Smart Palika</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            <Link to="/" className="hover:text-gray-300 hover:scale-105 transition">Home</Link>
            {!currentUser && (
              <>
                <Link to="/register" className="hover:text-gray-300 hover:scale-105 transition">Register</Link>
                <Link to="/login" className="hover:text-gray-300 hover:scale-105 transition">Login</Link>
              </>
            )}
            {currentUser && (
              <>
                <Link to="/submit-complaint" className="bg-nepal-red hover:bg-red-700 px-4 py-2 rounded-md flex items-center">
                  <FiPlusSquare className="mr-2" /> File Complaint
                </Link>
                <Link to="/dashboard" className="hover:text-gray-300 transition flex items-center">
                  <FiClipboard className="mr-2" /> Dashboard
                </Link>
                {currentUser.role === 'admin' && (
                  <Link to="/admin" className="bg-yellow-600 hover:bg-yellow-700 px-4 py-2 rounded-md">
                    Admin Panel
                  </Link>
                )}
              </>
            )}
            {currentUser && (
              <div className="flex items-center space-x-3">
               <Link
  to="/profile"
  className="flex items-center bg-gray-700 px-3 py-1 rounded-full hover:bg-gray-600 transition"
  onClick={() => setIsMenuOpen(false)}
>
  <FiUser className="mr-2" />
  <span>{currentUser.name}</span>
</Link>
                <button
                  onClick={handleLogout}
                  className="flex items-center hover:text-gray-300 transition"
                >
                  <FiLogOut className="mr-2" /> Logout
                </button>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-white focus:outline-none"
            >
              {isMenuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div className="md:hidden bg-nepal-blue py-4 px-4">
          <div className="flex flex-col space-y-4">
            <Link to="/" className="hover:text-gray-300 transition" onClick={() => setIsMenuOpen(false)}>Home</Link>
            {!currentUser && (
              <>
                <Link to="/register" className="hover:text-gray-300 transition" onClick={() => setIsMenuOpen(false)}>Register</Link>
                <Link to="/login" className="hover:text-gray-300 transition" onClick={() => setIsMenuOpen(false)}>Login</Link>
              </>
            )}
            {currentUser && (
              <>
                <Link to="/submit-complaint" className="hover:text-gray-300 transition flex items-center" onClick={() => setIsMenuOpen(false)}>
                  <FiPlusSquare className="mr-2" /> File Complaint
                </Link>
                <Link to="/dashboard" className="hover:text-gray-300 transition flex items-center" onClick={() => setIsMenuOpen(false)}>
                  <FiClipboard className="mr-2" /> Dashboard
                </Link>
                {currentUser.role === 'admin' && (
                  <Link to="/admin" className="hover:text-gray-300 transition" onClick={() => setIsMenuOpen(false)}>
                    Admin Panel
                  </Link>
                )}
              </>
            )}
            {currentUser && (
              <div className="pt-4 border-t border-gray-700">
                <Link
  to="/profile"
  className="flex items-center text-gray-300 mb-2 hover:text-white transition"
  onClick={() => setIsMenuOpen(false)}
>
  <FiUser className="mr-2" />
  <span>{currentUser.name}</span>
</Link>
                <button
                  onClick={handleLogout}
                  className="flex items-center text-gray-300 hover:text-white transition"
                >
                  <FiLogOut className="mr-2" /> Logout
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;