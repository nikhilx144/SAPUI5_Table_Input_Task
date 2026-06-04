/*global QUnit*/

sap.ui.define([
	"input/in/table/tasks/ui5/ui5inputintablerowtask/controller/StudentTable.controller"
], function (Controller) {
	"use strict";

	QUnit.module("StudentTable Controller");

	QUnit.test("I should test the StudentTable controller", function (assert) {
		var oAppController = new Controller();
		oAppController.onInit();
		assert.ok(oAppController);
	});

});
