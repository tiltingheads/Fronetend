import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import PetProfileRegistration from './components/PetProfileRegistration';  // Import your PetProfileRegistration component
import ProfileSettings from './components/ProfileSettings'; 
import Login from './components/Login';
import AboutMe from './components/AboutMe';
import './App.css';


const App = () => {
  return (
    <Router>
      <div>
        {/* <nav className="bg-[#3e4684] p-4 text-white">
          <ul className="flex justify-center gap-8">
            <li>
              <Link to="/" className="hover:underline">Home</Link>
            </li>
            <li>
              <Link to="/edit-profile" className="hover:underline">Edit Profile</Link>
            </li>
            <li>
              <Link to="/login" className="hover:underline">Login</Link>
            </li>
            <li>
              <Link to="/about-me" className="hover:underline">About Me</Link>
            </li>

          </ul>
        </nav> */}

        <div className="">
          <Routes>
            <Route path="/" element={<PetProfileRegistration />} />
            <Route path="/login" element={<Login />} />
            <Route path="/edit-profile" element={<ProfileSettings />} />
            <Route path="/about" element={<AboutMe />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
};

export default App;
