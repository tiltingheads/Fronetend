import React, { useState } from "react";
import axios from "axios";

const PetProfileRegistration = () => {
  const [uploadingImg, setUploadingImg] = useState(false);

  const [ownerData, setOwnerData] = useState({
    username: "",
    password: "",
    email: "",
    phone: "",
  });

  const [pets, setPets] = useState([
    {
      petName: "",
      breed: "",
      dob: "",
      weight: "",
      gender: "",
      temperament: "",
      medicalHistory: "",
      activities: "",
      photo: null,
    },
  ]);

  const handleOwnerChange = (e) => {
    const { name, value } = e.target;
    setOwnerData({ ...ownerData, [name]: value });
  };

  const handlePetChange = (index, e) => {
    const { name, value, type, files } = e.target;
    const updatedPets = [...pets];
    if (type === "file") {
      handleImageUpload(e, index);
    } else {
      updatedPets[index][name] = value;
    }
    setPets(updatedPets);
  };

  const handleImageUpload = async (event, index) => {
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
      const updatedPets = [...pets];
      updatedPets[index].photo = res.data.secure_url;
      setPets(updatedPets);
      setUploadingImg(false);
    } catch (error) {
      console.error("Error uploading image:", error);
      setUploadingImg(false);
    }
  };

  const addPet = () => {
    setPets([
      ...pets,
      {
        petName: "",
        breed: "",
        dob: "",
        weight: "",
        gender: "",
        temperament: "",
        medicalHistory: "",
        activities: "",
        photo: null,
      },
    ]);
  };

  const removePet = (index) => {
    const updatedPets = [...pets];
    updatedPets.splice(index, 1);
    setPets(updatedPets);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Step 1: Register the owner
      const ownerResponse = await axios.post(
        "https://backend-eh2a.onrender.com/api/register",
        { ...ownerData }
      );

      const ownerId = ownerResponse.data.ownerId; // Get the owner ID from the response

      // Step 2: Add pets to the registered owner
      for (const pet of pets) {
        await axios.post(`https://backend-eh2a.onrender.com/api/${ownerId}/pets/add`, { pet });
      }

      alert("Owner and pets registered successfully!");
      window.location.href = "/login";
    } catch (error) {
      console.error("Error registering owner and pets:", error);
      alert("There was an issue with the registration process.");
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-[#dde5f4] p-2">
      <form
        className="bg-[#f1f7fe] p-4 rounded-3xl shadow-lg flex flex-col gap-6 w-full max-w-4xl"
        onSubmit={handleSubmit}
      >
        <div className="text-center">
          <h2 className="text-2xl font-semibold text-[#3e4684]">
            Pet Profile Registration
          </h2>
          <p className="text-[#5e5e5e]">
            Please fill out the form below to register your pet profile.
          </p>
        </div>

        {/* Owner Info */}
        <fieldset className="border border-[#d1d5db] rounded-lg p-4 space-y-4">
          <legend className="text-lg font-semibold text-[#4d4d4d] px-2">
            <ion-icon name="person-outline" class="mr-2"></ion-icon>
            Owner Information
          </legend>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex flex-col gap-2 bg-white p-4 rounded-xl shadow-md">
              <label className="text-[#4d4d4d] text-sm font-semibold">Username</label>
              <input
                type="text"
                name="username"
                placeholder="Enter username"
                className="outline-none border border-[#d1d5db] p-2 rounded-md text-sm w-full"
                value={ownerData.username}
                onChange={handleOwnerChange}
              />
            </div>
            <div className="flex flex-col gap-2 bg-white p-4 rounded-xl shadow-md">
              <label className="text-[#4d4d4d] text-sm font-semibold">Password</label>
              <input
                type="password"
                name="password"
                placeholder="Enter password"
                className="outline-none border border-[#d1d5db] p-2 rounded-md text-sm w-full"
                value={ownerData.password}
                onChange={handleOwnerChange}
              />
            </div>
            <div className="flex flex-col gap-2 bg-white p-4 rounded-xl shadow-md">
              <label className="text-[#4d4d4d] text-sm font-semibold">Email</label>
              <input
                type="email"
                name="email"
                placeholder="Enter email"
                className="outline-none border border-[#d1d5db] p-2 rounded-md text-sm w-full"
                value={ownerData.email}
                onChange={handleOwnerChange}
              />
            </div>
            <div className="flex flex-col gap-2 bg-white p-4 rounded-xl shadow-md">
              <label className="text-[#4d4d4d] text-sm font-semibold">Phone</label>
              <input
                type="text"
                name="phone"
                placeholder="Enter phone number"
                className="outline-none border border-[#d1d5db] p-2 rounded-md text-sm w-full"
                value={ownerData.phone}
                onChange={handleOwnerChange}
              />
            </div>
          </div>
        </fieldset>

        {/* Pets Info */}
        <fieldset className="border border-[#d1d5db] rounded-lg p-4 space-y-4">
          <legend className="text-lg font-semibold text-[#4d4d4d] px-2">
            <ion-icon name="paw-outline" class="mr-2"></ion-icon>
            Pet Information
          </legend>
          {pets.map((pet, index) => (
            <div key={index} className="flex flex-col gap-4 bg-white p-4 rounded-xl shadow-md">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="flex flex-col gap-2">
                  <label className="text-[#4d4d4d] text-sm font-semibold">Pet's Name</label>
                  <input
                    type="text"
                    name="petName"
                    placeholder="Enter pet's name"
                    className="outline-none border border-[#d1d5db] p-2 rounded-md text-sm"
                    value={pet.petName}
                    onChange={(e) => handlePetChange(index, e)}
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-[#4d4d4d] text-sm font-semibold">Breed</label>
                  <input
                    type="text"
                    name="breed"
                    placeholder="Enter breed"
                    className="outline-none border border-[#d1d5db] p-2 rounded-md text-sm"
                    value={pet.breed}
                    onChange={(e) => handlePetChange(index, e)}
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-[#4d4d4d] text-sm font-semibold">Date of Birth</label>
                  <input
                    type="date"
                    name="dob"
                    className="outline-none border border-[#d1d5db] p-2 rounded-md text-sm"
                    value={pet.dob}
                    onChange={(e) => handlePetChange(index, e)}
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-[#4d4d4d] text-sm font-semibold">Weight (kg)</label>
                  <input
                    type="text"
                    name="weight"
                    placeholder="Enter weight"
                    className="outline-none border border-[#d1d5db] p-2 rounded-md text-sm"
                    value={pet.weight}
                    onChange={(e) => handlePetChange(index, e)}
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-[#4d4d4d] text-sm font-semibold">Gender</label>
                  <select
                    name="gender"
                    className="outline-none border border-[#d1d5db] p-2 rounded-md text-sm"
                    value={pet.gender}
                    onChange={(e) => handlePetChange(index, e)}
                  >
                    <option value="">Select Gender</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                  </select>
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-[#4d4d4d] text-sm font-semibold">Temperament</label>
                  <input
                    type="text"
                    name="temperament"
                    placeholder="e.g., Playful, Shy"
                    className="outline-none border border-[#d1d5db] p-2 rounded-md text-sm"
                    value={pet.temperament}
                    onChange={(e) => handlePetChange(index, e)}
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-[#4d4d4d] text-sm font-semibold">Medical History</label>
                  <textarea
                    name="medicalHistory"
                    placeholder="e.g., Vaccinations, Allergies"
                    className="outline-none border border-[#d1d5db] p-2 rounded-md text-sm"
                    value={pet.medicalHistory}
                    onChange={(e) => handlePetChange(index, e)}
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-[#4d4d4d] text-sm font-semibold">Favorite Activities</label>
                  <textarea
                    name="activities"
                    placeholder="e.g., Fetch, Swimming"
                    className="outline-none border border-[#d1d5db] p-2 rounded-md text-sm"
                    value={pet.activities}
                    onChange={(e) => handlePetChange(index, e)}
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-[#4d4d4d] text-sm font-semibold">
                    Upload Pet Photo (JPG, PNG)
                  </label>
                  <input
                    type="file"
                    name="photo"
                    accept="image/*"
                    className="outline-none border border-[#d1d5db] p-2 rounded-md text-sm"
                    onChange={(e) => handlePetChange(index, e)}
                  />
                </div>
              </div>
              <div className="flex justify-end">
                <button
                  type="button"
                  className="text-red-500 text-sm"
                  onClick={() => removePet(index)}
                >
                  Remove Pet
                </button>
              </div>
            </div>
          ))}
          <button
            type="button"
            className="text-[#3e4684] font-semibold mt-4"
            onClick={addPet}
          >
            + Add Another Pet
          </button>
        </fieldset>

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full py-3 bg-[#3e4684] text-white rounded-xl font-semibold hover:bg-[#2c355b] transition duration-300"
        >
          Register
        </button>

        {/* Footer */}
        <div className="flex justify-center text-[15px] text-[#5e5e5e] mt-1">
          <span>Already registered? </span>
          <span
            className="text-[#3e4684] cursor-pointer hover:text-[#2c355b] ml-1"
            onClick={() => (window.location.href = "/login")}
          >
            Login
          </span>
        </div>
      </form>
    </div>
  );
};

export default PetProfileRegistration;
