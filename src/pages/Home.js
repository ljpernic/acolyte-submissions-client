//////// PAGE
//////// HOME PAGE. WHAT YOU SEE WHEN YOU NAVIGATE TO THE WEBSITE. ////////

import { Link } from 'react-router-dom';
import styled from 'styled-components';
import kaleidocast from '../assets/Kaleidocast.jpg';

function Home() {

  return (                                                                           //// STARTS WITH INITIAL STATE DEFINED IN APP/APPCONTEXT.JS, WITH EVERYTHING FALSE, EMPTY, NULL.
    <>
      <Wrapper>
        <div className='container page'>
<div>
        <img 
          src={kaleidocast} 
          alt="Kaleidocast Magazine logo"
          style={{ width: '100%', height: 'auto' }}
          className="head-space"
        />
        </div>
          <div className='info'>
            <h1>Kaleidocast NYC</h1>
            <p style={{'fontSize':'1.2em'}}>
              For Season 5 of Kaleidocast, we're expanding beyond the confines of Brooklyn. We're looking for fictional, 
              fantastical, or speculative takes on life in urban centers. From the milieu of millions of people, to the 
              movements of a single person. We want to see your take on city life. 
            </p>
            <Link to='/form-fiction' className='btn-home hero-btn-home'>
              Submit Fiction
            </Link><br /><br />
          </div>
        </div>
      </Wrapper>
    </>
  );
}

const Wrapper = styled.div`
  .container {
    min-height: calc(100vh - 6rem);
    display: grid;
    align-items: center;
    margin-top: -3rem;
  }
  nav {
    width: var(--fluid-width);
    max-width: var(--max-width);
    margin: 0 auto;
    height: 6rem;
    display: flex;
    align-items: center;
  }
  h1 {
    font-weight: 700;
  }
  .main-img {
    display: none;
  }
  .head-space {
    padding: 150px 50px 100px 50px;
  }
  @media (min-width: 992px) {
    .container {
      grid-template-columns: 1fr 1fr;
      column-gap: 6rem;
    }
    .main-img {
      display: block;
    }
    .head-space {
      padding: 0px;
    }
  }
`;

export default Home;
