(function(){
	'use strict';
	angular
		.module('RapidDateTimePicker', [])
		.directive('rapidDateTimePicker',Directive);
	Controller.$inject = ['$scope','$timeout'];

	/**
	 * @method Directive
	 * @description Directive of the wrapper of date time picker of bootstrap
	 * 		https://eonasdan.github.io/bootstrap-datetimepicker/
	 * @constructor
	 * @tickets: BOMB-2346
     */
	function Directive(){
		return {
		        restrict: 'EA',
		        templateUrl: '/admin/components/rapid-datepicker/rapid-datetime-picker.html',
		        require: ['^form'],
				link : link,
		        scope :{
		        	name:'@name',
		        	model:'=model',
		        	displayName:'@displayName',
		        	placeHolder:'@placeHolder',
		        	validations:'=validations',
		        	dateFormat:'@dateFormat',
		        	editMode:'@editMode',
		        	width:'@width',
					type:'@',
					onHide:'=',
					src:'@src',
					bindTimeOut:'=',
					minDate:'='
		        },
		        bindToController: true,
		        controller: Controller,
			    controllerAs: 'vm'
		};

		/**
		 * @method link
		 * @description function to be called when linking the directive
		 * @param scope
		 * @param element
		 * @param attrs
         * @param ctrls
         */
		function link(scope,element,attrs,ctrls){
			scope.vm.form = ctrls[0];
			scope.vm.__element=element;
		}
	}

	/**
	 * @method Controller
	 * @description controller to manage the directive
	 * @param $scope
	 * @param $timeout
     */
	function Controller($scope,$timeout){
		var vm = this;
		var id='#'+vm.name;
		activate();

		/**
		 * @method activate
		 * @description function to be called when controller is active
         */
		function activate(){
			var bindTimeout = vm.bindTimeOut || 200;
			$timeout(bindDatepicker,bindTimeout);
		}

		/**
		 * @method bindDatepicker
		 * @description method to bind the date time picker
         */
		function bindDatepicker(){
			var options = {
				useCurrent:true,
				toolbarPlacement:'top',
				showClear:true,
				showClose:true,
				showTodayButton:true,
				inline: vm.type==='inline',
				sideBySide:true
			};
			if(vm.type==='inline'){
				options.defaultDate = vm.model || new Date();
				//setting the minimum date one minutes minus because it will throw the validation error if set the same as the current time
				var time = new Date();
				time.setMinutes(time.getMinutes() - 1);
				var pickerTime = new Date(vm.model);
				if(pickerTime.getTime() <= time.getTime() ){
					options.minDate = pickerTime;
				} else {
					options.minDate = time;
				}
			}
			if(vm.minDate){
				options.minDate = new Date(vm.minDate);
			}
			vm.__element.find(id).datetimepicker(options);
			vm.__element.find(id).val(vm.model);
			vm.__element.find(id).on('dp.change',function(){
				$scope.$apply(function(){
					vm.model = vm.__element.find(id).val();
				});
			});
			vm.__element.find(id).on('dp.hide',function(e){
				//call the function for hide if there is any
				$scope.$apply(function(){
					if(vm.onHide){
						vm.onHide(new Date(e.date));
					}
				});
				//need to set the model when element is hidden as sometimes values are not set when hidden
				vm.model = vm.__element.find(id).val();
				vm.form[vm.name].$setDirty();
				vm.__element.find(id).blur();
			});
		}
	}
})();