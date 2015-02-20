'use strict';

describe('jqlite helpers', function() {
  beforeEach(module('duScroll'));

  describe('scrollTopAnimated', function() {
    var duration = 100;

    it('should return a promise', inject(function($document, $q, $rootScope) {
      var deferred = $q.defer();
      var promise = $document.scrollTopAnimated(100, duration);
      expect(promise).toEqual(jasmine.any(Object));
      expect(Object.keys(promise)).toEqual(Object.keys(deferred.promise));

      it('which should resolve when done animating', function(done){
        spyOn(promise, 'then');
        $rootScope.$digest();
        setTimeout(function() {
          expect(promise.then).toHaveBeenCalled();
          done();
        }, duration*1.5);
      });
    }));

    it('should cancel previous animation', function(done){inject(function($document, $rootScope) {
      var rejected = false;
      $document.scrollTopAnimated(200, duration)
      .catch(function() {
        rejected = true;
      })
      .finally(function() {
        expect(rejected).toEqual(true);
        done();
      });
      $document.scrollTopAnimated(300, duration);
      $rootScope.$digest();
    })});
  });
});
