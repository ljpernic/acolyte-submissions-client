//////// COMPONENT 
//////// BOTTOM ROW OF DASHBOARD BUTTONS. PROVIDES NAVIGATION TO CONTROL THE DISPLAYED TYPE OF SUBMISSIONS ON THE DASHBOARD AND 
//////// ALLOWS CERTAIN USERS TO ACCESS ADDITIONAL OPTIONS. 

import styled from 'styled-components';
import { Link } from 'react-router-dom';
import useAuth from '../hooks/useAuth.js';
import React from 'react';

// BUTTONSBOTTOM IS A FUNCTIONAL COMPONENT, WHERE SETDASHBOARDTYPE IS PASSED IN AS A PROP TO UPDATE THE DASHBOARDTYPE IN THE 
// PARENT DASHBOARDALL COMPONENT.
const ButtonsBottom = ({ setDashboardType }) => {

  // USEAUTH HOOK EXTRACTS ISEIC TO CONTROL WHICH BUTTONS ARE SHOWN TO THE USER.
  const { isEIC } = useAuth();

  // FUNCTION CALLS SETDASHBOARDTYPE WITH THE SPECIFIED TYPE SO USERS CAN CHANGE DASHBOARDTYPE AND UPDATE DISPLAYED SUBMISSIONS LIST.
  const handleDashboardTypeChange = (type) => {
    setDashboardType(type);
  };

  // RENDERS BUTTONS. ADD-READER LINK AND RECOMMEND BUTTON DISPLAYED ONLY IF ISEIC IS TRUE. CLAIMED, PROCESSED, UNCLAIMED BUTTONS 
  // AVAILABLE TO ALL USERS, WITH EACH BUTTON SETTING A SPECIFIC DASHBOARDTYPE.
  return (
    <Wrapper>
      <div className='nav-center'>
        {(isEIC) && (
          <div>  
            <Link to='/add-reader' className='btn hero-btn'>
              Add reader
            </Link>
          </div>
        )}
        {(isEIC) && (
          <div>  
            <button className='btn hero-btn' onClick={() => {handleDashboardTypeChange("recommended")}}>
              Recommended
            </button>
          </div>
        )}
        <div>  
          <button className='btn hero-btn' onClick={() => {handleDashboardTypeChange("claimed")}}>
            Claimed
          </button>
        </div>
        <div>  
        <button className='btn hero-btn' onClick={() => {handleDashboardTypeChange("old")}}>
            Processed
          </button>
        </div>
        <div>  
            <button className='btn hero-btn' onClick={() => {handleDashboardTypeChange("unclaimed")}}>
              Unclaimed
            </button>
        </div>
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

export default ButtonsBottom;
