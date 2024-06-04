import { useState, useEffect } from 'react';
import { useParams, Redirect, Link, useHistory } from 'react-router-dom';
import styled from 'styled-components';
import { useGlobalContext } from '../context/appContext';
import FormRowVerarbeiten from '../components/FormRowVerarbeiten';
import Navbar from '../components/Navbar';
import EmailTierTemplate from '../components/EmailTierTemplate';
import ButtonsDisplay from '../components/ButtonsDisplay';
import useAuth from '../hooks/useAuth.js';

//
//
////// This is the start of the entire function for sending rejections, updating submissions, and interacting with data on the dashboard.
//
//

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
    unAssignSubmissionClient,
  } = useGlobalContext();

  // SETS CURRENT READER INFO
  const currentReader = useGlobalContext().reader;

  // VERIFIES EIC LOGGED IN FOR SOME FUNCTIONALITY
  const { isEIC: authIsEIC } = useAuth();

  // SETS INITIAL VALUES
  const [values, setValues] = useState({
    name: '',
    title: '',
    email: '',
    wordCount: '',
    type: '',
    status: '',
    reader: '',
    readerNote: '',
    coverLetter: '',
  });

  const [isEIC, setIsEIC] = useState(false);

  const history = useHistory();


//
//
////// SETS USESTATES FOR SELECTIVELY DISPLAYING EMAIL FORMATS TO READER.
//
//
  const [testShowName, setTestShowName] = useState(false);
  const [testShowTitle, setTestShowTitle] = useState(false);  
  const [testShowThankYou, setTestShowThankYou] = useState(false);
  const [testShowMagazine, setTestShowMagazine] = useState(false);
  const [testShowUnfortunately, setTestShowUnfortunately] = useState(false);
  const [testShowInvite, setTestShowInvite] = useState(false);
  const [testShowSubjective, setTestShowSubjective] = useState(false);
  const [testShowReaderNote, setTestShowReaderNote] = useState(false);
  const [testShowRecommend, setTestShowRecommend] = useState(false);
  const [testShowCoverLetter, setTestShowCoverLetter] = useState(false);  
  const [testShowReaderName, setTestShowReaderName] = useState(false);  
  const [componentToShow, setComponentToShow] = useState(null);
  const [newStatus, setNewStatus] = useState('initial'); 
  const [displayName, setTestShowDisplayName] = useState('initial display name');  
//
//
////// USE EFFECTS
//
//
  //GETS SINGLE SUBMISSION BASED ON ID
  useEffect(() => {
    fetchSingleSubmission(id);
  }, [id]);
  // HANDLES VALUES FOR UPDATING AND SENDING REJECTIONS.
  useEffect(() => {
    if (verarbeitenItem) {
      const { name, email, title, wordCount, type, reader, status, coverLetter, readerNote } = verarbeitenItem;
      setValues({ name, email, title, wordCount, type, reader, status, coverLetter, readerNote });
    }
  }, [verarbeitenItem]);

  // CONTROLS EIC AUTHENTICATION BY FETCHING READER INO FROM USEAUTH HOOK
  useEffect(() => {
    setIsEIC(authIsEIC);
  }, [authIsEIC]);

//
//
////// HANDLES CHANGE AS YOU TYPE
//
//
  const handleChange = (e) => {
    setValues({ ...values, [e.target.name]: e.target.value });
  };

//
//
////// EMAIL ELEMENTS: TEXT FOR REJECTION EMAILS THAT EMAILTIERTEMPLATE COMPONENT SELECTIVELY USES BASED ON WHAT IS DISPLAYED.
//
//
  const thankYouVerarbeiten = "Thank you for your submission of "
  const magazineVerarbeiten = "to Haven Spec Magazine. "
  const unfortunatelyVerarbeiten = "Unfortunately, we've decided to pass on this one, but we wish you the best of luck on your writing and publishing endeavors."
  const happyVerarbeiten = "We would be happy to consider anything else you might write!"
  const subjectiveVerarbeiten = "That's just our subjective opinion, of course, but we appreciated the chance to look at your work, and we hope you send us more."
  const recommendVerarbeiten = "This is just a quick note that we've held this piece for further consideration. You should hear from us again in the next couple of months."

