//////// COMPONENT FOR THE EDITOR BUTTONS VISIBLE FOR LOGGED-IN READER ////////

import React, { useState } from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import useAuth from '../hooks/useAuth.js';

const BottomButtons = () => {

  const { isEIC } = useAuth();

  return (
    <Wrapper>
      <div className='nav-center'>
        {(isEIC) && <div>  
          <Link to='/delegate' className='btn hero-btn'>
              Add reader
            </Link>
        </div>}
      </div>
    </Wrapper>
  );
};

const Wrapper = styled.nav`
  height: 6rem;
  display: flex;
  justify-content: center;
  align-items: center;

  .nav-center {
    width: var(--fluid-width);
    max-width: var(--max-width);
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  .btn-container {
    position: relative;
  }
  .btn {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0 0.5rem;
    position: relative;
  }

  .dropdown {
    position: absolute;
    top: 40px;
    left: 0;
    width: 100%;
    background: var(--white);
    padding: 0.5rem;
    text-align: center;
    visibility: hidden;
    transition: var(--transition);
    border-radius: var(--borderRadius);
  }
  .show-dropdown {
    visibility: visible;
  }
  .dropdown-btn {
    background: transparent;
    border-color: transparent;
    color: var(--primary-500);
    letter-spacing: var(--letterSpacing);
    text-transform: capitalize;
    cursor: pointer;
  }
`;

export default BottomButtons;
