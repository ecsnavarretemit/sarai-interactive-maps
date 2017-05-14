/*!
 * Rainfall Maps Component
 *
 * Copyright(c) Exequiel Ceasar Navarrete <esnavarrete1@up.edu.ph>
 * Licensed under MIT
 */

import { Component, ElementRef, Inject, OnInit, OnDestroy, Renderer, ViewChild } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';
import { LeafletMapService } from '../../../../leaflet';
import { RainfallMapService } from '../rainfall-map.service';
import { TileLayerService } from '../../../shared';
import { LoggerService } from '../../../../shared';
import { ChartModalComponent, LineChartComponent, SpawnModalService } from '../../../../ui';
import { Layer } from '../../../../store';
import { APP_CONFIG } from '../../../../app.config';
import * as Chart from 'chart.js';
import * as moment from 'moment';
import * as L from 'leaflet';
import assign from 'lodash-es/assign';
import forEach from 'lodash-es/forEach';
import map from 'lodash-es/map';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/filter';
import 'rxjs/add/observable/combineLatest';
import 'rxjs/add/observable/fromPromise';

@Component({
  selector: 'app-rainfall-maps',
  templateUrl: './rainfall-maps.component.html',
  styleUrls: ['./rainfall-maps.component.sass']
})
export class RainfallMapsComponent implements OnInit, OnDestroy {
  private _pageTitle = 'Rainfall Maps';
  private _layerId: string;
  private _map: L.Map;
  private _marker: L.Marker;
  private _mapClickListener: L.EventHandlerFn;
  private _popupEventListeners: Array<Function> = [];
  private _currentStartDate: string;
  private _currentEndDate: string;
  private _oldCumulativeRainfallData: any;
  private _oldCenter: L.LatLngLiteral;
  private _oldZoom: number;
  private _routerParamSubscription: Subscription;
  private _mapSubscription: Subscription;

  @ViewChild('downloadFile') downloadFile: ElementRef;

  constructor(
    @Inject(APP_CONFIG) private _globalConfig: any,
    private _mapService: LeafletMapService,
    private _tileLayerService: TileLayerService,
    private _rainfallMapService: RainfallMapService,
    private _modalService: SpawnModalService,
    private _logger: LoggerService,
    private _route: ActivatedRoute,
    private _title: Title,
    private _renderer: Renderer,
    private _store: Store<any>
  ) {
    // make sure that the `this` value inside the onMapClick is this component's instance.
    this._mapClickListener = this.onMapClick.bind(this);
  }

