'use strict';

describe('Service: GetPhotoUrlPromise', function () {

  // load the service's module
  beforeEach(module('myappApp'));

  // instantiate service
  var GetPhotoUrlPromise;
  beforeEach(inject(function (_GetPhotoUrlPromise_) {
    GetPhotoUrlPromise = _GetPhotoUrlPromise_;
  }));

  it('should do something', function () {
    expect(!!GetPhotoUrlPromise).toBe(true);
  });

});
