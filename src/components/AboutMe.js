import React, { useEffect, useState } from "react";
import axios from "axios";

const AboutMe = () => {
  const [profile, setProfile] = useState(null);
  const [currentPetIndex, setCurrentPetIndex] = useState(0);
  const [error, setError] = useState("");
  const [editMode, setEditMode] = useState(false);
  const [showAddPetForm, setShowAddPetForm] = useState(false);
  const [uploadingImg, setUploadingImg] = useState(false);
  const [newPet, setNewPet] = useState({
    petName: "",
    breed: "",
    dob: "",
    weight: "",
    gender: "",
    temperament: "",
    medicalHistory: "",
    activities: "",
    photo: "",
  });

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get("https://backend-eh2a.onrender.com/api/profile", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setProfile(response.data);
      } catch (err) {
        setError("Error fetching profile data");
      }
    };

    fetchProfile();
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
      medicalHistory: "",
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

  if (error) return <div className="text-red-500">{error}</div>;
  if (!profile) return <div className="text-gray-600">Loading...</div>;

  const currentPet = profile.pets[currentPetIndex];

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
                    {Object.keys(newPet).map((key) =>
                      key !== "photo" ? (
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
                        <p className="text-gray-600">{currentPet?.dob || "N/A"}</p>
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
                        <label className="text-indigo-900 font-semibold">Weight</label>
                        <p className="text-gray-600">
                          {currentPet?.weight || "N/A"}
                        </p>
                      </div>
                      <div className="flex justify-between mt-4">
                        <label className="text-indigo-900 font-semibold">
                          Medical History
                        </label>
                        <p className="text-gray-600">
                          {currentPet?.medicalHistory || "N/A"}
                        </p>
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
                <div className="
                flex justify-center mt-4 space-x-4
                ">
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
        {profile?.pets && profile.pets.length > 1 && !(editMode || showAddPetForm) && (
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
              <ion-icon name="add-circle-outline" class="mr-2"></ion-icon>
              Add New Pet
            </button>
          </div>
        )}
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
