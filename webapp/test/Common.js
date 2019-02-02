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
define(["require", "exports", "sap/ui/test/Opa5"], function (require, exports, Opa5_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var Common = /** @class */ (function (_super) {
        __extends(Common, _super);
        function Common() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        Common.prototype.getFrameUrl = function (sUrlParameters) {
            var sUrl = "http://localhost:3000/test/mockServer.html";
            sUrlParameters = sUrlParameters ? "?" + sUrlParameters : "";
            return sUrl + sUrlParameters;
        };
        Common.prototype.iStartTheApp = function () {
            // Start the app with a minimal delay to make tests run fast but still async to discover basic timing issues
            this.iStartMyAppInAFrame(this.getFrameUrl("serverDelay=50"));
        };
        Common.prototype.iStartTheAppWithDelay = function (sHash, iDelay) {
            this.iStartMyAppInAFrame(this.getFrameUrl("serverDelay=" + iDelay));
        };
        Common.prototype.iLookAtTheScreen = function () {
            return this;
        };
        Common.prototype.getMockServer = function () {
            return new Promise(function (success) {
                // @ts-ignore
                Opa5_1.default.getWindow().sap.ui.require(["ui5/testApp/localService/mockserver"], function (mockserver) {
                    success(mockserver.getMockServer());
                });
            });
        };
        Common = __decorate([
            UI5("ui5.testApp.test.Commpn")
        ], Common);
        return Common;
    }(Opa5_1.default));
    exports.default = Common;
});
//# sourceMappingURL=Common.js.map