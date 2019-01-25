import Control from "sap/ui/core/Control";
import Renderer from "sap/ui/core/Renderer";
import RenderManager from "sap/ui/core/RenderManager";
import FlexBoxRenderer from "sap/m/FlexBoxRenderer";

@UI5("ui5.testApp.components.control.DivRenderer")
export default class DivRenderer extends Renderer {

    public render(oRM: RenderManager, oDiv: Control): void {
        oRM.write("<div")
        oRM.writeControlData(oDiv)
        if(oDiv.getSlot()) {
            oRM.writeAttribute("slot", oDiv.getSlot())
        }
        oRM.write(">")
        FlexBoxRenderer.renderItems(oDiv, oRM);
        oRM.write("</div>")
    }
}