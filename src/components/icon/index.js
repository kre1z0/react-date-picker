import React, { Component } from 'react';
import PropTypes from 'prop-types';
import cn from 'classnames';

import styles from './icon.scss';

class Icon extends Component {
    static propTypes = {
        children: PropTypes.node.isRequired,
        viewBox: PropTypes.string,
        color: PropTypes.string,
        className: PropTypes.string,
        style: PropTypes.object,
    };

    static defaultProps = {
        color: 'inherit',
        viewBox: '0 0 24 24',
    };

    render() {
        const { children, viewBox, color, className, style } = this.props;
        return (
            <svg
                {...this.props}
                style={style}
                color={color}
                className={cn(styles.icon, className)}
                viewBox={viewBox}
            >
                {children}
            </svg>
        );
    }
}

export default Icon;
