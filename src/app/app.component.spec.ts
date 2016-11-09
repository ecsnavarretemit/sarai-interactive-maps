/* tslint:disable:no-unused-variable */

/*!
 * App Component Test
 *
 * Copyright(c) Exequiel Ceasar Navarrete <esnavarrete1@up.edu.ph>
 * Licensed under MIT
 */

import { TestBed, async } from '@angular/core/testing';
import { APP_BASE_HREF } from '@angular/common';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpModule, Http } from '@angular/http';
import { TooltipModule, AccordionModule, ModalModule } from 'ng2-bootstrap/ng2-bootstrap';
import { TranslateModule, TranslateLoader } from 'ng2-translate';
import { MdCheckboxModule } from '@angular2-material/checkbox';
import { SaraiNg2RoutingModule } from './app-routing.module';
import { StoreModule } from './store';
import { LeafletModule } from './leaflet';
import { MapModule } from './map';

import { CookieService } from 'angular2-cookie/services/cookies.service';
import { AppLoggerService } from './app-logger.service';

import { TranslationFactoryLoader } from './app-translation-factory.service';
import { MapLayersReducer, SuitabilityLevelsReducer } from './store';

import { AppComponent } from './app.component';

describe('App: SaraiNg2', () => {

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        SaraiNg2RoutingModule,
        FormsModule,
        ReactiveFormsModule,
        HttpModule,
        TooltipModule,
        AccordionModule,
        ModalModule,
        MdCheckboxModule,
        StoreModule,
        LeafletModule,
        MapModule,
        TranslateModule.forRoot({
          provide: TranslateLoader,
          useFactory: TranslationFactoryLoader,
          deps: [Http]
        })
      ],

      declarations: [
        AppComponent
      ],

      providers: [
        AppLoggerService,
        CookieService,

        { provide: APP_BASE_HREF, useValue: '/' }
      ]
    });
  });

  it('should create the app', async(() => {
    let fixture = TestBed.createComponent(AppComponent);
    let app = fixture.debugElement.componentInstance;
    expect(app).toBeTruthy();
  }));

});


