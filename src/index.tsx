import React from 'react';
import { render } from 'react-dom';
import { App } from './app';
import './root.scss';

render(<App count={3} />, document.getElementById('root'));
