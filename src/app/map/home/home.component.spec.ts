/* tslint:disable:no-unused-variable */

/*!
 * Home Component Test
 *
 * Copyright(c) Exequiel Ceasar Navarrete <esnavarrete1@up.edu.ph>
 * Licensed under MIT
 */

import { Renderer } from '@angular/core';
import { TestBed, async, inject } from '@angular/core/testing';
import { Http, HttpModule} from '@angular/http';
import { Router } from '@angular/router';
import { CookieService } from 'angular2-cookie/core';
import { TranslateModule, TranslateLoader, TranslateStaticLoader, TranslateService } from 'ng2-translate';
import { WindowService } from '../window.service';
import { AppLoggerService } from '../../app-logger.service';
import { MockRouter } from '../../mocks/router';
import { HomeComponent } from './home.component';

describe('Component: Home', () => {
  let mockRouter: MockRouter;

  beforeEach(() => {
    mockRouter = new MockRouter();

    TestBed.configureTestingModule({
      imports: [
        HttpModule,
        TranslateModule.forRoot({
          provide: TranslateLoader,
          useFactory: (http: Http) => new TranslateStaticLoader(http, '/assets/i18n', '.json'),
          deps: [Http]
        }),
      ],

      providers: [
        CookieService,
        TranslateService,
        AppLoggerService,
        Renderer,
        WindowService,
        HomeComponent,

        { provide: Router, useValue: mockRouter },
      ]
    });
  });

  it('should create an instance', inject([HomeComponent], (component: HomeComponent) => {
    expect(component).toBeTruthy();
  }));

});


