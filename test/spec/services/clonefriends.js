'use strict';

describe('Service: CloneFriends', function () {

  // load the service's module
  beforeEach(module('myappApp'));

  // instantiate service
  var CloneFriends;
  beforeEach(inject(function (_CloneFriends_) {
    CloneFriends = _CloneFriends_;
  }));

  it('should do something', function () {
    expect(!!CloneFriends).toBe(true);
  });

});
