//////// PAGE
//////// FORM TO ADD READER (EIC ONLY). ////////

import { useState } from 'react';
import styled from 'styled-components';
import { useGlobalContext } from '../context/appContext.js';
import { Redirect } from 'react-router-dom';
import FormRow from '../components/FormRow.js';
import florian from '../assets/FlorianBG_Acolyte_Logo_PNG_TINY.png';
import useAuth from '../hooks/useAuth.js';

function AddReader() {
  const [values, setValues] = useState({
    name: '',
    email: '',
    password: '',
    role: '',
    changeLink: ['/add-reader', '/dashboard'],
    isMember: false,
  });

  const { isEIC } = useAuth();

  const { reader, addReader, login, isLoading, showAlert } = useGlobalContext();

  const handleChange = (e) => {
    setValues({ ...values, [e.target.name]: e.target.value });
  };
  const onSubmit = (e) => {
    e.preventDefault();
      if (isEIC === true){
        const { name, email, password, role, changeLink, isMember } = values;
        setValues({ ...values, changeLink: ['/dashboard', '/add-reader'] });
        if (isMember) {
          login({ email, password });
        } else {
          addReader({ name, email, password, role, changeLink });
        }
      } else {
        void(0)
      }
  };
  const readerArray = []

  return (
    <>
      {isEIC === false ? <Redirect to='/'></Redirect> : void(0)}
      {Array.isArray(reader) ? readerArray.push(reader[0], reader[1]) : void(0)}
      {reader && <Redirect to={values.changeLink[0]} />}
      <Wrapper className='page full-page'>
        <div className='container'>
          {showAlert && (
            <div className='alert alert-danger'>
              Error with the AddReader.js page. Please try again.
            </div>
          )}
          <form className='form' onSubmit={onSubmit}>
            <img src={florian} alt='Acolyte Submission System' className='logo' />
            <h4>{values.isMember ? 'Login' : 'Add Reader'}</h4>
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
            <div className='form-row'>
              {(
                <label htmlFor={values.name} className='form-label'>         {/* Makes sure the label is keyed to the name value. */}
                  <strong>Role</strong>                                              {/* Displays that name value dynamically. */}
                </label>
              )}
            <select name="role" onChange={handleChange} className='form-input'>
              <option value=""></option>
              <option value="associateEditor">Associate Editor</option>
              <option value="assistantEditor">Assistant Editor</option>
              <option value="EIC">Editor-in-Chief</option>
            </select>
          </div>
            {/* <FormRow
              type='role'
              name='role'
              value={values.role}
              handleChange={handleChange}
            /> */}
            {/* end of single form row */}
            <button
              type='submit'
              className='btn btn-block'
              disabled={isLoading}
            >
              {isLoading ? 'Adding Reader...' : 'Submit'}
            </button>
          </form>
        </div>
        {console.log("Add Reader triggered.")}
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

export default AddReader;
