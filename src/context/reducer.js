import {
  ADD_READER_SUCCESS,
  ADD_READER_ERROR,
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
  SET_CURRENT_PAGE,
} from './actions';

const reducer = (state, action) => {
  switch (action.type) {
    case SET_LOADING:
      return { 
        ...state, 
        isLoading: true
      };

    case ADD_READER_SUCCESS:
      return {
        ...state,
        showAlert: false,
        reader: action.payload,
      };

    case ADD_READER_ERROR:
      return {
        ...state,
        isLoading: false,
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
        isLoading: false,                 // Without this, the login page hangs on "Fetching Reader..."
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
      return { 
        ...state, 
        isLoading: false 
      };

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
      return { 
        ...state, 
        verarbeitenComplete: false,
        verarbeitenItem: action.payload, 
      };

    case FETCH_SINGLE_SUBMISSION_ERROR:
      return { 
        ...state, 
        isLoading: false, 
        verarbeitenComplete: false,
        verarbeitenItem: '', 
        singleSubmissionError: true 
      };

    case VERARBEITEN_SUBMISSION_SUCCESS:
      return {
        ...state,
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
        const { submissionId, readerId } = action.payload;
        const updatedSubmissions = state.submissions.map(submission => {
          if (submission._id === submissionId) {
            return {
              ...submission,
              reader: readerId,  // Update the reader field
              claimed: readerId !== "Unclaimed",  // Mark it as claimed
            };
          }
          return submission;
        });
        return {
          ...state,
          submissions: updatedSubmissions,
          isLoading: false,
          verarbeitenComplete: true,
        };
      case UPDATE_READER_ERROR:
        return {
          ...state,
          isLoading: false,
          verarbeitenComplete: true,
          showAlert: true,
        };
      case SET_CURRENT_PAGE:
      return { 
        ...state, 
        currentPage: action.payload 
      };

    default:
      return state;
  }
};

export default reducer;
