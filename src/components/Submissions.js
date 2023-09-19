//////// RETURNS OPEN SUBMISSIONS FOR LOGGED-IN READER ////////

import { useGlobalContext } from '../context/appContext';                     // Makes useGlobalContext function from appContext available.
import React, { useState } from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import moment from 'moment';
import SubmissionColumns from './SubmissionColumns';

// AGGREGATES ALL OPEN SUBMISSIONS ON THE DASHBOARD //

const Submissions = (props) => {
  const { submissions, isLoading } = useGlobalContext();      //Imports submissions and isLoading functions from on useGlobalContext.
  const itemsPerPage = 5;
  const [currentPage, setCurrentPage] = useState(1);  

  if (isLoading) {                                            // If the state is isLoading, returns a loading notice.
    return <div className='loading'></div>;
  }
  
  const legitSubmissions = submissions.filter(function(submissionData) {       // Filters all readers by isActive and current story counts.
    return submissionData.status === props.status;                                       // Creates a new array with only the eligible readers.
  });

  if (legitSubmissions.length < 1) {                               // If no submissions are found (less than 1), returns a "no submissions" notice.
    return (
      <EmptyContainer>
        <h5>
          Currently, you have no <span>BANANAS </span>
          to display
        </h5>
      </EmptyContainer>
    );
  }

    // Calculate the index range for the current page
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
  
    // Slice the legitSubmissions array to display only the current page
    const displayedSubmissions = legitSubmissions.slice(startIndex, endIndex);
  
    const totalPages = Math.ceil(legitSubmissions.length / itemsPerPage);
  
    const handlePageChange = (newPage) => {
      setCurrentPage(newPage);
    };

  return (                                                               // Otherwise, it returns all of the submissions found. 
    <>
      <SubmissionColumns />                                              {/* Using the SubmissionColumns component to display them. */}
      <Container>
        {displayedSubmissions.map((item) => {                                     // And a map of all of the submissions, with each corresponding to an "item" array
          const { _id: id, name, title, type, wordCount, status, createdAt } = item;     //// that contains id, name, email etc.
          let date = moment(createdAt);                                  // Sets the date variable to equal the createdAt value
//          var modDate = moment(updatedAt);          
          date = date.format('MMMM Do, YYYY');                           //// and then formats it.
//          modDate = modDate.format('MMMM Do, YYYY');                     //// and then formats it.
//          console.log(item)
            // IF STATUS IS OPEN, IT DISPLAYS IT IN THE DASHBOARD. OTHERWISE, IT DOESN'T. //
          if (item.status === 'Open') {
          return (
            <Link key={id} to={`/verarbeiten/${id}`} className='bigButton'>
              <article>                                {/* Then it returns all of those values, styling it with className 'submission'. */}
                <div className='submission'>
                <span className='position'>{title}</span>
                <span className='position'>{name}</span>
                <span className='centerPosition'>{wordCount}</span>
                <StatusContainer className='status' status={status}>            {/* Sets the colored box (styled with className='status') based on the status value. */}
                  {status}                                                      {/* The actual text of the status is dynamically inserted here. */}
                </StatusContainer>
                <span className='centerPosition'>{type}</span>
                <span className='date'>{date}</span>
                </div>
                <br />
                </article>
              </Link>
           );}
           else {
            return (null);
           }
        })}
      </Container>
      <Pagination>
      <div className="paginationCSS"> {/* Replace 'Pagination' with the pagination component */}
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
                                                                              // Styles the various containers.
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
    width: 100px;
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
                                                                                // Sets the status box colors.
const setStatusColor = (status) => {
  if (status === 'interview') return '#0f5132';
  if (status === 'declined') return '#842029';
  return '#927238';
};
const setStatusBackground = (status) => {
  if (status === 'Accepted') return '#d1e7dd';
  if (status === 'Rejected, First Round' || status === 'Rejected, Second Round' || status === 'Rejected, Third Round') return '#f8d7da';
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
export default Submissions;
