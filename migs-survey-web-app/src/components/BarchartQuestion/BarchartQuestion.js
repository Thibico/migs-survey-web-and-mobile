import React, { Component } from 'react'
// import PropTypes from 'prop-types'
import './BarchartQuestion.scss'
import { max } from 'd3-array'
import _ from 'lodash'
import { make2digit } from '../../helpers'

class BarchartQuestion extends Component {
  constructor(props) {
    super(props)
    this.state = {
      questionText: "",
      questionNumber: "",
      unableToAnswer: false,
      initialOptions: [],
      options: [],
      totalPoints: 0,
      remainingPoints: 0,
      maxPoints: 1
    }
  }



  componentWillMount() {
    this.setState({
      questionText: this.props.questionText,
      questionNumber: this.props.questionNumber,
      initialOptions: this.getNewArray(this.props.options),
      options: this.getNewArray(this.props.options),
      totalPoints: this.calcTotalPoints(this.props.options),
      maxPoints: this.calcMaxPoints(this.props.options)
    })
    this.submitAnswer(
      (make2digit(this.props.questionNumber) + " - " + this.props.questionText),
      this.props.options,
      this.calcRemainingPoints(this.props.initialOptions)
    );
  }

  getNewArray = (oldArray) => {
    let newArray = [];
    oldArray.forEach(d => newArray.push({...d}))
    return newArray;
  }

  calcTotalPoints = (options) => {
    return _.sumBy(options, 'points');
  }

  calcMaxPoints = (options,remainingPoints) => {
    remainingPoints = remainingPoints ? remainingPoints : this.state.remainingPoints;
    const maxPoint = max([...options.map(d => d.points), remainingPoints]);
    return Math.ceil(maxPoint/20)*20;
  }

  calcRemainingPoints = (options) => {
    const newTotalPoints = this.calcTotalPoints(options);
    const remainingPoints = this.state.totalPoints - newTotalPoints;
    return remainingPoints;
  }

  changeOptions = (optionId,delta) => {
    let options = this.state.options;
    options.forEach(d => {
      if (d.id === optionId) d.points += delta;
    })

    const remainingPoints = this.calcRemainingPoints(options);
    this.setState({
      options: options,
      remainingPoints: remainingPoints,
      maxPoints: this.calcMaxPoints(options,remainingPoints)
    })

    this.submitAnswer(
      (make2digit(this.state.questionNumber) + " - " + this.state.questionText),
      options,
      remainingPoints
    );

  }

  changeUnableToAnswer = (event) => {

    const unableToAnswer = event.target.checked;
    this.setState({unableToAnswer: unableToAnswer});
    const options = this.state.options;
    const remainingPoints = this.calcRemainingPoints(options);

    // console.log(this.state);
    this.submitAnswer(
      (make2digit(this.state.questionNumber) + " - " + this.state.questionText),
      options,
      remainingPoints,
      unableToAnswer
    );
  }

  resetButton = () => {
    console.log("reset")
    const remainingPoints = this.calcRemainingPoints(this.state.initialOptions);
    this.setState({
      options: this.getNewArray(this.state.initialOptions),
      remainingPoints: remainingPoints,
      maxPoints: this.calcMaxPoints(this.state.initialOptions,remainingPoints)
    })

    this.submitAnswer(
      (make2digit(this.state.questionNumber)  + " - " + this.state.questionText),
      this.state.initialOptions,
      remainingPoints
    );
  }

  submitAnswer = (question,answer,remainingPoints,unableToAnswer) => {
    const answerSimplified = answer.map(a => _.pick(a, ['optionText', 'points']));

    unableToAnswer = ( typeof unableToAnswer === 'undefined' || unableToAnswer === null )
      ? this.state.unableToAnswer
      : unableToAnswer;

    answerSimplified.push({
      optionText: "Unable to Answer",
      points: unableToAnswer
    })
    this.props.submit({
      question: question,
      answer: answerSimplified,
      validAnswer: remainingPoints === 0 ? true : false
    })
  }

