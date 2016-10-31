/* tslint:disable:no-unused-variable */

/*!
 * Leaflet Sidebar Component Test
 *
 * Copyright(c) Exequiel Ceasar Navarrete <esnavarrete1@up.edu.ph>
 * Licensed under MIT
 */

import { TestBed, async, inject } from '@angular/core/testing';
import { LeafletSidebarComponent } from './leaflet-sidebar.component';
import { LeafletMapService } from '../leaflet-map.service';

describe('Component: LeafletSidebar', () => {
  beforeEach(() => TestBed.configureTestingModule({
    providers: [
      LeafletMapService,
      LeafletSidebarComponent
    ]
  }));

  it('should create an instance', inject([LeafletSidebarComponent], (component: LeafletSidebarComponent) => {
    expect(component).toBeTruthy();
  }));

});


