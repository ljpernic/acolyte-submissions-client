//////// PAGE
//////// HOME PAGE. WHAT YOU SEE WHEN YOU NAVIGATE TO THE WEBSITE. ////////

import { Link } from 'react-router-dom';
import styled from 'styled-components';
import florian from '../assets/FlorianBG_Acolyte_Logo_PNG.png';

function Home() {

  return (                                                                           //// STARTS WITH INITIAL STATE DEFINED IN APP/APPCONTEXT.JS, WITH EVERYTHING FALSE, EMPTY, NULL.
    <>
      <Wrapper>
        <div className='container page'>
<div>
        <img 
          src={florian} 
          alt="Florian, mascot and logo of the Acolyte Submission System"
          style={{ width: '100%', height: 'auto' }}
          className="head-space"
        />
        </div>
          <div className='info'>
            <h1>Acolyte Submission System</h1>
            <p style={{'fontSize':'1.2em'}}>
              Welcome to the Acolyte Submission System! This open-source app handle all of Haven Spec Magazine's submissions. It is still a 
              work in progress, but it is freely available to any other magazine that might want to implement it for themselves. It's been years 
              in the making, and each version is a little bit better than the last.
            </p>
            <p style={{'fontSize':'1.2em'}}>
              Like the submission system's logo? His name is Florian, and he was designed 
              by the amazing artist <a href="https://www.haleygrunloh.com/">Haley Grunloh</a>!
            </p>
            <p style={{'fontSize':'1.2em'}}>
              Haven Spec Magazine is currently <strong>open</strong> to submissions.
            </p>
            <Link to='/form-fiction' className='btn-home hero-btn-home'>
              Submit Fiction
            </Link><br /><br />
            <Link to='/form-poetry' className='btn-home hero-btn-home'>
              Submit Poetry
            </Link><br /><br />
            {/* <a href="https://www.cognitoforms.com/HavenSpec/HavenSpecMagazine" className='btn-home hero-btn-home'>
              Submit Non-fiction
            </a><br /><br /> */}
            {/* <Link to='/login' className='btn hero-btn'>
              Login
              </Link><br /><br /> */}
              <p>Please note, however, that we are currently closed to non-fiction and art submissions. We hope to reopen to those later in the year.</p>
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
