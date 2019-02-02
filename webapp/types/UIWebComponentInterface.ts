import UIWebComponent from "./../components/UIWebComponent";
import UI5CustomElementInterface from "./UI5CustomElementInterface"
export default interface
UIWebComponentInterface extends UIWebComponent {
    attributeChangedCallback(name: string, oldValue: string, newValue: string):void;
    connectedCallback(element:HTMLElement):void;
    disconnectedCallback(element:HTMLElement):void;
    adoptedCallback(element:HTMLElement):void;
    copyCurentSAPCss(): string;
    getComponentCustomCssLink(): string;
    updateAggregation(sName:string):void;
    handleEvents(oEvent: Event):void;
    unbindEvents(oEvent: Event):void;
    customElement: UI5CustomElementInterface;
    specialSettings: Array<string>;
}