define([
  'jquery',
  'underscore',
  'backbone', 
  'apartCollection',
  'text!../templates/home.html'
], function ($, _, Backbone, apartCollection, home_template) {
  'use strict';
  var ApartCollection = new apartCollection(),
  HomeView = Backbone.View.extend({
    el: '.content',
    home_template: _.template(home_template),
    projectsClick:0,
    torreClick:0,
    unidadClick:0,
    proyectos:{},
    nombresProyectos:{},
    torres:{},
    nombresTorres:{},
    unidades:{},
    unidad: 0,

    events: {
      'click .dropdownProjects': 'projectsClicked',
      'change .dropdownProjects': 'projectsChanged',
      'click .dropdownTorre': 'torreClicked',
      'change .dropdownTorre': 'torreChanged',
      'click .dropdownUnidad': 'unidadClicked',
      'change .dropdownUnidad': 'unidadChanged'
    },

    initialize: function (options) {
        // ---------------------------------
        // Add thishe options as part of the instance
        //_.extend(this, options);
      this.unbind();
    },

    render: function() { 
      this.apartFetch(); 
    },

    renderMain: function(){
      this.$el.html('').hide().fadeIn().slideDown('slow');
      this.$el.append(this.home_template({proyectos: this.nombresProyectos}));
      this.bind();
    },

    resetCombox: function(bool){
      if(bool){ 
          $('.dropdownUnidad').empty();
          $('.dropdownUnidad').append($('<option></option>').val('null').html('Seleccione una Torre'));
          $('.dropdownUnidad').attr('disabled', 'disabled');
          this.torreClick=0;
      }
      $('.dropdownComun').empty();
      $('.dropdownComun').append($('<option></option>').val('null').html('Seleccione una Unidad'));
      $('.dropdownComun').attr('disabled', 'disabled');
      this.unidadClick=0;
    },

    apartFetch: function(){
      var setHeader = function(req){
        req.setRequestHeader('content-type', 'application/json');
      };
      ApartCollection.fetch({
        beforeSend: setHeader,
        success: function(res){
        }.bind(this),
        error: function(res){
        }
      })
    },

    projectsClicked: function(){
      if(this.projectsClick==1){
        var nombreProyecto = $('.dropdownProjects').val(),
          torres = _.filter(ApartCollection.models, function(model){ return model.attributes.Proyecto ==  nombreProyecto; });
        this.torres = torres;
        var mySelect = $('.dropdownTorre').empty();
        _.each(torres, function(torre) {
            mySelect.append(
                $('<option></option>').val(torre.attributes.Torre).html(torre.attributes.Torre)
            );
        });
         $('.dropdownTorre').removeAttr('disabled');
        this.resetCombox(true);
      }
      this.projectsClick++;
    },

    projectsChanged: function(){
      var nombreProyecto = $('.dropdownProjects').val(),
        torres = _.filter(ApartCollection.models, function(model){ return model.attributes.Proyecto ==  nombreProyecto; });
      this.torres = torres;
      var mySelect = $('.dropdownTorre').empty();
      _.each(torres, function(torre) {
          mySelect.append(
              $('<option></option>').val(torre.attributes.Torre).html(torre.attributes.Torre)
          );
      });
       $('.dropdownTorre').removeAttr('disabled');
      this.resetCombox(true);
    },

    torreClicked: function(){
      if(this.torreClick==1){
        var nombreTorre = $('.dropdownTorre').val(),
          nombreProyecto = $('.dropdownProjects').val(),
          unidades = _.filter(ApartCollection.models, function(model){ return (model.attributes.Proyecto ==  nombreProyecto && model.attributes.Torre == nombreTorre); });
        this.unidades = unidades;
        var mySelect = $('.dropdownUnidad').empty();
        _.each(unidades, function(unidad) {
          mySelect.append(
              $('<option></option>').val(unidad.attributes._id).html(unidad.attributes.Unidad)
          );
        });
       $('.dropdownUnidad').removeAttr('disabled');
       this.resetCombox(false);
      }
      this.torreClick++;
    },

    torreChanged: function(){
      var nombreTorre = $('.dropdownTorre').val(),
          nombreProyecto = $('.dropdownProjects').val(),
          unidades = _.filter(ApartCollection.models, function(model){ return (model.attributes.Proyecto ==  nombreProyecto && model.attributes.Torre == nombreTorre); });
      this.unidades = unidades;
      var mySelect = $('.dropdownUnidad').empty();
      _.each(unidades, function(unidad) {
        mySelect.append(
            $('<option></option>').val(unidad.attributes._id).html(unidad.attributes.Unidad)
        );
      });
       $('.dropdownUnidad').removeAttr('disabled');
       this.resetCombox(false);
    },

    
    setInfo: function(){
      var proyectos = _.groupBy(ApartCollection.models, function(model){
        return model.attributes.Proyecto;
      });
      this.proyectos = proyectos;
      this.nombresProyectos = _.keys(proyectos);
      this.renderMain();
    },

    clear: function(e){
      this.$el.html('');
      this.unbind();
    }
  });

  return HomeView;
});

