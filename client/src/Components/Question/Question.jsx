import React, { useEffect, useState } from 'react';
import './styles.css';
import { formatDate, getHoursAndMinutes } from '../../Utils/functions';
import Actions from '../Actions/Actions';
import { Link } from 'react-router-dom';

const Question = ({
    unlocked,
    userId,
    questionData,
    initResetQ,
    fromAnswers,
}) => {
    const [inputs, setInputs] = useState(questionData);
    const [edit, setEdit] = useState(false);

    const handleChange = (event) => {
        const name = event.target.name;
        const value = event.target.value;
        setInputs(() => ({ ...inputs, [name]: value }));
    };

    useEffect(() => {
        setInputs(questionData);
    }, [questionData]);

    return (
        <div className="question-wrapper">
            <div className="q-rating flex-col-c">
                <span>Total</span>
                <span>answers</span>
                <span>{questionData.answerCount}</span>
            </div>
            <div className="q-content flex-col-top-l">
                <Link
                    id={inputs.questionId + '-title-Link'}
                    to={'/answers?questionId=' + inputs.questionId}
                >
                    {!edit && (
                        <div className="q-title-Link">{inputs.title}</div>
                    )}
                </Link>
                <input
                    type="text"
                    id={inputs.questionId + '-list-title'}
                    name="title"
                    className="q-title-input"
                    value={inputs.title}
                    onChange={handleChange}
                    style={
                        edit
                            ? ({ display: 'inline-block' },
                              { border: '1px solid var(--sky)' },
                              { backgroundColor: 'var(--sky)' })
                            : { display: 'none' }
                    }
                    disabled={!edit}
                />
                <textarea
                    id={inputs.questionId + '-list-body'}
                    name="body"
                    className="q-body-input"
                    value={inputs.body}
                    onChange={handleChange}
                    maxLength={1000}
                    wrap="soft"
                    style={
                        edit
                            ? ({ border: '1px solid var(--sky)' },
                              { backgroundColor: 'var(--purple)' },
                              { resize: 'vertical' })
                            : { border: 'none' }
                    }
                    disabled={!edit}
                />
                <div className="q-metrics flex-mid-l">
                    <div>
                        Question author:
                        <br />
                        <b>{inputs.authorName}</b>
                    </div>
                    <div>
                        Published:
                        <br />
                        {formatDate(inputs.published)}
                        &nbsp; {getHoursAndMinutes(inputs.published)}
                    </div>
                    <div className={!inputs.edited ? 'hide' : ''}>
                        Last edited:
                        <br />
                        {formatDate(inputs.edited)}
                        &nbsp; {getHoursAndMinutes(inputs.edited)}
                    </div>
                </div>
            </div>
            <div className="a-action flex-col-top-c">
                {unlocked ? (
                    <Actions
                        inputs={inputs}
                        userId={userId}
                        edit={edit}
                        setEdit={setEdit}
                        target={'question'}
                        targetId={inputs.questionId}
                        initResetQ={initResetQ}
                        fromAnswers={fromAnswers}
                    />
                ) : (
                    'Log in for more options'
                )}
            </div>
        </div>
    );
};

export default Question;
