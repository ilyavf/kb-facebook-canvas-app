'use strict';

describe('Service: SaveRequestData', function () {

  // load the service's module
  beforeEach(module('myappApp'));

  // instantiate service
  var SaveRequestData;
  beforeEach(inject(function (_SaveRequestData_) {
      SaveRequestData = _SaveRequestData_;
  }));

  it('should do something', function () {
    expect(!!SaveRequestData).toBe(true);
  });

});
