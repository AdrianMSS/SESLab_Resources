define([
  'jquery',
  'underscore',
  'backbone', 
  'resourcesCollection',
  'text!../templates/types.html',
  'componentHandler',
  'jquery_form'
], function ($, _, Backbone, resourcesCollection, types_template, componentHandler, jquery_form) {
  'use strict';
  var ResourcesCollection = new resourcesCollection(),
  TypesView = Backbone.View.extend({
    el: '.content',
    types_template: _.template(types_template),
    hidden: true,
    imgPath:'null',
    events: {
      'click .saveType': 'saveType',
      'submit #uploadForm': 'submitImage',
      'change #userPhotoInput': 'checkIt',
      'submit .uploadForm': 'submitEdit',
      'change .userPhotoInput': 'checkEdit',
      'click .saveEdit': 'saveEdit',
      'click .delete': 'deleteType'
    },

    initialize: function (options) {
        // ---------------------------------
        // Add thishe options as part of the instance
        //_.extend(this, options);
      this.undelegateEvents();
    },

    render: function() { 
      this.$el.html('').hide().fadeIn().slideDown('slow');
      this.$el.append(this.types_template({models:ResourcesCollection.models}));
      this.delegateEvents();
      componentHandler.upgradeDom();
      if(!this.hidden){
        console.log('entré');
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

    saveType: function(e){
      e.preventDefault();
      var setHeader = function(req){
        req.setRequestHeader('content-type', 'application/json');
      },
        typeName = $( '.typeName' ).val(),
        typeDescription = $( '.typeDescription' ).val(),
        typeImage = this.imgPath;
      $.ajax({ 
        url: 'types',
        type: 'POST',
        data: JSON.stringify({
          'name' : typeName,
          'description' : typeDescription,
          'image': typeImage
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
      typeName = $( '.'+e.currentTarget.value+'typeName' ).val(),
      typeDescription = $( '.'+e.currentTarget.value+'typeDescription' ).val(),
      typeImage = $( '#'+e.currentTarget.value+'uploadedImage' ).attr('src'),
      typeID = e.currentTarget.id.split('I')[0];
      $.ajax({ 
        url: 'types',
        type: 'PUT',
        data: JSON.stringify({
          'name' : typeName,
          'description' : typeDescription,
          'image': typeImage,
          '_id': typeID
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

    deleteType: function(e){
      e.preventDefault();
      var setHeader = function(req){
        req.setRequestHeader('content-type', 'application/json');
      },
        typeID = e.currentTarget.id.split('D')[0];
      $.ajax({ 
        url: 'types',
        type: 'DELETE',
        data: JSON.stringify({
          '_id': typeID
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

  return TypesView;
});

