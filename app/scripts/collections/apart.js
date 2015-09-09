define([
	'underscore',
	'backbone',
	'models/apart'
], function (_, Backbone,ProjectsApart) {
	'use strict';

	var ApartCollection = Backbone.Collection.extend({
		model: ProjectsApart,
		url: '/Apart/'
	});

	return ApartCollection;
});