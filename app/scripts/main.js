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
        },
        autocomplete: {
            deps: [
                'core',
                'widget',
                'position',
                'menu'
            ]
        },
        core: {
            deps: ['jquery']
        },
        menu: {
            deps: [
                'core',
                'widget',
                'position'
            ]
        },
        position: {
            deps: ['jquery']
        },
        widget: {
            deps: ['jquery']
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
        autocomplete: '../bower_components/jqueryui/ui/autocomplete',
        core: '../bower_components/jqueryui/ui/core',
        menu: '../bower_components/jqueryui/ui/menu',
        position: '../bower_components/jqueryui/ui/position',
        widget: '../bower_components/jqueryui/ui/widget',
        
        
        //Collections
        devicesCollection: 'collections/devices',
        resourcesCollection: 'collections/resources',
        adminsCollection: 'collections/admins',
        usersCollection: 'collections/users',
        driversCollection: 'collections/drivers',
        metricsCollection: 'collections/metrics',
        carmetricsCollection: 'collections/carmetrics'
    }
});

require([
    'backbone', 'routes/router'
], function (Backbone, Router) {
    var appRouter = new Router();
    Backbone.history.start();
});
