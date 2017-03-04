/* tslint:disable:no-unused-variable */

/*!
 * Base Panel Component Test
 *
 * Copyright(c) Exequiel Ceasar Navarrete <esnavarrete1@up.edu.ph>
 * Licensed under MIT
 */

import { Renderer } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';
import { LeafletMapService } from '../../../../leaflet';
import { BasePanelComponent } from './base-panel.component';

describe('Component: BasePanel', () => {
  let component: BasePanelComponent;
  let fixture: ComponentFixture<BasePanelComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        BasePanelComponent
      ],
      providers: [
        LeafletMapService,
        Renderer
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BasePanelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

});


