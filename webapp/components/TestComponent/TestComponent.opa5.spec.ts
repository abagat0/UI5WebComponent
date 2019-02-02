// @ts-ignore
import OpaTest from "sap/ui/test/opaQunit";
import Opa5 from "sap/ui/test/Opa5";

// @ts-ignore
QUnit.module("Test Component");
// @ts-ignore
OpaTest("Should see view with Test Component", (Given, When, Then) => {

    // Arrangements
    Given.iStartTheApp();


    //Actions
    When.onTheMasterPage.iLookAtTheScreen();

    // Assertions
    Then.onTheMasterPage.iShouldSeeTheList();
});
// @ts-ignore
OpaTest("Should click button", (Given, When, Then) => {

    //Actions
    When.onTheMasterPage.iLookAtTheScreen();

    // Assertions
    Then.onTheMasterPage.iShouldClickButton().and.iTeardownMyAppFrame();
})
