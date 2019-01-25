import UIComponent from "sap/ui/core/UIComponent";
import XMLTemplateProcessor from "sap/ui/core/XMLTemplateProcessor";
import RenderManager from "sap/ui/core/RenderManager";
import JSONModel from "sap/ui/model/json/JSONModel";
import ManagedObjectModel from "sap/ui/model/base/ManagedObjectModel"
import Fragment from "sap/ui/core/Fragment"

@UI5("ui5.testApp.components.UIWebComponent")
export default class UIWebComponent extends UIComponent {
    customElement: HTMLElement;
    specialSettings: Array<string>;

    public static metadata: any = {
        properties: {
            observedAttributes: {type: "Array", defaultValue: []},
            cssUrl: {type: "string", defaultValue: null},
            xmlTemplateLightDom: {type: "string", defaultValue: null},
            xmlTemplateShadowDom: {type: "string", defaultValue: null},
            shadowDom: {type: "string", defaultValue: null},
            htmlTag: {type: "string", defaultValue: null}
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
            app: {type: "sap.ui.core.Control", visibility: "public"}
        }
    };

    // this array contains properties that will not be assigned as attributes in html representation
    public init(): void {
        this.specialSettings = ['observedAttributes', 'cssUrl', 'shadowDom', "htmlTag", "xmlTemplateShadowDom", "xmlTemplateLightDom"]
    }

    //setters for properties
    public setObservedAttributes(obsAttr: Array<string>): object {
        this.setProperty("observedAttributes", obsAttr);
        return this;
    }

    public setCssUrl(url: string): object {
        this.setProperty("cssUrl", url);
        return this;
    }

    public setXmlTemplate(url: string): object {
        this.setProperty("xmlTemplate", url);
        return this;
    }

    public setShadowDom(shadowDom: string): object {
        this.setProperty("shadowDom", shadowDom);
        return this;
    }

    public setHtmlTag(htmlTag: string): object {
        this.setProperty("htmlTag", htmlTag);
        return this;
    }

    // copy current loaded css links from ui5 config to custom element shadow dom
    public copyCurentSAPCss(): string {
        const loadedLibraries = Object.keys(sap.ui.getCore().getLoadedLibraries());
        let cssLinks = '';
        loadedLibraries.map((library: string) => {
            cssLinks += '<link rel="stylesheet" type="text/css" href="' +
                jQuery.sap.getResourcePath(library.replace(/\./g\ ,
            "/"
        ))
            +
                '/themes/' +
            sap.ui.getCore().getConfiguration().getTheme() + '/library.css">'
        })
        return cssLinks;
    }

    //return custom css link that was assigned in component settings
    public getComponentCustomCssLink(): string {
        if (this.getProperty("cssUrl")) {
            return '<link rel="stylesheet" type="text/css" href="' + this.getProperty("cssUrl") + '">'
        }
        return "";
    }

    // updating custom elements attribute
    public setAttribute(name: string, value: string): void {
        if (this.customElement) {
            this.customElement.setAttribute(name, value);
        }
    }

    // changing properties to custom element attributes, will be assigned only those that aren't in special settings array
    public writeProperties(oRM: RenderManager): void {
        const properties: Array<string> = Object.keys(this.mProperties);

        properties.map((property: string) => {
                if (this.specialSettings.indexOf(property) === -1) {
                    oRM.writeAttribute(property, this.mProperties[property])
                }
            }
        )
    }

    public _initCompositeSupport(mSettings:object):void {
        if (mSettings.xmlTemplateLightDom) {
            const oFragmentContent = XMLTemplateProcessor.loadTemplate(mSettings.xmlTemplateLightDom, "component");
            this._destroyCompositeAggregation("lightDom");

            let oFragmentLight = sap.ui.xmlfragment({
                sId: this.getId(),
                fragmentContent: oFragmentContent,
                oController: this
            })
            this._setCompositeAggregation(oFragmentLight, "lightDom");
        }

        if (mSettings.xmlTemplateShadowDom && mSettings.shadowDom) {
            const oFragmentContentShadow = XMLTemplateProcessor.loadTemplate(mSettings.xmlTemplateShadowDom, "component");

            this._destroyCompositeAggregation("shadowDom");
            let oFragmentShadow = sap.ui.xmlfragment({
                sId: this.getId(),
                fragmentContent: oFragmentContentShadow,
                oController: this
            })
            const _that = this;
            oFragmentShadow.setModel(new JSONModel({"compId": _that.getId()}), "settingsModel");
            this._setCompositeAggregation(oFragmentShadow, "shadowDom");
        }
    };

