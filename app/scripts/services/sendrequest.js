'use strict';

angular.module('myappApp')
    .factory('SendRequest', function ($http, $location) {
        var server = $location.host(),
            port = '1337',
            proto = $location.protocol(),
            //path = '/cf/_fb/sendRequest.json',
            path = '/fb_api/send-notification',
            url = proto + '://' + server + ':' + port + path,
            appUrl = $location.absUrl().slice(0, $location.absUrl().indexOf('#'));
        window.llocation = $location;

        return function (data) {
            return $http({
                method: 'POST',
                url: url,
                data: formatData(data)
            });
        };

        /**
         * Formats data for the platform api (fb email/notification)
         * @param data
         * @returns {*|string|undefined|string}
         */
        function formatData (data) {
            var formatted = {
                sender: data.sender,
                contacts: data.recipients.map(function (user) { return {
                    id: user.id,
                    name: user.name,
                    email: user.username + '@facebook.com'
                }; }),
                subject: data.subject,
                type: data.type,                     // { 'request' | 'response' }
                message: data.message,
                photos: data.photos,
                app_url: appUrl
            };
            console.log('[SendRequest.formatData] data, formatted: ', data, formatted);
            return angular.toJson(formatted);
        }
    });
