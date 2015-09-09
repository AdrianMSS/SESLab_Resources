define([
  'jquery',
  'underscore',
  'backbone', 
  'resourcesCollection',
  'text!../templates/models.html',
  'componentHandler'
], function ($, _, Backbone, resourcesCollection, models_template, componentHandler) {
  'use strict';
  var ResourcesCollection = new resourcesCollection(),
  ModelsView = Backbone.View.extend({
    el: '.content',
    models_template: _.template(models_template),
    hidden: true,
    events: {
      'click .saveModel': 'saveModel'
    },

    initialize: function (options) {
        // ---------------------------------
        // Add thishe options as part of the instance
        //_.extend(this, options);
      this.undelegateEvents();
    },

    render: function() { 
      this.$el.html('').hide().fadeIn().slideDown('slow');
      this.$el.append(this.models_template({models:ResourcesCollection.models}));
      this.delegateEvents();
      componentHandler.upgradeDom();
      if(!this.hidden){
        $('#checkBadge').removeClass('hidden');
        setTimeout(this.addHidden, 3000, '#checkBadge');
        this.hidden = true; 
      }
    },

    resourcesFetch: function(that){
      var setHeader = function(req){
        req.setRequestHeader('content-type', 'application/json');
      };
      ResourcesCollection.fetch({
        beforeSend: setHeader,
        success: function(res){
          that.render();
        },
        error: function(res){
        }
      })
    },

    saveModel: function(e){
      e.preventDefault();
      var setHeader = function(req){
        req.setRequestHeader('content-type', 'application/json');
      },
        modelFamily = $( '.modelFamily' ).val(),
        modelManufacturer = $( '.modelManufacturer' ).val(),
        modelModel = $( '.modelModel' ).val(),
        modelRatio = $( '.modelRatio' ).val(),
        modelConsumption = $( '.modelConsumption' ).val(),
        modelCharacteristics = $( '.modelCharacteristics' ).val();
      $.ajax({ 
        url: 'models',
        type: 'POST',
        data: JSON.stringify({
          'manufacturer' : modelManufacturer,
          'model' : modelModel,
          'consumptionRatio' : modelRatio,
          'estimatedConsumption' : modelConsumption,
          'characteristics' : modelCharacteristics,
          'family':modelFamily
        }),
        beforeSend : setHeader,
        complete: function(res){
          if(res.status == 200){   
            this.hidden = false;
            $( '#closeModal' ).trigger('click');
            setTimeout(this.resourcesFetch, 500, this); 
          }
          //console.log(eval('(' + e.responseText + ')').name);
        }.bind(this)
      });
    },

    addHidden: function(idMsg) {
      this.hidden = true;
      $(idMsg).addClass('hidden');
    },

    clear: function(e){
      this.$el.html('');
      this.undelegateEvents();
    }
  });

  return ModelsView;
});

