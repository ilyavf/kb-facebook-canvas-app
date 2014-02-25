'use strict';

describe('Service: PrepareRequestData', function () {

    // load the service's module
    beforeEach(module('myappApp'));

    // instantiate service
    var PrepareRequestData;
    beforeEach(inject(function (_PrepareRequestData_) {
        PrepareRequestData = _PrepareRequestData_;
    }));

    it('should format data for sending request', function () {
        expect(!!PrepareRequestData).toBe(true);
    });

});
