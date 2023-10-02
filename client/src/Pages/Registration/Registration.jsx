import React, { useState } from 'react';
import './styles.css';
import apiURLs from '../../Utils/urls';
import { fetchAPI } from '../../Utils/api';
import RegistrationForm from '../../Components/FormEnvelope/FormEnvelope';
import IconAws from '../../Components/IconAws';

const Registration = () => {
    const apiData = apiURLs.userSignUp;

    const [inputs, setInputs] = useState(
        {
            username: '',
            name: '',
            email: '',
            password: '',
            password2: ''
        });

    const handleChange = (event) => {
        event.preventDefault();
        const name = event.target.name;
        const value = event.target.value;
        setInputs(values => ({ ...values, [name]: value }));
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        if (inputs.username.length < 8 || inputs.name.length < 4 ||
            inputs.email.length < 4 || inputs.password.length < 8 ||
            inputs.password2.length < 8) {
            alert(`Please provide all requested data with reasonable data, 
                passwords should match and be at least 8 symbols`);
            return;
        };
        if (!(inputs.email.indexOf('@') > -1)) {
            alert('Provide valid e-mail.');
            return;
        }
        if (inputs.password !== inputs.password2) {
            alert('Passwords do not match!');
            return;
        }
        const body = { username: inputs.username, password: inputs.password, email: inputs.email };
        const confirmRegistration = await fetchAPI(apiData.url, apiData.method, body);
        await (confirmRegistration.success)
            ? alert('Registration successful')
            : alert('Registration has failed');
        window.open('/', '_self');
    };

    return (
        <div className='registration-page flex-c full'>
            <RegistrationForm title='User registration' width='20rem'>
                <form className='flex-col-top-c'>
                    <div className='flex-bot-c'>
                        <label className='form-icon' htmlFor='username'>
                            <IconAws iconClass='fa-regular fa-circle-user' color='var(--white)' />
                        </label>
                        <input
                            type='text'
                            placeholder='Username'
                            name='username'
                            className='form-input'
                            value={inputs.username || ''}
                            onChange={ handleChange }
                            minLength='4'
                            maxLength='20'
                            required
                        />
                    </div>
                    <div>
                        <label className='form-icon' htmlFor='name'>
                            <IconAws iconClass='fa-regular fa-user' color='var(--white)' />
                        </label>
                        <input
                            type='text'
                            placeholder='Full name'
                            name='name'
                            className='form-input'
                            value={inputs.name || ''}
                            onChange={ handleChange }
                            minLength='4'
                            maxLength='20'
                            required
                        />
                    </div>
                    <div>
                        <label className='form-icon' htmlFor='email'>
                            <IconAws iconClass='fa-regular fa-envelope' color='var(--white)' />
                        </label>
                        <input
                            type='email'
                            placeholder='E-mail'
                            name='email'
                            className='form-input'
                            value={inputs.email || ''}
                            onChange={ handleChange }
                            required
                        />
                    </div>
                    <div>
                        <label className='form-icon' htmlFor='password'>
                            <IconAws iconClass='fa-solid fa-key' color='var(--white)' />
                        </label>
                        <input
                            type='password'
                            placeholder='Password'
                            name='password'
                            className='form-input'
                            value={inputs.password || ''}
                            onChange={ handleChange }
                            minLength='8'
                            required
                        />
                    </div>
                    <div>
                        <label className='form-icon' htmlFor='password2'>
                            <IconAws iconClass='fa-solid fa-key' color='var(--white)' />
                        </label>
                        <input
                            type='password'
                            placeholder='Repeat password'
                            name='password2'
                            className='form-input'
                            value={inputs.password2 || ''}
                            onChange={ handleChange }
                            minLength='8'
                            required
                        />
                    </div>
                    <div>
                        <span className='form-btn' onClick= {handleSubmit} >Register</span>
                        <a href='/' className='form-btn'>Later</a>
                    </div>
                </form>
            </RegistrationForm>
        </div>
    );
};

export default Registration;
