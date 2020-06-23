import React, { Component } from 'react';
import Select from 'react-select';
import './App.css';
import { l10nMain, replaceMMNumbers } from './localization';
import firebase from './Firebase';
import * as moment from 'moment';
import Countdown from 'react-countdown-now';
import { CSVLink, CSVDownload } from "react-csv";
import Rabbit from "rabbit-node";
import AllQuestions from './components/Questions';

class App extends Component {

  constructor(props) {
    super(props);
    firebase.firestore().enablePersistence()
      .catch(function(err) {
          if (err.code == 'failed-precondition') {
              // Multiple tabs open, persistence can only be enabled
              // in one tab at a a time.
              // ...
              console.error(err);
	      console.log('failed-precondition');
          } else if (err.code == 'unimplemented') {
              // The current browser does not support all of the
              // features required to enable persistence
              // ...
              console.error(err);
	      console.log('unimplemented');
          }
      });

    const SUBMISSION_COLLECTION = 'survey_2020';

    this.ref = firebase.firestore().collection(SUBMISSION_COLLECTION);

    this.unsubscribe = null;
    this.state = {
      dimensions: {
				height: window.innerHeight,
				width: window.innerWidth
      },
      questionWidthScaleFactor: 0.9,
      selectedLanguage: {
        label:"English",
        value:"en"
      },
      answers: {},
      _startTime: '',
      answering: false,
      exportData: [],
      queriedData: [],
      queriedDataLastFetched: moment(),
      queriedDataFromCache: false,
      queriedDataPendingWrites: false,
      firstLoad: true,
      submitRetries: 0,
      maxSubmitRetries: 5,
      submitting: false,
      pendingSubmissions: {},
      submissionIds: [],
      submissionsTotalToday: []
    }
    this.updateDimensions = this.updateDimensions.bind(this);
  }

  languageOptions = [
    { value: 'en', label: 'English' },
    { value: 'mm', label: 'Myanmar Unicode' },
    { value: 'zg', label: 'Zawgyi'}
  ]

  componentDidMount() {
    window.addEventListener("resize", this.updateDimensions);
    // let currentData = [];
    this.getDataForExport();
    this.ref.onSnapshot({includeMetadataChanges: true}, snapshot => {
      var returnData = snapshot.docs.map(doc => doc.data());
      console.log(`changed data to length ${returnData.length} with ${snapshot.metadata.hasPendingWrites}`)
      this.setState({
        queriedData: returnData,
        queriedDataFromCache: snapshot.metadata.fromCache,
        queriedDataLastFetched: moment(),
        queriedDataPendingWrites: snapshot.metadata.hasPendingWrites
      });
    });

    //Code to transfer results
    /*this.ref.orderBy("_startTime", "desc").limit(15).get().then(
      function(snapshot) {
        snapshot.forEach(function(doc) {
          firebase.firestore().collection('SUBMISSION_COLLECTION').add(doc.data()).then(
            console.log(`Added ${doc.data()['_startTime']}`)
          );
          //doc.ref.delete();

        })
      }
    );*/
  }

  getDataForExport = () => {
    // let exportPromises;
    let exportData = [];
    this.ref.onSnapshot(d => {
      Promise
        .all(d.docs.map(doc => doc.data()))
        .then(result => {
          function checkDate(submission) {
            var date = new Date(submission['_startTime']);
            var dateMilli = date.getMilliseconds(); //in ms
            var startOfDay = moment().startOf('day').format('x');
            return date > startOfDay;
          }
          var submissionsToday = result.filter(checkDate);
          this.setState({
            exportData: result,
            submissionsTotalToday: submissionsToday.length
          })
        })
    });

    return exportData;
  }

  afterCoolDown = () => {
    // if (this.state.firstLoad) this.setState({firstLoad: false});
    return <button
        className="mdl-button mdl-js-button mdl-button--raised submitButton"
        disabled={!this.isButtonDisabled()}
        onClick={this.startQuestionnare.bind(this)}
      >{this.l10n("Start Questionnaire")}</button>
  }

