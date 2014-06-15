(function(){
	var app = angular.module('findAtm', []);
	

	app.controller('AppController', ['$http', '$scope', function($http, $scope){
		// var CoolApp = this;
		var lat = "0";
    var lng = "0";
		var googleMap = undefined;
		var coolData = [];
		var atmId = 0;
		var error = "";
		$scope.clickedMarker = false;



		$scope.isSet = function(atmNum){
			console.log("in isSet")
			console.log(atmNum)
			return atmId !== atmNum;
			//shows with ng-hide when this returns false
			// return false
		};
		$scope.testFunction = function(address){
			$scope.address = address;
		};


		var setAtmView = function(newAtm){
			$scope.$apply(function(){ //The googleMaps was unbounding $scope, the $apply was needed here
				$scope.address = coolData[newAtm].address;
				$scope.label = coolData[newAtm].label;
				console.log($scope.address);
				$scope.clickedMarker = true;
				
			})
		};

		var mapOptions = function(currentLocation){
			return{
	      center: currentLocation,
	      zoom: 15,
	      mapTypeId: google.maps.MapTypeId.ROADMAP	
			}
    };

    var useGeoLoc = function(position){
			lat = position.coords.latitude;
      lng = position.coords.longitude;
    	
    	getNearbyAtm();
    	buildMap();
    	//drop a marker on current location
    };

    var getNearbyAtm = function(){
    	var chaseUrl = 'https://m.chase.com/PSRWeb/location/list.action?lat=' + lat + '&lng=' + lng;
    	$http({method: 'GET', url: chaseUrl}).success(markAtms).error(function(data){console.log("We have an error")});
    };

    var markAtms = function(atmData){
    	coolData = atmData.locations; //set the value here so it is available in all of the controlller
    	for (var i = 0; i < coolData.length; i++){
    		var Atmlat = coolData[i].lat;
    		var Atmlng = coolData[i].lng;
	    	buildMarker(Atmlat, Atmlng, i);
    	}
    };

    var buildMarker = function(lat, lng, index){
    	var atmLocation = new google.maps.LatLng(lat, lng)
    	var marker = new google.maps.Marker({
	      position: atmLocation,
	      map: googleMap,
	      title: 'Hello World!'
		  });
		  google.maps.event.addListener(marker, 'click', function(){setAtmView(index)})
    };

		
		var buildMap = function(){
      var latlng = new google.maps.LatLng(lat, lng);
      googleMap = new google.maps.Map(document.getElementById("map_canvas"), //defines googleMap here which is availabel to the rest of the app
            mapOptions(latlng));
		};
		
		var showError = function(error){
			alert("There is an error: " + error)
		};

		var getLocation = function(){
			if(navigator.geolocation){
				navigator.geolocation.getCurrentPosition(useGeoLoc, showError);
			}else{
				this.error = "This browser does not support geolocation."
				alert(this.error)
				//prompt the user for his/her city and convert to latlong
			}
		}();
	}]);
})();