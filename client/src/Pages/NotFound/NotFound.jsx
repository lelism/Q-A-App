import React from 'react';
import { Link } from 'react-router-dom';
import './styles.css';

const NotFound = () => {
    return (
        <div className="flex-col-c full">
            <h1>Oops! You seem to be lost.</h1>
            <p>Lets start again...</p>
            <br />
            <br />
            <div className="button">
                <Link to="/">RESTART</Link>
            </div>
        </div>
    );
};

export default NotFound;
