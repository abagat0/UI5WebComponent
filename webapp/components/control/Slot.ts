import Control from "sap/ui/core/Control";
import RenderManager from "sap/ui/core/RenderManager";
import SlotRenderer from "./SlotRenderer";
@UI5("ui5.testApp.components.control.Slot")
export default class Slot  extends Control{

    public static metadata: any = {
        properties: {
            name: {type: "string", defaultValue: null},
        }
    };

}