//
//
////// DISPLAYS EMAILTIERTEMPLATE COMPONENT IN EDITING WINDOW BASED ON COMPONENT NAME. ALSO SETS STATUS. 
//
//
    const displayComponent = (component) => {
      setComponentToShow(component);

      const componentConfig = {
        testHigh: {
          newStatus: "Rejected, Third Round",
          displayName: "Top-Tier Rejection",
          title: true,
          name: true,
          thankYou: true,
          magazine: true,
          unfortunately: true,
          invite: true,
          subjective: true,
          readerNote: true,
          coverLetter: false,
          recommend: false,
          readerName: true,
        },
        testMiddle: {
          newStatus: "Rejected, Second Round",
          displayName: "Middle-Tier Rejection",
          title: true,
          name: true,
          thankYou: true,
          magazine: true,
          unfortunately: true,
          invite: true,
          subjective: false,
          readerNote: false,
          coverLetter: false,
          recommend: false,
          readerName: true,
        },
        testLow: {
          newStatus: "Rejected, First Round",
          displayName: "Low-Tier Rejection",
          title: true,
          name: true,
          thankYou: true,
          magazine: true,
          unfortunately: true,
          invite: false,
          subjective: false,
          readerNote: false,
          coverLetter: false,
          recommend: false,
          readerName: true,
        },
        testAnon: {
          newStatus: "Rejected Anonymously",
          displayName: "Anonymous Rejection",
          title: true,
          name: true,
          thankYou: true,
          magazine: true,
          unfortunately: true,
          invite: false,
          subjective: false,
          readerNote: false,
          coverLetter: false,
          recommend: false,
          readerName: false,
        },
        testRec: {
          newStatus: "Recommended",
          displayName: "Recommend",
          title: true,
          name: true,
          thankYou: true,
          magazine: true,
          unfortunately: false,
          invite: false,
          subjective: false,
          readerNote: false,
          coverLetter: false,
          recommend: true,
          readerName: true,
        },     
        testUpdate: {
          newStatus: values.status,
          displayName: "Update",
          title: false,
          name: false,
          thankYou: false,
          magazine: false,
          unfortunately: false,
          invite: false,
          subjective: false,
          readerNote: false,
          coverLetter: true,
          recommend: false,
          readerName: false,
        },
        testCover: {
          newStatus: values.status,
          displayName: "Cover Letter",
          title: false,
          name: false,
          thankYou: false,
          magazine: false,
          unfortunately: false,
          invite: false,
          subjective: false,
          readerNote: false,
          coverLetter: true,
          recommend: false,
          readerName: false,
        },                   
        testOpen: {
          newStatus: values.status,
          displayName: "Open File",
          title: false,
          name: false,
          thankYou: false,
          magazine: false,
          unfortunately: false,
          invite: false,
          subjective: false,
          readerNote: false,
          coverLetter: true,
          recommend: false,
          readerName: false,
        },                   
      }

      if (componentConfig[component]) {
        const {
          newStatus,
          displayName,
          title,
          name,
          thankYou,
          magazine,
          unfortunately,
          invite,
          subjective,
          readerNote,
          coverLetter,
          recommend,
          readerName,
        } = componentConfig[component];
    
        setNewStatus(newStatus);
        setTestShowDisplayName(displayName);
        setTestShowTitle(title);
        setTestShowName(name);
        setTestShowThankYou(thankYou);
        setTestShowMagazine(magazine);
        setTestShowUnfortunately(unfortunately);
        setTestShowInvite(invite);
        setTestShowSubjective(subjective);
        setTestShowReaderNote(readerNote);
        setTestShowCoverLetter(coverLetter);
        setTestShowRecommend(recommend);
        setTestShowReaderName(readerName);
    
        // COMMON LOGIC TO DISPLAY VERARBEITENBUTTON
        document.getElementById("verarbeitenButton").style.display = "block";
      }
    };

