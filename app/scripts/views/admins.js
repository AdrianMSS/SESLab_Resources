define([
  'jquery',
  'underscore',
  'backbone', 
  'adminsCollection',
  'text!../templates/admins.html',
  'componentHandler'
], function ($, _, Backbone, adminsCollection, admins_template, componentHandler) {
  'use strict';
  var AdminsCollection = new adminsCollection(),
  AdminsView = Backbone.View.extend({
    el: '.content',
    admins_template: _.template(admins_template),
    hidden: true,
    imgPath:'null',
    events: {
      'click .saveAdmin': 'saveAdmin',
      'click .saveEdit': 'saveEdit',
      'click .delete': 'deleteAdmin'
    },

    initialize: function (options) {
        // ---------------------------------
        // Add thishe options as part of the instance
        //_.extend(this, options);
      this.undelegateEvents();
    },

    render: function() { 
      this.$el.html('').hide().fadeIn().slideDown('slow');
      this.$el.append(this.admins_template({models:AdminsCollection.models}));
      this.delegateEvents();
      componentHandler.upgradeDom();
      if(!this.hidden){
        $('#checkBadge').removeClass('hidden');
        setTimeout(this.addHidden, 3000, '#checkBadge'); 
        this.hidden = true;
      }
    },

    adminsFetch: function(that){
      var setHeader = function(req){
        req.setRequestHeader('content-type', 'application/json');
      };
      AdminsCollection.fetch({
        beforeSend: setHeader,
        success: function(res){
          that.render();
        },
        error: function(res){
        }
      })
    },

    saveAdmin: function(e){
      e.preventDefault();
      var setHeader = function(req){
        req.setRequestHeader('content-type', 'application/json');
      },
        adminId = $( '.adminId' ).val(),
        adminName = $( '.adminName' ).val(),
        adminMail = $( '.adminMail' ).val(),
        adminPass = $( '.adminPass' ).val(),
        adminActive = $( '.adminActive' ).prop('checked');
      $.ajax({ 
        url: 'admins',
        type: 'POST',
        data: JSON.stringify({
          '_id' : adminId,
          'name' : adminName,
          'mail': adminMail,
          'pass': adminPass,
          'active': adminActive
        }),
        beforeSend : setHeader,
        complete: function(res){
          if(res.status == 200){   
            this.hidden = false;
            $( '#closeModal' ).trigger('click');
            setTimeout(this.adminsFetch, 500, this); 
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
        adminNewId = $( '.'+e.currentTarget.value+'adminNewId' ).val(),
        adminName = $( '.'+e.currentTarget.value+'adminName' ).val(),
        adminMail = $( '.'+e.currentTarget.value+'adminMail' ).val(),
        adminActive = $( '.'+e.currentTarget.value+'adminActive' ).prop('checked'),
        adminID = e.currentTarget.id;
      $.ajax({ 
        url: 'admins',
        type: 'PUT',
        data: JSON.stringify({
          '_id' : adminID,
          'ID' : adminNewId,
          'name' : adminName,
          'mail' : adminMail,
          'active' : adminActive
        }),
        beforeSend : setHeader,
        complete: function(res){
          if(res.status == 200){   
            this.hidden = false;
            $( '.closeModal' ).trigger('click');
            setTimeout(this.adminsFetch, 500, this); 
          }
          //console.log(eval('(' + e.responseText + ')').name);
        }.bind(this)
      });
    },

    deleteAdmin: function(e){
      e.preventDefault();
      var setHeader = function(req){
        req.setRequestHeader('content-type', 'application/json');
      },
        adminID = e.currentTarget.id.split('D')[0];
      $.ajax({ 
        url: 'admins',
        type: 'DELETE',
        data: JSON.stringify({
          '_id': adminID
        }),
        beforeSend : setHeader,
        complete: function(res){
          if(res.status == 200){   
            this.hidden = false;
            $( '.closeModal' ).trigger('click');
            setTimeout(this.adminsFetch, 500, this); 
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

  return AdminsView;
});

