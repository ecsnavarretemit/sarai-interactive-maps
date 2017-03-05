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
import { HttpModule, Http } from '@angular/http';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { FormsModule as SaraiInteractiveMapsFormsModule, FlatpickrComponent } from '../../../../forms';
import { LeafletMapService } from '../../../../leaflet';
import { LocationsService } from '../../../shared';
import { MockRouter } from '../../../../mocks/router';
import { MockLocationsService } from '../../../../mocks/map';
import { TranslationFactoryLoader } from '../../../../app-translation-factory.service';
import { NdviFilterFormComponent } from './ndvi-filter-form.component';

describe('Component: NdviFilterForm', () => {
  let component: NdviFilterFormComponent;
  let fixture: ComponentFixture<NdviFilterFormComponent>;
  let mockRouter: MockRouter;

  // elements
  let startingDate: DebugElement;
  let startingDateEl: HTMLInputElement;
  let endDate: DebugElement;
  let endDateEl: HTMLInputElement;
  let provinceSelect: DebugElement;
  let provinceSelectEl: HTMLElement;

  beforeEach(async(() => {
    mockRouter = new MockRouter();

    TestBed.configureTestingModule({
      declarations: [
        NdviFilterFormComponent
      ],
      imports: [
        HttpModule,
        FormsModule,
        ReactiveFormsModule,
        SaraiInteractiveMapsFormsModule,
        TranslateModule.forRoot({
          loader: {
            provide: TranslateLoader,
            useFactory: TranslationFactoryLoader,
            deps: [Http]
          }
        }),
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
    startingDate = fixture.debugElement.query(By.css('[name="ec_starting_date_txt"]'));
    startingDateEl = startingDate.nativeElement;

    // get the scan range element
    endDate = fixture.debugElement.query(By.css('[name="ec_end_date_txt"]'));
    endDateEl = endDate.nativeElement;

    // get the province selector
    provinceSelect = fixture.debugElement.query(By.css('#ec_province_filter_sel'));
    provinceSelectEl = provinceSelect.nativeElement;
  });

  it('should create component', () => {
    expect(component).toBeTruthy();
  });

  it('should show that start date is required', async(() => {
    component.startDate.markAsTouched();

    // detect changes in the fixture
    fixture.detectChanges();

    setTimeout(() => {
      const helpBlockEl = startingDateEl.parentElement.querySelector('.help-block-wrapper');

      expect(helpBlockEl.children.length).toBe(1);
      expect(helpBlockEl.children[0].textContent.trim()).toBe('Starting Date is required.');
    }, 0);
  }));

  it('should show that end date is required', async(() => {
    component.endDate.markAsTouched();

    // detect changes in the fixture
    fixture.detectChanges();

    setTimeout(() => {
      const helpBlockEl = endDateEl.parentElement.querySelector('.help-block-wrapper');

      expect(helpBlockEl.children.length).toBe(1);
      expect(helpBlockEl.children[0].textContent.trim()).toBe('Until Date is required.');
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


