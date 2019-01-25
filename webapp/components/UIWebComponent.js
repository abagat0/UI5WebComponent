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
define(["require", "exports", "sap/ui/core/UIComponent", "sap/ui/core/XMLTemplateProcessor", "sap/ui/model/json/JSONModel", "sap/ui/model/base/ManagedObjectModel", "sap/ui/core/Fragment"], function (require, exports, UIComponent_1, XMLTemplateProcessor_1, JSONModel_1, ManagedObjectModel_1, Fragment_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var UIWebComponent = /** @class */ (function (_super) {
        __extends(UIWebComponent, _super);
        function UIWebComponent() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        // this array contains properties that will not be assigned as attributes in html representation
        UIWebComponent.prototype.init = function () {
            this.specialSettings = ['observedAttributes', 'cssUrl', 'shadowDom', "htmlTag", "xmlTemplateShadowDom", "xmlTemplateLightDom"];
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
        // copy current loaded css links from ui5 config to custom element shadow dom
        UIWebComponent.prototype.copyCurentSAPCss = function () {
            var loadedLibraries = Object.keys(sap.ui.getCore().getLoadedLibraries());
            var cssLinks = '';
            loadedLibraries.map(function (library) {
                cssLinks += '<link rel="stylesheet" type="text/css" href="' +
                    jQuery.sap.getResourcePath(library.replace(/\./g, "/"))
                    +
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
        UIWebComponent.prototype._initCompositeSupport = function (mSettings) {
            if (mSettings.xmlTemplateLightDom) {
                var oFragmentContent = XMLTemplateProcessor_1.default.loadTemplate(mSettings.xmlTemplateLightDom, "component");
                this._destroyCompositeAggregation("lightDom");
                var oFragmentLight = sap.ui.xmlfragment({
                    sId: this.getId(),
                    fragmentContent: oFragmentContent,
                    oController: this
                });
                this._setCompositeAggregation(oFragmentLight, "lightDom");
            }
            if (mSettings.xmlTemplateShadowDom && mSettings.shadowDom) {
                var oFragmentContentShadow = XMLTemplateProcessor_1.default.loadTemplate(mSettings.xmlTemplateShadowDom, "component");
                this._destroyCompositeAggregation("shadowDom");
                var oFragmentShadow = sap.ui.xmlfragment({
                    sId: this.getId(),
                    fragmentContent: oFragmentContentShadow,
                    oController: this
                });
                var _that = this;
                oFragmentShadow.setModel(new JSONModel_1.default({ "compId": _that.getId() }), "settingsModel");
                this._setCompositeAggregation(oFragmentShadow, "shadowDom");
            }
        };
        ;
        UIWebComponent.prototype._setCompositeAggregation = function (oNewContent, sCompositeName) {
            if (sCompositeName) {
                this._destroyCompositeAggregation(sCompositeName);
                if (!this._oManagedObjectModel) {
                    this._getManagedObjectModel();
                }
                if (Array.isArray(oNewContent)) {
                    this.setAggregation(sCompositeName, null);
                    return;
                }
                if (oNewContent) {
                    //accessibility
                    if (!oNewContent.enhanceAccessibilityState) {
                        oNewContent.enhanceAccessibilityState = function (oElement, mAriaProps) {
                            this.enhanceAccessibilityState(oElement, mAriaProps);
                        }.bind(this);
                    }
                    oNewContent.bindObject("$this>/"); //first define the context
                    oNewContent.setModel(this._oManagedObjectModel, "$this"); //then set the model
                    // var oResourceModel = this._getResourceModel();
                    /// if (oResourceModel) {
                    //    oNewContent.setModel(oResourceModel, "$" + this.alias + ".i18n");
                    //}
                }
                this.setAggregation(sCompositeName, oNewContent);
            }
        };
        ;
        UIWebComponent.prototype._getCompositeAggregation = function (sCompositeName) {
            return this.getAggregation(sCompositeName);
        };
        ;
        UIWebComponent.prototype.updateAggregation = function (sName, bSuppressInvalidate) {
            var oAggregation = this.getMetadata().getAggregation(sName);
            if (oAggregation && oAggregation.type === "TemplateMetadataContext") {
                this.invalidate();
                return;
            }
            this.updateAggregation.apply(this, arguments);
        };
        ;
        UIWebComponent.prototype._destroyCompositeAggregation = function (sCompositeName) {
            var oContent = this._getCompositeAggregation(sCompositeName);
            if (oContent) {
                oContent.destroy("KeepDom");
            }
            return this;
        };
        ;
        UIWebComponent.prototype.updateBindings = function () {
            var oResult = UIComponent_1.default.prototype.updateBindings.apply(this, arguments);
            for (var n in this.mBindingInfos) {
                var oAggregation = this.getMetadata().getAggregation(n);
                if (oAggregation &&
                    oAggregation.multiple &&
                    !oAggregation._doesNotRequireFactory &&
                    this.isBound(n) &&
                    !this.getBinding(n)) {
                    this[oAggregation._sDestructor]();
                }
            }
            return oResult;
        };
        ;
        UIWebComponent.prototype.enhanceAccessibilityState = function (oElement, mAriaProps) {
            var oParent = this.getParent();
            if (oParent && oParent.enhanceAccessibilityState) {
                // use XMLComposite as control, but aria properties of rendered inner controls.
                return oParent.enhanceAccessibilityState(this, mAriaProps);
            }
            return mAriaProps;
        };
        ;
        UIWebComponent.prototype._getManagedObjectModel = function () {
            if (!this._oManagedObjectModel) {
                this._oManagedObjectModel = new ManagedObjectModel_1.default(this);
            }
            return this._oManagedObjectModel;
        };
        ;
        UIWebComponent.prototype.byId = function (sId) {
            return sap.ui.getCore().byId(Fragment_1.default.createId(this.getId(), sId));
        };
        ;
        // create custom element class, in case already defined attach html instance by component id
        UIWebComponent.prototype.setCustomElement = function () {
            var _this = this;
            var UI5CustomElement = /** @class */ (function (_super) {
                __extends(UI5CustomElement, _super);
                function UI5CustomElement() {
                    var _this = _super.call(this) || this;
                    _this.context = sap.ui.getCore().getComponent(_this.getAttribute("componentId"));
                    if (_this.context) {
                        _this.cssLinks = _this.context.copyCurentSAPCss();
                        _this.cssLinks += _this.context.getComponentCustomCssLink();
                        _this.setTemplate();
                        if (_this.context.getProperty("shadowDom")) {
                            _this.setShadowDom(_this.context.getProperty("shadowDom"));
                        }
                    }
                    else {
                        // id comp id is not attached as attribute, do not create element
                        _this.parentNode.removeChild(_this);
                    }
                    return _this;
                }
                UI5CustomElement.prototype.setTemplate = function () {
                    this.template = document.createElement('template');
                    this.template.innerHTML = this.cssLinks + "<slot></slot>";
                };
                UI5CustomElement.prototype.setShadowDom = function (shadowDom) {
                    this.attachShadow({ mode: shadowDom });
                    if (this.template && this.context && this.context.getAggregation("shadowDom")) {
                        var oRM = sap.ui.getCore().createRenderManager();
                        this.template.innerHTML = this.cssLinks + oRM.getHTML(this.context.getAggregation("shadowDom"));
                        this.shadowRoot.appendChild(this.template.content.cloneNode(true));
                        oRM.destroy();
                    }
                };
                UI5CustomElement.prototype.attributeChangedCallback = function (name, oldValue, newValue) {
                    if (this.context && this.context.attributeChangedCallback) {
                        this.context.attributeChangedCallback(name, oldValue, newValue);
                    }
                };
                Object.defineProperty(UI5CustomElement, "observedAttributes", {
                    get: function () {
                        return this.context ? this.context.getProperty("observedAttributes") : [];
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
                customElements.define(this.getProperty("htmlTag"), UI5CustomElement);
            }
            catch (_a) {
            }
            // attach html instance to current ui5 component
            customElements.whenDefined(this.getProperty("htmlTag")).then(function () {
                var allInstances = Array.from(document.querySelectorAll(_this.getProperty("htmlTag")));
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
                xmlTemplateLightDom: { type: "string", defaultValue: null },
                xmlTemplateShadowDom: { type: "string", defaultValue: null },
                shadowDom: { type: "string", defaultValue: null },
                htmlTag: { type: "string", defaultValue: null }
            },
            aggregations: {
                lightDom: {
                    type: "sap.ui.core.Control", multiple: false,
                    visibility: "public",
                    invalidate: true
                },
                shadowDom: {
                    type: "sap.ui.core.Control", multiple: false,
                    visibility: "public",
                    invalidate: true
                },
                app: { type: "sap.ui.core.Control", visibility: "public" }
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