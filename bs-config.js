var express = require('express');
var app = express();
var glob = require("glob");

const parseFiles = (files,view) =>{
    let finalFiles = [];
    files.map((file)=>{
        if(!(view && file.indexOf("view")>-1)) {
            file = file.replace(".ts", "");
            file = file.replace("webapp", "ui5/testApp");
            finalFiles.push(file)
        }
    })
    return finalFiles;
}

app.get('/', function (req, res) {
    res.sendFile(__dirname +  "/webapp/" +"index.html" );
})

app.get('/admin', function (req, res) {
    res.sendFile( __dirname + "/src/" + "admin.html" );
})

app.get('/opa5', function (req, res) {
    ///search each time for files
    let finalObject = {
        test:[],
        view:[]
    }
    glob("webapp/view/*.opa5.spec.ts", null, function (er, files) {
        finalObject.view = parseFiles(files);
        glob("*.opa5.spec.ts", {matchBase:true}, function (er, files) {
            finalObject.test = parseFiles(files, "view");
            res.send(finalObject);
        })
    })
})

app.get('/qunit', function (req, res) {
    ///search each time for files
    glob("**/*.qunit.spec.ts", {matchBase:true}, function (er, files) {
        res.send(parseFiles(files));
    })
})

module.exports = {
    "port": 3000,
    "server": {
        "baseDir": "webapp",
        "routes": {
            "/node_modules": "node_modules",
            "/resources": "resources",

            "/testList": "testList"
        },

        middleware: {
            1: app,
        }
    }
    }
