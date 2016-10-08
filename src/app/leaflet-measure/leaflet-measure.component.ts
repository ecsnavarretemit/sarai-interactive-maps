import { Component, OnInit, Input, ViewChild } from '@angular/core';
import * as L from 'leaflet';
import 'leaflet-measure/dist/leaflet-measure';

@Component({
  selector: 'app-leaflet-measure',
  templateUrl: './leaflet-measure.component.html',
  styleUrls: ['./leaflet-measure.component.sass']
})
export class LeafletMeasureComponent implements OnInit {
  public control: any;

  @Input() map: any;
  @ViewChild('controlwrapper') controlWrapper;

  constructor() { }

  ngOnInit() {
    // prevent 'Control' is not a propery of L
    let controlObj = (L as any).Control;

    this.control = new controlObj.Measure({
        primaryLengthUnit: 'kilometers',
        secondaryLengthUnit: 'meters',
        primaryAreaUnit: 'hectares',
        activeColor: '#ffffff',
        completedColor: '#ffffff'
    });

    // add to the wrapper
    this.controlWrapper.nativeElement.appendChild(this.control.onAdd(this.map));
  }

}


