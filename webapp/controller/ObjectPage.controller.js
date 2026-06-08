sap.ui.define([
    "sap/ui/core/mvc/Controller",
], (Controller) => {
    "use strict";

    return Controller.extend("input.in.table.tasks.ui5.ui5inputintablerowtask.controller.StudentTable", {
        onInit() {
            this.oView = this.getView();
            this.oModel = this.getOwnerComponent().getModel("stuDetails");
            this._router = sap.ui.core.UIComponent.getRouterFor(this);
            this._router.getRoute("RouteStudentTable").attachPatternMatched(this.onObjectRouteMatched, this);
        },

        onObjectRouteMatched(event) {
            const stuId = event.getParameter("arguments").selectedUserID1;
            const allStudents = this.oModel.getProperty("/Table");
            let matchedStudent;
            allStudents.forEach(stu => {
                if (stu.stuId === Number(stuId)) matchedStudent = stu;
            }); 
            this.oModel.setProperty("/selectedObjectData", matchedStudent);
            this.oModel.setProperty("/editable", false);
            this.oView.byId("submitButton").setVisible(false);
            this.oView.byId("editButton").setVisible(true);
        },

        onBack() {
            this._router.navTo("RouteStudentTable");
            this.oModel.setProperty("/editable", false);
            this.oView.byId('saveButton').setVisible(false);
        },

        onEdit() {
            this.oModel.setProperty("/editable", true);
            this.oView.byId("saveButton").setVisible(true);
            this.oView.byId("cancelButton").setVisible(true);
        },
        
        onCancel() {
            const router = sap.ui.core.UIComponent.getRouterFor(this);
            this.oView.byId('cancelButton').setVisible(false);
            this.oView.byId('saveButton').setVisible(false);
            this.oModel.setProperty("/editable", false);
            router.navTo("RouteHome");
        },

        onSave() {
            const router = sap.ui.core.UIComponent.getRouterFor(this);
            this.oModel.setProperty("/editable", false);
            const updatedStuData = this.oModel.getProperty("/selectedObjectData");
            const updatedStuId = updatedStuData.stuId;
            const allStudents = this.oModel.getProperty("/Table");
            allStudents.forEach(student => { 
                if (student.stuId === updatedStuId) {
                    Object.assign(student, updatedStuData);
                } 
            });
            this.oView.byId('saveButton').setVisible(false);
            router.navTo("RouteHome");
        },

        onSubmit() {
            const router = sap.ui.core.UIComponent.getRouterFor(this);
            const newStuData = this.oView.getModel('stuDetails').getProperty("/selectedObjectData");
            const allStudents = this.oView.getModel('stuDetails').getProperty("/Table");
            allStudents.forEach(student => {
                if (student.stuId === newStuData.stuId) {
                    alert("Student with same ID already exists. Please change the ID and try again.");
                    return;
                } 
            });
            allStudents.push(newStuData);
            this.oView.getModel('stuDetails').setProperty("/Table", allStudents);
            this.oView.byId('submitButton').setVisible(false);

            console.log(this.oView.getModel('stuDetails').getData());

            router.navTo("RouteHome");
        },

        onNavBack() {
            this.getOwnerComponent().getRouter().navTo("RouteStudentTable");
        },
    });
});