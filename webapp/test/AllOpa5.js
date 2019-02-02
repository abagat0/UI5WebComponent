define(["require", "exports", "ui5/testApp/test/Common", "sap/ui/test/Opa5", "./Helper"], function (require, exports, Common_1, Opa5_1, Helper_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    QUnit.config.autostart = false;
    Helper_1.default.getRequest('/opa5')
        .then(function (response) {
        var fileList = JSON.parse(response);
        Opa5_1.default.extendConfig({
            arrangements: new Common_1.default(),
            viewNamespace: "ui5.testApp.view."
        });
        console.log(fileList);
        sap.ui.require(fileList.view, function () {
            sap.ui.require(fileList.test, function () {
                QUnit.start();
            });
        });
    });
});
//# sourceMappingURL=AllJourneys.js.map