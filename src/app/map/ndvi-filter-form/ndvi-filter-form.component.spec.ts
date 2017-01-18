/* tslint:disable:no-unused-variable */

/*!
 * NDVI Filter Form Component Test
 *
 * Copyright(c) Exequiel Ceasar Navarrete <esnavarrete1@up.edu.ph>
 * Licensed under MIT
 */

import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Http } from '@angular/http';
import { TranslateModule, TranslateLoader } from 'ng2-translate';
import { FormsModule as SaraiInteractiveMapsFormsModule, FlatpickrComponent } from '../../forms';
import { LeafletMapService } from '../../leaflet';
import { LocationsService } from '../locations.service';
import { MockRouter } from '../../mocks/router';
import { MockLocationsService } from '../../mocks/map';
import { TranslationFactoryLoader } from '../../app-translation-factory.service';
import { NdviFilterFormComponent } from './ndvi-filter-form.component';

describe('Component: NdviFilterForm', () => {
  let component: NdviFilterFormComponent;
  let fixture: ComponentFixture<NdviFilterFormComponent>;
  let mockRouter: MockRouter;

  // elements
  let startingDate: DebugElement;
  let startingDateEl: HTMLInputElement;
  let scanRange: DebugElement;
  let scanRangeEl: HTMLInputElement;
  let provinceSelect: DebugElement;
  let provinceSelectEl: HTMLElement;

  beforeEach(async(() => {
    mockRouter = new MockRouter();

    TestBed.configureTestingModule({
      declarations: [
        NdviFilterFormComponent
      ],
      imports: [
        FormsModule,
        ReactiveFormsModule,
        SaraiInteractiveMapsFormsModule,
        TranslateModule.forRoot({
          provide: TranslateLoader,
          useFactory: TranslationFactoryLoader,
          deps: [Http]
        })
      ],
      providers: [
        FormBuilder,
        LeafletMapService,

        { provide: Router, useValue: mockRouter },
        { provide: LocationsService, useClass: MockLocationsService }
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NdviFilterFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    // get the starting date and helper element
    startingDate = fixture.debugElement.query(By.directive(FlatpickrComponent));
    startingDateEl = startingDate.nativeElement;

    // get the scan range element
    scanRange = fixture.debugElement.query(By.css('#ec_scan_range_txt'));
    scanRangeEl = scanRange.nativeElement;

    // get the province selector
    provinceSelect = fixture.debugElement.query(By.css('#ec_province_filter_sel'));
    provinceSelectEl = provinceSelect.nativeElement;
  });

  it('should create component', () => {
    expect(component).toBeTruthy();
  });

  it('should show that date is required', async(() => {
    component.startDate.markAsTouched();

    // detect changes in the fixture
    fixture.detectChanges();

    setTimeout(() => {
      const helpBlockEl = startingDateEl.parentElement.querySelector('.help-block-wrapper');

      expect(helpBlockEl.children.length).toBe(1);
      expect(helpBlockEl.children[0].textContent.trim()).toBe('Starting Date is required.');
    }, 0);
  }));

  it('should show that scan range is required', async(() => {
    component.scanRange.markAsTouched();

    // detect changes in the fixture
    fixture.detectChanges();

    setTimeout(() => {
      const helpBlockEl = scanRangeEl.parentElement.querySelector('.help-block-wrapper');

      expect(helpBlockEl.children.length).toBe(1);
      expect(helpBlockEl.children[0].textContent.trim()).toBe('Scan Range is required.');
    }, 0);
  }));

  it('should show that scan range is invalid', async(() => {
    // set the value of the form control
    component.scanRange.setValue('10a');

    // mark the component as dirty
    component.scanRange.markAsTouched();

    // detect changes in the fixture
    fixture.detectChanges();

    setTimeout(() => {
      const helpBlockEl = scanRangeEl.parentElement.querySelector('.help-block-wrapper');

      expect(helpBlockEl.children.length).toBe(1);
      expect(helpBlockEl.children[0].textContent.trim()).toBe('Scan Range must be a number.');
    }, 0);
  }));

  it('should not show any error messages for scan range', async(() => {
    // set the value of the form control
    component.scanRange.setValue('10');

    // mark the component as dirty
    component.scanRange.markAsDirty();

    // detect changes in the fixture
    fixture.detectChanges();

    setTimeout(() => {
      const helpBlockEl = scanRangeEl.parentElement.querySelector('.help-block-wrapper');

      expect(helpBlockEl.children.length).toBe(0);
    }, 0);
  }));

  it('should contain at least one province', async(() => {
    fixture
      .whenStable()
      .then(() => {
        expect(provinceSelectEl.querySelectorAll('option').length).toBeGreaterThanOrEqual(2);
      })
      ;
  }));

});


