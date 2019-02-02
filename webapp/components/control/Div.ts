import DivRenderer from "./DivRenderer";
import FlexBox from "sap/m/FlexBox";
@UI5("ui5.testApp.components.control.Div")
export default class Div  extends FlexBox{

    public static metadata: any = {
        properties: {
            slot: {type: "string", defaultValue: null},
        }
    };

    public getSlot():string{
        return this.getProperty("slot")
    }

}