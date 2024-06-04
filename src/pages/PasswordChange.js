import { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useGlobalContext } from '../context/appContext';
import { Redirect } from 'react-router-dom';
import FormRow from '../components/FormRow';
import florian from '../assets/FlorianBG_Acolyte_Logo_PNG_TINY.png';
import useAuth from '../hooks/useAuth.js';

function PasswordChange() {
  const { passwordChange, isLoading, showAlert, alertText } = useGlobalContext();
  const [isPasswordChanged, setIsPasswordChanged] = useState(false);
  const { isEIC, isAssistant, isAssociate } = useAuth();
  const [values, setValues] = useState({
    email: '',
    password: '',
    newPassword: '',
  });
  const [error, setError] = useState('');

  // Track the mounted state of the component
  const [isMounted, setIsMounted] = useState(true);

  useEffect(() => {
    // Set isMounted to true when the component is mounted
    setIsMounted(true);

    // Cleanup function to set isMounted to false when the component unmounts
    return () => {
      setIsMounted(false);
    };
  }, []);

  const handleChange = (e) => {
    setValues({ ...values, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');  // Reset the error state
    if (!values.email || !values.password || !values.newPassword) {
      setError('All fields are required');
      return;
    }

    if (isEIC || isAssistant || isAssociate) {
      const { email, password, newPassword } = values;
      try {
        await passwordChange({ email, password, newPassword });
        if (isMounted) {
          setIsPasswordChanged(true);
        }
      } catch (error) {
        if (isMounted) {
          setError(error.message); // Set the error message from the catch block
        }
      }
    } else {
      setError('You do not have the appropriate role to change the password');
    }
  };

  if (isPasswordChanged) {
    return <Redirect to="/change-password-success" />;
  }

  return (
    <Wrapper className='page full-page'>
      <div className='container'>
        {showAlert && (
          <div className='alert alert-danger'>
            {alertText}
          </div>
        )}
        {error && (
          <div className='alert alert-danger'>
            {error}
          </div>
        )}

        {/* Password Change Form */}
        <form className='form' onSubmit={handleSubmit}>
          <img src={florian} alt='Acolyte Submission System' className='logo' />
          <h4>Password Change</h4>
          {/* Email */}
          <FormRow
            type='email'
            name='email'
            value={values.email}
            handleChange={handleChange}
            label="Email"
          />

          {/* Password */}
          <FormRow
            type='password'
            name='password'
            value={values.password}
            handleChange={handleChange}
            label="Password"
          />

          {/* New Password Field */}
          <FormRow
            type='password'
            name='newPassword'
            value={values.newPassword}
            handleChange={handleChange}
            label="New Password"
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
    max-width: 400px;
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
