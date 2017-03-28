/*!
 * Home Component
 *
 * Copyright(c) Exequiel Ceasar Navarrete <esnavarrete1@up.edu.ph>
 * Licensed under MIT
 */

import { AfterViewInit, Component, ElementRef, Inject, isDevMode, OnDestroy, OnInit, QueryList, Renderer, ViewChild, ViewChildren } from '@angular/core';
import { Router } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { Subscription } from 'rxjs/Subscription';
import { ModalDirective } from 'ng2-bootstrap/modal';
import { TooltipDirective } from 'ng2-bootstrap/tooltip';
import { CookieService } from 'ngx-cookie';
import { Angulartics2 } from 'angulartics2';
import { TranslateService } from '@ngx-translate/core';
import { LeafletMapService } from '../../../../leaflet';
import { PdfPreviewModalComponent, SpawnModalService } from '../../../../ui';
import { LoggerService, WindowService } from '../../../../shared';
import { LeafletButtonComponent } from '../../../../leaflet';
import { MapTypeComponent } from '../map-type/map-type.component';
import { APP_CONFIG } from '../../../../app.config';
import filter from 'lodash-es/filter';
import forEach from 'lodash-es/forEach';
import * as L from 'leaflet';
import 'rxjs/add/operator/delay';
import 'rxjs/add/operator/skip';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.sass']
})
export class HomeComponent implements AfterViewInit, OnInit, OnDestroy {
  public layersOpacity = 0.6;
  public mapZoom = 6;
  public mapLoaderVisible = false;
  public mapCoords: L.LatLngLiteral;
  private _currentLang: string;
  private _cookieLangKey: string;
  private _langChangeSubscription: Subscription;

  @ViewChild('controlWrapperUpperRight') controlWrapperUpperRight: ElementRef;
  @ViewChild('translateTooltip') translateTooltip: TooltipDirective;
  @ViewChildren('mapTileLoader') mapTileLoader: QueryList<ElementRef>;
  @ViewChildren(MapTypeComponent) mapTypes: QueryList<MapTypeComponent>;

  constructor(
    @Inject(APP_CONFIG) private _globalConfig: any,
    public _router: Router,
    private _window: WindowService,
    private _mapService: LeafletMapService,
    private _logger: LoggerService,
    private _modal: SpawnModalService,
    private _translate: TranslateService,
    private _cookieService: CookieService,
    private _renderer: Renderer,
    private _title: Title,
    private _angulartics: Angulartics2
  ) {
    // initialize language and cookie values
    this._currentLang = _globalConfig.default_lang;
    this._cookieLangKey = _globalConfig.lang_cookie_name;

    // retreive language preference from the cookie
    let lang = this._cookieService.get(this._cookieLangKey);

    if (typeof lang === 'undefined') {
      this._cookieService.put(this._cookieLangKey, this._currentLang);

      // use the default language
      lang = this._currentLang;
    }

    // this language will be used as a fallback when a translation isn't found in the current language
    this._translate.setDefaultLang(_globalConfig.default_lang);

    // the lang to use, if the lang isn't available, it will use the current loader to get them
    this._translate.use(lang);
  }

  ngOnInit() {
    // set default coords for the map
    this.mapCoords = {
      lat: 13,
      lng: 122
    };

    // set the page title
    this._title.setTitle(`${this._globalConfig.app_title}`);

    // listen to the translation change and skip the first language change
    // since it is the default language being emitted
    this._langChangeSubscription = this._translate.onLangChange
      .skip(1)
      .delay(300)
      .subscribe((val: any) => {
        // show the tooltip with the new content after n ms
        if (!this.translateTooltip.isOpen) {
          this.translateTooltip.show();
        }

        // invoke resize event since we do not have the access to the tooltip's `nativeElement`
        this._renderer.invokeElementMethod(this._window.getNativeWindow(), 'dispatchEvent', [
          new Event('resize')
        ]);
      })
      ;

    this._mapService.mapLoaderStream.subscribe((tileLayerDetails: any) => {
      this.mapLoaderVisible = !tileLayerDetails.loaded;
    });
  }

  ngAfterViewInit() {
    this.mapTileLoader.changes
      .filter((queryList: QueryList<ElementRef>) => (queryList.length > 0))
      .subscribe((queryList: QueryList<ElementRef>) => {
        this._renderer.setElementClass(queryList.first.nativeElement, 'preloader--visible', true);
      })
      ;
  }

  shouldActivateMapType(urlPart: string): boolean {
    return this._router.isActive(urlPart, false);
  }

  togglePanels(mapType: MapTypeComponent) {
    this.mapTypes
      .filter((mapTypeItem: MapTypeComponent) => {
        return mapType !== mapTypeItem && mapTypeItem.active === true;
      })
      .forEach((mapTypeItem: MapTypeComponent) => {
        mapTypeItem.toggleActiveState();
      })
      ;
  }

  onTileSelectorHide(event) {
    // add class to the element when the tile selector control is hidden
    this._renderer.setElementClass(
      this.controlWrapperUpperRight.nativeElement,
      'control-wrapper--tile-selector-hidden',
      true
    );
  }

  onTileSelectorShow(event) {
    // remove class to the element when the tile selector control is visible
    this._renderer.setElementClass(
      this.controlWrapperUpperRight.nativeElement,
      'control-wrapper--tile-selector-hidden',
      false
    );
  }

  openNewWindow(event: Event, windowUrl: string, windowName: string, windowFeatures = '') {
    // prevent default behavior
    event.preventDefault();

    if (typeof windowUrl === 'undefined') {
      return;
    }

    // open new window
    this._window.getNativeWindow().open(windowUrl, windowName, windowFeatures);
  }

  changeLang(event: Event) {
    // prevent the default behavior
    event.preventDefault();

    // hide the tooltip first before doing some language switch
    this.translateTooltip.hide();

    // switch the language
    if (this._currentLang === 'en') {
      this._currentLang = 'fil';
    } else {
      this._currentLang = 'en';
    }

    // store the new language preference
    this._cookieService.put(this._cookieLangKey, this._currentLang);

    // change the current language
    this._translate.use(this._currentLang);
  }

  onDownload(data: any) {
    // track events on download when prod mode and tracking is enabled
    if (data.track === true && isDevMode() === false && typeof data.trackingProperties !== 'undefined') {
      this._angulartics.eventTrack.next(data.trackingProperties);
    }
  }

  previewPdf(pdfMetadata: any) {
    let title = 'PDF Preview';

    if (typeof pdfMetadata.title !== 'undefined') {
      title = `${pdfMetadata.title} (${title})`;
    }

    // show a modal saying the pdf is not available if `pdfMetadata.url` is set to false
    // else show a modal that contains the PDF preview
    if (pdfMetadata.url !== false) {
      // show an alert modal
      this._modal.spawn({
        component: PdfPreviewModalComponent,
        inputs: {
          openImmediately: true,
          title,
          src: pdfMetadata.url,
          downloadFilename: pdfMetadata.filename
        }
      });
    } else {
      this._logger.log('Image not available', 'Map image not available.', true);
    }
  }

  ngOnDestroy() {
    // remove language change subscription
    this._langChangeSubscription.unsubscribe();
  }

}


