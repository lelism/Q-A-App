import apiURLs from './urls';
import { getUserIdAndKey } from './functions';

export const fetchAPI = async (url, apiMethod, bodyData) => {
    try {
        const options = {
            method: `${apiMethod}`,
            mode: 'cors',
            headers: {
                'Content-type': 'application/json; charset=UTF-8'
            }
        };

        if (options.method !== 'GET' && bodyData) {
            options.body = JSON.stringify(bodyData);
        };

        const response = await fetch(url, options);
        if (response instanceof Error) {
            return (new Error('Data fetch has failled'));
        } else return response.json();
    } catch (error) {
        return error;
    }
};

export const refreshUserData = async (isLogged, userData, setUserData) => {
    const apiData = apiURLs.getUserDetails;
    if (isLogged) {
        const body = getUserIdAndKey();
        if (!body.userId || !body.sessionKey) {
            sessionStorage.clear();
            alert('Session was terminated, please login again');
            setUserData({});
            return;
        }
        const fetchData = await fetchAPI(apiData.url, apiData.method, body);
        await setUserData(fetchData);
    } else setUserData({});
};

export const getQuestionsList = async (setQuestionsList, condition) => {
    const apiData = apiURLs.getQuestionsList;
    const body = (condition === '') ? {} : { condition };
    let fetchData = await fetchAPI(apiData.url, apiData.method, body);
    // await setQuestionsList(() => fetchData);
    console.log(fetchData);
    if ('Server message' in fetchData) {
        fetchData = [{
            title: 'Test title',
            body: 'test body',
            authorId: 1
        }];
    };
    await setQuestionsList(() => fetchData);
};

export const getAnswersList = async (setAnswersList, questionId, condition) => {
    const apiData = apiURLs.getAnswers;
    const body = (condition === '') ? {} : { condition };
    const fetchData = await fetchAPI(apiData.url + questionId, apiData.method, body);
    await setAnswersList(() => fetchData);
};

export const countAnswers = async (questionId, setAnswersCount) => {
    const apiData = apiURLs.countAnswers;
    const fetchData = await fetchAPI(apiData.url + questionId, apiData.method);
    await setAnswersCount(() => fetchData);
};

export const checkIfLiked = async (userId, answerId, setIsLiked) => {
    const apiData = apiURLs.isLiked;
    const body = { userId, answerId };
    const fetchData = await fetchAPI(apiData.url, apiData.method, body);
    const checkResult = await (fetchData.success) ? fetchData.isLiked : false;
    await setIsLiked(checkResult);
};

export const submitLike = async (userId, answerId) => {
    const apiData = apiURLs.submitLike;
    const body = { userId, answerId };
    const result = await fetchAPI(apiData.url, apiData.method, body);
    return await result;
};

export const deleteLike = async (userId, answerId) => {
    const apiData = apiURLs.deleteLike;
    const body = { userId, answerId };
    const result = await fetchAPI(apiData.url, apiData.method, body);
    return await result;
};
