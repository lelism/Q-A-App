import React from 'react';
import './styles.css';
import LoginForm from '../LoginForm/LoginForm';
import UserInfo from '../UserInfo/UserInfo';

const UserSection = ({ isLogged, setIsLogged, userDetails }) => {
    return (
        <div className='user-section flex-top-c wrp'>
            { (isLogged)
                ? <UserInfo stayLoggedIn={ setIsLogged } userDetails={ userDetails } />
                : <LoginForm />
            }
        </div>
    );
};

export default UserSection;
