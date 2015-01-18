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

    .factory('MyCollection', function (Siesta) {
        return Siesta.collection('MyCollection');
    })

    .factory('MyModel', function (MyCollection) {
        return MyCollection.model('MyModel', {
            attributes: ['bar']
        });
    })

    .controller('ctrl', function (Siesta, $rootScope, MyModel) {
        MyModel.listen(function (e) {
            // Test that we're in the $digest cycle.
            if (!$rootScope.$$phase) {
                console.error('Should be in $digest')
            }
            console.log('Event', e);
        });

        MyModel.map({
            bar: 'foo'
        }).then(function (instance) {
            instance.bar = 'baz';
        });
    });
