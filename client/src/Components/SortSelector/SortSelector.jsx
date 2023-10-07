import React, { useEffect, useState } from 'react';
import './styles.css';
import IconAws from '../IconAws';

const SortSelector = ({ setSortRules, sortOption }) => {
    const [selection, setSelection] = useState(0);

    const changeOption = () => {
        setSelection(selection === 2 ? 0 : selection + 1);
    };

    useEffect(() => {
        setSortRules((initial) => {
            return {
                ...initial,
                [sortOption.optionNo]: sortOption.sortQueries[selection],
            };
        });
    }, [selection]);

    return (
        <>
            {/* <span className="options-label">
                {sortOption.label}&nbsp;&nbsp;
            </span> */}
            <span className="options-selector" onClick={changeOption}>
                <span className="options-label">
                    &nbsp;&nbsp;{sortOption.label}&nbsp;
                </span>
                {/* {selection === 0 && <IconAws iconClass={'fa-solid fa-sort'} />} */}
                {selection === 0 && <span>&nbsp;&nbsp;</span>}
                {selection === 1 && (
                    <IconAws iconClass={'fa-solid fa-sort-up'} />
                )}
                {selection === 2 && (
                    <IconAws iconClass={'fa-solid fa-sort-down'} />
                )}
            </span>
            &nbsp;
        </>
    );
};

export default SortSelector;
