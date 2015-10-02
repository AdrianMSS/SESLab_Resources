/*global define*/
define([
  'jquery',
  'backbone',
  'views/navbar',
  'views/home',
  'views/types',
  'views/families',
  'views/devices',
  'views/models'
], function ($, Backbone, navbarView, homeView, typesView, familiesView, devicesView, modelsView) {
  'use strict';

  var NavbarView = new navbarView(),
    HomeView = new homeView(),
    TypesView = new typesView(),
    FamiliesView = new familiesView(),
    DevicesView = new devicesView(),
    ModelsView = new modelsView(),
    nowView = undefined,
    Router = Backbone.Router.extend({
      routes: {
          '':     'home',
          'home': 'home',
          'types': 'types',
          'families': 'families',
          'models': 'models',
          'devices': 'devices'
      },

      initialize: function() {
        //NavbarView.clear();
        HomeView.clear();
        TypesView.clear();
        FamiliesView.clear();
        DevicesView.clear();
        ModelsView.clear();
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
      }
  });
  return Router;
});


