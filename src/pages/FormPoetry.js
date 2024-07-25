//////// PAGE
//////// POETRY SUBMISSION FORM. ////////

import { useState } from 'react';
import styled from 'styled-components';
import { useGlobalContext } from '../context/appContext';
import FormRow from '../components/FormRow';
import FormRowTextArea from '../components/FormRowTextArea';
import { useHistory } from 'react-router-dom';

function SubmissionFormPoetry() {
  const history = useHistory();
  const [values, setValues] = useState({
    name: '',
    email: '',
    confirmEmail: '',
    title: '',
    type: 'poetry', // Fixed as 'poetry'
    wordCount: '',
    file: null, // Initialize as null
    coverLetter: '',
  });

  const { createSubmittedClient, isLoading, showAlert } = useGlobalContext();
  const [errorMessage, setErrorMessage] = useState('');
  
  const handleChange = (e) => {
    const { name, type, files, value } = e.target;

    if (type === 'file') {
      if (files && files.length > 0) {
        setValues(prevValues => ({
          ...prevValues,
          file: files[0] // Preserve the file object correctly
        }));
      }
    } else {
      setValues(prevValues => ({
        ...prevValues,
        [name]: value
      }));
    }
  };

  const renameFile = (file, name) => {
    return new File([file], name, { type: file.type });
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    
    if (values.email !== values.confirmEmail) {
      setErrorMessage("Email addresses don't match");
      return;
    }

    if (!values.file) {
      setErrorMessage("A file is required for submission.");
      return;
    }

    // Create a new file name
    const submitDate = new Date();
    const submitYear = submitDate.getFullYear();
    const submitMonth = String(submitDate.getMonth() + 1).padStart(2, '0');
    const submitDay = String(submitDate.getDate()).padStart(2, '0');
    const submitTitle = values.title.length <= 50 ? values.title : values.title.slice(0, 49);
    const submitName = values.name.length <= 50 ? values.name : values.name.slice(0, 49);
    const typeLetter = values.type === 'poetry' ? 'P' : 'UNK'; // Assuming 'UNK' for other types
    const newFileName = `${submitYear}-${submitMonth}-${submitDay} - ${typeLetter} - ${submitName} - ${submitTitle}${values.file.name.slice(values.file.name.lastIndexOf('.'))}`;

    // Rename the file
    const renamedFile = renameFile(values.file, newFileName);

    const formData = new FormData();
    formData.append('name', values.name);
    formData.append('email', values.email);
    formData.append('title', values.title);
    formData.append('type', values.type); // 'poetry'
    formData.append('wordCount', values.wordCount);
    formData.append('coverLetter', values.coverLetter);

    // Append the renamed file to FormData
    formData.append('file', renamedFile); // Use the renamed file

    try {
      await createSubmittedClient(formData); // Use FormData here
      history.push('/submitted'); // Redirect after successful submission
    } catch (error) {
      console.error('Error submitting data:', error);
      setErrorMessage('An error occurred while submitting the form.');
  }
};

return (
      <Wrapper className='page full-page'>
        <div className='container'>
{showAlert && (
  <div className='alert alert-danger'>
    {errorMessage || 'Submission failed. Please make sure your fields are filled out correctly and try again.'}
  </div>
)}
          <form className='form' onSubmit={onSubmit}>
          <h3><strong>Acolyte Submissions System</strong></h3>
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
            {/* file field */}
          <FormRow
            type='file'
            name='file'
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
          {/* submit button */}
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