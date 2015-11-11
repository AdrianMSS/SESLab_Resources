define([
  'jquery',
  'underscore',
  'backbone', 
  'driversCollection',
  'text!../templates/drivers.html',
  'componentHandler'
], function ($, _, Backbone, driversCollection, drivers_template, componentHandler) {
  'use strict';
  var DriversCollection = new driversCollection(),
  DriversView = Backbone.View.extend({
    el: '.content',
    drivers_template: _.template(drivers_template),
    hidden: true,
    imgPath:'null',
    events: {
      'click .saveDriver': 'saveDriver',
      'click .saveEdit': 'saveEdit',
      'click .delete': 'deleteDriver'
    },

    initialize: function (options) {
        // ---------------------------------
        // Add thishe options as part of the instance
        //_.extend(this, options);
      this.undelegateEvents();
    },

    render: function() { 
      this.$el.html('').hide().fadeIn().slideDown('slow');
      this.$el.append(this.drivers_template({models:DriversCollection.models}));
      this.delegateEvents();
      componentHandler.upgradeDom();
      if(!this.hidden){
        $('#checkBadge').removeClass('hidden');
        setTimeout(this.addHidden, 3000, '#checkBadge'); 
        this.hidden = true;
      }
    },

    driversFetch: function(that){
      var setHeader = function(req){
        req.setRequestHeader('content-type', 'application/json');
      };
      DriversCollection.fetch({
        beforeSend: setHeader,
        success: function(res){
          that.render();
        },
        error: function(res){
        }
      })
    },

    saveDriver: function(e){
      e.preventDefault();
      var setHeader = function(req){
        req.setRequestHeader('content-type', 'application/json');
      },
        driverId = $( '.driverId' ).val(),
        driverName = $( '.driverName' ).val(),
        driverPhone = $( '.driverPhone' ).val(),
        driverActive = $( '.driverActive' ).prop('checked');
      $.ajax({ 
        url: 'users',
        type: 'POST',
        data: JSON.stringify({
          '_id' : driverId,
          'name' : driverName,
          'phone' : driverPhone,
          'active': driverActive,
          'type': 2
        }),
        beforeSend : setHeader,
        complete: function(res){
          if(res.status == 200){   
            this.hidden = false;
            $( '#closeModal' ).trigger('click');
            setTimeout(this.driversFetch, 500, this); 
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
        driverNewId = $( '.'+e.currentTarget.value+'driverNewId' ).val(),
        driverName = $( '.'+e.currentTarget.value+'driverName' ).val(),
        driverPhone = $( '.'+e.currentTarget.value+'driverPhone' ).val(),
        driverActive = $( '.'+e.currentTarget.value+'driverActive' ).prop('checked'),
        driverID = e.currentTarget.id;
      $.ajax({ 
        url: 'users',
        type: 'PUT',
        data: JSON.stringify({
          '_id' : driverID,
          'ID' : driverNewId,
          'name' : driverName,
          'phone' : driverPhone,
          'active' : driverActive,
          'type' : 2
        }),
        beforeSend : setHeader,
        complete: function(res){
          if(res.status == 200){   
            this.hidden = false;
            $( '.closeModal' ).trigger('click');
            setTimeout(this.driversFetch, 500, this); 
          }
          //console.log(eval('(' + e.responseText + ')').name);
        }.bind(this)
      });
    },

    deleteDriver: function(e){
      e.preventDefault();
      var setHeader = function(req){
        req.setRequestHeader('content-type', 'application/json');
      },
        driverID = e.currentTarget.id.split('D')[0];
      $.ajax({ 
        url: 'users',
        type: 'DELETE',
        data: JSON.stringify({
          '_id': driverID
        }),
        beforeSend : setHeader,
        complete: function(res){
          if(res.status == 200){   
            this.hidden = false;
            $( '.closeModal' ).trigger('click');
            setTimeout(this.driversFetch, 500, this); 
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

  return DriversView;
});

