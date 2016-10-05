import { Component, OnInit, ElementRef } from '@angular/core';
import * as L from 'leaflet';
import { LeafletTileProviderService } from '../leaflet-tile-provider.service';

@Component({
  selector: 'app-leaflet-map',
  templateUrl: './leaflet-map.component.html',
  styleUrls: ['./leaflet-map.component.sass']
})
export class LeafletMapComponent implements OnInit {

  constructor(private element: ElementRef, private tileProvider: LeafletTileProviderService) {}

  ngOnInit() {
    let el = this.element.nativeElement.querySelector('.map');

    let map:any = L
      .map(el, {
        zoomControl: false
      })
      .setView([13, 122], 6)
      ;

    // add the one of the basemap to the map
    this.tileProvider.baseMaps['OpenStreetMap'].addTo( map );
  }

}
