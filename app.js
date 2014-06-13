(function(){
	var app = angular.module('findAtm', []);
	

	app.controller('AppController', ['$http', '$scope', function($http, $scope){
		var CoolApp = this;
		this.lat = "0";
    this.lng = "0";
		this.googleMap = undefined;
		this.coolData = [];
		this.atmId = 0;
		this.error = "";


		$scope.isSet = function(atmNum){
			console.log("in isSet")
			console.log(atmNum)
			return CoolApp.atmId !== atmNum;
			//shows with ng-hide when this returns false
			// return false
		};

		this.setAtmView = function(newAtm){
			CoolApp.atmId = newAtm
			console.log("value in setAtmView " + CoolApp.atmId);
			return CoolApp.atmId;
		};

		this.mapOptions = function(currentLocation){
			return{
	      center: currentLocation,
	      zoom: 15,
	      mapTypeId: google.maps.MapTypeId.ROADMAP	
			}
    };

    this.useGeoLoc = function(position){
			CoolApp.lat = position.coords.latitude;
      CoolApp.lng = position.coords.longitude;
    	
    	CoolApp.getNearbyAtm();
    	CoolApp.buildMap();
    	//drop a marker on current location
    };

    this.getNearbyAtm = function(){
    	var chaseUrl = 'https://m.chase.com/PSRWeb/location/list.action?lat=' + CoolApp.lat + '&lng=' + CoolApp.lng;
    	$http({method: 'GET', url: chaseUrl}).success(CoolApp.markAtms).error(function(data){console.log("We have an error")});
    };

    this.markAtms = function(atmData){
    	///clean this up
    	// console.log(CoolApp.coolData);
    	CoolApp.coolData = atmData.locations; //set the value here so it is available in all of the controlller
    	console.log(CoolApp.coolData)
    	for (var i = 0; i < CoolApp.coolData.length; i++){
    		// debugger
    		var Atmlat = CoolApp.coolData[i].lat;
    		var Atmlng = CoolApp.coolData[i].lng;
	    	CoolApp.buildMarker(Atmlat, Atmlng, i);
    	}
    };

    this.buildMarker = function(lat, lng, index){
    	//pass in all of the atm data()
    	//attach the event listener and have it link to showing toggling something on the dom
    	var atmLocation = new google.maps.LatLng(lat, lng)
    	var marker = new google.maps.Marker({
	      position: atmLocation,
	      map: CoolApp.googleMap,
	      title: 'Hello World!'
		  });
    	// debugger
		  google.maps.event.addListener(marker, 'click', function(){CoolApp.setAtmView(index)})
    };

		
		this.buildMap = function(){

      var latlng = new google.maps.LatLng(CoolApp.lat, CoolApp.lng);
      CoolApp.googleMap = new google.maps.Map(document.getElementById("map_canvas"),
            CoolApp.mapOptions(latlng));
		};
		
		this.showError = function(error){
			alert("There is an error: " + error)
		};

		this.getLocation = function(){
			if(navigator.geolocation){
				navigator.geolocation.getCurrentPosition(CoolApp.useGeoLoc, CoolApp.showError);
			}else{
				this.error = "This browser does not support geolocation."
				alert(this.error)
				//prompt the user for his/her city and convert to latlong
			}
		};

		CoolApp.getLocation();



	}]);

})();