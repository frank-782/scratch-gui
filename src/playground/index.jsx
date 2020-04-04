// Polyfills
import 'es6-object-assign/auto';
import 'core-js/fn/array/includes';
import 'core-js/fn/promise/finally';
import 'intl'; // For Safari 9

import React from 'react';
import ReactDOM from 'react-dom';

import analytics from '../lib/analytics';
import BrowserModalComponent from '../components/browser-modal/browser-modal.jsx';
import supportedBrowser from '../lib/supported-browser';

import styles from './index.css';

import AppStateHOC from '../lib/app-state-hoc.jsx';
import GUI from '../containers/gui.jsx';
import HashParserHOC from '../lib/hash-parser-hoc.jsx';
import TitleHOC from '../lib/titled-hoc.jsx';
import {compose} from 'redux';
// Register "base" page view
analytics.pageview('/');

const appTarget = document.createElement('div');
appTarget.className = styles.app;
document.body.appendChild(appTarget);


if (supportedBrowser()) {
    const WrappedGui = compose(
        AppStateHOC,
        HashParserHOC,
        TitleHOC
    )(GUI);
    window.WrappedGui = WrappedGui;
} else {
    BrowserModalComponent.setAppElement(appTarget);
    const WrappedBrowserModalComponent = AppStateHOC(BrowserModalComponent, true /* localesOnly */);
    const handleBack = () => {};
    // eslint-disable-next-line react/jsx-no-bind
    ReactDOM.render(<WrappedBrowserModalComponent onBack={handleBack} />, appTarget);
}
