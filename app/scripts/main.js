/*global require*/
'use strict';

require.config({
    shim: {
        underscore: {
            exports: '_'
        },
        backbone: {
            deps: [
                'underscore',
                'jquery'
            ],
            exports: 'Backbone'
        },
        bootstrap: {
            deps: ['jquery'],
            exports: 'jquery'
        },
        amplify: {
            deps: ['jquery'],
            exports: 'amplify'
        },
        jquery_form: {
            deps: ['jquery'],
            exports: 'jquery_form'
        },
        componentHandler: {
            exports: 'componentHandler'
        }
    },
    paths: {
        jquery: '../bower_components/jquery/dist/jquery',
        backbone: '../bower_components/backbone/backbone',
        underscore: '../bower_components/underscore/underscore',
        bootstrap: '../bower_components/sass-bootstrap/dist/js/bootstrap',
        layoutmanager:   '../bower_components/layoutmanager/backbone.layoutmanager',
        amplify: '../bower_components/amplify/lib/amplify',
        text: '../bower_components/text/text',
        jquery_form: '../bower_components/jquery_form/jquery.form',
        componentHandler: '../bower_components/googlecomponentHandler/material',
        
        //Collections
        devicesCollection: 'collections/devices',
        resourcesCollection: 'collections/resources',
        adminsCollection: 'collections/admins',
        usersCollection: 'collections/users',
        driversCollection: 'collections/drivers',
        metricsCollection: 'collections/metrics'
    }
});

require([
    'backbone', 'routes/router'
], function (Backbone, Router) {
    var appRouter = new Router();
    Backbone.history.start();
});
