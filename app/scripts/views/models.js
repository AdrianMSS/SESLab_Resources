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
    imgPath:'null',
    events: {
      'click .saveModel': 'saveModel',
      'submit #uploadForm': 'submitImage',
      'change #userPhotoInput': 'checkIt',
      'submit .uploadForm': 'submitEdit',
      'change .userPhotoInput': 'checkEdit',
      'click .saveEdit': 'saveEdit',
      'click .delete': 'deleteModel'
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
        modelCharacteristics = $( '.modelCharacteristics' ).val(),
        modelImage = this.imgPath;
      $.ajax({ 
        url: 'models',
        type: 'POST',
        data: JSON.stringify({
          'manufacturer' : modelManufacturer,
          'model' : modelModel,
          'consumptionRatio' : modelRatio,
          'estimatedConsumption' : modelConsumption,
          'characteristics' : modelCharacteristics,
          'family':modelFamily,
          'image': modelImage
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

    saveEdit: function(e){
      e.preventDefault();
      var setHeader = function(req){
        req.setRequestHeader('content-type', 'application/json');
      },
      modelFamily = $( '.'+e.currentTarget.value+'modelFamily' ).val(),
      modelManufacturer = $( '.'+e.currentTarget.value+'modelManufacturer' ).val(),
      modelModel = $( '.'+e.currentTarget.value+'modelModel' ).val(),
      modelRatio = $( '.'+e.currentTarget.value+'modelRatio' ).val(),
      modelConsumption = $( '.'+e.currentTarget.value+'modelConsumption' ).val(),
      modelCharacteristics = $( '.'+e.currentTarget.value+'modelCharacteristics' ).val(),
      modelImage = $( '#'+e.currentTarget.value+'uploadedImage' ).attr('src'),
      modelID = e.currentTarget.id;
      $.ajax({ 
        url: 'models',
        type: 'PUT',
        data: JSON.stringify({
          'manufacturer' : modelManufacturer,
          'model' : modelModel,
          'consumptionRatio' : modelRatio,
          'estimatedConsumption' : modelConsumption,
          'characteristics' : modelCharacteristics,
          'family':modelFamily,
          'image': modelImage,
          'ID': modelID
        }),
        beforeSend : setHeader,
        complete: function(res){
          if(res.status == 200){   
            this.hidden = false;
            $( '.closeModal' ).trigger('click');
            setTimeout(this.resourcesFetch, 500, this); 
          }
          //console.log(eval('(' + e.responseText + ')').name);
        }.bind(this)
      });
    },

    submitImage: function(e){
      var that = this;
      $("#uploadForm").ajaxSubmit({ 
        error: function(xhr) {
          console.log(xhr.status);
        },
        success: function(res) {
          that.imgPath = res.path;
          $('#uploadedImage').attr('src', res.path);
        }
      });
      return false;
    },

    checkIt: function(e){
      $( "#uploadForm" ).submit();
    },

    submitEdit: function(e){
      var that = this,
        modelID = '#'+e.currentTarget.id,
        modelImg = '#'+e.currentTarget.id.split('u')[0]+'uploadedImage';
      $(modelID).ajaxSubmit({ 
        error: function(xhr) {
          console.log(xhr.status);
        },
        success: function(res) {
          that.imgPath = res.path;
          $(modelImg).attr('src', res.path);
        }
      });
      return false;
    },

    checkEdit: function(e){
      var modelID = '#'+e.currentTarget.id.split('P')[0]+'uploadForm';
      $( modelID ).submit();
    },

    deleteModel: function(e){e.preventDefault();
      var setHeader = function(req){
        req.setRequestHeader('content-type', 'application/json');
      },
        modelID = e.currentTarget.id.split('D')[0];
      $.ajax({ 
        url: 'models',
        type: 'DELETE',
        data: JSON.stringify({
          'ID': modelID
        }),
        beforeSend : setHeader,
        complete: function(res){
          if(res.status == 200){   
            this.hidden = false;
            $( '.closeModal' ).trigger('click');
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

