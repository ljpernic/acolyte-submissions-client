//////// THIS IS THE FORM PAGE. WHEN YOU NAVIGATE TO THE PUBLIC FORM, THIS IS WHAT YOU SEE. ////////

import { useState } from 'react';
import styled from 'styled-components';
import { useGlobalContext } from '../context/appContext';
import FormRow from '../components/FormRow';
import logo from '../assets/logo.svg';
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
  
  const handleChange = (e) => {
    setValues({ ...values, [e.target.name]: e.target.value });
  };

  // PUSHES SUBMISSIONS TO MONGODB, RENAMES FILES, AND PUSHES FILES TO GOOGLE DRIVE 
  const onSubmit = (e) => {
    e.preventDefault();

    // LOCATION OF SUBMITTED FILE
    const submitFile = e.target.file.files[0]
    var submitTitle;

    // VALUES FROM THE SUBMITTED FORM
    const { name, email, title, type, wordCount, file, coverLetter } = values;

    // DATE OF SUBMISSION FOR NEW FILE NAME
    const submitDate = new Date();
    const submitYear = submitDate.getFullYear();
    const submitMonth = submitDate.getMonth() + 1;
    const submitDay = submitDate.getDate();

    // CUTS THE FILE NAME TO A MAX OF 25 CHAR 
     if (values.title.length <= 25) 
      {
        submitTitle = values.title;
      } 
     else 
      {
        submitTitle = values.title.slice(0, 25);
       }

    // RENAMES THE FILE
    const newName = submitYear + '-' + submitMonth + '-' + submitDay + '_' + submitTitle;
    const renamedFile = new File([submitFile], newName, {type:submitFile.type})

    // PREPARES THE FILE FOR UPLOADING TO GOOGLE DRIVE
    var fileReader = new FileReader()                 // Sets up conversion of file to Base64 
    fileReader.readAsDataURL(renamedFile)             // Start conversion
    fileReader.onload = function (e) {                // Finishes conversion
      var rawLog = fileReader.result.split(',')[1];   // Pulls out file data
      var dataSend = { dataReq: { data: rawLog, name: renamedFile.name, email: values.email, type: renamedFile.type }, fname: "uploadFilesToGoogleDrive" };  // Prepares file to send to API
      fetch('https://script.google.com/macros/s/AKfycbztsfxR4O0TaqonWsKax5Mqwunm-s2wYg7iKdLnKYUhlbif1IvApqq_7jZvTJsg0v3g/exec',         // Gets google drive folder
        { method: "POST", body: JSON.stringify(dataSend) })                                                                             // Sends to API
        .then(createSubmittedClient({ name, email, title, type, wordCount, file, coverLetter }))         // Creates object to push to MongoDB
        .then(History.push('/submitted'))                                                                 // Pushes to MongoDB
        .then(res => res.json()).then((a) => {                                                            // Gives header response
//          console.log(a) //See response
        }).catch(e => console.log(e)) // Or Error in console
      }
  };

return (
    <> 
      <Wrapper className='page full-page'>
        <div className='container'>
          {showAlert && (
            <div className='alert alert-danger'>
              Whoopsie, there was an error. Please try again.
            </div>
          )}
          <form className='form' onSubmit={onSubmit}>
            <img src={logo} alt='Acolyte Submission System' className='logo' />
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
            <FormRow
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
