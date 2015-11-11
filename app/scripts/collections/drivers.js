define([
	'underscore',
	'backbone',
	'models/drivers'
], function (_, Backbone,DriversModel) {
	'use strict';

	var DriversCollection = Backbone.Collection.extend({
		model: DriversModel,
		url: '/energyresources/drivers/'
	});

	return DriversCollection;
});