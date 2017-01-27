/*!
 * NDVI Maps Component
 *
 * Copyright(c) Exequiel Ceasar Navarrete <esnavarrete1@up.edu.ph>
 * Licensed under MIT
 */

import { Component, Inject, OnDestroy, OnInit, Renderer } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';
import { ModalDirective } from 'ng2-bootstrap/modal';
import { LeafletMapService } from '../../leaflet';
import { TileLayerService } from '../tile-layer.service';
import { NdviMapService } from '../ndvi-map.service';
import { AppLoggerService } from '../../app-logger.service';
import { ChartModalComponent, LineChartComponent, SpawnModalService } from '../../ui';
import { Layer } from '../../store';
import { MAP_CONFIG } from '../map.config';
import every from 'lodash-es/every';
import forEach from 'lodash-es/forEach';
import isNaN from 'lodash-es/isNaN';
import map from 'lodash-es/map';
import * as L from 'leaflet';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/mergeMap';
import 'rxjs/add/observable/combineLatest';
import 'rxjs/add/observable/of';
import 'rxjs/add/observable/throw';

@Component({
  selector: 'app-ndvi-maps',
  templateUrl: './ndvi-maps.component.html',
  styleUrls: ['./ndvi-maps.component.sass']
})
export class NdviMapsComponent implements OnDestroy, OnInit {
  public chartData: Observable<any>;
  private _pageTitle: string = 'NDVI Maps';
  private _map: L.Map;
  private _layerId: string;
  private _routerParamSubscription: Subscription;
  private _oldCenter: L.LatLngLiteral;
  private _oldZoom: number;
  private _marker: L.Marker;
  private _mapClickListener: L.EventHandlerFn;
  private _popupClickListener: Function;

  constructor(
    @Inject(MAP_CONFIG) private _config: any,
    private _mapService: LeafletMapService,
    private _tileLayerService: TileLayerService,
    private _ndviMapService: NdviMapService,
    private _modalService: SpawnModalService,
    private _logger: AppLoggerService,
    private _route: ActivatedRoute,
    private _title: Title,
    private _renderer: Renderer,
    private _mapLayersStore: Store<any>
  ) {
    // make sure that the `this` value inside the onMapClick is this component's instance.
    this._mapClickListener = this.onMapClick.bind(this);
  }

  // TODO: create a reusable function to validate date format
  ngOnInit() {
    this._mapService
      .getMap()
      .then((mapInstance: L.Map) => {
        const { lat, lng } = mapInstance.getCenter();
        const popupPane: HTMLElement = mapInstance.getPane('popupPane');

        // store the lat and lng coordinates before we pan into the new coords.
        this._oldCenter = {
          lat,
          lng
        };

        // also store the zoom level
        this._oldZoom = mapInstance.getZoom();

        // save the reference to the map
        this._map = mapInstance;

        // bind the click callback to the click event
        mapInstance.on('click', this._mapClickListener);

        // delegate event to the popup pane and remove it later when the component is removed
        this._popupClickListener = this._renderer.listen(popupPane, 'click', (evt: Event) => {
          const target = (evt.target as HTMLElement);

          // prevent default behavior when either of the links are clicked
          if (target.classList.contains('link--ndvi-time-series') || target.classList.contains('link--ndvi-doy')) {
            evt.preventDefault();
          }

          // check if the clicked element is the time series link.
          // if it is show the time series chart
          if (typeof this._marker !== 'undefined' && target.classList.contains('link--ndvi-time-series')) {
            this.showTimeSeriesChart(this._marker.getLatLng(), '2015-10-01', '2016-10-31');
          }

          // check if the clicked element is the doy link.
          // if it is show the doy chart
          if (typeof this._marker !== 'undefined' && target.classList.contains('link--ndvi-doy')) {
            this.showDayOfTheYearChart(this._marker.getLatLng(), '2015-10-01', '2016-10-31');
          }
        });
      })
      ;

    // get the the route params and query parameters by
    // combining the latest values from the two observables
    this._routerParamSubscription = Observable
      .combineLatest(this._route.params, this._route.queryParams)
      .subscribe((params: [Params, Params]) => {
        const [routeParams, queryParams] = params;

        const converted = parseInt(routeParams['scanRange'], 10);

        // set the center of the map to the value of the center query parameter
        // and zoom to tha location
        if (typeof queryParams['center'] !== 'undefined') {
          const [lat, lng] = queryParams['center'].split(',');

          this._mapService.panTo(parseFloat(lat), parseFloat(lng), 10);
        }

        // check if startDate and scanRange is valid
        if (
          /^\d{4}[\/\-](0[1-9]|1[012])[\/\-](0?[1-9]|[12][0-9]|3[01])$/.test(routeParams['startDate']) &&
          !isNaN(converted)
        ) {
          // set the page title
          this._title.setTitle(`${this._pageTitle} | ${this._config.app_title}`);

          this.processData(routeParams['startDate'], converted, queryParams['province']);
        }
      })
      ;
  }

  onMapClick(evt: Event) {
    const { lat, lng }: L.LatLngLiteral = (evt as any).latlng;
    const originalTarget = (evt as any).originalEvent.target;

    // do nothing when the target element is not the map container
    if (!originalTarget.classList.contains('leaflet-container')) {
      return;
    }

    // remove marker before creating new one
    this.removeMarker();

    // create new marker
    this._marker = L.marker({
      lat,
      lng
    });

    // add the newly created marker to the map
    this._marker.addTo(this._map);

    // show marker and popup to offer user what type of chart data to show
    this._marker
      .bindPopup(this.generatePopupHtml((evt as any).latlng), {
        className: 'leaflet-popup--ndvi-popup'
      })
      .openPopup()
      ;
  }

