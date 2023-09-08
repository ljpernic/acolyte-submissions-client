import { useState, useEffect } from 'react';
import { useParams, Redirect, Link } from 'react-router-dom';
import styled from 'styled-components';
import { useGlobalContext } from '../context/appContext';
import FormRow from '../components/FormRow';
import Navbar from '../components/Navbar';
import TierHigh from '../components/TierHigh';
import TierMiddle from '../components/TierMiddle';
import TierLow from '../components/TierLow';
import TierAnon from '../components/TierAnon';
import TierRec from '../components/TierRec';

function Update() {
  const { id } = useParams();
  const {
    isLoading,
    verarbeitenItem,
    fetchSingleSubmission,
    singleSubmissionError: error,
    reader,
    verarbeitenSubmissionClient,
    verarbeitenComplete,
  } = useGlobalContext();


  function hideAndShowStuff(collection, view) {
    for (
      var i = 0, len = collection.length; i < len; i++
    )
      {
        collection[i].style["display"] = view;
      }
  }

  const currentReader = useGlobalContext().reader;

  const [values, setValues] = useState({
    name: '',
    title: '',
    email: '',
    wordCount: '',
    status: '',
    reader: '',
    readerNote: '',
    coverLetter: '',
  });

  // GETS THE SINGLE SUBMISSION BASED ON ID
  useEffect(() => {
    fetchSingleSubmission(id);
  }, [id]);

  useEffect(() => {
    if (verarbeitenItem) {
      const { name, email, title, wordCount, reader, status, coverLetter, readerNote } = verarbeitenItem;
      setValues({ name, email, title, wordCount, reader, status, coverLetter, readerNote });
    }
  }, [verarbeitenItem]);

  const handleChange = (e) => {
    setValues({ ...values, [e.target.name]: e.target.value });
  };



// HIDES OR SHOWS ELEMENTS BASED ON CLASS
  var allElements = document.getElementsByClassName('allTags')
//  var highElement = document.getElementById('highId')

//  var baseElements = document.getElementsByClassName('baseTags')



  // DISPLAYS COVER LETTER AND PROCESSING FORMS
  //// Can probably combine these into one function with if statements? If [some identifier] is X, style.display = 'block'?
    const displayCover = (e) => {
    hideAndShowStuff(allElements, 'none')
    document.getElementById("cover").style.display = "block";
  };

  const displayHigh = (e) => {
    hideAndShowStuff(allElements, 'none')
    document.getElementById("highEmail").style.display = "block";
    document.getElementById("highButton").style.display = "block";    
  };

  const displayMiddle = (e) => {
    hideAndShowStuff(allElements, 'none')
    document.getElementById("middleEmail").style.display = "block";
    document.getElementById("middleButton").style.display = "block";    
  };

  const displayLow = (e) => {
    hideAndShowStuff(allElements, 'none')
    document.getElementById("lowEmail").style.display = "block";
    document.getElementById("lowButton").style.display = "block";    
  };

  const displayAnon = (e) => {
    hideAndShowStuff(allElements, 'none')
    document.getElementById("anonEmail").style.display = "block";
    document.getElementById("anonButton").style.display = "block";    
  };

  const displayRec = (e) => {
    hideAndShowStuff(allElements, 'none')
    document.getElementById("recEmail").style.display = "block";
    document.getElementById("recButton").style.display = "block";    
  };

  const openFile = (e) => {
    e.preventDefault();
//    hideAndShowStuff(allElements, 'none')
//    hideAndShowStuff(baseElements, 'block')
    console.log('This button will open the file. ')
  };

 
  // TO DO: Add to handle functions something that makes the input fields readonly/disabled.
  // Can use something like   document.getElementById("allTags").readOnly = true; ??
  // TO DO: Make it so that the fields are not editable if the submission is not active?  
  // TO DO: Make it so that the readerNotes field isn't required to submit the form (or only under certain circumstances?).
  // TO DO: Fix editor name and role in the rejection emails.

// MAKE CHANGE TO DB AND SEND EMAIL  
  const handleHigh = (e) => {
    e.preventDefault();
    const { name, email, title, reader, status, readerNote } = values;
    if (name && email && title && reader && status && readerNote) {
      const status = "Rejected, Third Round";
      verarbeitenSubmissionClient(id, { name, title, email, reader, status, readerNote });
    }
//    console.log(`handleRejection values: ` + JSON.stringify(values));
  };

  const handleMid = (e) => {
    e.preventDefault();
    const { name, email, title, reader, status, readerNote } = values;
    if (name && email && title && reader && status && readerNote) {
      const status = "Rejected, Second Round";
      verarbeitenSubmissionClient(id, { name, email, title, reader, status, readerNote });
    }
//    console.log(`handleRejection values: ` + JSON.stringify(values));
  };

  const handleLow = (e) => {
    e.preventDefault();
    const { name, email, title, reader, status,readerNote } = values;
    if (name && email && title && reader && status && readerNote) {
      const status = "Rejected, First Round";
      verarbeitenSubmissionClient(id, { name, email, title, reader, status, readerNote });
    }
//    console.log(`handleRejection values: ` + JSON.stringify(values));
  };

  const handleAnon = (e) => {
    e.preventDefault();
    const { name, email, title, reader, status, readerNote } = values;
    if (name && email && title && reader && status && readerNote) {
      const status = "Rejected Anonymously";
      verarbeitenSubmissionClient(id, { name, email, title, reader, status, readerNote });
    }
//    console.log(`handleRejection values: ` + JSON.stringify(values));
  };

  const handleRec = (e) => {
    e.preventDefault();
    const { name, email, title, reader, status, readerNote } = values;
    if (name && email && title && reader && status && readerNote) {
      const status = "Recommended";
      verarbeitenSubmissionClient(id, { name, email, title, reader, status, readerNote });
    }
//    console.log(`handleRejection values: ` + JSON.stringify(values));
  };


// FORM UPDATER
  const handleSubmit = (e) => {
    e.preventDefault();
    const { name, email, title, wordCount, status, coverLetter, readerNote } = values;
    if (name && email && title && wordCount && status && coverLetter && readerNote) {
      verarbeitenSubmissionClient(id, { name, email, title, wordCount, status, coverLetter, readerNote });
    }
  };

  if (isLoading && !verarbeitenItem) {
    return <div className='loading'></div>;
  }

  if (!verarbeitenItem || error) {
    return (
      <>
        <ErrorContainer className='page'>
          <h5>There was an error, please double check your submission ID</h5>
          <Link to='/dashboard' className='btn'>
            dashboard
          </Link>
        </ErrorContainer>
      </>
    );
  }
  return (
    <>
      {!reader && <Redirect to='/' />}
      <Navbar />
      <Container className='page'>
        <form className='form' onSubmit={handleSubmit}>
          <p>{verarbeitenComplete && 'Success! Processing Complete'}</p>

          {/* BIG GRID FOR TWO COLUMNS */}
          <div className="bigGrid">

            {/* LEFT HALF OF GRID, WITH UPDATE FORM */}
            <div className='container'>

              {/* HEADER OF LEFT COLUMN */}
              <div className='action-div-top'>
                  <h2>
                    <strong>
                      Submission
                    </strong>
                  </h2>
              </div>

              <FormRow
                type='text'
                name='title'
                value={values.title}
                handleChange={handleChange}
              /> 
              <br />
              <FormRow
                type='text'
                name='name'
                value={values.name}
                handleChange={handleChange}
              /> 
              <br />
              <FormRow
                type='email'
                name='email'
                value={values.email}
                handleChange={handleChange}
              /> 
              <br />
<div className='action-div-top'>
              <div className='form-row action-div-WC-S'>
                <label htmlFor='wordCount' className='form-label'>
                <strong>Word Count</strong>
                </label>
                  {values.wordCount}
              </div> 
              <div className='form-row action-div-WC-S'>
                <label htmlFor='status' className='form-label'>
                <strong>Status</strong>
                </label>
                  {values.status}
              </div> 
</div>
              <br />
              <div className='action-div-top'>
                <strong>
                  Click to open reply form
                </strong>
              </div>

              {/* CONTAINER FOR TOP ROW OF BUTTONS, LEFT-HAND COLUMN */}
              <div className="action-div">
                <button
                    className= 'blue'
                    type='button'
                    onClick={displayRec}
                >
                    Recommend
                </ button>
                <button                                                       
                      className= 'blue'
                      type='button'
                      onClick={displayAnon}
                >
                      Anonymous Rejection
                </ button>
              </div>
              
            {/* CONTAINER FOR MIDDLE ROW OF BUTTONS, LEFT-HAND COLUMN */}            
              <div className="action-div">
                <button className= 'blue' type='button' onClick={displayLow}> Low-tier rejection </ button>
                <button className= 'blue' type='button' onClick={displayMiddle}> Middle-tier rejection </ button>
                <button className= 'blue' type='button' onClick={displayHigh}> High-tier rejection </ button>
              </div>

              {/* CONTAINER FOR MIDDLE ROW OF BUTTONS, LEFT-HAND COLUMN */}  
              <div className='action-div-middle'>
                <strong>Other Actions</strong>
              </div>          
              <div className="action-div">
                <button className= 'blue' type='button' onClick={openFile}> Open File </ button>
                <button type='submit' className='blue' disabled={isLoading}> {isLoading ? 'Updating...' : 'Update'} </button>
                <button className= 'blue' type='button' onClick={displayCover}> Cover Letter </button>
               </div>
            </div>

            {/* RIGHT HALF OF GRID, WITH EMAIL TEMPLATE */}
            <div className='container'>
              {/* STARTS THE DIV HIDDEN; CHANGED BY THE displayEmail FUNCTION */}
              {/* TO DO: Put the email templates and buttons in their own boxes with the reader note input field in *its* own css box too*/}
              <div className = 'allTags' id='cover' style={{width : '100%', height : '516px'}}>
                <h2 className = 'action-div-top' >
                  <strong>
                    Cover Letter
                  </strong>
                </h2>
                <p>
                  {values.coverLetter}
                </p>
              </div>
                <div className ='allTags' id='highEmail' style={{display : 'none'}}>
                  <TierHigh
                    name={values.name}
                    type={values.type}
                    title={values.title} 
                    currentReader={currentReader}
                    readerNote={values.readerNote}
                    handleChange={handleChange}
                  />
                  <div className='action-div-top'>
                    <button className = 'blue allTags' id='highButton' style={{display : 'none'}} type='button' onClick={handleHigh}>
                      High-Tier Rejection
                    </ button>
                  </div>
                </div>
                <div className ='allTags' id='middleEmail' style={{display : 'none'}}>
                  <TierMiddle
                    name={values.name}
                    type={values.type}
                    title={values.title} 
                    currentReader={currentReader}
                    readerNote={values.readerNote}
                    handleChange={handleChange}
                  /> 
                  <div className='action-div-top'>
                    <button className = 'blue allTags' id='middleButton' style={{display : 'none'}} type='button' onClick={handleMid}>
                      Middle-Tier Rejection
                    </ button>
                  </div>
                </div>

                <div className ='allTags' id='lowEmail' style={{display : 'none'}}>
                  <TierLow
                    name={values.name}
                    type={values.type}
                    title={values.title} 
                    currentReader={currentReader}
                    readerNote={values.readerNote}
                    handleChange={handleChange}
                  /> 
                  <div className='action-div-top'>
                    <button className = 'blue allTags' id='lowButton' style={{display : 'none'}} type='button' onClick={handleLow}>
                      Low-Tier Rejection
                    </ button>
                  </div>
                </div>

               <div className ='allTags' id='anonEmail' style={{display : 'none'}}>
                  <TierAnon
                    name={values.name}
                    type={values.type}
                    title={values.title} 
                    readerNote={values.readerNote}
                    handleChange={handleChange}
                  /> 
                  <div className='action-div-top'>
                    <button className = 'blue allTags' id='anonButton' style={{display : 'none'}} type='button' onClick={handleAnon}>
                      Anonymous Rejection
                    </ button>
                  </div>
                  </div>
               <div className ='allTags' id='recEmail' style={{display : 'none'}}>
                  <TierRec
                    name={values.name}
                    type={values.type}
                    title={values.title} 
                    currentReader={currentReader}
                    readerNote={values.readerNote}
                    handleChange={handleChange}
                  /> 
                  <div className='action-div-top'>
                    <button className = 'blue allTags' id='recButton' style={{display : 'none'}} type='button' onClick={handleRec}>
                      Recommend
                    </ button>
                  </div>
                </div>
{/* TO DO: Insert paragraphs into the text so that the handleChange stuff keeps the line breaks! */}
                <div>
                  <label className='form-label'>      
                    <strong>Reader Notes</strong>  
                  </label>
                  <textarea
                    value={values.readerNote}
                    name='readerNote'
                    onChange={handleChange}
                    className='form-textarea'
                    placeholder='placeholder text...'
                    wrap= 'soft'
                  />
                </div>
              <br />
            </div>
          </div>
        </form>
      </Container>
    </>
  );
}

