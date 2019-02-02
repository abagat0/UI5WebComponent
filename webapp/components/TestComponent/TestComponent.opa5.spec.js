define(["require", "exports", "sap/ui/test/opaQunit"], function (require, exports, opaQunit_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    // @ts-ignore
    QUnit.module("Test Component");
    // @ts-ignore
    opaQunit_1.default("Should see view with Test Component", function (Given, When, Then) {
        // Arrangements
        Given.iStartTheApp();
        //Actions
        When.onTheMasterPage.iLookAtTheScreen();
        // Assertions
        Then.onTheMasterPage.iShouldSeeTheList();
    });
    // @ts-ignore
    opaQunit_1.default("Should click button", function (Given, When, Then) {
        //Actions
        When.onTheMasterPage.iLookAtTheScreen();
        // Assertions
        Then.onTheMasterPage.iShouldClickButton().and.iTeardownMyAppFrame();
    });
});
//# sourceMappingURL=TestComponent.opa5.spec.js.map