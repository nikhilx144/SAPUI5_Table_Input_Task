sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/core/Fragment",
    "sap/ui/table/Column",
    "sap/m/Label",
    "sap/m/Text"
], (Controller, Fragment, UIColumn, Label, Text) => {
    "use strict";

    return Controller.extend("input.in.table.tasks.ui5.ui5inputintablerowtask.controller.StudentTable", {
        onInit() {
            // assign the model and view to the 'this' of controller for DRY code
            this.oModel = this.getOwnerComponent().getModel("stuDetails");
            this.oView = this.getView();
            // keep track of the number of addRow button clicks
            this.addRowCounter = 0;
            // keep track of the index of the last entry before adding a new row
            this.lastEntryIndex = -1;
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
                editableRow: true
            });
            stuData.push(this.oModel.getProperty("/newEntry"));
            this.oModel.setProperty("/Table", stuData);
            // console.log(this.oModel);
            // console.log(this.getView().getModel("stuDetails"));
        },

        // on click of submit button, set editableRow prop of newEntry in the model to false
        // update the last entry of Table prop in the model with newEntry
        // make submit and cancel button invisible again
        onSubmit() {
            // const newEntry = this.oModel.getProperty("/newEntry");
            // newEntry.editableRow = false;
            // const tableData = this.oModel.getProperty("/Table");
            // tableData[tableData.length - 1] = newEntry;
            // this.oModel.setProperty("/Table", tableData);
            this.oModel.getProperty("/Table");
            for (let index = this.lastEntryIndex + 1; index < this.oModel.getProperty("/Table").length; index++) {
                this.oModel.setProperty(`/Table/${index}/editableRow`, false);
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

        onSelectDialogForClgCodeRequested() {
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

        // get the selected college code and update the value of the input field for which the value help dialog is opened with the selected college code
        // show only the department codes in the value help dialog for department code which are relevant to the selected college code in the value help dialog for college code
        onSelectDialogForClgCodeConfirm(event) {
            // maybe store the selectedClgCode in this so that it can be used in the onSelectDialogForDeptCodeConfirm method to filter the department codes based on the selected college code
            this.selectedClgCode = event.getParameter("selectedItems")[0].getTitle();
        },

        onSelectDialogForDeptCodeRequested() {
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
                
            this._oSelectDialogForDeptCode.then((oDialog) => {
                oDialog.open();
            });
        },

        // get the selected department code and name from the event parameter and set the input field for which the value help dialog is opened with the selected department code
        // and also set the text of the text tag for dept name with the corresponding department name of the selected dept code
        onSelectDialogForDeptCodeConfirm(event) {
            const selectedDeptCode = event.getParameter("selectedItems")[0].getTitle();
            const selectedDeptName = event.getParameter("selectedItems")[0].getDescription();
        }
    });
});