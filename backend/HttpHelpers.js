import zlib from 'zlib';
import fs from 'fs';
import React from 'react';
import ReactDOM from 'react-dom/server';
import { RouterContext } from 'react-router';
import request from 'request';

/**
 * Class of helpers for http module
 */
class HttpHelpers {
  /**
   * Helper for server errors, output $message to $res as HTML
   *
   * @param message
   * @param res
   */
  static serverError(message, res) {
    res.writeHead(500, {'Content-Type': 'text/html'});
    res.write(message);
    res.end();
  }

  /**
   * React router redirect helper
   *
   * @param location
   * @param res
   */
  static redirect(location, res) {
    res.writeHead(303, {'Location': location});
    res.end();
  }

  /**
   * Route not found in React router helper
   *
   * @param res
   */
  static routeNotFound(res) {
    res.writeHead(404, {'Content-Type': 'text/html'});
    res.write('Not Found');
    res.end();
  }

  /**
   * Write $string output of $type to $res
   *
   * @param string
   * @param type
   * @param res
   * @param statusCode
   * @param responseHeaders
   */
  static write(string, type, res, statusCode = 200, responseHeaders = {}) {
    zlib.gzip(string, (err, result) => {
      const headers = Object.assign(
        {},
        responseHeaders,
        {
          'Content-Length': result.length,
          'Content-Type': type,
          'Content-Encoding': 'gzip'
        });
      res.writeHead(statusCode, headers);
      res.write(result);
      res.end();
    });
  }

  /**
   * Helper method to proxy API calls
   *
   * @param apiHost
   * @param path
   * @param req
   * @param res
   * @returns {boolean}
   */
  static proxyApiRequest(apiHost, path, req, res) {
    req.pipe(request('http://' + apiHost + path)).pipe(res);
  }

  /**
   * Used to server initial HTML page from server
   *
   * @param applicationName
   * @param renderProps
   * @param res
   */
  static renderPage(applicationName, renderProps, req, res) {
    const markup = ReactDOM.renderToString(<RouterContext {...renderProps} />);
    let html = fs.readFileSync(`./applications/${applicationName}/index.html`, 'utf8', (err) => {
      if (err) {
        throw err;
      }
    });

    html = html.replace('{{SERVER_RENDER}}', markup);
    // TODO: remove hardcoded application "main" when separate app build is available
    html = html.replace('{{APPLICATION_NAME}}', 'main');
    HttpHelpers.write(html, 'text/html', res);
  }
}

export default HttpHelpers;
