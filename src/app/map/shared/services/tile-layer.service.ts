/*!
 * Tile Layer Service
 *
 * Copyright(c) Exequiel Ceasar Navarrete <esnavarrete1@up.edu.ph>
 * Licensed under MIT
 */

import { Injectable, Inject } from '@angular/core';
import { Http, Response } from '@angular/http';
import { APP_CONFIG } from '../../../app.config';
import { MAP_CONFIG } from '../../map.config';
import assign from 'lodash-es/assign';
import groupBy from 'lodash-es/groupBy';
import map from 'lodash-es/map';
import max from 'lodash-es/max';
import min from 'lodash-es/min';
import reduce from 'lodash-es/reduce';
import snakeCase from 'lodash-es/snakeCase';
import size from 'lodash-es/size';
import template from 'lodash-es/template';
import trimEnd from 'lodash-es/trimEnd';
import * as L from 'leaflet';
import 'rxjs/add/operator/toPromise';

@Injectable()
export class TileLayerService {
  private _leafletApi: any = L;
  private _equalToFilterTmpl: Function;
  private _betweenFilterTmpl: Function;

  public imageFormat = 'image/png';
  public transparent = true;
  public maxZoom = 18;
  public crs: L.CRS = this._leafletApi.CRS.EPSG900913;

  constructor(
    @Inject(APP_CONFIG) private _globalConfig: any,
    @Inject(MAP_CONFIG) private _mapConfig: any,
    private _http: Http,
  ) {
    // EqualTo filter for GeoServer
    this._equalToFilterTmpl = template(`
      <PropertyIsEqualTo>
        <PropertyName>
          <%= data.property %>
        </PropertyName>
        <Literal>
          <%= data.value %>
        </Literal>
      </PropertyIsEqualTo>
    `, {
      'variable': 'data'
    });

    // IsBetween filter for GeoServer
    this._betweenFilterTmpl = template(`
      <PropertyIsBetween>
        <PropertyName>
            <%= data.property %>
        </PropertyName>
        <LowerBoundary>
            <Literal>
                <%= data.lowerBoundary %>
            </Literal>
        </LowerBoundary>
        <UpperBoundary>
            <Literal>
                <%= data.upperBoundary %>
            </Literal>
        </UpperBoundary>
      </PropertyIsBetween>
    `, {
      'variable': 'data'
    });
  }

  getGeoServerWMSTileLayerBaseUrl(workspace: string, tiled = true): string {
    let tileLayerUrl: string = trimEnd(this._globalConfig.geoserver.baseUrl, '/') + `/${workspace}/wms`;

    if (tiled === true) {
      tileLayerUrl += ((tileLayerUrl.indexOf('?') >= 0) ? '&' : '?') + 'tiled=true';
    }

    return tileLayerUrl;
  }

  getFilteredUrlByGridcode(workspace: string, tiled = true, gridcodes: Array<number> = []): string {
    let resolvedUrl = this.getGeoServerWMSTileLayerBaseUrl(workspace, tiled);

    if (gridcodes.length > 0) {
      resolvedUrl += ((resolvedUrl.indexOf('?') >= 0) ? '&' : '?') + `filter=${this.createLayerFilter(gridcodes)}`;
    }

    return resolvedUrl;
  }

  getCQLFilterByGridcode(gridcodes: Array<number> = []): string {
    return map(gridcodes, (value: number) => {
      return `${this._mapConfig.suitability_maps.propertyFilterName}=${value}`;
    }).join(' OR ');
  }

  getDefaultOptions(): L.TileLayerOptions {
    return {
      maxZoom: this.maxZoom,
      zIndex: 1000,
      opacity: 0.6
    };
  }

  getDefaultWMSOptions(): any {
    return {
      format: this.imageFormat,
      transparent: this.transparent,
      crs: this.crs
    };
  }

  getEarthEngineMapUrl(mapId: string, mapToken: string): string {
    return `https://earthengine.googleapis.com/map/${mapId}/{z}/{x}/{y}?token=${mapToken}`;
  }

  getEarthEngineAttribution() {
    return 'Layer data &copy; <a href="https://earthengine.google.com/" target="_blank">Google Earth Engine</a>';
  }

  getSuitabilityMapAttribution() {
    return `Crop data &copy; 2016
        <a href="http://www.pcaarrd.dost.gov.ph/" target="_blank">PCAARRD</a> and
        <a href="http://uplb.edu.ph/" target="_blank">University of the Philippines Los Banos</a>`;
  }

  getSuitabilityMapCountryLevelLayers(crop: string, options: any = {}): Array<L.WMSOptions> {
    const attribution = this.getSuitabilityMapAttribution();
    let layers = [];

    switch (crop.toLocaleLowerCase()) {
      case 'banana':
      case 'rice':
      case 'cacao':
      case 'coffee-arabica':
      case 'coffee-robusta':
      case 'corn-dry':
      case 'corn-wet':
      case 'coconut':
        layers = [
          `${this._mapConfig.suitability_maps.wms.workspace}:${snakeCase(crop)}${this._mapConfig.suitability_maps.countrLevelLayerSuffix}`
        ];

        break;

      default:
        throw new Error('Not yet implemented!');
    }

    return map(layers, (item) => {
      return assign({}, this.getDefaultOptions(), this.getDefaultWMSOptions(), {
        layers: item,
        minZoom: 5,
        maxZoom: 12,
        attribution,
      }, options);
    });
  }

