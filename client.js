import React from 'react';
import { match, Router as ReactRouter, browserHistory } from 'react-router';
import { render } from 'react-dom';
import Router from './backend/Router';
import Application from './backend/Application';

const { pathname, search, hash } = window.location;
const location = `${pathname}${search}${hash}`;

const app = new Application();
const applicationName = app.resolveApplicationName(window.location.host);
const routes = Router.getRoutes(applicationName);

match({ routes, location }, () => {
    render(
        <ReactRouter routes={routes} history={browserHistory} />,
        document.getElementById('app')
    );
});
