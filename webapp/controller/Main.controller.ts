import BaseController from "./BaseController";
import JSONModel from "sap/ui/model/json/JSONModel";

@UI5("ui5.testApp.controller.Main")
export default class MainController extends BaseController {

    public onInit(): void {
        let oViewModel: JSONModel;

        oViewModel = new JSONModel({
            busy: true,
            delay: 0,
            test:"kkk"
        });
        this.setModel(oViewModel, "appView");

    }

    public standardPress(oEvent):void{
        this.getModel("appView").setProperty("/test", "changed")
        console.log(oEvent.getSource().getEventingParent())
        console.log(oEvent.getSource().getUIArea())
    }

}