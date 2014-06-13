(function(){
	var app = angular.module('findAtm', []);
	

	app.controller('AppController', ['$scope', '$http', function($scope, $http){
		$scope.lat = "0";
    $scope.lng = "0";
		$scope.googleMap = undefined;
		$scope.atmData = [];
		this.coolData = [];
		$scope.error = "";
		var atm = this;

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
    	//drop a marker on current location
    };

    $scope.getNearbyAtm = function(){
    	var chaseUrl = 'https://m.chase.com/PSRWeb/location/list.action?lat=' + $scope.lat + '&lng=' + $scope.lng;
    	$http({method: 'GET', url: chaseUrl}).success($scope.markAtms).error(function(data){console.log("We have an error")});
    };

    $scope.markAtms = function(atmData){
    	///clean this up
    	atm.coolData = atmData.locations;
    	console.log(atm.coolData);
    	$scope.atmData = atmData.locations;
    	for (var i = 0; i < $scope.atmData.length; i++){
    		var Atmlat = atmData.locations[i].lat;
    		var Atmlng = atmData.locations[i].lng;
	    	$scope.buildMarker(Atmlat, Atmlng);
    	}
    };

    $scope.buildMarker = function(lat, lng){
    	//pass in all of the atm data
    	//attach the event listener and have it link to showing toggling something on the dom
    	var atmLocation = new google.maps.LatLng(lat, lng)
    	var marker = new google.maps.Marker({
	      position: atmLocation,
	      map: $scope.googleMap,
	      title: 'Hello World!'
		  });

		  google.maps.event.addListener(marker, 'click', function(){alert("hi")})
    };

		
		$scope.buildMap = function(){

      var latlng = new google.maps.LatLng($scope.lat, $scope.lng);
      $scope.googleMap = new google.maps.Map(document.getElementById("map_canvas"),
            $scope.mapOptions(latlng));
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



	}]);

})();