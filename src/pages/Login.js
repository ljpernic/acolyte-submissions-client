//////// THIS IS THE LOGIN PAGE. WHEN YOU CLICK "LOG IN" ON HOME.JS, IT BRINGS YOU HERE. ////////

import { useState } from 'react';
import styled from 'styled-components';
import { useGlobalContext } from '../context/appContext';
import { Redirect } from 'react-router-dom';
import FormRow from '../components/FormRow';
import florian from '../assets/FlorianBG_Acolyte_Logo_PNG_TINY.png';

function Login() {
  const [values, setValues] = useState({
    name: '',
    email: '',
    password: '',
    isMember: true,
  });

  const { reader, login, isLoading, showAlert } = useGlobalContext();

  const handleChange = (e) => {
    setValues({ ...values, [e.target.name]: e.target.value });
  };

  const onSubmit = (e) => {
    e.preventDefault();
    const { email, password, isMember } = values;

    if (isMember) {
      login({ email, password });
    } 
  };
  const readerArray = []
  return (
    <> 
      {Array.isArray(reader) ? readerArray.push(reader[0], reader[1]) && <Redirect to='/dashboard' /> : void(0)}
      <Wrapper className='page full-page'>
        <div className='container'>
          {showAlert && (
            <div className='alert alert-danger'>
              Whoopsie, there was an error. Please try again.
            </div>
          )}
          {/* Login Form */}
          <form className='form' onSubmit={onSubmit}>
            <img src={florian} alt='Acolyte Submission System' className='logo' />
            <h4>Login</h4>
            {/* name field */}
            {!values.isMember && (
              <FormRow
                type='name'
                name='name'
                value={values.name}
                handleChange={handleChange}
                label="Name"
              />
            )}

            {/* single form row */}
            <FormRow
              type='email'
              name='email'
              value={values.email}
              handleChange={handleChange}
              label="Email"
            />
            {/* end of single form row */}
            {/* single form row */}
            <FormRow
              type='password'
              name='password'
              value={values.password}
              handleChange={handleChange}
              label="Password"
            />
            {/* end of single form row */}
            <button
              type='submit'
              className='btn btn-block'
              disabled={isLoading}
            >
              {isLoading ? 'Fetching Reader...' : 'Submit'}
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

export default Login;