const ErrorContainer = styled.section`
  text-align: center;
  padding-top: 6rem; ;
`;

const Container = styled.section`
  header {
    margin-top: 2rem;
  }
  .form {
    max-width: var(--max-width);
    margin-top: 2rem;
  }
  .form h4 {
    text-align: center;
  }
  .form > p {
    text-align: center;
    color: var(--primary-500);
    letter-spacing: var(--letterSpacing);
    margin-top: 0;
  }
  .status {
    background: var(--grey-100);
    border-radius: var(--borderRadius);
    border-color: transparent;
    padding: 0.25rem;
  }
  .back-home {
    text-align: center;
    display: block;
    width: 100%;
    font-size: 1rem;
    line-height: 1.15;
    background: var(--black);
  }
  .back-home:hover {
    background: var(--grey-500);
  }
  
  .blue {
    background-color: #645cff; /* blue */
    border: none;
    color: white;
    padding: 5px 15px;
    text-align: center;
    text-decoration: none;
    display: inline-block;
    font-size: 16px;
    margin-top: 5px;
    margin-bottom: 5px;
    float: left;
    border: 1px solid blue;
    width: 150px;
    height: 50px;
  }
  .blue:hover {
    background-color: rgba(76, 175, 80, 8%);
    box-shadow: 0px 0px 0px 10px rgba(0,0,0,0.1), 0px 0px 0px 10px rgba(0,0,0,0.1);
    color: #645cff;
  }

  .action-div {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0 0.5rem;
  }

  .action-div-top {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0 0.5rem;
    margin-bottom: 1rem;
  }

  .action-div-WC-S {
    display: inline;
    align-items: center;
    justify-content: center;
    gap: 0 0.5rem;
    margin: 0rem 2rem 0rem 2rem;
  }

  .action-div-middle {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0 0.5rem;
    margin-top: 1rem;
    margin-bottom: 1rem;
  }

  .bigGrid {
    display: grid;
    grid-template-columns: 46% 46%;
    column-gap: 8%;
  }

  @media (min-width: 768px) {
    .back-home {
      width: 200px;
    }
    .form h4 {
      text-align: left;
    }
    .form-container {
      display: grid;
      grid-template-columns: repeat(3, 4fr) 1fr 2fr 1fr;
      column-gap: 0.5rem;
      align-items: center;
    }
    
    .form-vertical {
      max-width: 400;
      border-top: 5px solid var(--primary-500);
    }

    .form > p {
      text-align: left;
    }
    .form-row {
      margin-bottom: 1rem;
    }
    .submit-btn {
      align-self: end;
    }
  }
`;
export default Update;
