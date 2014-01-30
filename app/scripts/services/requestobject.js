'use strict';

angular.module('myappApp')
    .service('requestObject', function () {

        this.subject;

        this.recipients;

        // { friend | event }
        this.type;

        this.message;

        this.reset = function () {
            console.log('[requestObject.reset]', this);
            this.subject = { name: '', id: null };
            this.recipients = [];
            this.type = null;
            this.message = null;
        }

        this.reset();
    });
