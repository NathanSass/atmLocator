(function(){
	var app = angular.module('findAtm', []);

	app.controller('AppController', ['$http', '$scope', function($http, $scope){
		var lat = "0";         //GoogleMaps & Chase Api each need to share the variables related to location so I scoped them to the controller
    var lng = "0";
		var googleMap = undefined;
		var coolData = [];
		var atmId = 0;
		$scope.clickedMarker = false; //Program starts out by displaying no data. 


		var setAtmView = function(newAtm){ // Passes the data to the selected ATM to the DOM with view-binding
			$scope.$apply(function(){ //The googleMaps API was unbinding $scope, the $apply was needed here
				var branchType = coolData[newAtm].locType;
				var bankHours  = coolData[newAtm].lobbyHrs;
				
				$scope.bankData = coolData[newAtm];
				$scope.lobbyHrs = formatHours(branchType, bankHours); //Need to format hour data here, could have similar methods for phone numbers, capitalization, etc.
				$scope.clickedMarker = true;
				
			})
		};

		var formatHours = function(branchType, atmHours){
			var hours = Array.apply(null, Array(7));
			
			if(branchType === "atm"){ //atms do not provide hours of operations, but our UI needs that info.
				hours = hours.map(function (x, i) { return "24 Hours" });
				// hours  = ["24 Hours", "24 Hours", "24 Hours", "24 Hours", "24 Hours", "24 Hours", "24 Hours"] This is an alternative to other gymnastics. I wanted to try something new.
			}else{
				hours = addClosed(atmHours) //It looks better to have "closed" instead of blank values
			}
			return hours
		};

		var addClosed = function(atmHours){ //returns a reference of the atmHours formatted with "Closed" for the UI 
			var withClosed = [];
			for(var i = 0; i < atmHours.length; i++){
				if(atmHours[i].length === 0){
					withClosed.push("CLOSED");
				}else{
					withClosed.push(atmHours[i]);
				}
			}
			return withClosed;
		};

		var mapOptions = function(currentLocation){
			return{
	      center: currentLocation,
	      zoom: 15,
	      mapTypeId: google.maps.MapTypeId.ROADMAP,
	      styles: mapStyles()	//These are my custom styles found in the huge JSON object at the bottom
			}
    };

    var useGeoLoc = function(position){ //The flow branches here and the various functions execute with the geolocation info
			lat = position.coords.latitude; //defines lat scoped to this controller
      lng = position.coords.longitude;
    	
    	getNearbyAtm(); //Hit to Chase Api
    	buildMap(); //Build Dom
    	markCurrentLoc(); //Drop that little star where the user is
    };

    var getNearbyAtm = function(){
    	var chaseUrl = 'https://m.chase.com/PSRWeb/location/list.action?lat=' + lat + '&lng=' + lng;
    	$http({method: 'GET', url: chaseUrl}).success(markAtms).error(function(data){console.log("We have an error")}); //Error: User could put in his/her address and use that to make call. Browser can return bad values
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
    	var currentLoc = new google.maps.LatLng(lat, lng); //I could move this up and scope it to the whole controller
    	var marker = new google.maps.Marker({
	      position: currentLoc,
	      map: googleMap,
	      icon: 'http://maps.google.com/mapfiles/kml/pal4/icon47.png' //Cool little star
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
      googleMap = new google.maps.Map(document.getElementById("map_canvas"), //defines googleMap here which is availabel to the rest of the controller
            mapOptions(latlng));
		};
		
		var showError = function(error){
			alert("There is an error: ") //prompt user to put in address,
		};

		var getLocation = function(){
			if(navigator.geolocation){
				navigator.geolocation.getCurrentPosition(useGeoLoc, showError);
			}else{
				alert("This browser does not support geolocation.")
				//Have the user put in his/her location and convert this to a latLong object
			}
		}();


		/////////MAP STYLING JSON BELOW
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
		}
	}]);
})();