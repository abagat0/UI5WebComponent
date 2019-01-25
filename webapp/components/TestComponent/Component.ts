import UIWebComponent from "ui5/testApp/components/UIWebComponent";
import JSONModel from "sap/ui/model/json/JSONModel";
import RenderManager from "sap/ui/core/RenderManager";
import Element from "sap/ui/core/Element";
import Core from "sap/ui/core/Core"

Element.prototype.getDomRef = function (sSuffix) {
    let DomRef = (((sSuffix ? this.getId() + "-" + sSuffix : this.getId())) ? window.document.getElementById(sSuffix ? this.getId() + "-" + sSuffix : this.getId()) : null);
    if (!DomRef && this.getModel("settingsModel")) {
        let oComponent = sap.ui.getCore().getComponent(this.getModel("settingsModel").oData.compId);
        if (sSuffix && oComponent.customElement) {
            DomRef = oComponent.customElement.shadowRoot.querySelector("#" + this.getId() + "-" + sSuffix);
        } else if (oComponent.customElement) {
            DomRef = oComponent.customElement.shadowRoot.querySelector("[id*='" + this.getId() + "']");
        }
    }
    return DomRef;
};

@UI5("ui5.testApp.components.TestComponent.TestComponent")
export default class TestComponent extends UIWebComponent {
    // defining custom properties, in the end will be joined with those from UIWebComponent class
    public static metadata: any = {
        manifest: "json",
        properties: {
            pro: {type: "string", defaultValue: "{/message}", bindable: true},
            message: {type: "string", defaultValue: "{/message}", bindable: true}
        }
    };

    public init(): void {
        super.init.apply(this, arguments);
        const _that = this;
        const oData = [
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
            }]

        this.setModel(new JSONModel({message: "start message", compID: _that.getId(), products: oData}))

    }

    // custom properties setters
    public setPro(pro: string): object {
        this.setProperty("pro", pro);
        this.setAttribute("pro", pro)
        return this;
    }

    public setMessage(message: string): object {
        this.setProperty("message", message);
        this.setAttribute("message", message)
        return this;
    }

    // custom element method that take care of attribute changes
    public attributeChangedCallback(name: string, oldValue: string, newValue: string) {
        console.log(name, oldValue, newValue)
    }

    // custom element can de defined / attached only when we have access to properties, that's why we cannot do it in init method
    public onBeforeRendering(): void {
        if (!this.customElement) {
            //  create custom element


            this.setCustomElement();
        }
    }

    public connectedCallback(element: object): void {

        if (element.shadowRoot) {
            let events = [
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

            jQuery(element.shadowRoot.querySelector("div")).bind("click", element.context.handleEvents)

            const slot = element.shadowRoot.querySelector('slot');
            if (slot) {
                slot.addEventListener('slotchange', e => {
                    console.log('light dom children changed!');

                });
            }
        }
    }

    public disconnectedCallback(element:HTMLElement):void{
        if(element.shadowRoot){
            jQuery(element.shadowRoot.querySelector("div")).unbind("click", element.context.unbindEvents)
        }
    }

    public handleEvents(oEvent:object):void {
        const control = jQuery(oEvent.target).control(0);

        if (control && control.getModel("settingsModel") && control.mEventRegistry["press"]
           && (control.getProperty("enabled") === undefined || control.getProperty("enabled")===true)) {
            control.firePress();
        }
    }

    public unbindEvents(oEvent: object): void{
        console.log(oEvent)
    }

    // hander for pressing button on xml template
    public handlePress(oEvent: object): void {
        this.getModel().setProperty("/message", "changed" + new Date().getTime());
        this.getModel().updateBindings();
        this.setProperty("xmlTemplateLightDom", "changed" + new Date().getTime())
    }

    public onToggleInfoToolbar(oEvent) {
        var oTable = this.byId("idProductsTable");
        oTable.getInfoToolbar().setProperty("visible", !oTable.getInfoToolbar().getProperty("visible"));
    }

    public render(oRenderManager: RenderManager): void {
        const oRM = oRenderManager;
        const oComponent = this;
        oRM.write("<div ");
        oRM.write(oComponent.getId())
        oRM.writeClasses();
        oRM.write(">")
        oRM.write("<");

        // call custom element tag
        oRM.write(oComponent.getProperty("htmlTag"));
        // change propeties to attributes
        oComponent.writeProperties(oRM)
        // pass componentId, it's very important, without that custom element and component cannot find/update each other
        oRM.writeAttribute("componentId", oComponent.getId())
        oRM.write(">")
        // check if aggregation has chilren
        if (this.getAggregation("lightDom") && this.getAggregation("lightDom").getItems() && Array.isArray(this.getAggregation("lightDom").getItems()){
            this.getAggregation("lightDom").getItems().map((oControl) => {
                oRM.write(oRM.getHTML(oControl))
            })
        } else if (this.getAggregation("lightDom")) {
            oRM.write(oRM.getHTML(this.getAggregation("lightDom")))
        }
        oRM.write("<" +
            oComponent.getProperty("htmlTag") +
            "></div>")
    };
}
