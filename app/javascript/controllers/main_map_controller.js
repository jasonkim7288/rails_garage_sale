import { Controller } from "stimulus"

export default class extends Controller {
    static targets = ["field", "map", "jsonMarkers"];

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
    }

    map() {
        if (this._map == undefined) {
            this._map = new google.maps.Map(this.mapTarget, {
                center: new google.maps.LatLng(
                    0,
                    0
                ),
                zoom: 13
            });
            
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

    autocomplete() {
        if (this._autocomplete == undefined) {
            this._autocomplete = new google.maps.places.Autocomplete(this.fieldTarget);
            this._autocomplete.bindTo('bounds', this.map());
            this._autocomplete.setFields(['address_components', 'geometry', 'icon', 'name', 'formatted_address']);
            this._autocomplete.addListener('place_changed', this.placeChanged.bind(this));
        }
        return this._autocomplete;
    }

    placeChanged() {
        this._place_changed = this.fieldTarget.value;
    }

    locationChanged() {
        let place = this.autocomplete().getPlace();

        console.log(this._place_changed);
        console.log(this.fieldTarget.value)
        
        if (place == undefined || this._place_changed != this.fieldTarget.value || !place.geometry) {
            window.alert("Address is invalid!");
            return;
        }

        this.map().fitBounds(place.geometry.viewport);
        this.map().setCenter(place.geometry.location);

        let bounds = this.map().getBounds();

        document.getElementById("search-area").innerHTML = `Near ${this.fieldTarget.value}`;

        this._jason_locations.forEach( location => {
            var position = {
                lat: parseFloat(location["latitude"]),
                lng: parseFloat(location["longitude"])
            }
            if (bounds.contains(position)) {
                document.getElementById(location["id"]).classList.remove("d-none")
            } else {
                document.getElementById(location["id"]).classList.add("d-none")
            }

        });
        // this.latitudeTarget.value = place.geometry.location.lat();
        // this.longitudeTarget.value = place.geometry.location.lng();
    }

    reloadMap() {
        this.locationChanged();
    }

    preventSubmit(e) {
        if (e.key == "Enter") {
            e.preventDefault();
        }
    }


}