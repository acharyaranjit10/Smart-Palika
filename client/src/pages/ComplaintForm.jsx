// src/pages/ComplaintForm.jsx
import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiCamera, FiMapPin, FiUpload, FiInfo, FiX } from 'react-icons/fi';
import Webcam from 'react-webcam';
import { toast } from 'react-hot-toast';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext'; // Add if not already imported
import provinces from '../data/provinces.json';
import municipalities from '../data/municipalities.json';
import wards from '../data/wards.json';

const ComplaintForm = ({ addComplaint }) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const webcamRef = useRef(null);
  
  // Nepal-specific data
  const provinces = [
    { id: 1, name: 'Province 1' },
    { id: 2, name: 'Madhesh' },
    { id: 3, name: 'Bagmati' },
    { id: 4, name: 'Gandaki' },
    { id: 5, name: 'Lumbini' },
    { id: 6, name: 'Karnali' },
    { id: 7, name: 'Sudurpashchim' },
  ];

  const municipalities = [
    { id: 1, name: 'Kathmandu', provinceId: 3 },
    { id: 2, name: 'Pokhara', provinceId: 4 },
    { id: 3, name: 'Lalitpur', provinceId: 3 },
    { id: 4, name: 'Bharatpur', provinceId: 3 },
    { id: 5, name: 'Biratnagar', provinceId: 1 },
    { id: 6, name: 'Birgunj', provinceId: 2 },
    { id: 7, name: 'Dharan', provinceId: 1 },
    { id: 8, name: 'Butwal', provinceId: 5 },
    { id: 9, name: 'Nepalgunj', provinceId: 5 },
    { id: 10, name: 'Itahari', provinceId: 1 },
    { id: 11, name: 'Hetauda', provinceId: 3 },
    { id: 12, name: 'Dhangadhi', provinceId: 7 },
  ];

  const wards = [
    { id: 1, number: 1, municipalityId: 1 },
    { id: 2, number: 2, municipalityId: 1 },
    { id: 3, number: 3, municipalityId: 1 },
    { id: 4, number: 4, municipalityId: 1 },
    { id: 5, number: 5, municipalityId: 1 },
    { id: 6, number: 6, municipalityId: 1 },
    { id: 7, number: 7, municipalityId: 1 },
    { id: 8, number: 8, municipalityId: 1 },
    { id: 9, number: 9, municipalityId: 1 },
    { id: 10, number: 10, municipalityId: 1 },
    { id: 11, number: 1, municipalityId: 2 },
    { id: 12, number: 2, municipalityId: 2 },
    { id: 13, number: 3, municipalityId: 2 },
    { id: 14, number: 1, municipalityId: 3 },
    { id: 15, number: 2, municipalityId: 3 },
  ];

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [useCamera, setUseCamera] = useState(false);
  const [previewImage, setPreviewImage] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [showInfo, setShowInfo] = useState(false);
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    province: '',
    municipality: '',
    ward: '',
    location: {
      lat: '',
      lng: ''
    }
  });

  // Filter municipalities based on selected province
  const filteredMunicipalities = formData.province 
    ? municipalities.filter(m => m.provinceId === parseInt(formData.province))
    : [];

  // Filter wards based on selected municipality
  const filteredWards = formData.municipality 
    ? wards.filter(w => w.municipalityId === parseInt(formData.municipality))
    : [];

  // Reset dependent fields when parent selection changes
  useEffect(() => {
    if (formData.province) {
      setFormData(prev => ({
        ...prev,
        municipality: '',
        ward: ''
      }));
    }
  }, [formData.province]);

  useEffect(() => {
    if (formData.municipality) {
      setFormData(prev => ({
        ...prev,
        ward: ''
      }));
    }
  }, [formData.municipality]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleLocation = () => {
    toast.promise(
      new Promise((resolve, reject) => {
        if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(
            (position) => {
              setFormData({
                ...formData,
                location: {
                  lat: position.coords.latitude,
                  lng: position.coords.longitude
                }
              });
              resolve();
            },
            (error) => {
              reject(error);
            }
          );
        } else {
          reject(new Error('Geolocation is not supported by this browser.'));
        }
      }),
      {
        loading: 'Getting your location...',
        success: 'Location captured successfully!',
        error: (err) => `Error getting location: ${err.message}`
      }
    );
  };

  const captureImage = () => {
    const imageSrc = webcamRef.current.getScreenshot();
    setPreviewImage(imageSrc);
    setUseCamera(false);
    
    // Convert data URL to blob
    fetch(imageSrc)
      .then(res => res.blob())
      .then(blob => {
        const file = new File([blob], 'capture.jpg', { type: 'image/jpeg' });
        setImageFile(file);
      });
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error('File size exceeds 5MB limit');
        return;
      }
      
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result);
      };
      reader.readAsDataURL(file);
      setImageFile(file);
    }
  };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setIsSubmitting(true);
    
