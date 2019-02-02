import UIComponent  from "sap/ui/core/UIComponent";
import models       from "ui5/testApp/model/models";
import Device       from "sap/ui/Device";
import ErrorHandler from "ui5/testApp/controller/ErrorHandler";

@UI5("ui5.testApp.Component")
export default class Component extends UIComponent
{
    public static metadata: any = {
        manifest : "json"
    };

    private _sContentDensityClass: string;
    private _oErrorHandler: ErrorHandler;

    public init(): void {
        this._oErrorHandler = new ErrorHandler(this);
        // set the device model
        this.setModel(models.createDeviceModel(), "device");

        // call the base component's init function and create the App view
        super.init();
        // create the views based on the url/hash
        this.getRouter().initialize();
    }

    public getContentDensityClass(): string {
        if (this._sContentDensityClass === undefined) {
            // check whether FLP has already set the content density class; do nothing in this case
            if (jQuery(document.body).hasClass("sapUiSizeCozy") || jQuery(document.body).hasClass("sapUiSizeCompact")) {
                this._sContentDensityClass = "";
            } else if (!Device.support.touch) { // apply "compact" mode if touch is not supported
                this._sContentDensityClass = "sapUiSizeCompact";
            } else {
                // "cozy" in case of touch support; default for most sap.m controls, but needed for desktop-first controls like sap.ui.table.Table
                this._sContentDensityClass = "sapUiSizeCozy";
            }
        }
        return this._sContentDensityClass;
    }
    public destroy(bSuppressInvalidate: boolean): void {
        this._oErrorHandler.destroy();

        // call the base component's destroy function
        super.destroy(bSuppressInvalidate);
    }

    public getModel<T extends sap.ui.model.Model>(sName?: string): T {
    return <T>super.getModel(sName);
}

}