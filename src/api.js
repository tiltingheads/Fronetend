import axios from 'axios';

// General API for regular users
const API = axios.create({
  baseURL: `https://backend-eh2a.onrender.com/api`,
});

// Admin API for admin-specific routes
const AdminAPI = axios.create({
  baseURL: `https://backend-eh2a.onrender.com/admin`,
});

// Attach JWT token to request headers for both APIs
const attachToken = (req) => {
  const token = localStorage.getItem('token');
  if (token) {
    req.headers.Authorization = `Bearer ${token}`;
  }
  return req;
};

API.interceptors.request.use(attachToken);
AdminAPI.interceptors.request.use(attachToken);

// Auth Endpoints (General)
export const registerUser = (formData) => API.post('/register', formData);
export const loginUser = (formData) => API.post('/login', formData);
export const fetchProfile = () => API.get('/profile');
export const fetchBreeds = () => API.get('/breeds');
export const addPet = (ownerId, petData) => API.post(`/${ownerId}/pets/add`, { pet: petData });
export const updatePet = (petId, petData) => API.put(`/profile/pet/${petId}`, petData);
export const addPetToProfile = (petData) => API.post('/profile/pet/add', { pet: petData });

// Admin Endpoints
export const adminLogin = (formData) => AdminAPI.post('/login', formData);
export const fetchUsers = () => AdminAPI.get('/users');  // Admin can view all users
