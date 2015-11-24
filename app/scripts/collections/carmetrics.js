define([
	'underscore',
	'backbone',
	'models/carmetrics'
], function (_, Backbone,CarmetricsModel) {
	'use strict';

	var CarmetricsCollection = Backbone.Collection.extend({
		model: CarmetricsModel,
		url: '/energyresources/carmetrics/'
	});

	return CarmetricsCollection;
});