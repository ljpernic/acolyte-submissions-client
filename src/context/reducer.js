//////// Sets the state based on what action happens (if adding the reader is successful, if submissions are found, etc). ////////

import {
  DELEGATE_SUCCESS,
  DELEGATE_ERROR,
  SET_READER,
  LOGOUT_READER,
  SET_LOADING,
  FETCH_SUBMISSIONS_SUCCESS,
  FETCH_SUBMISSIONS_ERROR,
  CREATE_SUBMISSION_SUCCESS,
  CREATE_SUBMISSION_ERROR,
  DELETE_SUBMISSION_ERROR,
  FETCH_SINGLE_SUBMISSION_SUCCESS,
  FETCH_SINGLE_SUBMISSION_ERROR,
  DOWNLOAD_SUBMISSION_SUCCESS,
  DOWNLOAD_SUBMISSION_ERROR,
  VERARBEITEN_SUBMISSION_ERROR,
  VERARBEITEN_SUBMISSION_SUCCESS,
} from './actions'

const reducer = (state, action) => {
  if (action.type === SET_LOADING) {
    return { ...state, isLoading: true, showAlert: false, verarbeitenComplete: false }
  }

  // ADD READER REDUCER //
  if (action.type === DELEGATE_SUCCESS) {
    return {
      ...state,
      isLoading: false,
      reader: action.payload,
    }
  }
  if (action.type === DELEGATE_ERROR) {
    return {
      ...state,
      isLoading: false,
      reader: null,
      showAlert: true,
    }
  }

  // LOGIN AND LOGOUT REDUCER // 
  if (action.type === SET_READER) {
    return { ...state, reader: action.payload }
  }
  if (action.type === LOGOUT_READER) {
    return {
      ...state,
      reader: null,
      showAlert: false,
      submissions: [],
      isVerarbeitening: false,
      verarbeitenItem: null,
      downloadItem: null,
    }
  }

// FETCH SUBMISSIONS REDUCER // 
if (action.type === FETCH_SUBMISSIONS_SUCCESS) {
  return {
    ...state,
    isLoading: false,
    verarbeitenItem: null,
    singleSubmissionError: false,
    verarbeitenComplete: false,
    submissions: action.payload,
  }
}
if (action.type === FETCH_SUBMISSIONS_ERROR) {
  return { ...state, isLoading: false }
}

  // CREATE SUBMISSION REDUCER //
  if (action.type === CREATE_SUBMISSION_SUCCESS) {
    return {
      ...state,
      isLoading: false,
      submissions: [...state.submissions, action.payload],
    }
  }
  if (action.type === CREATE_SUBMISSION_ERROR) {
    return {
      ...state,
      isLoading: false,
      showAlert: true,
    }
  }

  // DELETE SUBMISSION REDUCER // 
  if (action.type === DELETE_SUBMISSION_ERROR) {
    return {
      ...state,
      isLoading: false,
      showAlert: true,
    }
  }

  // FETCH SINGLE SUBMISSION REDUCER //
  if (action.type === FETCH_SINGLE_SUBMISSION_SUCCESS) {
    return { ...state, isLoading: false, verarbeitenItem: action.payload }
  }
  if (action.type === FETCH_SINGLE_SUBMISSION_ERROR) {
    return { ...state, isLoading: false, verarbeitenItem: '', singleSubmissionError: true }
  }

  // DOWNLOAD SINGLE SUBMISSION REDUCER //
  if (action.type === DOWNLOAD_SUBMISSION_SUCCESS) {
//    console.log(`download reducer: ` + action.payload) 
    return { ...state, isLoading: false, downloadItem: action.payload }
  }
  if (action.type === DOWNLOAD_SUBMISSION_ERROR) {
    return { ...state, isLoading: false, downloadItem: '', singleSubmissionError: true }
  }

  // VERARBEITEN (PROCESS) SUBMISSION REDUCER // 
  if (action.type === VERARBEITEN_SUBMISSION_SUCCESS) {
    return {
      ...state,
      isLoading: false,
      verarbeitenComplete: true,
      verarbeitenItem: action.payload,
    }
  }
  if (action.type === VERARBEITEN_SUBMISSION_ERROR) {
    return {
      ...state,
      isLoading: false,
      verarbeitenComplete: true,
      showAlert: true,
    }
  }


  // ERROR WARNING //
  throw new Error(`no such action : ${action}`)
}

export default reducer
