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
} from './actions';

const reducer = (state, action) => {
  switch (action.type) {
    case SET_LOADING:
      return { 
        ...state, 
        isLoading: true
      };

    case DELEGATE_SUCCESS:
      return {
        ...state,
        showAlert: false,
        reader: action.payload,
      };

    case DELEGATE_ERROR:
      return {
        ...state,
        reader: null,
        showAlert: true,
        errorMessage: action.payload?.error || 'Unknown error occurred',
      };

    case LOGIN_READER_SUCCESS:
      return {
        ...state,
        showAlert: false,
        reader: action.payload,
      };

    case LOGIN_READER_ERROR:
      return {
        ...state,
        reader: null,
        showAlert: true,
      };

    case PASSWORD_CHANGE_SUCCESS:
      return {
        ...state,
        isLoading: false,
        showAlert: false,
        reader: action.payload,
      };

    case PASSWORD_CHANGE_ERROR:
      return {
        ...state,
        isLoading: false,
        showAlert: true,
        alertText: action.payload,  // Store the error message
      };

    case LOGOUT_READER:
      return {
        ...state,
        reader: null,
        showAlert: false,
        submissions: [],
        isVerarbeitening: false,
        verarbeitenItem: null,
        downloadItem: null,
      };

    case FETCH_SUBMISSIONS_SUCCESS:
      return {
        ...state,
        isLoading: false,
        verarbeitenItem: null,
        singleSubmissionError: false,
        showAlert: false,
        submissions: action.payload,
      };

    case FETCH_SUBMISSIONS_ERROR:
      return { ...state, isLoading: false };

    case CREATE_SUBMISSION_SUCCESS:
      return {
        ...state,
        isLoading: false,
        submissions: [...state.submissions, action.payload],
      };

    case CREATE_SUBMISSION_ERROR:
      return {
        ...state,
        isLoading: false,
        showAlert: true,
      };

    case DELETE_SUBMISSION_ERROR:
      return {
        ...state,
        isLoading: false,
        showAlert: true,
      };

    case FETCH_SINGLE_SUBMISSION_SUCCESS:
      return { ...state, isLoading: false, verarbeitenItem: action.payload };

    case FETCH_SINGLE_SUBMISSION_ERROR:
      return { ...state, isLoading: false, verarbeitenItem: '', singleSubmissionError: true };

    case VERARBEITEN_SUBMISSION_SUCCESS:
      return {
        ...state,
        isLoading: false,
        verarbeitenComplete: true,
        verarbeitenItem: action.payload,
      };

    case VERARBEITEN_SUBMISSION_ERROR:
      return {
        ...state,
        isLoading: false,
        verarbeitenComplete: true,
        showAlert: true,
      };

    case UPDATE_READER_SUCCESS:
      return {
        ...state,
        isLoading: false,
        verarbeitenComplete: true,
        verarbeitenItem: action.payload,
      };

    case UPDATE_READER_ERROR:
      return {
        ...state,
        isLoading: false,
        verarbeitenComplete: true,
        showAlert: true,
      };

    default:
      return state;
  }
};

export default reducer;
