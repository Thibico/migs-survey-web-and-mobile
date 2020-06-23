import React, { Component } from 'react'
// import PropTypes from 'prop-types'
import './FreeTextQuestion.scss'
import { make2digit } from '../../helpers'

class FreeTextQuestion extends Component {
  constructor(props) {
      super(props)
      this.state = {
        questionText: "",
        questionNumber: ""
      }
    }
  
    
  componentWillMount() {
    this.setState({
      questionText: this.props.questionText,
      questionNumber: this.props.questionNumber
    })
    this.submitAnswer(
      (make2digit(this.props.questionNumber) + " - " + this.props.questionText),
      ""
    )
  }

  submitAnswer = (question,answer) => {
    this.props.submit({
      question: question,
      answer: answer,
      validAnswer: true
    })
  }

  handleChange(event) {
    this.submitAnswer(
      (make2digit(this.state.questionNumber) + " - " + this.state.questionText),
      event.target.value
    )
  }
  
  render() {

    const isLoading = !!(this.state.questionText) ? false : true;

    const {questionText,questionNumber} = this.state;
    const {l10n} = this.props;

    return (isLoading
      ? <div></div>
      : <div className="FreeTextQuestion">
          <p className="QuestionText">{l10n("Question")} {l10n(questionNumber)} - {l10n(questionText)}</p>
          
          <input type="text" onChange={this.handleChange.bind(this)} />
          <br />
          <hr/>
        </div>
    );

  }
}

FreeTextQuestion.propTypes = {}

FreeTextQuestion.defaultProps = {}

export default FreeTextQuestion
