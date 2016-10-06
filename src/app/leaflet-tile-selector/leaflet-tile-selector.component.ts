import { Component, OnInit, AfterViewInit, Input, Output, EventEmitter, ElementRef } from '@angular/core';
import { Store } from '@ngrx/store';
import { LeafletTileProviderService } from '../leaflet-tile-provider.service';

@Component({
  selector: 'app-leaflet-tile-selector',
  templateUrl: './leaflet-tile-selector.component.html',
  styleUrls: ['./leaflet-tile-selector.component.sass']
})
export class LeafletTileSelectorComponent implements OnInit, AfterViewInit {
  @Input() map:any;
  @Output() tileChange: EventEmitter<string> = new EventEmitter<string>();

  public tileKeys: any;

  constructor(
    public store: Store<any>,
    private element: ElementRef,
    private tileProvider: LeafletTileProviderService
  ) {}

  ngOnInit() {
    this.tileKeys = Object.keys(this.tileProvider.baseMaps);
  }

  ngAfterViewInit() {
    let selectEl = this.element.nativeElement.querySelector('#map-tile-selector');

    // TODO: unsuscribe once it fired once already
    this.store
      .select('map')
      .subscribe((state: any) => {
        if (state.tileProvider !== null && selectEl !== null && selectEl.value !== state.tileProvider) {
          console.log('trigger');

          selectEl.value = state.tileProvider;
        }
      })
      ;
  }

  onTileChange(event) {
    this.tileChange.emit(event.target.value);
  }

}


