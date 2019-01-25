import Control from "sap/ui/core/Control";
import Renderer from "sap/ui/core/Renderer";
import RenderManager from "sap/ui/core/RenderManager";

@UI5("ui5.testApp.components.control.SlotRenderer")
export default class SlotRenderer extends Renderer {

    public render(oRM: RenderManager, oSlot: Control): void {
        oRM.write("<slot")
        oRM.writeControlData(oSlot)
        oRM.writeAttribute("name", oSlot.getName())
        oRM.write("/>")
    }
}