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
					// url: place.icon,
					size: new google.maps.Size(40,40),
					origin: new google.maps.Point(0,0),
					scaledSize: new google.maps.Size(25,25)
				};

				// create marker for each new place
				markers.push(new google.maps.Marker({
					map: map,
					// icon: icon,
					title: place.name,
					position: place.geometry.location
				}));

				createLine(place);
				
				// google.maps.event.addListener(markers, 'click', function(){
				// 	service.getDetails(place, function(result, status){
						
				// 		if (status !== google.maps.places.PlacesServiceStatus.OK) {
				// 			console.error(status);
				// 			return;
				// 		}
				// 		console.log(result);
				// 		infowindow.setContent(title);
				// 		infowindow.open(map, this);						
				// 	});
				// });

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
		// console.log(searchvalue);
		createLine(searchvalue);
		// clean up 
		input.value = '';
	}

	function createLine(result) {
		// console.log(result);
		// create and append new list item
		var li = document.createElement('li');
		var p = document.createElement("p");
		var img = document.createElement('img');

		// rename results with variables
		var name = result.name;
		var address = result.formatted_address;
		var rating = result.rating;
		var anchor;

		// loop through and drill down into result to retreive <a> tag
		result.photos.forEach(function(element){
			// console.log(element.html_attributions);	
			element.html_attributions.forEach(function(a_tag){
				console.log(a_tag);
				anchor = a_tag;
			});
		});

		// decorate elements with Materialize classes
		p.classList.add('card-panel');
		li.classList.add('animated', 'fadeInUp', 'col', 's6');
		
		// set the innerHTML to results
		p.innerHTML = anchor + '<br>' + address;

		// insert into the DOM
		li.appendChild(p);
		resultsList.appendChild(li);
	}