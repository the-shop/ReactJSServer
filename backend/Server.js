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
        var applicationName = this.getApplication().resolveApplicationName(req.headers.host),
          appConfigPath = './applications/' + applicationName + '/config.json',
          routes = Router.getRoutes(applicationName),
          location = req.url,
          appConfig = {};

        // TODO: cache loaded config files
        if (fs.existsSync(appConfigPath)) {
            appConfig = JSON.parse(fs.readFileSync(appConfigPath, 'utf8'));
        }

        // Handle favicon request
        if (location === '/favicon.ico') {
            HttpHelpers.write('', 'image/x-icon', res);
            return true;
        }

        // Handle API proxy calls
        if (location.match('^' + this.getConfiguration().get('api.apiCallsPrefix') + '.*')) {
            if (appConfig.apiHost) {
                return HttpHelpers.proxyApiRequest(appConfig.apiHost, req.url, req, res);
            }
            console.error('Api call detected but "apiHost" configuration property missing.');
        }

        // Handle static JS requests
        var buildDirRegex = new RegExp('build');
        if (buildDirRegex.test(location)) {
            // TODO: test CSS support
            fs.readFile(`.${req.url}`, (err, data) => {
                HttpHelpers.write(data, 'text/javascript', res);
            });
            return true;
        }

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