define(["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = {
        getRequest: function (url) {
            return new Promise(function (resolve, reject) {
                var request = new XMLHttpRequest();
                request.onload = function () {
                    if (this.status === 200) {
                        resolve(this.response);
                    }
                    else {
                        reject(new Error(this.statusText));
                    }
                };
                request.onerror = function () {
                    reject(new Error('XMLHttpRequest Error: ' + this.statusText));
                };
                request.open('GET', url);
                request.send();
            });
        }
    };
});
//# sourceMappingURL=Helper.js.map