//     // Form validation
//     if (!formData.title || !formData.description || !formData.province || !formData.municipality || !formData.ward) {
//       toast.error('Please fill all required fields');
//       setIsSubmitting(false);
//       return;
//     }

//     if (!imageFile) {
//       toast.error('Please upload or capture an image');
//       setIsSubmitting(false);
//       return;
//     }

//     // Find selected locations
//     const selectedProvince = provinces.find(p => p.id === parseInt(formData.province));
//     const selectedMunicipality = municipalities.find(m => m.id === parseInt(formData.municipality));
//     const selectedWard = wards.find(w => w.id === parseInt(formData.ward));

//     // Create complaint object
//     // const complaint = {
//     //   ...formData,
//     //   province: selectedProvince.name,
//     //   municipality: selectedMunicipality.name,
//     //   ward: `Ward ${selectedWard.number}`,
//     //   wardNo: selectedWard.number,
//     //   image: previewImage,
//     //   date: new Date().toISOString()
//     // };



// const formDataPayload = new FormData();

// formDataPayload.append("title", formData.title);
// formDataPayload.append("description", formData.description);
// formDataPayload.append("province", selectedProvince.name);
// formDataPayload.append("municipality", selectedMunicipality.name);
// formDataPayload.append("ward", `Ward ${selectedWard.number}`);
// formDataPayload.append("wardNo", selectedWard.number);
// formDataPayload.append("location", JSON.stringify(formData.location)); // must stringify object
// formDataPayload.append("image", imageFile); // 👈 File object from upload or webcam
// formDataPayload.append("userId", user?.user?.userId); // optional — depends on your backend

// await api.post('/complaints', formDataPayload, {
//   headers: {
//     "Authorization": `Bearer ${token}`,
//     "Content-Type": "multipart/form-data"
//   }
// });







//     // Add complaint (to context)
//   try {
//   const token = localStorage.getItem("token");

//   // Attach userId from context
//   complaint.userId = user?.user?.userId;

//   // const response = await api.post('/complaints', complaint, {
//   //   headers: {
//   //     Authorization: `Bearer ${token}`
//   //   }
//   // });

//   toast.success('Complaint submitted successfully!');
//   navigate('/dashboard');
// } catch (err) {
//   console.error('❌ Complaint submission failed:', err);
//   toast.error('Something went wrong while submitting.');
// }
    
//     // Show success message
//     toast.success('Complaint submitted successfully!');
    
//     // Redirect to dashboard after delay
//     setTimeout(() => {
//       navigate('/dashboard');
//     }, 1500);
//   };

