//////// CONTEXT
//////// PASSES CONTEXT TO PAGES BASED ON PAGE STATE ////////

import axios from 'axios'
import '../axios'
import React, { useContext, useEffect, useReducer } from 'react'
import {                                                                        // IMPORTS GLOBAL VALUES SET IN ACTIONS.JS CONTEXT.
  SET_LOADING,
  DELEGATE_SUCCESS,
  DELEGATE_ERROR,
  LOGOUT_READER,
  LOGIN_READER_SUCCESS,
  LOGIN_READER_ERROR,
  PASSWORD_CHANGE_SUCCESS,
  PASSWORD_CHANGE_ERROR,
  FETCH_SUBMISSIONS_SUCCESS,
  FETCH_SUBMISSIONS_ERROR,
  CREATE_SUBMISSION_SUCCESS,
  CREATE_SUBMISSION_ERROR,
  DELETE_SUBMISSION_ERROR,
  FETCH_SINGLE_SUBMISSION_SUCCESS,
  FETCH_SINGLE_SUBMISSION_ERROR,
  VERARBEITEN_SUBMISSION_SUCCESS,
  VERARBEITEN_SUBMISSION_ERROR,
  UPDATE_READER_SUCCESS,
  UPDATE_READER_ERROR,
} from './actions'
import reducer from './reducer'                                                // IMPORTS REDUCERS.

const initialState = {                                                         // INITIAL VALUES OF FALSE, NULL, AND []
  reader: null,
  role: null,
  isLoading: false,
  submissions: [],
  showAlert: false,
  verarbeitenItem: null,
  downloadItem: null,
  singleSubmissionError: false,
  verarbeitenComplete: false,
}
const AppContext = React.createContext()                                      // ALLOWS CREATION OF APPCONTEXT.

