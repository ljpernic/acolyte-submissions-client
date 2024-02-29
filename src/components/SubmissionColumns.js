//////// COMPONENT
//////// SETS COLUMN HEADERS FOR DASHBOARDS ////////

import React from 'react';
import styled from 'styled-components';

const SubmissionColumns = () => {
  return (
    <Wrapper>
      <span>Title</span>                                         {/* LITERAL COLUMN HEADERS. */}
      <span>Name</span>
      <span className="centerPosition">Word Count</span>
      <span className="centerPosition">Status</span>
      <span className="centerPosition">Type</span>
      <span className="centerPosition">Submitted</span>
    </Wrapper>
  );
};

const Wrapper = styled.section`
  display: none;
  @media (min-width: 992px) {
    display: block;
    background: var(--grey-200);
    color: var(--grey-500);
    border-top-left-radius: var(--borderRadius);
    border-top-right-radius: var(--borderRadius);
    display: grid;
    grid-template-columns: repeat(2, 3fr) repeat(4, 1fr);
    box-shadow: var(--shadow-6);
    align-items: center;
    padding: 1rem 1.5rem;
    column-gap: 1rem;
    text-transform: capitalize;
    letter-spacing: var(--letterSpacing);
    font-size: var(--small-text);
    font-weight: 600;
    .action {
      margin-left: 1rem;
    }
    .centerPosition {
      text-align: center;
    }
  }
`;

export default SubmissionColumns;
