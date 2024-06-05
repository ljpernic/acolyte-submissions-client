//////// PAGE
//////// SUBMISSION FORM, GENERIC. IS IT STILL BEING USED? ////////

import { useState } from 'react';
import styled from 'styled-components';
import { useGlobalContext } from '../context/appContext';
import FormRow from '../components/FormRow';
import FormRowTextArea from '../components/FormRowTextArea';
import { useHistory } from 'react-router-dom';

function SubmissionForm() {
  const History = useHistory();
  const [values, setValues] = useState({
    name: '',
    email: '',
    title: '',
    type: '',
    wordCount: '',
    file: '',
    coverLetter: '',
  });

  const { createSubmittedClient, isLoading, showAlert } = useGlobalContext();
  const [errorMessage, setErrorMessage] = useState('');

  
  const handleChange = (e) => {
    setValues({ ...values, [e.target.name]: e.target.value });
  };

  // PUSHES SUBMISSIONS TO MONGODB, RENAMES FILES, AND PUSHES FILES TO GOOGLE DRIVE 
  const onSubmit = async (e) => {
    e.preventDefault();

    // LOCATION OF SUBMITTED FILE
    const submitFile = e.target.file.files[0]
    let submissionId;
    var submitTitle;
    var submitName;
    var typeLetter;

    // VALUES FROM THE SUBMITTED FORM
    const { name, email, title, type, wordCount, file, coverLetter } = values;

    createSubmittedClient({ name, email, title, type, wordCount, file, coverLetter })
    .then(submission => {
//      console.log('Submission Data:', submission);
      submissionId = submission._id;
      processSubmissionId(submissionId); // Pass submissionId to the processing function
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
      const submitMonth = String(submitDate.getMonth() + 1).padStart(2, '0');
      const submitDay = String(submitDate.getDate()).padStart(2, '0');
  
      console.log('submitMonth: ' + submitMonth)
      console.log('submitDay: ' + submitDay)

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
    console.log('submitMonth: ' + submitMonth)
    console.log('submitDay: ' + submitDay)
    console.log('newName: ' + newName)
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
        .then(History.push('/submitted'))
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
          <h3><strong>Kaleidocast NYC</strong></h3>
            <h4>Submission Form</h4>
            {/* name field */}
              <FormRow
                type='text'
                name='name'
                value={values.name}
                placeholder='What should we call you?'
                handleChange={handleChange}
              />
            {/* email field */}
            <FormRow
              type='email'
              name='email'
              value={values.email}
              placeholder='How can we reach you?'
              handleChange={handleChange}
            />
            {/* title field */}
            <FormRow
              type='text'
              name='title'
              value={values.title}
              placeholder="What's the title of your submission?"
              handleChange={handleChange}
            />
            {/* type field */}
            <div className='form-row'>
              {(
                <label htmlFor={values.name} className='form-label'>         {/* Makes sure the label is keyed to the name value. */}
                  Type                                              {/* Displays that name value dynamically. */}
                </label>
              )}
            <select name="type" onChange={handleChange} className='form-input'>
              <option value=""></option>
              <option value="fiction">Fiction</option>
              <option value="poetry">Poetry</option>
              <option value="non-fiction">Non-Fiction</option>
              <option value="art">Art</option>
            </select>
          </div>
            {/* word count field */}
            <FormRow
              type='number'
              name='wordCount'
              value={values.wordCount}
              placeholder='For fiction and non-fiction, how many words is your submission?'
              handleChange={handleChange}
            />
            {/* file field */}
            <FormRow
              type='file'
              name='file'
              value={values.file}
              accept='.doc,.docx,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document,.rtf, application/rtf, .odt'
              handleChange={handleChange}
            />
            {/* cover letter field */}
            <FormRowTextArea
              type='text'
              name='coverLetter'
              value={values.coverLetter}
              placeholder='Please tell us a little about yourself.'
              handleChange={handleChange}
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
`;

export default SubmissionForm;