  ngOnInit() {
    this._mapService
      .getMap()
      .then((mapInstance: L.Map) => {
        const { lat, lng } = mapInstance.getCenter();

        // store the lat and lng coordinates before we pan into the new coords.
        this._oldCenter = {
          lat,
          lng
        };

        // also store the zoom level
        this._oldZoom = mapInstance.getZoom();

        // save the reference to the map
        this._map = mapInstance;
      });

    this._mapSubscription = Observable
      .combineLatest(Observable.fromPromise(this._mapService.getMap()), this._route.params, this._route.queryParams)
      .do((params: [L.Map, Params, Params]) => {
        const [mapInstance, , ] = params;

        // remove any existing marker on the map
        this.removeMarker();

        // remove the event listener bound to the map
        mapInstance.off('click', this._mapClickListener);

        // remove the event listener bound by the angular renderer
        forEach(this._popupEventListeners, (listener: Function) => {
          listener();
        });

        // empty up the array
        this._popupEventListeners = [];
      })
      .filter((params: [L.Map, Params, Params]) => {
        const [ , routeParams, ] = params;

        return (
          /^\d{4}[\/\-](0[1-9]|1[012])[\/\-](0?[1-9]|[12][0-9]|3[01])$/.test(routeParams['startDate']) &&
          /^\d{4}[\/\-](0[1-9]|1[012])[\/\-](0?[1-9]|[12][0-9]|3[01])$/.test(routeParams['endDate'])
        );
      })
      .subscribe((params: [L.Map, Params, Params]) => {
        const [mapInstance, , ] = params;
        const popupPane: HTMLElement = mapInstance.getPane('popupPane');

        // bind the click callback to the click event
        mapInstance.on('click', this._mapClickListener);

        // setup map click event listener
        this.setupMapClick(popupPane);
      })
      ;

    // get the the route params and query parameters by
    // combining the latest values from the two observables
    this._routerParamSubscription = Observable
      .combineLatest(this._route.params, this._route.queryParams)
      .subscribe((params: [Params, Params]) => {
        const [routeParams, queryParams] = params;

        // set the center of the map to the value of the center query parameter
        // and zoom to tha location
        if (typeof queryParams['center'] !== 'undefined') {
          const [lat, lng] = queryParams['center'].split(',');

          this._mapService.panTo(parseFloat(lat), parseFloat(lng), 10);
        } else if (typeof this._oldCenter !== 'undefined' && typeof this._oldZoom !== 'undefined') {
          // go to the old zoom and lat,lng coords.
          this._mapService.panTo(this._oldCenter.lat, this._oldCenter.lng, this._oldZoom);
        }

        // check if startDate and endDate is valid
        if (
          /^\d{4}[\/\-](0[1-9]|1[012])[\/\-](0?[1-9]|[12][0-9]|3[01])$/.test(routeParams['startDate']) &&
          /^\d{4}[\/\-](0[1-9]|1[012])[\/\-](0?[1-9]|[12][0-9]|3[01])$/.test(routeParams['endDate'])
        ) {
          // set the page title
          this._title.setTitle(`${this._pageTitle} | ${this._globalConfig.app_title}`);

          // save the new values of start and end date
          this._currentStartDate = routeParams['startDate'];
          this._currentEndDate = routeParams['endDate'];

          // activate the panel
          this._store.dispatch({
            type: 'ACTIVATE_PANEL',
            payload: 'ndvi-maps'
          });

          this.processData(this._currentStartDate, this._currentEndDate, queryParams['province']);
        } else {
          // add the panel to the store
          this._store.dispatch({
            type: 'DEACTIVATE_PANEL',
            payload: 'ndvi-maps'
          });
        }
      })
      ;

    // receive outputs from the dynamically create modal
    this._modalService.outputStream
      .debounceTime(300)
      .subscribe((output: any) => {
        switch (output.type) {
          case 'image':
            // download image
            this._renderer.setElementProperty(this.downloadFile.nativeElement, 'href', output.data);
            this._renderer.setElementProperty(this.downloadFile.nativeElement, 'download', 'chart.jpg');
            this._renderer.setElementProperty(this.downloadFile.nativeElement, 'target', '_self');
            this._renderer.invokeElementMethod(this.downloadFile.nativeElement, 'click');
            break;

          case 'csv':
            this._renderer.setElementProperty(this.downloadFile.nativeElement, 'href', output.metadata.endpoint);
            this._renderer.setElementProperty(this.downloadFile.nativeElement, 'target', '_blank');
            this._renderer.invokeElementMethod(this.downloadFile.nativeElement, 'click');

            break;
        }
      })
      ;
  }

