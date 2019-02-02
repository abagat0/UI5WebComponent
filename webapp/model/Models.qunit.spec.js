define(["require", "exports", "ui5/testApp/model/models", "sap/ui/thirdparty/sinon", "sap/ui/thirdparty/sinon-qunit"], function (require, exports, models_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    // @ts-ignore
    QUnit.module("createDeviceModel", {
        afterEach: function () {
            this.oDeviceModel.destroy();
        }
    });
    console.log(models_1.default);
    // @ts-ignore
    function isPhoneTestCase(assert, bIsPhone) {
        // Arrange
        // @ts-ignore
        this.stub(sap.ui.Device, "system", { phone: bIsPhone });
        // System under test
        // @ts-ignore
        this.oDeviceModel = models_1.default.createDeviceModel();
        // Assert
        // @ts-ignore
        assert.strictEqual(this.oDeviceModel.getData().system.phone, bIsPhone, "IsPhone property is correct");
    }
    // @ts-ignore
    QUnit.test("Should initialize a device model for desktop", function (assert) {
        // @ts-ignore
        isPhoneTestCase.call(this, assert, false);
    });
    // @ts-ignore
    QUnit.test("Should initialize a device model for phone", function (assert) {
        // @ts-ignore
        isPhoneTestCase.call(this, assert, true);
    });
    // @ts-ignore
    function isTouchTestCase(assert, bIsTouch) {
        // Arrange
        // @ts-ignore
        this.stub(sap.ui.Device, "support", { touch: bIsTouch });
        // System under test
        // @ts-ignore
        this.oDeviceModel = models_1.default.createDeviceModel();
        // Assert
        // @ts-ignore
        assert.strictEqual(this.oDeviceModel.getData().support.touch, bIsTouch, "IsTouch property is correct");
    }
    // @ts-ignore
    QUnit.test("Should initialize a device model for non touch devices", function (assert) {
        // @ts-ignore
        isTouchTestCase.call(this, assert, false);
    });
    // @ts-ignore
    QUnit.test("Should initialize a device model for touch devices", function (assert) {
        // @ts-ignore
        isTouchTestCase.call(this, assert, true);
    });
    // @ts-ignore
    QUnit.test("The binding mode of the device model should be one way", function (assert) {
        // System under test
        // @ts-ignore
        this.oDeviceModel = models_1.default.createDeviceModel();
        // Assert
        // @ts-ignore
        assert.strictEqual(this.oDeviceModel.getDefaultBindingMode(), "OneWay", "Binding mode is correct");
    });
});
//# sourceMappingURL=Models.qunit.spec.js.map