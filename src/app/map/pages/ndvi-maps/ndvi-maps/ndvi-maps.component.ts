/*!
 * NDVI Maps Component
 *
 * Copyright(c) Exequiel Ceasar Navarrete <esnavarrete1@up.edu.ph>
 * Licensed under MIT
 */

import { Component, ElementRef, Inject, OnDestroy, OnInit, Renderer, ViewChild } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';
import { ModalDirective } from 'ng2-bootstrap/modal';
import { LeafletMapService } from '../../../../leaflet';
import { TileLayerService } from '../../../shared';
import { NdviMapService } from '../ndvi-map.service';
import { LoggerService } from '../../../../shared';
import { ChartModalComponent, LineChartComponent, SpawnModalService } from '../../../../ui';
import { Layer } from '../../../../store';
import { APP_CONFIG } from '../../../../app.config';
import { MAP_CONFIG } from '../../../map.config';
import assign from 'lodash-es/assign';
import fill from 'lodash-es/fill';
import forEach from 'lodash-es/forEach';
import isNaN from 'lodash-es/isNaN';
import map from 'lodash-es/map';
import reduce from 'lodash-es/reduce';
import * as Chart from 'chart.js';
import * as moment from 'moment';
import * as L from 'leaflet';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/delay';
import 'rxjs/add/observable/combineLatest';
import 'rxjs/add/observable/of';

@Component({
  selector: 'app-ndvi-maps',
  templateUrl: './ndvi-maps.component.html',
  styleUrls: ['./ndvi-maps.component.sass']
})
export class NdviMapsComponent implements OnDestroy, OnInit {
  public chartData: Observable<any>;
  private _pageTitle = 'NDVI Maps';
  private _map: L.Map;
  private _layerId: string;
  private _routerParamSubscription: Subscription;
  private _oldCenter: L.LatLngLiteral;
  private _oldZoom: number;
  private _marker: L.Marker;
  private _mapClickListener: L.EventHandlerFn;
  private _popupEventListeners: Array<Function> = [];
  private _oldTimeSeriesData: any;
  private _oldDOYData: any;
  private _currentStartDate: string;
  private _currentEndDate: string;

  @ViewChild('downloadFile') downloadFile: ElementRef;

