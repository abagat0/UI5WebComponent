define(["require", "exports", "sap/ui/test/Opa5", "ui5/testApp/test/Common"], function (require, exports, Opa5_1, Common_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var sViewName = "Main", sSomethingThatCannotBeFound = "*#-Q@@||", iGroupingBoundary = 100;
    Opa5_1.default.createPageObjects({
        onTheMasterPage: {
            baseClass: Common_1.default,
            actions: {},
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
                            Opa5_1.default.assert.ok(oContent, "Found the object List");
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
                            Opa5_1.default.assert.ok(aTable[0].getItems(), "Found the Table");
                        },
                        errorMessage: "Can't see component Table."
                    });
                }
            }
        }
    });
});
//# sourceMappingURL=Main.opa5.spec.js.map