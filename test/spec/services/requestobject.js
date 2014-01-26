'use strict';

describe('Service: Requestobject', function () {

  // load the service's module
  beforeEach(module('myappApp'));

  // instantiate service
  var Requestobject;
  beforeEach(inject(function (_Requestobject_) {
    Requestobject = _Requestobject_;
  }));

  it('should do something', function () {
    expect(!!Requestobject).toBe(true);
  });

});
