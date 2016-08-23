/**
 * Class is responsible for loading applications code
 */
class Application {
    /**
     * Initialize object
     */
    constructor() {
        this.cachedApplications = {};
    }

    /**
     * Method will check does application router exists for suggested name, if not it will fallback to default
     * application.
     *
     * @param host
     * @returns {*}
     */
    resolveApplicationName(host) {
        const parts = host.split(':');
        const applicationName = parts[0];

        if (this.cachedApplications[host]) {
            return this.cachedApplications[host];
        }

        // Check if router is defined for given host and if not, fallback to "default" application
        try {
            require('../applications/' + applicationName + '/router.json');
        } catch (e) {
            console.log(`Application "${applicationName}" router missing. Fallback to "default" application.`);
            host = 'default';
        }

        this.cachedApplications[host] = applicationName;

        return applicationName;
    }
}

export default Application;
