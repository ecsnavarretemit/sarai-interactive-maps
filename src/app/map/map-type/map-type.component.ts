/*!
 * Map Type Component
 *
 * Copyright(c) Exequiel Ceasar Navarrete <esnavarrete1@up.edu.ph>
 * Licensed under MIT
 */

import { Component, ContentChild, EventEmitter, Output } from '@angular/core';
import { BasePanelComponent } from '../base-panel/base-panel.component';
import { LeafletButtonComponent } from '../../leaflet/leaflet-button/leaflet-button.component';

@Component({
  selector: 'app-map-type',
  templateUrl: './map-type.component.html',
  styleUrls: ['./map-type.component.sass']
})
export class MapTypeComponent {
  public active: boolean =  false;

  @Output() activate: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Output() deactivate: EventEmitter<boolean> = new EventEmitter<boolean>();
  @ContentChild('mapTypePanel') panel: BasePanelComponent;
  @ContentChild(LeafletButtonComponent) button: LeafletButtonComponent;

  toggleActiveState(includePanel = true) {
    // button and panel is required for this component method to work
    if (typeof this.button === 'undefined' || typeof this.panel === 'undefined') {
      return;
    }

    // toggle button state
    this.button.toggleActiveState();

    if (includePanel) {
      // toggle panel visibility
      this.panel.togglePanelVisibility();
    }

    // flip between true/false values
    this.active = !this.active;

    // emit only if true
    if (this.active) {
      this.activate.emit(this.active);
    } else {
      this.deactivate.emit(this.active);
    }
  }

}


