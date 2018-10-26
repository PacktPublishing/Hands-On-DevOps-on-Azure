const appInsights = require("applicationinsights");

var enabled = false;
try {
    appInsights.setup("5e86f9fa-4711-4fa8-9356-a678caea5290") // Replace with your own AI key
            .setAutoDependencyCorrelation(true)
            .setAutoCollectRequests(true)
            .setAutoCollectPerformance(true)
            .setAutoCollectExceptions(true)
            .setAutoCollectDependencies(true)
            .setAutoCollectConsole(true)
            .setUseDiskRetryCaching(true)
            .start();

    enabled = true;
} catch (error) {
    console.log("[Logging] " + error);
    enabled = false;
} finally {
    if(enabled) {
        console.log("Connected to the Application Insights instance.");
    } else {
        console.log("Cannot start Application Insights; either pass the value to this app, or use the App Insights default environment variable.");
    }
}

module.exports = {
    ready: enabled,
    logRequest: function(req) {
        let message = `[Request] ${req.method}: ${req.originalUrl}.`;
        console.log(message);
        if(this.ready) {
            appInsights.defaultClient.trackRequest({ name: "normalPage", properties: 
                { type: "page", value: req.originalUrl, dateTime: new Date() }});
        }
    },
    logError: function(module, error) {
        let message = `[Error] ${module} threw error: ${error}`;
        if(this.ready) {
            appInsights.defaultClient.trackException({ name: module, properties: {
                dateTime: new Date(),
                error: error
            }});
        }
        console.log(message);
    },
    logEvent: function(name, data) {
        let message = `[Event] ${name}: ${data}.`;
        if(this.ready) {
            appInsights.defaultClient.trackEvent({ name: name, properties: { data: data }});
        }
        console.log(message);
    },
    logApiCall: function(apiRoute) {
        let message = `[API] ${apiRoute}.`;
        if(this.ready) {
            appInsights.defaultClient.trackRequest({ name: "apiCall", properties: 
            { type: "api", value: apiRoute, dateTime: new Date() }});
        }
        console.log(message);
    }
}