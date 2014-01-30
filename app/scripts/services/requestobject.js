'use strict';

angular.module('myappApp')
    .service('requestObject', function () {

        this.subject;

        this.recipients;

        // { friend | event }
        this.type;

        this.message;
    });
