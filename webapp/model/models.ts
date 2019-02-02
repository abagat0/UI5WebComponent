import JSONModel    from "sap/ui/model/json/JSONModel";
import Device       from "sap/ui/Device";

export default {
    createDeviceModel: function ():JSONModel {
        //TODO|ui5ts: generate constructors
        let oModel:JSONModel = new JSONModel(Device, false);
        oModel.setDefaultBindingMode(sap.ui.model.BindingMode.OneWay);
        return oModel;
    }
};
