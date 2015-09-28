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
      'change #userPhotoInput': 'checkIt'
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
      console.log(this.imgPath);
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

