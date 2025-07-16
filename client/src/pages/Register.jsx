// src/pages/Register.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  FiUser, FiMail, FiPhone, FiLock,
  FiHome, FiMapPin
} from 'react-icons/fi';
import { toast } from 'react-hot-toast';
import api from '../api/axios';

import provinceList from '../data/provinces.json';
import municipalityList from '../data/municipalities.json';
import wardList from '../data/wards.json';

const Register = () => {
  const navigate = useNavigate();
  const [errors, setErrors] = useState({
   approvalCode: null,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Add role/adminLevel into formData
    const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    address: '',
    province: '',
    municipality: '',
    ward: '',
    role: 'user',
    adminLevel: '',
   approvalCode: '',
  });

  // Simple arrays for dropdowns (static as before)
  const provinces = [
    'Province 1','Madhesh','Bagmati',
    'Gandaki','Lumbini','Karnali','Sudurpashchim'
  ];
  const municipalities = [
    'Kathmandu','Pokhara','Lalitpur',
    'Bhaktapur','Biratnagar'
  ];
  const wards = ['1','2','3','4','5'];

  // Reset municipality/ward if parent changes
  useEffect(() => {
    setErrors(e => ({ ...e, municipality: null, ward: null }));
  }, [formData.province]);

  useEffect(() => {
    setErrors(e => ({ ...e, ward: null }));
  }, [formData.municipality]);

  const handleChange = e => {
    const { name, value } = e.target;
    setFormData(fd => ({ ...fd, [name]: value }));
    if (errors[name]) {
      setErrors(e => ({ ...e, [name]: null }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    const {
      name, email, phone,
      password, confirmPassword,
      address, province,
      municipality, ward,
      role, adminLevel
    } = formData;

    if (!name) newErrors.name = 'Name is required';
    if (!email) newErrors.email = 'Email is required';
    if (!phone) newErrors.phone = 'Phone is required';
    if (!password) newErrors.password = 'Password is required';
    if (password !== confirmPassword)
      newErrors.confirmPassword = 'Passwords do not match';
    if (!address) newErrors.address = 'Address is required';

    if (!province)      newErrors.province = 'Province is required';
    if (!municipality)  newErrors.municipality = 'Municipality is required';
    if (!ward)          newErrors.ward = 'Ward is required';

    // Admin-specific validation
       // Admin‐only checks
    if (role === 'admin') {
   if (!approvalCode) newErrors.approvalCode = 'Admin code is required';
      if (!adminLevel) newErrors.adminLevel = 'Select admin level';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

 const handleSubmit = async (e) => {
  e.preventDefault();

  if (!validateForm()) {
    toast.error('Please fix the errors above');
    return;
  }

  setIsSubmitting(true);

  // Build payload based on role
  const payload = {
    name: formData.name,
    email: formData.email,
    phone: formData.phone,
    password: formData.password,
    address: formData.address,
    province: {
      id: 1, // or dynamically assigned later
      name: formData.province
    },
    municipality: {
      id: 1, // or dynamically assigned later
      name: formData.municipality
    },
    ward: {
      number: Number(formData.ward)
    },
    role: formData.role,
    ...(formData.role === 'admin' && {
      adminLevel: formData.adminLevel,
      approvalCode: formData.approvalCode
    })
  };

  try {
    await api.post('/auth/register', payload);
    toast.success('Account created! Please log in.');
    navigate('/login');
  } catch (err) {
    console.error('Registration error:', err);
    const msg = err?.response?.data?.message || 'Registration failed';
    toast.error(msg);
  } finally {
    setIsSubmitting(false);
  }
};

  // Using unique keys for each form field
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl w-full bg-white p-8 rounded-2xl shadow-lg">
        {/* Header */}
        <div className="text-center mb-6">
          <div className="mx-auto h-24 w-24 bg-nepal-blue rounded-full flex items-center justify-center">
            <div className="bg-nepal-red h-16 w-16 rounded-full flex items-center justify-center">
              <FiUser className="text-white text-2xl" />
            </div>
          </div>
          <h2 className="mt-6 text-3xl font-bold text-nepal-blue">
            Create a new account
          </h2>
          <p className="mt-2 text-gray-600">
            Join Nepal e-Governance Complaint Portal to report civic issues
          </p>
        </div>

        {/* Form */}
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Full Name */}
            <div key="name-field">
              <label htmlFor="name" className="block text-gray-700 mb-1">
                Full Name*
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FiUser className="text-gray-400" />
                </div>
                <input
                  id="name"
                  name="name"
                  type="text"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  className={`w-full pl-10 pr-4 py-3 border ${errors.name ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:ring-2 focus:ring-nepal-blue focus:border-transparent`}
                  placeholder="Ram Bahadur"
                />
              </div>
              {errors.name && <p className="mt-1 text-sm text-red-500">{errors.name}</p>}
            </div>

            {/* Email Address */}
            <div key="email-field">
              <label htmlFor="email" className="block text-gray-700 mb-1">
                Email Address*
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FiMail className="text-gray-400" />
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className={`w-full pl-10 pr-4 py-3 border ${errors.email ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:ring-2 focus:ring-nepal-blue focus:border-transparent`}
                  placeholder="your.email@example.com"
                />
              </div>
              {errors.email && <p className="mt-1 text-sm text-red-500">{errors.email}</p>}
            </div>

            {/* Phone Number */}
            <div key="phone-field">
              <label htmlFor="phone" className="block text-gray-700 mb-1">
                Phone Number*
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FiPhone className="text-gray-400" />
                </div>
                <input
                  id="phone"
                  name="phone"
                  type="tel"
                  required
                  value={formData.phone}
                  onChange={handleChange}
                  className={`w-full pl-10 pr-4 py-3 border ${errors.phone ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:ring-2 focus:ring-nepal-blue focus:border-transparent`}
                  placeholder="+977 98XXXXXXXX"
                />
              </div>
              {errors.phone && <p className="mt-1 text-sm text-red-500">{errors.phone}</p>}
            </div>

            {/* Password */}
            <div key="password-field">
              <label htmlFor="password" className="block text-gray-700 mb-1">
                Password*
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FiLock className="text-gray-400" />
                </div>
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  value={formData.password}
                  onChange={handleChange}
                  className={`w-full pl-10 pr-4 py-3 border ${errors.password ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:ring-2 focus:ring-nepal-blue focus:border-transparent`}
                  placeholder="••••••••"
                />
              </div>
              {errors.password && <p className="mt-1 text-sm text-red-500">{errors.password}</p>}
            </div>

            {/* Confirm Password */}
            <div key="confirmPassword-field">
              <label htmlFor="confirmPassword" className="block text-gray-700 mb-1">
                Confirm Password*
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FiLock className="text-gray-400" />
                </div>
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  required
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className={`w-full pl-10 pr-4 py-3 border ${errors.confirmPassword ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:ring-2 focus:ring-nepal-blue focus:border-transparent`}
                  placeholder="••••••••"
                />
              </div>
              {errors.confirmPassword && <p className="mt-1 text-sm text-red-500">{errors.confirmPassword}</p>}
            </div>

            {/* Full Address */}
            <div key="address-field" className="md:col-span-2">
              <label htmlFor="address" className="block text-gray-700 mb-1">
                Full Address*
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 pt-3 pointer-events-none">
                  <FiHome className="text-gray-400" />
                </div>
                <textarea
                  id="address"
                  name="address"
                  rows="2"
                  required
                  value={formData.address}
                  onChange={handleChange}
                  className={`w-full pl-10 pr-4 py-3 border ${errors.address ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:ring-2 focus:ring-nepal-blue focus:border-transparent`}
                  placeholder="Your complete address"
                />
              </div>
              {errors.address && <p className="mt-1 text-sm text-red-500">{errors.address}</p>}
            </div>

            {/* Province */}
            <div key="province-field">
              <label htmlFor="province" className="block text-gray-700 mb-1">
                Province*
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FiMapPin className="text-gray-400" />
                </div>
                <select
                  id="province"
                  name="province"
                  value={formData.province}
                  onChange={handleChange}
                  className={`w-full pl-10 pr-4 py-3 border ${errors.province ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:ring-2 focus:ring-nepal-blue focus:border-transparent`}
                  required
                >
                  <option value="">Select Province</option>
                  {provinces.map((p, i) => (
                    <option key={i} value={p}>{p}</option>
                  ))}
                </select>
              </div>
              {errors.province && <p className="mt-1 text-sm text-red-500">{errors.province}</p>}
            </div>

            {/* Municipality */}
            <div key="municipality-field">
              <label htmlFor="municipality" className="block text-gray-700 mb-1">
                Municipality*
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FiMapPin className="text-gray-400" />
                </div>
                <select
                  id="municipality"
                  name="municipality"
                  value={formData.municipality}
                  onChange={handleChange}
                  className={`w-full pl-10 pr-4 py-3 border ${errors.municipality ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:ring-2 focus:ring-nepal-blue focus:border-transparent`}
                  required
                >
                  <option value="">Select Municipality</option>
                  {municipalities.map((m, i) => (
                    <option key={i} value={m}>{m}</option>
                  ))}
                </select>
              </div>
              {errors.municipality && <p className="mt-1 text-sm text-red-500">{errors.municipality}</p>}
            </div>

            {/* Ward */}
            <div key="ward-field">
              <label htmlFor="ward" className="block text-gray-700 mb-1">
                Ward Number*
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FiMapPin className="text-gray-400" />
                </div>
                <select
                  id="ward"
                  name="ward"
                  value={formData.ward}
                  onChange={handleChange}
                  className={`w-full pl-10 pr-4 py-3 border ${errors.ward ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:ring-2 focus:ring-nepal-blue focus:border-transparent`}
                  required
                >
                  <option value="">Select Ward</option>
                  {wards.map((w, i) => (
                    <option key={i} value={w}>Ward {w}</option>
                  ))}
                </select>
              </div>
              {errors.ward && <p className="mt-1 text-sm text-red-500">{errors.ward}</p>}
            </div>

            {/* Account Type */}
            <div key="role-field" className="md:col-span-2">
              <label htmlFor="role" className="block text-gray-700 mb-1">
                Account Type*
              </label>
              <select
                id="role"
                name="role"
                value={formData.role}
                onChange={handleChange}
                className="w-full border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-nepal-blue"
              >
                <option value="user">Citizen</option>
                <option value="admin">Admin</option>
              </select>
            </div>

            {/* Admin Level */}
            {formData.role === 'admin' && (
              <div key="adminLevel-field" className="md:col-span-2">
                
                  {/* Admin Code */}
  <div className="md:col-span-2">
    <label htmlFor="approvalCode" className="block text-gray-700 mb-1">
      Admin Code*
    </label>
    <div className="relative">
      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
        <FiLock className="text-gray-400" />
      </div>
      <input
        id="approvalCode"
        name="approvalCode"
        type="text"
        value={formData.approvalCode}
        onChange={handleChange}
        className={`w-full pl-10 pr-4 py-3 border ${
          errors.approvalCode ? 'border-red-500' : 'border-gray-300'
        } rounded-lg focus:ring-2 focus:ring-nepal-blue focus:border-transparent`}
        placeholder="Enter your admin code"
      />
    </div>
    {errors.approvalCode && (
      <p className="mt-1 text-sm text-red-500">{errors.approvalCode}</p>
    )}
  </div>
                <label htmlFor="adminLevel" className="block text-gray-700 mb-1">
                  Admin Level*
                </label>
                
                <select
                  id="adminLevel"
                  name="adminLevel"
                  value={formData.adminLevel}
                  onChange={handleChange}
                  className={`w-full border ${errors.adminLevel ? 'border-red-500' : 'border-gray-300'} rounded-lg px-4 py-3 focus:ring-2 focus:ring-nepal-blue`}
                  required
                >
                  <option value="">Select Level</option>
                  <option value="ward">Ward Admin</option>
                  <option value="municipality">Municipality Admin</option>
                  <option value="province">Province Admin</option>
                </select>
                {errors.adminLevel && <p className="mt-1 text-sm text-red-500">{errors.adminLevel}</p>}
              </div>
            )}
          </div>

          {/* Terms & Conditions */}
          <div className="flex items-center">
            <input
              id="terms"
             
              name="terms"
              type="checkbox"
              required
              className="h-4 w-4 text-nepal-blue focus:ring-nepal-blue border-gray-300 rounded"
            />
            <label htmlFor="terms" className="ml-2 block text-sm text-gray-700">
              I agree to the <a href="#" className="text-nepal-blue hover:underline">Terms of Service</a> and <a href="#" className="text-nepal-blue hover:underline">Privacy Policy</a>
            </label>
          </div>

          <div>
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-nepal-red hover:bg-red-700 text-white font-medium py-3 px-4 rounded-lg transition duration-300"
            >
              {isSubmitting ? 'Creating account...' : 'Create Account'}
            </button>
          </div>
        </form>
        
        <div className="text-center mt-4">
          <p className="text-gray-600">
            Already have an account?{' '}
            <Link to="/login" className="font-medium text-nepal-blue hover:text-nepal-red">
              Login here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;