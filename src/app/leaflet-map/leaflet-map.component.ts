import { Component, OnInit, ElementRef, Input, Output, EventEmitter } from '@angular/core';
import { LeafletTileProviderService } from '../leaflet-tile-provider.service';
import * as L from 'leaflet';

@Component({
  selector: 'app-leaflet-map',
  templateUrl: './leaflet-map.component.html',
  styleUrls: ['./leaflet-map.component.sass']
})
export class LeafletMapComponent implements OnInit {
  @Input() lat:number;
  @Output() latChange: EventEmitter<number> = new EventEmitter<number>();

  @Input() lng:number;
  @Output() lngChange: EventEmitter<number> = new EventEmitter<number>();

  @Input() zoom:number;
  @Output() zoomChange: EventEmitter<number> = new EventEmitter<number>();

  public map: any;

  constructor(private element: ElementRef, private tileProvider: LeafletTileProviderService) {}

  ngOnInit() {
    let el = this.element.nativeElement.querySelector('.map');

    // set default view parameters to show whole Philippines
    let lat = 13;
    let lng = 122;
    let zoom = 6;

    // override the lat variable if lat is provided via the lat attribute
    if (typeof this.lat !== 'undefined') {
      lat = this.lat;
    }

    // override the lng variable if lng is provided via the lng attribute
    if (typeof this.lng !== 'undefined') {
      lng = this.lng;
    }

    // override the zoom variable if zoom is provided via the zoom attribute
    if (typeof this.zoom !== 'undefined') {
      zoom = this.zoom;
    }

    // create the map instance
    this.map = L.map(el, {
      zoomControl: false
    });

    // position the map
    this.map.setView([lat, lng], zoom);

    // add the one of the basemap to the map
    this.tileProvider.baseMaps['OpenStreetMap'].addTo(this.map);

    // emit changes to lat and lng coordinates
    this.map.on('moveend', (e) => {
      let center = this.map.getCenter();

      this.latChange.emit(center.lat);

      this.lngChange.emit(center.lng);
    });

    // emit changes to zoom
    this.map.on('zoomend', (e) => {
      this.zoomChange.emit(this.map.getZoom());
    });
  }

}


