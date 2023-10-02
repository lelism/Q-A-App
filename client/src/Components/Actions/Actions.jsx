import React from 'react';
import './styles.css';
import apiURLs from '../../Utils/urls';
import { fetchAPI } from '../../Utils/api';

const Actions = ({ inputs, userId, edit, setEdit, target, targetId, initResetQ, initResetA, fromAnswers }) => {
    const authorIsUser = (inputs.authorId === userId);

    const deleteTarget = async () => {
        const apiData = (target === 'question')
            ? (apiURLs.deleteQuestion)
            : (apiURLs.deleteAnswer);
        const deleteReport = await fetchAPI(apiData.url + `/${targetId}`, apiData.method);
        if (!deleteReport) {
            alert('Delete action has failed');
        };
        if (fromAnswers) {
            window.open('/', '_target', 'noreferrer');
            return;
        }
        (target === 'question') ? (initResetQ((init) => !init)) : (initResetA((init) => !init));
    };

    const editTarget = async () => {
        if (edit) {
            let apiData = '';
            let body = {};
            if (target === 'question') {
                apiData = apiURLs.editQuestion;
                body = { title: inputs.title, body: inputs.body };
            } else {
                apiData = apiURLs.editAnswer;
                body = { body: inputs.body };
            }
            const patchReport = await fetchAPI(apiData.url + `/${targetId}`, apiData.method, body);
            if (!patchReport) {
                alert('Edit action has failed');
            };
            if (fromAnswers) {
                initResetA((init) => !init);
                return;
            };
            (target === 'question') ? (initResetQ((init) => !init)) : (initResetA((init) => !init));
        }
        setEdit((init) => !init);
    };

    return (
        <>
            { authorIsUser &&
                <>
                    <div className='action-button flex-c' onClick={ deleteTarget } >
                        Delete
                    </div>
                    <div className='action-button flex-c' onClick={ editTarget } >
                        {(edit) ? ('Submit') : ('Edit') }
                    </div>
                </>
            }
        </>
    );
};

export default Actions;
