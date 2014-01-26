'use strict';

describe('Controller: UserrequestscontrollerCtrl', function () {

  // load the controller's module
  beforeEach(module('myappApp'));

  var UserrequestscontrollerCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    UserrequestscontrollerCtrl = $controller('UserrequestscontrollerCtrl', {
      $scope: scope
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(scope.awesomeThings.length).toBe(3);
  });
});
