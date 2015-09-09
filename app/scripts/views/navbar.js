define([
  'jquery',
  'underscore',
  'backbone', 
  'text!../templates/navbar.html'
], function ($, _, Backbone, navbar_template) {
  'use strict';
  var NavbarView = Backbone.View.extend({
    el: '#navbar',
    navbar_template: _.template(navbar_template),

    events: {
    },

    initialize: function (options) {
        // ---------------------------------
        // Add thishe options as part of the instance
        //_.extend(this, options);
    },

    render: function() { 
      this.$el.html('').hide().fadeIn().slideDown('slow');
      this.$el.append(this.navbar_template()); 
    }
  });

  return NavbarView;
});

