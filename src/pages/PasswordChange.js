//////// THIS IS THE PASSWORD CHANGE PAGE. ////////

import { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useGlobalContext } from '../context/appContext';
import { Redirect } from 'react-router-dom';
import FormRow from '../components/FormRow';
import florian from '../assets/FlorianBG_Acolyte_Logo_PNG_TINY.png';

function PasswordChange() {
  const [values, setValues] = useState({
    name: '',
    email: '',
    password: '',
    newPassword: '',
    isMember: true,
  });

  const { reader, passwordChange, isLoading, showAlert } = useGlobalContext();
  const [isPasswordChanged, setIsPasswordChanged] = useState(false); // State to track password change success


  const handleChange = (e) => {
    setValues({ ...values, [e.target.name]: e.target.value });
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    const { email, password, newPassword } = values;
  
    // Call the changePassword function from your context or wherever you handle API calls
    try {
      await passwordChange({ email, password, newPassword });
      setIsPasswordChanged(true); // Set the state to true upon successful password change
    } catch (error) {
      console.error('Password change error:', error);
    }
  };

  // Redirect if password change was successful
  if (isPasswordChanged) {
    return <Redirect to="/change-password-success" />;
  }

  const readerArray = []
  return (
    <> 
      {Array.isArray(reader) ? readerArray.push(reader[0], reader[1]) && <Redirect to='/dashboard-claimed' /> : void(0)}
      <Wrapper className='page full-page'>
        <div className='container'>
          {showAlert && (
            <div className='alert alert-danger'>
              Whoopsie, there was an error. Please try again.
            </div>
          )}

          {/* Password Change Form */}
          <form className='form' onSubmit={onSubmit}>
            <img src={florian} alt='Acolyte Submission System' className='logo' />
            <h4>Password Change</h4>
            <span>
              {values.name}
            </span>
            {/* Email */}
            <FormRow
              type='email'
              name='email'
              value={values.email}
              handleChange={handleChange}
            />

            {/* Password */}
            <FormRow
              type='password'
              name='password'
              value={values.password}
              handleChange={handleChange}
            />

            {/* New Password Field */}
            <FormRow
              type='password'
              name='newPassword'
              value={values.newPassword}
              handleChange={handleChange}
            />

            <button
              type='submit'
              className='btn btn-block'
              disabled={isLoading}
            >
              {isLoading ? 'Changing Password...' : 'Change Password'}
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

export default PasswordChange;
