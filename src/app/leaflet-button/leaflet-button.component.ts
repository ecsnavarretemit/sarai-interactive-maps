import { Component, OnInit, Input, ViewChild } from '@angular/core';

@Component({
  selector: 'app-leaflet-button',
  templateUrl: './leaflet-button.component.html',
  styleUrls: ['./leaflet-button.component.sass'],
})
export class LeafletButtonComponent implements OnInit {
  @Input('control-class') controlClass: string;
  @ViewChild('controlwrapper') controlWrapper;

  constructor() { }

  ngOnInit() {
    if (typeof this.controlClass !== 'undefined') {
      let split = this.controlClass.split(' ');

      // add the class to the content
      this.controlWrapper.nativeElement.classList.add(...split);
    }
  }

}


