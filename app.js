(function(){
	var app = angular.module('findAtm', []);
	

	app.controller('FindLocation', function($scope){
		$scope.error = "";


		$scope.showError = function(error){
			alert("There is an error: " + error)
		};
		$scope.showPosition = function(position){
			alert("in position")
		};

		$scope.getLocation = function(){
			if(navigator.geolocation){
				console.log("in sucess for getLocation")
				// console.log(navigator.geolocation.getCurrentPosition)
				navigator.geolocation.getCurrentPosition($scope.showPosition, $scope.showError);
			}else{
				$scope.error = "This browser does not support geolocation."
				alert("in getLocation ERROR")
				//promp the user for his/her city and convert to latlong
			}
		};

		$scope.getLocation();



	});

})();