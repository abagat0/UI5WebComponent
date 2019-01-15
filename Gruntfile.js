"use strict";

module.exports = function (grunt) {

    require("jit-grunt")(grunt, {
        configureProxies: "grunt-connect-proxy"
    });
    // Project properties
    var webAppDir = "webapp";
    var targetDir = "target";
    var tmpDir = targetDir + "/tmp";
    var tmpDirDbg = targetDir + "/tmp-dbg";
    var tmpDirUglified = targetDir + "/tmp-uglified";
    var zipFileSuffix = ".zip";
    var zipFileUglifiedSuffix = "-uglified.zip";
    var preloadPrefix = "target/tmp";

    //Upload Credentials
    var sUser = grunt.option("user");
    var sPwd = grunt.option("pwd");
    var sPackage = grunt.option("pkg") === undefined ? "$TMP" : grunt.option("pkg");
    var sTransportNo = grunt.option("trs") === undefined ? "" : grunt.option("trs");
    var sBspContainer = grunt.option("name");
    var sCText = grunt.option("text");

    // Project configuration.
    grunt.initConfig({
        pkg: grunt.file.readJSON("package.json"),
        clean: {
            build: [targetDir]
        },
        encoding: {
            options: {
                encoding: "UTF8"
            },
            files: {
                src: [webAppDir + "/**/*.js", webAppDir + "/**/*.css",
                    webAppDir + "/**/*.xml", webAppDir + "/**/*.json",
                    webAppDir + "/**/*.html", webAppDir + "/**/*.properties"]
            }
        },
        copy: {
            copyToUglified: {
                files: [
                    {
                        expand: true,
                        src: ["**/*.js", "!**/ui5resources/**/*"],
                        dest: tmpDirUglified,
                        cwd: webAppDir,
                        filter: function (filepath) {
                            return !filepath.match(new RegExp(webAppDir + "(\\/|\\\\)localService", "gi"));
                        }
                    },
                    {
                        expand: true,
                        src: ["**/*.css", "!**/ui5resources/**/*"],
                        dest: tmpDirUglified,
                        cwd: webAppDir
                    },
                    {
                        expand: true,
                        src: "localService/metadata.xml",
                        dest: tmpDirUglified,
                        cwd: webAppDir
                    },
                    {
                        expand: true,
                        src: ["**/*", "!**/ui5resources/**/*"],
                        dest: tmpDirUglified,
                        cwd: webAppDir,
                        filter: function (filepath) {
                            return !filepath.match(new RegExp("(" + webAppDir + "(\\/|\\\\)test|${webAppDir}(\\/|\\\\)localService|\\.js$|\\.css$|\\test.html$)", "gi"));
                        }
                    }]
            },
            copyToDbg: {
                files: [
                    {
                        expand: true,
                        src: ["**/*.js", "!**/ui5resources/**/*"],
                        dest: tmpDirDbg,
                        cwd: webAppDir,
                        filter: function (filepath) {
                            return !filepath.match(new RegExp(webAppDir + "(\\/|\\\\)localService", "gi"));
                        }
                    },
                    {
                        expand: true,
                        src: ["**/*.css", "!**/ui5resources/**/*"],
                        dest: tmpDirDbg,
                        cwd: webAppDir
                    },
                    {
                        expand: true,
                        src: "localService/metadata.xml",
                        dest: tmpDirDbg,
                        cwd: webAppDir
                    },
                    {
                        expand: true,
                        src: ["**/*", "!**/ui5resources/**/*"],
                        dest: tmpDirDbg,
                        cwd: webAppDir,
                        filter: function (filepath) {
                            return !filepath.match(new RegExp("(" + webAppDir + "(\\/|\\\\)test|${webAppDir}(\\/|\\\\)localService|\\.js$|\\.css$|\\test.html$)", "gi"));
                        }
                    }]
            },
            copyToTmp: {
                files: [
                    {
                        expand: true,
                        src: ["**/*.js", "!**/ui5resources/**/*"],
                        dest: tmpDir,
                        cwd: webAppDir,
                        filter: function (filepath) {
                            return !filepath.match(new RegExp(webAppDir + "(\\/|\\\\)localService", "gi"));
                        }
                    },
                    {
                        expand: true,
                        src: ["**/*.css", "!**/ui5resources/**/*"],
                        dest: tmpDir,
                        cwd: webAppDir
                    },
                    {
                        expand: true,
                        src: "localService/metadata.xml",
                        dest: tmpDir,
                        cwd: webAppDir
                    },
                    {
                        expand: true,
                        src: ["**/*", "!**ui5resources/**/*"],
                        dest: tmpDir,
                        cwd: webAppDir,
                        filter: function (filepath) {
                            return !filepath.match(new RegExp("(" + webAppDir + "(\\/|\\\\)test|${webAppDir}(\\/|\\\\)localService|\\.js$|\\.css$|\\test.html$)", "gi"));
                        }
                    }]
            },
            copyDbgToTmp: {
                files: [
                    {
                        expand: true,
                        src: "**/*.js",
                        dest: tmpDir,
                        cwd: tmpDirDbg,
                        rename: function (dest, src) {
                            return dest + "/" + src.replace(/((\.view|\.fragment|\.controller)?\.js)/, "-dbg$1");
                        }
                    },
                    {
                        expand: true,
                        src: "**/*.css",
                        dest: tmpDir,
                        cwd: tmpDirDbg,
                        rename: function (dest, src) {
                            return dest + "/" + src.replace(".css", "-dbg.css");
                        }
                    },
                    {
                        expand: true,
                        src: "localService/metadata.xml",
                        dest: tmpDir,
                        cwd: tmpDirDbg
                    },
                    {
                        expand: true,
                        src: "**/*",
                        dest: tmpDir,
                        cwd: tmpDirDbg,
                        filter: function (filepath) {
                            return !filepath.match(new RegExp("(" + webAppDir + "(\\/|\\\\)test|${webAppDir}(\\/|\\\\)localService|\\.js$|\\.css$|\\test.html$)", "gi"));
                        }
                    }]
            }
        },
        uglify: {
            uglifyTmp: {
                files: [
                    {
                        expand: true,
                        src: "**/*.js",
                        dest: tmpDir,
                        cwd: tmpDir,
                        filter: function (filepath) {
                            return !filepath.match(new RegExp(webAppDir + "(\\/|\\\\)localService", "gi"));
                        }
                    }]
            },
            uglifyTmpUglified: {
                files: [
                    {
                        expand: true,
                        src: "**/*.js",
                        dest: tmpDirUglified,
                        cwd: tmpDirUglified,
                        filter: function (filepath) {
                            return !filepath.match(new RegExp(webAppDir + "(\\/|\\\\)localService", "gi"));
                        }
                    }]
            },
            uglifyPreload: {
                files: [
                    {
                        expand: true,
                        src: tmpDir + "/Component-preload.js"
                    }]
            }
        },
        cssmin: {
            build: {
                files: [
                    {
                        expand: true,
                        src: "**/*.css",
                        dest: tmpDir,
                        cwd: webAppDir
                    }]
            }
        },
        zip: {
            normal: {
                cwd: tmpDir,
                src: tmpDir + "/**/*",
                dest: "./zip" + "/<%= pkg.name %>" + zipFileSuffix
            },
            uglified: {
                cwd: tmpDirUglified,
                src: tmpDirUglified + "/**/*",
                dest: "./zip" + "/<%= pkg.name %>" + zipFileUglifiedSuffix
            },

        },
        openui5_preload: {
            preloadDbg: {
                options: {
                    resources: {
                        cwd: tmpDirDbg,
                        src: ["**/*.js"],
                        prefix: preloadPrefix
                    },
                    compress: false,
                    dest: tmpDirDbg
                },
                components: true
            },
            preloadTmp: {
                options: {
                    resources: {
                        cwd: tmpDir,
                        src: ["**/*.js"],
                        prefix: preloadPrefix
                    },
                    compress: false,
                    dest: tmpDir
                },
                components: true
            },
            preloadUglified: {
                options: {
                    resources: {
                        cwd: tmpDirUglified,
                        src: ["**/*.js"],
                        prefix: preloadPrefix
                    },
                    compress: false,
                    dest: tmpDirUglified
                },
                components: true
            },
        },
        settings: {
            connect: {
                host: "localhost",
                port: "9555"
            },
            proxy: {
                host: "<HOST>",
                port: "<PORT>"
            }
        },

        connect: {
            options: {
                hostname: "<%= settings.connect.host %>",
                port: "<%= settings.connect.port %>",
                livereload: 35729,
                middleware: function (connect, options, defaultMiddleware) {
                    var aMiddlewares = [];
                    aMiddlewares.push(require("grunt-connect-proxy/lib/utils").proxyRequest);
                    aMiddlewares.push(defaultMiddleware);
                    return aMiddlewares;
                }
            },
            connectWebapp: {
                options: {
                    base: ["webapp"],
                    open: true
                }
            },
            proxies: [
                {
                    context: "/resources",
                    host: "<%= settings.proxy.host %>",
                    port: "<%= settings.proxy.port %>",
                    https: false,
                    rewrite: {
                        "/resources": "/sap/public/bc/ui5_ui5/resources"
                    }
                }, {
                    context: "/sap/opu/odata",
                    host: "<%= settings.proxy.host %>",
                    port: "<%= settings.proxy.port %>",
                    https: false
                }
            ]
        },

        watch: {
            options: {
                livereload: false
            },
            watchWebapp: {
                files: ["!webapp/ui5resources"]
            }
        },
        nwabap_ui5uploader: {
            options: {
                conn: {
                    server: '<SERVER>',
                },
                auth: {
                    user: sUser,
                    pwd: sPwd
                }
            },
            upload_build: {
                options: {
                    ui5: {
                        package: sPackage,
                        bspcontainer: sBspContainer,
                        bspcontainer_text: sCText,
                        transportno: sTransportNo
                    },
                    resources: {
                        cwd: 'target/tmp',
                        src: '**/*.*'
                    }
                }
            }
        }
    });

    grunt.loadNpmTasks("grunt-contrib-clean");
    grunt.loadNpmTasks("grunt-contrib-copy");
    grunt.loadNpmTasks("grunt-contrib-uglify");
    grunt.loadNpmTasks("grunt-contrib-cssmin");
    grunt.loadNpmTasks("grunt-encoding");
    grunt.loadNpmTasks("grunt-zip");
    grunt.loadNpmTasks("grunt-nwabap-ui5uploader");
    grunt.loadNpmTasks("grunt-openui5");

    grunt.registerTask("createZip", ["zip:normal"]);
    grunt.registerTask("createUglifiedZip", ["uglified", "zip:uglified"]);
    grunt.registerTask("uglified", ["copy:copyToUglified", "openui5_preload:preloadUglified", "uglify:uglifyTmpUglified"]);
    grunt.registerTask("serve", ["configureProxies:server", "connect:connectWebapp", "watch:watchWebapp"]);
    grunt.registerTask("upload", ["nwabap_ui5uploader"]);
    grunt.registerTask("default", ["clean", "copy:copyToDbg", "openui5_preload:preloadDbg", "copy:copyToTmp",
        "uglify:uglifyTmp", "cssmin", "openui5_preload:preloadTmp", "copy:copyDbgToTmp",
        "uglify:uglifyPreload"]);

};