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
define(["require", "exports", "ui5/testApp/components/UIWebComponent", "sap/ui/model/json/JSONModel", "sap/ui/core/Element"], function (require, exports, UIWebComponent_1, JSONModel_1, Element_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    // @ts-ignore
    Element_1.default.prototype.getDomRef = function (sSuffix) {
        var DomRef = (((sSuffix ? this.getId() + "-" + sSuffix : this.getId())) ? window.document.getElementById(sSuffix ? this.getId() + "-" + sSuffix : this.getId()) : null);
        if (!DomRef && this.getModel("settingsModel")) {
            var oComponent = sap.ui.getCore().getComponent(this.getModel("settingsModel").getProperty("/compId"));
            var customElement = oComponent.customElement;
            if (sSuffix && customElement && customElement.shadowRoot) {
                DomRef = customElement.shadowRoot.querySelector("#" + this.getId() + "-" + sSuffix);
            }
            else if (customElement && customElement.shadowRoot) {
                DomRef = customElement.shadowRoot.querySelector("[id*='" + this.getId() + "']");
            }
        }
        return DomRef;
    };
    var TestComponent = /** @class */ (function (_super) {
        __extends(TestComponent, _super);
        function TestComponent() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        TestComponent.prototype.init = function () {
            _super.prototype.init.apply(this, arguments);
            var _that = this;
            var oData = [
                {
                    "ProductId": "HT-1000",
                    "Category": "Laptops",
                    "MainCategory": "Computer Systems",
                    "TaxTarifCode": "1",
                    "SupplierName": "Very Best Screens",
                    "WeightMeasure": 4.2,
                    "WeightUnit": "KG",
                    "Description": "Notebook Basic 15 with 2,80 GHz quad core, 15\" LCD, 4 GB DDR3 RAM, 500 GB Hard Disc, Windows 8 Pro",
                    "Name": "Notebook Basic 15",
                    "DateOfSale": "2017-03-26",
                    "ProductPicUrl": "test-resources/sap/ui/documentation/sdk/images/HT-1000.jpg",
                    "Status": "Available",
                    "Quantity": 10,
                    "UoM": "PC",
                    "CurrencyCode": "EUR",
                    "Price": 956,
                    "Width": 30,
                    "Depth": 18,
                    "Height": 3,
                    "DimUnit": "cm"
                },
                {
                    "ProductId": "HT-1001",
                    "Category": "Laptops",
                    "MainCategory": "Computer Systems",
                    "TaxTarifCode": "1",
                    "SupplierName": "Very Best Screens",
                    "WeightMeasure": 4.5,
                    "WeightUnit": "KG",
                    "Description": "Notebook Basic 17 with 2,80 GHz quad core, 17\" LCD, 4 GB DDR3 RAM, 500 GB Hard Disc, Windows 8 Pro",
                    "Name": "Notebook Basic 17",
                    "DateOfSale": "2017-04-17",
                    "ProductPicUrl": "test-resources/sap/ui/documentation/sdk/images/HT-1001.jpg",
                    "Status": "Available",
                    "Quantity": 20,
                    "UoM": "PC",
                    "CurrencyCode": "EUR",
                    "Price": 1249,
                    "Width": 29,
                    "Depth": 17,
                    "Height": 3.1,
                    "DimUnit": "cm"
                }
            ];
            var oModel = new JSONModel_1.default({ message: "start message", compID: _that.getId(), products: oData }, false);
            this.setModel(oModel);
        };
        // custom properties setters
        TestComponent.prototype.setPro = function (pro) {
            this.setProperty("pro", pro);
            this.setAttribute("pro", pro);
            return this;
        };
        TestComponent.prototype.setMessage = function (message) {
            this.setProperty("message", message);
            this.setAttribute("message", message);
            return this;
        };
        // custom element method that take care of attribute changes
        TestComponent.prototype.attributeChangedCallback = function (name, oldValue, newValue) {
            console.log(name, oldValue, newValue);
        };
        // custom element can de defined / attached only when we have access to properties, that's why we cannot do it in init method
        TestComponent.prototype.onBeforeRendering = function () {
            if (!this.customElement) {
                this.setCustomElement();
            }
        };
        TestComponent.prototype.connectedCallback = function (element) {
            if (element.shadowRoot) {
                var events = [
                    "click",
                    "dblclick",
                    "contextmenu",
                    "focusin",
                    "focusout",
                    "keydown",
                    "keypress",
                    "keyup",
                    "mousedown",
                    "mouseout",
                    "mouseover",
                    "mouseup",
                    "select",
                    "selectstart",
                    "dragstart",
                    "dragenter",
                    "dragover",
                    "dragleave",
                    "dragend",
                    "drop",
                    "paste",
                    "cut",
                    /* input event is fired synchronously on IE9+ when the value of an <input> or <textarea> element is changed */
                    /* for more details please see : https://developer.mozilla.org/en-US/docs/Web/Reference/Events/input */
                    "input"
                ];
                var htmlElment = element.shadowRoot.querySelector("div") || "";
                jQuery(htmlElment).bind("click", element.context.handleEvents);
                var slot = element.shadowRoot.querySelector('slot');
                if (slot) {
                    slot.addEventListener('slotchange', function (e) {
                        console.log('light dom children changed!');
                    });
                }
            }
        };
        TestComponent.prototype.disconnectedCallback = function (element) {
            if (element.shadowRoot) {
                var htmlElement = element.shadowRoot.querySelector("div") || "";
                jQuery(htmlElement).unbind("click", element.context.unbindEvents);
            }
        };
        TestComponent.prototype.handleEvents = function (oEvent) {
            if (oEvent.target) {
                var event_1 = jQuery(oEvent.target);
                if (event_1.control(0) && event_1.control(0).getModel("settingsModel") && event_1.control(0).mEventRegistry["press"]
                    && (event_1.control(0).getProperty("enabled") === undefined || event_1.control(0).getProperty("enabled") === true)) {
                    event_1.control(0).firePress();
                }
            }
        };
        TestComponent.prototype.unbindEvents = function (oEvent) {
            console.log(oEvent);
        };
        // hander for pressing button on xml template
        TestComponent.prototype.handlePress = function (oEvent) {
            var oModel = this.getModel();
            oModel.setProperty("/message", "changed" + new Date().getTime());
            oModel.updateBindings(true);
            this.setProperty("xmlTemplateLightDom", "changed" + new Date().getTime());
        };
        TestComponent.prototype.onToggleInfoToolbar = function (oEvent) {
            var oTable = this.byId("idProductsTable");
            var oToolbar = oTable.getInfoToolbar();
            oToolbar.setProperty("visible", !oToolbar.getProperty("visible"));
        };
        TestComponent.prototype.render = function (oRenderManager) {
            var oRM = oRenderManager;
            var oComponent = this;
            oRM.write("<div ");
            oRM.write(oComponent.getId());
            oRM.writeClasses();
            oRM.write(">");
            oRM.write("<");
            // call custom element tag
            oRM.write(oComponent.getProperty("htmlTag"));
            // change propeties to attributes
            oComponent.writeProperties(oRM);
            // pass componentId, it's very important, without that custom element and component cannot find/update each other
            oRM.writeAttribute("componentId", oComponent.getId());
            oRM.write(">");
            // check if aggregation has chilren
            var oAggregation = this.getAggregation("lightDom", []);
            if (oAggregation && !Array.isArray(oAggregation) && oAggregation.getItems && Array.isArray(oAggregation.getItems())) {
                oAggregation.getItems().map(function (oControl) {
                    oRM.write(oRM.getHTML(oControl));
                });
            }
            else if (!Array.isArray(oAggregation)) {
                oRM.write(oRM.getHTML(oAggregation));
            }
            oRM.write("<" +
                oComponent.getProperty("htmlTag") +
                "></div>");
        };
        ;
        // defining custom properties, in the end will be joined with those from UIWebComponent class
        TestComponent.metadata = {
            manifest: "json",
            properties: {
                pro: { type: "string", defaultValue: "{/message}", bindable: true },
                message: { type: "string", defaultValue: "{/message}", bindable: true }
            }
        };
        TestComponent = __decorate([
            UI5("ui5.testApp.components.TestComponent.TestComponent")
        ], TestComponent);
        return TestComponent;
    }(UIWebComponent_1.default));
    exports.default = TestComponent;
});
//# sourceMappingURL=Component.js.map