  getSuitabilityMapMunicipalLevelLayers(crop: string, options: any = {}): Array<L.WMSOptions> {
    const attribution = this.getSuitabilityMapAttribution();
    let layers = [];

    switch (crop.toLocaleLowerCase()) {
      case 'banana':
      case 'rice':
      case 'cacao':
      case 'coffee-arabica':
      case 'coffee-robusta':
      case 'corn-dry':
      case 'corn-wet':
      case 'coconut':
        layers = [
          `${this._mapConfig.suitability_maps.wms.workspace}:${snakeCase(crop)}${this._mapConfig.suitability_maps.municipalLevelLayerSuffix}`
        ];

        break;

      default:
        throw new Error('Not yet implemented!');
    }

    return map(layers, (item) => {
      return assign({}, this.getDefaultOptions(), this.getDefaultWMSOptions(), {
        layers: item,
        minZoom: 11,
        maxZoom: 20,
        attribution,
      }, options);
    });
  }

  getCropProductionAreaMapAttribution() {
    return this.getSuitabilityMapAttribution();
  }

  getCropProductionAreaLayers(crop: string, options: any = {}): Array<L.WMSOptions> {
    const attribution = this.getCropProductionAreaMapAttribution();
    let layers = [];

    switch (crop.toLocaleLowerCase()) {
      case 'rice':
      case 'corn':
        layers = [
          `${this._mapConfig.crop_production_area_maps.wms.workspace}:${snakeCase(crop)}`
        ];

        break;

      default:
        throw new Error('Not yet implemented!');
    }

    return map(layers, (item) => {
      return assign({}, this.getDefaultOptions(), this.getDefaultWMSOptions(), {
        layers: item,
        minZoom: 5,
        attribution,
      }, options);
    });
  }

  getNdviLayerData(startDate: string, endDate: string, place?: string): Promise<any> {
    // throw error if endpoint does not exist
    if (typeof this._mapConfig.ndvi_maps.eeApiEndpoint === 'undefined' || this._mapConfig.ndvi_maps.eeApiEndpoint === '') {
      return Promise.reject(new Error('API Endpoint for NDVI Layers not specified'));
    }

    const method = this._mapConfig.ndvi_maps.eeApiEndpointMethod.toLowerCase();
    let endpoint = this._mapConfig.ndvi_maps.eeApiEndpoint;

    let args = [endpoint, {
      startDate,
      endDate
    }];

    if (method === 'get') {
      endpoint += `/${startDate}/${endDate}`;

      // add a query string to the endpoint
      if (typeof place !== 'undefined') {
        endpoint += `?place=${place}`;
      }

      args = [endpoint];
    }

    return this._http[method]
      .apply(this._http, args)
      .map((res: Response) => {
        const jsonResult = res.json();

        // throw error here so that we can handle it properly later
        if (jsonResult.success === false) {
          throw new Error('Map Data not found.');
        }

        return jsonResult;
      })
      .toPromise()
      ;
  }

  getRainfallMapLayerData(startDate: string, endDate: string, place?: string): Promise<any> {
    // throw error if endpoint does not exist
    if (typeof this._mapConfig.rainfall_maps.eeApiEndpoint === 'undefined' || this._mapConfig.rainfall_maps.eeApiEndpoint === '') {
      return Promise.reject(new Error('API Endpoint for Rainfall Map Layers not specified'));
    }

    const method = this._mapConfig.rainfall_maps.eeApiEndpointMethod.toLowerCase();
    let endpoint = this._mapConfig.rainfall_maps.eeApiEndpoint;
    let args = [endpoint, {
      startDate,
      endDate
    }];

    if (method === 'get') {
      endpoint += `/${startDate}/${endDate}`;

      // add a query string to the endpoint
      if (typeof place !== 'undefined') {
        endpoint += `?place=${place}`;
      }

      args = [endpoint];
    }

    return this._http[method]
      .apply(this._http, args)
      .map((res: Response) => {
        const jsonResult = res.json();

        // throw error here so that we can handle it properly later
        if (jsonResult.success === false) {
          throw new Error('Map Data not found.');
        }

        return jsonResult;
      })
      .toPromise()
      ;
  }

  getNdviLayerOptions(options: L.TileLayerOptions = {}): L.TileLayerOptions {
    const attribution = this.getEarthEngineAttribution();

    return assign({}, this.getDefaultOptions(), {
      attribution
    }, options);
  }

  getRainFallLayerOptions(options: L.TileLayerOptions = {}): L.TileLayerOptions {
    const attribution = this.getEarthEngineAttribution();

    return assign({}, this.getDefaultOptions(), {
      attribution
    }, options);
  }

  createLayerFilter(gridcodes: Array<number>): string {
    const groups = groupBy(gridcodes, (gridcode: number) => {
      return (Math.floor(gridcode / 10) * 10);
    });

    let queryFilter = reduce(groups, (resolvedFilter: string, value: Array<number>) => {
      let filter;

      if (value.length > 1) {
        filter = this._betweenFilterTmpl({
          property: this._mapConfig.suitability_maps.propertyFilterName,
          lowerBoundary: min(value),
          upperBoundary: max(value)
        });
      } else {
        filter = this._equalToFilterTmpl({
          property: this._mapConfig.suitability_maps.propertyFilterName,
          value: value[0]
        });
      }

      // concat the filter to the resolvedFilter
      return resolvedFilter + filter.replace(/^[\s\\n]+/gm, '');
    }, '');

    if (size(groups) > 1) {
      queryFilter = `<Or>${queryFilter}</Or>`;
    }

    return queryFilter;
  }

}


