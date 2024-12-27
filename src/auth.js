export const getRole = () => {
    const token = localStorage.getItem('token');
    if (token) {
      const payload = JSON.parse(atob(token.split('.')[1]));  // Decode JWT
      return payload.role;  // role is either 'admin' or 'user'
    }
    return null;
  };
  
  export const isAuthenticated = () => !!localStorage.getItem('token');
  