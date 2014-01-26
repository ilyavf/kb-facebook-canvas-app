'use strict';

describe('Controller: Step3Ctrl', function () {

  // load the controller's module
  beforeEach(module('myappApp'));

  var Step3Ctrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    Step3Ctrl = $controller('Step3Ctrl', {
      $scope: scope
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(scope.awesomeThings.length).toBe(3);
  });
});
