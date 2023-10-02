import React from 'react';

const IconAws = (props) => {
    const baseClass = props.iconClass;
    const size = props.size;
    const iconColor = props.color;
    return (
        <i className={ baseClass + (size ? ` fa-${props.size}` : '') }
            style={{ color: iconColor ? (`${iconColor}`) : ('var(--black)') }}
        />
    );
};

export default IconAws;
