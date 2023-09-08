import React from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';

const Submitted = () => {
  return (
    <Wrapper className='page full-page'>
      <div>
{/*         <img src={img} alt='not found' />*/}
        <h3>Thank you for your submission!</h3>
        <Link to='/'>Back to home</Link>
      </div>
    </Wrapper>
  );
};

const Wrapper = styled.main`
  text-align: center;
  img {
    max-width: 600px;
    display: block;
    margin-bottom: 2rem;
  }
  display: flex;
  align-items: center;
  justify-content: center;
  h3 {
    margin-bottom: 0.5rem;
  }
  p {
    margin-top: 0;
    margin-bottom: 0.5rem;
    color: var(--grey-500);
  }
  a {
    color: var(--primary-500);
    text-decoration: underline;
  }
`;

export default Submitted;
