/* tslint:disable:no-unused-variable */

/*!
 * Map Type Component Test
 *
 * Copyright(c) Exequiel Ceasar Navarrete <esnavarrete1@up.edu.ph>
 * Licensed under MIT
 */

import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { MockRouter } from '../../../../mocks/router';
import { MapTypeComponent } from './map-type.component';

describe('Component: MapType', () => {
  let component: MapTypeComponent;
  let fixture: ComponentFixture<MapTypeComponent>;
  let mockRouter: MockRouter;

  beforeEach(async(() => {
    mockRouter = new MockRouter();

    TestBed.configureTestingModule({
      declarations: [
        MapTypeComponent
      ],
      providers: [
        { provide: Router, useValue: mockRouter },
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MapTypeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should not toggle the active status when panel or button is not present', () => {
    component.toggleActiveState();
    expect(component.active).toBeFalsy();
  });

});


