import React, { useEffect, useState } from 'react';
import './styles.css';
import { formatDate, getHoursAndMinutes } from '../../Utils/functions';
import Actions from '../Actions/Actions';
import { checkIfLiked, submitLike, deleteLike } from '../../Utils/api';
import IconAws from '../IconAws';

const Answer = ({ unlocked, userId, answerData, initResetA }) => {
    const [inputs, setInputs] = useState(answerData);
    const [edit, setEdit] = useState(false);
    const [isLiked, setIsLiked] = useState(false);

    const handleChange = (event) => {
        const name = event.target.name;
        const value = event.target.value;
        setInputs(() => ({ ...inputs, [name]: value }));
    };

    const handleLikeBtn = () => {
        if (isLiked) {
            deleteLike(userId, answerData.answerId);
            initResetA((init) => !init);
        } else {
            submitLike(userId, answerData.answerId);
            initResetA((init) => !init);
        };
        setIsLiked((init) => !init);
    };

    useEffect(() => {
        setInputs(answerData);
    }, [answerData]);

    useEffect(() => {
        checkIfLiked(userId, answerData.answerId, setIsLiked);
    }, [isLiked]);

    return (
        <div className='answer-wrapper'>
            <div className='flex-c like-container' onClick={() => handleLikeBtn()}>
                {isLiked
                    ? <IconAws iconClass='fa-solid fa-thumbs-up' size='xl' />
                    : <IconAws iconClass='fa-regular fa-thumbs-up' size='xl' /> }
            </div>
            <div className='q-rating flex-col-c'>
                <span>Total</span>
                <span>Votes</span>
                <span><b>{answerData.votes}</b></span>
            </div>
            <div className='a-content flex-col-top-l'>
                <textarea
                    id={inputs.answerId + '-list-body'}
                    name='body'
                    className='a-body-input full'
                    value={inputs.body}
                    onChange={handleChange}
                    maxLength={1000}
                    wrap='soft'
                    style={edit
                        ? ({ border: '1px solid var(--sky)' },
                        { backgroundColor: 'var(--purple)' },
                        { resize: 'vertical' })
                        : ({ border: 'none' })}
                    disabled={ !edit }
                />
                <div className='a-metrics flex-mid-l'>
                    <div>
                        Answer author:<br />
                        <b>{inputs.authorName}</b>
                    </div>
                    <div>
                        Published:<br />
                        {formatDate(inputs.published)}
                        &nbsp; {getHoursAndMinutes(inputs.published)}
                    </div>
                    <div className={(!(inputs.edited)) ? 'hide' : ''}>
                        Last edited:<br />
                        {formatDate(inputs.edited)}
                        &nbsp; {getHoursAndMinutes(inputs.edited)}
                    </div>
                </div>
            </div>
            <div className='a-action flex-col-top-c'>
                {unlocked
                    ? <Actions
                        inputs={inputs}
                        userId={userId}
                        edit={edit}
                        setEdit={setEdit}
                        target={'answer'}
                        targetId={inputs.answerId}
                        initResetA={initResetA} />
                    : 'Log in for more options'
                }
            </div>
        </div>
    );
};

export default Answer;
