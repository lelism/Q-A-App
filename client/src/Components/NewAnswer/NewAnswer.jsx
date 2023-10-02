import React, { useState } from 'react';
import './styles.css';
import apiURLs from '../../Utils/urls';
import { fetchAPI } from '../../Utils/api';

const NewAnswer = ({ isLogged, questionId, author, initReset }) => {
    const [inputs, setInputs] = useState({ body: '' });

    const handleChange = (event) => {
        event.preventDefault();
        const name = event.target.name;
        const value = event.target.value;
        setInputs(values => ({ ...values, [name]: value }));
    };

    const submitAnswer = async (event) => {
        event.preventDefault();
        if (!isLogged) {
            alert('Only logged in user can write answers. Please register and/or log in.');
            return;
        }
        if (inputs.body.length < 1) {
            alert('Please fill the answer box. Empty answers are not allowed.');
            return;
        };
        const apiData = apiURLs.submitNewAnswer;
        const body = { questionId, authorId: author, body: inputs.body };
        const newAnswer = await fetchAPI(apiData.url, apiData.method, body);
        if (!newAnswer.success) {
            alert('submision has failed');
            return;
        }
        setInputs({ body: '' });
        initReset((init) => !init);
    };

    return (
        <div className='answer-form-wrapper'>
            <form className='flex-col-top-c'>
                <textarea
                    name='body'
                    className='new-answer-body'
                    value={inputs.body}
                    onChange={handleChange}
                    rows={5}
                    maxLength={1000}
                />
                <div className='symbol-count flex-top-r'>
                    {(inputs.body.length)}/1000
                </div>
                <input
                    type='submit'
                    className='answer-button'
                    value='Submit'
                    onClick={submitAnswer}
                />
            </form>
        </div>
    );
};

export default NewAnswer;
