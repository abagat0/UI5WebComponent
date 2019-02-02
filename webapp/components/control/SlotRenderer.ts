import Control from "sap/ui/core/Control";
import Renderer from "sap/ui/core/Renderer";
import RenderManager from "sap/ui/core/RenderManager";
import Slot from "./Slot";
const oRenderer = Renderer.extend("ui5.testApp.components.control.DivRenderer")
@UI5("ui5.testApp.components.control.SlotRenderer")
export default class SlotRenderer extends oRenderer {

    public render(oRM: RenderManager, oSlot: Slot): void {
        oRM.write("<slot")
        oRM.writeControlData(oSlot)
        oRM.writeAttribute("name", oSlot.getName())
        oRM.write("/>")
    }
}