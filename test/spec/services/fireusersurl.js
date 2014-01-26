'use strict';

describe('Service: fireUsersUrl', function () {

  // load the service's module
  beforeEach(module('myappApp'));

  // instantiate service
  var fireUsersUrl;
  beforeEach(inject(function (_fireUsersUrl_) {
    fireUsersUrl = _fireUsersUrl_;
  }));

  it('should do something', function () {
    expect(!!fireUsersUrl).toBe(true);
  });

});
