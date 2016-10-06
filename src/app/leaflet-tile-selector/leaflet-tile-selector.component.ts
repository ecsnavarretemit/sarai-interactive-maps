import { Component, OnInit, AfterViewInit, Input, ElementRef } from '@angular/core';
import { Store } from '@ngrx/store';
import { LeafletTileProviderService } from '../leaflet-tile-provider.service';

@Component({
  selector: 'app-leaflet-tile-selector',
  templateUrl: './leaflet-tile-selector.component.html',
  styleUrls: ['./leaflet-tile-selector.component.sass']
})
export class LeafletTileSelectorComponent implements OnInit, AfterViewInit {
  @Input() map:any;

  public tileKeys: any;
  public tileProviderKey: string;

  constructor(
    public store: Store<any>,
    private element: ElementRef,
    private tileProvider: LeafletTileProviderService
  ) {
    this.tileProviderKey = 'Google Satellite';
  }

  ngOnInit() {
    this.tileKeys = Object.keys(this.tileProvider.baseMaps);

    // add default tile
    this.tileProvider.baseMaps[this.tileProviderKey].addTo(this.map);
  }

  ngAfterViewInit() {
    let selectEl = this.element.nativeElement.querySelector('#map-tile-selector');

    // set default select value
    selectEl.value = this.tileProviderKey;
  }

  onTileChange(event) {
    let value = event.target.value;
    let resolvedTile = this.tileProvider.baseMaps[event.target.value];

    if (typeof resolvedTile !== 'undefined') {
      // remove the current layer
      this.map.removeLayer(this.tileProvider.baseMaps[this.tileProviderKey]);

      // add the new layer
      resolvedTile.addTo(this.map);

      // store the currently used tile
      this.tileProviderKey = value;

      // store the resolved tile provider to the state manager
      this.store.dispatch({
        type: 'SET_TILE_PROVIDER',
        payload: {
          tileProvider: value
        }
      });
    }
  }

}