  setupMapClick(targetEl: HTMLElement) {
    let queryDataChanged = false;

    let oldQueryData = {
      startDate: null,
      endDate: null,
      markerPos: null
    };

    // create delegate function to handle event delegation
    const delegate = (el: any, eventName: string, selector: string, callback: Function) => {
      return this._renderer.listen(el, eventName, (evt: Event) => {
        const possibleTargets = el.querySelectorAll(selector);
        const target = evt.target;

        const l = possibleTargets.length;
        for (let i = 0; i < l; i++) {
          const p = possibleTargets[i];
          let resolvedEl: any = target;

          while (resolvedEl && resolvedEl !== el) {
            if (resolvedEl === p) {
              return callback.call(p, evt);
            }

            resolvedEl = resolvedEl.parentNode;
          }
        }
      });
    };

    const checkQueryChanged = () => {
      const markerPos: L.LatLng = this._marker.getLatLng();

      // if the marker position, startDate and endDate has not changed set the queryDataChanged to false
      if (
        (oldQueryData.startDate !== null && oldQueryData.startDate === this._currentStartDate) &&
        (oldQueryData.endDate !== null && oldQueryData.endDate === this._currentEndDate) &&
        (oldQueryData.markerPos !== null && (markerPos.lat === oldQueryData.markerPos.lat && markerPos.lng === oldQueryData.markerPos.lng))
      ) {
        queryDataChanged = false;
      }

      // if the marker position, startDate and endDate has changed set the queryDataChanged to true
      // and invalidate any cached data.
      if (
        (oldQueryData.startDate !== null && oldQueryData.startDate !== this._currentStartDate) ||
        (oldQueryData.endDate !== null && oldQueryData.endDate !== this._currentEndDate) ||
        (oldQueryData.markerPos !== null && (markerPos.lat !== oldQueryData.markerPos.lat || markerPos.lng !== oldQueryData.markerPos.lng))
      ) {
        queryDataChanged = true;

        oldQueryData = {
          markerPos,
          startDate: this._currentStartDate,
          endDate: this._currentEndDate
        };

        this._oldCumulativeRainfallData = undefined;
      }

      if (oldQueryData.markerPos === null) {
        oldQueryData.markerPos = this._marker.getLatLng();
      }

      if (oldQueryData.startDate === null) {
        oldQueryData.startDate = this._currentStartDate;
      }

      if (oldQueryData.endDate === null) {
        oldQueryData.endDate = this._currentEndDate;
      }
    };

    // listen to click events by delegating click event to the targetEl
    this._popupEventListeners.push(delegate(targetEl, 'click', '.link--cumulative-rainfall', (evt: Event) => {
      const markerPos: L.LatLng = this._marker.getLatLng();

      // prevent default behavior when either of the links are clicked
      evt.preventDefault();

      // check if there is changes to the query
      checkQueryChanged();

      this.showCumulativeRainfallChart(markerPos, this._currentStartDate, this._currentEndDate, queryDataChanged);
    }));

    this._popupEventListeners.push(delegate(targetEl, 'click', '.link--delete-marker', (evt: Event) => {
      // prevent default behavior when either of the links are clicked
      evt.preventDefault();

      this.removeMarker();
    }));
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
        className: 'leaflet-popup--rainfall leaflet-popup--with-footer-controls'
      })
      .openPopup()
      ;
  }

  showCumulativeRainfallChart(coords: L.LatLngLiteral, startDate: string, endDate: string, changed = true) {
    const parsedStartDate = moment(startDate, 'YYYY-MM-DD');
    const parsedEndDate = moment(endDate, 'YYYY-MM-DD');
    let dataObservable: Observable<any>;

    // assemble endpoint for download link
    const endpoint = this._rainfallMapService.getDailyRainfallByLatLngEndpoint(coords, startDate, endDate, 'csv');

    if (changed === false && typeof this._oldCumulativeRainfallData !== 'undefined') {
      dataObservable = Observable.of(this._oldCumulativeRainfallData);
    } else {
      // notify the user about chart generation
      this._logger.log('Data Loading', 'Please wait while we fetch the data and generate the chart.', true);

      dataObservable = this._rainfallMapService
        .getDailyRainfallByLatLng(coords, startDate, endDate)
        .map((data: any) => {
          this._oldCumulativeRainfallData = data;

          return data;
        })
        ;
    }

    dataObservable
      .delay(300)
      .map((data: any) => {
        // extract the time and ndvi into separate properties
        const labels = map(data.result, (item: any) => {
          return moment(item['time'], 'YYYY-MM-DD').format('MMMM D, YYYY');
        });

        const dataset: Chart.ChartDataSets = this.genereateChartDataSetOption({
          data: map(data.result, 'rainfall'),
          label: 'Cumulative Rainfall'
        });

        return {
          labels,
          datasets: [
            dataset
          ]
        };
      })
      .subscribe((data: Chart.LinearChartData) => {
        const yTicks: Chart.LinearTickOptions = {
          beginAtZero: true,
          stepSize: 50
        };

        const options: Chart.ChartOptions = {
          maintainAspectRatio: false,
          responsive: true,
          scales: {
            yAxes: [{
              scaleLabel: {
                display: true,
                labelString: 'mm'
              },
              ticks: yTicks
            }],
            xAxes: [{
              scaleLabel: {
                display: true,
                labelString: 'Date'
              }
            }]
          }
        };

        const modalTitle = `Daily Rainfall Data (${parsedStartDate.format('MMMM D, YYYY')} to \
                            ${parsedEndDate.format('MMMM D, YYYY')}) for coordinates ${coords.lat.toFixed(5)}, ${coords.lng.toFixed(5)}`;

        // show the chart modal
        this._modalService.spawn({
          component: ChartModalComponent,
          inputs: {
            title: modalTitle,
            openImmediately: true,
            metadata: {
              endpoint
            },
            chartOptions: {
              type: LineChartComponent,
              inputs: {
                data,
                options
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

  removeMarker() {
    // remove any existing marker and its reference
    if (typeof this._marker !== 'undefined' && this._marker !== null) {
      this._marker.removeFrom(this._map);

      this._marker = null;
    }
  }

  processData(startDate: string, endDate: string, place?: string) {
    // remove all layers published on the store
    this._store.dispatch({
      type: 'REMOVE_ALL_LAYERS'
    });

    this._tileLayerService
      .getRainfallMapLayerData(startDate, endDate, place)
      .then((response: any) => {
        const tileUrl = this._tileLayerService.getEarthEngineMapUrl(response.mapId, response.mapToken);

        // assemble the layer
        const layer: Layer = {
          id: response.mapId,
          url: tileUrl,
          type: 'rainfall',
          layerOptions: this._tileLayerService.getRainFallLayerOptions()
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
        this._store.dispatch({
          type: 'ADD_LAYER',
          payload: layer
        });

        return this._mapService.addNewTileLayer(layer.id, layer.url, layer.layerOptions);
      })
      .catch((error: Error) => {
        let message = error.message;

        if (typeof error.message === 'undefined') {
          message = 'Data Source not available. Please try again later.';
        }

        // send the error to the stream
        this._logger.log('Rainfall Map Data Unavailable', message, true);
      })
      ;
  }

  genereateChartDataSetOption(dataset: any): Chart.ChartDataSets {
    return assign({}, {
      fill: false,
      backgroundColor: 'rgba(75, 192, 192, 0.4)',
      borderColor: 'rgba(75, 192, 192, 1)',
      borderCapStyle: 'butt',
      borderDash: [],
      borderDashOffset: 0.0,
      borderJoinStyle: 'miter',
      pointBorderColor: 'rgba(75, 192, 192, 1)',
      pointBackgroundColor: '#fff',
      pointBorderWidth: 1,
      pointHoverRadius: 3,
      pointHoverBackgroundColor: 'rgba(75, 192, 192, 1)',
      pointHoverBorderColor: 'rgba(220, 220, 220, 1)',
      pointHoverBorderWidth: 1,
      pointRadius: 0,
      pointHitRadius: 10,
      spanGaps: false
    }, dataset);
  }

  generatePopupHtml(coords: L.LatLngLiteral): string {
    return `<dl class="list list--feature-info">
      <dt class="list__item list__item--key">Latitude:</dt>
      <dd class="list__item list__item--value">${coords.lat.toFixed(5)}</dd>

      <dt class="list__item list__item--key">Longitude:</dt>
      <dd class="list__item list__item--value">${coords.lng.toFixed(5)}</dd>

      <dt class="list__item list__item--key">5-day Rainfall:</dt>
      <dd class="list__item list__item--value">
          <a href="#" class="link link--cumulative-rainfall">
            <i class="fa fa-line-chart link__icon" aria-hidden="true"></i>
            <span class="link__text">Show</span>
          </a>
      </dd>

    <ul class="list list-unstyled clearfix popup-controls">
      <li class="list__item">
        <a href="#" class="link link--delete-marker">
          <i class="glyphicon glyphicon-trash link__icon"></i>
          <span class="link__text">Remove Marker</span>
        </a>
      </li>
    </ul>`;
  }

  ngOnDestroy() {
    // reset the page title
    this._title.setTitle(`${this._globalConfig.app_title}`);

    // go to the old zoom and lat,lng coords.
    this._mapService.panTo(this._oldCenter.lat, this._oldCenter.lng, this._oldZoom);

    // remove custom router subscription
    this._routerParamSubscription.unsubscribe();

    // remove the combination of map and router subscription
    this._mapSubscription.unsubscribe();

    // remove the event listener bound to the map
    this._map.off('click', this._mapClickListener);

    // remove the event listener bound by the angular renderer
    forEach(this._popupEventListeners, (listener: Function) => {
      listener();
    });

    // remove any existing marker on the map
    this.removeMarker();

    // remove the reference to the map
    this._map = null;

    // remove all layers published on the store
    this._store.dispatch({
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


