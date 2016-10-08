import { Component, OnInit, AfterViewInit, Input, ViewChild } from '@angular/core';

@Component({
  selector: 'app-leaflet-button',
  templateUrl: './leaflet-button.component.html',
  styleUrls: ['./leaflet-button.component.sass'],
})
export class LeafletButtonComponent implements OnInit, AfterViewInit {
  @Input('control-class') controlClass: string;
  @ViewChild('control') control;

  constructor() { }

  ngOnInit() {}

  ngAfterViewInit() {
    if (typeof this.controlClass !== 'undefined') {
      let split = this.controlClass.split(' ');

      // add the class to the content
      this.control.nativeElement.classList.add(...split);
    }
  }

}