const AppProvider = ({ children }) => {                                       // FUNCTION TO CARRY OUT INDIVIDUAL SUB-FUNCTIONS (FETCH SUBS, LOG IN, ETC).
  const [state, dispatch] = useReducer(reducer, initialState)

  const setLoading = () => {
    dispatch({ type: SET_LOADING })
  }

//
// ADD READER
//
//// NOTE: I THINK THE DELEGATE FUNCTION IS WRONG ***.
//// WHY IS IT SETTING THE READER IN THE LOCAL STORAGE? THAT SEEMS WRONG?
                                                                              // ADD NEW READER. //
  const delegate = async (readerInput) => {                                   // QUEUES UP READER INPUT FROM FORM.
    setLoading()
    try {
      const { data } = await axios.post(`api/v1/auth/delegate`, {             // POSTS INPUT FROM FORM TO /AUTH/DELEGATE.
        ...readerInput,
      })
      const delegatePayload = [data.reader.name]
      dispatch({ type: DELEGATE_SUCCESS, payload: delegatePayload })          // IF SUCCESSFUL, SETS NAME VARIABLE OF READER AS PAYLOAD.
      localStorage.setItem(                                                   // CREATES LOCALSTORAGE READER WITH READER NAME AND TOKEN. 
        'reader',
        JSON.stringify({ name: data.reader.name, token: data.token })
      )
      } catch (error) {
       dispatch({ type: DELEGATE_ERROR, payload: { error: 'Your error message here' } });
    }
  }

//
// CHANGE PASSWORD
//

const passwordChange = async ({ email, password, newPassword }) => {
  setLoading();
  try {
    const { data } = await axios.post(`api/v1/auth/change-password`, {
      email,
      password,
      newPassword,
    })
    const changePasswordPayload = [data.reader] 
    dispatch({ type: PASSWORD_CHANGE_SUCCESS, payload:changePasswordPayload })
  } catch (error) {
    console.error('Password change error:', error);
    dispatch({ type: PASSWORD_CHANGE_ERROR });
  }
};

//
// LOGIN
//

  const login = async (readerInput) => {
    setLoading()
    try {
      const { data } = await axios.post(`api/v1/auth/login`, {
        ...readerInput,
      })
      const loginPayload = [data.reader.name]  
      dispatch({ type: LOGIN_READER_SUCCESS, payload: loginPayload })
      localStorage.setItem( 
        'reader',
        JSON.stringify({ name: data.reader.name, readerId: data.reader.readerId, token: data.token }),
        )
      } catch (error) {
      dispatch({ type: LOGIN_READER_ERROR })
    }
  }

//
// LOGOUT
//

  const logout = () => {
    localStorage.removeItem('reader')
    dispatch({ type: LOGOUT_READER })
  }

//
// FETCH ALL SUBMISSIONS
//

  // FETCH SUBMISSIONS
  const fetchSubmissionsClient = async () => {
    setLoading()
    try {
      const { data } = await axios.get(`api/v1/submissions`)
      dispatch({ type: FETCH_SUBMISSIONS_SUCCESS, payload: data.submissions })
    } catch (error) {
      dispatch({ type: FETCH_SUBMISSIONS_ERROR })
      logout()
    }
  }

//
// CREATE SUBMITTED
//

    const createSubmittedClient = async (submitterInput) => {
      setLoading()
      try {
        const { data } = await axios.post(`api/v1/submitted`, {
          ...submitterInput,
        })
        dispatch({ type: CREATE_SUBMISSION_SUCCESS, payload: data.submission })
        return data.submission;
      } catch (error) {
        dispatch({ type: CREATE_SUBMISSION_ERROR })
      }
    }

//
// DELETE SUBMISSION
//

  const deleteSubmissionClient = async (submissionId) => {
    setLoading()
    try {
      await axios.delete(`api/v1/submissions/${submissionId}`)
      fetchSubmissionsClient()
    } catch (error) {
      dispatch({ type: DELETE_SUBMISSION_ERROR })
    }
  }

//
// FETCH SINGLE SUBMISSION
//
  
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

//
// UPDATE AND VERARBEITEN SUBMISSION
//

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

//
// CLAIM SUBMISSION
//

  const assignSubmissionClient = async (submissionId, reader) => {
    setLoading()
    try {
      // FIND CURRENT READER ID
      const { data } = await axios.patch(`api/v1/submissions/claim/${submissionId}`, {
        submissionId,
        reader,
      }, {
        headers: {
          'If-Modified-Since': new Date(0),  // Disable If-Modified-Since
          'If-None-Match': '*',      // Disable If-None-Match
          'Cache-Control': 'no-cache',
          Pragma: 'no-cache',
        },
      })
      dispatch({ type: UPDATE_READER_SUCCESS, payload: data.submission });
//      console.log('payload:' + JSON.stringify(data.submission))
    } catch (error) {
      console.error("Error updating submission:", error);
      dispatch({ type: UPDATE_READER_ERROR });
    }
  };

//
// UNCLAIM SUBMISSION
//

    const unAssignSubmissionClient = async (submissionId) => {
  setLoading();
    try {
      const { data } = await axios.patch(`api/v1/submissions/unclaim/${submissionId}`, {
        submissionId,
        reader: "unclaimed",  // Set the reader field to "unclaimed"
      }, {
        headers: {
          'If-Modified-Since': new Date(0),
          'If-None-Match': '*',
          'Cache-Control': 'no-cache',
          Pragma: 'no-cache',
        },
      });
      dispatch({ type: UPDATE_READER_SUCCESS, payload: data.submission });
    } catch (error) {
      console.error("Error updating submission:", error);
      dispatch({ type: UPDATE_READER_ERROR });
    }
  };

//
// USEEFFECT
//

  useEffect(() => {
    const reader = localStorage.getItem('reader')
    if (reader) {
      const newReader = JSON.parse(reader)
      dispatch({ type: LOGIN_READER_SUCCESS, payload: newReader.name })
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
        passwordChange,
        fetchSubmissionsClient,
        createSubmittedClient,
        deleteSubmissionClient,
        fetchSingleSubmission,
        verarbeitenSubmissionClient,
        assignSubmissionClient,
        unAssignSubmissionClient,
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