  renderer = ({ hours, minutes, seconds, completed }) => {
    if (completed) {
      // Render a completed state
      return this.afterCoolDown();
    } else {
      // Render a countdown
      return <div>
          {this.l10n("Data submitted")} <br/>
          {replaceMMNumbers(seconds)} {this.l10n("seconds")}
        </div>;
    }
  };

  l10n = (s) => l10nMain(s, this.state.selectedLanguage.value);

  submitAnswer = (a) => {
    let answers = this.state.answers;
    const answerMMNumReplaced = typeof(a.answer) === 'string' ? replaceMMNumbers(a.answer) : a.answer;
    answers[a.question] = {answer: answerMMNumReplaced, validAnswer: a.validAnswer};;
    this.setState({
      answers: answers
    })
    // console.log('answers: ', answers);

    // this.getDataForExport();
  }

  calcQuestionWidth(questionWidthScaleFactor,width) {
    // const maxWidth = this.state.dimensions.width
    //   * this.state.questionWidthScaleFactor
    //   - 20;
    const maxWidth = width * questionWidthScaleFactor - 20;
    return Math.min(400,maxWidth);
  }

  updateDimensions() {
    this.setState({
      dimensions: {
				height: window.innerHeight,
				width: window.innerWidth
			}
    });
  }

  handleLanguageChange = (selectedOption) => {
    this.setState({ selectedLanguage: selectedOption });
  }

  isButtonDisabled = () => {
    return Object.values(this.state.answers)
      .map(d => d.validAnswer)
      .reduce((isStillTrue, next) => isStillTrue && next,true);
  }

  getAnswersOnly = (answers) => {
    const questions = Object.keys(answers);
    let newAnswers = {};
    questions.forEach(q => {
      if (typeof(answers[q].answer) === 'object') {
        answers[q].answer.forEach(d => {
          newAnswers[q+"~"+d.optionText] = d.points.toString();
        })
      } else {
        newAnswers[q] = answers[q].answer.toString();
      }
    });
    return newAnswers;
  }

  submitQuestionnare = () => {
    // Build submission
    let submission = {
      ...this.getAnswersOnly(this.state.answers),
      _startTime: new Date(this.state._startTime.format()),
      _startTimeString: this.state._startTime.format(),
      _submitTime: new Date(moment().format()),
      _submitTimeString: moment().format(),
      _appLastUpdated: '2-Jan-2020'
    };

    // Change state of app
    // and record pending submission
    let updatePendingSubmissions =  this.state.pendingSubmissions;
    let submissionKey = submission._startTime.toString();
    updatePendingSubmissions[submissionKey] = submission;
    this.setState({
      answering: false,
      pendingSubmissions: updatePendingSubmissions
    });

    console.log(`adding ${submissionKey}`);

    // // Add submission to backend. To add listeners here
    // this.ref.add(submission)
    // .then( (docRef) => {
    //   // if write successful, change state
    //   docRef.get().then((doc) => {
    //     let updatePendingSubmissions = this.state.pendingSubmissions;
    //     let updateSubmissionIds = this.state.submissionIds;

    //     let startTimeOfSubmission = doc.data()._startTime;
    //     let submissionKey = startTimeOfSubmission.toDate().toString();
    //     delete updatePendingSubmissions[submissionKey];
    //     updateSubmissionIds.push(submissionKey);
    //     console.log(`Synced ${startTimeOfSubmission}`);
    //     this.setState({
    //     pendingSubmissions: updatePendingSubmissions,
    //       submissionIds: updateSubmissionIds
    //     });
    //     alert(`Submitted response from ${submissionKey}`);
    //   });
    // })
    // .catch((error) => {
    //   console.error(`Error adding document: ${error}\n`);
    // });
    console.log(this.state.pendingSubmissions);
    window.ReactNativeWebView.postMessage(JSON.stringify(submission));
    console.log(JSON.stringify(submission));

  }

