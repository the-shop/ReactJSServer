import http from 'http'
import { match } from 'react-router'
import fs from 'fs'
import HttpHelpers from './HttpHelpers'
import Router from './Router'

/**
 * Responsible for http request handling logic
 */
class Server {
    /**
     *
     * @param configuration
     * @param application
     */
    constructor(configuration, application) {
        this.config = configuration;
        this.application = application;
    }

    /**
     * Main server application entry point
     */
    run() {
        http.createServer((req, res) => {
            this.handle(req, res);
        }).listen(this.getPort());

        console.log(`Server process ${process.pid} started on port ${this.getPort()}`);
    }

    /**
     * Server requests handler
     *
     * @param req
     * @param res
     * @returns {boolean}
     */
    handle(req, res) {
        // Handle favicon request
        if (req.url === '/favicon.ico') {
            HttpHelpers.write('', 'image/x-icon', res);
            return true;
        }

        // Handle static JS requests
        var buildDirRegex = new RegExp('build');
        if (buildDirRegex.test(req.url)) {
            // TODO: test CSS support
            fs.readFile(`.${req.url}`, (err, data) => {
                HttpHelpers.write(data, 'text/javascript', res);
            });
            return true;
        }

        var applicationName = this.getApplication().resolveApplicationName(req.headers.host);

        // Handle all other requests
        var routes = Router.getRoutes(applicationName),
            location = req.url;

        match({routes, location}, (error, redirectLocation, renderProps) => {
            if (error) {
                HttpHelpers.serverError('Server error. Please try again.', res);
            } else if (redirectLocation) {
                HttpHelpers.redirect(redirectLocation, res);
            } else if (renderProps) {
                HttpHelpers.renderPage(applicationName, renderProps, res);
            } else {
                HttpHelpers.routeNotFound(res);
            }
        });

        return true;
    }

    /**
     * Environment variable has priority over configuration value
     *
     * @returns {number}
     */
    getPort() {
        var port = process.env.PORT || this.getConfiguration().get('application.port');

        if (!port) {
            throw Error('Port must be defined, check the documentation.');
        }

        return port;
    }

    /**
     * @returns {*}
     */
    getConfiguration() {
        return this.config;
    }

    /**
     * @returns {*}
     */
    getApplication() {
        return this.application;
    }
}

export default Server;