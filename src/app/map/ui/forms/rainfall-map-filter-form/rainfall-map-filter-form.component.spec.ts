/* tslint:disable:no-unused-variable */

/*!
 * Rainfall Map Filter Form Component Test
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
import { MockRouter } from '../../../../mocks/router';
import { MockLocationsService } from '../../../../mocks/map';
import { AppConfig, APP_CONFIG } from '../../../../app.config';
import { TranslationFactoryLoader } from '../../../../app-translation-factory.service';
import { LocationsService } from '../../../shared';
import { RainfallMapFilterFormComponent } from './rainfall-map-filter-form.component';

describe('Component: RainfallMapFilterForm', () => {
  let component: RainfallMapFilterFormComponent;
  let fixture: ComponentFixture<RainfallMapFilterFormComponent>;
  let mockRouter: MockRouter;

  // elements
  let startDate: DebugElement;
  let startDateEl: HTMLInputElement;
  let endDate: DebugElement;
  let endDateEl: HTMLInputElement;

  beforeEach(async(() => {
    mockRouter = new MockRouter();

    TestBed.configureTestingModule({
      declarations: [
        RainfallMapFilterFormComponent
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
            deps: [Http, APP_CONFIG]
          }
        }),
      ],
      providers: [
        FormBuilder,
        { provide: APP_CONFIG, useValue: AppConfig },
        { provide: Router, useValue: mockRouter },
        { provide: LocationsService, useClass: MockLocationsService }
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RainfallMapFilterFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    // get the starting date and helper element
    startDate = fixture.debugElement.query(By.css('[name="ec_start_date_txt"]'));
    startDateEl = startDate.nativeElement;

    // get the scan range element
    endDate = fixture.debugElement.query(By.css('[name="ec_end_date_txt"]'));
    endDateEl = endDate.nativeElement;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should show that start date is required', async(() => {
    component.startDate.markAsTouched();

    // detect changes in the fixture
    fixture.detectChanges();

    setTimeout(() => {
      const helpBlockEl = startDateEl.parentElement.querySelector('.help-block-wrapper');

      expect(helpBlockEl.children.length).toBe(1);
      expect(helpBlockEl.children[0].textContent.trim()).toBe('Start Date is required.');
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

});


