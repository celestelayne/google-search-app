console.log('sanity check!');
// Structure
// ------------------------------------------------
	var form = document.querySelector('form');
	var input = document.querySelector('input');
	var results = document.querySelector('#results');
	var resultsList = document.querySelector('#results-list');

// Setup
// ------------------------------------------------
	var map, coordinates, mapOptions, request, service, infowindow, icon;

// Events
// ------------------------------------------------
	form.addEventListener('submit', addSearchResult);

// Functions
// ------------------------------------------------
	function initMap() {
		// create a map object and specify the DOM element to display
		coordinates = new google.maps.LatLng(37.7841393, -122.3957547);

		mapOptions = {
			center: coordinates,
			scrollwheel: false,
			zoom: 13
		};

		map = new google.maps.Map(document.getElementById('map'), mapOptions);

		infowindow = new google.maps.InfoWindow();
		service = new google.maps.places.PlacesService(map);

		// link search box to UI element
		var searchBox = new google.maps.places.SearchBox(input);
		// bias the SearchBox results towards current map viewport
		map.addListener('bounds_changed', function(){
			searchBox.setBounds(map.getBounds());
		});

		var markers = [];
		searchBox.addListener('places_changed', function(){
			var places = searchBox.getPlaces();
			if (places.length == 0) {
				return;
			}

			// clear out the old markers
			markers.forEach(function(marker){
				marker.setMap(null);
			});
			markers = [];

			var bounds = new google.maps.LatLngBounds();
			places.forEach(function(place){
				console.log(place) // actual places from the search!!!!
				icon = {
					url: place.icon,
					size: new google.maps.Size(40,40),
					origin: new google.maps.Point(0,0),
					scaledSize: new google.maps.Size(25,25)
				};

				// create marker for each new place
				markers.push(new google.maps.Marker({
					map: map,
					icon: icon,
					title: place.name,
					position: place.geometry.location
				}));

				createLine(place);
				
				google.maps.event.addListener(markers, 'click', function(){
					service.getDetails(place, function(result, status){
						
						if (status !== google.maps.places.PlacesServiceStatus.OK) {
							console.error(status);
							return;
						}
						console.log(result);
						infowindow.setContent(title);
						infowindow.open(map, this);						
					});
				});

				if (place.geometry.viewport) {
					bounds.union(place.geometry.viewport);
				} else {
					bounds.extend(place.geometry.location)
				}
			});
			
			map.fitBounds(bounds);
		});
}

	function addSearchResult(event) {
		event.preventDefault();
		var searchvalue = input.value;
		console.log(searchvalue);
		createLine(searchvalue);
		// clean up 
		input.value = '';
	}

	function createLine(result) {
		// console.log(result);
		// create and append new list item
		var li = document.createElement('li');
		var name = result.name;
		var address = result.formatted_address;
		var open_now = result.opening_hours.open_now;
		var rating = result.rating;
		// set the text content to both the new list item and the result
		li.textContent = name + address;
		// console.log(result.name);

		resultsList.appendChild(li);
	}