  startQuestionnare = () => {
    this.setState({
      _startTime: moment(),
      answering: true,
      firstLoad: false
    });
  }



  render() {

    return (
      <div className="App">
        <header className="mdl-layout__header App-header">
          {/* <img src={logo} className="App-logo" alt="logo" /> */}
          {/*<Helmet>
            <link href="https://fonts.googleapis.com/css?family=Padauk&display=swap" rel="stylesheet"></link>
          </Helmet>*/}
          <span className="mdl-layout-title">
            MIGS Survey Application
          </span>
        </header>
        <div className="mdl-layout__content App-body">

        <label className='pickerWrapper'>
          မြန်မာ/English:
          <Select
            value={this.state.selectedLanguage}
            onChange={this.handleLanguageChange}
            options={this.languageOptions}
            className='picker'
          />
        </label>

        <br/>
          {
            this.state.answering
            ? <div>
              <span className="mdl-chip">
                  <span className="mdl-chip__text">
                    {this.l10n("This survey started at")} {this.state._startTime.format("DD MMM YYYY hh:mm:ss A")}
                  </span>
              </span>
              <hr/>
              
              <AllQuestions 
                calcQuestionWidthFunc={this.calcQuestionWidth}
                questionWidthScaleFactor={this.state.questionWidthScaleFactor}
                width={this.state.dimensions.width}
                l10n={this.l10n}
                submitAnswer={this.submitAnswer}
              />

              <button
                className="mdl-button mdl-js-button mdl-button--raised submitButton"
                disabled={!this.isButtonDisabled()}
                onClick={this.submitQuestionnare.bind(this)}
              >{this.l10n("Submit Questionnaire")}</button>
            </div>
          : <div>
              { this.state.firstLoad
                ? this.afterCoolDown()
                //TODO: set back to 10 s (more like 10000ms)
                : //TODO: REMOVE THIS COMMENTED OUT LINE <Countdown date={Date.now() + 1000} renderer={this.renderer}/>
                this.afterCoolDown()
              }
          </div>

          }
          <br/>

          {/* <div className="surveyStatus">
            <div className="singleStatus">
              <span className='mdl-chip mdl-color--green mdl-color-text--white'>
                <span className='mdl-chip__text'>
                  {this.l10n("Submitted total today")} : <strong>{this.state.submissionsTotalToday - Object.keys(this.state.pendingSubmissions).length}</strong>
                </span>
              </span>
            </div>
            <div className="singleStatus">
              <span className='mdl-chip mdl-color--orange mdl-color-text--white'>
                <span className='mdl-chip__text'>
                  {this.l10n("Pending")} : <strong>{Object.keys(this.state.pendingSubmissions).length}</strong>
                </span>
              </span>
            </div>
          </div> */}
          <div className="singleStatus">
            <span className='mdl-chip'>
              <span className='mdl-chip__text'>
                {this.l10n("Submitted total all time")} : <strong>{this.state.queriedData.length}</strong>
              </span>
            </span>
          </div>

          <div className="downloadLink">
            {this.state.queriedData.length > 0 ?
              <CSVLink className="mdl-button mdl-js-button mdl-button--raised mdl-button--colored"
              filename={`migs_data_fetched_on${this.state.queriedDataLastFetched.format('MMMM Do YYYY, h.mm a')}.csv`}
              data={this.state.queriedData}
              onClick={()=>{alert(`Downloading ${this.state.queriedData.length} rows${this.state.queriedDataPendingWrites ? ' (including pending entries)': ''} last retrieved from the database on ${this.state.queriedDataLastFetched.format('MMMM Do YYYY, h.mm a')}.`)}}>Download all results</CSVLink>

              : null
            }
          </div>
        </div>
      </div>
    );
  }
}

export default App;
