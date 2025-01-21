//// UPDATE UPDATE UPDATE UPDATE UPDATE UPDATE UPDATE UPDATE UPDATE UPDATE UPDATE  
//// EVERYTHING BEFORE THIS IS WHAT WAS IN THE FILE BEFORE WE STARTED WORKING ON IT!
//// I AM ADDING THIS FOR WHEN I INEVITABLY MESS IT UP, I CAN RESET IT!

import { useMemo, useState, useEffect } from 'react';
import { useParams, Redirect, useHistory } from 'react-router-dom';
import styled from 'styled-components';
import { useGlobalContext } from '../context/appContext';
import FormRowVerarbeiten from '../components/FormRowVerarbeiten';
import Navbar from '../components/Navbar';
import EmailTierTemplate from '../components/EmailTierTemplate';
import ButtonsDisplay from '../components/ButtonsDisplay';
import useAuth from '../hooks/useAuth.js';
import debounce from 'lodash.debounce';

import { displayComponentHelper } from '../components/dashboardConfig';

function Update() {
  console.log('This happened.');
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

  const thisReader = (Array.isArray(reader) && reader.length > 0) ? reader[0] : {};
  const currentReader = thisReader.name || 'Unknown';
  const currentReaderRoleRaw = thisReader.role || '';
  const currentReaderRole = currentReaderRoleRaw === 'EIC' ? 'Editor' : 
                             currentReaderRoleRaw === 'assistantEditor' ? 'Assistant Editor' : 
                             currentReaderRoleRaw === 'associateEditor' ? 'Associate Editor' : 
                             'Unknown';

  const { isEIC } = useAuth();

  const [values, setValues] = useState({
    name: '',
    email: '',
    title: '',
    wordCount: 0,
    feedback: '',
    type: '',
    reader: '',
    status: '',
    coverLetter: '',
    readerNote: '',
    file: null,
  });

  const history = useHistory();

  const debouncedDashboard = debounce(() => {
    const savedDashboardType = sessionStorage.getItem('dashboardType');
    console.log('savedDashboardType: ' + savedDashboardType)
    history.push(`/dashboard`);
    console.log("went back")
  }, 100);

  const [newStatus, setNewStatus] = useState('initial'); 
  const [testShowName, setTestShowName] = useState(false);
  const [testShowTitle, setTestShowTitle] = useState(false);  
  const [testShowThankYou, setTestShowThankYou] = useState(false);
  const [testShowMagazine, setTestShowMagazine] = useState(false);
  const [testShowUnfortunately, setTestShowUnfortunately] = useState(false);
  const [testShowInvite, setTestShowInvite] = useState(false);
  const [testShowSubjective, setTestShowSubjective] = useState(false);
  const [testShowReaderNote, setTestShowReaderNote] = useState(false);
  const [testShowRecommend, setTestShowRecommend] = useState(false);
  const [testShowCoverLetter, setTestShowCoverLetter] = useState(true);  
  const [testShowReaderName, setTestShowReaderName] = useState(false);  
  const [testShowHavenSpecTeam, setTestShowHavenSpecTeam] = useState(false);  
  const [componentToShow, setComponentToShow] = useState('firstRender');
  const [displayName, setTestShowDisplayName] = useState('Cover Letter');

  const fetchSingleSubmissionNow = useMemo(() => {
    console.log("fetchSingleSubmissionNow id: " + id)
    return (id) => {
      fetchSingleSubmission(id);  // Pass id to fetchSingleSubmission
    };
  }, [fetchSingleSubmission, id]);
  
  useEffect(() => {
    if (id) {
      console.log("fetchSingleSubmissionNow id, useEffect: " + id)
      fetchSingleSubmissionNow(id);  // Pass id to the memoized function
    }
  }, [id, fetchSingleSubmissionNow]);

  useEffect(() => {
    if (verarbeitenItem && Object.keys(verarbeitenItem).length > 0) {
      console.log("verarbeitenItem id, useEffect: " + id)
      const { name, email, title, wordCount, feedback, type, reader, status, coverLetter, readerNote, file } = verarbeitenItem;
      setValues((prevValues) => ({
        ...prevValues,
        name,
        email,
        title,
        wordCount,
        feedback,
        type,
        reader,
        status,
        coverLetter,
        readerNote,
        file,
      }));
    }
  }, [verarbeitenItem, id]);

  const handleChange = (e) => {
    setValues({ ...values, [e.target.name]: e.target.value });
  };


  const handleDashboard = () => {
    debouncedDashboard();
  };

  const thankYouVerarbeiten = "Thank you for your submission of " + values.title
  const magazineVerarbeiten = " to Haven Spec Magazine. "
  const unfortunatelyVerarbeiten = "Unfortunately, we've decided to pass on this, but we wish you the best of luck on your writing and publishing endeavors. "
  const happyVerarbeiten = "We would be happy to consider anything else you might write!"
  const subjectiveVerarbeiten = "That's just our subjective opinion, of course, but we appreciated the chance to look at your work, and we hope you send us more. "
  const recommendVerarbeiten = "This is just a quick note that we've held this piece for further consideration. You should hear from us again in the next couple of months. "

const readerNotesLabel = newStatus === 'Rejected, Third Round' ? 'Feedback Sent to Author' : 'Editor Notes';

const displayComponent = (component) => {
  displayComponentHelper({
    component,
    values,
    setStateFunctions: {
      setComponentToShow,
      setNewStatus,
      setTestShowDisplayName,
      setTestShowTitle,
      setTestShowName,
      setTestShowThankYou,
      setTestShowMagazine,
      setTestShowUnfortunately,
      setTestShowInvite,
      setTestShowSubjective,
      setTestShowReaderNote,
      setTestShowCoverLetter,
      setTestShowRecommend,
      setTestShowReaderName,
      setTestShowHavenSpecTeam,
    },
  });
};

    const handleVerarbeiten = (e, status) => {
  e.preventDefault();
  const { name, email, title, reader, readerNote } = values;
  const selectedStatus = status || newStatus;
  if (name && email && title && reader && selectedStatus) {
    verarbeitenSubmissionClient(id, { name, title, email, reader, status: selectedStatus, readerNote });
  }
  if (status !== 'open' && status !== 'EIC') {
  document.getElementById("verarbeitenButton").style.display = "none";
  document.getElementById("verarbeitenSuccess").style.display = "block";
  }
};

const handleUnclaimSubmission = async (id) => {
  try {
    await unAssignSubmissionClient(id);
    debouncedDashboard();
  } catch (error) {
    console.error('Error unclaiming submission:', error);
  }
};

  const handleSubmit = (e) => {
    e.preventDefault();
    const { name, email, title, wordCount, type, status, coverLetter, readerNote } = values;
    if (name && email && title && wordCount && type && status && coverLetter) {
      if (status === "Open") {
        var theseTags = document.getElementsByClassName('allTags');
        for (var i = 0; i < theseTags.length; i++)
        {
          theseTags.item(i).readOnly = true;
        }
        var theseButtons = document.getElementsByClassName('allButons');
        for (var j = 0; j < theseButtons.length; j++)
        {
          theseButtons.item(j).style.display = "none";
        }
      }
      verarbeitenSubmissionClient(id, { name, email, title, wordCount, type, status, reader, coverLetter, readerNote });
    }
  };

  if (isLoading && !verarbeitenItem) {
    return <div className='loading'></div>;
  }

  if (!verarbeitenItem || error) {
    return (
      <>
        <ErrorContainer className='page'>
          <h5>There was an error, please double check your submission ID. </h5>
          <button className='btn' onClick={handleDashboard}>
            dashboard
          </button>
        </ErrorContainer>
      </>
    );
  }

  return (
    <>
      {console.log('Verarbeiten triggered.')}
      {!reader && <Redirect to='/' />}
      <Navbar />
      <Container className='page'>
        <form className='form' onSubmit={handleSubmit}>
          <p>{verarbeitenComplete && 'Success! Processing Complete'}</p>

          <div className="bigGrid">

            <div className='container'>

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
              {console.log('values.feedback: ' + values.feedback)} 
              {values.feedback === null 
  ? 'Null' 
  : values.feedback === false 
  ? 'No feedback requested' 
  : values.feedback === true 
  ? 'Feedback requested' 
  : (
      <div className='form-row action-div-WC-S'>
        <label
          htmlFor='feedback'
          className='form-label'
          style={{ marginBottom: '10px' }}
        >
          <strong>Feedback</strong>
        </label>
        {values.feedback}
      </div>
    )}
            </div>
              <br />
              <div className='action-div-top'>
                <strong>
                  Click to open reply form
                </strong>
              </div>

    <div className="action-div">
        <ButtonsDisplay
          className={values.status === "Open" ? 'blue' : 'disabledBlue'}
          type='button'
          disabled={values.status !== "Open"}
          onClick={() => displayComponent('testRec')}
        >
          Recommend
        </ButtonsDisplay>

        <ButtonsDisplay
          className={values.status === "Open" || (values.status === "Recommended" && isEIC) ? 'blue' : 'disabledBlue'}
          type='button'
          disabled={values.status === "Open" || (values.status === "Recommended" && isEIC) ? false : true }
          onClick={() => displayComponent('testAnon')}
        >
          Anonymous Rejection
        </ButtonsDisplay>
      </div>

    <div className="action-div">
        <ButtonsDisplay
          className={values.status === "Open" || (values.status === "Recommended" && isEIC) ? 'blue' : 'disabledBlue'}
          type='button'
          disabled={values.status === "Open" || (values.status === "Recommended" && isEIC) ? false : true }
          onClick={() => displayComponent('testLow')}
        > 
          Low-tier rejection 
        </ButtonsDisplay>
        <ButtonsDisplay
          className={values.status === "Open" || (values.status === "Recommended" && isEIC) ? 'blue' : 'disabledBlue'}
          type='button'
          disabled={values.status === "Open" || (values.status === "Recommended" && isEIC) ? false : true }
          onClick={() => displayComponent('testMiddle')}
        > 
          Middle-tier rejection 
        </ButtonsDisplay>
        <ButtonsDisplay
          className={values.status === "Open" || (values.status === "Recommended" && isEIC) ? 'blue' : 'disabledBlue'}
          type='button'
          disabled={values.status === "Open" || (values.status === "Recommended" && isEIC) ? false : true }
          onClick={() => displayComponent('testHigh')}
        > 
          High-tier rejection 
        </ButtonsDisplay>
</div>

    <div className='action-div-middle'>
      <strong>Other Actions</strong>
    </div>          
    <div className="action-div">
      <a 
        target="_blank" 
        rel="noopener noreferrer" 
        href={values.file}>
          <ButtonsDisplay 
            className= 'blue' 
            type='button' 
          > 
            Open File Folder 
          </ ButtonsDisplay>
        </a>
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
        <ButtonsDisplay 
          className= 'blue' 
          type='button' 
          onClick={() => displayComponent('testCover')}
        >
          Cover Letter 
        </ButtonsDisplay>
      </div>

      <div className="action-div">
          <button 
            className={values.status === "Open" ? 'blue' : 'disabledBlue'}
            type='button'
            disabled={values.status !== "Open"}
            onClick={() => handleUnclaimSubmission(id)}
          >
            Unclaim
          </button>
          <button className='blue' type='button' onClick={handleDashboard} >
              Back to Dashboard 
          </button>
        </div>
      </div>

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
                    currentReaderRole={currentReaderRole}
                    showReaderName={testShowReaderName}
                    showHavenSpecTeam={testShowHavenSpecTeam}
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

                    <div className='action-div-top'>
                    <button className = 'red allTags' id='verarbeitenButton' style={{display : 'none'}} type='button' onClick={handleVerarbeiten}>
                      Submit
                    </ button>
                    <div className = 'allTags' id='verarbeitenSuccess' style={{display : 'none'}}> 
                      Submit successful!
                    </div>
                  </div>
                <div>
                  {console.log('newStatus: ' + newStatus)}
                  <label className='form-label'>
                    <strong>{readerNotesLabel}</strong>  
                  </label>
                  <textarea
                    value={values.readerNote}
                    name='readerNote'
                    readOnly={values.status !== "Open" && !isEIC}
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
