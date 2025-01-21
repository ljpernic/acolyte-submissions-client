//////// AXIOS.JS -- CONFIGURES AXIOS INSTANCE FOR MANAGING REQUESTS AND RESPONSES IN REACT WEB APP ////////

import axios from 'axios';

// SETS DEFAULT BASE URL FOR ALL HTTP REQUESTS SENT USING AXIOS. BASE URL MUST MATCH PORT IN SERVER/APP.JS!
axios.defaults.baseURL = "http://localhost:5000"; // FOR TESTING
//axios.defaults.baseURL = process.env.REACT_APP_BASE_URL; // FOR PRODUCTION

// DEFAULT CACHE-CONTROL HEADER. DISABLES CACHING FOR ALL REQUESTS BY DEFAULT, ENSURING FRESH DATA IS FETCHED EACH TIME.
axios.defaults.headers.common['Cache-Control'] = 'no-cache';

// REQUEST INTERCEPTOR. RUNS BEFORE EVERY REQUEST IS SENT. RETRIEVES THE READER OBJECT FROM LOCALSTORAGE IF IT CONTAINS AUTHENTICATION 
// DETAILS. IF A TOKEN IS FOUND, IT ADDS AN AUTHORIZATION HEADER WITH BEARER <TOKEN>, ENABLING AUTHENTICATION REQUESTS. IT ALSO 
// ADDS ADDITIONAL HEADERS (CACHE-CONTROL, PRAGMA, ETC.) TO PREVENT CACHING.
axios.interceptors.request.use((config) => {
  try {
    const reader = localStorage.getItem('reader');
    if (reader) {
      const { token } = JSON.parse(reader);
      config.headers.authorization = `Bearer ${token}`;
    }

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

// RESPONSE INTERCEPTORS. PROCESSES EACH RESPONSE. IF IT HAS A 401/409 STATUS CODE, INDICATING AN AUTHENTICATION ISSUE, IT LOGS AN ERROR. 
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