const apiURLs = {
    userSignUp: {
        url: 'http://localhost:4000/users/signup',
        method: 'POST'
    },
    userLogin: {
        url: 'http://localhost:4000/users/login',
        method: 'POST'
    },
    getUserDetails: {
        url: 'http://localhost:4000/users/details',
        method: 'POST'
    },
    submitNewQuestion: {
        url: 'http://localhost:4000/questions/new-question',
        method: 'POST'
    },
    getQuestionsList: {
        url: 'http://localhost:4000/questions/receive-all',
        method: 'POST'
    },
    deleteQuestion: {
        url: 'http://localhost:4000/questions/delete',
        method: 'DELETE'
    },
    editQuestion: {
        url: 'http://localhost:4000/questions/update',
        method: 'PATCH'
    },
    countAnswers: {
        url: 'http://localhost:4000/questions/count-answers/',
        method: 'GET'
    },
    submitNewAnswer: {
        url: 'http://localhost:4000/answers/new-answer',
        method: 'POST'
    },
    getAnswers: {
        url: 'http://localhost:4000/answers/get-answers?questionId=',
        method: 'POST'
    },
    deleteAnswer: {
        url: 'http://localhost:4000/answers/delete',
        method: 'DELETE'
    },
    editAnswer: {
        url: 'http://localhost:4000/answers/update',
        method: 'PATCH'
    },
    isLiked: {
        url: 'http://localhost:4000/answers/isLiked',
        method: 'POST'
    },
    submitLike: {
        url: 'http://localhost:4000/answers/like',
        method: 'POST'
    },
    deleteLike: {
        url: 'http://localhost:4000/answers/delete-like',
        method: 'DELETE'
    }
};

export default apiURLs;
