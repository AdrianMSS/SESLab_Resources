define([
	'underscore',
	'backbone',
	'models/metrics'
], function (_, Backbone,MetricsModel) {
	'use strict';

	var MetricsCollection = Backbone.Collection.extend({
		model: MetricsModel,
		url: '/energyresources/metrics/'
	});

	return MetricsCollection;
});