//
//
// UPDATES DATABASE WHEN SUBMISSION UPDATE OR REJECTION IS CARRIED OUT. 
//
//
const handleVerarbeiten = (e, status) => {
  e.preventDefault();
  const { name, email, title, reader, readerNote } = values;
//  console.log("values: " + JSON.stringify(values))
//  console.log("newStatus: " + newStatus)
  const selectedStatus = status || newStatus;
//  console.log("selectedStatus after updating: " + selectedStatus)
  // PERFORMS VERARBEITENSUBMISSIONCLIENT FUNCTION IF THESE VALUES EXIST.  
  if (name && email && title && reader && selectedStatus) {
    verarbeitenSubmissionClient(id, { name, title, email, reader, status: selectedStatus, readerNote });
  }
  // HIDES VERARBEITENBUTTON AND SHOWS SUCCESS IF STATUS IS NO LONGER OPEN.
  if (status !== 'open' && status !== 'EIC') {
  document.getElementById("verarbeitenButton").style.display = "none";
  document.getElementById("verarbeitenSuccess").style.display = "block";
  }
};

//
//
// USES UNASSIGNSUBMISSIONCLIENT FUNCTION ON THE ACTIVE SUBMISSION.
//
//
const handleUnclaimSubmission = async (submissionId) => {
  try {
    // Call the unclaimSubmissionClient function
    await unAssignSubmissionClient(submissionId);
    history.push('/dashboard-claimed');
    // You may want to perform additional actions after unclaiming a submission
  } catch (error) {
    console.error('Error unclaiming submission:', error);
    // Handle errors as needed
  }
};

//
//
// THE DASHBOARD SUBMIT FUNCTIONALITY STARTS HERE AND HAS FOUR POINTS.
// THIS IS THE FORM ITSELF THAT SUBMITS.
//
//
//
//
  const handleSubmit = (e) => {
    e.preventDefault();
    const { name, email, title, wordCount, type, status, coverLetter, readerNote } = values;
    // IF THESE VALUES EXIST...
    if (name && email && title && wordCount && type && status && coverLetter) {
      // AND IF THE STATUS IS OPEN...
      if (status === "Open") {
        // RUNS THROUGH EVERYTHING AND SETS THEM TO READ ONLY...
        var theseTags = document.getElementsByClassName('allTags');
        for (var i = 0; i < theseTags.length; i++)
        {
          theseTags.item(i).readOnly = true;
        }
        // AND HIDES THE SUBMIT BUTTONS...
        var theseButtons = document.getElementsByClassName('allButons');
        for (var j = 0; j < theseButtons.length; j++)
        {
          theseButtons.item(j).style.display = "none";
        }
      }
      // THEN PRFORMS VERARBEITENSUBMISSIONCLIENT TO UPDATE THE SUBMISSION.
      verarbeitenSubmissionClient(id, { name, email, title, wordCount, type, status, reader, coverLetter, readerNote });
    }
  };

  if (isLoading && !verarbeitenItem) {
    return <div className='loading'></div>;
  }

  // IF THE VERARBEITENITEM THAT IS SET ABOVE BY USEEFFECT DOESN'T EXIST, THIS GIVES AN ERROR.
  if (!verarbeitenItem || error) {
    return (
      <>
        <ErrorContainer className='page'>
          <h5>There was an error, please double check your submission ID. </h5>
          <Link to='/dashboard-claimed' className='btn'>
            dashboard
          </Link>
        </ErrorContainer>
      </>
    );
  }
  //
  //
  //////// IF NO ERRORS, RETURNS FORM ON TOP LEFT (AND BOTTOM RIGHT) TO CAPTURE THE READER ENTRIES.
  //
  // 
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
              <FormRowVerarbeiten
                type='text'
                name='title'
                value={values.title}
                status={values.status}
                isEIC={isEIC}
                handleChange={handleChange}
              />
              <br />
              <FormRowVerarbeiten
                type='text'
                name='name'
                value={values.name}
                status={values.status}
                isEIC={isEIC}
                handleChange={handleChange}
              /> 
              <br />
              <FormRowVerarbeiten
                type='email'
                name='email'
                value={values.email}
                status={values.status}
                isEIC={isEIC}
                handleChange={handleChange}
              /> 
              <br />
            <div className='action-div-top'>
            {/* SHOWS WORD COUNT VALUE IF WORD COUNT ISN'T NULL. */}
            {values.wordCount === null ? '' : <div className='form-row action-div-WC-S'> <label htmlFor='wordCount' className='form-label' style={{marginBottom : '10px'}}> <strong>Word Count</strong> </label> {values.wordCount} </div>}
              <div className='form-row action-div-WC-S'>
                <label htmlFor='type' className='form-label' style={{marginBottom : '15px'}}>
                <strong>Type</strong>
                </label>
                  {values.type}
              </div> 
              <div className='form-row action-div-WC-S'>
                <label htmlFor='status' className='form-label' style={{marginBottom : '20px'}}>
                <strong>Status</strong>
                </label>
                <StatusContainer className='status' status={values.status}>
                      <strong>{values.status}</strong>
                    </StatusContainer>
              </div> 
            </div>
              <br />
              <div className='action-div-top'>
                <strong>
                  Click to open reply form
                </strong>
              </div>

  {/* DASHBOARD, BOTTOM LEFT SIDE (FOR BUTTONS TO CHANGE RIGHT-SIDE DISPLAY) */}
  
    {/* CONTAINER FOR TOP ROW OF BUTTONS, LEFT-HAND COLUMN */}
    <div className="action-div">
      {/* 
      //
      RECOMMENDATION BUTTON 
      //
      */}
        <ButtonsDisplay
          className={values.status === "Open" ? 'blue' : 'disabledBlue'}
          type='button'
          disabled={values.status !== "Open"}
          onClick={() => displayComponent('testRec')}
        >
          Recommend
        </ButtonsDisplay>
      {/* 
      //
      ANONYMOUS REJECTION BUTTON 
      //
      */}
        <ButtonsDisplay
          className={values.status === "Open" || (values.status === "Recommended" && isEIC) ? 'blue' : 'disabledBlue'}
          type='button'
          disabled={values.status === "Open" || (values.status === "Recommended" && isEIC) ? false : true }
          onClick={() => displayComponent('testAnon')}
        >
          Anonymous Rejection
        </ButtonsDisplay>
      </div>
  {/* 
  //
  // CONTAINER FOR TOP ROW OF BUTTONS, LEFT-HAND COLUMN
  //
  */}
    <div className="action-div">
      {/* 
      //
      LOW-TIER REJECTION BUTTON 
      //
      */}
        <ButtonsDisplay
          className={values.status === "Open" || (values.status === "Recommended" && isEIC) ? 'blue' : 'disabledBlue'}
          type='button'
          disabled={values.status === "Open" || (values.status === "Recommended" && isEIC) ? false : true }
          onClick={() => displayComponent('testLow')}
        > 
          Low-tier rejection 
        </ButtonsDisplay>
      {/* 
      //
      MIDDLE-TIER REJECTION BUTTON 
      //
      */}
        <ButtonsDisplay
          className={values.status === "Open" || (values.status === "Recommended" && isEIC) ? 'blue' : 'disabledBlue'}
          type='button'
          disabled={values.status === "Open" || (values.status === "Recommended" && isEIC) ? false : true }
          onClick={() => displayComponent('testMiddle')}
        > 
          Middle-tier rejection 
        </ButtonsDisplay>
      {/* 
      //
      HIGH-TIER REJECTION BUTTON 
      //
      */}
        <ButtonsDisplay
          className={values.status === "Open" || (values.status === "Recommended" && isEIC) ? 'blue' : 'disabledBlue'}
          type='button'
          disabled={values.status === "Open" || (values.status === "Recommended" && isEIC) ? false : true }
          onClick={() => displayComponent('testHigh')}
        > 
          High-tier rejection Test 
        </ButtonsDisplay>
