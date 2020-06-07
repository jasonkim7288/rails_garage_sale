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
        if (this._marker_cluster == undefined) {
            var markers = this._jason_locations.map(function(location, i) {
                console.log('location:', location)
                return new google.maps.Marker({
                    position: {
                        lat: parseFloat(location["latitude"]),
                        lng: parseFloat(location["longitude"])
                    }
                })
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
            this._autocomplete.setFields(['address_components', 'geometry', 'icon', 'name']);
            // this._autocomplete.addListener('place_changed', this.locationChanged.bind(this));
        }
        return this._autocomplete;
    }

    locationChanged() {
        let place = this.autocomplete().getPlace()

        if (!place.geometry) {
            window.alert("No details available for input: '" + place.name + "'");
            return;
        }

        this.map().fitBounds(place.geometry.viewport);
        this.map().setCenter(place.geometry.location);

        // this.latitudeTarget.value = place.geometry.location.lat();
        // this.longitudeTarget.value = place.geometry.location.lng();
    }

    reloadMap() {
        console.log("Hi")
        this.locationChanged();
    }

    preventSubmit(e) {
        if (e.key == "Enter") {
            e.preventDefault();
        }
    }


}