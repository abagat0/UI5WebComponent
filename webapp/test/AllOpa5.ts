import Common from "ui5/testApp/test/Common";
import Opa5 from "sap/ui/test/Opa5";
import Opa5Files from "../types/Opa5Files";
import Helper from "./Helper";


QUnit.config.autostart = false;


Helper.getRequest('/opa5')
    .then(response => {
        const fileList: Opa5Files = JSON.parse(response);
        Opa5.extendConfig({
            arrangements: new Common(),
            viewNamespace: "ui5.testApp.view."
        });
        sap.ui.require(fileList.view, () => {
            sap.ui.require(fileList.test, () => {
                QUnit.start();
            })
        })
    })
