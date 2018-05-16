import React, { Component } from 'react';
import 'babel-polyfill';

import App from './containers/App';

import 'reset.css/reset.css';
import './assets/fonts/fonts.scss';
import './assets/base/main.scss';

class Root extends Component {
    render() {
        return <App />;
    }
}

export default Root;
