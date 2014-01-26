'use strict';

describe('Service: FriendReceivers', function () {

  // load the service's module
  beforeEach(module('myappApp'));

  // instantiate service
  var FriendReceivers;
  beforeEach(inject(function (_FriendReceivers_) {
    FriendReceivers = _FriendReceivers_;
  }));

  it('should do something', function () {
    expect(!!FriendReceivers).toBe(true);
  });

});
