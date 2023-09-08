//////// THIS IS THE DASHBOARD AFTER LOGGING IN. ////////

import { useEffect } from 'react';
import styled from 'styled-components';
import { useGlobalContext } from '../context/appContext';
import Navbar from '../components/Navbar';
import Submissions from '../components/Submissions';

function Dashboard() {
  const { showAlert, fetchSubmissionsClient } = useGlobalContext();

  useEffect(() => {
    fetchSubmissionsClient();
  }, []);
  return (
    <>
      <Navbar />                                                                {/* Inserts the navbar on the top of the dashboard*/}                                  
      <Wrapper className='page'>                                                {/* Wraps the form fields so that they're styled with 'page' */}
        {showAlert && (
          <div className='alert alert-danger'>
            Something went wrong. Please try again. 
          </div>
        )}
        <Submissions />
      </Wrapper>
    </>
  );
}

const Wrapper = styled.section`
  padding: 2rem 0;

  .submission-form {
    background: var(--white);
    display: grid;
    row-gap: 1rem;
    column-gap: 0.5rem;
    align-items: center;
    margin-bottom: 3rem;
    border-radius: var(--borderRadius);
    padding: 1.5rem;
    .form-input {
      padding: 0.75rem;
    }

    .form-input:focus {
      outline: 1px solid var(--primary-500);
    }
    .form-row {
      margin-bottom: 0;
    }
    .btn {
      padding: 0.75rem;
    }
    @media (min-width: 776px) {
      grid-template-columns: 1fr 1fr auto;
      .btn {
        height: 100%;
        padding: 0 2rem;
      }
      column-gap: 2rem;
    }
  }
  .alert {
    max-width: var(--max-width);
    margin-bottom: 1rem;
  }
`;

export default Dashboard;
