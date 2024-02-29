//////// CONTEXT
//////// SETS THE STATE BASED ON ACTIONS (IF SUCCESSFUL, IF ERROR, ETC //////// 

import {
  DELEGATE_SUCCESS,
  DELEGATE_ERROR,
  LOGIN_READER_SUCCESS,
  LOGIN_READER_ERROR,
  PASSWORD_CHANGE_SUCCESS,
  PASSWORD_CHANGE_ERROR,
  LOGOUT_READER,
  SET_LOADING,
  FETCH_SUBMISSIONS_SUCCESS,
  FETCH_SUBMISSIONS_ERROR,
  CREATE_SUBMISSION_SUCCESS,
  CREATE_SUBMISSION_ERROR,
  DELETE_SUBMISSION_ERROR,
  FETCH_SINGLE_SUBMISSION_SUCCESS,
  FETCH_SINGLE_SUBMISSION_ERROR,
  VERARBEITEN_SUBMISSION_ERROR,
  VERARBEITEN_SUBMISSION_SUCCESS,
  UPDATE_READER_SUCCESS,
  UPDATE_READER_ERROR,
} from './actions'

const reducer = (state, action) => {
  if (action.type === SET_LOADING) {
    return { ...state, isLoading: true, showAlert: false, verarbeitenComplete: false }
  }

  // DELEGATE REDUCER //
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
      errorMessage: action.payload ? action.payload.error : 'Unknown error occurred',
    }
  }

  // DELEGATE REDUCER //
  if (action.type === LOGIN_READER_SUCCESS) {
    return {
      ...state,
      isLoading: false,
      reader: action.payload,
    }
  }
  if (action.type === LOGIN_READER_ERROR) {
    return {
      ...state,
      isLoading: false,
      reader: null,
      showAlert: true,
    }
  }

  // CHANGE PASSWORD REDUCER //
  if (action.type === PASSWORD_CHANGE_SUCCESS) {
    return {
      ...state,
      isLoading: false,
      reader: action.payload,
    }
  }
  if (action.type === PASSWORD_CHANGE_ERROR) {
    return {
      ...state,
      isLoading: false,
      reader: null,
      showAlert: true,
    }
  }

  // LOGIN AND LOGOUT REDUCER // 
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

  // ASSIGN (CLAIM) SUBMISSION REDUCER // 
  if (action.type === UPDATE_READER_SUCCESS) {
    return {
      ...state,
      isLoading: false,
      verarbeitenComplete: true,
      verarbeitenItem: action.payload,
    }
  }
  if (action.type === UPDATE_READER_ERROR) {
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
