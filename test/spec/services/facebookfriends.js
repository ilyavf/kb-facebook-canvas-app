'use strict';

describe('Service: FacebookFriends', function () {

  // load the service's module
  beforeEach(module('myappApp'));

  // instantiate service
  var FacebookFriends;
  beforeEach(inject(function (_FacebookFriends_) {
    FacebookFriends = _FacebookFriends_;
  }));

  it('should do something', function () {
    expect(!!FacebookFriends).toBe(true);
  });

});
