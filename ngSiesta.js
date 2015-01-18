'use strict';

angular.module('ngSiesta', [])
    .run(function ($window, $q, $rootScope, $exceptionHandler) {
        $window.q = $q;

        $window.siesta._internal.events.on('siesta', function (e) {
            console.log(e);
        });

        $window.siesta.on('siesta', function (e) {
            console.log(e);
        });

        var oldOn = $window.siesta._internal.events.on;
        $window.siesta._internal.events.on = function (event, fn) {
            oldOn.call($window.siesta._internal.events, event, function (e) {
                // http://stackoverflow.com/questions/12729122/prevent-error-digest-already-in-progress-when-calling-scope-apply
                if (!$rootScope.$$phase) {
                    $rootScope.$apply(function () {
                        fn(e);
                    });
                }
                else {
                    try {
                        fn(e);
                    }
                    catch (error) {
                        $exceptionHandler(error);
                    }
                }
            });
        };
    })
    .service('Siesta', function ($window) {
        return $window.siesta;
    });

angular.module('siestaApp', ['ngSiesta'])
    .controller('ctrl', function (Siesta, $rootScope) {
        var C = Siesta.collection('foo'),
            M = C.model('m', {
                attributes: ['bar']
            });

        M.listen(function (e) {
            console.log(e);
        });

        M.map({
            bar: 'foo'
        }).then(function (model) {
            model.bar = 'baz';
        });
    });
