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
define(["require", "exports", "./BaseController", "sap/ui/model/json/JSONModel"], function (require, exports, BaseController_1, JSONModel_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var MainController = /** @class */ (function (_super) {
        __extends(MainController, _super);
        function MainController() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        MainController.prototype.onInit = function () {
            var oViewModel;
            oViewModel = new JSONModel_1.default({
                busy: true,
                delay: 0,
                test: "kkk"
            }, false);
            this.setModel(oViewModel, "appView");
        };
        MainController.prototype.standardPress = function (oEvent) {
            var oModel = this.getModel("appView");
            oModel.setProperty("/test", "changed");
        };
        MainController = __decorate([
            UI5("ui5.testApp.controller.Main")
        ], MainController);
        return MainController;
    }(BaseController_1.default));
    exports.default = MainController;
});
//# sourceMappingURL=Main.controller.js.map