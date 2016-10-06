import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { LeafletTileProviderService } from '../leaflet-tile-provider.service';

@Component({
  selector: 'app-leaflet-tile-selector',
  templateUrl: './leaflet-tile-selector.component.html',
  styleUrls: ['./leaflet-tile-selector.component.sass']
})
export class LeafletTileSelectorComponent implements OnInit {
  @Input() map:any;
  @Output() tileChange: EventEmitter<string> = new EventEmitter<string>();

  public tileKeys: any;

  constructor(private tileProvider: LeafletTileProviderService) {}

  ngOnInit() {
    this.tileKeys = Object.keys(this.tileProvider.baseMaps);
  }

  onTileChange(event) {
    this.tileChange.emit(event.target.value);
  }

}


