import React, { useState } from 'react';
import './styles.css';
import apiURLs from '../../Utils/urls';
import { fetchAPI } from '../../Utils/api';
import FormEnvelope from '../FormEnvelope/FormEnvelope';
import IconAws from '../IconAws';
import { getUserIdAndKey } from '../../Utils/functions';

const QuestionForm = ({ setForm, initReset }) => {
    const [inputs, setInputs] = useState({ title: '', body: '' });

    const handleChange = (event) => {
        event.preventDefault();
        const name = event.target.name;
        const value = event.target.value;
        setInputs((values) => ({ ...values, [name]: value }));
    };

    const submitQuestion = async (event) => {
        event.preventDefault();
        if (inputs.title.length < 1 || inputs.body.length < 1) {
            alert('can not proceed without valid inputs');
            closeForm();
            return;
        }
        const userData = getUserIdAndKey();
        const newQuestionAPI = apiURLs.submitNewQuestion;
        const options = {};
        options.body = {
            title: inputs.title,
            body: inputs.body,
            authorId: userData.userId,
        };
        options.headers = {
            Authorization: userData.sessionKey,
        };

        const newQuestion = await fetchAPI(
            newQuestionAPI.url,
            newQuestionAPI.method,
            options
        );

        if (newQuestion.status === 'fail') {
            alert(newQuestion.message);
        }
        if (
            newQuestion.message ===
            'Error during authentification. Please repeat your log in.'
        ) {
            sessionStorage.clear();
            location.reload();
            return;
        }
        closeForm();
        initReset((init) => !init);
    };

    const closeForm = () => {
        setInputs(null);
        setForm(false);
    };

    return (
        <span className="question-form-wrapper">
            <FormEnvelope title="Submit your question" width={'60rem'}>
                <form>
                    <div>
                        <label className="form-icon" htmlFor="title">
                            <IconAws
                                iconClass="fa-solid fa-heading"
                                color="var(--white)"
                            />
                        </label>
                        <input
                            type="text"
                            placeholder="Question title"
                            name="title"
                            className="form-input"
                            value={inputs.title || ''}
                            onChange={handleChange}
                            minLength="4"
                            maxLength="60"
                            style={{ width: '53.7rem' }}
                            autoFocus
                            required
                        />
                    </div>
                    <br></br>
                    <div className="flex-top-l">
                        <label className="form-icon" htmlFor="body">
                            <IconAws
                                iconClass="fa-solid fa-align-justify"
                                color="var(--white)"
                            />
                        </label>
                        <textarea
                            name="body"
                            placeholder="Type your question"
                            className="form-textarea"
                            value={inputs.body || ''}
                            onChange={handleChange}
                            style={{ width: '54rem' }}
                            rows={5}
                            minLength={10}
                            maxLength={1000}
                        />
                    </div>
                    <div className="flex-mid-r">
                        <span>{inputs.body.length}</span>
                        <span>/1000</span>
                    </div>
                    <div className="flex-c">
                        <span className="form-btn" onClick={closeForm}>
                            Dismiss
                        </span>
                        <span className="form-btn" onClick={submitQuestion}>
                            Ask the question
                        </span>
                    </div>
                </form>
            </FormEnvelope>
        </span>
    );
};

export default QuestionForm;
