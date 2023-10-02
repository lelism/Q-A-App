import React, { useState, useEffect } from 'react';
import './styles.css';
import { Link } from 'react-router-dom';
import QuestionForm from '../../Components/QuestionForm';
import { getQuestionsList, getAnswersList } from '../../Utils/api';
import Question from '../../Components/Question';
import { askQuestion } from '../../Utils/functions';
import IconAws from '../../Components/IconAws/IconAws';
import NewAnswer from '../../Components/NewAnswer/NewAnswer';
import Answer from '../../Components/Answer/Answer';

const Answers = ({ isLogged, userDetails }) => {
    const questionId = (new URLSearchParams(window.location.search)).get('questionId');

    const [questionForm, setQuestionForm] = useState(false);
    const [questionData, setQuestionData] = useState([]);
    const [answersList, setAnswersList] = useState([]);
    const [resetAnswers, setResetAnswers] = useState(false);

    useEffect(() => {
        const conditionForQuestions = ` WHERE question_id = ${questionId}`;
        const conditionForAnswers = '';
        getQuestionsList(setQuestionData, conditionForQuestions);
        getAnswersList(setAnswersList, questionId, conditionForAnswers);
    }, []);

    useEffect(() => {
        const conditionForAnswers = '';
        getAnswersList(setAnswersList, questionId, conditionForAnswers);
    }, [resetAnswers]);

    return (
        <div className='answers-page full'>
            <div className='answers-header'>
                <Link to={'/'}>
                    <h3>
                        <IconAws iconClass='fa-solid fa-circle-arrow-left' size='sm' />
                        {' Return to question list'}
                    </h3>
                </Link>
                <span className='q-button' onClick={ () => askQuestion(isLogged, setQuestionForm) }>Ask new question</span>
            </div>
            <h2>Question:</h2>
            <div className='flex-top-r one-question'>
                {questionData.map((questionRecord, i) => {
                    return (
                        <Question
                            key={i}
                            unlocked={isLogged}
                            userId={userDetails.userId}
                            questionData={questionRecord}
                            fromAnswers={true}
                        />);
                })}
            </div>
            <h2 className='flex-top-r'>Answers</h2>
            { (!answersList.length)
                ? <h3 className='flex-c empty'>No answers yet. Be the first to help!</h3>
                : <div className='flex-col-top-r'>
                    {answersList.map((answerRecord, i) => {
                        return (
                            <Answer
                                key={i}
                                unlocked={isLogged}
                                userId={userDetails.userId}
                                answerData={answerRecord}
                                initResetA={setResetAnswers}
                            />);
                    })}
                </div>
            }
            <h2>Provide your answer:</h2>
            <NewAnswer isLogged={ isLogged } questionId={ questionId } author={ userDetails.userId } initReset={ setResetAnswers } />
            {questionForm && <QuestionForm author={userDetails.userId} setForm={setQuestionForm} initReset={setResetAnswers} />}
        </div>
    );
};

export default Answers;
