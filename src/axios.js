//////// THIS IS WHAT IS CREATING OUR HEADERS. IT ALLOWS FOR ACCESS TO PROTECTED RESOURCES VIA AUTHORIZATION HEADERS. ////////
//////// IF THERE IS A READER IN LOCAL STORAGE, IT PARSES IT AND SETS THE TOKEN IN THE HEADER FOR AUTHORIZATION. ////////

import axios from 'axios';
axios.defaults.baseURL = 'http://localhost:5000/';

axios.interceptors.request.use(function (req) {
  const reader = localStorage.getItem('reader');
//  console.log(`client/arc/axios.js, reader: ` + JSON.stringify(reader))    // THIS PARSES OUT THE HEADER X-AUTH-TOKEN + THE TOKEN ITSELF.
  if (reader) {
    const { token } = JSON.parse(localStorage.getItem('reader'));
    req.headers.authorization = `X-auth-token ${token}`;
//    console.log(`client/arc/axios.js, req.headers.authorization: ` + JSON.stringify(req.headers.authorization))    // THIS PARSES OUT THE HEADER X-AUTH-TOKEN + THE TOKEN ITSELF.
    return req;
  }
  return req;
});
