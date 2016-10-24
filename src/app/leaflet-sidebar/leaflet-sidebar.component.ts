/*!
 * Leaflet Sidebar Component
 *
 * Copyright(c) Exequiel Ceasar Navarrete <esnavarrete1@up.edu.ph>
 * Licensed under MIT
 */

import { Component, OnInit, OnDestroy, Input, ViewChild, ElementRef } from '@angular/core';
import { Map, Control } from 'leaflet';
import { LeafletMapService } from '../leaflet-map.service';
import 'leaflet-sidebar';

@Component({
  selector: 'app-leaflet-sidebar',
  templateUrl: './leaflet-sidebar.component.html',
  styleUrls: ['./leaflet-sidebar.component.sass']
})
export class LeafletSidebarComponent implements OnInit, OnDestroy {
  public control: Control;
  private _added: boolean = false;
  private _controlContainer: HTMLElement;

  @Input() position: string = 'right';
  @Input() closeButton: boolean = true;
  @Input() autoPan: boolean = false;
  @Input() containerClass: string;
  @ViewChild('controlwrapper') controlWrapper: ElementRef;

  constructor(private _mapService: LeafletMapService) { }

  ngOnInit() {
    // prevent 'Control' is not a propery of L
    let controlObj = (L as any).control;

    this.control = controlObj.sidebar(this.controlWrapper.nativeElement, {
      position: this.position,
      closeButton: this.closeButton,
      autoPan: this.autoPan
    });

    this._mapService
      .getMap()
      .then((map: Map) => {
        // add the control to the map instance
        this.control.addTo(map);

        // store the reference of the container
        this._controlContainer = (this.control as any)._container;

        // add the class to the container
        if (typeof this.containerClass !== 'undefined') {
          let split = this.containerClass.split(' ');

          this._controlContainer.classList.add(...split);
        }

        // set the added property to true after adding the control to the map
        this._added = true;
      })
      ;
  }

  show() {
    // do nothing if it not yet added on the map
    if (!this._added) {
      return;
    }

    // show the sidebar
    (this.control as any).show();
  }

  hide() {
    // do nothing if it not yet added on the map
    if (!this._added) {
      return;
    }

    // hide the sidebar
    (this.control as any).show();
  }

  toggle() {
    // do nothing if it not yet added on the map
    if (!this._added) {
      return;
    }

    // toggle the sidebar's visibility
    (this.control as any).toggle();
  }

  ngOnDestroy() {
    // remove the reference to the container.
    this._controlContainer = null;

    this._mapService
      .getMap()
      .then((map: Map) => {
        // remove the control from the map
        (this.control as any).removeFrom(map);

        // set the added property to false after remove the control from the map
        this._added = false;
      });
  }

}


