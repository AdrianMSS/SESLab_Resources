define([
	'underscore',
	'backbone',
	'models/admins'
], function (_, Backbone,AdminsModel) {
	'use strict';

	var AdminsCollection = Backbone.Collection.extend({
		model: AdminsModel,
		url: '/energyresources/admins/'
	});

	return AdminsCollection;
});