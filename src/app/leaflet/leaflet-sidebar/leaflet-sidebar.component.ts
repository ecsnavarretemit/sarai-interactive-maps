/*!
 * Leaflet Sidebar Component
 *
 * Copyright(c) Exequiel Ceasar Navarrete <esnavarrete1@up.edu.ph>
 * Licensed under MIT
 */

import { Component, OnInit, OnDestroy, Input, Output, EventEmitter, ViewChild, ElementRef } from '@angular/core';
import { LeafletMapService } from '../leaflet-map.service';
import * as L from 'leaflet';
import 'leaflet-sidebar';

@Component({
  selector: 'app-leaflet-sidebar',
  templateUrl: './leaflet-sidebar.component.html',
  styleUrls: ['./leaflet-sidebar.component.sass']
})
export class LeafletSidebarComponent implements OnInit, OnDestroy {
  public control: L.Control;
  private _added: boolean = false;
  private _controlContainer: HTMLElement;

  @Input() position: string = 'right';
  @Input() closeButton: boolean = true;
  @Input() autoPan: boolean = false;
  @Input() containerClass: string;
  @Output() onShow: EventEmitter<any> = new EventEmitter<any>();
  @Output() onShown: EventEmitter<any> = new EventEmitter<any>();
  @Output() onHide: EventEmitter<any> = new EventEmitter<any>();
  @Output() onHidden: EventEmitter<any> = new EventEmitter<any>();
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
      .then((map: L.Map) => {
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

    // Bind event listeners to the control the leaflet sidebar
    (this.control as any).on('show', this.onBeforeShow.bind(this));
    (this.control as any).on('shown', this.onAfterShow.bind(this));
    (this.control as any).on('hide', this.onBeforeHide.bind(this));
    (this.control as any).on('hidden', this.onAfterHide.bind(this));
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

  onBeforeShow(evt) {
    this.onShow.emit(evt);
  }

  onAfterShow(evt) {
    this.onShown.emit(evt);
  }

  onBeforeHide(evt) {
    this.onHide.emit(evt);
  }

  onAfterHide(evt) {
    this.onHidden.emit(evt);
  }

  ngOnDestroy() {
    // remove the reference to the container.
    this._controlContainer = null;

    this._mapService
      .getMap()
      .then((map: L.Map) => {
        // remove the control from the map
        (this.control as any).removeFrom(map);

        // set the added property to false after remove the control from the map
        this._added = false;
      })
      ;

    // Bind event listeners to the control the leaflet sidebar
    (this.control as any).off('show');
    (this.control as any).off('shown');
    (this.control as any).off('hide');
    (this.control as any).off('hidden');
  }

}


