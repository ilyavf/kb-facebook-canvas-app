'use strict';

describe('Service: SendReminder', function () {

  // load the service's module
  beforeEach(module('myappApp'));

  // instantiate service
  var SendReminder;
  beforeEach(inject(function (_SendReminder_) {
    SendReminder = _SendReminder_;
  }));

  it('should do something', function () {
    expect(!!SendReminder).toBe(true);
  });

});
