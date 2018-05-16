import React, { Component } from 'react';
import ReactDOM from 'react-dom';

export class CalendarPortal extends Component {
    constructor(props) {
        super(props);
        this.body = document.getElementsByTagName('body')[0];
    }

    render() {
        return ReactDOM.createPortal(this.props.children, this.body);
    }
}
