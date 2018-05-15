import React from 'react';
import ReactDOM from 'react-dom';
import { AppContainer } from 'react-hot-loader';

import Root from './Root';

import injectTapEventPlugin from 'react-tap-event-plugin';

import moment from 'moment';
import numeral from 'numeral';

import 'numeral/locales/ru';

numeral.locale('ru');

const render = Component => {
    ReactDOM.render(
        <AppContainer>
            <Component />
        </AppContainer>,
        document.getElementById('root'),
    );
};

render(Root);

if (module.hot) {
    module.hot.accept('./Root', () => render(Root));
}
