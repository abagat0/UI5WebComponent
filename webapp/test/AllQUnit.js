define(["require", "exports", "./Helper"], function (require, exports, Helper_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    /*import * as Models from "ui5/testApp/model/Models.qunit.spec"
    console.log(Models)*/
    QUnit.config.autostart = false;
    Helper_1.default.getRequest('/qunit')
        .then(function (response) {
        var fileList = JSON.parse(response);
        console.log(fileList);
        sap.ui.require(fileList, function () {
            QUnit.start();
        });
    });
});
//# sourceMappingURL=AllQUnit.js.map