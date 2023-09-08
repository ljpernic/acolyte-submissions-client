//////// DOES THINGS SELECTIVELY BASED ON THE PAGE STATE -- CONTEXT PASSED IN TO OTHER PAGES ////////

import axios from 'axios'
import '../axios'
import React, { useContext, useEffect, useReducer } from 'react'                // Imports functions from react.
import {                                                                        // Imports variables from the actions.js file.
  SET_LOADING,
  DELEGATE_SUCCESS,
  DELEGATE_ERROR,
  LOGOUT_READER,
  SET_READER,
  FETCH_SUBMISSIONS_SUCCESS,
  FETCH_SUBMISSIONS_ERROR,
  CREATE_SUBMISSION_SUCCESS,
  CREATE_SUBMISSION_ERROR,
  DELETE_SUBMISSION_ERROR,
  FETCH_SINGLE_SUBMISSION_SUCCESS,
  FETCH_SINGLE_SUBMISSION_ERROR,
  DOWNLOAD_SUBMISSION_SUCCESS,
  DOWNLOAD_SUBMISSION_ERROR,
  VERARBEITEN_SUBMISSION_SUCCESS,
  VERARBEITEN_SUBMISSION_ERROR,
} from './actions'
import reducer from './reducer'                                                // Imports reducer function from the reducer.js file.

const initialState = {                                                         // Sets initial state values of the app, with everything turned off 
  reader: null,                                                                //// and no one logged in.
  role: null,
  isLoading: false,
  submissions: [],
  showAlert: false,
  verarbeitenItem: null,
  downloadItem: null,
  singleSubmissionError: false,
  verarbeitenComplete: false,
}
const AppContext = React.createContext()                                      // Let's you create new context to overwrite the initial state.

const AppProvider = ({ children }) => {                                       // Umbrella function containing all of the other functions (delegate, login, etc)
  const [state, dispatch] = useReducer(reducer, initialState)

  const setLoading = () => {
    dispatch({ type: SET_LOADING })
  }

  // ADD READER //
  const delegate = async (readerInput) => {                                    // Establishes readerInput as data to be passed in,
    setLoading()
    try {
      const { data } = await axios.post(`api/v1/auth/delegate`, {                  //// set up to be what the reader posts through /auth/delegate. 
        ...readerInput,
      })
//      console.log(`client/src/context/appContext.js, data from delegate: ` + JSON.stringify(data))          // Shows what data is visible on the client side.
      dispatch({ type: DELEGATE_SUCCESS, payload: data.reader.name })    // If it works, it sets the name variable of the reader,
      localStorage.setItem(                                                 //// puts it in the local browser storage, and
        'reader',
        JSON.stringify({ name: data.reader.name, token: data.token })         //// stringifies it together with the token.
      )
      } catch (error) {                                                       //// Otherwise, it throws an error.
      dispatch({ type: DELEGATE_ERROR })
    }
  }

  // LOGIN
  const login = async (readerInput) => {                                      // Establishes readerInput as data to be passed in,
    setLoading()
    try {
//      console.log(`server-side login data, appContext:` + JSON.stringify(readerInput))
      const { data } = await axios.post(`api/v1/auth/login`, {                    //// set up to be what the reader posts through /auth/login.
        ...readerInput,
      })
//      console.log(`client/src/context/appContext.js, data from login: ` + JSON.stringify(data))          // Shows what data is visible on the client side.
      const loginPayload = [data.reader.name]                               // The reason role isn't working is because it isn't in the login data.
      dispatch({ type: DELEGATE_SUCCESS, payload: loginPayload })         // If it works, it sets the name variable of the reader, 
      localStorage.setItem(                                                 //// puts it in the local browser storage, and
        'reader',
        JSON.stringify({ name: data.reader.name, token: data.token }),         //// stringifies it together with the token.
        ) 
//        console.log(`context/AppContext.js, login, localStorage reader:` + JSON.stringify(data))
    } catch (error) {                                                       //// Otherwise, it throws an error.
      dispatch({ type: DELEGATE_ERROR })
    }
  }

  // LOGOUT
  const logout = () => {                                                    // Removes the reader data.
    localStorage.removeItem('reader')
    dispatch({ type: LOGOUT_READER })
  }

  // FETCH SUBMISSIONS
  const fetchSubmissionsClient = async () => {
    setLoading()
    try {
      const { data } = await axios.get(`api/v1/submissions`)
//      console.log(`context/appContext, fetchSubmissionsClient, Data.submissions:` + JSON.stringify(data.submissions))
      dispatch({ type: FETCH_SUBMISSIONS_SUCCESS, payload: data.submissions })
    } catch (error) {
      dispatch({ type: FETCH_SUBMISSIONS_ERROR })
      logout()
    }
  }

    // CREATE SUBMISSION
    const createSubmittedClient = async (submitterInput) => {
      setLoading()
      try {
        const { data } = await axios.post(`api/v1/submitted`, {
          ...submitterInput,
        })
//        console.log(`data.submissions from context/appContext.js` + JSON.stringify(data.submission))
        dispatch({ type: CREATE_SUBMISSION_SUCCESS, payload: data.submission })
      } catch (error) {
        dispatch({ type: CREATE_SUBMISSION_ERROR })
      }
    }
   
      // DELETE SUBMISSION //
  const deleteSubmissionClient = async (submissionId) => {
    setLoading()
    try {
      await axios.delete(`api/v1/submissions/${submissionId}`)
      fetchSubmissionsClient()
    } catch (error) {
      dispatch({ type: DELETE_SUBMISSION_ERROR })
    }
  }

  // TO DO: Figure out which functions are actually being used (are there two fetch submission functions?)
  // FETCH SUBMISSION //
  const fetchSingleSubmission = async (submissionId) => {
    setLoading()
    try {
      const { data } = await axios.get(`api/v1/submissions/${submissionId}`)
//      console.log(`context/appContext.js, fetchSingleSubmission: ` + JSON.stringify(data.submission))
      dispatch({ type: FETCH_SINGLE_SUBMISSION_SUCCESS, payload: data.submission })
    } catch (error) {
      dispatch({ type: FETCH_SINGLE_SUBMISSION_ERROR })
    }
  }

  // VERARBEITEN (PROCESS) SUBMISSION //
  const verarbeitenSubmissionClient = async (submissionId, readerInput) => {
    setLoading()
    try {
      const { data } = await axios.patch(`api/v1/submissions/${submissionId}`, {
        ...readerInput,
      })
      dispatch({ type: VERARBEITEN_SUBMISSION_SUCCESS, payload: data.submission })
    } catch (error) {
      dispatch({ type: VERARBEITEN_SUBMISSION_ERROR })
    }
  }

  useEffect(() => {
    const reader = localStorage.getItem('reader')
    if (reader) {
      const newReader = JSON.parse(reader)
      dispatch({ type: SET_READER, payload: newReader.name })
    }
  }, [])
  return (
    <AppContext.Provider
      value={{
        ...state,
        setLoading,
        delegate,
        login,
        logout,
        fetchSubmissionsClient,
        createSubmittedClient,
        deleteSubmissionClient,
        fetchSingleSubmission,
        verarbeitenSubmissionClient,
//        rejectSubmissionClient,
      }}
    >
      {children}
    </AppContext.Provider>
  )
}

// 
export const useGlobalContext = () => {
  return useContext(AppContext)
}

export { AppProvider }
