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
import { Title } from '@angular/platform-browser';
import { CookieService } from 'angular2-cookie/core';
import { TranslateModule, TranslateLoader, TranslateService } from 'ng2-translate';
import { Angulartics2 } from 'angulartics2';
import { SpawnModalService } from '../../../../ui';
import { TranslationFactoryLoader } from '../../../../app-translation-factory.service';
import { WindowService } from '../../../window.service';
import { AppLoggerService } from '../../../../app-logger.service';
import { MapConfig, MAP_CONFIG } from '../../../map.config';
import { MockRouter } from '../../../../mocks/router';
import { MockAngulartics2 } from '../../../../mocks/angulartics2';
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
          useFactory: TranslationFactoryLoader,
          deps: [Http]
        }),
      ],

      providers: [
        CookieService,
        TranslateService,
        AppLoggerService,
        Renderer,
        WindowService,
        SpawnModalService,
        Title,
        HomeComponent,

        { provide: MAP_CONFIG, useValue: MapConfig },
        { provide: Router, useValue: mockRouter },
        { provide: Angulartics2, useClass: MockAngulartics2 }
      ]
    });
  });

  it('should create an instance', inject([HomeComponent], (component: HomeComponent) => {
    expect(component).toBeTruthy();
  }));

});


