//////// PAGE
//////// DASHBOARD SHOWING ALL SUBMISSIONS AND NAVIGATION AND CONTROLLING WHICH SUBMISSIONS ARE DISPLAYED. ////////

import { useMemo, useState, useEffect } from 'react';
import styled from 'styled-components';
import { useGlobalContext } from '../context/appContext';
import Navbar from '../components/Navbar';
import ButtonsBottom from '../components/ButtonsBottom';
import SubmissionsCombined from '../components/SubmissionsCombined';

// DASHBOARDTYPE IS A STATE VARIABLE THAT CONTROLS THE TYPE OF SUBMISSIONS SHOWN IN SUBMISSIONSCOMBINED. DEFAULT VALUE IS "CLAIMED."
// SETDASHBOARDTYPE IS A FUNCTION TO UPDATE DASHBOARDTYPE, TRIGGERED BY BUTTONSBOTTOM.
function DashboardAll() {
  const { showAlert, isLoading, fetchSubmissionsClient } = useGlobalContext();

  const storedDashboardType = localStorage.getItem('dashboardType') || 'claimed';
  const [dashboardType, setDashboardType] = useState(storedDashboardType);

  // USEMEMO CREATES A MEMOIZED FETCHSUBMISSIONS FUNCTION TO OPTIMIZE RE-RENDING. FETCHSUBMISSIONSCLIENT IS CALLED TO FETCH DATA 
  // USING THE API/DATABASE. [FETCHSUBMISSIONSCLIENT] IS A DEPENDENCY ARRAY THAT ENSURES THE MEMOIZED FUNCTION IS UPDATED ONLY WHEN 
  // FETCHSUBMISSIONSCLIENT CHANGES.
  const fetchSubmissions = useMemo(() => {
    return () => {
      fetchSubmissionsClient();
    };
  }, [fetchSubmissionsClient]);

  // USEEFFECT CALLS FETCHSUBMISSIONS WHEN THE COMPONENT MOUNTS, TRIGGERING AN INITIAL DATA FETCH. [FETCHSUBMISSIONS] IS A DEPENDENCY 
  // ARRAY THAT ENSURES FETCHSUBMISSIONS ONLY RUNS ON CHANGES. 
  useEffect(() => {
    fetchSubmissions();
  }, [fetchSubmissions]);

  // Update the dashboardType in localStorage when it changes
  useEffect(() => {
    localStorage.setItem('dashboardType', dashboardType);
  }, [dashboardType]);

  // CHECKS ISLOADING FROM APPCONTEXT TO SHOW A LOADING MESSAGE UNTIL DATA HAS BEEN FETCH AND RENDERED.
  if (isLoading) {
    return <div>Loading...</div>;
  }

  // RENDERS THE DASHBOARD. SUBMISSIONSCOMBINED DISPLAYS DIFFERENT SUBMISSION TYPES BASED ON DASHBOARDTYPE. 
  // BUTTONSBOTTOM ALLOWS USERS TO SWITCH DASHBOARDTYPE, PASSING SETDASHBOARDTYPE BASED ON USER CLICKS.
  return (
    <>
      <Navbar />
      <Wrapper className='page'>
        {showAlert && (
          <div className='alert alert-danger'>
            Something went wrong. Please try again. 
          </div>
        )}
        <SubmissionsCombined dashboardType={dashboardType} />     
        {console.log("Dashboard triggered: " + dashboardType)}
      </Wrapper>
      <ButtonsBottom setDashboardType={setDashboardType} />
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

export default DashboardAll;
