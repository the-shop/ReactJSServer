#ReactJS server
NodeJS application that builds ReactJS templates and routers to serve built applications on initial render 
and in browser.

## Installation
Clone this repository and make sure you have node and npm installed on your server.
Run `npm i` from root of project and it will install all dependencies.

## Running the server
You can start the application by running `npm start`.

Once you start it, default application will be accessible at [http://localhost:80](http://localhost:80) if nothing is 
using the port.

## Configuration
Out of the box, supported environments are `staging` and `production`. Additional config files can be added to 
`config/` directory. You can change the port number and number of CPU cores to use per environment in configuration files.

### Environments and configurations
`NODE_ENV` environment variable is parsed to determine the configuration file to be loaded. 

Development environment is the default one.

## Building applications
All applications are routed based of hostname and are mapped to specific directory. This directory has to live on 
`applications/<HOSTNAME>/` location.

For example, if you want to build a site that would have hostname `google.com` you have to create 
`applications/google.com` directory.

Mandatory files to define `google.com` application are `applications/google.com/router.json` and 
`applications/google.com/index.html`.

`index.html` file is the file that is served directly to browser and it has to contain following part within `<body>`
tag:
```
<div id="app">{{SERVER_RENDER}}</div>
<script src="/build/{{APPLICATION_NAME}}.js"></script>
```
Then the server will inject what is needed to run the app on server start.

`router.json` is JSON representation of react router configuration. Infinite nesting is supported in the format of:
```
{
  "path": "/",
  "component": "App",
  "childRoutes": [
    {
      "path": "documentation",
      "component": "Documentation",
      "childRoutes": [
        {
          "path": "docPage1",
          "component": "doc/DocPage1"
          "childRoutes": [
            ...
          ],
        }
      ],
    }
  ],
  "indexRoute": {
    "component": "Index"
  }
}
```

React components in this example (App, Index, Documentation and DocPage1) would be loaded from 
`applications/google.com/components/` directory and their name would be defined by component name. In this example, 
you'd define react components as:
  - `applications/google.com/components/App`
  - `applications/google.com/components/Index`
  - `applications/google.com/components/Documentation`
  - `applications/google.com/components/doc/DocPage1`

*Notes:*
  1. *JSON was chosen as future plans for this server are to just run it and serve applications through 3rd party API.*
  2. *Not all react router features are supported at this time*
  3. *With API approach in #1 there will be no need for filesystem definition of applications on server itself* 

## Changelog
### Version 0.1.0
Initial server code.

## TODOs
 - Build all applications to separate JS files to reduce filesize
 - Load components through 3rd party API
 - Load routers through 3rd party API
 - Caching mechanisms (configuration, components and built applications) - to reduce amount of disk I/O
 - Components to be modules that contain full component representation (React + styling)
 - Memory / dependencies optimization if / where possible
 - Expires header control