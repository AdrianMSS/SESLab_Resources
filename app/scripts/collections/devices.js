define([
	'underscore',
	'backbone',
	'models/devices'
], function (_, Backbone,DevicesModel) {
	'use strict';

	var DevicesCollection = Backbone.Collection.extend({
		model: DevicesModel,
		url: '/devices/'
	});

	return DevicesCollection;
});