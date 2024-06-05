import axios from 'axios'
import '../axios'
import throttle from 'lodash/throttle'; 

import React, { useContext, useEffect, useReducer, useMemo, useCallback } from 'react'
import {                                                                        // IMPORTS GLOBAL VALUES SET IN ACTIONS.JS CONTEXT.
  SET_LOADING,
  ADD_READER_SUCCESS,
  ADD_READER_ERROR,
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

  useEffect(() => {
    const reader = localStorage.getItem('reader');
    if (reader) {
      const newReader = JSON.parse(reader);
      dispatch({ type: LOGIN_READER_SUCCESS, payload: newReader.name });
    }
  }, []);

  // SET LOADING
  const setLoading = useCallback(() => {
    dispatch({ type: SET_LOADING });
  }, []);

  // DEFINE THROTTLING
  const memoizedThrottledGet = useMemo(() => throttle(axios.get, 100), []);
  const memoizedThrottledPost = useMemo(() => throttle(axios.post, 100), []);
  const memoizedThrottledPatch = useMemo(() => throttle(axios.patch, 100), []);

  // ADD READER
  const addReader = useCallback(async (readerInput) => {
    setLoading()
    try {
      const { data } = await memoizedThrottledPost(`api/v1/auth/add-reader`, {
        ...readerInput,
      })
      const addReaderPayload = [data.reader.name]
      dispatch({ type: ADD_READER_SUCCESS, payload: addReaderPayload })
      localStorage.setItem(
        'reader',
        JSON.stringify({ name: data.reader.name, token: data.token })
      )
    } catch (error) {
      dispatch({ type: ADD_READER_ERROR, payload: { error: 'Your error message here' } });
    }
  }, [setLoading, memoizedThrottledPost]);

  // CHANGE PASSWORD
  const passwordChange = useCallback(async ({ email, password, newPassword }) => {
    setLoading();
    try {
      if (newPassword.length < 8) {
        throw new Error('New password must be at least 8 characters long.');
      }
      const { data } = await memoizedThrottledPost(`/api/v1/auth-pw/change-password`, {
        email,
        password,
        newPassword,
      });
      const passwordChangePayload = [data.reader];
      dispatch({ type: PASSWORD_CHANGE_SUCCESS, payload: passwordChangePayload });
    } catch (error) {
      const errorMessage = error.response?.data?.error || 'An error occurred while changing the password';
      dispatch({ type: PASSWORD_CHANGE_ERROR, payload: errorMessage });
      throw new Error(errorMessage);
    }
  }, [setLoading, memoizedThrottledPost]);

  // LOGIN
  const login = useCallback(async (readerInput) => {
    setLoading()
    try {
      const { data } = await memoizedThrottledPost(`api/v1/auth/login`, {
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
  }, [setLoading, memoizedThrottledPost]);

  // LOGOUT
  const logout = useCallback(() => {
    localStorage.removeItem('reader')
    dispatch({ type: LOGOUT_READER })
  }, []);

  // FETCH SUBMISSIONS
  const fetchSubmissionsClient = useCallback(() => {
    setLoading();
    try {
      memoizedThrottledGet(`/api/v1/submissions`).then(({ data }) => {
        dispatch({ type: FETCH_SUBMISSIONS_SUCCESS, payload: data.submissions });
      }).catch(error => {
        dispatch({ type: FETCH_SUBMISSIONS_ERROR });
      });
    } catch (error) {
      dispatch({ type: FETCH_SUBMISSIONS_ERROR });
    }
  }, [setLoading, memoizedThrottledGet]);

  // CREATE SUBMITTED
  const createSubmittedClient = useCallback(async (submitterInput) => {
    setLoading()
    try {
      const { data } = await memoizedThrottledPost(`api/v1/submitted`, {
        ...submitterInput,
      })
      dispatch({ type: CREATE_SUBMISSION_SUCCESS, payload: data.submission })
      return data.submission;
    } catch (error) {
      dispatch({ type: CREATE_SUBMISSION_ERROR })
    }
  }, [setLoading, memoizedThrottledPost]);

  // DELETE SUBMISSION 
  const deleteSubmissionClient = useCallback(async (submissionId) => {
    setLoading()
    try {
      await axios.delete(`api/v1/submissions/${submissionId}`)
      fetchSubmissionsClient()
    } catch (error) {
      dispatch({ type: DELETE_SUBMISSION_ERROR })
    }
  }, [fetchSubmissionsClient, setLoading]);

  // FETCH SINGLE SUBMISSION
  const fetchSingleSubmission = useCallback(async (submissionId) => {
    setLoading()
    try {
      const { data } = await memoizedThrottledGet(`api/v1/submissions/${submissionId}`)
      dispatch({ type: FETCH_SINGLE_SUBMISSION_SUCCESS, payload: data.submission })
    } catch (error) {
      dispatch({ type: FETCH_SINGLE_SUBMISSION_ERROR })
    }
  }, [setLoading, memoizedThrottledGet]);

  // UPDATE SUBMISSION
  const verarbeitenSubmissionClient = useCallback(async (submissionId, readerInput) => {
    setLoading()
    try {
      const { data } = await memoizedThrottledPatch(`api/v1/submissions/${submissionId}`, {
        ...readerInput,
      })
      dispatch({ type: VERARBEITEN_SUBMISSION_SUCCESS, payload: data.submission })
    } catch (error) {
      dispatch({ type: VERARBEITEN_SUBMISSION_ERROR })
    }
  }, [setLoading, memoizedThrottledPatch]);

  // CLAIM SUBMISSION
  const assignSubmissionClient = useCallback(async (submissionId, reader) => {
    setLoading();
    try {
      const { data } = await memoizedThrottledPatch(`api/v1/submissions/claim/${submissionId}`, {
        submissionId,
        reader,
      }, {
        headers: {
          'If-Modified-Since': new Date(0),
          'If-None-Match': '*',
          'Cache-Control': 'no-cache',
          Pragma: 'no-cache',
        },
      });
      dispatch({ type: UPDATE_READER_SUCCESS, payload: { submissionId, readerId: data.reader } });
    } catch (error) {
      console.error("Error updating submission:", error);
      dispatch({ type: UPDATE_READER_ERROR });
    }
  }, [setLoading, memoizedThrottledPatch]);

  // UNCLAIM SUBMISSION
  const unAssignSubmissionClient = useCallback(async (submissionId) => {
    setLoading();
    try {
      const { data } = await memoizedThrottledPatch(`api/v1/submissions/unclaim/${submissionId}`, {
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
  }, [setLoading, memoizedThrottledPatch]);

  const contextValue = useMemo(() => ({
    ...state,
    setLoading,
    addReader,
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
  }), [
    state,
    setLoading,
    addReader,
    login,
    logout,
    passwordChange,
    fetchSubmissionsClient,
    createSubmittedClient,
    deleteSubmissionClient,
    fetchSingleSubmission,
    verarbeitenSubmissionClient,
    assignSubmissionClient,
    unAssignSubmissionClient
  ]);

  return (
    <AppContext.Provider value={contextValue}>
      {children}
    </AppContext.Provider>
  )
}

export const useGlobalContext = () => {
  return useContext(AppContext)
}

export { AppProvider }
