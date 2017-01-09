/* tslint:disable:no-unused-variable */

/*!
 * Crop Production Area Maps Component Test
 *
 * Copyright(c) Exequiel Ceasar Navarrete <esnavarrete1@up.edu.ph>
 * Licensed under MIT
 */

import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { CropProductionAreaMapsComponent } from './crop-production-area-maps.component';

describe('CropProductionAreaMapsComponent', () => {
  let component: CropProductionAreaMapsComponent;
  let fixture: ComponentFixture<CropProductionAreaMapsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CropProductionAreaMapsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CropProductionAreaMapsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

});


