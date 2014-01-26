'use strict';

describe('Service: FriendObjects', function () {

  // load the service's module
  beforeEach(module('myappApp'));

  // instantiate service
  var FriendObjects;
  beforeEach(inject(function (_FriendObjects_) {
    FriendObjects = _FriendObjects_;
  }));

  it('should do something', function () {
    expect(!!FriendObjects).toBe(true);
  });

});
