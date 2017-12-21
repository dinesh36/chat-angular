(function () {
    'use strict';
    angular.module('HTAdminApp')
        .filter('slugify', function () {
            return function (text) {
                //console.log(text);
                if (text === undefined)
                    return "";
                return text.toString().toLowerCase()
                    .replace(/\s+/g, '-')        // Replace spaces with -
                    .replace(/[^\w\-]+/g, '')   // Remove all non-word chars
                    .replace(/\-\-+/g, '-')      // Replace multiple - with single -
                    .replace(/^-+/, '')          // Trim - from start of text
                    .replace(/-+$/, '');         // Trim - from end of text
            }
        });
})
();