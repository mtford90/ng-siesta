'use strict';

angular.module('ngSiesta', [])
.run(function($window) {
  $window.siesta.install(function() {
    console.log('installed');
  });
})
.service('Siesta', function($window) {
  return $window.siesta;
});

angular.module('siestaApp', ['ngSiesta'])
.controller('ctrl', function(Siesta) {

});
