(function(){
	'use strict';
	angular.module('HTMediaManager')
		.directive('dropzone', function(){
			var directive = {
				link : Link,
				scope :{
					dropzoneObject:'=dropzoneObject',
					dropzoneOptions:'=dropzoneOptions'
				}
			};
			return directive;

			function Link(scope, element, attrs){
				activate();
				function activate(){
					if(scope.dropzoneOptions.options.url){
						scope.dropzoneObject = new Dropzone(element[0], scope.dropzoneOptions.options);
						// bind the given event handlers
						angular.forEach(scope.dropzoneOptions.eventHandlers, function(handler, event){
							scope.dropzoneObject.on(event, handler);

						});
					}
				}
			}
		});
})();