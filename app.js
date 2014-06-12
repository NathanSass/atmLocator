(function(){
	var app = angular.module('findAtm', []);
	

	app.controller('FindLocation', function($scope, $http){
		$scope.lat = "0";
    $scope.lng = "0";
		$scope.googleMap = undefined;
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
    	
    	$scope.getNearbyAtm();
    	$scope.buildMap();
    };

    $scope.getNearbyAtm = function(){
    	var chaseUrl = 'https://m.chase.com/PSRWeb/location/list.action?lat=' + $scope.lat + '&lng=' + $scope.lng;
    	$http({method: 'GET', url: chaseUrl}).success($scope.markAtms).error(function(data){console.log("We have an error")});
    };

    $scope.markAtms = function(atmData){
    	console.log(atmData)
    	var nearbyAtms = atmData.locations
    	for (var i = 0; i < nearbyAtms.length; i++){}
    	$scope.dropMarker($scope.lat, $scope.lng)
    };

    $scope.dropMarker = function(lat, lng){
    	var atmLocation = new google.maps.LatLng(lat, lng)
    	var marker = new google.maps.Marker({
	      position: atmLocation,
	      map: $scope.googleMap,
	      title: 'Hello World!'
		  });


    }

		
		$scope.buildMap = function(){

      var latlng = new google.maps.LatLng($scope.lat, $scope.lng);
      $scope.googleMap = new google.maps.Map(document.getElementById("map_canvas"),
            $scope.mapOptions(latlng));
      //add markers here
		};
		
		$scope.showError = function(error){
			alert("There is an error: " + error)
		};

		$scope.getLocation = function(){
			if(navigator.geolocation){
				navigator.geolocation.getCurrentPosition($scope.useGeoLoc, $scope.showError);
			}else{
				$scope.error = "This browser does not support geolocation."
				alert($scope.error)
				//prompt the user for his/her city and convert to latlong
			}
		};

		$scope.getLocation();



	});

})();