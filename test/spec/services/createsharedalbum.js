'use strict';

describe('Service: CreateSharedAlbum', function () {

  // load the service's module
  beforeEach(module('myappApp'));

  // instantiate service
  var CreateSharedAlbum;
  beforeEach(inject(function (_CreateSharedAlbum_) {
    CreateSharedAlbum = _CreateSharedAlbum_;
  }));

  it('should do something', function () {
    expect(!!CreateSharedAlbum).toBe(true);
  });

});
