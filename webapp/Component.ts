import UIComponent  from "sap/ui/core/UIComponent";
import models       from "ui5/testApp/model/models";

@UI5("ui5.testApp.Component")
export default class Component extends UIComponent
{
    public static metadata: any = {
        manifest : "json"
    };

    public init(): void {
        // set the device model
        this.setModel(models.createDeviceModel(), "device");
        // call the base component's init function and create the App view
        super.init();
        // create the views based on the url/hash
        this.getRouter().initialize();
    }
}