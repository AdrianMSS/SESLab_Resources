define([
  'jquery',
  'underscore',
  'backbone', 
  'text!../templates/home.html'
], function ($, _, Backbone, home_template) {
  'use strict';
  var HomeView = Backbone.View.extend({
    el: '.content',
    home_template: _.template(home_template),

    events: {
    },

    initialize: function (options) {
        // ---------------------------------
        // Add thishe options as part of the instance
        //_.extend(this, options);
      this.unbind();
    },

    render: function() { 
      this.$el.html('').hide().fadeIn().slideDown('slow');
      this.$el.append(this.home_template());
      this.bind();
    },

    clear: function(e){
      this.$el.html('');
      this.unbind();
    }
  });

  return HomeView;
});