  isButtonDisabled = (optionId,delta) => {
    let options = this.state.options;
    const selectedOption = _.find(options, ['id', optionId]);

    if (selectedOption.points + delta < 0) return true;
    if (delta > this.state.remainingPoints) return true;
    // if (this.state.remainingPoints + delta < 0) return true;

    return false;
  }

  barChartBar = (caption,width,totalVal,filteredVal,maxVal) => {
    const {l10n} = this.props;
    const barheight = 30;
    return <svg className='charFiltersBar' width={width} height={barheight} key={'barCharBar'+caption}>
      <g key={'barCharBar'+caption+'Wrapper'}>
        <rect key={'barCharBar'+caption+'selectedRect'} x="0" y="0" width={filteredVal/(maxVal*1.1)*width} height={barheight} className="barChartBar"></rect>
        {/* <rect key={'barCharBar'+caption+'unselectedRect'} x={filteredVal/maxVal*width} y="0" width={(totalVal-filteredVal)/maxVal*width} height={barheight} className="barChartBar notSelected"></rect> */}
        <text key={'barCharBar'+caption+'selectedLabel'} x="5" y={barheight*.66} className="barChartBarLabel">{l10n(caption)}</text>
        <text key={'barCharBar'+caption+'totalLabel'} x={width - 5} y={barheight*.66} className="barChartBarLabel count">{l10n(filteredVal)}%</text>
      </g>
    </svg>
  }

  render() {

    const isLoading = !!(this.state.options.length > 0) ? false : true;

    const {questionText,questionNumber,options} = this.state;
    const {l10n} = this.props;

    return (isLoading
      ? <div></div>
      : <div className="BarchartQuestion">
          <p className="QuestionText">{l10n("Question")} {l10n(questionNumber)} - {l10n(questionText)}</p>
          {options.map(d => {
              return <div className="BarchartQuestionItem" key={"BarchartQuestionItem"+d.id}>
              {/* {d.optionText}: {d.points}% */}
              {this.barChartBar(d.optionText, this.props.questionWidth, 100,d.points,this.state.maxPoints)}
                <div className="BarchartQuestionItemButtons">
                  <button
                    className="changeValueButton"
                    disabled={this.isButtonDisabled(d.id,-10)}
                    onClick={this.changeOptions.bind(this,d.id,-10)}
                  >--</button>
                  <button
                    className="changeValueButton"
                    disabled={this.isButtonDisabled(d.id,-1)}
                    onClick={this.changeOptions.bind(this,d.id,-1)}
                  >-</button>
                  <button
                    className="changeValueButton"
                    disabled={this.isButtonDisabled(d.id,1)}
                    onClick={this.changeOptions.bind(this,d.id,1)}
                  >+</button>
                  <button
                    className="changeValueButton"
                    disabled={this.isButtonDisabled(d.id,10)}
                    onClick={this.changeOptions.bind(this,d.id,10)}
                  >++</button>
                </div>
              </div>
            }
          )}
          <div className="BarchartQuestionItem" key={"BarchartQuestionItemRemaining"}>
            {this.barChartBar("Unused Percentage Points", this.props.questionWidth, 100,this.state.remainingPoints,this.state.maxPoints)}
          </div>
          <div className="BarchartQuestionItem" key={"BarchartQuestionItemUnableToAnswer"}>
            <label key={"BarchartQuestionItemUnableToAnswerCheckBoxLabel"}>
              <input type='checkbox'
                key={"BarchartQuestionItemUnableToAnswerCheckBox"}
                onChange={this.changeUnableToAnswer.bind(this)}
                defaultChecked={false}
              />
              {l10n("Unable to answer")}
            </label>
          </div>


          <br />
          <button
            className="mdl-button mdl-js-button mdl-button--raised ResetButton"
            onClick={this.resetButton.bind(this)}
          >{l10n("Reset")}</button>
          <hr/>
        </div>


    );
  }
}

BarchartQuestion.propTypes = {}

BarchartQuestion.defaultProps = {}

export default BarchartQuestion
