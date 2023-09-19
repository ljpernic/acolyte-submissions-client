import { useState, useEffect } from 'react';
import { useParams, Redirect, Link } from 'react-router-dom';
import styled from 'styled-components';
import { useGlobalContext } from '../context/appContext';
import FormRowVerarbeiten from '../components/FormRowVerarbeiten';
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
  let newStatus = values.status;
//
//
// DISPLAY HTML ELEMENTS ON THE RIGHT SIDE WHEN LEFT-SIDE BUTTONS ARE CLICKED
//
//
    // EACH OF THESE DISPLAY FUNCTIONS DOES THE FOLLOWING:
    // --> Hides all elements
    // --> Sets a value for newStatus (displayUpdate passes the old status through; the others change it to the new status)
    // --> Displays the top right text and the form submission button 
  const displayUpdate = (e) => {
    hideAndShowStuff(allElements, 'none')
    newStatus = values.status;
    document.getElementById("updateText").style.display = "block";
    document.getElementById("verarbeitenButton").style.display = "block";     
  };

  const displayCover = (e) => {
    hideAndShowStuff(allElements, 'none')
    document.getElementById("cover").style.display = "block";
  };

  const displayHigh = (e) => {
    hideAndShowStuff(allElements, 'none')
    newStatus = "Rejected, Third Round";
    document.getElementById("highEmail").style.display = "block";
    document.getElementById("verarbeitenButton").style.display = "block";     
  };

  const displayMiddle = (e) => {
    hideAndShowStuff(allElements, 'none')
    newStatus = "Rejected, Second Round";
    document.getElementById("middleEmail").style.display = "block";
    document.getElementById("verarbeitenButton").style.display = "block";         
  };

  const displayLow = (e) => {
    hideAndShowStuff(allElements, 'none')
    newStatus = "Rejected, First Round";
    document.getElementById("lowEmail").style.display = "block";
    document.getElementById("verarbeitenButton").style.display = "block";       
  };

  const displayAnon = (e) => {
    hideAndShowStuff(allElements, 'none')
    newStatus = "Rejected Anonymously";
    document.getElementById("anonEmail").style.display = "block";
    document.getElementById("verarbeitenButton").style.display = "block";         
  };

  const displayRec = (e) => {
    hideAndShowStuff(allElements, 'none')
    newStatus = "Recommended";
    document.getElementById("recEmail").style.display = "block";
    document.getElementById("verarbeitenButton").style.display = "block";     
  };

  const openFile = (e) => {
    e.preventDefault();
    console.log('This button will open the file. ')
  };
