import { Component, OnInit, Input, ElementRef } from '@angular/core';
import * as L from 'leaflet';

@Component({
  selector: 'app-leaflet-zoom',
  templateUrl: './leaflet-zoom.component.html',
  styleUrls: ['./leaflet-zoom.component.sass']
})
export class LeafletZoomComponent implements OnInit {
  public control: any;

  @Input() map:any;

  constructor(private element: ElementRef) { }

  ngOnInit() {
    let wrapper = this.element.nativeElement.querySelector('.zoom-wrapper');

    // prevent 'Control' is not a propery of L
    let controlObj = (L as any).Control;

    this.control = new controlObj.Zoom();

    // add to the map
    this.control.addTo(this.map);

    // remove the default container
    this.control._container.remove();

    // add to the wrapper
    wrapper.appendChild(this.control.onAdd(this.map));
  }

}


