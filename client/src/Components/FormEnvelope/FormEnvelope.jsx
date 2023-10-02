import React from 'react';
import './styles.css';

const FormEnvelope = (props) => {
    return (
        <div className="outerbox" style={{ width: `${props.width}` }}>
            <h1 className='form-title'>{props.title}</h1>
            <hr />
            {props.children}
        </div>
    );
};

export default FormEnvelope;
