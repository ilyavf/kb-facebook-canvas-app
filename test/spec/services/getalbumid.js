'use strict';

describe('Service: getAlbumId', function () {

  // load the service's module
  beforeEach(module('myappApp'));

  // instantiate service
  var getAlbumId;
  beforeEach(inject(function (_getAlbumId_) {
    getAlbumId = _getAlbumId_;
  }));

  it('should do something', function () {
    expect(!!getAlbumId).toBe(true);
  });

});
