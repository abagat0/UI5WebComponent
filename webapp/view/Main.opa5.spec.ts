import Opa5 from "sap/ui/test/Opa5";
import Common from "ui5/testApp/test/Common";

var sViewName = "Main",
    sSomethingThatCannotBeFound = "*#-Q@@||",
    iGroupingBoundary = 100;

Opa5.createPageObjects({
    onTheMasterPage: {
        baseClass: Common,

        actions: {

        },

        assertions: {
            // @ts-ignore
            iShouldSeeTheList: function () {
                // @ts-ignore
                return this.waitFor({
                    id: "standardButton",
                    // @ts-ignore
                    viewName: sViewName,
                    // @ts-ignore
                    success: function (oContent) {
                        // @ts-ignore
                        Opa5.assert.ok(oContent, "Found the object List");
                    },
                    errorMessage: "Can't see the master list."
                });
            },

            // @ts-ignore
            iShouldClickButton: function () {
                // @ts-ignore
                return this.waitFor({
                    controlType: "sap.m.Table",
                    // @ts-ignore
                    success: function (aTable) {
                        // @ts-ignore
                        Opa5.assert.ok(aTable[0].getItems(), "Found the Table");
                    },
                    errorMessage: "Can't see component Table."
                });
            }

        }

    }

});