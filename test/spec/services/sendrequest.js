'use strict';

describe('Service: SendRequest', function () {

  // load the service's module
  beforeEach(module('myappApp'));

  // instantiate service
  var SendRequest;
  beforeEach(inject(function (_SendRequest_) {
    SendRequest = _SendRequest_;
  }));

  it('should do something', function () {
    expect(!!SendRequest).toBe(true);
  });

});
