//////// PAGE
//////// FICTION SUBMISSION FORM. ////////

import { useState } from 'react';
import styled from 'styled-components';
import { useGlobalContext } from '../context/appContext';
import FormRow from '../components/FormRow';
import FormRowTextArea from '../components/FormRowTextArea';
import { useHistory } from 'react-router-dom';

function SubmissionFormFiction() {
  const History = useHistory();
  const [values, setValues] = useState({
    name: '',
    email: '',
    confirmEmail: '',
    title: '',
    type: 'fiction',
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
    const newName = submitYear + '-' + submitMonth + '-' + submitDay + ' - ' + typeLetter + ' - ' +  submitName + ' - ' + submitTitle;
    console.log('newName: ' + newName)
    const renamedFile = new File([submitFile], newName, { type: submitFile.type });
  
    console.log('renamedFile: ' + renamedFile)

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
        .then(response => {
          // Log the entire response object to the console
          console.log(response);
        })
        .catch(error => console.error('Error uploading file:', error));
    };
  }
};

//// For server-side uploading of the file, this code sends the file to the server.
////
// const formData = new FormData();
// formData.append('file', renamedFile);
// formData.append('email', values.email);

// try {
//   const response = await fetch('http://localhost:5000/api/v1/submitted/upload', {
//     method: 'POST',
//     body: formData,
//   });

//   if (response.ok) {
//     const data = await response.json();
//     console.log('File uploaded successfully:', data);
//   } else {
//     console.error('Failed to upload file:', response.statusText);
//     setErrorMessage('Failed to upload file. Please try again.');
//   }
// } catch (error) {
//   console.error('Error uploading file:', error);
//   setErrorMessage('An error occurred while uploading the file. Please try again.');
// }
// };


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
            <h4>Fiction Submission</h4>
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
              label="title"
            />
            {/* type field */}
            <div className='form-row'>
              {(
                <label htmlFor={values.name} className='form-label'>         {/* Makes sure the label is keyed to the name value. */}
                  <strong>Type</strong>                                              {/* Displays that name value dynamically. */}
                </label>
              )}
            <div name="type" onChange={handleChange} className='form-input one-option' value={values.type || ''}>
              <span value="fiction">Fiction</span>
            </div>
          </div>
            {/* word count field */}
            <FormRow
              type='number'
              name='wordCount'
              value={values.wordCount}
              placeholder='How many words is your submission?'
              handleChange={handleChange}
              label="Word Count"
            />
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
              {isLoading ? 'Submitting...' : 'Submit'}
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

  h3 {
    text-align: center;
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

export default SubmissionFormFiction;