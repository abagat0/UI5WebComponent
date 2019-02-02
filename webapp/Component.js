var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
define(["require", "exports", "sap/ui/core/UIComponent", "ui5/testApp/model/models", "sap/ui/Device", "ui5/testApp/controller/ErrorHandler"], function (require, exports, UIComponent_1, models_1, Device_1, ErrorHandler_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var Component = /** @class */ (function (_super) {
        __extends(Component, _super);
        function Component() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        Component.prototype.init = function () {
            this._oErrorHandler = new ErrorHandler_1.default(this);
            // set the device model
            this.setModel(models_1.default.createDeviceModel(), "device");
            // call the base component's init function and create the App view
            _super.prototype.init.call(this);
            // create the views based on the url/hash
            this.getRouter().initialize();
        };
        Component.prototype.getContentDensityClass = function () {
            if (this._sContentDensityClass === undefined) {
                // check whether FLP has already set the content density class; do nothing in this case
                if (jQuery(document.body).hasClass("sapUiSizeCozy") || jQuery(document.body).hasClass("sapUiSizeCompact")) {
                    this._sContentDensityClass = "";
                }
                else if (!Device_1.default.support.touch) { // apply "compact" mode if touch is not supported
                    this._sContentDensityClass = "sapUiSizeCompact";
                }
                else {
                    // "cozy" in case of touch support; default for most sap.m controls, but needed for desktop-first controls like sap.ui.table.Table
                    this._sContentDensityClass = "sapUiSizeCozy";
                }
            }
            return this._sContentDensityClass;
        };
        Component.prototype.destroy = function (bSuppressInvalidate) {
            this._oErrorHandler.destroy();
            // call the base component's destroy function
            _super.prototype.destroy.call(this, bSuppressInvalidate);
        };
        Component.prototype.getModel = function (sName) {
            return _super.prototype.getModel.call(this, sName);
        };
        Component.metadata = {
            manifest: "json"
        };
        Component = __decorate([
            UI5("ui5.testApp.Component")
        ], Component);
        return Component;
    }(UIComponent_1.default));
    exports.default = Component;
});
//# sourceMappingURL=Component.js.map