  constructor(
    @Inject(APP_CONFIG) private _globalConfig: any,
    @Inject(MAP_CONFIG) private _mapConfig: any,
    private _mapService: LeafletMapService,
    private _tileLayerService: TileLayerService,
    private _ndviMapService: NdviMapService,
    private _modalService: SpawnModalService,
    private _logger: LoggerService,
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

          this.processData(this._currentStartDate, this._currentEndDate, queryParams['province']);
        }
      })
      ;

    // receive outputs from the dynamically create modal
    this._modalService.outputStream
      .debounceTime(300)
      .subscribe((output: any) => {
        switch (output.type) {
          case 'pdf':
            break;

          case 'image':
            // download image
            this._renderer.setElementProperty(this.downloadFile.nativeElement, 'href', output.data);
            this._renderer.setElementProperty(this.downloadFile.nativeElement, 'download', 'chart.jpg');
            this._renderer.invokeElementMethod(this.downloadFile.nativeElement, 'click');
            break;

          case 'csv':
            const coords = this._marker.getLatLng();

            // assemble endpoint for download link
            let endpoint = `${this._mapConfig.ndvi_maps.eeApiEndpoint}/time-series/`;
            endpoint += `${coords.lat}/${coords.lng}/${this._currentStartDate}/${this._currentEndDate}?fmt=csv`;

            this._renderer.setElementProperty(this.downloadFile.nativeElement, 'href', endpoint);
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

        this._oldDOYData = undefined;
        this._oldTimeSeriesData = undefined;
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
    this._popupEventListeners.push(delegate(targetEl, 'click', '.link--ndvi-time-series', (evt: Event) => {
      const markerPos: L.LatLng = this._marker.getLatLng();

      // prevent default behavior when either of the links are clicked
      evt.preventDefault();

      // check if there is changes to the query
      checkQueryChanged();

      this.showTimeSeriesChart(markerPos, this._currentStartDate, this._currentEndDate, queryDataChanged);
    }));

    this._popupEventListeners.push(delegate(targetEl, 'click', '.link--ndvi-doy', (evt: Event) => {
      const markerPos: L.LatLng = this._marker.getLatLng();

      // prevent default behavior when either of the links are clicked
      evt.preventDefault();

      // check if there is changes to the query
      checkQueryChanged();

      this.showDayOfTheYearChart(markerPos, this._currentStartDate, this._currentEndDate, queryDataChanged);
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
        className: 'leaflet-popup--ndvi leaflet-popup--with-footer-controls'
      })
      .openPopup()
      ;
  }

  showTimeSeriesChart(coords: L.LatLngLiteral, startDate: string, endDate: string, changed = true) {
    const parsedStartDate = moment(startDate, 'YYYY-MM-DD');
    const parsedEndDate = moment(endDate, 'YYYY-MM-DD');
    let dataObservable: Observable<any>;

    if (changed === false && typeof this._oldTimeSeriesData !== 'undefined') {
      dataObservable = Observable.of(this._oldTimeSeriesData);
    } else {
      // notify the user about chart generation
      this._logger.log('Data Loading', 'Please wait while we fetch the data and generate the chart.', true);

      dataObservable = this._ndviMapService
        .getNdviTimeSeriesByLatLng(coords, startDate, endDate)
        .map((data: any) => {
          this._oldTimeSeriesData = data;

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
          data: map(data.result, 'ndvi'),
          label: 'NDVI'
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
          stepSize: 0.1
        };

        const options: Chart.ChartOptions = {
          maintainAspectRatio: false,
          responsive: true,
          scales: {
            yAxes: [{
              scaleLabel: {
                display: true,
                labelString: 'NDVI'
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

        // show the chart modal
        this._modalService.spawn({
          component: ChartModalComponent,
          inputs: {
            title: `NDVI Time Series Data (${parsedStartDate.format('MMMM D, YYYY')} to ${parsedEndDate.format('MMMM D, YYYY')})`,
            openImmediately: true,
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

  showDayOfTheYearChart(coords: L.LatLngLiteral, startDate: string, endDate: string, changed = true) {
    const parsedStartDate = moment(startDate, 'YYYY-MM-DD');
    const parsedEndDate = moment(endDate, 'YYYY-MM-DD');
    let dataObservable: Observable<any>;

    if (changed === false && typeof this._oldDOYData !== 'undefined') {
      dataObservable = Observable.of(this._oldDOYData);
    } else {
      // notify the user about chart generation
      this._logger.log('Data Loading', 'Please wait while we fetch the data and generate the chart.', true);

      dataObservable = this._ndviMapService
        .getNdviTimeSeriesByLatLng(coords, startDate, endDate)
        .map((data: any) => {
          this._oldDOYData = data;

          return data;
        })
        ;
    }

    dataObservable
      .delay(300)
      .map((data: any) => {
        const result: any = {};

        result.datasets = reduce(data.result, (yearlyData: any, value: any, key: number) => {
          const parsedDate = moment(value['time'], 'YYYY-MM-DD');
          const year = parsedDate.year();

          // create new object property based on the year if it doesn't exist yet
          // add supply initial data
          if (typeof yearlyData[year] === 'undefined') {
            const startPoint = parsedDate.dayOfYear() - 1;

            yearlyData[year] = {
              leapyear: parsedDate.isLeapYear()
            };

            // fill the array with null values if the starting point is greater than 0
            if (startPoint >= 0) {
              yearlyData[year].values = fill(Array(startPoint), null);
            } else {
              yearlyData[year].values = [];
            }
          }

          // push the values to the corresponding year
          yearlyData[year].values.push(value['ndvi']);

          // add 15 nulls after the pushed value
          yearlyData[year].values = yearlyData[year].values.concat(fill(Array(15), null));

          return yearlyData;
        }, {});

        forEach(result.data, (yearlyData: any, idx: string) => {
          const expectedPoints = yearlyData.leapyear ? 366 : 365;

          if (yearlyData.values.length < expectedPoints) {
            const filler = fill(Array((expectedPoints - 1) - (yearlyData.values.length - 1)), null);

            result.datasets[idx].values = yearlyData.values.concat(filler);
          }

          if (yearlyData.values.length > expectedPoints) {
            result.datasets[idx].values = yearlyData.values.slice(0, expectedPoints);
          }
        });

        // create the labels
        result.labels = Array
          .apply(null, {
            length: 366
          })
          .map((value, index) => {
            return index + 1;
          })
          ;

        // assemble the dataset
        result.datasets = reduce(result.datasets, (datasets: any, yearlyData: any, key: string): Array<Chart.ChartDataSets> => {
          const color = this.generateRandomRGB();
          const dataset = this.genereateChartDataSetOption({
            data: yearlyData.values,
            label: key,
            backgroundColor: this.rgbtoRGBA(color, 0.4),
            borderColor: this.rgbtoRGBA(color, 1),
            pointBorderColor: this.rgbtoRGBA(color, 1),
            pointHoverBackgroundColor: this.rgbtoRGBA(color, 1),
            spanGaps: true
          });

          // add to the datasets config
          datasets.push(dataset);

          return datasets;
        }, []);

        return result;
      })
      .subscribe((data: Chart.LinearChartData) => {
        const yTicks: Chart.LinearTickOptions = {
          beginAtZero: true,
          stepSize: 0.1
        };

        const xTicks: Chart.LinearTickOptions = {
          autoSkip: false,
          callback: (value) => {
            if ((value % 60) === 0 && value > 0) {
              return value + '';
            }

            return '';
          },
        };

        const options: any = {
          maintainAspectRatio: false,
          responsive: true,
          scales: {
            yAxes: [{
              scaleLabel: {
                display: true,
                labelString: 'NDVI'
              },
              ticks: yTicks
            }],
            xAxes: [{
              scaleLabel: {
                display: true,
                labelString: 'Day of the Year'
              },
              ticks: xTicks
            }]
          }
        };

        // charts fail to render properly due to xAxis does not offer stepSize option.
        // Too many ticks rendered on the X Axis of the chart.see this issues:
        // <https://github.com/chartjs/Chart.js/issues/3811>
        // <https://github.com/chartjs/Chart.js/issues/2419>
        this._modalService.spawn({
          component: ChartModalComponent,
          inputs: {
            openImmediately: true,
            title: `NDVI Day of the Year Data (${parsedStartDate.format('MMMM D, YYYY')} to ${parsedEndDate.format('MMMM D, YYYY')})`,
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
    this._mapLayersStore.dispatch({
      type: 'REMOVE_ALL_LAYERS'
    });

    this._tileLayerService
      .getNdviLayerData(startDate, endDate, place)
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
      pointBorderWidth: 2,
      pointHoverRadius: 8,
      pointHoverBackgroundColor: 'rgba(75, 192, 192, 1)',
      pointHoverBorderColor: 'rgba(220, 220, 220, 1)',
      pointHoverBorderWidth: 3,
      pointRadius: 5,
      pointHitRadius: 10,
      spanGaps: false
    }, dataset);
  }

  generatePopupHtml(coords: L.LatLngLiteral): string {
    return `<dl class="list list--feature-info">
      <dt class="list__item list__item--key">Latitude:</dt>
      <dd class="list__item list__item--value">${coords.lat}</dd>

      <dt class="list__item list__item--key">Longitude:</dt>
      <dd class="list__item list__item--value">${coords.lng}</dd>

      <dt class="list__item list__item--key">NDVI Time Series Chart:</dt>
      <dd class="list__item list__item--value">
          <a href="#" class="link link--ndvi-time-series">
            <i class="fa fa-line-chart link__icon" aria-hidden="true"></i>
            <span class="link__text">Show</span>
          </a>
      </dd>

      <dt class="list__item list__item--key">NDVI Day of the Year Chart:</dt>
      <dd class="list__item list__item--value">
          <a href="#" class="link link--ndvi-doy">
            <i class="fa fa-line-chart link__icon" aria-hidden="true"></i>
            <span class="link__text">Show</span>
          </a>
      </dd>
    </dl>

    <ul class="list list-unstyled clearfix popup-controls">
      <li class="list__item">
        <a href="#" class="link link--delete-marker">
          <i class="glyphicon glyphicon-trash link__icon"></i>
          <span class="link__text">Remove Marker</span>
        </a>
      </li>
    </ul>`;
  }

  generateRandomRGB(alpha: number = null): string {
    let alphaStr = '';
    if (alpha !== null) {
      alphaStr = `, ${alpha}`;
    }

    return `rgb(${Math.floor(Math.random() * 256)}, ${Math.floor(Math.random() * 256)}, ${Math.floor(Math.random() * 256)}${alphaStr})`;
  }

  rgbtoRGBA(color: string, alpha: number): string {
    return color
      .replace(')', `, ${alpha})`)
      .replace('rgb', 'rgba')
      ;
  }

  ngOnDestroy() {
    // reset the page title
    this._title.setTitle(`${this._globalConfig.app_title}`);

    // go the old zoom and lat,lng coords.
    this._mapService.panTo(this._oldCenter.lat, this._oldCenter.lng, this._oldZoom);

    // remove custom router subscription
    this._routerParamSubscription.unsubscribe();

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


