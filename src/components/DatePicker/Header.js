import React from 'react';

export const Header = ({ items }) => {
    return (
        <div className="header">
            {items.map((item, i) => {
                return (
                    <div
                        key={`${item}-${i}`}
                        className="weekday"
                        style={{
                            width: `calc(100% / ${items.length}`,
                        }}
                    >
                        <span>
                            {item}
                        </span>
                    </div>
                );
            })}
        </div>
    );
};
