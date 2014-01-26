'use strict';

describe('Controller: EventcontrollerCtrl', function () {

  // load the controller's module
  beforeEach(module('myappApp'));

  var EventcontrollerCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    EventcontrollerCtrl = $controller('EventcontrollerCtrl', {
      $scope: scope
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(scope.awesomeThings.length).toBe(3);
  });
});
