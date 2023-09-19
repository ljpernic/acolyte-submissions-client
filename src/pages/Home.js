//////// THIS IS THE HOME PAGE. WHEN YOU NAVIGATE TO THE URL, THIS IS WHAT YOU SEE. ////////

import { Link } from 'react-router-dom';
import styled from 'styled-components';
import main from '../assets/main.svg';
import { useGlobalContext } from '../context/appContext';
import { Redirect } from 'react-router-dom';
import logo from '../assets/logo.svg';
function Home() {
  const { reader } = useGlobalContext();
  const readerArray = []
  return (                                                                           //// STARTS WITH INITIAL STATE DEFINED IN APP/APPCONTEXT.JS, WITH EVERYTHING FALSE, EMPTY, NULL.
    <>
      {/* {console.log(`client/src/context/Home.js, global context reader data: ` + reader)}
      {Array.isArray(reader) ? readerArray.push(reader[0], reader[1]) : void(0)}
      {readerArray[1] === 'EIC' ? readerArray[0] && <Redirect to='/dashboard' /> : readerArray[0] && <Redirect to='/dashboard' /> } */}
{/*      {reader && <Redirect to='/dashboard' />}     */}                                  {/*///// BUT IF SOMEONE IS LOGGED IN, REDIRECTS TO DASHBOARD. */}                           
      <Wrapper>
        <nav>
          <img src={logo} alt='acolyte submissions app' />
        </nav>
        <div className='container page'>
          <div className='info'>
            <h1>Submissions app</h1>
            <p>
              This is the home page of the submission app. The content that we might imagine here would include something about the project, maybe other projects 
              that are using this submission system, a logo or two, how-tos and guides, etc. Plus probably something that lets you log in to your specific magazine.
            </p>
            <Link to='/form' className='btn hero-btn'>
              Form
            </Link><br /><br />
            <Link to='/login' className='btn hero-btn'>
              Login
              </Link><br /><br />
          </div>
          <img src={main} alt='submissions' className='img main-img' />
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
  @media (min-width: 992px) {
    .container {
      grid-template-columns: 1fr 1fr;
      column-gap: 6rem;
    }
    .main-img {
      display: block;
    }
  }
`;

export default Home;
