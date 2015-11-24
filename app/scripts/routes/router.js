/*global define*/
define([
  'jquery',
  'backbone',
  'views/navbar',
  'views/home',
  'views/types',
  'views/families',
  'views/devices',
  'views/models',
  'views/admins',
  'views/drivers',
  'views/metrics',
  'views/carmetrics'
], function ($, Backbone, navbarView, homeView, typesView, familiesView, devicesView, modelsView, adminsView, driversView, metricsView, carmetricsView) {
  'use strict';

  var NavbarView = new navbarView(),
    HomeView = new homeView(),
    TypesView = new typesView(),
    FamiliesView = new familiesView(),
    DevicesView = new devicesView(),
    ModelsView = new modelsView(),
    AdminsView = new adminsView(),
    DriversView = new driversView(),
    MetricsView = new metricsView(),
    CarmetricsView = new carmetricsView(),
    nowView = undefined,
    Router = Backbone.Router.extend({
      routes: {
          '':     'home',
          'home': 'home',
          'types': 'types',
          'families': 'families',
          'models': 'models',
          'devices': 'devices',
          'admins': 'admins',
          'drivers': 'drivers',
          'metrics': 'metrics',
          'carsmetrics': 'carsmetrics'
      },

      initialize: function() {
        //NavbarView.clear();
        HomeView.clear();
        TypesView.clear();
        FamiliesView.clear();
        DevicesView.clear();
        ModelsView.clear();
        AdminsView.clear();
        DriversView.clear();
        MetricsView.clear();
      },

      home: function() {
        if(nowView){
          nowView.clear();
        }
        nowView = HomeView;
        NavbarView.render();
        HomeView.render();
      },

      types: function() {
        if(nowView){
          nowView.clear();
        }
        nowView = TypesView;
        TypesView.resourcesFetch(TypesView);
      },

      families: function() {
        if(nowView){
          nowView.clear();
        }
        nowView = FamiliesView;
        FamiliesView.resourcesFetch(FamiliesView);
      },

      models: function() {
        if(nowView){
          nowView.clear();
        }
        nowView = ModelsView;
        ModelsView.resourcesFetch(ModelsView);
      },

      devices: function() {
        if(nowView){
          nowView.clear();
        }
        nowView = DevicesView;
        DevicesView.resourcesFetch(DevicesView);
      },

      admins: function() {
        if(nowView){
          nowView.clear();
        }
        nowView = AdminsView;
        AdminsView.adminsFetch(AdminsView);
      },

      drivers: function() {
        if(nowView){
          nowView.clear();
        }
        nowView = DriversView;
        DriversView.driversFetch(DriversView);
      },

      metrics: function() {
        if(nowView){
          nowView.clear();
        }
        nowView = MetricsView;
        MetricsView.usersFetch(MetricsView);
      },

      carsmetrics: function() {
        if(nowView){
          nowView.clear();
        }
        nowView = CarmetricsView;
        CarmetricsView.usersFetch(CarmetricsView);
      }
  });
  return Router;
});


