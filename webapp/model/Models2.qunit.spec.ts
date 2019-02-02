import models from "ui5/testApp/model/models";
import "sap/ui/thirdparty/sinon";
import "sap/ui/thirdparty/sinon-qunit";

// @ts-ignore
QUnit.module("models2", {
    afterEach : function () {
        this.oDeviceModel.destroy();
    }
});

// @ts-ignore
function isPhoneTestCase(assert, bIsPhone:boolean) {

    // Arrange
    // @ts-ignore
     this.stub(sap.ui.Device, "system", { phone : bIsPhone });

    // System under test
    // @ts-ignore
    this.oDeviceModel = models.createDeviceModel();

    // Assert
    // @ts-ignore
    assert.strictEqual( this.oDeviceModel.getData().system.phone, bIsPhone, "IsPhone property is correct");
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
function isTouchTestCase(assert, bIsTouch:boolean) {
    // Arrange
    // @ts-ignore
    this.stub(sap.ui.Device, "support", { touch : bIsTouch });

    // System under test
    // @ts-ignore
    this.oDeviceModel = models.createDeviceModel();

    // Assert
    // @ts-ignore
    assert.strictEqual( this.oDeviceModel.getData().support.touch, bIsTouch, "IsTouch property is correct");
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
    this.oDeviceModel = models.createDeviceModel();

    // Assert
    // @ts-ignore
    assert.strictEqual(this.oDeviceModel.getDefaultBindingMode(), "OneWay", "Binding mode is correct");
});
