'use strict';
(function(){
	angular
		.module('HTMediaManager')
		.factory('MediaManagerService', MediaManagerService);

	MediaManagerService.$inject = ['$http', '$q'];

	function MediaManagerService($http, $q){
		var service = {
			getDirectoryDetail:getDirectoryDetail,
			getDirectories:getDirectories,
			deleteDirectory:deleteDirectory,
			createDirectory:createDirectory,
			updateDirectory:updateDirectory,
			getFiles:getFiles,    //use for get files under particular folder
			deleteFile:deleteFile,
			searchFiles:searchFiles,
			updateFile:updateFile,
			getFile:getFile,      //use for get single file data and path
			searchFolders:searchFolders,
			getDirectoryParents:getDirectoryParents,
			moveFile:moveFile,
			moveFolder:moveFolder,
			getTags:getTags,
			getFileByTagName:getFileByTagName
		};
		return service;

		function getDirectoryDetail(folderId){
			var deferred = $q.defer();
			var option = {
				method:'GET',
				url:'/admin/mediamanager/folders/'+folderId
			};
			$http(option).success(function(data, status, headers) {
				if (data.Status == 'success') {
					deferred.resolve(data.Data);
				} else {
					deferred.reject(data.Error);
				}
			}).error(function(error) {
				deferred.reject(error);
			});
			return deferred.promise;
		}

		function getDirectories(folderId,query){
			var deferred = $q.defer();
			var option = {
				method:'GET',
				url:'/admin/mediamanager/folders/'+folderId+'/subFolders',
				query:query
			};
			$http(option).success(function(data, status, headers) {
				if (data.Status == 'success') {
					deferred.resolve(data.Data);
				} else {
					deferred.reject(data.Error);
				}
			}).error(function(error) {
				deferred.reject(error);
			});
			return deferred.promise;
		}

		function deleteDirectory(folderId){
			var deferred = $q.defer();
			var option = {
				method:'DELETE',
				url:'/admin/mediamanager/folders/'+folderId
			};
			$http(option).success(function(data, status, headers) {
				if (data.Status == 'success') {
					deferred.resolve(data.Data);
				} else {
					deferred.reject(data.Error);
				}
			}).error(function(error) {
				deferred.reject(error);
			});
			return deferred.promise;
		}
		function deleteFile(folderId,fileId){
			var deferred = $q.defer();
			var option = {
				method:'DELETE',
				url:'/admin/mediamanager/folders/'+folderId+'/files/'+fileId
			};
			$http(option).success(function(data, status, headers) {
				if (data.Status == 'success') {
					deferred.resolve(data.Data);
				} else {
					deferred.reject(data.Error);
				}
			}).error(function(error) {
				deferred.reject(error);
			});
			return deferred.promise;
		}

		function createDirectory(postObj){
			var deferred = $q.defer();
			var option = {
				method:'POST',
				url:'/admin/mediamanager/folders',
				data:postObj
			};

			$http(option).success(function(data, status, headers) {
				if (data.Status == 'success') {
					deferred.resolve(data.Data);
				} else {
					deferred.reject(data.Error);
				}
			}).error(function(error) {
				deferred.reject(error);
			});
			return deferred.promise;

		}

		function updateDirectory(folderId,postObj){
			var deferred = $q.defer();
			var option = {
				method:'PUT',
				url:'/admin/mediamanager/folders/'+folderId,
				data:postObj
			};

			$http(option).success(function(data, status, headers) {
				if (data.Status == 'success') {
					deferred.resolve(data.Data);
				} else {
					deferred.reject(data.Error);
				}
			}).error(function(error) {
				deferred.reject(error);
			});
			return deferred.promise;
		}

		function getFiles(folderId,query){
			var deferred = $q.defer();
			var option = {
				method:'GET',
				url:'/admin/mediamanager/folders/'+folderId+'/files',
				params:query
			};
			$http(option).success(function(data, status, headers) {
				if (data.Status == 'success') {
					deferred.resolve(data.Data);
				} else {
					deferred.reject(data.Error);
				}
			}).error(function(error) {
				deferred.reject(error);
			});
			return deferred.promise;
		}

		function searchFiles(query){
			var deferred = $q.defer();
			var option = {
				method:'GET',
				url:'/admin/mediamanager/files/search',
				params:{q:query}
			};
			$http(option).success(function(data, status, headers) {
				if (data.Status == 'success') {
					deferred.resolve(data.Data);
				} else {
					deferred.reject(data.Error);
				}
			}).error(function(error) {
				deferred.reject(error);
			});
			return deferred.promise;
		}

		function updateFile(folderId,fileId,postObj){
			var deferred = $q.defer();
			var option = {
				method:'PUT',
				url:'/admin/mediamanager/folders/'+folderId+'/files/'+fileId,
				data:postObj
			};

			$http(option).success(function(data, status, headers) {
				if (data.Status == 'success') {
					deferred.resolve(data.Data);
				} else {
					deferred.reject(data.Error);
				}
			}).error(function(error) {
				deferred.reject(error);
			});
			return deferred.promise;
		}

		function getFile(folderId,fileId){
			var deferred = $q.defer();
			var option = {
				method:'GET',
				url:'/admin/mediamanager/folders/'+folderId+'/files/'+fileId
			};

			$http(option).success(function(data, status, headers) {
				if (data.Status == 'success') {
					deferred.resolve(data.Data);
				} else {
					deferred.reject(data.Error);
				}
			}).error(function(error) {
				deferred.reject(error);
			});
			return deferred.promise;
		}

		function searchFolders(query){
			var deferred = $q.defer();
			var option = {
				method:'GET',
				url:'/admin/mediamanager/folders/search',
				params:{q:query}
			};
			$http(option).success(function(data, status, headers){
				if(data.Status == 'success'){
					deferred.resolve(data.Data);
				} else{
					deferred.reject(data.Error);
				}
			}).error(function(error){
				deferred.reject(error);
			});
			return deferred.promise;
		}

		function getDirectoryParents(folderId){
			var deferred = $q.defer();
			var option = {
				method:'GET',
				url:'/admin/mediamanager/folders/' + folderId + '/parents'
			};
			$http(option).success(function(data, status, headers){
				if(data.Status == 'success'){
					deferred.resolve(data.Data);
				} else{
					deferred.reject(data.Error);
				}
			}).error(function(error){
				deferred.reject(error);
			});
			return deferred.promise;
		}


		//added by nirali gajjar 11-12
		function moveFile (folderId, fileId) {
			var deferred = $q.defer();
			var option = {
				method:'PUT',
				url:'/admin/mediamanager/folders/'+folderId+'/'+fileId
			};
			$http(option).success(function(data, status, headers){
				if(data.Status == 'success'){
					deferred.resolve(data.Data);
				} else{
					deferred.reject(data.Error);
				}
			}).error(function(error){
				deferred.reject(error);
			});
			return deferred.promise;
		}
		
		function moveFolder (folderId, parentDirId) {
			var deferred = $q.defer();
			var option = {
				method:'PUT',
				url:'/admin/mediamanager/folders/'+folderId+'/parents/'+parentDirId
			};
			$http(option).success(function(data, status, headers){
				if(data.Status == 'success'){
					deferred.resolve(data.Data);
				} else{
					deferred.reject(data.Error);
				}
			}).error(function(error){
				deferred.reject(error);
			});
			return deferred.promise;
		}

		function getTags(query){
			var deferred = $q.defer();
			var option = {
				method:'GET',
				url:'/admin/mediamanager/tags',
				params:{q:query}
			};
			$http(option).success(function(data){
				if(data.Status == 'success'){
					deferred.resolve(data.Data);
				} else {
					deferred.reject(data.Error);
				}
			}).error(function (error) {
				deferred.reject(error);
			});
			return deferred.promise;
		}

		function getFileByTagName(tagName){
			var deferred = $q.defer();
			var option = {
				method:'GET',
				url:'/admin/mediamanager/files/searchBytags',
				params:{tagName:tagName}
			};
			$http(option).success(function(data){
				if(data.Status == 'success'){
					deferred.resolve(data.Data);
				} else {
					deferred.reject(data.Error);
				}
			}).error(function (error) {
				deferred.reject(error);
			});
			return deferred.promise;
		}
	}
})();