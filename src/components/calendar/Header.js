import React from 'react';
import cn from 'classnames';

export const Header = ({ items }) => {
    return (
        <div className="header">
            {items.map((item, i) => {
                return (
                    <div
                        key={`${item}-${i}`}
                        className="item"
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
