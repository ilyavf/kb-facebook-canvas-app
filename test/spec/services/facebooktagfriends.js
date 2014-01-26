'use strict';

describe('Service: FacebookTagFriends', function () {

  // load the service's module
  beforeEach(module('myappApp'));

  // instantiate service
  var FacebookTagFriends;
  beforeEach(inject(function (_FacebookTagFriends_) {
    FacebookTagFriends = _FacebookTagFriends_;
  }));

  it('should do something', function () {
    expect(!!FacebookTagFriends).toBe(true);
  });

});
