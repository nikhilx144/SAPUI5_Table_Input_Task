sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/core/Fragment",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator"
], (Controller, Fragment, Filter, FilterOperator) => {
    "use strict";

    return Controller.extend("input.in.table.tasks.ui5.ui5inputintablerowtask.controller.StudentTable", {
        onInit() {
            // add the stricky header fragment to the top of the view
            Fragment.load({
                name: "input.in.table.tasks.ui5.ui5inputintablerowtask.view.fragments.StickyHeader",
                controller: this
            }).then((oFragment) => {
                this.oView.addDependent(oFragment);
                // add the fragment as the header of this view's page tag
                this.oView.byId("page").setHeaderContent(oFragment);
            });

            // assign the model and view to the 'this' of controller for DRY code
            this.oModel = this.getOwnerComponent().getModel("stuDetails");
            this.oView = this.getView();
            // keep track of the number of addRow button clicks
            this.addRowCounter = 0;
            // keep track of the index of the last entry before adding a new row
            this.lastEntryIndex = -1;
            // keep track of the record serial number
            this.entryNumberStartValue = this.oModel.getProperty("/Table").length;
        },

        // on click of add row button, set newEntry prop with empty values and editableRow as true
        // push the newEntry to the Table prop in model and make the submit and cancel button visible
        onAddRow() {
            const stuData = this.oModel.getProperty("/Table");
            if (this.addRowCounter === 0) this.lastEntryIndex = stuData.length - 1;
            this.addRowCounter++;
            this.oView.byId("submitBtn").setVisible(true);
            this.oView.byId("cancelBtn").setVisible(true);
            this.oModel.setProperty("/newEntry", {
                stuId: "",
                clgCode: "",
                deptCode: "",
                deptName: "",
                editableRow: true,
                entryNumber: this.entryNumberStartValue + this.addRowCounter,
                deptEditable: false
            });
            stuData.push(this.oModel.getProperty("/newEntry"));
            this.oModel.setProperty("/Table", stuData);
        },

        // on click of submit button, set editableRow prop of newEntry in the model to false
        // update the last entry of Table prop in the model with newEntry
        // make submit and cancel button invisible again
        onSubmit() {
            const tableData = this.oModel.getProperty("/Table");
            for (let index = this.lastEntryIndex + 1; index < tableData.length; index++) {
                const entry = tableData[index];
                if (!entry.stuId || !entry.clgCode || !entry.deptCode || !entry.deptName) {
                    alert("Please fill all the fields before submitting the data.");
                    return;
                }
            }
            this.oModel.getProperty("/Table");
            for (let index = this.lastEntryIndex + 1; index < this.oModel.getProperty("/Table").length; index++) {
                this.oModel.setProperty(`/Table/${index}/editableRow`, false);
                this.oModel.setProperty(`/Table/${index}/entryNumber`, index + 1);
            }
            this.oView.byId("submitBtn").setVisible(false);
            this.oView.byId("cancelBtn").setVisible(false);
            console.log(this.oModel);
            this.addRowCounter = 0;
            this.lastEntryIndex = -1;
        },
        
        // on click of cancel button, remove the last entry from the Table prop in the model
        // make submit and cancel button invisible again
        onCancel() {
            const tableData = this.oModel.getProperty("/Table");
            let i = new Number(this.addRowCounter);
            while (i > 0) {
                tableData.pop();
                i--;
            }
            this.oModel.setProperty("/Table", tableData);
            this.oView.byId("submitBtn").setVisible(false);
            this.oView.byId("cancelBtn").setVisible(false);
            console.log(this.oModel);
            this.addRowCounter = 0;
            this.lastEntryIndex = -1;
        },

        onRowPress(event) {
            const selectedStuId = event.getSource().getBindingContext("stuDetails").getProperty("stuId");
            this.getOwnerComponent().getRouter().navTo("RouteObjectPage", {
                stuId: selectedStuId
            });
        },

        // only unique college codes should be shown in the value help dialog for college code, so filter the items based on the unique values of college codes in the model
        onSelectDialogForClgCodeRequested(event) {
            this.entryNumberForClgCode = event.getSource().getBindingContext("stuDetails").getProperty("entryNumber");
            console.log(this.entryNumberForClgCode);
            if (!this._oSelectDialogForClgCode) {
                this._oSelectDialogForClgCode = Fragment.load({
                    name: "input.in.table.tasks.ui5.ui5inputintablerowtask.view.fragments.SelectDialogForClgCode",
                    controller: this
                }).then((oDialog) => {
                    this.oView.addDependent(oDialog);
                    oDialog.setModel(this.oModel);
                    return oDialog;
                });
            }
                
            this._oSelectDialogForClgCode.then((oDialog) => {
                oDialog.open();
            });
        },

        onSelectDialogForClgCodeConfirm(event) {
            // maybe store the selectedClgCode in this so that it can be used in the onSelectDialogForDeptCodeConfirm method to filter the department codes based on the selected college code
            this.selectedClgCode = event.getParameter("selectedItems")[0].getTitle();
            this.oModel.setProperty(`/Table/${this.entryNumberForClgCode - 1}/clgCode`, this.selectedClgCode);
            this.oModel.setProperty(`/Table/${this.entryNumberForClgCode - 1}/deptEditable`, true);
            this.entryNumberForClgCode = null;
        },

        onSelectDialogForClgCodeCancel() {
            this.selectedClgCode = null;
            this.entryNumberForClgCode = null;
            this.oModel.setProperty(`/Table/${this.entryNumberForClgCode - 1}/clgCode`, "");
            this.oModel.setProperty(`/Table/${this.entryNumberForClgCode - 1}/deptEditable`, false);
        },

        onSelectDialogForDeptCodeRequested(event) {
            this.entryNumberForClgCode = event.getSource().getBindingContext("stuDetails").getProperty("entryNumber");
            if (!this._oSelectDialogForDeptCode) {
                this._oSelectDialogForDeptCode = Fragment.load({
                    name: "input.in.table.tasks.ui5.ui5inputintablerowtask.view.fragments.SelectDialogForDeptCode",
                    controller: this
                }).then((oDialog) => {
                    this.oView.addDependent(oDialog);
                    oDialog.setModel(this.oModel);
                    return oDialog;
                });
            }
            
            // filter the items in the value help dialog for department code based on the selected college code in the value help dialog for college code
            this._oSelectDialogForDeptCode.then((oDialog) => {
                const oBinding = oDialog.getBinding("items");
                if (this.selectedClgCode) {
                    oBinding.filter(new Filter("deptCode", FilterOperator.Contains, this.selectedClgCode));
                } else {
                    oBinding.filter([]);
                }
            });

            this._oSelectDialogForDeptCode.then((oDialog) => {
                oDialog.open();
            });
        },

        onSelectDialogForDeptCodeConfirm(event) {
            const selectedDeptCode = event.getParameter("selectedItems")[0].getTitle();
            const selectedDeptName = event.getParameter("selectedItems")[0].getDescription();
            this.oModel.setProperty(`/Table/${this.entryNumberForClgCode - 1}/deptCode`, selectedDeptCode);
            this.oModel.setProperty(`/Table/${this.entryNumberForClgCode - 1}/deptName`, selectedDeptName);
            this.oModel.setProperty(`/Table/${this.entryNumberForClgCode - 1}/deptEditable`, false);
        },

        onSelectDialogForDeptCodeCancel() {
            this.oModel.setProperty(`/Table/${this.entryNumberForClgCode - 1}/deptCode`, "");
            this.oModel.setProperty(`/Table/${this.entryNumberForClgCode - 1}/deptName`, "");
            if (!this.oModel.getProperty(`/Table/${this.entryNumberForClgCode - 1}/clgCode`)) {
                this.oModel.setProperty(`/Table/${this.entryNumberForClgCode - 1}/deptEditable`, false);
            }
        }
    });
});