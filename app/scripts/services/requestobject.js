'use strict';

angular.module('myappApp')
    .service('requestObject', function () {
        this.object;
        this.recipients;
        this.type;
        this.message;
    });
