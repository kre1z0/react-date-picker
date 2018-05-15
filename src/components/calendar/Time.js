import React from 'react';

import { NumberInputGroup } from './NumberInputGroup';
import { TIME_LABEL } from '../../containers/date-picker';

export const Time = ({ time, onChange }) => {
    return (
        <div className="number-input-container">
            {Object.keys(time).map(key => {
                return (
                    <NumberInputGroup
                        name={key}
                        key={key}
                        onChange={onChange}
                        value={time[key]}
                        label={TIME_LABEL[key]}
                    />
                );
            })}
        </div>
    );
};
