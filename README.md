#ReactJS server
NodeJS application that builds ReactJS templates and routers to serve built applications on initial render 
and in browser.

## Installation
Clone this repository and make sure you have node and npm installed on your server.
Run `npm i` from root of project and it will install all dependencies.

## Running the applications
You can start the application by running `npm start`.

Once you start it, default application will be accessible at [http://localhost:80](http://localhost:80) if nothing is 
using the port.

### Environments and configurations
`NODE_ENV` environment variable is parsed to determine the configuration file to be loaded. 

Development environment is the default one.

## Configuration
Supported `staging` and `production`, additional files can be added to `config/` directory.
You can change the port number and number of CPU cores to use per environment in configuration files.

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