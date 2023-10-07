import React, { useEffect, useState } from 'react';
import './styles.css';
import QuestionForm from '../../Components/QuestionForm';
import { getQuestionsList } from '../../Utils/api';
import { askQuestion } from '../../Utils/functions';
import QuestionsTable from '../../Components/QuestionsTable';

const Questions = ({ isLogged, userDetails }) => {
    const [questionForm, setQuestionForm] = useState(false);
    const [questionsList, setQuestionsList] = useState([]);
    const [sortRules, setSortRules] = useState({});
    const [filterEmpty, setFilterEmpty] = useState(false);
    const [resetQuestions, setResetQuestions] = useState(false);

    useEffect(() => {
        console.log(userDetails);
        let condition = '';
        const rules = Object.values(sortRules);
        rules.forEach((rule) => {
            rule !== '' ? (condition += ', ' + rule) : (condition += '');
        });
        if (condition.length) {
            condition = 'ORDER BY ' + condition.slice(2);
        }
        getQuestionsList(setQuestionsList, condition);
    }, [sortRules, resetQuestions]);

    return (
        <>
            <div className="questions-page full">
                <div className="questions-header">
                    <h1 className="">All questions</h1>
                    <span
                        className="q-button"
                        onClick={() => askQuestion(isLogged, setQuestionForm)}
                    >
                        Ask question
                    </span>
                </div>

                {questionsList.status === 'fail' && (
                    <div className="flex-col-c">
                        <h2>Sorry, there is nothing to be displayed:</h2>
                        <br></br>
                        <h3>{questionsList.message}</h3>
                    </div>
                )}

                {questionsList.length && (
                    <QuestionsTable
                        unlocked={isLogged}
                        userId={userDetails.userId}
                        setResetQuestions={setResetQuestions}
                        setSortRules={setSortRules}
                        filterEmpty={filterEmpty}
                        setFilterEmpty={setFilterEmpty}
                        questionsList={questionsList}
                    />
                )}
                <span>
                    {questionForm && (
                        <QuestionForm
                            setForm={setQuestionForm}
                            initReset={setResetQuestions}
                        />
                    )}
                </span>
            </div>
        </>
    );
};

export default Questions;
