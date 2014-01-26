'use strict';

describe('Controller: Receiverstep1Ctrl', function () {

  // load the controller's module
  beforeEach(module('myappApp'));

  var Receiverstep1Ctrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    Receiverstep1Ctrl = $controller('Receiverstep1Ctrl', {
      $scope: scope
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(scope.awesomeThings.length).toBe(3);
  });
});
