//'use strict';
//var ckEditor = angular.module('ckEditor', []);
//
//        ckEditor.directive('ckEditor', [Directive]);
//    function Directive(){
//        return {
//            require: '?ngModel',
//            restrict: 'C',
//            link: function (scope, elm, attr, model) {
//                var isReady = false;
//                var data = [];
//                /*var ck = CKEDITOR.replace(elm[0]);*/
//
//                function setData() {
//                    if (!data.length) {
//                        return;
//                    }
//
//                    var d = data.splice(0, 1);
//                    /*ck.setData(d[0] || '<span></span>', function () {
//                        setData();
//                        isReady = true;
//                    });*/
//                }
//
//                /*ck.on('instanceReady', function (e) {
//                    if (model) {
//                        setData();
//                    }
//                });*/
//
//                elm.bind('$destroy', function () {
//                   // ck.destroy(false);
//                });
//
//                if (model) {
//                    /*ck.on('change', function () {
//                        scope.$apply(function () {
//                            var data = ck.getData();
//                            if (data == '<span></span>') {
//                                data = null;
//                            }
//                            model.$setViewValue(data);
//                        });
//                    });*/
//
//                    model.$render = function (value) {
//                        if (model.$viewValue === undefined) {
//                            model.$setViewValue(null);
//                            model.$viewValue = null;
//                        }
//
//                        data.push(model.$viewValue);
//
//                        if (isReady) {
//                            isReady = false;
//                            setData();
//                        }
//                    };
//                }
//
//            }
//        };
//    }
//
//    function direct(){
//        return {
//            require: '?ngModel',
//            link: function ($scope, elm, attr, ngModel) {
//
//                //var ck = CKEDITOR.replace(elm[0]);
//
//                /*ck.on('pasteState', function () {
//                    $scope.$apply(function () {
//                        ngModel.$setViewValue(ck.getData());
//                    });
//                });*/
//
//                ngModel.$render = function (value) {
//                    //ck.setData(ngModel.$modelValue);
//                };
//            }
//        };
//    }