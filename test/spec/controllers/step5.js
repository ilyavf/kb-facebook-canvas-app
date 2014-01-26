'use strict';

describe('Controller: Step5Ctrl', function () {

  // load the controller's module
  beforeEach(module('myappApp'));

  var Step5Ctrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    Step5Ctrl = $controller('Step5Ctrl', {
      $scope: scope
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(scope.awesomeThings.length).toBe(3);
  });
});
