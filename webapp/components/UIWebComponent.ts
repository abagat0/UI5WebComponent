import UIComponent from "sap/ui/core/UIComponent";
import RenderManager from "sap/ui/core/RenderManager";
import JSONModel from "sap/ui/model/json/JSONModel";
import UIWebComponentInterface from "ui5/testApp/types/UIWebComponentInterface";
// @ts-ignore
import  ManagedObjectModel from "sap/ui//model/base/ManagedObjectModel";
import UI5CustomElementInterface from "ui5/testApp/types/UI5CustomElementInterface";

@UI5("ui5.testApp.components.UIWebComponent")
export default class UIWebComponent extends UIComponent {
    customElement: UI5CustomElementInterface;
    specialSettings: Array<string>;
    _oManagedObjectModel: ManagedObjectModel
    mProperties: object;

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
        if(/test\//.test(window.location.pathname)) {
            url = "../" + url
        }
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
        const loadedLibraries: Array<string> = Object.keys(sap.ui.getCore().getLoadedLibraries());
        let cssLinks:string = '';
        loadedLibraries.map((library: string) => {
            cssLinks += '<link rel="stylesheet" type="text/css" href="' +
                jQuery.sap.getResourcePath(library.replace(/\./g, "/"))
                + '/themes/' +
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
        const prop: sap.ui.base.ManagedObject = <sap.ui.base.ManagedObject> this.mProperties;
        const properties: Array<string> = Object.keys(prop);

        properties.map((property: string) => {
                if (this.specialSettings.indexOf(property) === -1) {
                    oRM.writeAttribute(property, this.getProperty(property))
                }
            }
        )
    }

    public _initCompositeSupport(mSettings: object): void {
        if (mSettings.hasOwnProperty("xmlTemplateLightDom")) {
            const core:any = <any>sap.ui.core;
            const oFragmentContent:sap.ui.core.Fragment = core.XMLTemplateProcessor.loadTemplate((<any>mSettings)["xmlTemplateLightDom"], "component");
            this._destroyCompositeAggregation("lightDom");

            const oFragmentLight: sap.ui.core.Control | sap.ui.core.Control[] = sap.ui.xmlfragment({
                sId: this.getId(),
                fragmentContent: oFragmentContent,
                oController: this
            })
            this._setCompositeAggregation(oFragmentLight, "lightDom");
        }

        if (mSettings.hasOwnProperty("xmlTemplateShadowDom") && mSettings.hasOwnProperty("shadowDom")) {
            const core:any = <any>sap.ui.core;
            const oFragmentContentShadow:sap.ui.core.Fragment = core.XMLTemplateProcessor.loadTemplate((<any>mSettings)["xmlTemplateShadowDom"], "component");

            this._destroyCompositeAggregation("shadowDom");
            let oFragmentShadow: sap.ui.core.Control = <any>sap.ui.xmlfragment({
                sId: this.getId(),
                fragmentContent: oFragmentContentShadow,
                oController: this
            })
            const _that:UIWebComponent = this;
            oFragmentShadow.setModel(new JSONModel({"compId": _that.getId()}, false), "settingsModel");
            this._setCompositeAggregation(oFragmentShadow, "shadowDom");
        }
    };

    public _setCompositeAggregation(oNewContent: any, sCompositeName: string): void {

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
                    oNewContent.enhanceAccessibilityState = (oElement: Element, mAriaProps: object) => {
                        this.enhanceAccessibilityState(oElement, mAriaProps);
                    };
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

    public _getCompositeAggregation(sCompositeName: string): object {
        return this.getAggregation(sCompositeName, []);
    };


    public updateAggregation(sName: string): void {
        const oAggregation:sap.ui.core.Control = <any>this.getAggregation(sName, new sap.ui.core.Control());
        if (oAggregation && !Array.isArray(oAggregation) && (<any>oAggregation)["type"] === "TemplateMetadataContext") {
            this.invalidate();
            return;
        }
        this.updateAggregation.apply(this, arguments);
    };


    public _destroyCompositeAggregation(sCompositeName: string): object {
        const oContent:sap.ui.core.Control = <any>this._getCompositeAggregation(sCompositeName);
        if (oContent && !Array.isArray(oContent)) {
            (<any>oContent).destroy("KeepDom");
        }
        return this;
    };


    public enhanceAccessibilityState(oElement: Element, mAriaProps: object): object {

        if (this.getParent() && (<any>this.getParent()).enhanceAccessibilityState) {
            // use XMLComposite as control, but aria properties of rendered inner controls.
            return (<any>this.getParent()).enhanceAccessibilityState(this, mAriaProps);
        }

        return mAriaProps;
    };

    public _getManagedObjectModel(): ManagedObjectModel {
        if (!this._oManagedObjectModel) {
            this._oManagedObjectModel = new ManagedObjectModel(this);
        }
        return this._oManagedObjectModel;
    };

     public byId (sId:string):any {
         return sap.ui.getCore().byId(sap.ui.core.Fragment.createId(this.getId(), sId));
     };


    // create custom element class, in case already defined attach html instance by component id
    public setCustomElement(): void {
        let oComponent:UIWebComponent = this;
         class UI5CustomElement extends HTMLElement {
            template: HTMLTemplateElement;
            context: UIWebComponentInterface;
            shadowRoot: ShadowRoot;
            cssLinks: string;

            constructor() {
                super();
                const compId: string = this.getAttribute("componentId") || "";
                this.context = <any> sap.ui.getCore().getComponent(compId);
                if (this.context) {
                    this.cssLinks = this.context.copyCurentSAPCss();
                    this.cssLinks += this.context.getComponentCustomCssLink();
                    this.setTemplate();
                    if (this.context.getProperty("shadowDom")) {
                        this.setShadowDom(this.context.getProperty("shadowDom"))
                    }
                } else if (this.parentNode) {
                    // id comp id is not attached as attribute, do not create element
                    this.parentNode.removeChild(this)
                }

            }

            setTemplate(): void {
                this.template = document.createElement('template');
                this.template.innerHTML = this.cssLinks + `<slot></slot>`
            }

            setShadowDom(shadowDom: "open" | "closed"): void {
                this.attachShadow({mode: shadowDom});
                if (this.template && this.context && this.context.getAggregation("shadowDom", [])) {
                    const oRM = sap.ui.getCore().createRenderManager();
                    const oAggregation = this.context.getAggregation("shadowDom", []);
                    if (oAggregation && !Array.isArray(oAggregation)) {
                        this.template.innerHTML = this.cssLinks + oRM.getHTML(<sap.ui.core.Control> oAggregation);
                    }
                    this.shadowRoot.appendChild(this.template.content.cloneNode(true));
                    oRM.destroy();
                }
            }

            attributeChangedCallback(name: string, oldValue: string, newValue: string): void {
                if (this.context && this.context.attributeChangedCallback) {
                    this.context.attributeChangedCallback(name, oldValue, newValue)
                }
            }

            static get observedAttributes(): Array<string> {
                return oComponent.getProperty("observedAttributes") ? oComponent.getProperty("observedAttributes") : [];
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
            const allInstances: Array<HTMLElement> = Array.from(document.querySelectorAll(this.getProperty("htmlTag")));
            allInstances.map((item: UI5CustomElementInterface) => {
                if (item.getAttribute("componentId") === this.getId()) {
                    this.customElement = item;
                }
            })
        });


    }
}