const handleSubmit = async (e) => {
  e.preventDefault();
  setIsSubmitting(true);

  // 🛡️ Validate Required Fields
  if (
    !formData.title ||
    !formData.description ||
    !formData.province ||
    !formData.municipality ||
    !formData.ward
  ) {
    toast.error('Please fill all required fields');
    setIsSubmitting(false);
    return;
  }

  if (!imageFile) {
    toast.error('Please upload or capture an image');
    setIsSubmitting(false);
    return;
  }

  // 📍 Get location values
  const selectedProvince = provinces.find(p => p.id === parseInt(formData.province));
  const selectedMunicipality = municipalities.find(m => m.id === parseInt(formData.municipality));
  const selectedWard = wards.find(w => w.id === parseInt(formData.ward));

  // 📦 Build FormData payload for multipart upload
  const formDataPayload = new FormData();
  formDataPayload.append("title", formData.title);
  formDataPayload.append("description", formData.description);
  formDataPayload.append("province", selectedProvince.name);
  formDataPayload.append("municipality", selectedMunicipality.name);
  formDataPayload.append("ward", `Ward ${selectedWard.number}`);
  formDataPayload.append("wardNo", selectedWard.number);
  formDataPayload.append("location", JSON.stringify(formData.location)); // Send as JSON string
  formDataPayload.append("image", imageFile); // 👈 Cloudinary gets this file
  formDataPayload.append("userId", user?.user?.userId); // Optional — depends on your backend

  try {
    const token = localStorage.getItem("token");

    const response = await api.post('/complaints', formDataPayload, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "multipart/form-data"
      }
    });

    toast.success('Complaint submitted successfully!');
    navigate('/dashboard');
  } catch (err) {
    console.error('❌ Complaint submission failed:', err);
    toast.error('Something went wrong while submitting.');
  } finally {
    setIsSubmitting(false);
  }
};


  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="bg-gradient-to-r from-nepal-blue to-nepal-red p-6">
          <h1 className="text-2xl font-bold text-white flex items-center">
            <FiInfo className="mr-2" />
           Smart Palika: File a New Complaint
          </h1>
          <p className="text-blue-100 mt-1">
            Report civic issues to your local government authorities
          </p>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <label className="block text-gray-700 mb-2 font-medium">
                Complaint Title <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-nepal-blue focus:border-transparent"
                placeholder="e.g. Garbage not collected for 3 days"
                required
              />
            </div>
            
            <div>
              <label className="block text-gray-700 mb-2 font-medium">
                Location <span className="text-red-500">*</span>
              </label>
              <div className="flex">
                <button
                  type="button"
                  onClick={handleLocation}
                  className="flex items-center w-full px-4 py-3 bg-gray-100 border border-gray-300 rounded-l-lg hover:bg-gray-200"
                >
                  <FiMapPin className="mr-2 text-nepal-red" />
                  {formData.location.lat ? 
                    'Location Captured' : 
                    'Capture Current Location'}
                </button>
                {formData.location.lat && (
                  <button
                    type="button"
                    onClick={() => setFormData({...formData, location: {lat: '', lng: ''}})}
                    className="bg-red-100 text-red-700 px-4 rounded-r-lg hover:bg-red-200"
                  >
                    <FiX />
                  </button>
                )}
              </div>
              {formData.location.lat && (
                <p className="text-sm text-gray-500 mt-1">
                  Coordinates: {formData.location.lat.toFixed(6)}, {formData.location.lng.toFixed(6)}
                </p>
              )}
            </div>
          </div>
          
          <div className="mb-6">
            <label className="block text-gray-700 mb-2 font-medium">
              Description <span className="text-red-500">*</span>
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows="4"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-nepal-blue focus:border-transparent"
              placeholder="Describe the issue in detail. Include information about when it started, how it affects the community, and any other relevant details..."
              required
            ></textarea>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div>
              <label className="block text-gray-700 mb-2 font-medium">
                Province <span className="text-red-500">*</span>
              </label>
              <select
                name="province"
                value={formData.province}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-nepal-blue focus:border-transparent"
                required
              >
                <option value="">Select Province</option>
                {provinces.map(province => (
                  <option key={province.id} value={province.id}>{province.name}</option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-gray-700 mb-2 font-medium">
                Municipality <span className="text-red-500">*</span>
              </label>
              <select
                name="municipality"
                value={formData.municipality}
                onChange={handleChange}
                disabled={!formData.province || filteredMunicipalities.length === 0}
                className={`w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-nepal-blue focus:border-transparent ${
                  !formData.province || filteredMunicipalities.length === 0 ? 'opacity-50 cursor-not-allowed' : ''
                }`}
                required
              >
                <option value="">Select Municipality</option>
                {filteredMunicipalities.map(municipality => (
                  <option key={municipality.id} value={municipality.id}>{municipality.name}</option>
                ))}
              </select>
              {filteredMunicipalities.length === 0 && formData.province && (
                <p className="text-red-500 text-sm mt-1">No municipalities available for this province</p>
              )}
            </div>
            
            <div>
              <label className="block text-gray-700 mb-2 font-medium">
                Ward <span className="text-red-500">*</span>
              </label>
              <select
                name="ward"
                value={formData.ward}
                onChange={handleChange}
                disabled={!formData.municipality || filteredWards.length === 0}
                className={`w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-nepal-blue focus:border-transparent ${
                  !formData.municipality || filteredWards.length === 0 ? 'opacity-50 cursor-not-allowed' : ''
                }`}
                required
              >
                <option value="">Select Ward</option>
                {filteredWards.map(ward => (
                  <option key={ward.id} value={ward.id}>Ward {ward.number}</option>
                ))}
              </select>
              {filteredWards.length === 0 && formData.municipality && (
                <p className="text-red-500 text-sm mt-1">No wards available for this municipality</p>
              )}
            </div>
          </div>
          
          <div className="mb-8">
            <div className="flex justify-between items-center mb-2">
              <label className="block text-gray-700 font-medium">
                Upload Evidence <span className="text-red-500">*</span>
              </label>
              <button 
                type="button" 
                onClick={() => setShowInfo(!showInfo)}
                className="text-nepal-blue hover:underline text-sm flex items-center"
              >
                <FiInfo className="mr-1" /> Why is this required?
              </button>
            </div>
            
            {showInfo && (
              <div className="bg-blue-50 border-l-4 border-nepal-blue p-4 rounded-lg mb-4">
                <p className="text-gray-700">
                  Uploading evidence helps authorities verify and address your complaint faster. 
                  Photos should clearly show the issue and its location. 
                  Maximum file size: 5MB. Supported formats: JPG, PNG.
                </p>
              </div>
            )}
            
            <div className="flex flex-col md:flex-row items-center space-y-4 md:space-y-0 md:space-x-4">
              {useCamera ? (
                <div className="w-full">
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 flex flex-col items-center">
                    <Webcam
                      audio={false}
                      ref={webcamRef}
                      screenshotFormat="image/jpeg"
                      className="w-full h-64 object-contain mb-4"
                    />
                    <div className="flex space-x-4">
                      <button
                        type="button"
                        onClick={captureImage}
                        className="bg-nepal-blue text-white px-6 py-2 rounded-lg font-medium"
                      >
                        Capture Image
                      </button>
                      <button
                        type="button"
                        onClick={() => setUseCamera(false)}
                        className="bg-gray-500 text-white px-6 py-2 rounded-lg font-medium"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <>
                  <button
                    type="button"
                    onClick={() => setUseCamera(true)}
                    className="flex flex-col items-center justify-center w-full md:w-1/2 h-48 border-2 border-dashed border-gray-300 rounded-lg hover:border-nepal-blue transition group"
                  >
                    <div className="bg-gray-100 group-hover:bg-gray-200 rounded-full p-4 mb-3 transition">
                      <FiCamera className="w-8 h-8 text-gray-500 group-hover:text-nepal-blue" />
                    </div>
                    <span className="text-gray-600 font-medium">Use Camera</span>
                    <span className="text-sm text-gray-500 mt-1">Take a live photo</span>
                  </button>
                  
                  <div className="relative w-full md:w-1/2">
                    <input
                      type="file"
                      id="file-upload"
                      className="hidden"
                      accept="image/*"
                      onChange={handleFileUpload}
                    />
                    <label
                      htmlFor="file-upload"
                      className="flex flex-col items-center justify-center w-full h-48 border-2 border-dashed border-gray-300 rounded-lg hover:border-nepal-blue cursor-pointer transition group"
                    >
                      <div className="bg-gray-100 group-hover:bg-gray-200 rounded-full p-4 mb-3 transition">
                        <FiUpload className="w-8 h-8 text-gray-500 group-hover:text-nepal-blue" />
                      </div>
                      <span className="text-gray-600 font-medium">Upload Image</span>
                      <span className="text-sm text-gray-500 mt-1">From your device</span>
                    </label>
                  </div>
                </>
              )}
            </div>
            
            {previewImage && !useCamera && (
              <div className="mt-6">
                <div className="flex justify-between items-center mb-2">
                  <p className="text-gray-700 font-medium">Preview:</p>
                  <button 
                    type="button"
                    onClick={() => {
                      setPreviewImage(null);
                      setImageFile(null);
                    }}
                    className="text-red-500 hover:text-red-700 flex items-center"
                  >
                    <FiX className="mr-1" /> Remove
                  </button>
                </div>
                <div className="border border-gray-200 rounded-lg p-2 inline-block">
                  <img 
                    src={previewImage} 
                    alt="Complaint preview" 
                    className="max-h-64 rounded-md"
                  />
                </div>
              </div>
            )}
          </div>
          
          <div className="flex flex-col-reverse md:flex-row justify-between items-center gap-4 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={() => navigate('/')}
              className="px-6 py-3 text-gray-700 hover:bg-gray-100 rounded-lg font-medium"
            >
              Cancel
            </button>
            
            <button
              type="submit"
              disabled={isSubmitting}
              className="bg-nepal-red hover:bg-red-700 text-white font-medium py-3 px-8 rounded-lg transition duration-300 flex items-center"
            >
              {isSubmitting ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Submitting...
                </>
              ) : 'Submit Complaint'}
            </button>
          </div>
        </form>
      </div>
      
      <div className="mt-8 bg-gradient-to-r from-blue-50 to-indigo-50 border-l-4 border-nepal-blue p-6 rounded-lg">
        <h3 className="font-bold text-nepal-blue text-lg mb-3">Complaint Submission Guidelines</h3>
        <ul className="list-disc pl-5 text-gray-700 space-y-2">
          <li>All complaints are forwarded to the respective ward office for resolution</li>
          <li>You'll receive SMS and email updates on your complaint status</li>
          <li>False complaints may lead to account suspension</li>
          <li>Average resolution time is 3-7 working days</li>
          <li>Complaints are processed in the order they are received</li>
          <li>For emergencies, please contact local authorities directly</li>
        </ul>
      </div>
    </div>
  );
};

export default ComplaintForm;