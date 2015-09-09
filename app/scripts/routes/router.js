/*global define*/
define([
  'jquery',
  'backbone',
  'views/navbar',
  'views/home',
  'views/types',
  'views/families',
  'views/models'
], function ($, Backbone, navbarView, homeView, typesView, familiesView, modelsView) {
  'use strict';

  var NavbarView = new navbarView(),
    HomeView = new homeView(),
    TypesView = new typesView(),
    FamiliesView = new familiesView(),
    ModelsView = new modelsView(),
    nowView = undefined,
    Router = Backbone.Router.extend({
      routes: {
          '':     'home',
          'home': 'home',
          'types': 'types',
          'families': 'families',
          'models': 'models',
          'confirmacion': 'con'
      },

      initialize: function() {
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

      con: function() {
          console.log("confirmación");
      }
  });
  return Router;
});


