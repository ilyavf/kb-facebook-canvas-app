'use strict';

angular.module('myappApp')
    .filter('emptyIfBlankOrSelected', function(){ return function(fObject, fQuery){
        var fReg = new RegExp(fQuery, 'i');
        window.fObject = fObject;
        window.fQuery = fQuery;
        window.fReg = fReg;
        return _.filter(fObject, function (o) {
            return fQuery && fReg.exec(o.name) || o.selected === true;
        });
    }})
    .filter('matchedOrSelected', function(){ return function(fObject, fQuery){
        var fReg = new RegExp(fQuery, 'i');
        window.fObject = fObject;
        window.fQuery = fQuery;
        window.fReg = fReg;
        return _.filter(fObject, function (o) {
            return fReg.exec(o.name) || o.selected === true;
        });
    }});
