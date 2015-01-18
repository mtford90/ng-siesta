'use strict';

angular.module('ngSiesta', [])
.run(function($window, $q, $rootScope) {
  $window.q = $q;

  $window.siesta.install().then(function() {
    console.log('installed');
  });

  /**
   * Things that don't work for emiting events
   */

  // $window.siesta._internal.events.on('siesta', function(e) {
  //   console.log(e);
  // });

  // $window.siesta.on('siesta', function(e) {
  //   console.log(e);
  // });

  // var oldOn = $window.siesta._internal.events.on;
  // $window.siesta._internal.events.on = function (event, fn) {
  //     console.log(event);
  //     // oldOn.call($window.siesta._internal.events.on, event, function (e) {
  //     //     $rootScope.$apply(function() {
  //     //         fn(e);
  //     //     });
  //     // });
      
  //     /**
  //      * The following errors out with:
  //      * Error: [$rootScope:inprog] $apply already in progress
  //      */
  //     // $rootScope.$apply(function() {
  //     //   oldOn.call($window.siesta._internal.events.on, event, function(e) {
  //     //     fn(e);
  //     //   });
  //     // });
  // };
})
.service('Siesta', function($window) {
  return $window.siesta;
});

angular.module('siestaApp', ['ngSiesta'])
.controller('ctrl', function(Siesta, $rootScope) {


  var C = Siesta.collection('foo'),
      M = C.model('m', {
        attributes: ['bar']
      });

  C.listen(function(e) {
    console.log(e);
  });

  M.listen(function(e) {
    console.log(e);
  });

  M.map({
    bar: 'foo'
  })
  .then(function(model) {
    // console.log(err);
    model.bar = 'baz';
  });
});
