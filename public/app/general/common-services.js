/**
 * Created by dinesh on 3/1/17.
 */
(function() {
    'use strict';
    angular
        .module('HTAdminServices')
        .factory('CommonServices', CommonServices);
    CommonServices.$inject = [];
    /**
     * @method CommonServices
     * @description Service to to manage the common services
     * @constructor
     * @tickets BOMB-2994
     */
    function CommonServices() {
        return {
            'downloadFile':downloadFile,
            copyToClipBoard:copyToClipBoard
        };

        /**
         * @method downloadFile
         * @description function to download file
         * @params content
         * @params fileName
         * @params headers
         * @params fileType
         * @tickets BOMB-2994
         */
        function downloadFile(content, fileName, headers,fileType) {
            fileType = fileType || 'text/csv';
            if ( window.navigator.msSaveOrOpenBlob && window.Blob ) {
                var blob = new window.Blob( [ content ], { type: fileType } );
                window.navigator.msSaveOrOpenBlob( blob, fileName);
            } else {
                var uri = headers + window.escape(content);
                var link = document.createElement('a');
                link.href = uri;
                link.style.visibility = 'hidden';
                link.download = fileName;
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
            }
        }
        /**
         * @method copyToClipBoard
         * @description function to copy to clip board
         * @param elemId
         * @param text
         * @tickets BOMB-2106,BOMB-1923
         */
        function copyToClipBoard(elemId,text){
            var elem = jQuery(elemId)[0];
            // create hidden text element, if it doesn't already exist
            var targetId = '_hiddenCopyText_';
            var isInput = false;//elem.tagName === 'INPUT' || elem.tagName === 'TEXTAREA';
            var origSelectionStart, origSelectionEnd;
            var target;
            if (isInput) {
                // can just use the original source element for the selection and copy
                target = elem;
                origSelectionStart = elem.selectionStart;
                origSelectionEnd = elem.selectionEnd;
            } else {
                // must use a temporary form element for the selection and copy
                target = window.document.getElementById(targetId);
                if (!target) {
                    target = window.document.createElement('textarea');
                    target.style.position = 'absolute';
                    target.style.left = '-9999px';
                    target.style.top = '0';
                    target.id = targetId;
                    window.document.body.appendChild(target);
                }
                //target.textContent = elem.textContent;
                target.textContent = text;
            }
            // select the content
            var currentFocus = window.document.activeElement;
            target.focus();
            target.setSelectionRange(0, target.value.length);

            // copy the selection
            var succeed;
            try {
                succeed = window.document.execCommand('copy');
            } catch(e) {
                succeed = false;
            }
            // restore original focus
            if (currentFocus && typeof currentFocus.focus === 'function') {
                currentFocus.focus();
            }

            if (isInput) {
                // restore prior selection
                elem.setSelectionRange(origSelectionStart, origSelectionEnd);
            } else {
                // clear temporary content
                target.textContent = '';
            }
            return succeed;
        }
    }
})();