    public _setCompositeAggregation(oNewContent:object, sCompositeName:string):void {

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
                oNewContent.bindObject("$this>/");//first define the context
                oNewContent.setModel(this._oManagedObjectModel, "$this");//then set the model
                // var oResourceModel = this._getResourceModel();
                /// if (oResourceModel) {
                //    oNewContent.setModel(oResourceModel, "$" + this.alias + ".i18n");
                //}
            }
            this.setAggregation(sCompositeName, oNewContent);
        }
    };

    public _getCompositeAggregation(sCompositeName:string):object {
        return this.getAggregation(sCompositeName);
    };


    public updateAggregation(sName:string, bSuppressInvalidate:boolean):void {
        var oAggregation = this.getMetadata().getAggregation(sName);
        if (oAggregation && oAggregation.type === "TemplateMetadataContext") {
            this.invalidate();
            return;
        }
        this.updateAggregation.apply(this, arguments);
    };


    public _destroyCompositeAggregation(sCompositeName:string):object {
        var oContent = this._getCompositeAggregation(sCompositeName);
        if (oContent) {
            oContent.destroy("KeepDom");
        }
        return this;
    };

    public updateBindings():object{
        var oResult = UIComponent.prototype.updateBindings.apply(this, arguments);
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

    public enhanceAccessibilityState(oElement: Element, mAriaProps:object):object {
        var oParent = this.getParent();

        if (oParent && oParent.enhanceAccessibilityState) {
            // use XMLComposite as control, but aria properties of rendered inner controls.
            return oParent.enhanceAccessibilityState(this, mAriaProps);
        }

        return mAriaProps;
    };

    public _getManagedObjectModel():ManagedObjectModel  {
        if (!this._oManagedObjectModel) {
            this._oManagedObjectModel = new ManagedObjectModel(this);
        }
        return this._oManagedObjectModel;
    };

    public byId (sId:string):object {
        return sap.ui.getCore().byId(Fragment.createId(this.getId(), sId));
    };


    // create custom element class, in case already defined attach html instance by component id
    public setCustomElement(): void {

            class UI5CustomElement extends HTMLElement {
                template: object;
                context: object;
                shadowRoot: any;
                cssLinks:string;

                constructor() {
                    super();
                    this.context = sap.ui.getCore().getComponent(this.getAttribute("componentId"));

                    if (this.context) {
                        this.cssLinks = this.context.copyCurentSAPCss();
                        this.cssLinks += this.context.getComponentCustomCssLink();
                        this.setTemplate();
                        if (this.context.getProperty("shadowDom")) {
                            this.setShadowDom(this.context.getProperty("shadowDom"))
                        }
                    }else{
                        // id comp id is not attached as attribute, do not create element
                        this.parentNode.removeChild(this)
                    }

                }

                setTemplate(): void {
                    this.template = document.createElement('template');
                    this.template.innerHTML = this.cssLinks+`<slot></slot>`
                }

                setShadowDom(shadowDom: string): void {
                    this.attachShadow({mode: shadowDom});
                    if (this.template && this.context && this.context.getAggregation("shadowDom")) {
                        const oRM = sap.ui.getCore().createRenderManager();
                        this.template.innerHTML = this.cssLinks + oRM.getHTML(this.context.getAggregation("shadowDom"));
                        this.shadowRoot.appendChild(this.template.content.cloneNode(true));
                        oRM.destroy();
                    }
                }

                attributeChangedCallback(name, oldValue, newValue): void {
                    if (this.context && this.context.attributeChangedCallback) {
                        this.context.attributeChangedCallback(name, oldValue, newValue)
                    }
                }

                static get observedAttributes(): Array<string> {
                    return this.context ? this.context.getProperty("observedAttributes") : [];
                }


                connectedCallback(): void {
                    if (this.context && this.context.connectedCallback) {
                        this.context.connectedCallback(this)
                    }
                }

                disconnectedCallback(): void {
                    if (this.context && this.context.disconnectedCallback) {
                        this.context.disconnectedCallback(this)
                    }
                }

                adoptedCallback(): void {
                    if (this.context && this.context.adoptedCallback) {
                        this.context.adoptedCallback(this)
                    }
                }
            }

            // define custom element in browser
            try {
                customElements.define(this.getProperty("htmlTag"), UI5CustomElement);
            } catch {
            }

        // attach html instance to current ui5 component
        customElements.whenDefined(this.getProperty("htmlTag")).then(() => {
            let allInstances: Array<HTMLElement> = Array.from(document.querySelectorAll(this.getProperty("htmlTag")));
            allInstances.map((item: HTMLElement) => {
                if (item.getAttribute("componentId") === this.getId()) {
                    this.customElement = item;
                }
            })
        });


    }
}