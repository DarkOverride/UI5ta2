sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/ui/model/json/JSONModel",
	"sap/ui/model/Filter",
	"jquery.sap.global",
	"sap/ui/core/Fragment",
	"sap/m/StandardListItem",
	"sap/m/MessageToast",
	"sap/m/MessageBox"
], function(Controller, JSONModel, Filter, jQuery, Fragment, List, MessageToast, MessageBox) {
	"use strict";
	var PageController = Controller.extend("STC.controller.MainView", {
		onInit: function() {
			this._oTable = this.getView().byId("taTable");
			var oViewModel = new JSONModel({
				werk: "",
				lgort: "",
				lgnum: ""
			});
			this.getView().setModel(oViewModel, "mainView");
		},
		fetchCustomizingData: function() {
			var table = this._oTable;
			var viewModel = this.getView().getModel("mainView");
			var button = this.getView().byId("conformButton");
			this.getView().getModel().read("/CustomizingSet('')", {
				success: function(oData, response) {
					// set Input fields
					viewModel.setProperty("/werk", oData.Werks);
					viewModel.setProperty("/lgort", oData.Lgort);
					viewModel.setProperty("/lgnum", oData.Lgnum);
					// set Button
					button.setEnabled(!oData.is_taquit);
					table.setMode(sap.m.ListMode.MultiSelect);
				},
				error: function(oData, response) {
					/*	alert("Failed to get InputHelpValues from service!");*/
				}
			});
		},
		sendRequest: function() {
			var werk = this.getView().getModel("mainView").getProperty("/werk");
			var lgort = this.getView().getModel("mainView").getProperty("/lgort");
			var lgnum = this.getView().getModel("mainView").getProperty("/lgnum");
			var button = this.getView().byId("conformButton");
			var filters = [];
			if (werk && werk !== "") {
				var oFilter = new Filter("Werks", "EQ", werk);
				filters.push(oFilter);
			}
			if (lgort && lgort !== "") {
				var oFilter1 = new Filter("Lgort", "EQ", lgort);
				filters.push(oFilter1);
			}
			if (lgnum && lgnum !== "") {
				var oFilter2 = new Filter("Lgnum", "EQ", lgnum);
				filters.push(oFilter2);
			}
			this._oTable.getBinding("items").filter(filters, "Application");
			button.setEnabled(oData.is_taquit);
		},
		handleValueHelp: function(oEvent) {
			var sInputValue = oEvent.getSource().getValue();
			this.inputId = oEvent.getSource().getId();
			// create value help dialog
			if (!this._valueHelpDialog) {
				this._valueHelpDialog = sap.ui.xmlfragment("STC.fragment.WerkDialog", this);
				this.getView().addDependent(this._valueHelpDialog);
			}
			// create a filter for the binding
			this._valueHelpDialog.getBinding("items").filter([new Filter("Werks", sap.ui.model.FilterOperator.Contains, "'" + sInputValue + "'")]);
			// open value help dialog filtered by the input value
			this._valueHelpDialog.open(sInputValue);
		},
		handleValueHelpLgort: function(oEvent) {
			var sInputValue = oEvent.getSource().getValue();
			this.inputId = oEvent.getSource().getId();
			// create value help dialog
			if (!this._valueHelpDialogLgort) {
				this._valueHelpDialogLgort = sap.ui.xmlfragment("STC.fragment.WerkOrtDialog", this);
				this.getView().addDependent(this._valueHelpDialogLgort);
			}
			// bind items 
			var werk = this.getView().getModel("mainView").getProperty("/werk");
			if (werk && !(werk === "")) {
				this._valueHelpDialogLgort.bindAggregation("items", "/WerkSet('" + werk + "')/toWerkOrt", new List({
					title: "{Lgort}",
					description: "{Name}"
				}));
			} else {
				this._valueHelpDialogLgort.bindAggregation("items", "/WerkOrtSet", new List({
					title: "{Lgort}",
					description: "{Name}"
				}));
			}
			// create a filter for the binding
			this._valueHelpDialogLgort.getBinding("items").filter([new Filter("Lgort", sap.ui.model.FilterOperator.Contains, "'" + sInputValue +
				"'")]);
			// open value help dialog filtered by the input value
			this._valueHelpDialogLgort.open(sInputValue);
		},
		handleValueHelpLgnum: function(oEvent) {
			var sInputValue = oEvent.getSource().getValue();
			this.inputId = oEvent.getSource().getId();
			// create value help dialog
			if (!this._valueHelpDialogLgnum) {
				this._valueHelpDialogLgnum = sap.ui.xmlfragment("STC.fragment.WerkOrtLgnumDialog", this);
				this.getView().addDependent(this._valueHelpDialogLgnum);
			}
			// bind items 
			var werk = this.getView().getModel("mainView").getProperty("/werk");
			var lgort = this.getView().getModel("mainView").getProperty("/lgort");
			var filter = [];
			filter.push(new Filter("Lgnum", sap.ui.model.FilterOperator.Contains, "'" + sInputValue + "'"));
			if (werk && !(werk === "")) {
				filter.push(new Filter("Werks", "EQ", werk));
			}
			if (werk && !(werk === "")) {
				filter.push(new Filter("Lgort", "EQ", lgort));
			}
			// create a filter for the binding
			this._valueHelpDialogLgnum.getBinding("items").filter(filter);
			// open value help dialog filtered by the input value
			this._valueHelpDialogLgnum.open(sInputValue);
			// open value help dialog filtered by the input value
			this._valueHelpDialogLgnum.open(sInputValue);
		},
		handleSuggest: function(oEvent) {},
		_handleValueHelpSearch: function(evt) {
			var sValue = evt.getParameter("value");
			var oFilter = new Filter("Werks", sap.ui.model.FilterOperator.Contains, "'" + sValue + "'");
			evt.getSource().getBinding("items").filter([oFilter]);
		},
		_handleValueHelpSearchLgort: function(evt) {
			var sValue = evt.getParameter("value");
			var oFilter = new Filter("Lgort", sap.ui.model.FilterOperator.Contains, "'" + sValue + "'");
			evt.getSource().getBinding("items").filter([oFilter]);
		},
		_handleValueHelpSearchLgnum: function(evt) {
			var sValue = evt.getParameter("value");
			var oFilter = new Filter("Lgnum", sap.ui.model.FilterOperator.Contains, "'" + sValue + "'");
			evt.getSource().getBinding("items").filter([oFilter]);
		},
		_handleValueHelpClose: function(evt) {
			var oSelectedItem = evt.getParameter("selectedItem");
			if (oSelectedItem) {
				this.getView().getModel("mainView").setProperty("/werk", oSelectedItem.getTitle());
			}
			evt.getSource().getBinding("items").filter([]);
		},
		_handleValueHelpCloseLgort: function(evt) {
			var oSelectedItem = evt.getParameter("selectedItem");
			if (oSelectedItem) {
				this.getView().getModel("mainView").setProperty("/lgort", oSelectedItem.getTitle());
			}
			evt.getSource().getBinding("items").filter([]);
		},
		_handleValueHelpCloseLgnum: function(evt) {
			var oSelectedItem = evt.getParameter("selectedItem");
			if (oSelectedItem) {
				this.getView().getModel("mainView").setProperty("/lgnum", oSelectedItem.getTitle());
			}
			evt.getSource().getBinding("items").filter([]);
		},
		onListPress: function(oEvent) {
			var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
			var oItem = oEvent.getSource();
						/*
			oRouter.navTo("detailTA",{ 
				contextPath: oItem.getBindingContext().getPath().substr(1)
			}
						*/
			oRouter.navTo("detailTA",{ 
		    mandt: oItem.getBindingContext().getProperty("Mandt"),
		    lgnum: oItem.getBindingContext().getProperty("Lgnum"),
			tanum: oItem.getBindingContext().getProperty("Tanum"),
			tapos: oItem.getBindingContext().getProperty("Tapos")
			}

			);
		},
		confirmTO: function() {
			// ask for confirmations
			var items = this.getView().byId("taTable").getSelectedItems();
			var txt = this.getView().getModel("i18n").getResourceBundle().getText("TAConfirm", [items.length]);
			MessageBox.confirm(txt, {
				onClose: function(oAction) {
					if (oAction === MessageBox.Action.OK) {
						for (var i = 0; i < items.length; i++) {
							this.getView().getModel().remove(items[i].getBindingContext().sPath, {
								success: function(odata, response) {
									MessageToast.show("{i18n>TAQuitSuccess}", {
										width: "100%",
										my: "begin top",
										at: "begin top"
									});
								},
								error: function(oError) {
									var response = JSON.parse(oError.responseText);
									var errorObjects = response.error.innererror.errordetails;
									var message = "";
									for (var key in errorObjects) {
										var entry = errorObjects[key];
										message = message + entry.severity + ": " + entry.message + "\n\n";
									}
									MessageBox.error(response.error.message.value + "\n\n\n" + message);
								},
								async: false
							});
						}
						this.getView().getModel().refresh();
					}
				}.bind(this)
			});
		},
		/**
		 *@memberOf STC.controller.MainView
		 */
		action: function(oEvent) {
			var that = this;
			var actionParameters = JSON.parse(oEvent.getSource().data("wiring").replace(/'/g, "\""));
			var eventType = oEvent.getId();
			var aTargets = actionParameters[eventType].targets || [];
			aTargets.forEach(function(oTarget) {
				var oControl = that.byId(oTarget.id);
				if (oControl) {
					var oParams = {};
					for (var prop in oTarget.parameters) {
						oParams[prop] = oEvent.getParameter(oTarget.parameters[prop]);
					}
					oControl[oTarget.action](oParams);
				}
			});
			var oNavigation = actionParameters[eventType].navigation;
			if (oNavigation) {
				var oParams = {};
				(oNavigation.keys || []).forEach(function(prop) {
					oParams[prop.name] = encodeURIComponent(JSON.stringify({
						value: oEvent.getSource().getBindingContext(oNavigation.model).getProperty(prop.name),
						type: prop.type
					}));
				});
				if (Object.getOwnPropertyNames(oParams).length !== 0) {
					this.getOwnerComponent().getRouter().navTo(oNavigation.routeName, oParams);
				} else {
					this.getOwnerComponent().getRouter().navTo(oNavigation.routeName);
				}
			}
		}
	});
	return PageController;
});