define([
  'jquery',
  'underscore',
  'backbone', 
  'usersCollection',
  'carmetricsCollection',
  'devicesCollection',
  'text!../templates/carmetrics.html',
  'componentHandler',
  'autocomplete',
  'datepicker'
], function ($, _, Backbone, usersCollection, carmetricsCollection, devicesCollection, metrics_template, componentHandler, autocomplete, datepicker) {
  'use strict';
  var UsersCollection = new usersCollection(),
  CarmetricsCollection = new carmetricsCollection(),
  DevicesCollection = new devicesCollection(),
  CarmetricsView = Backbone.View.extend({
    el: '.content',
    metrics_template: _.template(metrics_template),
    hidden: true,
    users:{},
    devices:{},
    users2:[],
    devices2:[],
    months:{1:'Enero',2:'Febrero',3:'Marzo',4:'Abril',5:'Mayo',6:'Junio',7:'Julio',8:'Agosto',9:'Setiembre',10:'Octubre',11:'Noviembre',12:'Diciembre'},
    events: {
      'click .saveMetric': 'saveMetric',
      'click .saveEdit': 'saveEdit',
      'click .delete': 'deleteMetric'
    },

    initialize: function (options) {
        // ---------------------------------
        // Add thishe options as part of the instance
        //_.extend(this, options);
      this.undelegateEvents();
    },

    render: function() {
      var users = this.users,
        devices = this.devices,
        users2 = this.users2,
        devices2 = this.devices2,
        months = this.months; 
      this.$el.html('').hide().fadeIn().slideDown('slow');
      this.$el.append(this.metrics_template({models:CarmetricsCollection.models, users:users, devices:devices, months:months}));
      this.delegateEvents();

      if(!this.hidden){
        $('#checkBadge').removeClass('hidden');
        setTimeout(this.addHidden, 3000, '#checkBadge'); 
        this.hidden = true;
      }
      $(".metricDevice").autocomplete({source: devices2});
      $(".metricUser").autocomplete({source: users2});
      $("#datepicker").datepicker({dateFormat:'dd/mm/yy'});
    },

    metricsFetch: function(that){
      var setHeader = function(req){
        req.setRequestHeader('content-type', 'application/json');
      };
      CarmetricsCollection.fetch({
        beforeSend: setHeader,
        success: function(res){
          that.render();
        },
        error: function(res){
        }
      })
    },

    usersFetch: function(that){
      var setHeader = function(req){
        req.setRequestHeader('content-type', 'application/json');
      };
      UsersCollection.fetch({
        beforeSend: setHeader,
        success: function(res){
          that.setUsers(that);
        },
        error: function(res){
        }
      })
    },

    devicesFetch: function(that){
      var setHeader = function(req){
        req.setRequestHeader('content-type', 'application/json');
      };
      DevicesCollection.fetch({
        beforeSend: setHeader,
        success: function(res){
          that.setDevices(that);
        },
        error: function(res){
        }
      })
    },

    setDevices: function(that){
      that.devices = {};
      that.devices2 = [];
      _.each(DevicesCollection.models, function(model){
        that.devices[model.attributes.ID]=model.attributes.description;
        that.devices2.push(model.attributes.ID);
      });
      that.metricsFetch(that);
    },

    setUsers: function(that){
      that.users = {};
      that.users2 = [];
      _.each(UsersCollection.models, function(model){
        that.users[model.attributes._id]=model.attributes.name;
        that.users2.push(model.attributes._id);
      });
      that.devicesFetch(that);
    },

    saveMetric: function(e){
      e.preventDefault();
      var setHeader = function(req){
        req.setRequestHeader('content-type', 'application/json');
      },
        metricDevice = $( '.metricDevice' ).val(),
        metricUser = $( '.metricUser' ).val(),
        metricValue =  $( '.metricValue' ).val(),
        metricValue2 = $( '.metricValue2' ).val(),
        metricValue3 = $( '.metricValue3' ).val(),
        metricValue4 = $( '.metricValue4' ).val(),
        metricDate = $( '.metricDate' ).val();
      $.ajax({ 
        url: 'carmetrics',
        type: 'POST',
        data: JSON.stringify({
          'ID' : metricDevice,
          'user' : metricUser,
          'liters': metricValue,
          'km': metricValue2,
          'amount': metricValue3,
          'bill': metricValue4,
          'date': metricDate
        }),
        beforeSend : setHeader,
        complete: function(res){
          if(res.status == 200){   
            this.hidden = false;
            $( '#closeModal' ).trigger('click');
            setTimeout(this.usersFetch, 500, this); 
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
        metricDevice = $( '.'+e.currentTarget.value+'metricDevice' ).val(),
        metricUser = $( '.'+e.currentTarget.value+'metricUser' ).val(),
        metricValue = $( '.'+e.currentTarget.value+'metricValue' ).val(),
        metricValue2 = $( '.'+e.currentTarget.value+'metricValue2' ).val(),
        metricID = e.currentTarget.id;
      $.ajax({ 
        url: 'carmetrics',
        type: 'PUT',
        data: JSON.stringify({
          '_id' : metricID,
          'ID' : metricDevice,
          'user' : metricUser,
          'value' : metricValue,
          'km' : metricValue2
        }),
        beforeSend : setHeader,
        complete: function(res){
          if(res.status == 200){   
            this.hidden = false;
            $( '.closeModal' ).trigger('click');
            setTimeout(this.usersFetch, 500, this); 
          }
          //console.log(eval('(' + e.responseText + ')').name);
        }.bind(this)
      });
    },

    deleteMetric: function(e){
      e.preventDefault();
      var setHeader = function(req){
        req.setRequestHeader('content-type', 'application/json');
      },
        metricID = e.currentTarget.id.split('D')[0];
      $.ajax({ 
        url: 'carmetrics',
        type: 'DELETE',
        data: JSON.stringify({
          '_id': metricID
        }),
        beforeSend : setHeader,
        complete: function(res){
          if(res.status == 200){   
            this.hidden = false;
            $( '.closeModal' ).trigger('click');
            setTimeout(this.usersFetch, 500, this); 
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

  return CarmetricsView;
});

