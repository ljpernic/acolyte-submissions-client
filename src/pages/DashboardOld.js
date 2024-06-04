//////// PAGE
//////// DASHBOARD SHOWING ALREADY PROCESSED STORIES. ////////

import { useEffect, useCallback } from 'react';
import styled from 'styled-components';
import { useGlobalContext } from '../context/appContext';
import Navbar from '../components/Navbar';
import ButtonsBottom from '../components/ButtonsBottom';
import SubmissionsCombined from '../components/SubmissionsCombined';

function DashboardOld() {
  const { showAlert, isLoading, fetchSubmissionsClient } = useGlobalContext();
  
  const fetchSubmissions = useCallback(() => {
    fetchSubmissionsClient();
  }, [fetchSubmissionsClient]);
  
  useEffect(() => {
    fetchSubmissions();
  }, [fetchSubmissions]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <Navbar />                              
      <Wrapper className='page'> 
        {showAlert && (
          <div className='alert alert-danger'>
            Something went wrong. Please try again. 
          </div>
        )}
        <SubmissionsCombined dashboardType="old" />
        {console.log("Old triggered.")}
      </Wrapper>
      <ButtonsBottom />
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

export default DashboardOld;
