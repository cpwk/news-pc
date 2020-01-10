import React from 'react';
import ReactDOM from 'react-dom';
import routers from './routes';

if (module.hot)
    module.hot.accept();

ReactDOM.render(routers, document.getElementById('root'));
