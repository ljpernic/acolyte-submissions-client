//////// COMPONENT
//////// RETURNS UNCLAIMED SUBMISSIONS FOR LOGGED-IN READER ////////

import { useGlobalContext } from '../context/appContext';
import React, { useState } from 'react';
import styled from 'styled-components';

import moment from 'moment';
import SubmissionColumns from './SubmissionColumns';

const SubmissionsUnclaimed = () => {
  const { submissions, isLoading, assignSubmissionClient } = useGlobalContext();
  const [claimedSubmissions, setClaimedSubmissions] = useState([]);
  const itemsPerPage = 10;
  const [currentPage, setCurrentPage] = useState(1);

if (isLoading) {
    return <div className='loading'></div>;
  }

  const unclaimedSubmissions = submissions.filter(entry => entry.reader === "unclaimed");

  if (unclaimedSubmissions.length < 1) {
    return (
      <EmptyContainer>
        <h5>
          There are currently <span>NO UNCLAIMED SUBMISSIONS </span> to display
        </h5>
      </EmptyContainer>
    );
  }

    // Calculate the index range for the current page
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
  
    // Slice the oldSubmissions array to display only the current page
    const displayedSubmissions = unclaimedSubmissions.slice(startIndex, endIndex);
  
    const totalPages = Math.ceil(unclaimedSubmissions.length / itemsPerPage);
  
    const handlePageChange = (newPage) => {
      setCurrentPage(newPage);
    };

    const theCurrentReader = localStorage.getItem('reader')
    const theCurrentReaderDetails = JSON.parse(theCurrentReader)
    const theCurrentReaderId = theCurrentReaderDetails.readerId;

    const handleAssignSubmission = async (submissionId, reader) => {
      try {
        await assignSubmissionClient(submissionId, reader);
        setClaimedSubmissions((prevClaimed) => [...prevClaimed, submissionId]); 
      } catch (error) {
        console.error('Error assigning submission:', error);
      } 
    };

  return ( 
    <>
      <SubmissionColumns /> 
      <Container>
        {displayedSubmissions
        .map((item) => {
          const { _id: id, name, title, type, wordCount, status, createdAt } = item;
          let date = moment(createdAt);
          date = date.format('MMMM Do, YYYY');
          if (item.status) {
            const isClaimed = claimedSubmissions.includes(id);
            return (
            <div key={id} onClick={() => handleAssignSubmission(id, theCurrentReaderId)} className={`bigButton ${isClaimed ? 'claimed' : ''}`}>
              <article> 
                <div className='submission'>
                <span className='position'>{title}</span>
                <span className='position'>{name}</span>
                <span className='centerPosition'>{wordCount !== null ? wordCount : 'POEM'}</span>
                <StatusContainer className='status' status={status}>   
                  {status}
                </StatusContainer>
                <span className='centerPosition'>{type}</span>
                <span className='date'>{date}</span>
                {isClaimed && <span className="claimed-label">Claimed</span>}
                </div>
                <br />
                </article>
             </div>
           );}
           else {
            return (null);
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
  .claimed-label {
    display: flex;
    font-weight: bold;
    color: blue;
  
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
      grid-template-columns: repeat(2, 3fr) repeat(4, 1fr);
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
  if (status === 'Rejected, First Round' || status === 'Rejected, Second Round' || status === 'Rejected, Third Round') return '#ffffff';
  return '#927238';
};
const setStatusBackground = (status) => {
  if (status === 'Accepted') return '#d1e7dd';
  if (status === 'Open') return '#0096FF';
  if (status === 'Recommended') return '#CC5500';
  if (status === 'Rejected, First Round' || status === 'Rejected, Second Round' || status === 'Rejected, Third Round') return '#811331';
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

export default SubmissionsUnclaimed;
