import React from 'react';
import { render } from 'react-dom';

import App from './components/App';

import './styles/index.scss';

const getApp = () => (
    <App />
);

render(getApp(), document.getElementById('root'));
