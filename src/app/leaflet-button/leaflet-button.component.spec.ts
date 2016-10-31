/* tslint:disable:no-unused-variable */

/*!
 * Leaflet Button Component Test
 *
 * Copyright(c) Exequiel Ceasar Navarrete <esnavarrete1@up.edu.ph>
 * Licensed under MIT
 */

import { Renderer } from '@angular/core';
import { TestBed, async, inject } from '@angular/core/testing';
import { LeafletButtonComponent } from './leaflet-button.component';

describe('Component: LeafletButton', () => {
  beforeEach(() => TestBed.configureTestingModule({
    providers: [
      Renderer,
      LeafletButtonComponent
    ]
  }));

  it('should create an instance', inject([LeafletButtonComponent], (component: LeafletButtonComponent) => {
    expect(component).toBeTruthy();
  }));

  it('should emit event object', inject([LeafletButtonComponent], (component: LeafletButtonComponent) => {
    component.buttonClick.subscribe((event: Event) => {
      expect(event).toEqual(jasmine.any(Event));
    });

    component.onClick(new Event('mouseenter'));
  }));

});


