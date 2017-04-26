/*!
 * Map Type Component
 *
 * Copyright(c) Exequiel Ceasar Navarrete <esnavarrete1@up.edu.ph>
 * Licensed under MIT
 */

import { AfterViewInit, Component, ContentChild, EventEmitter, Input, OnDestroy, Output } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { Subscription } from 'rxjs/Subscription';
import { BasePanelComponent } from '../../../ui';
import { LeafletButtonComponent } from '../../../../leaflet/leaflet-button/leaflet-button.component';
import 'rxjs/add/operator/filter';

@Component({
  selector: 'app-map-type',
  templateUrl: './map-type.component.html',
  styleUrls: ['./map-type.component.sass']
})
export class MapTypeComponent implements AfterViewInit, OnDestroy {
  public active = false;
  private _routerEventSubscription: Subscription;

  @Input('activateImmediately') activateImmediately = false;
  @Input('activateOnUrl') activateOnUrl: string;
  @Output() activate: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Output() deactivate: EventEmitter<boolean> = new EventEmitter<boolean>();
  @ContentChild('mapTypePanel') panel: BasePanelComponent;
  @ContentChild(LeafletButtonComponent) button: LeafletButtonComponent;

  constructor(private _router: Router) { }

  ngAfterViewInit() {
    this._routerEventSubscription = this._router.events
      .filter((evt: any) => (evt instanceof NavigationEnd))
      .subscribe((evt: NavigationEnd) => {
        if (
          typeof this.activateOnUrl !== 'undefined' &&
          this._router.isActive(this.activateOnUrl, false) &&
          this.active === false
        ) {
          this.toggleActiveState(true, true);
        }
      })
      ;

    // activate the map type when activateImmediately is set to true
    if (this.activateImmediately === true) {
      this.toggleActiveState(true, true);
    }
  }

  toggleActiveState(includePanel = true, disablePanelAnimation = false) {
    // button and panel is required for this component method to work
    if (typeof this.button === 'undefined' || typeof this.panel === 'undefined') {
      return;
    }

    // toggle button state
    this.button.toggleActiveState();

    if (includePanel) {
      // toggle panel visibility
      this.panel.togglePanelVisibility(disablePanelAnimation);
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

  ngOnDestroy() {
    // unsubscribe to the router.events
    if (typeof this._routerEventSubscription !== 'undefined') {
      this._routerEventSubscription.unsubscribe();
    }
  }

}


