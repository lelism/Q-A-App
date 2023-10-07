import apiURLs from './urls';
import { getUserIdAndKey } from './functions';

export const fetchAPI = async (apiURL, apiMethod, apiData) => {
    try {
        const options = {
            method: `${apiMethod}`,
            mode: 'cors',
            headers: {
                'Content-type': 'application/json; charset=UTF-8',
            },
        };

        if (options.method !== 'GET') {
            if (apiData.headers) {
                options.headers = {
                    ...options.headers,
                    ...apiData.headers,
                };
            }
            if (apiData.body) options.body = JSON.stringify(apiData.body);
        }
        // console.log('options');
        // console.log(options);
        const response = await fetch(apiURL, options);
        if (response instanceof Error) {
            return new Error('Data fetch has failled');
        } else return response.json();
    } catch (error) {
        return error;
    }
};

export const refreshUserData = async (setIsLogged, setUserData) => {
    const userInfo = getUserIdAndKey();
    if (userInfo.userId && userInfo.sessionKey) {
        const userDetailsAPI = apiURLs.getUserDetails;
        const fetchData = await fetchAPI(
            userDetailsAPI.url,
            userDetailsAPI.method,
            { body: userInfo }
        );
        if ((await fetchData.status) === 'success') {
            setUserData(fetchData);
            setIsLogged(true);
        } else {
            alert('Session was terminated, please login again');
            sessionStorage.clear();
            setUserData({});
            setIsLogged(false);
        }
    } else {
        sessionStorage.clear();
        setUserData({});
        setIsLogged(false);
    }
};

export const getQuestionsList = async (setQuestionsList, condition) => {
    const getQuestionsAPI = apiURLs.getQuestionsList;
    const body = condition === '' ? {} : { condition };
    const fetchData = await fetchAPI(
        getQuestionsAPI.url,
        getQuestionsAPI.method,
        { body }
    );
    await setQuestionsList(() => fetchData);
};

export const getAnswersList = async (setAnswersList, questionId, condition) => {
    const apiData = apiURLs.getAnswers;
    const body = condition === '' ? {} : { condition };
    const fetchData = await fetchAPI(apiData.url + questionId, apiData.method, {
        body,
    });
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
    const checkResult = (await fetchData.success) ? fetchData.isLiked : false;
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
