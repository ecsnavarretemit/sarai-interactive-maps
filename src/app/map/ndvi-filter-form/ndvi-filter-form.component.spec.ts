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
import { Http, BaseRequestOptions, RequestMethod, Response, ResponseOptions } from '@angular/http';
import { MockBackend, MockConnection } from '@angular/http/testing';
import { Router } from '@angular/router';
import { FormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LeafletMapService } from '../../leaflet';
import { LocationsService } from '../locations.service';
import { MockRouter } from '../../mocks/router';
import { MapConfig, MAP_CONFIG } from '../map.config';

import { NdviFilterFormComponent } from './ndvi-filter-form.component';

describe('Component: NdviFilterForm', () => {
  let component: NdviFilterFormComponent;
  let fixture: ComponentFixture<NdviFilterFormComponent>;
  let mockRouter: MockRouter;

  beforeEach(async(() => {
    mockRouter = new MockRouter();

    TestBed.configureTestingModule({
      declarations: [
        NdviFilterFormComponent
      ],
      imports: [
        FormsModule,
        ReactiveFormsModule
      ],
      providers: [
        MockBackend,
        BaseRequestOptions,
        FormBuilder,
        LeafletMapService,
        LocationsService,

        { provide: Router, useValue: mockRouter },
        { provide: MAP_CONFIG, useValue: MapConfig },
        {
          provide: Http,
          deps: [MockBackend, BaseRequestOptions],
          useFactory: (backendInstance: MockBackend, defaultOptions: BaseRequestOptions) => {
            return new Http(backendInstance, defaultOptions);
          }
        },
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NdviFilterFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create component', () => {
    expect(component).toBeTruthy();
  });

});


