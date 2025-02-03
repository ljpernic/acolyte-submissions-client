//////// COMPONENT
//////// SUBMISSIONSCOMBINED COMPONENT DISPLAYS A PAGINATED LIST OF SUBMISSIONS BASED ON A SELECTED DASHBOARDTYPE. 
//////// IT INCLUDES LOGIC TO FILTER SUBMISSIONS, HANDLE PAGINATION, NAVIGATE SUBMISSIONS, AND ASSIGN SUBMISSIONS.

import React, { useState, useMemo, useCallback, useRef, useEffect } from 'react';
import { useHistory } from 'react-router-dom';                                            // USED TO NAVIGATE TO DIFFERENT ROUTES
import styled from 'styled-components';
import moment from 'moment';                                                              // HANDLES DATE FORMATTING
import SubmissionColumns from './SubmissionColumns';
import { useGlobalContext } from '../context/appContext';
import debounce from 'lodash.debounce';                                                   // DEBOUNCES FUNCTION SO ACTIONS AREN'T TRIGGERED TOO MUCH.

// RECEIVES DASHBOARDTYPE AS A PROP FROM PARENT COMPONENT, WHICH DETERMINES THE TYPE OF SUBMISSIONS TO DISPLAY.
const SubmissionsCombined = ({ dashboardType }) => {
  const history = useHistory();
  const { submissions, isLoading, assignSubmissionClient } = useGlobalContext();          // PULLS LIST OF ALL SUBMISSIONS FROM GLOBAL CONTEXT.
  const [claimedSubmissions, setClaimedSubmissions] = useState(new Set());                // TRACKS SUBMISSIONS ALREADY CLAIMED BY USER IN SESSION.
  const itemsPerPage = 10;
  const isMounted = useRef(true);                                                         // CHECKS IF COMPONENT IS MOUNTED TO AVOID RE-RENDERS.

  const [currentPage, setCurrentPage] = useState(() => {
    // Retrieve the page number from localStorage, default to 1 if not found
    const savedPage = localStorage.getItem('currentPage');
    return savedPage ? Number(savedPage) : 1; // Default to 1
  });
  const prevDashboardType = useRef(dashboardType); 

  useEffect(() => {
    if (prevDashboardType.current !== dashboardType) {
      // Only reset the current page to 1 if the dashboardType has changed
      setCurrentPage(1);
    }
    // Update the ref to the current dashboardType
    prevDashboardType.current = dashboardType;
  }, [dashboardType]);  // Effect runs when dashboardType changes

  const debouncedNavigate = debounce((id) => {
    sessionStorage.setItem('dashboardType', dashboardType);
    console.log('dashboardType: '+ dashboardType)
    history.push(`/verarbeiten/${id}`);
  }, 100);

  const filteredSubmissions = useMemo(() => {
    return submissions.filter(entry => {
      switch (dashboardType) {
        case 'claimed':
          return (
            entry.status === 'Open' &&
            Array.isArray(entry.reader) &&
            entry.reader[0] !== 'unclaimed'
          );
        case 'old':
          return (
            entry.status !== 'Open' &&
            (!Array.isArray(entry.status) || entry.status[0] !== 'Recommended')
          );
        case 'recommended':
          return (
            entry.status === 'Recommended' &&
            Array.isArray(entry.reader) &&
            entry.reader[0] !== 'unclaimed'
          );
        case 'unclaimed':
          return (
            entry.status === 'Open' &&
            Array.isArray(entry.reader) &&
            entry.reader[0] === 'unclaimed'
          );
        default:
          return false;
      }
    });
  }, [dashboardType, submissions]);

  // RETURNS PAGINATED LIST OF FILTERED SUBMISSIONS FOR THE CURRENT PAGE AND CALCULATES TOTALPAGES OF FILTERED SUBMISSIONS.
  const displayedSubmissions = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return filteredSubmissions.slice(startIndex, endIndex);
  }, [currentPage, filteredSubmissions]);

  const totalPages = useMemo(() => Math.ceil(filteredSubmissions.length / itemsPerPage), [filteredSubmissions, itemsPerPage]);

  useEffect(() => {
    // Save the currentPage to localStorage whenever it changes
    localStorage.setItem('currentPage', currentPage);
  }, [currentPage]);


  // UPDATES PAGE NUMBER, TRIGGERING RE-RENDER TO SHOW THE SUBMISSIONS FOR THAT PAGE.
  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  // RETRIEVES CURRENT READERID FROM LOCALSTORAGE. USED FOR ASSIGNING SUBMISSIONS TO THIS READER.
  const theCurrentReader = localStorage.getItem('reader');
  const theCurrentReaderDetails = JSON.parse(theCurrentReader);
  const theCurrentReaderId = theCurrentReaderDetails.readerId;

  // TRACKS COMPONENT MOUNT STATUS TO AVOID SETTING STATE IF UNMOUNTED.
  useEffect(() => {
    isMounted.current = true;
    return () => {
      isMounted.current = false;
    };
  }, []);

  // HANDLEASSIGNSUBMISSION ASSIGNS SUBMISSION TO CURRENT READER BY CALLING ASSIGNSUBMISSIONCLIENT. IF SUCCESSFUL, UPDATES CLAIMEDSUBMISSIONS. 
  // DEBOUNCEDASSIGNSUBMISSION IS THE DEBOUNCED VERSION MEANT TO PREVENT REPEATED RAPID SUBMISSION ASSIGNMENTS.
  const handleAssignSubmission = useCallback(async (submissionId, reader) => {
    console.log('Assigning submission...');
    console.log('submissionId: ' + submissionId);
    console.log('reader: ' + reader);
    try {
      await assignSubmissionClient(submissionId, reader);
      if (isMounted.current) {
        setClaimedSubmissions((prevClaimed) => new Set([...prevClaimed, submissionId]));
      }
      console.log('Submission assigned successfully.');
    } catch (error) {
      console.error('Error assigning submission:', error);
    }
  }, [assignSubmissionClient]);
  
  const debouncedAssignSubmission = debounce(handleAssignSubmission, 100);

  // HANDLES CLICK ON SUBMISSION. IF UNCLAIMED, ASSIGNS IT TO CURRENT READER. OTHERWISE, DOES NOTHING.
  const handleArticleClick = (submissionId) => {
    if (!claimedSubmissions.has(submissionId)) {
      debouncedAssignSubmission(submissionId, theCurrentReaderId);
    }
  };

  // ISLOADING DISPLAYS WHEN DATA IS BEING FETCHED. EMPTY STATE SHOWS MESSAGE IF THERE ARE NO SUBMISSIONS FOR SELECTED DASHBOARDTYPE.
  if (isLoading) {
    return <div className='loading'></div>;
  }

  if (filteredSubmissions.length === 0) {
    return (
      <EmptyContainer>
        <h5>
          Currently, you have no <span>SUBMISSIONS </span> to display
        </h5>
      </EmptyContainer>
    );
  }

  return (
    <>
      <SubmissionColumns />
      <Container>
        {displayedSubmissions.map((item) => {
          const { _id: id, name, title, type, wordCount, status } = item;
          console.log('item.createdAt: ' + item.createdAt)
          const date = moment.utc(item.createdAt).format('MMMM Do, YYYY');
          console.log('date : '+ date);
          const handleClick = () => {
            if (dashboardType === 'unclaimed') {
              // Perform action for unclaimed submissions
              handleArticleClick(id);
            } else {
              // Redirect to the submission details page for other dashboard types
              debouncedNavigate(id);
            }
          };

    if (status) {
      return (
        <div key={id} className='bigButton' onClick={handleClick}>
          <article>
            <div className='submission'>
              <span className='position'>{title}</span>
              <span className='position'>{name}</span>
              <span className='centerPosition'>{wordCount !== null ? wordCount : 'POEM'}</span>
              <StatusContainer className='status' status={status}>
                <strong>{status}</strong>
              </StatusContainer>
              <span className='centerPosition'>{type}</span>
              <span className='date'>{date}</span>
            </div>
            <br />
          </article>
        </div>
      );
    } else {
      return null;
    }
  })}
</Container>
      <Pagination>
      <div className="paginationCSS">
        {Array.from({ length: totalPages }).map((_, index) => (
          <div
            key={index}
            className={`PageButton ${index + 1 === currentPage ? 'active' : ''}`}
            onClick={() => handlePageChange(index + 1)}
          >
            {index + 1}
          </div>
        ))}
      </div>
      </Pagination>
    </>
  );
};

