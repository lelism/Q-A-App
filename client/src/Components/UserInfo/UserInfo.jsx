import React from 'react';
import './styles.css';
import { formatDate } from '../../Utils/functions';

const UserInfo = ({ userDetails, stayLoggedIn }) => {
    const logout = () => {
        sessionStorage.clear();
        stayLoggedIn(false);
        location.reload();
    };

    return (
        <div className='user-profile flex-col-top-c'>
            <div className='avatar'></div>
            <div className='greating'>Hi, { userDetails.name }!</div>
            <h3>Your current stats:</h3>
            <ul className='flex-col-top-l'>
                <li className='stats'>Total posts: {userDetails.postCount}</li>
                <li className='stats'>Member since: { formatDate(userDetails.registrationDate) }</li>
                <li className='stats'>Last login: { formatDate(userDetails.lastLogin) }</li>
            </ul>
            <button className='login-button' onClick={logout} >Sign out</button>
        </div>
    );
};

export default UserInfo;
