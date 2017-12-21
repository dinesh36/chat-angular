'use strict';
(function(){
	angular.module('RapidGrid',['ngLodash','angularGrid'])
		.directive('rapidGrid',['lodash',Directive]);

	function Directive(lodash){
		var directive={
			restrict:'E',
			scope:{
				multiSelectActions:'=',
				gridOptions:'=',
				gridHeight:'=',
				dataSource:'&'
			},
			//bindToController:true,
			link:Link,
			controller: ['$scope','lodash',Controller],
			controllerAs: 'vm',
			templateUrl:'/admin/components/rapid-grid/rapid-grid.html'
		};
		return directive;

		function Link($scope, $element, $attrs){
		}


		function Controller($scope,_){
			var vm=this;
			var options = {
				'columnDefs':[],
				'rowData':null,
				dontUseScrolls:false,
				headerCellRenderer:HeaderCellRendererFunc,
				suppressMultiSort:true,
				enableServerSideSorting: true,
				enableServerSideFilter: true,
				suppressCellSelection:false,
				suppressRowClickSelection:true,
				rowDeselection:true,
				angularCompileFilters: true
			};
			vm.pageSize=25;
			vm.pageSizes=[];
			vm.PageSizeChanged=PageSizeChanged;
			vm.MultiActionClick=MultiActionClick;
			vm.onOpenDateRangePicker = onOpenDateRangePicker;
			var isFirstLoad=true;
			Activate();

			function Activate(){
				lodash.assign(options, $scope.gridOptions);
				vm.gridOptions = options;
				vm.pageSize=vm.gridOptions.pageSize;
				vm.pageSizes=vm.gridOptions.pageSizes;
				vm.multiSelectActions=$scope.multiSelectActions;
				vm.isDateFilter =false;
				vm.dateRangeOptions ={
					locale:{
						format: 'MM/DD/YYYY' //date format to be shown
					},
					eventHandlers: {
						'show.daterangepicker': vm.onOpenDateRangePicker, //event handler when date picker is opened
					}
				};
				var selectionColumn={
					headerName:'',
					width:30,
					isSelection:true,
					suppressSorting:true,
					suppressMenu:true,
					suppressSizeToFit:true,
					checkboxSelection:true
				};
				$scope.$watch('gridOptions.columnDefs', function(newVal){
					if(newVal===undefined || newVal===null || newVal.length===0){
						return;
					}
					vm.gridOptions.columnDefs=[];
					if (vm.gridOptions.rowSelection !== undefined && vm.gridOptions.rowSelection === 'multiple') {
						vm.gridOptions.columnDefs.push(selectionColumn);
					}
					var unpinnedColWidth=0;
					for(var key=0;key<newVal.length;key++){
						if(newVal[key].filter === true){
							if(newVal[key].filterType === 'date'){
								vm.isDateFilter = true;
							}
							newVal[key].filter = CustomFilter;
						}
						if(key>=vm.gridOptions.pinnedColumnCount){
							unpinnedColWidth+=newVal[key].width;
						}
						vm.gridOptions.columnDefs.push(newVal[key]);
					}
					vm.gridOptions.api.onNewCols();
					if(jQuery(window).width()>unpinnedColWidth){
						vm.gridOptions.api.sizeColumnsToFit();
					}

				}.bind(this));

				$scope.$watch('gridOptions.rowData', function(newVal){
					if(newVal==null){
						return;
					}
					vm.gridOptions.rowData=newVal;
					$scope.gridOptions.api=vm.gridOptions.api;
					vm.gridOptions.api.onNewRows();
					vm.gridOptions.api.refreshView();
					if(vm.gridOptions.enablePagging){
						CreateNewDatasource();
					}
				}.bind(this));

			}
			function MultiActionClick(action, evt){
				var selectedRows = vm.gridOptions.api.getSelectedNodes();
				// callback for action
				action.callback(action, selectedRows, evt);
			}

			function CreateNewDatasource() {
				if(vm.gridOptions.rowData==null){
					return;
				}
				var dataSource = {
					pageSize: vm.pageSize, // changing to number, as scope keeps it as a string
					getRows: function (params) {
						var query= {
							sortBy:params.sortModel.length>0?params.sortModel[0].field:'',
							sortOrder:params.sortModel.length>0?params.sortModel[0].sort:'',
							pageNo:params.endRow/vm.pageSize,
							rows:vm.pageSize
						};
						for(var key in params.filterModel){
							query[key]=params.filterModel[key];
						}
						if(isFirstLoad){
							isFirstLoad=false;
							params.successCallback(vm.gridOptions.rowData, vm.gridOptions.totalRows);
							return;
						}
						vm.gridOptions.GetRows(query)
							.then(function(rows){
								params.successCallback(rows.data, rows.totalRows);
							});
					},
					lastRow:vm.gridOptions.totalRows
				};

				vm.gridOptions.api.setDatasource(dataSource);
			}

			function PageSizeChanged(){
				vm.pageSize=parseInt(vm.pageSize);
				CreateNewDatasource();
			}
		}

		function HeaderCellRendererFunc(params){
			if(params.colDef.isSelection){
				params.isSelectAll=false;
				var eHeader = document.createElement('a');

				eHeader.innerHTML='<i class="fa fa-check text-light"></i>';
				//eHeader.appendChild(eTitle);

				eHeader.addEventListener('click', function() {
					if (params.isSelectAll === true) {
						params.isSelectAll=false;
						eHeader.innerHTML='<i class="fa fa-check text-light"></i>';
						params.api.deselectAll();
						params.api.softRefreshView();
					}else{
						eHeader.innerHTML='<i class="fa fa-check"></i>';
						params.isSelectAll = true;
						params.api.selectAll();
						params.api.softRefreshView();
					}
				});
				return eHeader;

			}else{
				return params.value;
			}
		}
	}

	/**
	 * @method onOpenDateRangePicker
	 * @description function to be called when dateRangePicker is opened to add the event for stop propogation
	 */
	function onOpenDateRangePicker(){
		angular.element('.daterangepicker').unbind();
		angular.element('.daterangepicker').on('click', function(event){
			event.stopPropagation();
		});
	}

	function CustomFilter(params) {
		this.colDef = params.colDef;
		this.$scope = params.$scope;
		var me = this;
		this.isDateFilter = ( params.colDef.filterType === 'date') ? true : false;
		//if (this.isDateFilter) {
			//this.$scope.filterText = { startDate: moment().subtract(1, "days"), endDate: moment() };
		//}
		var eParent = document.getElementById('borderLayout_eRootPanel');

		this.$scope.onFilterChanged = function() {
			params.filterChangedCallback();
		};
		this.$scope.onKeyDown=function(e){
			if(e.keyCode===13){
				params.filterChangedCallback();
			}
		};
		this.$scope.onFilterClose = function () {
			if(me.$scope.filterText && !me.$scope.filterText.startDate){
				me.$scope.filterText = '';
			}
			CustomFilter.hideFilterParams.hidePopup();
		};
		this.valueGetter = params.valueGetter;
	}

	CustomFilter.prototype.getGui = function () {
		if(this.isDateFilter){
				return '<div style="padding: 4px; width: 200px;" id="gridColumnCustomFilter">' +
				'<div>'+
					'<div style="font-weight: bold; float: left;">Filter</div>'+
					'<div style="float: right;">'+
						'<button type="button" class="close" ng-click="onFilterClose()">X</button>'+
					'</div>'+
				'</div>'+
				'<div class="date-range-filter"><input readonly date-range-picker id="daterange" name="daterange" class="form-control date-picker date-range-input " type="text" style="" ng-model="filterText" placeholder="Search Date(s)" options="vm.dateRangeOptions"/></div>' +
				'<button ng-click="onFilterChanged()">Filter</button>'+
				'<button ng-click="filterText=\'\';onFilterChanged();onFilterClose()">Clear Filter</button>'+
			'</div>';
		}
		else{
				return '<div style="padding: 4px; width: 200px;" id="gridColumnCustomFilter">' +
				'<div>'+
					'<div style="font-weight: bold; float: left;">Filter</div>'+
					'<div style="float: right;">'+
						'<button type="button" class="close" ng-click="onFilterClose()">X</button>'+
					'</div>'+
				'</div>'+			
				'<div><input style="margin: 4px 0px 4px 0px;" type="text" class="form-control" ng-model="filterText" placeholder="search..." ng-keydown="onKeyDown($event)"/></div>' +
				'<button ng-click="onFilterChanged()">Filter</button>'+
				'<button ng-click="filterText=\'\';onFilterChanged()">Clear Filter</button>'+
			'</div>';
		}
	};

	CustomFilter.prototype.getApi=function(){		
		return this;
	};
	CustomFilter.prototype.getModel=function(){
		console.log(this.$scope.filterText);
		return this.$scope.filterText;
	};
	CustomFilter.prototype.doesFilterPass = function (params) {
		var filterText = this.$scope.filterText;
		if (!filterText) {
			return true;
		}
		// make sure each word passes separately, ie search for firstname, lastname
		var passed = true;
		var valueGetter = this.valueGetter;
		filterText.toLowerCase().split(' ').forEach(function(filterWord) {
			var value = valueGetter(params);
			if (value.toString().toLowerCase().indexOf(filterWord)<0) {
				passed = false;
			}
		});

		return passed;
	};
	CustomFilter.prototype.isFilterActive = function () {
		var value = this.$scope.filterText;
		return value !== null && value !== undefined && value !== '';
	};
	CustomFilter.prototype.afterGuiAttached = function(params) {
		CustomFilter.hideFilterParams = params;
		if(this.isDateFilter){ //if the filter is date filter then set the start date and end date when filter is opened
			var me = this;
			//add the event to that apply filter on the apply click of the date range picker
			this.$scope.vm.dateRangeOptions.eventHandlers['apply.daterangepicker'] = this.$scope.onFilterChanged;
			this.$scope.$apply(function(){
				if(!me.$scope.filterText){
					me.$scope.filterText = {startDate:undefined};
				}
			});
		}
	};
})();