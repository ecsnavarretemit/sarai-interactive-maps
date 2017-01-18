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
import { Http } from '@angular/http';
import { ModalModule, TooltipModule, AccordionModule } from 'ng2-bootstrap';
import { TranslateModule, TranslateLoader } from 'ng2-translate';
import { Angulartics2Module, Angulartics2, Angulartics2GoogleAnalytics } from 'angulartics2';
import { SaraiInteractiveMapsRoutingModule } from './app-routing.module';
import { StoreModule } from './store';
import { MapModule } from './map';

import { CookieService } from 'angular2-cookie/services/cookies.service';
import { AppLoggerService } from './app-logger.service';
import { TranslationFactoryLoader } from './app-translation-factory.service';
import { MockAngulartics2, MockAngulartics2GoogleAnalytics } from './mocks/angulartics2';

import { AppComponent } from './app.component';

describe('App: SaraiInteractiveMaps', () => {

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        SaraiInteractiveMapsRoutingModule,
        ModalModule.forRoot(),
        TooltipModule.forRoot(),
        AccordionModule.forRoot(),
        StoreModule,
        MapModule,
        TranslateModule.forRoot({
          provide: TranslateLoader,
          useFactory: TranslationFactoryLoader,
          deps: [Http]
        }),
        Angulartics2Module.forRoot([
          Angulartics2GoogleAnalytics
        ])
      ],

      declarations: [
        AppComponent
      ],

      providers: [
        AppLoggerService,
        CookieService,

        { provide: Angulartics2, useClass: MockAngulartics2 },
        { provide: Angulartics2GoogleAnalytics, useClass: MockAngulartics2GoogleAnalytics },
        { provide: APP_BASE_HREF, useValue: '/' }
      ]
    });
  });

  it('should create the app', async(() => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.debugElement.componentInstance;

    expect(app).toBeTruthy();
  }));

});


