//////// PAGE
//////// POETRY SUBMISSION FORM. ////////

import { useState } from 'react';
import styled from 'styled-components';
import { useGlobalContext } from '../context/appContext';
import FormRow from '../components/FormRow';
import FormRowTextArea from '../components/FormRowTextArea';
import { useHistory } from 'react-router-dom';

function SubmissionFormPoetry() {
  const History = useHistory();
  const [values, setValues] = useState({
    name: '',
    email: '',
    confirmEmail: '',
    title: '',
    type: 'poetry',
    wordCount: '',
    file: '',
    coverLetter: '',
  });

  const { createSubmittedClient, isLoading, showAlert } = useGlobalContext();
  const [errorMessage, setErrorMessage] = useState('');

  
  const handleChange = (e) => {
    setValues({ ...values, [e.target.name]: e.target.value });
//    console.log('handleChange values:' + JSON.stringify(values))
  };

  // PUSHES SUBMISSIONS TO MONGODB, RENAMES FILES, AND PUSHES FILES TO GOOGLE DRIVE 
  const onSubmit = async (e) => {
    e.preventDefault();
    
    if (values.email !== values.confirmEmail) {
      setErrorMessage("Email addresses don't match");
      return;
    }

    // LOCATION OF SUBMITTED FILE
    const submitFile = e.target.file.files[0]
    let submissionId;
    var submitTitle;
    var submitName;
    var typeLetter;

    // VALUES FROM THE SUBMITTED FORM
    const { name, email, title, type, wordCount, file, coverLetter } = values;
//    console.log('const {name...} values:' + JSON.stringify(values))

    createSubmittedClient({ name, email, title, type, wordCount, file, coverLetter })
    .then(submission => {
//      console.log('.then(submission...):', submission);
      submissionId = submission._id;
//      console.log('submissionId:' + submissionId)
      processSubmissionId(submissionId); // Pass submissionId to the processing function
    })
    .then(() => {
      // Redirect after all asynchronous operations are complete
      History.push('/submitted');
    })
    .catch(error => {
      // Handle validation errors
      if (error.status === 400 && error.data && error.data.errors) {
        setErrorMessage(error.data.errors.join(', '));
      } else {
        // Handle other errors
        console.error('Error submitting data:', error);
      }
    });
  
  // Function to process submissionId
  function processSubmissionId(submissionId) {
//    console.log('submissionId, inside processSubmissionId:', submissionId);
    

    // DATE OF SUBMISSION FOR NEW FILE NAME
      const submitDate = new Date();
      const submitYear = submitDate.getFullYear();
      const submitMonth = submitDate.getMonth() + 1;
      const submitDay = submitDate.getDate();
    
    // CUTS THE FILE NAME TO A MAX OF 50 CHAR 
    if (values.title.length <= 50) 
    {
      submitTitle = values.title;
    } 
      else 
      {
        submitTitle = values.title.slice(0, 49);
      }

  if (values.name.length <= 50) 
    {
      submitName = values.name;
    } 
      else 
      {
        submitName = values.name.slice(0, 49);
      }

if (values.type === 'fiction') {
  typeLetter = 'F';
} else if (values.type === 'poetry') {
  typeLetter = 'P';
} else if (values.type === 'non-fiction') {
  typeLetter = 'N';
} else {
  typeLetter = 'UNK';
}

    // RENAMES THE FILE
    const newName = typeLetter + ' - ' + submitYear + '-' + submitMonth + '-' + submitDay + ' - ' +  submitName + ' - ' + submitTitle;
    const renamedFile = new File([submitFile], newName, { type: submitFile.type });
  
    // PREPARES THE FILE FOR UPLOADING TO GOOGLE DRIVE
    var fileReader = new FileReader();
    fileReader.readAsDataURL(renamedFile);
    fileReader.onload = function (e) {
      var rawLog = fileReader.result.split(',')[1];
      var dataSend = { dataReq: { data: rawLog, name: renamedFile.name, email: values.email, type: renamedFile.type }, fname: "uploadFilesToGoogleDrive" };
  
      fetch('https://script.google.com/macros/s/AKfycbztsfxR4O0TaqonWsKax5Mqwunm-s2wYg7iKdLnKYUhlbif1IvApqq_7jZvTJsg0v3g/exec',
        {
          redirect: "follow",
          method: "POST",
          mode: "no-cors",
          body: JSON.stringify(dataSend),
          headers: {
            "Content-Type": "text/plain;charset=utf-8",
          },
        })
        .then(response => response.json())
        .then(res => res.json())
        .then((a) => {
          // Further processing or logging if needed
        })
        .catch(e => console.log(e));
    };
  }
};

return (
    <> 
      <Wrapper className='page full-page'>
        <div className='container'>
{showAlert && (
  <div className='alert alert-danger'>
    {errorMessage || 'Submission failed. Please make sure your fields are filled out correctly and try again.'}
  </div>
)}
          <form className='form' onSubmit={onSubmit}>
          <h3><strong>Kaleidocast</strong></h3>
            <h4>Poetry Submission</h4>
            {/* name field */}
              <FormRow
                type='text'
                name='name'
                value={values.name}
                placeholder='What should we call you?'
                handleChange={handleChange}
                label="Name"                
              />
            {/* email field */}
            <FormRow
              type='email'
              name='email'
              value={values.email}
              placeholder='How can we reach you?'
              handleChange={handleChange}
              label="Email"
            />
            <FormRow
              type='email'
              name='confirmEmail'
              value={values.confirmEmail}
              placeholder='Confirm your email.'
              handleChange={handleChange}
              label="Confirm Email"              
            />
            {/* title field */}
            <FormRow
              type='text'
              name='title'
              value={values.title}
              placeholder="What's the title of your submission?"
              handleChange={handleChange}
              label="Title"              
            />
            {/* type field */}
            <div className='form-row'>
              {(
                <label htmlFor={values.name} className='form-label'>         {/* Makes sure the label is keyed to the name value. */}
                  <strong>Type</strong>                                              {/* Displays that name value dynamically. */}
                </label>
              )}
            <div name="type" onChange={handleChange} className='form-input one-option' value={values.type || ''}>
              <span value="poetry">Poetry</span>
            </div>
          </div>
            {/* file field */}
            <FormRow
              type='file'
              name='file'
              value={values.file}
              accept='.doc,.docx,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document,.rtf, application/rtf, .odt'
              handleChange={handleChange}
              label="File"
            />
            {/* cover letter field */}
            <FormRowTextArea
              type='text'
              name='coverLetter'
              value={values.coverLetter}
              placeholder='Please tell us a little about yourself.'
              handleChange={handleChange}
              label="Cover Letter"
            />
            {/* end of single form row */}
            <button
              type='submit'
              className='btn btn-block'
              disabled={isLoading}
            >
              {isLoading ? 'Fetching Submission...' : 'Submit'}
            </button>
          </form>
        </div>
      </Wrapper>
    </>
  );
}

const Wrapper = styled.section`
  display: grid;
  align-items: center;
  .logo {
    display: block;
    margin: 0 auto;
    margin-bottom: 1.38rem;
  }
  .form {
    max-width: 400;
    border-top: 5px solid var(--primary-500);
  }

  h4 {
    text-align: center;
  }
  p {
    margin: 0;
    margin-top: 1rem;
    text-align: center;
  }
  .btn {
    margin-top: 1rem;
  }
  .member-btn {
    background: transparent;
    border: transparent;
    color: var(--primary-500);
    cursor: pointer;
  }
  .one-option {
    display: inline-block;
    padding: 8px 12px;
    border: none;
    background-color: transparent;  }
`;

export default SubmissionFormPoetry;