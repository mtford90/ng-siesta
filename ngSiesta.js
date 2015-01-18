'use strict';

angular.module('ngSiesta', [])
    .run(function ($window, $q, $rootScope, $exceptionHandler) {
        siesta.q = $q;

        var oldEmit = $window.siesta._internal.events.emit;
        $window.siesta._internal.events.emit = function () {
            var args = arguments;
            // http://stackoverflow.com/questions/12729122/prevent-error-digest-already-in-progress-when-calling-scope-apply
            if (!$rootScope.$$phase) {
                $rootScope.$apply(function () {
                    oldEmit.apply($window.siesta._internal.events, args);
                });
            }
            else {
                try {
                    oldEmit.apply($window.siesta._internal.events, args);
                }
                catch (error) {
                    $exceptionHandler(error);
                }
            }
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
            // Test that we're in the $digest cycle.
            if (!$rootScope.$$phase) {
                console.error('Should be in $digest')
            }
            console.log('Event', e);
        });

        M.map({
            bar: 'foo'
        }).then(function (model) {
            model.bar = 'baz';
        });
    });
