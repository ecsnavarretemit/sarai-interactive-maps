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
import { TooltipModule } from 'ng2-bootstrap';

describe('Component: LeafletButton', () => {

  beforeEach(() => TestBed.configureTestingModule({
    declarations: [
      LeafletButtonComponent
    ],
    imports: [
      TooltipModule.forRoot()
    ],
    providers: [
      Renderer,
      LeafletButtonComponent
    ]
  }));

  it('should create an instance', inject([LeafletButtonComponent], (component: LeafletButtonComponent) => {
    expect(component).toBeTruthy();
  }));

  it('should emit buttonClick', async(inject([LeafletButtonComponent], (component: LeafletButtonComponent) => {
    component.buttonClick.subscribe((event: Event) => {
      expect(event).toBeTruthy();
    });

    component.onClick(new Event('click'));
  })));

  it('should toggle active state', async(() => {
    // assemble the component
    const fixture = TestBed.createComponent(LeafletButtonComponent);
    fixture.detectChanges();

    // get the instance of the component
    const component: LeafletButtonComponent = fixture.componentInstance;

    // trigger toggle of active state
    component.toggleActiveState();

    expect(component.active).toBe(true);
  }));

});


