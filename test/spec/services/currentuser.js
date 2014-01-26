'use strict';

describe('Service: CurrentUser', function () {

  // load the service's module
  beforeEach(module('myappApp'));

  // instantiate service
  var CurrentUser;
  beforeEach(inject(function (_CurrentUser_) {
    CurrentUser = _CurrentUser_;
  }));

  it('should do something', function () {
    expect(!!CurrentUser).toBe(true);
  });

});
