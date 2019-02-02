import Opa5 from "sap/ui/test/Opa5";
import MockServer from "../localService/mockserver";
@UI5("ui5.testApp.test.Commpn")
export default class Common extends Opa5{

    private getFrameUrl (sUrlParameters:string):string {
        const sUrl ="http://localhost:3000/test/mockServer.html";
        sUrlParameters = sUrlParameters ? "?" + sUrlParameters : "";
        return sUrl + sUrlParameters;
    }

    public iStartTheApp():void {
        // Start the app with a minimal delay to make tests run fast but still async to discover basic timing issues
        this.iStartMyAppInAFrame(this.getFrameUrl("serverDelay=50"));
    }

    public iStartTheAppWithDelay(sHash:string, iDelay:number):void {

        this.iStartMyAppInAFrame(this.getFrameUrl("serverDelay=" + iDelay));
    }

    public iLookAtTheScreen():object {
        return this;
    }

    public getMockServer():object{
        return new Promise(function (success) {
            // @ts-ignore
            Opa5.getWindow().sap.ui.require(["ui5/testApp/localService/mockserver"], function (mockserver: MockServer) {
                success(mockserver.getMockServer());
            });
        });
    }

}