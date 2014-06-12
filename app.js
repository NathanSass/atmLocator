(function(){
	var app = angular.module('findAtm', []);
	

	app.controller('FindLocation', function($scope, $http){
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

    $scope.useGeoLoc = function(position){
			$scope.lat = position.coords.latitude;
      $scope.lng = position.coords.longitude;
    	
    	$scope.getNearbyAtm($scope.lat, $scope.lng);
    	$scope.buildMap($scope.lat, $scope.lng);
    };

    $scope.getNearbyAtm = function(lat, lng){
    	console.log('getting nearby atms');
    	var chaseUrl = 'https://m.chase.com/PSRWeb/location/list.action?lat=' + lat + '&lng=' + lng;
    	console.log(chaseUrl)
    	$http({method: 'GET', url: chaseUrl}).success(function(data){console.log(data)}).error(function(data){console.log("We have an error")});
    };

		
		$scope.buildMap = function(lat, lng){

      var latlng = new google.maps.LatLng(lat, lng);
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
				navigator.geolocation.getCurrentPosition($scope.useGeoLoc, $scope.showError);
			}else{
				$scope.error = "This browser does not support geolocation."
				alert($scope.error)
				//promp the user for his/her city and convert to latlong
			}
		};

		$scope.getLocation();



	});

})();