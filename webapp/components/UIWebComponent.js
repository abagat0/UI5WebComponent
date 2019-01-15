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
define(["require", "exports", "sap/ui/core/UIComponent", "sap/ui/core/XMLTemplateProcessor"], function (require, exports, UIComponent_1, XMLTemplateProcessor_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var UIWebComponent = /** @class */ (function (_super) {
        __extends(UIWebComponent, _super);
        function UIWebComponent() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        // this array contains properties that will not be assigned as attributes in html representation
        UIWebComponent.prototype.init = function () {
            this.specialSettings = ['observedAttributes', 'cssUrl', 'xmlTemplate', 'shadowDom', "htmlTag"];
        };
        //setters for properties
        UIWebComponent.prototype.setObservedAttributes = function (obsAttr) {
            this.setProperty("observedAttributes", obsAttr);
            return this;
        };
        UIWebComponent.prototype.setCssUrl = function (url) {
            this.setProperty("cssUrl", url);
            return this;
        };
        UIWebComponent.prototype.setXmlTemplate = function (url) {
            this.setProperty("xmlTemplate", url);
            return this;
        };
        UIWebComponent.prototype.setShadowDom = function (shadowDom) {
            this.setProperty("shadowDom", shadowDom);
            return this;
        };
        UIWebComponent.prototype.setHtmlTag = function (htmlTag) {
            this.setProperty("htmlTag", htmlTag);
            return this;
        };
        // render content from component.xml template, models are copied automatically to content
        UIWebComponent.prototype.renderContent = function () {
            try {
                var oFragmentContent = XMLTemplateProcessor_1.default.loadTemplate(this.getProperty("xmlTemplate"), "component");
                this.oContent = sap.ui.xmlfragment({
                    sId: this.getId(),
                    fragmentContent: oFragmentContent,
                    oController: this
                });
            }
            catch (_a) {
                throw "Cannot render content";
            }
        };
        // copy current loaded css links from ui5 config to custom element shadow dom
        UIWebComponent.prototype.copyCurentSAPCss = function () {
            var loadedLibraries = Object.keys(sap.ui.getCore().getLoadedLibraries());
            var cssLinks = '';
            loadedLibraries.map(function (library) {
                cssLinks += '<link rel="stylesheet" type="text/css" href="' +
                    jQuery.sap.getResourcePath(library.replace(/\./g, "/")) +
                    '/themes/' +
                    sap.ui.getCore().getConfiguration().getTheme() + '/library.css">';
            });
            return cssLinks;
        };
        //return custom css link that was assigned in component settings
        UIWebComponent.prototype.getComponentCustomCssLink = function () {
            if (this.getProperty("cssUrl")) {
                return '<link rel="stylesheet" type="text/css" href="' + this.getProperty("cssUrl") + '">';
            }
            return "";
        };
        // updating custom elements attribute
        UIWebComponent.prototype.setAttribute = function (name, value) {
            if (this.customElement) {
                this.customElement.setAttribute(name, value);
            }
        };
        // changing properties to custom element attributes, will be assigned only those that aren't in special settings array
        UIWebComponent.prototype.writeProperties = function (oRM) {
            var _this = this;
            var properties = Object.keys(this.mProperties);
            properties.map(function (property) {
                if (_this.specialSettings.indexOf(property) === -1) {
                    oRM.writeAttribute(property, _this.mProperties[property]);
                }
            });
        };
        // create custom element class, in case already defined attach html instance by component id
        UIWebComponent.prototype.setCustomElement = function (customElTag, obsAttr, template, shadowDom) {
            var _this = this;
            var UI5CustomElement = /** @class */ (function (_super) {
                __extends(UI5CustomElement, _super);
                function UI5CustomElement() {
                    var _this = _super.call(this) || this;
                    _this.context = sap.ui.getCore().getComponent(_this.getAttribute("componentId"));
                    _this.setTemplate(template);
                    if (shadowDom) {
                        _this.setShadowDom(shadowDom);
                    }
                    return _this;
                }
                UI5CustomElement.prototype.setTemplate = function (template) {
                    this.template = document.createElement('template');
                    this.template.innerHTML = "<slot></slot>";
                    if (template) {
                        this.template = template;
                    }
                };
                UI5CustomElement.prototype.setShadowDom = function (shadowDom) {
                    this.attachShadow({ mode: shadowDom });
                    if (this.template) {
                        this.shadowRoot.appendChild(this.template.content.cloneNode(true));
                    }
                };
                UI5CustomElement.prototype.attributeChangedCallback = function (name, oldValue, newValue) {
                    if (this.context && this.context.attributeChangedCallback) {
                        this.context.attributeChangedCallback(name, oldValue, newValue);
                    }
                };
                Object.defineProperty(UI5CustomElement, "observedAttributes", {
                    get: function () {
                        return obsAttr;
                    },
                    enumerable: true,
                    configurable: true
                });
                UI5CustomElement.prototype.connectedCallback = function () {
                    if (this.context && this.context.connectedCallback) {
                        this.context.connectedCallback(this);
                    }
                };
                UI5CustomElement.prototype.disconnectedCallback = function () {
                    if (this.context && this.context.disconnectedCallback) {
                        this.context.disconnectedCallback(this);
                    }
                };
                UI5CustomElement.prototype.adoptedCallback = function () {
                    if (this.context && this.context.adoptedCallback) {
                        this.context.adoptedCallback(this);
                    }
                };
                return UI5CustomElement;
            }(HTMLElement));
            // define custom element in browser
            try {
                customElements.define(customElTag, UI5CustomElement);
            }
            catch (_a) {
            }
            // attach html instance to current ui5 component
            customElements.whenDefined(customElTag).then(function () {
                var allInstances = Array.from(document.querySelectorAll(customElTag));
                allInstances.map(function (item) {
                    if (item.getAttribute("componentId") === _this.getId()) {
                        _this.customElement = item;
                    }
                });
            });
        };
        UIWebComponent.metadata = {
            properties: {
                observedAttributes: { type: "Array", defaultValue: [] },
                cssUrl: { type: "string", defaultValue: null },
                xmlTemplate: { type: "string", defaultValue: null },
                shadowDom: { type: "string", defaultValue: null },
                htmlTag: { type: "string", defaultValue: null }
            }
        };
        UIWebComponent = __decorate([
            UI5("ui5.testApp.components.UIWebComponent")
        ], UIWebComponent);
        return UIWebComponent;
    }(UIComponent_1.default));
    exports.default = UIWebComponent;
});
//# sourceMappingURL=UIWebComponent.js.map