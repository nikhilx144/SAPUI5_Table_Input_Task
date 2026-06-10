sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/core/Fragment"
], (Controller, Fragment) => {
    "use strict";

    return Controller.extend("input.in.table.tasks.ui5.ui5inputintablerowtask.controller.StudentTable", {
        onInit() {
            this.oView = this.getView();
            this.oModel = this.getOwnerComponent().getModel("stuDetails");
            this._router = sap.ui.core.UIComponent.getRouterFor(this);
            this._router.getRoute("RouteStudentTable").attachPatternMatched(this.onObjectRouteMatched, this);
        },

        onObjectRouteMatched(event) {
            const eventArgs = event.getParameter("arguments");
            const stuId = event.getParameter("arguments").stuId;
            console.log(eventArgs);
            console.log(stuId);
            const allStudents = this.oModel.getProperty("/Table");
            console.log(allStudents);
            let matchedStudent;
            allStudents.forEach(stu => {
                if (stu.stuId === Number(stuId)) matchedStudent = stu;
            }); 
            this.oModel.setProperty("/selectedStudentData", matchedStudent);
            this.oModel.setProperty("/editable", false);
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
            // const router = sap.ui.core.UIComponent.getRouterFor(this);
            this.oView.byId('cancelButton').setVisible(false);
            this.oView.byId('saveButton').setVisible(false);
            this.oModel.setProperty("/editable", false);
            this._router.navTo("RouteStudentTable");
        },

        onSave() {
            // const router = sap.ui.core.UIComponent.getRouterFor(this);
            this.oModel.setProperty("/editable", false);
            const updatedStuData = this.oModel.getProperty("/selectedStudentData");
            console.log(updatedStuData);
            const updatedStuId = updatedStuData.stuId;
            const allStudents = this.oModel.getProperty("/Table");
            allStudents.forEach(student => { 
                if (student.stuId === updatedStuId) {
                    Object.assign(student, updatedStuData);
                } 
            });
            this.oModel.setProperty('/Table', allStudents);
            this.oView.byId('saveButton').setVisible(false);
            this.oView.byId('cancelButton').setVisible(false);
            this._router.navTo("RouteStudentTable");
        },

        // onSubmit() {
        //     const router = sap.ui.core.UIComponent.getRouterFor(this);
        //     const newStuData = this.oView.getModel('stuDetails').getProperty("/selectedStudentData");
        //     const allStudents = this.oView.getModel('stuDetails').getProperty("/Table");
        //     allStudents.forEach(student => {
        //         if (student.stuId === newStuData.stuId) {
        //             alert("Student with same ID already exists. Please change the ID and try again.");
        //             return;
        //         } 
        //     });
        //     allStudents.push(newStuData);
        //     this.oView.getModel('stuDetails').setProperty("/Table", allStudents);
        //     this.oView.byId('submitButton').setVisible(false);

        //     console.log(this.oView.getModel('stuDetails').getData());

        //     router.navTo("RouteHome");
        // },
    });
});