'use strict';

describe('Service: UserRequests', function () {

  // load the service's module
  beforeEach(module('myappApp'));

  // instantiate service
  var UserRequests;
  beforeEach(inject(function (_UserRequests_) {
    UserRequests = _UserRequests_;
  }));

  it('should do something', function () {
    expect(!!UserRequests).toBe(true);
  });

});
