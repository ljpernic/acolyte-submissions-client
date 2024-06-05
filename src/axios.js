import axios from 'axios';

// BASE URL. MUST MATCH PORT IN SERVER/APP.JS!
//axios.defaults.baseURL = "http://localhost:5000"; // FOR TESTING
axios.defaults.baseURL = process.env.REACT_APP_BASE_URL; // FOR PRODUCTION

axios.defaults.headers.common['Cache-Control'] = 'no-cache';

// Request interceptor
axios.interceptors.request.use((config) => {
  try {
    const reader = localStorage.getItem('reader');
    if (reader) {
      const { token } = JSON.parse(reader);
//      console.log("axios token: " + token);
      config.headers.authorization = `Bearer ${token}`;
    }

    // Disable caching headers
    config.headers['Cache-Control'] = 'no-cache';
    config.headers['Pragma'] = 'no-cache';
    config.headers['If-Modified-Since'] = new Date(0);
    config.headers['If-None-Match'] = '*';

    return config;
  } catch (error) {
    console.error('Error response from server:', error.response);
    return Promise.reject(error);
  }
});

// Response interceptor
axios.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && (error.response.status === 401 || 409)) {
      // Handle 401 error, possibly by redirecting to login
      // or showing a login modal.
      console.error('Authentication failed:', error.response);
      // Example: Redirect to login page
//      window.location.href = '/error-add-reader';
    } else {
      console.error('Unexpected error:', error);
    }
    return Promise.reject(error);
  }
);