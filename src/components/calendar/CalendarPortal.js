import React, { PureComponent } from 'react';
import ReactDOM from 'react-dom';

export class CalendarPortal extends PureComponent {
    constructor(props) {
        super(props);
        // STEP 1: create a container <div>
        this.body = document.getElementsByTagName('body')[0];
    }

    render() {
        return ReactDOM.createPortal(this.props.children, this.body);
    }
}