var app = angular.module('app', []);
app.controller('mainCtrl', function($scope, $http) {
	$scope.idols = [];
	$http.get('./idols.json').then(rs=>{
		$scope.idols = rs.data;

	$scope.removeImage = function(arr,index){
		ar.splice(index,1);
	}

	$scope.save = function()
	{
		var jsonString = angular.toJson($scope.idols);
		var dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(jsonString);
		var dlAnchorElem = document.createElement('a');
		dlAnchorElem.setAttribute("href",dataStr);
		dlAnchorElem.setAttribute("download","filtered-idols.json");
	}
});
});