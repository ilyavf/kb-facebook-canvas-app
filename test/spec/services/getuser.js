'use strict';

describe('Service: GetUser', function () {

  // load the service's module
  beforeEach(module('myappApp'));

  // instantiate service
  var GetUser;
  beforeEach(inject(function (_GetUser_) {
    GetUser = _GetUser_;
  }));

  it('should do something', function () {
    expect(!!GetUser).toBe(true);
  });

});
