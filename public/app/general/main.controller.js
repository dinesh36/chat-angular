'use strict';
(function(){
	angular
		.module('HTAdminApp')
		.controller('AppController', Controller)
		.filter('parseHTMLToText', ParseHTMLToText)
		.directive('includeReplace', IncludeReplace);
	function IncludeReplace(){
		return {
			require:'ngInclude',
			restrict:'A',
			link:function(scope, el, attrs){
				el.replaceWith(el.children());
			}
		};
	}

	function ParseHTMLToText(){
		return function(text){
			return String(text).replace(/<[^>]+>/gm, '');
		};
	}

	Controller.$inject = ['$scope', '$window', '$rootScope'];
	/* @ngInject */
	function Controller($scope, $window, $rootScope){
		var vm = this;
		// App globals
		$scope.app = {
			title:'HT API Admin Panel'
		};
		$rootScope.ShowWaitState = ShowWaitState;
		$rootScope.HideWaitState = HideWaitState;
		$rootScope.ShowSuccessNotification = ShowSuccessNotification;
		$rootScope.ShowWarningNotification = ShowWarningNotification;
		$rootScope.ShowInfoNotification = ShowInfoNotification;
		$rootScope.ShowErrorNotification = ShowErrorNotification;
		Activate();
		////////////////
		function Activate(){
			// add 'ie' classes to html
			var isIE = !!navigator.userAgent.match(/MSIE/i);
			isIE && angular.element($window.document.body).addClass('ie');
			isSmartDevice($window) && angular.element($window.document.body).addClass('smart');
			vm.app = {
				name:'HTAdmin',
				version:'v-1.0',
				// for chart colors
				color:{
					primary:'#149267',
					info:'#23b7e5',
					success:'#27c24c',
					warning:'#fad733',
					danger:'#f05050',
					light:'#e8eff0',
					dark:'#3a3f51',
					black:'#1c2b36'
				},
				settings:{
					themeID:1,
					asideColor:'bg-black',
					headerFixed:true,
					asideFixed:true,
					asideFolded:false,
					asideDock:true,
					container:false
				}
			};
			$.notifyDefaults({
				type:'success',
				element:'body',
				position:'fixed',
				allow_dismiss:true,
				newest_on_top:true,
				showProgressbar:false,
				placement:{
					from:"top",
					align:"center"
				},
				offset:20,
				spacing:10,
				// updated by maulik issue #291
				z_index:10001,
				delay:1000,
				timer:3000,
				mouse_over:null,
				animate:{
					enter:'animated fadeInDown',
					exit:'animated fadeOutUp'
				}
			});
			checkBrowserCompatibility();
		}

		// config
		$scope.app = {
			name:'HT.com Admin',
			version:'v.0.1',
			// for chart colors
			color:{
				primary:'#149267',
				info:'#23b7e5',
				success:'#27c24c',
				warning:'#fad733',
				danger:'#f05050',
				light:'#e8eff0',
				dark:'#969696',
				black:'#1c2b36'
			},
			settings:{
				themeID:1,
				navbarHeaderColor:'bg-primary',
				navbarCollapseColor:'bg-primary',
				asideColor:'bg-dark',
				headerFixed:true,
				asideFixed:false,
				asideFolded:false,
				asideDock:false,
				container:false
			}
		};
		// added a script for nav menu
		$scope.menuScript = function (){
			$( document ).ready(function() {
				setTimeout(function(){
					$('.navi ul.nav li.titleWrap').click( function() {
						$(this).toggleClass('menuOpened');
						$(this).parent('ul').next('ul.subNav').slideToggle();
					});
				}, 1000);
			});
		};
		//function for checking the browser compatibility
		function checkBrowserCompatibility(){
			var objOffsetVersion = '';
			var objbrowserName  = navigator.appName;
			var objfullVersion  = ''+parseFloat(navigator.appVersion);
			var objAgent = navigator.userAgent;
			// In Chrome
			if ((objOffsetVersion=objAgent.indexOf("Chrome"))!=-1) {
				objbrowserName = "Chrome";
				objfullVersion = objAgent.substring(objOffsetVersion+7); // 45.0.2454.93 Safari/537.36
				objfullVersion = objfullVersion.substring(0,objfullVersion.indexOf(".")); //45
			}
			// In Firefox
			else if ((objOffsetVersion=objAgent.indexOf("Firefox"))!=-1) {
				objbrowserName = "Firefox";
				objfullVersion = objAgent.substring(objOffsetVersion+8);

			}
			// In Microsoft internet explorer
			else if ((objOffsetVersion=objAgent.indexOf("MSIE"))!=-1) {
				objbrowserName = "Microsoft Internet Explorer";
				objfullVersion = objAgent.substring(objOffsetVersion+5);
				objfullVersion = objfullVersion.substring(0,objfullVersion.indexOf("."));
			}
			// In Safari
			else if ((objOffsetVersion=objAgent.indexOf("Safari"))!=-1) {
				objbrowserName = "Safari";
				objfullVersion = objAgent.substring(objOffsetVersion+7);

				if ((objOffsetVersion=objAgent.indexOf("Version"))!=-1)
					objfullVersion = objAgent.substring(objOffsetVersion+8);
				objfullVersion = objfullVersion.substring(0,objfullVersion.indexOf("."));
			}
			else if (objAgent.match(/Trident.*rv\:11\./)) {
				objbrowserName = "Microsoft Internet Explorer";
				objfullVersion = 11;
			}
			var supportedBrowser = ["Chrome","Firefox","Microsoft Internet Explorer","Safari"];
			var message = "We've noticed your browser is out of date. For an optimal experience, please update your browser.";

			// checking browser and its version
			if(supportedBrowser.indexOf(objbrowserName) == -1) {
				$rootScope.ShowInfoNotification(message);
			}
			else
			{
				if(objbrowserName=="Chrome" && objfullVersion < 44){
					$rootScope.ShowInfoNotification(message);
				}
				else if (objbrowserName=="Firefox" && objfullVersion < 40) {
					$rootScope.ShowInfoNotification(message);
				}
				else if (objbrowserName=="Microsoft Internet Explorer" && objfullVersion < 9) {
					$rootScope.ShowInfoNotification(message);
				}
				else if (objbrowserName=="Safari" && objfullVersion < 8) {
					$rootScope.ShowInfoNotification(message);
				}
			}

		}
		function isSmartDevice($window){
			// Adapted from http://www.detectmobilebrowsers.com
			var ua = $window['navigator']['userAgent'] || $window['navigator']['vendor'] || $window['opera'];
			// Checks for iOs, Android, Blackberry, Opera Mini, and Windows mobile devices
			return (/iPhone|iPod|iPad|Silk|Android|BlackBerry|Opera Mini|IEMobile/).test(ua);
		}

		function ShowWaitState(){
			// setTimeout(function(){
			// jQuery(".butterbar").removeClass('hide').addClass('active');
			// },50);
			$rootScope.$emit('$progressStart');
		}

		function HideWaitState(){
			setTimeout(function(){
				// 	jQuery(".butterbar").addClass('hide').removeClass('active');
				$rootScope.$emit('$progressEnd');
			}, 100);
		}

		function ShowSuccessNotification(message){
			var messageTemplate = "";
			messageTemplate = '<div data-notify="container" class="col-xs-11 no-padder col-sm-3 alert bg-white b-b b-t b-l b-r" role="alert">';
			messageTemplate += '<table style="width:100%"><tr>';
			messageTemplate += '<td class="alert-{0} wrapper-sm text-center" style="width:60px;">';
			messageTemplate += '<span class="glyphicon glyphicon-ok text-2x"></span>';
			messageTemplate += '</td>';
			messageTemplate += '<td class="wrapper-md">';
			messageTemplate += '<span data-notify="icon"></span> ';
			messageTemplate += '<span data-notify="title">{1}</span> ';
			messageTemplate += '<span data-notify="message">{2}</span>';
			messageTemplate += '<div class="progress" data-notify="progressbar">';
			messageTemplate += '<div class="progress-bar progress-bar-{0}" role="progressbar" aria-valuenow="0" aria-valuemin="0" aria-valuemax="100" style="width: 0%;">';
			messageTemplate += '</div>';
			messageTemplate += '</div>';
			messageTemplate += '<a href="{3}" target="{4}" data-notify="url"></a>';
			messageTemplate += '</td>';
			messageTemplate += '<td style="padding:0 10px 0 0;"><button type="button" aria-hidden="true" class="close" data-notify="dismiss">&times;</button>';
			messageTemplate += '</td>';
			messageTemplate += '</tr></table>';
			messageTemplate += '</div>';
			$.notifyClose();
			$.notify({
				// options
				message:message
			}, {
				type:'success',
				template:messageTemplate
			});
		}

		function ShowWarningNotification(message){
			var messageTemplate = "";
			messageTemplate = '<div data-notify="container" class="col-xs-11 no-padder col-sm-3 alert bg-white b-b b-t b-l b-r" role="alert">';
			messageTemplate += '<table style="width:100%"><tr>';
			messageTemplate += '<td class="alert-{0} wrapper-sm text-center" style="width:60px;">';
			messageTemplate += '<span class="glyphicon glyphicon-warning-sign text-2x"></span>';
			messageTemplate += '</td>';
			messageTemplate += '<td class="wrapper-md">';
			messageTemplate += '<span data-notify="icon"></span> ';
			messageTemplate += '<span data-notify="title">{1}</span> ';
			messageTemplate += '<span data-notify="message">{2}</span>';
			messageTemplate += '<div class="progress" data-notify="progressbar">';
			messageTemplate += '<div class="progress-bar progress-bar-{0}" role="progressbar" aria-valuenow="0" aria-valuemin="0" aria-valuemax="100" style="width: 0%;">';
			messageTemplate += '</div>';
			messageTemplate += '</div>';
			messageTemplate += '<a href="{3}" target="{4}" data-notify="url"></a>';
			messageTemplate += '</td>';
			messageTemplate += '<td style="padding:0 10px 0 0;"><button type="button" aria-hidden="true" class="close" data-notify="dismiss">&times;</button>';
			messageTemplate += '</td>';
			messageTemplate += '</tr></table>';
			messageTemplate += '</div>';
			$.notifyClose();
			$.notify({
				message:message
			}, {
				type:'warning',
				template:messageTemplate
			});
		}

		function ShowInfoNotification(message){
			var messageTemplate = "";
			messageTemplate = '<div data-notify="container" class="col-xs-11 no-padder col-sm-3 alert bg-white b-b b-t b-l b-r" role="alert">';
			messageTemplate += '<table style="width:100%"><tr>';
			messageTemplate += '<td class="alert-{0} wrapper-sm text-center" style="width:60px;">';
			messageTemplate += '<span class="glyphicon glyphicon-info-sign text-2x"></span>';
			messageTemplate += '</td>';
			messageTemplate += '<td class="wrapper-md">';
			messageTemplate += '<span data-notify="icon"></span> ';
			messageTemplate += '<span data-notify="title">{1}</span> ';
			messageTemplate += '<span data-notify="message">{2}</span>';
			messageTemplate += '<div class="progress" data-notify="progressbar">';
			messageTemplate += '<div class="progress-bar progress-bar-{0}" role="progressbar" aria-valuenow="0" aria-valuemin="0" aria-valuemax="100" style="width: 0%;">';
			messageTemplate += '</div>';
			messageTemplate += '</div>';
			messageTemplate += '<a href="{3}" target="{4}" data-notify="url"></a>';
			messageTemplate += '</td>';
			messageTemplate += '<td style="padding:0 10px 0 0;"><button type="button" aria-hidden="true" class="close" data-notify="dismiss">&times;</button>';
			messageTemplate += '</td>';
			messageTemplate += '</tr></table>';
			messageTemplate += '</div>';
			$.notifyClose();
			$.notify({
				message:message
			}, {
				type:'info',
				template:messageTemplate
			});
		}
		
		function ShowErrorNotification(message){
			var messageTemplate = "";
			messageTemplate = '<div data-notify="container" class="col-xs-11 no-padder col-sm-3 alert bg-white b-b b-t b-l b-r" role="alert">';
			messageTemplate += '<table style="width:100%"><tr>';
			messageTemplate += '<td class="alert-{0} wrapper-sm text-center" style="width:60px;">';
			messageTemplate += '<span class="glyphicon glyphicon-remove text-2x"></span>';
			messageTemplate += '</td>';
			messageTemplate += '<td class="wrapper-md">';
			messageTemplate += '<span data-notify="icon"></span> ';
			messageTemplate += '<span data-notify="title">{1}</span> ';
			messageTemplate += '<span data-notify="message">{2}</span>';
			messageTemplate += '<div class="progress" data-notify="progressbar">';
			messageTemplate += '<div class="progress-bar progress-bar-{0}" role="progressbar" aria-valuenow="0" aria-valuemin="0" aria-valuemax="100" style="width: 0%;">';
			messageTemplate += '</div>';
			messageTemplate += '</div>';
			messageTemplate += '<a href="{3}" target="{4}" data-notify="url"></a>';
			messageTemplate += '</td>';
			messageTemplate += '<td style="padding:0 10px 0 0;"><button type="button" aria-hidden="true" class="close" data-notify="dismiss">&times;</button>';
			messageTemplate += '</td>';
			messageTemplate += '</tr></table>';
			messageTemplate += '</div>';
			$.notify({
				message:message
			}, {
				type:'danger',
				template:messageTemplate
			});
		}
	}
})();