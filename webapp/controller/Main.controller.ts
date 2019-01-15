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

}