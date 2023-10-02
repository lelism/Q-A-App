import React, { useState } from 'react';
import './styles.css';
import { Link } from 'react-router-dom';
import { fetchAPI } from '../../Utils/api';
import apiURLs from '../../Utils/urls';

const LoginForm = () => {
    const apiData = apiURLs.userLogin;

    const [inputs, setInputs] = useState({ username: '', password: '' });

    const handleChange = (event) => {
        const name = event.target.name;
        const value = event.target.value;
        setInputs(values => ({ ...values, [name]: value }));
    };

    const handleLogin = async (event) => {
        event.preventDefault();
        if (inputs.username.length < 8 || inputs.password.length < 8) {
            alert('Check your credentials');
            return;
        };
        const body = { username: inputs.username, password: inputs.password };
        const credentials = await fetchAPI(apiData.url, apiData.method, body);
        if (!credentials.userId || !credentials.sessionKey) {
            alert('Username or password inccorect');
            return;
        }
        sessionStorage.setItem('userId', credentials.userId);
        sessionStorage.setItem('sessionKey', credentials.sessionKey);
        location.reload();
    };

    return (
        <form className='login-form flex-col-top-l' onSubmit={handleLogin}>
            <label className='login-label' htmlFor='usernameInput'>Username</label>
            <input
                type='text'
                id='usernameInput'
                name='username'
                className='login-input'
                value={inputs.username || ''}
                onChange={handleChange}
            />
            <label className='login-label' htmlFor='passwordInput'>Password:</label>
            <input
                type='password'
                id='passwordInput'
                name='password'
                className='login-input'
                value={inputs.password || ''}
                onChange={handleChange}
            />
            <div className='flex-mid-l'>
                <input type='submit' className='button' value='Login' />
                <Link to='/signup' className='signup-link'>
                    <div className='flex-c'>No&nbsp;account?</div>
                    <div className='bld flex-c'>Sign up!</div>
                </Link>
            </div>
        </form>
    );
};

export default LoginForm;
