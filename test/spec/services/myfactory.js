'use strict';

describe('Service: MyFactory', function () {

  // load the service's module
  beforeEach(module('myappApp'));

  // instantiate service
  var MyFactory;
  beforeEach(inject(function (_MyFactory_) {
    MyFactory = _MyFactory_;
  }));

  it('should do something', function () {
    expect(!!MyFactory).toBe(true);
  });

});
