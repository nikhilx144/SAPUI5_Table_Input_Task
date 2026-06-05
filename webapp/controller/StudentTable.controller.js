sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/core/Fragment"
], (Controller, Fragment) => {
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
            // console.log(this.oModel);
            // console.log(this.getView().getModel("stuDetails"));
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

        onValueHelpRequested() {
            const view = this.getView();
            if (!this._oVHD) {
                this._oVHD = Fragment.load({
                    name: "input.in.table.tasks.ui5.ui5inputintablerowtask.view.fragments.ValueHelpDialog",
                    controller: this
                }).
                then(function (oDialog) {
                    // this.oView.addDependent(oDialog);
                    this.oView.addDependent(oDialog);
                    return oDialog;
                });
            }

            this._oVHD.then(function (oDialog) {
                oDialog.open();
            });
        },

        onValueHelpDialogOk(event) {
            const oSelectedItem = event.getParameter("selectedItems")[0];
            if (oSelectedItem) {
                const oInput = this.oView.byId("clgCodeInput");
                oInput.setValue(oSelectedItem.getTitle());
            }
        },

        onValueHelpDialogCancel() {
            console.log(this._oVHD);
            this._oVHD.close();
        },

        // onValueHelpDialogAfterClose() {
        //     this._oVHD.destroy();
        // }
    });
});