define([
	'underscore',
	'backbone',
	'models/resources'
], function (_, Backbone,resourcesModel) {
	'use strict';

	var ResourcesCollection = Backbone.Collection.extend({
		model: resourcesModel,
		url: '/resources/'
	});

	return ResourcesCollection;
});