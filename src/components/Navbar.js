//////// COMPONENT
//////// HEADER FOR LOGGED-IN READERS ////////

import React, { useState } from 'react';
import styled from 'styled-components';
import florian from '../assets/FlorianBG_Acolyte_Logo_PNG_TINY.png';
import { FaUserCircle, FaCaretDown } from 'react-icons/fa';
import { useGlobalContext } from '../context/appContext';
import { Link } from 'react-router-dom';
import useAuth from '../hooks/useAuth.js';

const Navbar = () => {
  const { reader, logout } = useGlobalContext();
  const [showMenu, setShowMenu] = useState(false);

  const { decodedName, topStatus } = useAuth();

  return (
    <Wrapper>
      <div className='nav-center'>
        <div>
          <Link to={!reader ? '/' : '/dashboard-claimed'}>
            <img 
              src={florian} 
              alt="Florian, mascot and logo of the Acolyte Submission System"
              style={{ width: '100%', height: 'auto', marginTop: '30px' }}
            />
          </Link> <br />
        </div>
        <div className='reader-header'>
          {topStatus}          
        </div>
        
        {reader && (    
          <div className='btn-container'>
            <button className='btn' onClick={() => setShowMenu(!showMenu)}>
              <FaUserCircle />
              {decodedName}
              <FaCaretDown />
            </button>
            {/* Menu with logout and change password options */}
            <div className={showMenu ? 'dropdown show-dropdown' : 'dropdown'}>
              <Link to="/change-password" className='dropdown-btn'>Change Password</Link> <br /><br />
              <button onClick={() => logout()} className='dropdown-btn'>Logout</button>
            </div>
          </div>
        )}
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
  .reader-header {
    font-size: 3em;
    color: var(--primary-700);
  }
`;

export default Navbar;
