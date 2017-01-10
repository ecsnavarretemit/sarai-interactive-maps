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
import { Http } from '@angular/http';
import { TranslateModule, TranslateLoader } from 'ng2-translate';
import { FormsModule as SaraiInteractiveMapsFormsModule, FlatpickrComponent } from '../../forms';
import { MockRouter } from '../../mocks/router';
import { TranslationFactoryLoader } from '../../app-translation-factory.service';
import { RainfallMapFilterFormComponent } from './rainfall-map-filter-form.component';

describe('Component: RainfallMapFilterForm', () => {
  let component: RainfallMapFilterFormComponent;
  let fixture: ComponentFixture<RainfallMapFilterFormComponent>;
  let mockRouter: MockRouter;

  // elements
  let scanDate: DebugElement;
  let scanDateEl: HTMLInputElement;

  beforeEach(async(() => {
    mockRouter = new MockRouter();

    TestBed.configureTestingModule({
      declarations: [
        RainfallMapFilterFormComponent
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
        { provide: Router, useValue: mockRouter }
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RainfallMapFilterFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    // get the starting date and helper element
    scanDate = fixture.debugElement.query(By.directive(FlatpickrComponent));
    scanDateEl = scanDate.nativeElement;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should show that date is required', async(() => {
    component.scanDate.markAsTouched();

    // detect changes in the fixture
    fixture.detectChanges();

    setTimeout(() => {
      let helpBlockEl = scanDateEl.parentElement.querySelector('.help-block-wrapper');

      expect(helpBlockEl.children.length).toBe(1);
      expect(helpBlockEl.children[0].textContent.trim()).toBe('Scan Date is required.');
    }, 0);
  }));

});


