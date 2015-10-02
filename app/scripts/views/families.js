define([
  'jquery',
  'underscore',
  'backbone', 
  'resourcesCollection',
  'text!../templates/families.html',
  'componentHandler'
], function ($, _, Backbone, resourcesCollection, families_template, componentHandler) {
  'use strict';
  var ResourcesCollection = new resourcesCollection(),
  FamiliesView = Backbone.View.extend({
    el: '.content',
    families_template: _.template(families_template),
    hidden: true,
    imgPath:'null',
    events: {
      'click .saveFamily': 'saveFamily',
      'submit #uploadForm': 'submitImage',
      'change #userPhotoInput': 'checkIt',
      'submit .uploadForm': 'submitEdit',
      'change .userPhotoInput': 'checkEdit',
      'click .saveEdit': 'saveEdit',
      'click .delete': 'deleteFamily'
    },

    initialize: function (options) {
        // ---------------------------------
        // Add thishe options as part of the instance
        //_.extend(this, options);
      this.undelegateEvents();
    },

    render: function() { 
      this.$el.html('').hide().fadeIn().slideDown('slow');
      this.$el.append(this.families_template({models:ResourcesCollection.models}));
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

    saveFamily: function(e){
      e.preventDefault();
      var setHeader = function(req){
        req.setRequestHeader('content-type', 'application/json');
      },
        familyName = $( '.familyName' ).val(),
        familyType = $( '.familyType' ).val(),
        familyDescription = $( '.familyDescription' ).val(),
        familyConsumption = $( '.familyConsumption' ).val(),
        familyImage = this.imgPath;
      $.ajax({ 
        url: 'families',
        type: 'POST',
        data: JSON.stringify({
          'name' : familyName,
          'description' : familyDescription,
          'consumptionType' : familyConsumption,
          'type' : familyType,
          'image': familyImage
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
      familyName = $( '.'+e.currentTarget.value+'familyName' ).val(),
      familyType = $( '.'+e.currentTarget.value+'familyType' ).val(),
      familyDescription = $( '.'+e.currentTarget.value+'familyDescription' ).val(),
      familyConsumption = $( '.'+e.currentTarget.value+'familyConsumption' ).val(),
      familyImage = $( '#'+e.currentTarget.value+'uploadedImage' ).attr('src'),
      familyID = e.currentTarget.id;
      $.ajax({ 
        url: 'families',
        type: 'PUT',
        data: JSON.stringify({
          'name' : familyName,
          'description' : familyDescription,
          'consumptionType' : familyConsumption,
          'type' : familyType,
          'image': familyImage,
          'ID': familyID
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

    deleteFamily: function(e){e.preventDefault();
      var setHeader = function(req){
        req.setRequestHeader('content-type', 'application/json');
      },
        familyID = e.currentTarget.id.split('D')[0];
      $.ajax({ 
        url: 'families',
        type: 'DELETE',
        data: JSON.stringify({
          'ID': familyID
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

  return FamiliesView;
});

