import UIWebComponentInterface from "ui5/testApp/types/UIWebComponentInterface";

export default interface
UI5CustomElementInterface extends HTMLElement{
    template: HTMLTemplateElement;
    context: UIWebComponentInterface;
    shadowRoot: ShadowRoot;
    cssLinks: string;
}