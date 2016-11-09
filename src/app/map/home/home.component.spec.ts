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
import { CookieService } from 'angular2-cookie/core';
import { TranslateModule, TranslateLoader, TranslateStaticLoader, TranslateService } from 'ng2-translate';
import { WindowService } from '../window.service';
import { HomeComponent } from './home.component';

describe('Component: Home', () => {

  beforeEach(() => {
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
        Renderer,
        HomeComponent,

        // using window object in Angular 2 is discouraged since
        // it isn’t only designed to run within your browser, but also on mobiles,
        // the server or web workers where objects like window may not be available.
        { provide: WindowService, useValue: window }
      ]
    });
  });

  it('should create an instance', inject([HomeComponent], (component: HomeComponent) => {
    expect(component).toBeTruthy();
  }));

});


