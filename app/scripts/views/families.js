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
    events: {
      'click .saveFamily': 'saveFamily'
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
        familyConsumption = $( '.familyConsumption' ).val();
      $.ajax({ 
        url: 'families',
        type: 'POST',
        data: JSON.stringify({
          'name' : familyName,
          'description' : familyDescription,
          'consumptionType' : familyConsumption,
          'type' : familyType
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

  return FamiliesView;
});

