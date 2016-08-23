/**
 * Class is responsible for loading configuration and preparing it for react router
 */
class Router {
    /**
     * Returns React Router ready structure
     *
     * @param applicationName
     * @returns {{}}
     */
    static getRoutes(applicationName) {
        const routesDefinition = require('../applications/' + applicationName + '/router.json');

        return this._processRoutesConfig(routesDefinition, applicationName);
    }

    /**
     * Run through configuration recursively and build structure for React router
     *
     * @param definition
     * @param applicationName
     * @returns {{}}
     * @private
     */
    static _processRoutesConfig(definition, applicationName) {
        const builtRoute = {};

        // Each route has to have component defined so let's load it
        builtRoute.component = require('../applications/' + applicationName + '/components/' + definition['component']).default;

        // Check if path defined for currently parsed route and prepare the output
        if (definition.hasOwnProperty('path')) {
            builtRoute.path = definition['path'];
        }

        // Check if there's index route and utilize it
        if (definition.hasOwnProperty('indexRoute')) {
            builtRoute.indexRoute = this._processRoutesConfig(definition['indexRoute'], applicationName);
        }

        // Parse child routes of current route if defined
        if (definition.hasOwnProperty('childRoutes')) {
            const childRoutes = [];
            for (let singleChild of definition['childRoutes']) {
                childRoutes.push(this._processRoutesConfig(singleChild, applicationName));
            }
            builtRoute.getChildRoutes = function (location, cb) {
                cb(null, childRoutes);
            };
        }

        return builtRoute;
    }
}

export default Router;
