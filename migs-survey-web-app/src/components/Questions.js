import React, { Component } from 'react';
import '../App.css';
import { l10nMain, replaceMMNumbers } from '../localization';
import BarchartQuestion from './BarchartQuestion/BarchartQuestion';
import FreeTextQuestion from './FreeTextQuestion/FreeTextQuestion';
import OptionsQuestion from './OptionsQuestion/OptionsQuestion';

class AllQuestions extends React.Component {
	render() {

    const {calcQuestionWidthFunc,questionWidthScaleFactor,width,l10n,submitAnswer} = this.props;
    const calcQuestionWidth = () => calcQuestionWidthFunc(questionWidthScaleFactor,width)

		return <div>
      <FreeTextQuestion
				questionNumber={"0(a)"}
				questionText="Enumerator Name"
				questionWidth={calcQuestionWidth()}
				l10n={l10n}
				submit={submitAnswer}
			/>

			<OptionsQuestion
				questionNumber={"0(b)"}
				questionText="Which state/region is this questionnaire being administered in?"
				options={[
					"Ayeyarwaddy",
					"Chin",
					"Kayin", 
					"Mandalay",
					"Mon"
				]}
				allowOther={false}
				questionWidth={calcQuestionWidth()}
				l10n={l10n}
				submit={submitAnswer}
			/>

			<BarchartQuestion
				questionNumber={1}
				questionText="Allocate the union budget across the following ministries"
				options={[
					{id:1,optionText:"Electricity and Energy",points:23,type:"percent"},
					{id:2,optionText:"Defence",points:9,type:"percent"},
					{id:3,optionText:"Education",points:7,type:"percent"},
					{id:4,optionText:"Construction",points:7,type:"percent"},
					{id:5,optionText:"Agriculture, Livestock and Irrigation",points:3,type:"percent"},
					{id:6,optionText:"Health and Sports",points:3,type:"percent"}
				]}
				questionWidth={calcQuestionWidth()}
				l10n={l10n}
				submit={submitAnswer}
			/>

			{/* <BarchartQuestion
				questionNumber={2}
				questionText="Allocate the Kayin regional government budget across the following ministries"
				options={[
					{id:1,optionText:"Construction",points:55,type:"percent"},
					{id:2,optionText:"Electricity",points:13,type:"percent"},
					{id:3,optionText:"State Government Bodies",points:12,type:"percent"},
					{id:4,optionText:"Home Affairs",points:8,type:"percent"},
					{id:5,optionText:"Municipal-DAOs",points:6,type:"percent"},
					{id:6,optionText:"Agriculture, Livestock and Irrigation",points:3,type:"percent"}
				]}
				questionWidth={calcQuestionWidth()}
				l10n={l10n}
				submit={submitAnswer}
			/> */}

			<BarchartQuestion
				questionNumber={2}
				questionText="Allocate the budget between Union and Region/State level governments"
				options={[
					{id:1,optionText:"Union",points:88,type:"percent"},
					{id:2,optionText:"Region/State",points:12,type:"percent"}
				]}
				questionWidth={calcQuestionWidth()}
				l10n={l10n}
				submit={submitAnswer}
			/>

			<FreeTextQuestion
				questionNumber={3}
				questionText="Ward/Village code number"
				questionWidth={calcQuestionWidth()}
				l10n={l10n}
				submit={submitAnswer}
			/>

			<FreeTextQuestion
				questionNumber={4}
				questionText="What is your age?"
				questionWidth={calcQuestionWidth()}
				l10n={l10n}
				submit={submitAnswer}
			/>

			<OptionsQuestion
				questionNumber={5}
				questionText="What is your Sex?"
				options={[
					"Male",
					"Female",
					"Did not answer"
				]}
				allowOther={false}
				questionWidth={calcQuestionWidth()}
				l10n={l10n}
				submit={submitAnswer}
			/>

			<OptionsQuestion
				questionNumber={6}
				questionText="What is your Relationship to the Head of Household?"
				options={[
					"Head",
					"Wife/Husband",
					"Daughter/Son",
					"Elder or Younger Sister/Elder or Younger Brother",
					"Daughter-in-law/Son-in-law",
					"Sister-in-law/Brother-in-law",
					"Grandchild",
					"Parent",
					"Parent-in-law",
					"Other relative",
					"Adopted/foster/step child",
					"Not related",
					"Don’t know",
					"Did not answer",
				]}
				allowOther={false}
				questionWidth={calcQuestionWidth()}
				l10n={l10n}
				submit={submitAnswer}
			/>

			<OptionsQuestion
				questionNumber={7}
				questionText="What is your Marital Status?"
				options={[
					"Married or living together",
					"Divorced/separated",
					"Widowed",
					"Never married and never lived together",
					"Did not answer"
				]}
				allowOther={false}
				questionWidth={calcQuestionWidth()}
				l10n={l10n}
				submit={submitAnswer}
			/>

			<FreeTextQuestion
				questionNumber={8}
				questionText="What is your ethnicity?"
				questionWidth={calcQuestionWidth()}
				l10n={l10n}
				submit={submitAnswer}
			/>

			<OptionsQuestion
				questionNumber={9}
				questionText="What is your religion?"
				options={[
					"Buddhist",
					"Christian",
					"Muslim",
					"Hindu",
					"Animist",
					"Other religion",
					"No religion",
					"Did not answer"
				]}
				allowOther={true}
				questionWidth={calcQuestionWidth()}
				l10n={l10n}
				submit={submitAnswer}
			/>

			<OptionsQuestion
				questionNumber={10}
				questionText="What is the highest level of education you have completed?"
				options={[
					"Less than 1st standard",
					"1st standard",
					"2nd standard",
					"3rd standard",
					"4th standard",
					"5th standard",
					"6th standard",
					"7th standard",
					"8th standard",
					"9th standard",
					"10th standard",
					"Bachelor’s degree",
					"Postgraduate degree",
					"Vocational qualification",
					"Did not answer"
				]}
				allowOther={false}
				questionWidth={calcQuestionWidth()}
				l10n={l10n}
				submit={submitAnswer}
			/>

			<OptionsQuestion
				questionNumber={11}
				questionText="What was your activity status during the last 12 months?"
				options={[
					"1 - employee (government)",
					"2 - employee (private, org)",
					"3 - employer",
					"4 - own account worker",
					"5 - contributing family worker",
					"6 - sought work",
					"7 - did not seek work",
					"8 - full-time student",
					"9 - household work",
					"10 - pensioner, retired, elderly person",
					"11 - ill, disabled",
					"12 - other",
					"Did not answer"
				]}
				allowOther={true}
				questionWidth={calcQuestionWidth()}
				l10n={l10n}
				submit={submitAnswer}
			/>

			<FreeTextQuestion
				questionNumber={12}
				questionText="(For those that responded with 1-5 or 12 to Q11), What work were you mainly doing in the last 12 months?"
				questionWidth={calcQuestionWidth()}
				l10n={l10n}
				submit={submitAnswer}
			/>

			<OptionsQuestion
				questionNumber={13}
				questionText="Do you own a mobile telephone?"
				options={[
					"Yes",
					"No",
					"Did not answer"
				]}
				allowOther={false}
				questionWidth={calcQuestionWidth()}
				l10n={l10n}
				submit={submitAnswer}
			/>

			<OptionsQuestion
				questionNumber={14}
				questionText="Does anyone else in your household own a mobile telephone?"
				options={[
					"Yes",
					"No",
					"Did not answer"
				]}
				allowOther={false}
				questionWidth={calcQuestionWidth()}
				l10n={l10n}
				submit={submitAnswer}
			/>

			<FreeTextQuestion
				questionNumber={15}
				questionText="How many people live in this household in total?"
				questionWidth={calcQuestionWidth()}
				l10n={l10n}
				submit={submitAnswer}
			/>

			<OptionsQuestion
				questionNumber={16}
				questionText="What is the highest education level that the female household head or spouse of household head has completed?"
				options={[
					"No female head/spouse",
					"No education/kindergarten/first standard",
					"Second standard",
					"Third to fifth standard",
					"Sixth standard or higher",
					"Did not answer"
				]}
				allowOther={false}
				questionWidth={calcQuestionWidth()}
				l10n={l10n}
				submit={submitAnswer}
			/>

			<OptionsQuestion
				questionNumber={17}
				questionText="How many rooms does the household occupy, including bedrooms, living rooms, and rooms used for household businesses (do not count toilets, kitchens, balconies, or corridors)?"
				options={[
					"One or none",
					"Two",
					"Three",
					"Four",
					"Five or more",
					"Did not answer"
				]}
				allowOther={false}
				questionWidth={calcQuestionWidth()}
				l10n={l10n}
				submit={submitAnswer}
			/>

			<OptionsQuestion
				questionNumber={18}
				questionText="What type of stove is used most often for cooking food in the household?"
				options={[
					"Open fire, open stove, rice-hush stove or traditional closed stove",
					"Improved stove, stove with electricity, gas, kerosene/diesel or biofuel",
					"Did not answer"
				]}
				allowOther={false}
				questionWidth={calcQuestionWidth()}
				l10n={l10n}
				submit={submitAnswer}
			/>

			<OptionsQuestion
				questionNumber={19}
				questionText="Does any household member own or have access to a bicycle or non-motorized boat, a motorcycle, power tiller, trishaw, motorboat, trawlarjee, three-wheeled motor vehicle, motorcar (4 wheels or more), or tractor (including one rented to others or pawned)?"
				options={[
					"None of these",
					"Only bicylce or non-motorized boat",
					"Motorcycle, power tiller, thrishaw, motroboat, trawlarjee, three-wheeld motor vehicle, motorcar or tractor",
					"Did not answer"
				]}
				allowOther={false}
				questionWidth={calcQuestionWidth()}
				l10n={l10n}
				submit={submitAnswer}
			/>

			<OptionsQuestion
				questionNumber={20}
				questionText="Is the main job of any household member connected with agriculture, hunting, forestry, fishery, mining, or quarrying?"
				options={[
					"Connected",
					"Not connected",
					"Did not answer"
				]}
				allowOther={false}
				questionWidth={calcQuestionWidth()}
				l10n={l10n}
				submit={submitAnswer}
			/>

			<OptionsQuestion
				questionNumber={21}
				questionText="If yes to Q20, do they have the right to use land for agriculture, forestry, pasture, livestock breeding, or water surfaces?"
				options={[
					"Yes, they have the right",
					"No, they do not have the right",
					"Did not answer"
				]}
				allowOther={false}
				questionWidth={calcQuestionWidth()}
				l10n={l10n}
				submit={submitAnswer}
			/>

			<OptionsQuestion
				questionNumber={22}
				questionText="If yes to Q21, does the household own any non-draught oxen, non-draught buffalo, cows, mythun, horses, or donkeys/mules (including ones rented to others or pawned to others)?"
				options={[
					"Yes to ownership",
					"No to ownership",
					"Did not answer"
				]}
				allowOther={false}
				questionWidth={calcQuestionWidth()}
				l10n={l10n}
				submit={submitAnswer}
			/>

			<OptionsQuestion
				questionNumber={23}
				questionText="What is the major construction material of the floor of their home (observe, do not ask)?"
				options={[
					"Earth/sand, palm/bamboo, combination earth and wood/palm/bamboo or other",
					"Wood planks, parquet or polished wood, cement, wood/cement with covering or combination of cement/wood and something else"
				]}
				allowOther={false}
				questionWidth={calcQuestionWidth()}
				l10n={l10n}
				submit={submitAnswer}
			/>

			<OptionsQuestion
				questionNumber={24}
				questionText="What is the major construction material of the external (outer) walls of their home (observe, do not ask)?"
				options={[
					"Thatch/large leaves/palm/dhani or tarpaulin",
					"Bamboo or rudimentary wood",
					"Unbaked brick and mud, finished wood",
					"Baked brick and cement or pucca cement"
				]}
				allowOther={false}
				questionWidth={calcQuestionWidth()}
				l10n={l10n}
				submit={submitAnswer}
			/>

			<OptionsQuestion
				questionNumber={25}
				questionText="Was the survey done at the first house you visited?"
				options={[
					"Yes, it was",
					"No, it was not"
				]}
				allowOther={false}
				questionWidth={calcQuestionWidth()}
				l10n={l10n}
				submit={submitAnswer}
			/>
		</div>
	}
}

export default AllQuestions