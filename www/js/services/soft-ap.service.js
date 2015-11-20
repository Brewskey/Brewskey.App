angular.module('tappt.services')
    .factory('softAP', ['$q',
    function ($q) {
        var sap = new SoftAPSetup();

        function resolveWithPromise(callback) {
            return function(params) {
                return $q(function (resolve, reject) {
                    var argArray = [];
                    if (params) {
                        argArray.push(params);
                    }
                    argArray.push(function(err, result) {
                        if (err) {
                            reject(err);
                            return;
                        }

                        resolve(result);
                    });
                    callback.apply(null, argArray);
                });
            }
        }

        return {
            configure: resolveWithPromise(sap.configure),
            connect: resolveWithPromise(sap.connect),
            deviceInfo: resolveWithPromise(sap.deviceInfo),
            publicKey: resolveWithPromise(sap.publicKey),
            scan: resolveWithPromise(sap.scan),
            setClaimCode: resolveWithPromise(sap.setClaimCode),
        };
    }]);
