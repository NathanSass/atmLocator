(function(){
	var app = angular.module('findAtm', []);
	

	app.controller('FindLocation', function($scope){
		$scope.lat = "0";
    $scope.lng = "0";
		$scope.model = { myMap: undefined };
		$scope.error = "";

		$scope.mapOptions = function(currentLocation){
			return{
	      center: currentLocation,
	      zoom: 15,
	      mapTypeId: google.maps.MapTypeId.ROADMAP	
			}
    };

		
		$scope.showPosition = function(position){
			$scope.lat = position.coords.latitude;
      $scope.lng = position.coords.longitude;

      var latlng = new google.maps.LatLng($scope.lat, $scope.lng);
      var map = new google.maps.Map(document.getElementById("map_canvas"),
            $scope.mapOptions(latlng));
      //add markers here
		};
		
		$scope.showError = function(error){
			alert("There is an error: " + error)
		};

		$scope.getLocation = function(){
			if(navigator.geolocation){
				console.log("in sucess for getLocation")
				// console.log(navigator.geolocation.getCurrentPosition)
				navigator.geolocation.getCurrentPosition($scope.showPosition, $scope.showError);
			}else{
				$scope.error = "This browser does not support geolocation."
				alert($scope.error)
				//promp the user for his/her city and convert to latlong
			}
		};

		$scope.getLocation();



	});

})();