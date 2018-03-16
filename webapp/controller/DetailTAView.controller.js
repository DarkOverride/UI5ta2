sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/ui/core/routing/History",
	"sap/ui/model/json/JSONModel",
	"sap/ui/model/Filter",
	"sap/ui/core/Fragment"
], function(
	Controller,
	History,
	JSONModel) {
	"use strict";
	return Controller.extend("STC.controller.DetailTAView", {
		onInit: function() {
			//ausgewählter TA der View zuweisen
			var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
			oRouter.getRoute("detailTA").attachPatternMatched(this._onDetailRouteHit, this);
		},
		_onDetailRouteHit: function(oEvent) {
			var sArgs = oEvent.getParameter("arguments");
			var oView = this.getView();
            var oModel = oView.getModel();
				//zusammenbauen des Keys TransportauftragSet(x,x,x,x)
				var sObjectPath =
					oModel.createKey("TransportauftragSet", {
						Mandt: sArgs.mandt,
						Lgnum: sArgs.lgnum,
						Tanum: sArgs.tanum,
						Tapos: sArgs.tapos
					});
				oView.bindElement({
					path: "/" + sObjectPath
				});
		},
		

		onNavBack: function() {
			// hole den Browserverlauf und navigiere zur vorherigen Seite
			var oHistory = History.getInstance();
			var sPreviousHash = oHistory.getPreviousHash();
			if (sPreviousHash !== undefined) {
				window.history.go(-1);
			} else {
				this.getOwnerComponent().getRouter().navTo("MainView", {}, true);
			}
		}

	});
});