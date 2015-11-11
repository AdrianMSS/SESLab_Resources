define ([
	'underscore',
	'backbone'
], function (_, Backbone) {
	'use strict';

	var UsersModel = Backbone.Model.extend({
		defaults:{
		}
	});

	return UsersModel;
});