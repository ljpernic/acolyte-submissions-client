//////// COMPONENT 
//////// BOTTOM ROW OF DASHBOARD BUTTONS

import styled from 'styled-components';
import { Link } from 'react-router-dom';
import useAuth from '../hooks/useAuth.js';

const ButtonsBottom = () => {

  const { isEIC } = useAuth();

  return (
    <Wrapper>
      <div className='nav-center'>
                                                                                    {/* ADD READER BUTTON */}
        {(isEIC) && <div>  
          <Link to='/delegate' className='btn hero-btn'>
              Add reader
            </Link>
        </div>}
                                                                                    {/* RECOMMENDED DASHBOARD BUTTON */}        
        {(isEIC) && <div>  
          <Link to='/dashboard-recommended' className='btn hero-btn'>
              Recommended
            </Link>
        </div>}
                                                                                    {/* CLAIMED DASHBOARD BUTTON */}
        <div>  
          <Link to='/dashboard-claimed' className='btn hero-btn'>
              Current Queue
            </Link>
        </div>
                                                                                    {/* PROCESSED DASHBOARD BUTTON */}
        <div>  
          <Link to='/dashboard-old' className='btn hero-btn'>
              Old Queue
            </Link>
        </div>
                                                                                    {/* UNCLAIMED DASHBOARD BUTTON */}
        <div>  
          <Link to='/dashboard-unclaimed' className='btn hero-btn'>
              Open Queue
            </Link>
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
