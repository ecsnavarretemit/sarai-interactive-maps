/* tslint:disable:no-unused-variable */

/*!
 * Leaflet Button Component Test
 *
 * Copyright(c) Exequiel Ceasar Navarrete <esnavarrete1@up.edu.ph>
 * Licensed under MIT
 */

import { TestBed, async } from '@angular/core/testing';
import { LeafletButtonComponent } from './leaflet-button.component';

describe('Component: LeafletButton', () => {
  let component = new LeafletButtonComponent();

  it('should create an instance', () => {
    expect(component).toBeTruthy();
  });

  it('should emit event object', () => {
    component.buttonClick.subscribe((event: Event) => {
      expect(event).toEqual(jasmine.any(Event));
    });
    component.onClick(new Event('mouseenter'));
  });
});


