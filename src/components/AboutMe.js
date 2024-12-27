import React, { useEffect, useState } from "react";
import axios from "axios";
import JSZip from "jszip";
import { saveAs } from "file-saver";

const AboutMe = () => {
  const [profile, setProfile] = useState(null);
  const [currentPetIndex, setCurrentPetIndex] = useState(0);
  const [error, setError] = useState("");
  const [editMode, setEditMode] = useState(false);
  const [showAddPetForm, setShowAddPetForm] = useState(false);
  const [uploadingImg, setUploadingImg] = useState(false);
  const [breeds, setBreeds] = useState([]); 
  const [filteredBreeds, setFilteredBreeds] = useState([]); 
  const [showSuggestions, setShowSuggestions] = useState(false);
  

  const [newPet, setNewPet] = useState({
    petName: "",
    breed: "",
    dob: "",
    weight: "",
    gender: "",
    temperament: "",
    medicalHistory: [],
    activities: "",
    photo: "",
  });

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem("token");
        console.log(token);
        const response = await axios.get("https://backend-eh2a.onrender.com/api/profile", {
          headers: {
            Authorization: `Bearer ${token}`

          },
        });
        setProfile(response.data);
      } catch (err) {
        setError("Error fetching profile data");
      }
    };

    const fetchBreeds = async () => {
      try {
        const response = await axios.get("https://backend-eh2a.onrender.com/api/breeds");
        setBreeds(response.data.map((breed) => breed.name)); 
      } catch (err) {
        console.error("Error fetching breeds", err);
      }
    };

    fetchProfile();
    fetchBreeds();
  }, []);

  const handlePetChange = (index) => {
    setCurrentPetIndex(index);
  };
 


  const handleEditPet = () => {
    setEditMode(true);
    setShowAddPetForm(false);
    setNewPet(profile.pets[currentPetIndex]);
  };

  const handleSaveEdit = async () => {
    try {
      const token = localStorage.getItem("token");
      await axios.put(
        `https://backend-eh2a.onrender.com/api/profile/pet/${profile.pets[currentPetIndex]._id}`,
        newPet,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setProfile((prevProfile) => {
        const updatedPets = [...prevProfile.pets];
        updatedPets[currentPetIndex] = newPet;
        return { ...prevProfile, pets: updatedPets };
      });
      setEditMode(false);
    } catch (error) {
      console.error("Error updating pet", error);
    }
  };
  const handleBreedInputChange = (value) => {
    setNewPet((prevPet) => ({ ...prevPet, breed: value }));
    setFilteredBreeds(
      breeds.filter((breed) =>
        breed.toLowerCase().includes(value.toLowerCase())
      )
    );
  };
  const handleBreedSelection = (breed) => {
    setNewPet((prevPet) => ({ ...prevPet, breed }));
    setFilteredBreeds([]);
  };
  
  
  const handleAddPetForm = () => {
    setShowAddPetForm(true);
    setEditMode(false);
    setNewPet({
      petName: "",
      breed: "",
      dob: "",
      weight: "",
      gender: "",
      temperament: "",
      medicalHistory: [],
      activities: "",
      photo: "",
    });
  };

  const handleAddPet = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.post(
        "https://backend-eh2a.onrender.com/api/profile/pet/add",
        { pet: newPet },
        {
          headers: {
            Authorization: `Bearer ${token}` },
        }
      );
      setProfile((prevProfile) => ({
        ...prevProfile,
        pets: [...prevProfile.pets, response.data.pet],
      }));
      setShowAddPetForm(false);
    } catch (error) {
      console.error("Error adding new pet", error);
    }
  };
  const handleGoBack = () => {
    setShowAddPetForm(false);
  };
  const handleImageUpload = async (event) => {
    const file = event.target.files[0];
    if (file.size > 1048576) {
      return alert("File is too big. Image must be less than 1MB.");
    }
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "tiltingheads");
    formData.append("cloud_name", "ddwu5ov3qr");

    try {
      setUploadingImg(true);
      const res = await axios.post(
        "https://api.cloudinary.com/v1_1/dwu5ov3qr/image/upload",
        formData
      );
      setNewPet((prevPet) => ({ ...prevPet, photo: res.data.secure_url }));
      setUploadingImg(false);
    } catch (error) {
      console.error("Error uploading image:", error);
      setUploadingImg(false);
    }
  };

  const handleMedicalHistoryUpload = async (event) => {
    const files = event.target.files;
    const medicalHistoryUrls = [];

    for (const file of files) {
      if (file.size > 1048576) {
        alert("File is too big. Each file must be less than 1MB.");
        continue;
      }
      const formData = new FormData();
      formData.append("file", file);
      formData.append("upload_preset", "tiltingheads");
      formData.append("cloud_name", "ddwu5ov3qr");

      try {
        setUploadingImg(true);
        const res = await axios.post(
          "https://api.cloudinary.com/v1_1/dwu5ov3qr/image/upload",
          formData
        );
        medicalHistoryUrls.push(res.data.secure_url);
      } catch (error) {
        console.error("Error uploading medical report:", error);
      }
    }

    setNewPet((prevPet) => ({
      ...prevPet,
      medicalHistory: [...prevPet.medicalHistory, ...medicalHistoryUrls],
    }));
    setUploadingImg(false);
  };

  if (error) return <div className="text-red-500">{error}</div>;
  if (!profile) return <div className="text-gray-600">Loading...</div>;
  const handleDownloadAll = async () => {
    const currentPet = profile.pets[currentPetIndex];
    const imageUrls = currentPet.images || [];

    if (imageUrls.length === 0) {
      alert("No images available to download.");
      return;
    }

    const zip = new JSZip();
    const folder = zip.folder(`${currentPet.petName || "pet"}_images`);

    const fetchImage = async (url, index) => {
      const response = await fetch(url);
      const blob = await response.blob();
      folder.file(`pet_image_${index + 1}.jpg`, blob);
    };

    try {
      await Promise.all(imageUrls.map((url, index) => fetchImage(url, index)));
      const content = await zip.generateAsync({ type: "blob" });
      saveAs(content, `${currentPet.petName || "pet"}_gallery.zip`);
    } catch (error) {
      console.error("Error creating ZIP file:", error);
    }
  };


  const currentPet = profile.pets[currentPetIndex];
  const galleryImages = currentPet?.images || [];  // Assume this contains the array of image URLs

  return (
    <section className="section about-section bg-gray-100 py-24" id="about">
    <div className="container mx-auto">
      <div className="flex flex-col lg:flex-row items-center lg:space-x-8">
        {/* Pet Avatar */}
        <div className="w-full lg:w-1/2 px-4 mb-6 lg:mb-0">
          <div className="about-avatar relative">
            <img
              src={
                editMode || showAddPetForm
                  ? newPet.photo || "/avatar.png"
                  : currentPet?.photo || "/avatar.png"
              }
              alt="Pet Profile"
              className="w-full max-w-xs mx-auto rounded-full shadow-lg"
            />
            {uploadingImg && (
              <p className="absolute top-2 left-2 text-indigo-600">
                Uploading...
              </p>
            )}
          </div>
        </div>
  
        {/* Pet Information */}
        <div className="w-full lg:w-1/2 px-4">
          <div className="about-text">
            <h3 className="text-indigo-900 text-4xl font-extrabold">
              About Your Dog
            </h3>
            <h6 className="text-red-500 text-lg font-semibold mt-2">
              A Pet Profile
            </h6>
            <p className="mt-4 text-gray-600 text-lg max-w-2xl">
              This is
              <mark className="bg-gradient-to-r from-pink-400 to-red-400 text-transparent bg-clip-text font-semibold">
                {editMode || showAddPetForm
                  ? newPet.petName || "Your New Pet"
                  : currentPet?.petName || `Dog Profile ${currentPetIndex + 1}`}
              </mark>
              , a wonderful pet!
            </p>
  
            {/* Pet Attributes */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
              {(editMode || showAddPetForm) ? (
                <>
                  <div className="flex flex-col">
                    <label className="text-indigo-900 font-semibold">
                      Upload Photo
                    </label>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="border rounded-md p-2 shadow-sm focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                  <div className="flex flex-col">
                    <label className="text-indigo-900 font-semibold">
                      Upload Medical Reports
                    </label>
                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={handleMedicalHistoryUpload}
                      className="border rounded-md p-2 shadow-sm focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                  
                  {/* Breed Input with Auto-suggestions */}
                  <div className="relative flex flex-col">
                    <label className="text-indigo-900 font-semibold">Breed</label>
                    <input
                      type="text"
                      value={newPet.breed}
                      onChange={(e) =>
                        handleBreedInputChange(e.target.value)
                      }
                      className="border rounded-md p-2 shadow-sm focus:ring-2 focus:ring-indigo-500"
                      placeholder="Enter breed"
                      onFocus={() => setShowSuggestions(true)}
                      onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
                    />
                    {showSuggestions && filteredBreeds.length > 0 && (
                      <ul
                        className="absolute bg-white border border-gray-300 rounded-md mt-1 max-h-40 overflow-y-auto w-full z-10"
                        style={{ top: "100%", left: 0 }}
                      >
                        {filteredBreeds.map((breed, index) => (
                          <li
                            key={index}
                            onClick={() => handleBreedSelection(breed)}
                            className="p-2 hover:bg-gray-100 cursor-pointer"
                          >
                            {breed}
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
  
                  {/* Gender Dropdown */}
                  <div className="flex flex-col">
                    <label className="text-indigo-900 font-semibold">Gender</label>
                    <select
                      value={newPet.gender}
                      onChange={(e) =>
                        setNewPet({ ...newPet, gender: e.target.value })
                      }
                      className="border rounded-md p-2 shadow-sm focus:ring-2 focus:ring-indigo-500"
                    >
                      <option value="">Select Gender</option>
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
  
                  {Object.keys(newPet).map((key) =>
                    key !== "photo" &&
                    key !== "medicalHistory" &&
                    key !== "breed" &&
                    key !== "gender" ? (
                      <div key={key} className="flex flex-col">
                        <label className="text-indigo-900 font-semibold">
                          {key.charAt(0).toUpperCase() + key.slice(1)}
                        </label>
                        <input
                          type={key === "dob" ? "date" : "text"}
                          value={newPet[key] || ""}
                          onChange={(e) =>
                            setNewPet({ ...newPet, [key]: e.target.value })
                          }
                          className="border rounded-md p-2 shadow-sm focus:ring-2 focus:ring-indigo-500"
                        />
                      </div>
                    ) : null
                  )}
                </>
              ) : (
                <>
                  <div>
                    <div className="flex justify-between">
                      <label className="text-indigo-900 font-semibold">
                        Birthday
                      </label>
                      <p className="text-gray-600">
                        {currentPet?.dob || "N/A"}
                      </p>
                    </div>
                    <div className="flex justify-between mt-4">
                      <label className="text-indigo-900 font-semibold">Age</label>
                      <p className="text-gray-600">
                        {currentPet?.dob ? calculateAge(currentPet.dob) : "N/A"}
                      </p>
                    </div>
                    <div className="flex justify-between mt-4">
                      <label className="text-indigo-900 font-semibold">Breed</label>
                      <p className="text-gray-600">{currentPet?.breed || "N/A"}</p>
                    </div>
                    <div className="flex justify-between mt-4">
                      <label className="text-indigo-900 font-semibold">
                        Gender
                      </label>
                      <p className="text-gray-600">{currentPet?.gender || "N/A"}</p>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between">
                      <label className="text-indigo-900 font-semibold">
                        Temperament
                      </label>
                      <p className="text-gray-600">
                        {currentPet?.temperament || "N/A"}
                      </p>
                    </div>
                    <div className="flex justify-between mt-4">
                      <label className="text-indigo-900 font-semibold">
                        Weight
                      </label>
                      <p className="text-gray-600">
                        {currentPet?.weight || "N/A"}
                      </p>
                    </div>
                    <div className="flex justify-between mt-4">
                      <label className="text-indigo-900 font-semibold">
                        Medical History
                      </label>
                      <div className="text-gray-600">
                        {currentPet?.medicalHistory &&
                        currentPet.medicalHistory.length > 0
                          ? currentPet.medicalHistory.map((url, index) => (
                              <a
                                key={index}
                                href={url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="block text-blue-500 underline"
                              >
                                Link {index + 1}
                              </a>
                            ))
                          : "N/A"}
                      </div>
                    </div>
                    <div className="flex justify-between mt-4">
                      <label className="text-indigo-900 font-semibold">
                        Activities
                      </label>
                      <p className="text-gray-600">
                        {currentPet?.activities || "N/A"}
                      </p>
                    </div>
                  </div>
                </>
              )}
            </div>
            {(editMode || showAddPetForm) && (
              <div className="flex justify-center mt-4 space-x-4">
                <button
                  onClick={editMode ? handleSaveEdit : handleAddPet}
                  className={`mt-4 ${
                    editMode ? "bg-blue-600" : "bg-green-600"
                  } text-white px-4 py-2 rounded-md shadow-md hover:${
                    editMode ? "bg-blue-800" : "bg-green-800"
                  }`}
                >
                  {editMode ? "Save Changes" : "Add Pet"}
                </button>
                <button
                  onClick={handleGoBack}
                  className="mt-4 bg-gray-600 text-white px-4 py-2 rounded-md shadow-md hover:bg-gray-800"
                >
                  Go Back
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
  
      {/* Navigation for multiple pets */}
      {profile?.pets &&
        profile.pets.length > 1 &&
        !(editMode || showAddPetForm) && (
          <div className="flex justify-center mt-8 space-x-4">
            {profile.pets.map((pet, index) => (
              <button
                key={index}
                onClick={() => handlePetChange(index)}
                className={`px-4 py-2 rounded-lg text-sm font-semibold ${
                  index === currentPetIndex
                    ? "bg-indigo-600 text-white"
                    : "bg-gray-200 text-indigo-900"
                }`}
              >
                {pet?.petName || `Dog Profile ${index + 1}`}
              </button>
            ))}
          </div>
        )}
  
      {/* Add New Pet Button */}
      {!editMode && !showAddPetForm && (
        <div className="flex justify-center mt-8">
          <button
            onClick={handleAddPetForm}
            className="flex items-center bg-green-600 text-white px-4 py-2 rounded-lg shadow-md hover:bg-green-800"
          >
            <ion-icon name="add-circle-outline" className="mr-2"></ion-icon>
            Add New Pet
          </button>
        </div>
      )}

<div className="w-full max-w-6xl mt-16 relative">
          <div className="flex justify-between items-center mb-6">
            <h4 className="text-3xl font-semibold text-indigo-800">
              Pet Gallery
            </h4>

            <button
              onClick={handleDownloadAll}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg shadow-md hover:bg-blue-800"
            >
              Download All
            </button>
          </div>
            {galleryImages.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {galleryImages.map((image, index) => (
                  <div key={index} className="relative group">
                    <img
                      src={image}
                      alt={`Gallery Image ${index + 1}`}
                      className="w-full h-60 object-cover rounded-lg shadow-lg transform transition-transform duration-300 hover:scale-105"
                    />
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-center text-gray-500 mt-4">No images available</p>
            )}
          </div>
    </div>
  </section>
  
  );
};

const calculateAge = (dob) => {
  if (!dob) return "N/A";

  const birthDate = new Date(dob);
  const today = new Date();

  let years = today.getFullYear() - birthDate.getFullYear();
  let months = today.getMonth() - birthDate.getMonth();
  let days = today.getDate() - birthDate.getDate();

  if (days < 0) {
    months -= 1;
    days += new Date(today.getFullYear(), today.getMonth(), 0).getDate();
  }

  if (months < 0) {
    years -= 1;
    months += 12;
  }

  return `${years}yr ${months}mo ${days}d`;
};

export default AboutMe;
