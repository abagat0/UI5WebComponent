import UIWebComponent from "ui5/testApp/components/UIWebComponent";
import JSONModel from "sap/ui/model/json/JSONModel";
import RenderManager from "sap/ui/core/RenderManager";
import Element from "sap/ui/core/Element";
import UI5CustomElementInterface from "ui5/testApp/types/UI5CustomElementInterface"
// @ts-ignore
Element.prototype.getDomRef = function (sSuffix) {
    let DomRef = (((sSuffix ? this.getId() + "-" + sSuffix : this.getId())) ? window.document.getElementById(sSuffix ? this.getId() + "-" + sSuffix : this.getId()) : null);
    if (!DomRef && this.getModel("settingsModel")) {
        const oComponent=  <UIWebComponent> sap.ui.getCore().getComponent(this.getModel("settingsModel").getProperty("/compId"));
        const customElement = oComponent.customElement;
        if (sSuffix && customElement && customElement.shadowRoot) {
            DomRef = customElement.shadowRoot.querySelector("#" + this.getId() + "-" + sSuffix);
        } else if (customElement && customElement.shadowRoot) {
            DomRef =  customElement.shadowRoot.querySelector("[id*='" + this.getId() + "']");
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
        const _that:TestComponent = this;
        const oData:Array<object> = [
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

        let oModel:JSONModel = new JSONModel({message: "start message", compID: _that.getId(), products: oData}, false)
        this.setModel(oModel)

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
            this.setCustomElement();
        }
    }

    public connectedCallback(element: UI5CustomElementInterface): void {

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

            const htmlElment:string = <any>element.shadowRoot.querySelector("div") || "";
            jQuery(htmlElment).bind("click", element.context.handleEvents)


            const slot:HTMLSlotElement | null = element.shadowRoot.querySelector('slot');
            if (slot) {
                slot.addEventListener('slotchange', (e:Event) => {
                    console.log('light dom children changed!');

                });
            }
        }
    }

    public disconnectedCallback(element: UI5CustomElementInterface):void{
        if(element.shadowRoot){
            const htmlElement:string = <any>element.shadowRoot.querySelector("div") || "";
            jQuery(htmlElement).unbind("click", element.context.unbindEvents)
        }
    }

    public handleEvents(oEvent: Event):void {
        if(oEvent.target) {
            const event = <any>jQuery(oEvent.target);

            if (event.control(0) && event.control(0).getModel("settingsModel") && event.control(0).mEventRegistry["press"]
                && (event.control(0).getProperty("enabled") === undefined || event.control(0).getProperty("enabled") === true)) {
                event.control(0).firePress();
            }
        }
    }

    public unbindEvents(oEvent: Event): void{
        console.log(oEvent)
    }

    // hander for pressing button on xml template
    public handlePress(oEvent: sap.ui.base.Event): void {
        const oModel:JSONModel = <JSONModel> this.getModel();
        oModel.setProperty("/message", "changed" + new Date().getTime());
        oModel.updateBindings(true);
        this.setProperty("xmlTemplateLightDom", "changed" + new Date().getTime())
    }

    public onToggleInfoToolbar(oEvent:sap.ui.base.Event) {
        const oTable:sap.m.Table = <sap.m.Table>this.byId("idProductsTable");
        const oToolbar:sap.m.Toolbar = oTable.getInfoToolbar();
        (<any>oToolbar).setProperty("visible", !(<any>oToolbar).getProperty("visible"));
    }

    public render(oRenderManager: RenderManager): void {
        const oRM: RenderManager = oRenderManager;
        const oComponent: TestComponent = this;
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
        const oAggregation:sap.ui.core.Control | [] = <any>this.getAggregation("lightDom", []);
        if (oAggregation && !Array.isArray(oAggregation) &&  (<any>oAggregation).getItems && Array.isArray((<any>oAggregation).getItems())){
            (<any>oAggregation).getItems().map((oControl: sap.ui.core.Control) => {
                oRM.write(oRM.getHTML(oControl))
            })
        } else if (!Array.isArray(oAggregation)) {
            oRM.write(oRM.getHTML(oAggregation))
        }
        oRM.write("<" +
            oComponent.getProperty("htmlTag") +
            "></div>")
    };
}
