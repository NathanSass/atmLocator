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
			return atmId !== atmNum;
			//shows with ng-hide when this returns false
			// return false
		};
		$scope.testFunction = function(address){
			$scope.address = address;
		};


		var setAtmView = function(newAtm){
			// debugger
			// console.log(coolData[newAtm])
			$scope.$apply(function(){ //The googleMaps was unbounding $scope, the $apply was needed here
				
				$scope.address = coolData[newAtm].address;
				$scope.label = coolData[newAtm].label;
				// var lobbyHrs = coolData[newAtm].bank == "atm" ? createDate() : coolData[newAtm].lobbyHrs
				//Fields to add
				$scope.bank = coolData[newAtm].bank
				$scope.zip = coolData[newAtm].zip
				$scope.phone = coolData[newAtm].phone
				$scope.state = coolData[newAtm].state
				$scope.zip = coolData[newAtm].zip
				$scope.locType = coolData[newAtm].locType
				
				$scope.lobbyHrs = formatHours(coolData[newAtm].locType, coolData[newAtm].lobbyHrs);
				
				//
				$scope.clickedMarker = true;
				
			})
		};

		var formatHours = function(branchType, atmHours){
			var hours = [];
			if(branchType === "atm"){
				hours  = ["24 hours", "24 hours", "24 hours", "24 hours", "24 hours", "24 hours", "24 hours"]
			}else{

				hours = addClosed(atmHours)
			}
			return hours
		};

		var addClosed = function(atmHours){
			for(var i = 0; i < atmHours.length; i++){
				
			}

		}

		var mapOptions = function(currentLocation){
			return{
	      center: currentLocation,
	      zoom: 15,
	      mapTypeId: google.maps.MapTypeId.ROADMAP,
	      styles: mapStyles()	
			}
    };

    var useGeoLoc = function(position){
			lat = position.coords.latitude;
      lng = position.coords.longitude;
    	
    	getNearbyAtm();
    	buildMap();
    	//drop a marker on current location
    	// debugger
    	markCurrentLoc();
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

    var markCurrentLoc = function(){
    	var currentLoc = new google.maps.LatLng(lat, lng);
    	var marker = new google.maps.Marker({
	      position: currentLoc,
	      map: googleMap,
	      icon: 'http://maps.google.com/mapfiles/kml/pal4/icon47.png'
		  });
    };

    var buildMarker = function(lat, lng, index){
    	var atmLocation = new google.maps.LatLng(lat, lng)
    	var marker = new google.maps.Marker({
	      position: atmLocation,
	      map: googleMap
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
				alert("This browser does not support geolocation.")
				//Have the user put in his/her location and convert this to a latLong object
			}
		}();


		/////////STYLES BELOW
		var mapStyles = function(){

			var styles = [
				    {
				        "featureType": "landscape",
				        "stylers": [
				            {
				                "saturation": -100
				            },
				            {
				                "lightness": 65
				            },
				            {
				                "visibility": "on"
				            }
				        ]
				    },
				    {
				        "featureType": "poi",
				        "stylers": [
				            {
				                "saturation": -100
				            },
				            {
				                "lightness": 51
				            },
				            {
				                "visibility": "simplified"
				            }
				        ]
				    },
				    {
				        "featureType": "road.highway",
				        "stylers": [
				            {
				                "saturation": -100
				            },
				            {
				                "visibility": "simplified"
				            }
				        ]
				    },
				    {
				        "featureType": "road.arterial",
				        "stylers": [
				            {
				                "saturation": -100
				            },
				            {
				                "lightness": 30
				            },
				            {
				                "visibility": "on"
				            }
				        ]
				    },
				    {
				        "featureType": "road.local",
				        "stylers": [
				            {
				                "saturation": -100
				            },
				            {
				                "lightness": 40
				            },
				            {
				                "visibility": "on"
				            }
				        ]
				    },
				    {
				        "featureType": "transit",
				        "stylers": [
				            {
				                "saturation": -100
				            },
				            {
				                "visibility": "simplified"
				            }
				        ]
				    },
				    {
				        "featureType": "administrative.province",
				        "stylers": [
				            {
				                "visibility": "off"
				            }
				        ]
				    },
				    {
				        "featureType": "water",
				        "elementType": "labels",
				        "stylers": [
				            {
				                "visibility": "on"
				            },
				            {
				                "lightness": -25
				            },
				            {
				                "saturation": -100
				            }
				        ]
				    },
				    {
				        "featureType": "water",
				        "elementType": "geometry",
				        "stylers": [
				            {
				                "hue": "#ffff00"
				            },
				            {
				                "lightness": -25
				            },
				            {
				                "saturation": -97
				            }
				        ]
				    }
				];

				return styles;
			////////

		}
	}]);
})();