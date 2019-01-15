import UIComponent from "sap/ui/core/UIComponent";
import RenderManager from "sap/ui/core/RenderManager";
import XMLTemplateProcessor from "sap/ui/core/XMLTemplateProcessor";

@UI5("ui5.testApp.components.UIWebComponent")
export default class UIWebComponent extends UIComponent {
    customElement: HTMLElement;
    specialSettings: Array<string>;
    oContent: object;

    public static metadata: any = {
        properties: {
            observedAttributes: {type: "Array", defaultValue: []},
            cssUrl: {type: "string", defaultValue: null},
            xmlTemplate: {type: "string", defaultValue: null},
            shadowDom: {type: "string", defaultValue: null},
            htmlTag: {type: "string", defaultValue: null}
        }
    };

    // this array contains properties that will not be assigned as attributes in html representation
    public init(): void {
        this.specialSettings = ['observedAttributes', 'cssUrl', 'xmlTemplate', 'shadowDom', "htmlTag"]
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

    // render content from component.xml template, models are copied automatically to content
    public renderContent(): void {
        try {
            const oFragmentContent = XMLTemplateProcessor.loadTemplate(this.getProperty("xmlTemplate"), "component");
            this.oContent = sap.ui.xmlfragment({
                sId: this.getId(),
                fragmentContent: oFragmentContent,
                oController: this
            })
        } catch {
            throw "Cannot render content"
        }

    }

    // copy current loaded css links from ui5 config to custom element shadow dom
    public copyCurentSAPCss(): string {
        const loadedLibraries = Object.keys(sap.ui.getCore().getLoadedLibraries());
        let cssLinks = '';
        loadedLibraries.map((library: string) => {
            cssLinks += '<link rel="stylesheet" type="text/css" href="' +
                jQuery.sap.getResourcePath(library.replace(/\./g\ , "/"))+
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

    // create custom element class, in case already defined attach html instance by component id
    public setCustomElement(customElTag: string, obsAttr: Array<string>, template: any, shadowDom: string): void {

        class UI5CustomElement extends HTMLElement {
            template: any;
            context: any;
            shadowRoot: any;

            constructor() {
                super();
                this.context = sap.ui.getCore().getComponent(this.getAttribute("componentId"));
                this.setTemplate(template);
                if (shadowDom) {
                    this.setShadowDom(shadowDom)
                }
            }

            setTemplate(template: any): void {
                this.template = document.createElement('template');
                this.template.innerHTML = `<slot></slot>`
                if (template) {
                    this.template = template;
                }
            }

            setShadowDom(shadowDom: string): void {
                this.attachShadow({mode: shadowDom});
                if (this.template) {
                    this.shadowRoot.appendChild(this.template.content.cloneNode(true));
                }
            }

            attributeChangedCallback(name, oldValue, newValue): void {
                if (this.context && this.context.attributeChangedCallback) {
                    this.context.attributeChangedCallback(name, oldValue, newValue)
                }

            }

            static get observedAttributes(): Array<string> {
                return obsAttr;
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
            customElements.define(customElTag, UI5CustomElement);
        } catch {
        }

        // attach html instance to current ui5 component
        customElements.whenDefined(customElTag).then(() => {
            let allInstances: Array<HTMLElement> = Array.from(document.querySelectorAll(customElTag));
            allInstances.map((item: HTMLElement) => {
                if (item.getAttribute("componentId") === this.getId()) {
                    this.customElement = item;
                }
            })
        });


    }
}