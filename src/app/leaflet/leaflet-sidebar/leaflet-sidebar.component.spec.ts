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
    declarations: [
      LeafletSidebarComponent
    ],
    providers: [
      LeafletMapService,
      LeafletSidebarComponent
    ]
  }));

  it('should create an instance', inject([LeafletSidebarComponent], (component: LeafletSidebarComponent) => {
    expect(component).toBeTruthy();
  }));

  it('should emit onBeforeShow', async(inject([LeafletSidebarComponent], (component: LeafletSidebarComponent) => {
    component.beforeShow.subscribe((event: Event) => {
      expect(event).toBeTruthy();
    });

    component.onBeforeShow(new Event('beforeShow'));
  })));

  it('should emit onAfterShow', async(inject([LeafletSidebarComponent], (component: LeafletSidebarComponent) => {
    component.afterShow.subscribe((event: Event) => {
      expect(event).toBeTruthy();
    });

    component.onAfterShow(new Event('afterShow'));
  })));

  it('should emit onBeforeHide', async(inject([LeafletSidebarComponent], (component: LeafletSidebarComponent) => {
    component.beforeHide.subscribe((event: Event) => {
      expect(event).toBeTruthy();
    });

    component.onBeforeHide(new Event('beforeHide'));
  })));

  it('should emit onAfterHide', async(inject([LeafletSidebarComponent], (component: LeafletSidebarComponent) => {
    component.afterHide.subscribe((event: Event) => {
      expect(event).toBeTruthy();
    });

    component.onAfterHide(new Event('afterHide'));
  })));

});