</div>
  {/* 
  //
  // CONTAINER FOR BOTTOM ROW OF BUTTONS, LEFT-HAND COLUMN
  //
  */}
    <div className='action-div-middle'>
      <strong>Other Actions</strong>
    </div>          
    <div className="action-div">
      {/* 
      //
      OPEN FILE FOLDER BUTTON 
      //
      */}
      <a 
        target="_blank" 
        rel="noopener noreferrer" 
        href="https://drive.google.com/drive/u/0/folders/1ikWDoiulgbYQ-RCZkTcpwbBISUoeNyyi">
          <ButtonsDisplay 
            className= 'blue' 
            type='button' 
          > 
            Open File Folder 
          </ ButtonsDisplay>
        </a>
      {/* 
      //
      UPDATE BUTTON 
      //
      */}
        {isEIC && (
          <ButtonsDisplay
            className={values.status === "Open" ? 'blue' : values.status === "Recommended" ? 'blue' : 'disabledBlue'}
            type='button'
            disabled={values.status === "Open" || (values.status === "Recommended" && isEIC) ? false : true }
            onClick={() => displayComponent('testUpdate')}
          > 
            Update 
          </ButtonsDisplay>
        )}
      {/* 
      //
      SHOW COVER LETTER BUTTON 
      //
      */}      
        <ButtonsDisplay 
          className= 'blue' 
          type='button' 
          onClick={() => displayComponent('testCover')}
        >
          Cover Letter 
        </ButtonsDisplay>
      </div>

      <div className="action-div">
        {/* 
        //
        UNCLAIM BUTTON 
        //
        */}      
          <button 
            className={values.status === "Open" ? 'blue' : 'disabledBlue'}
            type='button'
            disabled={values.status !== "Open"}
            onClick={() => handleUnclaimSubmission(id)}
          >
            Unclaim
          </button>
          <Link to='/dashboard-claimed'>
            <button className= 'blue' type='button'> 
              Back to Dashboard 
            </ button>
          </Link>
        </div>
      </div>

    {/* DASHBOARD, TOP RIGHT SIDE (DIFFERENT DISPLAYS, DEPENDING ON BUTTON PRESS; DEFAULT IS COVER LETTER) */}
            <div className='container'>
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
              {componentToShow && (
                <div className ='allTags'>
                  <EmailTierTemplate
                    name={values.name}
                    showName={testShowName}
                    title={values.title} 
                    showTitle={testShowTitle} 
                    currentReader={currentReader}
                    showReaderName={testShowReaderName}
                    displayName={displayName}
                    thankYou={thankYouVerarbeiten}
                    showThankYou={testShowThankYou}
                    magazine={magazineVerarbeiten}
                    showMagazine={testShowMagazine}
                    unfortunately={unfortunatelyVerarbeiten}                    
                    showUnfortunately={testShowUnfortunately}                    
                    invite={happyVerarbeiten}
                    showInvite={testShowInvite}
                    subjective={subjectiveVerarbeiten}
                    showSubjective={testShowSubjective}
                    recommend={recommendVerarbeiten}
                    showRecommend={testShowRecommend}
                    coverLetterDisplay={values.coverLetter}
                    showCoverLetter={testShowCoverLetter}                    
                    readerNote={values.readerNote}
                    showReaderNote={testShowReaderNote}
                    handleChange={handleChange}
                  />
                </div>
              )}

    {/* SUBMIT BUTTON FOR SENDING REJECTIONS, RECOMMENDATIONS, DATABASE UPDATES, ETC */}
    {/* ON CLICK, ACTIVATES HANDLEVERARBEITEN FUNCTION ABOVE */}
                    <div className='action-div-top'>
                    <button className = 'red allTags' id='verarbeitenButton' style={{display : 'none'}} type='button' onClick={handleVerarbeiten}>
                      Submit
                    </ button>
    {/* SHOWS IF FORM SUBMISSION BY READER IS SUCCESSFUL. CHANGES STYLE TO NONE TO MAKE BUTTON UNCLICKABLE. */}
                    <div className = 'allTags' id='verarbeitenSuccess' style={{display : 'none'}}> 
                      Submit successful!
                    </div>
                  </div>
    {/* READER NOTES FIELD THAT IS PART OF THE READER FORM. */}
                <div>
                  <label className='form-label'>      
                    <strong>Reader Notes</strong>  
                  </label>
                  <textarea
                    value={values.readerNote}
                    name='readerNote'
                    readOnly={values.status !== "Open"}
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
    border-radius: var(--borderRadius);
    text-transform: capitalize;
    letter-spacing: var(--letterSpacing);
    text-align: center;
    width: 150px;
    padding: 10px;
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
    margin: 0px 15px 0px 10px;
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

const setStatusColor = (status) => {
  if (status === 'Open') return '#ffffff';
  if (status === 'Recommended') return '#ffffff';
  if (status === 'Rejected, First Round' || status === 'Rejected, Second Round' || status === 'Rejected, Third Round'  || status === "Rejected Anonymously") return '#ffffff';
  return '#927238';
};
const setStatusBackground = (status) => {
  if (status === 'Accepted') return '#d1e7dd';
  if (status === 'Open') return '#0096FF';
  if (status === 'Recommended') return '#CC5500';
  if (status === 'Rejected, First Round' || status === 'Rejected, Second Round' || status === 'Rejected, Third Round' || status === 'Rejected Anonymously') return '#811331';
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

export default Update;
