export const formatDate = (jsDate) => {
    return new Date(jsDate).toLocaleDateString();
};

const padTo2Digits = (num) => {
    return String(num).padStart(2, '0');
};

export const getHoursAndMinutes = (unformatedTime) => {
    const date = new Date(unformatedTime);
    return (
        padTo2Digits(date.getHours()) + ':' + padTo2Digits(date.getMinutes())
    );
};

export const getUserIdAndKey = () => {
    const userId = sessionStorage.getItem('userId');
    const sessionKey = sessionStorage.getItem('sessionKey');
    return { userId, sessionKey };
};

export const checkSession = () => {
    const { userId, sessionKey } = getUserIdAndKey();
    if (!userId || !sessionKey) {
        return false;
    }
    return true;
};

export const askQuestion = (isLogged, setQuestionForm) => {
    if (!isLogged) {
        alert('You need to be logged in to ask a question.');
    } else setQuestionForm(true);
};
