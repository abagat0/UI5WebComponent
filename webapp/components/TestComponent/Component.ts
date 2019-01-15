import UIWebComponent from "ui5/testApp/components/UIWebComponent";
import JSONModel from "sap/ui/model/json/JSONModel";
import RenderManager from "sap/ui/core/RenderManager";

@UI5("ui5.testApp.components.TestComponent.TestComponent")
export default class TestComponent extends UIWebComponent {
    template: object;

    // defining custom properties, in the end will be joined with those from UIWebComponent class
   public static metadata: any = {
       manifest:"json",
       properties :{
           pro : {type : "string", defaultValue : "{/message}", bindable: true},
           message : {type : "string", defaultValue : "{/message}", bindable: true}
        }
    };

    public init(): void {
        super.init.apply(this, arguments);
        this.setModel(new JSONModel({message: "start message"}))

    }

    // custom properties setters
    public setPro(pro:string):object{
        this.setProperty("pro", pro);
        this.setAttribute("pro", pro)
        return this;
    }

    public setMessage(message:string):object{
        this.setProperty("message", message);
        this.setAttribute("message", message)
        return this;
    }

    // custom element method that take care of attribute changes
    public attributeChangedCallback(name:string, oldValue:string, newValue:string){
        console.log(name, oldValue , newValue)
    }

    // custom element can de defined / attached only when we have access to properties, that's why we cannot do it in init method
    public onBeforeRendering():void{
        if(!this.oContent) {
            this.renderContent();
        }

        // tbd run html file with UI5 controls
        if(!this.customElement && this.oContent) {

            //attach all models to fragment that you want to use
            this.oContent.setModel(this.getModel())

            // copy/attach css
            let cssLinks = "";
            if(this.getProperty("shadowDom")){
                cssLinks = this.copyCurentSAPCss();
            }
            cssLinks += this.getComponentCustomCssLink();

            // create html template that will be custom element initialization
            this.template = document.createElement('template');
            this.template.innerHTML = cssLinks + `
                     <div></div>
                     <slot name="test"></slot>                 
                     <slot name="secondTest"></slot>
                     <div>last</div>
                  `;
            // finally create custom element
            this.setCustomElement(this.getProperty("htmlTag"), this.getProperty("observedAttributes"), this.template, this.getProperty("shadowDom"));
        }
    }

    public connectedCallback(element: object):void{
        const slot = element.shadowRoot.querySelector('slot');
        slot.addEventListener('slotchange', e => {
            console.log('light dom children changed!');
        });
    }


    // hander for pressing button on xml template
    public handlePress(oEvent: object): void {
        this.getModel().setProperty("/message", "changed");
    }

    public render(oRenderManager: RenderManager):void {

        // convenience variable
        const oRM = oRenderManager;
        const oComponent = this;
        oRM.write("<div ");
        oRM.write(oComponent.getId())
        oRM.writeClasses();
        oRM.write("><");

        // call custom element tag
        oRM.write(oComponent.getProperty("htmlTag"));
        // change propeties to attributes
        oComponent.writeProperties(oRM)
        // pass componentId, it's very important, without that custom element and component cannot find/update each other
        oRM.writeAttribute("componentId",oComponent.getId())

        // pass resolver to begining template (if it was sth declared), if there were slots then call slot=' slot name ' to navigate browser where place it
        oRM.write("><div slot='test' >"+
            oRM.getHTML(oComponent.oContent)+
            "</div><div slot='secondTest'>second</div></"+
            // close custom element tag
            oComponent.getProperty("htmlTag")+
            "></div></div>");
    };
}