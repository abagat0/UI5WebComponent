define(["require", "exports", "sap/ui/model/json/JSONModel", "sap/ui/Device"], function (require, exports, JSONModel_1, Device_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = {
        createDeviceModel: function () {
            //TODO|ui5ts: generate constructors
            var oModel = new JSONModel_1.default(Device_1.default);
            oModel.setDefaultBindingMode(sap.ui.model.BindingMode.OneWay);
            return oModel;
        }
    };
});
//# sourceMappingURL=models.js.map