//
//
// UPDATE STATUS TO REJECTED AND SEND EMAIL  
//
//
const handleVerarbeiten = (e, status) => {
  e.preventDefault();
  const { name, email, title, reader, readerNote } = values;
//  console.log("values: " + JSON.stringify(values))
//  console.log("newStatus: " + newStatus)
  const selectedStatus = status || newStatus;
//  console.log("selectedStatus after updating: " + selectedStatus)
  if (name && email && title && reader && selectedStatus) {
    verarbeitenSubmissionClient(id, { name, title, email, reader, status: selectedStatus, readerNote });
  }
  if (status !== 'open' && status !== 'EIC') {
  document.getElementById("verarbeitenButton").style.display = "none";
  document.getElementById("verarbeitenSuccess").style.display = "block";
  }
};
//
//
// THE DASHBOARD SUBMIT FUNCTIONALITY STARTS HERE AND HAS FOUR POINTS.
// THIS IS THE FORM ITSELF THAT SUBMITS.
//
//
  const handleSubmit = (e) => {
    e.preventDefault();
    const { name, email, title, wordCount, status, coverLetter, readerNote } = values;
    if (name && email && title && wordCount && status && coverLetter) {
      if (status != "Open") {
        var theseTags = document.getElementsByClassName('allTags');
        for (var i = 0; i < theseTags.length; i++)
        {
          theseTags.item(i).readOnly = true;
        }
        var theseButtons = document.getElementsByClassName('allButons');
        for (var i = 0; i < theseButtons.length; i++)
        {
          theseButtons.item(i).style.display = "none";
        }
      }
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
{/*
//
// DASHBOARD, TOP LEFT SIDE (FOR UPDATING ENTRY)
//
*/}
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
              <FormRowVerarbeiten
                type='text'
                name='title'
                value={values.title}
                status={values.status}
                handleChange={handleChange}
              />
              <br />
              <FormRowVerarbeiten
                type='text'
                name='name'
                value={values.name}
                status={values.status}
                handleChange={handleChange}
              /> 
              <br />
              <FormRowVerarbeiten
                type='email'
                name='email'
                value={values.email}
                status={values.status}
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
{/* 
//
// DASHBOARD, BOTTOM LEFT SIDE (FOR BUTTONS TO CHANGE RIGHT-SIDE DISPLAY)
//
*/}
    {/* CONTAINER FOR TOP ROW OF BUTTONS, LEFT-HAND COLUMN */}
              <div className="action-div">
                <button
                    className={values.status !== "Open" ? 'disabledBlue' : 'blue'}
                    type='button'
                    disabled={values.status !="Open"}
                    onClick={displayRec}
                >
                    Recommend
                </ button>
                <button                                                       
                    className={values.status !== "Open" ? 'disabledBlue' : 'blue'}
                    type='button'
                    disabled={values.status !="Open"}
                    onClick={displayAnon}
                >
                    Anonymous Rejection
                </ button>
              </div>
              
    {/* CONTAINER FOR MIDDLE ROW OF BUTTONS, LEFT-HAND COLUMN */}            
              <div className="action-div">
                <button 
                  className={values.status !== "Open" ? 'disabledBlue' : 'blue'}
                  type='button' 
                  disabled={values.status !="Open"} 
                  onClick={displayLow}
                > 
                      Low-tier rejection 
                </ button>
                <button 
                  className={values.status !== "Open" ? 'disabledBlue' : 'blue'}
                  type='button' 
                  disabled={values.status !="Open"}
                  onClick={displayMiddle}
                > 
                      Middle-tier rejection 
                </ button>
                <button 
                  className={values.status !== "Open" ? 'disabledBlue' : 'blue'}
                  type='button' 
                  disabled={values.status !="Open"}
                  onClick={displayHigh}
                > 
                      High-tier rejection 
                </ button>
              </div>

    {/* CONTAINER FOR BOTTOM ROW OF BUTTONS, LEFT-HAND COLUMN */}  
              <div className='action-div-middle'>
                <strong>Other Actions</strong>
              </div>          
              <div className="action-div">
                <button className= 'blue' type='button' onClick={openFile}> Open File </ button>
                <button 
                  className={values.status !== "Open" ? 'disabledBlue' : 'blue'}
                  type='button' 
                  disabled={values.status !="Open"}
                  onClick={displayUpdate}
                > 
                      Update 
                </button>
                <button className= 'blue' type='button' onClick={displayCover}> Cover Letter </button>
               </div>
               <div className="action-div">
                <Link to='/dashboard'>
                  <button className= 'blue' type='button'> Back to Dashboard </ button>
                </Link>
               </div>
            </div>
{/* 
//
// DASHBOARD, TOP RIGHT SIDE (DIFFERENT DISPLAYS, DEPENDING ON BUTTON PRESS; DEFAULT IS COVER LETTER)
//
*/}
            <div className='container'>
    {/* TEXT OF SUBMITTED COVER LETTER */}
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
    {/* TOP-RIGHT TEXT FOR UPDATES */}
              <div className = 'allTags' id='updateText' style={{width : '100%', height : '516px', display : 'none'}}>
                <div style={{width : '100%', height : '440px'}}>
                  <h2 className = 'action-div-top' >
                    <strong>
                      Update submission
                    </strong>
                  </h2>
                  <p>
                    Are you sure you want to update the submission?
                  </p>
                </div>
              </div>
    {/* TOP-RIGHT TEXT FOR TOP-TIER REJECTION */}
                <div className ='allTags' id='highEmail' style={{display : 'none'}}>
                  <TierHigh
                    name={values.name}
                    type={values.type}
                    title={values.title} 
                    currentReader={currentReader}
                    readerNote={values.readerNote}
                    handleChange={handleChange}
                  />
                </div>
    {/* TOP-RIGHT TEXT FOR MIDDLE-TIER REJECTION */}                
                <div className ='allTags' id='middleEmail' style={{display : 'none'}}>
                  <TierMiddle
                    name={values.name}
                    type={values.type}
                    title={values.title} 
                    currentReader={currentReader}
                    readerNote={values.readerNote}
                    handleChange={handleChange}
                  />
                </div>
    {/* TOP-RIGHT TEXT FOR LOW-TIER REJECTION */}   
                <div className ='allTags ' id='lowEmail' style={{display : 'none'}}>
                  <TierLow
                    name={values.name}
                    type={values.type}
                    title={values.title} 
                    currentReader={currentReader}
                    readerNote={values.readerNote}
                    handleChange={handleChange}
                  /> 
                </div>
    {/* TOP-RIGHT TEXT FOR ANONYMOUS REJECTION */}
               <div className ='allTags' id='anonEmail' style={{display : 'none'}}>
                  <TierAnon
                    name={values.name}
                    type={values.type}
                    title={values.title} 
                    readerNote={values.readerNote}
                    handleChange={handleChange}
                  /> 
                </div>
    {/* RECOMMEND TEXT FOR RECOMMENDATION */}
               <div className ='allTags' id='recEmail' style={{display : 'none'}}>
                  <TierRec
                    name={values.name}
                    type={values.type}
                    title={values.title} 
                    currentReader={currentReader}
                    readerNote={values.readerNote}
                    handleChange={handleChange}
                  /> 
                </div>
    {/* SUBMIT BUTTON FOR SENDING REJECTIONS, RECOMMENDATIONS, DB UPDATES, ETC */}
                    <div className='action-div-top'>
                    <button className = 'red allTags' id='verarbeitenButton' style={{display : 'none'}} type='button' onClick={handleVerarbeiten}>
                      Submit
                    </ button>
    {/* SUCCESSFUL REJECTION TEXT. MAKES THE BUTTON UNCLICKABLE. */}
                    <div className = 'allTags' id='verarbeitenSuccess' style={{display : 'none'}}> 
                      Submit successful!
                    </div>
                  </div>
                <div>
                  <label className='form-label'>      
                    <strong>Reader Notes</strong>  
                  </label>
                  <textarea
                    value={values.readerNote}
                    name='readerNote'
                    readOnly={values.status != "Open"}
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

  .red {
    background-color: #993530; /* red */
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
    border: 1px solid red;
    width: 150px;
    height: 50px;
  }
  .red:hover {
    background-color: rgba(76, 175, 80, 8%);
    box-shadow: 0px 0px 0px 10px rgba(0,0,0,0.1), 0px 0px 0px 10px rgba(0,0,0,0.1);
    color: #645cff;
  }

  .disabledBlue {
    background-color: #36454F; /* Charcoal */
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
