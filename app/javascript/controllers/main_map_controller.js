import { Controller } from "stimulus"

export default class extends Controller {
    // currentUrl is for redirecting to root_path in javascript
    static targets = ["field", "map", "jsonMarkers", "currentUrl", "east", "north", "south", "west", "lat", "lng"];

    connect() {
        if (typeof(google) != "undefined") {
            this.initializeMap();
        }
    }

    initializeMap() {
        this._jason_locations = JSON.parse(this.jsonMarkersTarget.value);
        this.map();
        this.markerCluster();
        this.autocomplete();
        this.placeChanged();
        // this.initialAutocomplete();
        this.setPlace();
        console.log('this.eastTarget.value:', this.eastTarget.value)
    }

    hasQuery() {
        if (this.fieldTarget.value != "" && this.eastTarget.value != "" && this.northTarget.value != "" && this.southTarget.value != "" &&
                this.westTarget.value != "" && this.latTarget.value != "" && this.lngTarget.value != ""
            )
            return true;
        else
            return false;
    }

    // Google map initialization
    map() {
        if (this._map == undefined) {
            if (this.hasQuery())
            {
                this._map = new google.maps.Map(this.mapTarget, {
                    center: new google.maps.LatLng(
                        parseFloat(this.latTarget.value),
                        parseFloat(this.lngTarget.value)
                    )
                    // zoom: parseInt(this.zoomTarget.value)
                });

            } else {
                this._map = new google.maps.Map(this.mapTarget, {
                    center: new google.maps.LatLng(
                        0,
                        0
                    ),
                    zoom: 13
                });
            }
            // Try HTML5 geolocation
            var cur_map = this._map;
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(function(position) {
                    cur_map.setCenter({
                        lat: position.coords.latitude,
                        lng: position.coords.longitude
                    })
                });
            }
        }
        return this._map;
    }

    // markerCluster() make a group of markers
    markerCluster() {
        let current_map = this.map();
        if (this._marker_cluster == undefined) {
            var markers = this._jason_locations.map((location, i) => {
                var marker = new google.maps.Marker({
                    position: {
                        lat: parseFloat(location["latitude"]),
                        lng: parseFloat(location["longitude"])
                    }
                });
                marker.addListener('click', () => {
                    let infoWindow = new google.maps.InfoWindow({
                        content: `<p>${location.address}</p>`
                    });
                    infoWindow.open(current_map, marker);
                });
                return marker;
            });
            this._marker_cluster = new MarkerClusterer(this.map(),
                markers,
                {imagePath: 'https://cdn.rawgit.com/googlemaps/js-marker-clusterer/gh-pages/images/m'}
            );
        }
        return this._markers_cluster;
    }

    // Autocomplete function. It suggests the full address. 'formatted_address' was added to use user's bad behavior instead of
    // using placeChanged(), but 'formatted_address' saved was not 100% same as the result address of autocomplete, so I didtn' use it.
    // I don't understand why???
    autocomplete() {
        if (this._autocomplete == undefined) {
            this._autocomplete = new google.maps.places.Autocomplete(this.fieldTarget);
            this._autocomplete.bindTo('bounds', this.map());
            this._autocomplete.setFields(['address_components', 'geometry', 'icon', 'name']);
            this._autocomplete.addListener('place_changed', this.placeChanged.bind(this));
        }
        return this._autocomplete;
    }

    // If user typed strange word after autocomplete done, we should not allow to search with that word.
    placeChanged() {
        this._place_changed = this.fieldTarget.value;
    }

    // Because AutoComplete cannot have initial place, I had to use another class, AutocompleteService.
    initialAutocomplete() {
        if (this.fieldTarget.value == undefined || this.fieldTarget.value == "")
            return;
        let autocompleteService = new google.maps.places.AutocompleteService();
        let request = { input: this.fieldTarget.value };
        autocompleteService.getPlacePredictions(request, (predictionsArr, placesServiceStatus) => {
            console.log('predictionArr:', predictionsArr);
            console.log('placesServiceStatus:', placesServiceStatus);

            let placeRequest = { placeId: predictionsArr[0].place_id };
            let placeService = new google.maps.places.PlacesService(this.map());
            placeService.getDetails(placeRequest, (placeResult, placeServiceStatus) => {
                console.log('placeResult:', placeResult)
                console.log('placeServiceStatus:', placeServiceStatus);
                this.setPlace(placeResult);
            });
        });
    }

    // setPlace(placeResult) {
    setPlace() {
        // let place = this.autocomplete().getPlace();
        // let place = placeResult;

        if (!this.hasQuery()) {
            return;
        }

        console.log('this.eastTarget.value:', this.eastTarget.value)
        console.log('this.northTarget.value:', this.northTarget.value)
        console.log('this.southTarget.value:', this.southTarget.value)
        console.log('this.westTarget.value:', this.westTarget.value)

        // let bound = {
        //     east: parseFloat(this.eastTarget.value),
        //     north: parseFloat(this.northTarget.value),
        //     south: parseFloat(this.southTarget.value),
        //     west: parseFloat(this.westTarget.value)
        // }
        // console.log('bounds:', bound)

        // // this.map().fitBounds(place.geometry.viewport);
        // // this.map().setCenter(place.geometry.location);
        // this.map().fitBounds(bound);

        // let bounds = this.map().getBounds();
        // console.log('bounds:', bounds)
        let bounds = new google.maps.LatLngBounds(
            new google.maps.LatLng(parseFloat(this.southTarget.value), parseFloat(this.westTarget.value)),
            new google.maps.LatLng(parseFloat(this.northTarget.value), parseFloat(this.eastTarget.value))
        );
        this.map().fitBounds(bounds);

        google.maps.event.addListenerOnce(this.map(), 'bounds_changed', () => {
            this.map().setCenter({
                lat: parseFloat(this.latTarget.value),
                lng: parseFloat(this.lngTarget.value)
            });
            
            bounds = this.map().getBounds();
            console.log('bounds:', bounds)

            let zoom = this.map().getZoom();
            console.log('zoom:', zoom)
    
            let center = this.map().getCenter();
            console.log('center:', center)
    
            document.getElementById("search-area").innerHTML = `Near ${this.fieldTarget.value}`;
    
            this._jason_locations.forEach( location => {
                var position = {
                    lat: parseFloat(location["latitude"]),
                    lng: parseFloat(location["longitude"])
                }
                console.log('position:', position)
                if (bounds.contains(position)) {
                    document.getElementById(location["id"]).classList.remove("d-none")
                } else {
                    document.getElementById(location["id"]).classList.add("d-none")
                }
    
            });
            // this.latitudeTarget.value = place.geometry.location.lat();
            // this.longitudeTarget.value = place.geometry.location.lng();
        })

    }

    reloadMap() {
        let place = this.autocomplete().getPlace();
        console.log(place)

        // this.setPlace(place);

        if (place == undefined || this.fieldTarget.value == "" || this._place_changed != this.fieldTarget.value || !place.geometry) {
            window.alert("Address is invalid!");
            return;
        }

        // This code was redirect root_path with query, but there was a problem that map was reloaded twice, so removed it.
        // If adding query is not a solution for having each user's recent search history, then what else would it be?
        // let jsonParams = { "address": this.fieldTarget.value, ...bounds.toJSON(), ...place.geometry.location.toJSON(), "zoom": zoom.toString() };
        let jsonParams = { "address": this.fieldTarget.value, ...place.geometry.viewport.toJSON(), ...place.geometry.location.toJSON()};

        const params = new URLSearchParams(jsonParams);

        // Redirect to /posts/?address=xxxxx
        window.location.href = `${this.currentUrlTarget.value}/?${params.toString()}`;
    }

    // prohibit Enter key, only allow to hit the search button.
    preventSubmit(e) {
        if (e.key == "Enter") {
            e.preventDefault();
        }
    }


}