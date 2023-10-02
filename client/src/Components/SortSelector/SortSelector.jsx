import React, { useEffect, useState } from 'react';
import './styles.css';
import IconAws from '../IconAws';

const SortSelector = ({ setSortRules, sortOption }) => {
    const [selection, setSelection] = useState(0);

    const changeOption = () => {
        console.log(sortOption.label + ': ' + selection);
        setSelection((selection === 2) ? (0) : (selection + 1));
    };

    useEffect(() => {
        setSortRules((initial) => {
            return ({
                ...initial,
                [sortOption.optionNo]: sortOption.sortQueries[selection]
            });
        });
    }, [selection]);

    return (
        <>
            <span className='options-label'>{sortOption.label}&nbsp;</span>
            <span className='options-selector' onClick={changeOption}>
                { (selection === 0) && <IconAws iconClass={'fa-solid fa-sort'} />}
                { (selection === 1) && <IconAws iconClass={'fa-solid fa-sort-up'} />}
                { (selection === 2) && <IconAws iconClass={'fa-solid fa-sort-down'} />}
            </span>
            &nbsp;
        </>
    );
};

export default SortSelector;
