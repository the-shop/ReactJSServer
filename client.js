import React from 'react'
import { match, Router as ReactRouter } from 'react-router'
import { render } from 'react-dom'
import { createHistory } from 'history'
import Router from './backend/Router'
import Application from './backend/Application'

const { pathname, search, hash } = window.location;
const location = `${pathname}${search}${hash}`;

var app = new Application(),
    applicationName = app.resolveApplicationName(window.location.host),
    routes = Router.getRoutes(applicationName);

match({ routes, location }, () => {
    render(
        <ReactRouter routes={routes} history={createHistory()} />,
        document.getElementById('app')
    );
});
