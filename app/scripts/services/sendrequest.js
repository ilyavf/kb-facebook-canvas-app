'use strict';

angular.module('myappApp')
    .factory('SendRequest', function ($http, $location) {
        var server = $location.host(),
            proto = $location.protocol(),
            path = '/cf/_fb/sendRequest.json',
            url = proto + '://' + server + path,
            appUrl = $location.absUrl().slice(0, $location.absUrl().indexOf('#'));
        window.llocation = $location;

        return function (data) {
            return $http({
                method: 'POST',
                url: url,
                data: formatData(data)
            });
        };

        function formatData (data) {
            var formatted = {
                fromname: data.sender.name,
                contacts: data.recipients.map(function (user) { return {
                    id: user.id,
                    name: user.name,
                    email: user.username + '@facebook.com'
                }; }),
                object: data.object.name,
                message: data.message,
                app_url: appUrl
            };
            console.log('[SendRequest.formatData] data, formatted: ', data, formatted);
            return angular.toJson(formatted);
        }
    });
