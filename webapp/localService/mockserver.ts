import MockServer from "sap/ui/core/util/MockServer";

var oMockServer: MockServer,
    _sAppModulePath = "ui5/testApp/",
    _sJsonFilesModulePath = _sAppModulePath + "localService/mockdata";

export default {
    /**
     * Initializes the mock server.
     * You can configure the delay with the URL parameter "serverDelay".
     * The local mock data in this folder is returned instead of the real data for testing.
     * @public
     */
    init(): void {
        //TODO|openui5: getUriParameters parameter must be optional
        var oUriParameters = <any>jQuery.sap.getUriParameters(<string><any>undefined),
            //TODO|openui5: getModulePath 2nd parameter must be optional
            sJsonFilesUrl = jQuery.sap.getModulePath(_sJsonFilesModulePath, <string><any>undefined),
            sManifestUrl = jQuery.sap.getModulePath(_sAppModulePath + "manifest", ".json"),
            sEntity = "Objects",
            sErrorParam = oUriParameters.get("errorType"),
            iErrorCode = sErrorParam === "badRequest" ? 400 : 500,
            oManifest = (<any>jQuery.sap.syncGetJSON(sManifestUrl, undefined)).data,
            oMainDataSource = oManifest["sap.app"].dataSources.mainService,
            sMetadataUrl = <string><any>jQuery.sap.getModulePath(_sAppModulePath + oMainDataSource.settings.localUri.replace(".xml", ""), ".xml"),
            // ensure there is a trailing slash
            sMockServerUrl = /.*\/$/.test(oMainDataSource.uri) ? oMainDataSource.uri : oMainDataSource.uri + "/";

        //TODO|ui5ts: generate constructors (with overloads when there is an optional parameter followed by a required one)
        oMockServer = new MockServer();
        oMockServer.setRootUri(sMockServerUrl)

        // configure mock server with a delay of 1s
        MockServer.config({
            autoRespond : true,
            autoRespondAfter : (oUriParameters.get("serverDelay") || 1000)
        });

        oMockServer.simulate(sMetadataUrl, {
            sMockdataBaseUrl : sJsonFilesUrl,
            bGenerateMissingMockData : true
        });

        var aRequests = oMockServer.getRequests(),
            fnResponse = function (iErrCode: number, sMessage: string, aRequest: any) {
                aRequest.response = function(oXhr: any){
                    oXhr.respond(iErrCode, {"Content-Type": "text/plain;charset=utf-8"}, sMessage);
                };
            };

        // handling the metadata error test
        if (oUriParameters.get("metadataError")) {
            aRequests.forEach( function ( aEntry ) {
                if (aEntry.path.toString().indexOf("$metadata") > -1) {
                    fnResponse(500, "metadata Error", aEntry);
                }
            });
        }

        // Handling request errors
        if (sErrorParam) {
            aRequests.forEach( function ( aEntry ) {
                if (aEntry.path.toString().indexOf(sEntity) > -1) {
                    fnResponse(iErrorCode, sErrorParam, aEntry);
                }
            });
        }
        oMockServer.start();

        jQuery.sap.log.info("Running the app with mock data");
    },

    /**
     * @public returns the mockserver of the app, should be used in integration tests
     * @returns {sap.ui.core.util.MockServer} the mockserver instance
     */
    getMockServer(): MockServer {
        return oMockServer;
    }
};
