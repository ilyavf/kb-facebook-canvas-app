'use strict';

describe('Filter: emptyIfBlankOrSelected', function () {

  // load the filter's module
  beforeEach(module('myappApp'));

  // initialize a new instance of the filter before each test
  var emptyIfBlankOrSelected;
  beforeEach(inject(function ($filter) {
    emptyIfBlankOrSelected = $filter('emptyIfBlankOrSelected');
  }));

  it('should return the input prefixed with "emptyIfBlankOrSelected filter:"', function () {
    var text = 'angularjs';
    expect(emptyIfBlankOrSelected(text)).toBe('emptyIfBlankOrSelected filter: ' + text);
  });

});
