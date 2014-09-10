'use strict';

describe('service', function() {
  beforeEach(module('duScroll'));


  describe('requestAnimation', function() {
    it('should contain an requestAnimation service', inject(function(requestAnimation) {
      expect(requestAnimation).not.toBe(null);
    }));

    describe('callback', function() {
      var timerCallback;
      beforeEach(function() {
        timerCallback = jasmine.createSpy("timerCallback");
      });

      it('should be called within 100ms', function(done){inject(['requestAnimation',function(requestAnimation) {
        requestAnimation(timerCallback);
        expect(timerCallback).not.toHaveBeenCalled();
        setTimeout(function() {
          expect(timerCallback).toHaveBeenCalled();
          done();
        }, 100);
      }])});
    });
  });


  describe('scrollContainerAPI', function() {
    it('should contain an scrollContainerAPI service', inject(function(scrollContainerAPI) {
      expect(scrollContainerAPI).not.toBe(null);
    }));

    it('should default to $document', inject(['$rootScope', 'scrollContainerAPI', '$document' ,function($rootScope, containers, $document) {
      expect(containers.getContainer($rootScope)).toBe($document);
    }]));
  });


  describe('spyAPI', function() {
    it('should contain an spyAPI service', inject(function(spyAPI) {
      expect(spyAPI).not.toBe(null);
    }));

    it('should return $id when creating a context', inject(['$rootScope', 'spyAPI' ,function($rootScope, spyAPI) {
      expect(spyAPI.createContext($rootScope)).toBe($rootScope.$id);
    }]));

    it('should return a root context object by default', inject(['$rootScope', 'spyAPI' ,function($rootScope, spyAPI) {
      var testScope = $rootScope.$new();
      expect(spyAPI.getContextForScope(testScope)).toBe(spyAPI.getContextForScope($rootScope));
    }]));

    it('should not return default context if specified', inject(['$rootScope', 'spyAPI' ,function($rootScope, spyAPI) {
      var testScope = $rootScope.$new();
      spyAPI.createContext(testScope);
      expect(spyAPI.getContextForScope(testScope)).not.toBe(spyAPI.getContextForScope($rootScope));
    }]));

    it('should return parent scope context', inject(['$rootScope', 'spyAPI' ,function($rootScope, spyAPI) {
      var testScope = $rootScope.$new();
      var childScope = testScope.$new();
      expect(spyAPI.getContextForScope(childScope)).toBe(spyAPI.getContextForScope(testScope));
    }]));

    it('should return default context when destroyed', inject(['$rootScope', 'spyAPI' ,function($rootScope, spyAPI) {
      var testScope = $rootScope.$new();
      spyAPI.createContext(testScope);

      expect(spyAPI.getContextForScope(testScope)).not.toBe(spyAPI.getContextForScope($rootScope));

      spyAPI.destroyContext(testScope);

      expect(spyAPI.getContextForScope(testScope)).toBe(spyAPI.getContextForScope($rootScope));
    }]));
  });
});
