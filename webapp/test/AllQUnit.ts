import Helper from "./Helper";

QUnit.config.autostart = false;

Helper.getRequest('/qunit')
    .then(response => {
        const fileList: Array<string> = JSON.parse(response);
        sap.ui.require(fileList, () => {
            QUnit.start();
        })
    })
