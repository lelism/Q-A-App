import React, { useEffect, useState } from 'react';
import './styles.css';
import QuestionForm from '../../Components/QuestionForm';
import { getQuestionsList } from '../../Utils/api';
import Question from '../../Components/Question';
import SortSelector from '../../Components/SortSelector/SortSelector';
import { askQuestion } from '../../Utils/functions';

const Questions = ({ isLogged, userDetails }) => {
    const [questionForm, setQuestionForm] = useState(false);
    const [questionsList, setQuestionsList] = useState([]);
    const [sortRules, setSortRules] = useState({});
    const [filterEmpty, setFilterEmpty] = useState(false);
    const [resetQuestions, setResetQuestions] = useState(false);

    const sortOptions = [
        {
            optionNo: 0,
            label: 'Publication date',
            sortQueries: ['', 'published ASC', 'published DESC'],
        },
        {
            optionNo: 1,
            label: 'Total answers',
            sortQueries: ['', 'answerCount ASC', 'answerCount DESC'],
        },
    ];

    useEffect(() => {
        let condition = '';
        const rules = Object.values(sortRules);
        rules.forEach((rule) => {
            condition += rule !== '' ? ', ' + rule : '';
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
                <div className="sorting-row">
                    <span
                        className={`answer-button + ${
                            filterEmpty && 'selected'
                        }`}
                        onClick={() => {
                            setFilterEmpty(!filterEmpty);
                        }}
                    >
                        Filter empty
                    </span>
                    <span>Sort by: </span>
                    {sortOptions.map((option, i) => {
                        return (
                            <SortSelector
                                key={i}
                                setSortRules={setSortRules}
                                sortOption={option}
                            />
                        );
                    })}
                </div>
                {questionsList.map((questionData, i) => {
                    if (questionData.answerCount === 0 && filterEmpty) {
                        return <></>;
                    } else {
                        return (
                            <Question
                                key={i}
                                unlocked={isLogged}
                                userId={userDetails.userId}
                                questionData={questionData}
                                initResetQ={setResetQuestions}
                            />
                        );
                    }
                })}
                <span>
                    {questionForm && (
                        <QuestionForm
                            author={userDetails.userId}
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
