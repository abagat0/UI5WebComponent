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
        }, false);
        this.setModel(oViewModel, "appView");

    }

    public standardPress(oEvent: sap.ui.base.Event):void{
        const oModel: JSONModel =  <JSONModel> this.getModel("appView");
        oModel.setProperty("/test", "changed")
    }

}