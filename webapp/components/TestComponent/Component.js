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
define(["require", "exports", "ui5/testApp/components/UIWebComponent", "sap/ui/model/json/JSONModel"], function (require, exports, UIWebComponent_1, JSONModel_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var TestComponent = /** @class */ (function (_super) {
        __extends(TestComponent, _super);
        function TestComponent() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        TestComponent.prototype.init = function () {
            _super.prototype.init.apply(this, arguments);
            this.setModel(new JSONModel_1.default({ message: "start message" }));
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
            if (!this.oContent) {
                this.renderContent();
            }
            // tbd run html file with UI5 controls
            if (!this.customElement && this.oContent) {
                //attach all models to fragment that you want to use
                this.oContent.setModel(this.getModel());
                // copy/attach css
                var cssLinks = "";
                if (this.getProperty("shadowDom")) {
                    cssLinks = this.copyCurentSAPCss();
                }
                cssLinks += this.getComponentCustomCssLink();
                // create html template that will be custom element initialization
                this.template = document.createElement('template');
                this.template.innerHTML = cssLinks + "\n                     <div></div>\n                     <slot name=\"test\"></slot>                 \n                     <slot name=\"secondTest\"></slot>\n                     <div>last</div>\n                  ";
                // finally create custom element
                this.setCustomElement(this.getProperty("htmlTag"), this.getProperty("observedAttributes"), this.template, this.getProperty("shadowDom"));
            }
        };
        TestComponent.prototype.connectedCallback = function (element) {
            var slot = element.shadowRoot.querySelector('slot');
            slot.addEventListener('slotchange', function (e) {
                console.log('light dom children changed!');
            });
        };
        // hander for pressing button on xml template
        TestComponent.prototype.handlePress = function (oEvent) {
            this.getModel().setProperty("/message", "changed");
        };
        TestComponent.prototype.render = function (oRenderManager) {
            // convenience variable
            var oRM = oRenderManager;
            var oComponent = this;
            oRM.write("<div ");
            oRM.write(oComponent.getId());
            oRM.writeClasses();
            oRM.write("><");
            // call custom element tag
            oRM.write(oComponent.getProperty("htmlTag"));
            // change propeties to attributes
            oComponent.writeProperties(oRM);
            // pass componentId, it's very important, without that custom element and component cannot find/update each other
            oRM.writeAttribute("componentId", oComponent.getId());
            // pass resolver to begining template (if it was sth declared), if there were slots then call slot=' slot name ' to navigate browser where place it
            oRM.write("><div slot='test' >" +
                oRM.getHTML(oComponent.oContent) +
                "</div><div slot='secondTest'>second</div></" +
                // close custom element tag
                oComponent.getProperty("htmlTag") +
                "></div></div>");
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