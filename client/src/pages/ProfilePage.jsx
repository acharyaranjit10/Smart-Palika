import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import {
  FiMail,
  FiUser,
  FiShield,
  FiMapPin,
  FiCamera,
  FiClock,
  FiCheckCircle,
} from "react-icons/fi";
import api from "../api/axios";
import { toast } from "react-hot-toast";
import avatar from "../assets/avatar.jpg"

const ProfilePage = () => {
  const { user } = useAuth();
 const profile = user?.user // because you're storing the full user directly now
  const { login } = useAuth();

  // const [previewImage, setPreviewImage] = useState(null);
  // const [selectedFile, setSelectedFile] = useState(null);
// const handleImageChange = (e) => {
//   const file = e.target.files[0];
//   if (file) {
//     setSelectedFile(file); // 🌟
//     const reader = new FileReader();
//     reader.onloadend = () => {
//       setPreviewImage(reader.result);
//     };
//     reader.readAsDataURL(file);
//   }
// };
// const saveImageToServer = async () => {
//   if (!selectedFile) return toast.error("No image selected");

//   const token = localStorage.getItem("token");
//   const formData = new FormData();
//   console.log("Selected file:", selectedFile);
//   formData.append("image", selectedFile);

//   try {
//     const res = await api.put("/users/update-image", formData, {
//       headers: {
//         Authorization: `Bearer ${token}`,
//         "Content-Type": "multipart/form-data"
//       }
//     });

//     toast.success("Image saved!");
//     console.log("Upload response:", res.data);
// //     const updatedUser = res.data.user;
// // login(updatedUser); // this updates user in AuthContext
//   } catch (err) {
//     console.error("Upload failed:", err);
//     toast.error("Upload failed. Please check console.");
//   }
// };

  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      <div className="bg-white rounded-xl shadow-lg p-8 relative flex flex-col md:flex-row items-start gap-6">
        {/* 📷 Profile image + overlay */}
        <div className="relative">
          <img
            src={avatar} // Fallback to default avatar
            alt="Profile"
            className="w-32 h-32 rounded-full object-cover border-4 border-nepal-blue shadow-lg"
          />
          {/* <label
            htmlFor="profileImageInput"
            className="absolute bottom-0 right-0 bg-nepal-blue text-white p-2 rounded-full shadow hover:bg-blue-700 cursor-pointer"
            title="Change photo"
          >
            <FiCamera />
          </label> */}
          {/* <input
            type="file"
            accept="image/*"
            className="hidden"
            id="profileImageInput"
            // onChange={handleImageChange}
          /> */}
        </div>

        {/* {previewImage && (
  <button
    onClick={saveImageToServer}
    className="mt-3 bg-nepal-blue text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
  >
    Save Image
  </button>
)} */}

        {/* 👤 Details */}
        <div className="flex-1">
          <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2 mb-2">
            <FiUser />
            {profile?.name || "Unnamed"}
          </h1>

          <div className="space-y-2 text-sm text-gray-500">
            <p className="flex items-center gap-2">
              <FiMail />
              {profile?.email}
            </p>

            <p className="flex items-center gap-2">
              <FiShield />
              Role: {profile?.role === "admin" ? "Administrator" : "Citizen"}
            </p>
{profile?.role === "admin" && (
  <p className="flex items-center gap-2">
    <FiMapPin />
    Level: {profile?.adminLevel}
  </p>
)}

{profile?.municipality?.name && (
  <p className="flex items-center gap-2">
    🏙️ Municipality: {profile?.municipality?.name}
  </p>
)}

{profile?.ward?.number && (
  <p className="flex items-center gap-2">
    🏘️ Ward No: {profile?.ward?.number}
  </p>
)}

{profile?.province?.name && (
  <p className="flex items-center gap-2">
    🗺️ Province: {profile?.province?.name}
  </p>
)}
            {profile?.date && (
              <p className="flex items-center gap-2">
                <FiClock />
                Joined: {new Date(profile.date).toLocaleDateString()}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* ✅ Profile status card */}
      <div className="bg-white rounded-xl shadow mt-8 p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-gray-50 p-4 rounded-lg border">
          <h3 className="text-sm font-semibold text-gray-600 mb-1">Account Type</h3>
          <p className="text-lg font-bold text-nepal-blue capitalize">
            {profile?.role || "Unknown"}
          </p>
        </div>
        <div className="bg-gray-50 p-4 rounded-lg border">
          <h3 className="text-sm font-semibold text-gray-600 mb-1">Status</h3>
          <p className="text-green-600 text-lg font-medium flex items-center gap-2">
            <FiCheckCircle /> Active
          </p>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;