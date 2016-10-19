/*!
 * Map Type Component
 *
 * Copyright(c) Exequiel Ceasar Navarrete <esnavarrete1@up.edu.ph>
 * Licensed under MIT
 */

import { Component, OnInit, AfterViewInit, ContentChild } from '@angular/core';
import 'jquery';

@Component({
  selector: 'app-map-type',
  templateUrl: './map-type.component.html',
  styleUrls: ['./map-type.component.sass']
})
export class MapTypeComponent implements OnInit, AfterViewInit {
  public panelVisible: boolean = false;
  private _$panel: JQuery;

  @ContentChild('panel') panel: any;

  constructor() { }

  ngOnInit() { }

  ngAfterViewInit() {
    if (typeof this.panel === 'undefined') {
      throw new Error('MapTypeComponent expects a child with a type of LeafletControlPanelComponent.');
    }

    this._$panel = $( this.panel.controlWrapper.nativeElement );
  }

  togglePanel(): Promise<void> {
    return new Promise((resolve, reject) => {
      if (typeof this._$panel === 'undefined') {
        reject();
      } else {
        this._$panel
          .fadeToggle()
          .promise()
          .then(() => {
            // change the flag value of panelVisible property
            this.panelVisible = !this._$panel.is(':hidden');

            resolve();
          }, () => {
            reject();
          })
          ;
      }
    });
  }

}


