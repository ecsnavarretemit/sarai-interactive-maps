/* tslint:disable:no-unused-variable */

/*!
 * Download Image Form Component Test
 *
 * Copyright(c) Exequiel Ceasar Navarrete <esnavarrete1@up.edu.ph>
 * Licensed under MIT
 */

import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';
import { FormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LoggerService } from '../../../../shared';
import { LocationsService, SuitabilityMapService } from '../../../shared';
import { MockLocationsService, MockSuitabilityMapService } from '../../../../mocks/map';
import { DownloadImageFormComponent } from './download-image-form.component';

describe('Component: DownloadImageForm', () => {
  let component: DownloadImageFormComponent;
  let fixture: ComponentFixture<DownloadImageFormComponent>;

  // elements
  let cropSelect: DebugElement;
  let cropSelectEl: HTMLSelectElement;
  let regionSelect: DebugElement;
  let regionSelectEl: HTMLSelectElement;
  let provinceSelect: DebugElement;
  let provinceSelectEl: HTMLSelectElement;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        DownloadImageFormComponent
      ],
      imports: [
        FormsModule,
        ReactiveFormsModule
      ],
      providers: [
        FormBuilder,
        LoggerService,
        { provide: SuitabilityMapService, useClass: MockSuitabilityMapService },
        { provide: LocationsService, useClass: MockLocationsService }
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DownloadImageFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    // get the crop selector element
    cropSelect = fixture.debugElement.query(By.css('#ec_crop_sel'));
    cropSelectEl = cropSelect.nativeElement;
    regionSelect = fixture.debugElement.query(By.css('#ec_region_sel'));
    regionSelectEl = regionSelect.nativeElement;
    // get the province selector
    provinceSelect = fixture.debugElement.query(By.css('#ec_province_sel'));
    provinceSelectEl = provinceSelect.nativeElement;
  });

  it('should create an instance', () => {
    expect(component).toBeTruthy();
  });

  it('should contain at least one crop', async(() => {
    fixture
      .whenStable()
      .then(() => {
        expect(cropSelectEl.querySelectorAll('option').length).toBeGreaterThanOrEqual(2);
      })
      ;
  }));

  it('should show that crop is required', async(() => {
    component.selectCrop.markAsTouched();

    // detect changes in the fixture
    fixture.detectChanges();

    setTimeout(() => {
      const helpBlockEl = cropSelectEl.parentElement.querySelector('.help-block-wrapper');

      expect(helpBlockEl.children.length).toBe(1);
      expect(helpBlockEl.children[0].textContent.trim()).toBe('Crop is required.');
    }, 0);
  }));

  it('should contain at least one region', async(() => {
    fixture
      .whenStable()
      .then(() => {
        expect(regionSelectEl.querySelectorAll('option').length).toBeGreaterThanOrEqual(2);
      })
      ;
  }));

  it('should show that region is required', async(() => {
    component.selectRegion.markAsTouched();

    // detect changes in the fixture
    fixture.detectChanges();

    setTimeout(() => {
      const helpBlockEl = regionSelectEl.parentElement.querySelector('.help-block-wrapper');

      expect(helpBlockEl.children.length).toBe(1);
      expect(helpBlockEl.children[0].textContent.trim()).toBe('Region is required.');
    }, 0);
  }));

  it('should show that province enabled by selecting a region', async(() => {
    fixture
      .whenStable()
      .then(() => {
        component.selectRegion.setValue({
          id: 100,
          name: 'Ilocos Region',
          slug: 'ilocos-region-region-i'
        });

        component.selectRegion.markAsDirty();

        // detect changes in the fixture
        fixture.detectChanges();

        expect(provinceSelectEl.disabled).toBeFalsy();
      })
      ;
  }));

  it('should contain at least one province', async(() => {
    fixture
      .whenStable()
      .then(() => {
        component.selectRegion.setValue({
          id: 100,
          name: 'Ilocos Region',
          slug: 'ilocos-region-region-i'
        });

        component.selectRegion.markAsDirty();

        // detect changes in the fixture
        fixture.detectChanges();

        expect(provinceSelectEl.disabled).toBeFalsy();
        expect(provinceSelectEl.querySelectorAll('option').length).toBeGreaterThanOrEqual(2);
      })
      ;
  }));

});


