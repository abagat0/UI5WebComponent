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
define(["require", "exports", "sap/ui/core/Control"], function (require, exports, Control_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var Slot = /** @class */ (function (_super) {
        __extends(Slot, _super);
        function Slot() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        Slot.prototype.getName = function () {
            return this.getProperty("name");
        };
        Slot.metadata = {
            properties: {
                name: { type: "string", defaultValue: null },
            }
        };
        Slot = __decorate([
            UI5("ui5.testApp.components.control.Slot")
        ], Slot);
        return Slot;
    }(Control_1.default));
    exports.default = Slot;
});
//# sourceMappingURL=Slot.js.map