import { Controller } from "stimulus"

export default class extends Controller {
    static targets = ["map"];

    connect() {
        if (typeof(google) != "undefined") {
            this.initializeMap();
        }
    }

    initializeMap() {
        console.log('this.element.getAttribute("latitude"):', this.element.getAttribute("latitude"))
        console.log('this.mapTarget:', this.mapTarget)
        this.map();
        this.marker();
    }

    map() {
        if (this._map == undefined) {
            this._map = new google.maps.Map(this.mapTarget, {
                center: new google.maps.LatLng(
                    parseFloat(this.element.getAttribute("latitude")),
                    parseFloat(this.element.getAttribute("longitude"))
                ),
                zoom: 17
            });
        }
        return this._map;
    }

    marker() {
        if (this._marker == undefined) {
            this._marker = new google.maps.Marker({
                map: this.map(),
                anchorPoint: new google.maps.Point(0, 0)
            });

            let mapLocation = {
                lat: parseFloat(this.element.getAttribute("latitude")),
                lng: parseFloat(this.element.getAttribute("longitude"))
            }
            this._marker.setPosition(mapLocation);
            this._marker.setVisible(true);
        }
        return this._marker;
    }

}