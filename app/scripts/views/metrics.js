define([
  'jquery',
  'underscore',
  'backbone', 
  'usersCollection',
  'metricsCollection',
  'devicesCollection',
  'text!../templates/metrics.html',
  'componentHandler'
], function ($, _, Backbone, usersCollection, metricsCollection, devicesCollection, metrics_template, componentHandler) {
  'use strict';
  var UsersCollection = new usersCollection(),
  MetricsCollection = new metricsCollection(),
  DevicesCollection = new devicesCollection(),
  MetricsView = Backbone.View.extend({
    el: '.content',
    metrics_template: _.template(metrics_template),
    hidden: true,
    users:{},
    devices:{},
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
        months = this.months; 
      this.$el.html('').hide().fadeIn().slideDown('slow');
      this.$el.append(this.metrics_template({models:MetricsCollection.models, users:users, devices:devices, months:months}));
      this.delegateEvents();
      componentHandler.upgradeDom();
      if(!this.hidden){
        $('#checkBadge').removeClass('hidden');
        setTimeout(this.addHidden, 3000, '#checkBadge'); 
        this.hidden = true;
      }
    },

    metricsFetch: function(that){
      var setHeader = function(req){
        req.setRequestHeader('content-type', 'application/json');
      };
      MetricsCollection.fetch({
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
      _.each(DevicesCollection.models, function(model){
        that.devices[model.attributes.ID]=model.attributes.description;
      });
      that.metricsFetch(that);
    },

    setUsers: function(that){
      that.users = {};
      _.each(UsersCollection.models, function(model){
        that.users[model.attributes._id]=model.attributes.name;
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
        metricValue = $( '.metricValue' ).val();
      $.ajax({ 
        url: 'metrics',
        type: 'POST',
        data: JSON.stringify({
          'ID' : metricDevice,
          'user' : metricUser,
          'value': metricValue
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
        metricID = e.currentTarget.id;
      $.ajax({ 
        url: 'metrics',
        type: 'PUT',
        data: JSON.stringify({
          '_id' : metricID,
          'ID' : metricDevice,
          'user' : metricUser,
          'value' : metricValue
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
        url: 'metrics',
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

  return MetricsView;
});

