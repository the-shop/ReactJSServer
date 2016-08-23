import {match} from 'react-router';
import fs from 'fs';
import HttpHelpers from './HttpHelpers';
import Router from './Router';
import express from 'express';
import bodyParser from 'body-parser';

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
    const app = express();

    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({
      extended: true
    }));

    // Handle favicon request
    app.get('/favicon.ico', function (req, res) {
      HttpHelpers.write('', 'image/x-icon', res);
    });

    // Handle API proxy calls

    app.all('/api*', this.handleApiRequest.bind(this));

    app.all('*', this.handle.bind(this));

    app.listen(this.getPort());

    console.log(`Server process ${process.pid} started on port ${this.getPort()}`);
  }

  handleApiRequest(req, res) {
    const applicationName = this.getApplication().resolveApplicationName(req.headers.host);
    const appConfigPath = './applications/' + applicationName + '/config.json';
    let appConfig = {};

    // TODO: cache loaded config files
    if (fs.existsSync(appConfigPath)) {
      appConfig = JSON.parse(fs.readFileSync(appConfigPath, 'utf8'));
    }

    if (appConfig.apiHost) {
      console.log('Proxy request for [' + req.method + '] ' + req.url + ' path.');
      return HttpHelpers.proxyApiRequest(appConfig.apiHost, req.url, req, res);
    }
    console.error('Api call detected but "apiHost" configuration property missing.');
  }

  /**
   * Server requests handler
   *
   * @param req
   * @param res
   * @returns {boolean}
   */
  handle(req, res) {
    const applicationName = this.getApplication().resolveApplicationName(req.headers.host);
    const location = req.url;

    // Handle static JS requests
    const buildDirRegex = new RegExp('build');
    if (buildDirRegex.test(location)) {
      // TODO: test CSS support
      fs.readFile(`.${location}`, (err, data) => {
        HttpHelpers.write(data, 'text/javascript', res);
      });
      return true;
    }

    match({
      routes: Router.getRoutes(applicationName),
      location: req.originalUrl
    }, (error, redirectLocation, renderProps) => {
      if (error) {
        HttpHelpers.serverError('Server error. Please try again.', res);
      } else if (redirectLocation) {
        HttpHelpers.redirect(redirectLocation, res);
      } else if (renderProps) {
        HttpHelpers.renderPage(applicationName, renderProps, req, res);
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
    const config = this.getConfiguration();
    const configPort = config.application && config.application.port ? config.application.port : 3000;
    return process.env.PORT || configPort;
  }

  /**
   * @returns {*}
   */
  getConfiguration() {
    return this.config || {};
  }

  /**
   * @returns {*}
   */
  getApplication() {
    return this.application;
  }
}

export default Server;