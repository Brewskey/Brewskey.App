angular.module('tappt.services')
    .factory('softAP', ['$q', '$timeout',
    function ($q, $timeout) {
        var sap = new SoftAPSetup({ 'host': '192.168.0.1', 'protocol': 'http', 'timeout': '5000' });
        function resolveWithPromise(callback) {
            return function (params) { return $q(function (resolve, reject) {
                var argArray = [];
                if (params) {
                    argArray.push(params);
                }
                argArray.push(function (err, result) {
                    if (err) {
                        reject(err);
                        return;
                    }
                    resolve(result);
                });
                callback.apply(sap, argArray);
            }); };
        }
        function queryDevice(resolve, error) {
            softAP.deviceInfo().then(resolve).catch(function (err) {
                $timeout(function () {
                    queryDevice(resolve);
                }, 2000);
            });
        }
        var softAP = {
            configure: resolveWithPromise(sap.configure),
            connect: resolveWithPromise(sap.connect),
            deviceInfo: resolveWithPromise(sap.deviceInfo),
            deviceReady: function (error) { return $q(queryDevice, error); },
            publicKey: resolveWithPromise(sap.publicKey),
            scan: resolveWithPromise(sap.scan),
            securityLookup: sap.securityLookup,
            setClaimCode: resolveWithPromise(sap.setClaimCode),
        };
        return softAP;
    }]);