const EmptyContainer = styled.section`
  text-align: center;
  h5 {
    text-transform: none;
  }
  span {
    color: var(--primary-500);
  }
`;

const Container = styled.section`
.submission {
  background: var(--white);
  box-shadow: var(--shadow-5);
  border-radius: var(--borderRadius);
  margin-bottom: 2rem;
  display: grid;
  padding: 2rem 0;
  justify-content: center;
  text-align: center;
}
.icon {
  background: var(--primary-500);
  display: block;
  border-radius: var(--borderRadius);
  color: var(--white);
  font-size: 2rem;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto;
  margin-bottom: 1rem;
}
span {
  text-transform: capitalize;
  letter-spacing: var(--letterSpacing);
}
.position {
  font-weight: 600;
}
.date {
  color: var(--grey-500);
}
.status {
  border-radius: var(--borderRadius);
  text-transform: capitalize;
  letter-spacing: var(--letterSpacing);
  text-align: center;
  width: 150px;
  padding: 10px;
}
.verarbeiten-btn {
  color: var(--primary-600);
  border-color: transparent;
  background: transparent !important;
  outline: transparent;
  border-radius: var(--borderRadius);
  cursor: pointer;
  display: inline-block;
  appearance: none;
}
.verarbeiten-btn {
  color: var(--primary-200);
  border-color: transparent;
  background: transparent !important;
  outline: transparent;
  border-radius: var(--borderRadius);
  cursor: pointer;
  display: inline-block;
  appearance: none;
}
.delete-btn {
  color: var(--red-dark);
  border-color: transparent;
  border-radius: var(--borderRadius);
  cursor: pointer;
  background: transparent;
}
.verarbeiten-btn,
.delete-btn,
.rejected-btn {
  font-size: 1rem;
  line-height: 1.15;
  margin-bottom: -3px;
}
.bigButton {
  transition-duration: 0.4s;
}
.bigButton:hover {
  font-weight: bolder;
  color: #645cff;
}
.blueButton {
  background-color: --primary-500; /* blue */
  border: none;
  color: white;
  padding: 5px 15px;
  text-align: center;
  text-decoration: none;
  display: inline-block;
  font-size: 16px;
  margin-top: 16px;
  margin-bottom: 16px;
  float: left;
  border: 1px solid blue;
  width: 200px;
}
.blueButton:hover {
  font-weight: bolder;
  color: #645cff;
}

.action-div {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0 0.5rem;
}

@media (min-width: 768px) {
  display: grid;
  grid-template-columns: 1fr 1fr;
  column-gap: 1rem;
}
@media (min-width: 992px) {
  grid-template-columns: 1fr;
  .icon {
    display: none;
  }
  background: var(--white);
  border-bottom-left-radius: var(--borderRadius);
  border-bottom-right-radius: var(--borderRadius);

  .submission {
    border-radius: 0;
    justify-content: left;
    text-align: left;
    grid-template-columns: repeat(2, 4fr) repeat(4, 1fr);
    align-items: center;
    padding: 1rem 1.5rem;
    column-gap: 1rem;
    margin-bottom: 0;
    border-bottom: 1px solid;
  }
  span {
    font-size: var(--small-text);
  }
  .position {
    font-weight: 400;
    text-transform: capitalize;
  }
  .centerPosition {
    font-weight: 400;
    text-transform: capitalize;
    text-align: center;
  }

  .date {
    font-weight: 400;
    color: var(--grey-500);
    text-align: center;
  }

  .status {
    font-size: var(--smallText);
    text-align: center;
  }

  // .action-div {
  //   text-align: left;
  //   border-bottom: 1px solid var(--grey-200);
  //   grid-template-columns: repeat(5, 3fr);
  // }
}
`
const Pagination = styled.section`
.paginationCSS {
  display: inline-block;
  color: blue;

.PageButton {
  color: black;
  float: left;
  padding: 8px 16px;
  text-decoration: none;
  &.active {
    background-color: blue;
    color: white;
  }
  &:not(.active):hover {
    background-color: #d8d8ff;
    border: 1px dashed blue;
  }  
}
`;

const setStatusColor = (status) => {
  if (status === 'Open') return '#ffffff';
  if (status === 'Recommended') return '#ffffff';
  if (status === 'Rejected, First Round' || status === 'Rejected, Second Round' || status === 'Rejected, Third Round' || status === "Rejected Anonymously") return '#ffffff';
  return '#927238';
};
const setStatusBackground = (status) => {
  if (status === 'Accepted') return '#d1e7dd';
  if (status === 'Open') return '#0096FF';
  if (status === 'Recommended') return '#CC5500';
  if (status === 'Rejected, First Round' || status === 'Rejected, Second Round' || status === 'Rejected, Third Round' || status === "Rejected Anonymously") return '#811331';
  return '#f7f3d7';
};

const StatusContainer = styled.span`
  border-radius: var(--borderRadius);
  text-transform: capitalize;
  letter-spacing: var(--letterSpacing);
  text-align: center;
  color: ${(props) => setStatusColor(props.status)};
  background: ${(props) => setStatusBackground(props.status)};
`;

export default SubmissionsCombined;