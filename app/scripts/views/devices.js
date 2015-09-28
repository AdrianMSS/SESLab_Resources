define([
  'jquery',
  'underscore',
  'backbone', 
  'resourcesCollection',
  'devicesCollection',
  'text!../templates/devices.html',
  'componentHandler'
], function ($, _, Backbone, resourcesCollection, devicesCollection, devices_template, componentHandler) {
  'use strict';
  var ResourcesCollection = new resourcesCollection(),
    DevicesCollection = new devicesCollection(),
  DevicesView = Backbone.View.extend({
    el: '.content',
    devices_template: _.template(devices_template),
    hidden: true,
    typeTouched:true,
    familyTouched:true,
    types:{},
    families:{},
    models:{},
    events: {
      'click .deviceType': 'deviceType',
      'changed .deviceType': 'setFamilies',
      'click .deviceFamily': 'deviceFamily',
      'changed .deviceFamily': 'setModels',
      'click .saveDevice': 'saveDevice'
    },

    initialize: function (options) {
        // ---------------------------------
        // Add thishe options as part of the instance
        //_.extend(this, options);
      this.undelegateEvents();
    },

    render: function() { 
      var types = this.types,
        families = this.families,
        models = this.models;
      this.$el.html('').hide().fadeIn().slideDown('slow');
      this.$el.append(this.devices_template({devices:DevicesCollection.models, types:types, families:families, models:models}));
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
          that.devicesFetch(that);
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
          that.setResources(that, function(callback){
            if(callback){
              that.render();
            }
          });
        },
        error: function(res){
        }
      })
    },

    setResources: function(that, callback){
      _.each(ResourcesCollection.models, function(types){
        that.types[types.attributes._id] = types.attributes.name;
        _.each(types.attributes.families, function(families){
          that.families[families.ID] = families.name;
          _.each(families.models, function(models){
            that.models[models.ID] = models.manufacturer+' '+models.model;
          });
        });
      });
      callback(true);
    },


    deviceType: function(e){
      this.typeTouched = (! this.typeTouched);
      if(this.typeTouched){
        this.setFamilies(e);
      }
    },

    setFamilies: function(e){
      this.typeTouched = true;
      var items = {},
        $deviceFamily =  $('.deviceFamily'),
        $deviceModel =  $('.deviceModel'),
        idType = parseInt(e.currentTarget.value),
        itemType = ResourcesCollection.findWhere({_id:idType});
      _.each(itemType.attributes.families, function(families){
        items[families.ID] = families.name;
      });
      if(Object.keys(items).length>0){
        $deviceFamily.empty().append(function() {
          var output = '';
          _.each(items, function(value, key) {
              output += '<option value='+key+'>' + value + '</option>';
          });
          return output;
        });
        $deviceModel.empty().append('<option value=false>Seleccione un Tipo de Familia</option>');
        $deviceModel.prop('disabled', 'disabled');
        $deviceFamily.prop('disabled', false);
      }
      else{
        $deviceFamily.empty().append('<option value=false>Tipo de Recurso Sin Familias</option>');
        $deviceFamily.prop('disabled', 'disabled');
        $deviceModel.empty().append('<option value=false>Tipo de Recurso Sin Modelos</option>');
        $deviceModel.prop('disabled', 'disabled');
        this.familyTouched = true;
      }
    },


    deviceFamily: function(e){
      this.familyTouched = (! this.familyTouched);
      if(this.familyTouched){
        this.setModels(e);
      }
    },

    setModels: function(e){
      this.familyTouched = true;
      var items = {},
        family = {},
        $deviceModel =  $('.deviceModel'),
        idFamily = e.currentTarget.value,
        idType = parseInt(idFamily.split('.')[0]),
        itemType = ResourcesCollection.findWhere({_id:idType});
      _.each(itemType.attributes.families, function(families){
        if(families.ID == idFamily){
          family = families;
        }
      });
      _.each(family.models, function(model){
        items[model.ID] = model.manufacturer + ' ' + model.model;
      })
      if(Object.keys(items).length>0){
        $deviceModel.empty().append(function() {
          var output = '';
          _.each(items, function(value, key) {
              output += '<option value='+key+'>' + value + '</option>';
          });
          return output;
        });
        $deviceModel.prop('disabled', false);
      }
      else{
        $deviceModel.empty().append('<option value=false>Familia de Recurso Sin Modelos</option>');
        $deviceModel.prop('disabled', 'disabled');
      }
    },

    saveDevice: function(e){
      e.preventDefault();
      var setHeader = function(req){
        req.setRequestHeader('content-type', 'application/json');
      },
        deviceId = $( '.deviceId' ).val(),
        deviceType = $( '.deviceType' ).val(),
        deviceFamily = $( '.deviceFamily' ).val(),
        deviceModel = $( '.deviceModel' ).val(),
        deviceDescription = $( '.deviceDescription' ).val(),
        deviceLocation = $( '.deviceLocation' ).val();
      $.ajax({ 
        url: 'devices',
        type: 'POST',
        data: JSON.stringify({
          'ID' : deviceId,
          'type' : deviceType,
          'family' : deviceFamily,
          'model' : deviceModel,
          'description' : deviceDescription,
          'location' : deviceLocation
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

  return DevicesView;
});

