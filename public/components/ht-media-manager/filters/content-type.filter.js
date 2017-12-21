(function(){
	'use strict';
	angular.module('HTMediaManager')
		.filter('fileTypeFAClass', function() {
			return function(contentType) {
				var contentTypeMap={
					'application/vnd.openxmlformats-officedocument.wordprocessingml.document':'word',
					'application/msword':'word',
					'application/vnd.oasis.opendocument.text':'word',
					'application/pdf':'pdf',
					'application/x-bzip':'zip',
					'application/x-bzip2':'zip',
					'application/vnd.openxmlformats-officedocument.wordprocessingml.template':'word',
					'application/vnd.ms-word.document.macroEnabled.12':'word',
					'application/vnd.ms-word.template.macroEnabled.12':'word',
					'application/vnd.ms-excel':'excel',
					'text/csv':'excel',
					'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet':'excel',
					'application/vnd.openxmlformats-officedocument.spreadsheetml.template':'excel',
					'application/vnd.ms-excel.sheet.macroEnabled.12':'excel',
					'application/vnd.ms-excel.template.macroEnabled.12':'excel',
					'application/vnd.ms-excel.addin.macroEnabled.12':'excel',
					'application/vnd.ms-excel.sheet.binary.macroEnabled.12':'excel',
					'application/zip':'zip',
					'application/gzip':'zip',
					'application/x-compressed-zip':'zip',
					'application/x-gzip':'zip',
					'audio/basic':'audio',
					'audio/mid':'audio',
					'audio/mpeg':'audio',
					'audio/x-aiff':'audio',
					'audio/x-mpegurl':'audio',
					'audio/x-wav':'audio',
					'video/mp4':'video',
					//'video/msvideo':'video',
					//'video/avi':'video',
					//'video/x-msvideo':'video',
					'image/png':'image',
					'image/jpg':'image',
					'image/jpeg':'image',
					'image/gif':'image',
					'image/bmp':'image',
					'image/x-windows-bmp':'image',
					'image/x-icon':'image'
				};
				var extension=contentTypeMap[contentType];
				return 'fa-file-'+(extension===undefined?'text':extension)+'-o';
			};
		});
})();