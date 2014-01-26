'use strict';

describe('Service: ExtendFacebookFriends', function () {

  // load the service's module
  beforeEach(module('myappApp'));

  // instantiate service
  var ExtendFacebookFriends;
  beforeEach(inject(function (_ExtendFacebookFriends_) {
    ExtendFacebookFriends = _ExtendFacebookFriends_;
  }));

  it('should do something', function () {
    expect(!!ExtendFacebookFriends).toBe(true);
  });

});
