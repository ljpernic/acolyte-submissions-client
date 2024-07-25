import { useState } from 'react';
import styled from 'styled-components';
import { useGlobalContext } from '../context/appContext';
import FormRow from '../components/FormRow';
import FormRowTextArea from '../components/FormRowTextArea';
import { useHistory } from 'react-router-dom';

function SubmissionFormFiction() {
  const history = useHistory();
  const [values, setValues] = useState({
    name: '',
    email: '',
    confirmEmail: '',
    title: '',
    type: 'fiction', // Fixed as 'fiction'
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
  
    // Logging for debugging
    //console.log('Change type:', type);
    //console.log('Current file:', values.file ? values.file.name : 'No file selected');
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

    //console.log('values: ' + JSON.stringify(values))
    const formData = new FormData();
    formData.append('name', values.name);
    formData.append('email', values.email);
    formData.append('title', values.title);
    formData.append('type', values.type); // 'fiction'
    formData.append('wordCount', values.wordCount);
    formData.append('coverLetter', values.coverLetter);
    
    if (values.file) {
      formData.append('file', values.file); // Only append file if it exists
    }
    
    // for (let [key, value] of formData.entries()) {
    //   console.log('values.file, onSubmit: ' + values.file)
    //   console.log(`${key}:`, value);
    // }

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
            label="Title"
          />
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
    max-width: 400px; // Added unit
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

export default SubmissionFormFiction;