  showTimeSeriesChart(coords: L.LatLngLiteral, startDate: string, endDate: string) {
    // notify the user about chart generation
    this._logger.log('Data Loading', 'Please wait while we fetch the data and generate the chart.', true);

    this._ndviMapService
      .getNdviTimeSeriesByLatLng(coords, startDate, endDate)
      .mergeMap((data: any) => {
        const isEmpty: boolean = every(data.result, (item: any) => {
          return item.ndvi !== null;
        });

        // throw a new observable containing the error message when all ndvi value are null
        if (isEmpty === false) {
          return Observable.throw(new Error('Please click on a land surface.'));
        }

        // create a new observable out of the data
        return Observable.of(data);
      })
      .map((data: any) => {
        const result: any = {};

        // extract the time and ndvi into separate properties
        result.labels = map(data.result, 'time');
        result.data = map(data.result, 'ndvi');

        return result;
      })
      .subscribe((result: any) => {
        const data = {
          labels: result.labels,
          datasets: [{
            label: 'NDVI',
            data: result.data,
            fill: false,
            backgroundColor: 'rgba(75,192,192,0.4)',
            borderColor: 'rgba(75,192,192,1)',
            borderCapStyle: 'butt',
            borderDash: [],
            borderDashOffset: 0.0,
            borderJoinStyle: 'miter',
            pointBorderColor: 'rgba(75,192,192,1)',
            pointBackgroundColor: '#fff',
            pointBorderWidth: 1,
            pointHoverRadius: 5,
            pointHoverBackgroundColor: 'rgba(75,192,192,1)',
            pointHoverBorderColor: 'rgba(220,220,220,1)',
            pointHoverBorderWidth: 2,
            pointRadius: 1,
            pointHitRadius: 10,
            spanGaps: false
          }]
        };

        // show the chart modal
        this._modalService.spawn({
          component: ChartModalComponent,
          inputs: {
            openImmediately: true,
            title: 'NDVI Time Series Data',
            chartOptions: {
              type: LineChartComponent,
              inputs: {
                data
              }
            }
          }
        });
      }, (error: Error) => {
        // send the error to the logger stream
        this._logger.log('Error loading data', error.message, true);
      })
      ;
  }

  showDayOfTheYearChart(coords: L.LatLngLiteral, startDate: string, endDate: string) {
    console.log('Show doy data');
  }

  removeMarker() {
    // remove any existing marker and its reference
    if (typeof this._marker !== 'undefined' && this._marker !== null) {
      this._marker.removeFrom(this._map);

      this._marker = null;
    }
  }

  processData(startDate: string, scanRange: number, place?: string) {
    // remove all layers published on the store
    this._mapLayersStore.dispatch({
      type: 'REMOVE_ALL_LAYERS'
    });

    this._tileLayerService
      .getNdviLayerData(startDate, scanRange, place)
      .then((response: any) => {
        const tileUrl = this._tileLayerService.getEarthEngineMapUrl(response.mapId, response.mapToken);

        // assemble the layer
        const layer: Layer = {
          id: response.mapId,
          url: tileUrl,
          type: 'ndvi',
          layerOptions: this._tileLayerService.getNdviLayerOptions()
        };

        // set the layer id for the component instance
        this._layerId = response.mapId;

        // clear tile layers before adding it
        return Promise.all([
          Promise.resolve(layer),
          this._mapService.clearTileLayers()
        ]);
      })
      .then((resolvedValue: any) => {
        const layer: Layer = resolvedValue[0];

        // add the new layer to the store
        this._mapLayersStore.dispatch({
          type: 'ADD_LAYER',
          payload: layer
        });

        return this._mapService.addNewTileLayer(layer.id, layer.url, layer.layerOptions);
      })
      .catch((error) => {
        let message = error.message;

        if (typeof error.message === 'undefined') {
          message = 'Data Source not available. Please try again later.';
        }

        // send the error to the stream
        this._logger.log('NDVI Map Data Unavailable', message, true);
      })
      ;
  }

  generatePopupHtml(coords: L.LatLngLiteral): string {
    return `<dl>
        <dt>Latitude:</dt>
        <dd>${coords.lat}</dd>

        <dt>Longitude:</dt>
        <dd>${coords.lng}</dd>

        <dt>NDVI Time Series:</dt>
        <dd>
            <a href="#" class="link link--ndvi-time-series">Show</a>
        </dd>

        <dt>NDVI Day of the Year:</dt>
        <dd>
            <a href="#" class="link link--ndvi-doy">Show</a>
        </dd>
    </dl>`;
  }

  ngOnDestroy() {
    // reset the page title
    this._title.setTitle(`${this._config.app_title}`);

    // go the old zoom and lat,lng coords.
    this._mapService.panTo(this._oldCenter.lat, this._oldCenter.lng, this._oldZoom);

    // remove custom router subscription
    this._routerParamSubscription.unsubscribe();

    // remove the event listener bound to the map
    this._map.off('click', this._mapClickListener);

    // remove the event listener bound by the angular renderer
    this._popupClickListener();

    // remove any existing marker on the map
    this.removeMarker();

    // remove the reference to the map
    this._map = null;

    // remove all layers published on the store
    this._mapLayersStore.dispatch({
      type: 'REMOVE_ALL_LAYERS'
    });

    if (typeof this._layerId !== 'undefined') {
      this._mapService
        .removeTileLayer(this._layerId)
        .catch((error: Error) => {
          console.error(error);
        })
        ;
    }
  }

}


