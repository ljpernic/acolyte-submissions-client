//////// COMPONENT FOR THE NAVBAR VISIBLE FOR LOGGED-IN READER ////////

import React, { useState } from 'react';
import styled from 'styled-components';
import logo from '../assets/logo.svg';
import { FaUserCircle, FaCaretDown } from 'react-icons/fa';
import { useGlobalContext } from '../context/appContext';
import { Link } from 'react-router-dom';

const Navbar = () => {
  const { reader, logout } = useGlobalContext();                                      // Sets the reader and logout constants with useGlobalContext.
  const [showLogout, setShowLogout] = useState(false);                                // Sets showLogout based on useState.

  return (
    <Wrapper>
      <div className='nav-center'>
        <div>  
          <Link to={!reader ? '/' : '/dashboard'}>
            <img src={logo} alt='Acolyte banana system' />                            {/* Shows logo in the navbar. */}
          </Link>
        </div>
        {reader && (                                                                    // 
          <div className='btn-container'>                                             {/* inserts it into a button container, */}
            <button className='btn' onClick={() => setShowLogout(!showLogout)}>       {/* which, when clicked, shows the logout button. */}
              <FaUserCircle />                                                        {/* It includes a circle icon to indicate it's a user, */}
              {reader[0]}                                                                  {/* the reader name itself, and */}
              <FaCaretDown />                                                         {/* a down arrow to indicate that it can be clicked.*/}
            </button>
            <div className={showLogout ? 'dropdown show-dropdown' : 'dropdown'}>      {/* It also changes how it looks depending on if it has been clicked, */}
              <button onClick={() => logout()} className='dropdown-btn'>              {/* with the logout functionality triggering when it is clicked.*/}
                logout
              </button>
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
`;

export default Navbar;
