import React from 'react';
import './styles.css';
import Question from '../Question';
import SortSelector from '../../Components/SortSelector/SortSelector';

const QuestionsTable = ({
    unlocked,
    userId,
    setResetQuestions,
    setSortRules,
    filterEmpty,
    setFilterEmpty,
    questionsList,
}) => {
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
    return (
        <>
            <div className="sorting-row">
                <span
                    className={`answer-button + ${filterEmpty && 'selected'}`}
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

            {questionsList.length &&
                questionsList.map((questionData, i) => {
                    if (questionData.answerCount === 0 && filterEmpty) {
                        return <></>;
                    } else {
                        return (
                            <Question
                                key={i}
                                unlocked={unlocked}
                                userId={userId}
                                questionData={questionData}
                                initResetQ={setResetQuestions}
                            />
                        );
                    }
                })}
        </>
    );
};

export default QuestionsTable;
