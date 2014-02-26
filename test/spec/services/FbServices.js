'use strict';

describe('Service: FbServices', function () {

  // load the service's module
  beforeEach(module('myappApp'));

  // instantiate service
  var FbServices;
  beforeEach(inject(function (_FbServices_) {
    FbServices = _FbServices_;
  }));

  it('should do something', function () {
    expect(!!FbServices).toBe(true);
  });

});
