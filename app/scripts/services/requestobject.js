'use strict';

angular.module('myappApp')
    .service('requestObject', function () {

        this.object;

        this.recipients;

        // { friend | event }
        this.type;

        this.message;
    });
