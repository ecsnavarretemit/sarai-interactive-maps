/*!
 * Tile Layer Service
 *
 * Copyright(c) Exequiel Ceasar Navarrete <esnavarrete1@up.edu.ph>
 * Licensed under MIT
 */

import { Injectable, Inject } from '@angular/core';
import { APP_CONFIG } from './app.config';
import { map, assign, snakeCase, groupBy, template, reduce, min, max, size, TemplateExecutor } from 'lodash';
import * as L from 'leaflet';

@Injectable()
export class TileLayerService {
  private _leafletApi: any = L;
  private _equalToFilterTmpl: TemplateExecutor;
  private _betweenFilterTmpl: TemplateExecutor;

  public imageFormat: string = 'image/png';
  public transparent: boolean = true;
  public maxZoom: number = 18;
  public crs: L.CRS = this._leafletApi.CRS.EPSG900913;
  public wmsTileLayerUrl: string;

  constructor(@Inject(APP_CONFIG) private _config: any) {
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

    // set the properties based from what the config will return
    this.wmsTileLayerUrl = this._config.geoserver.wmsTileLayerUrl;
  }

  getUrl(): string {
    return this.wmsTileLayerUrl;
  }

  getFilteredUrlByGridcode(gridcodes: Array<number> = []): string {
    let defaultUrl = this.wmsTileLayerUrl;
    let resolvedUrl = defaultUrl;

    if (gridcodes.length > 0) {
      resolvedUrl += ((defaultUrl.indexOf('?') >= 0) ? '&' : '?') + `filter=${this.createLayerFilter(gridcodes)}`;
    }

    return resolvedUrl;
  }

  getCQLFilterByGridcode(gridcodes: Array<number> = []): string {
    return map(gridcodes, (value: number) => {
      return `${this._config.suitability_maps.propertyFilterName}=${value}`;
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
    let layers = [];
    let attribution = this.getSuitabilityMapAttribution();

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
          `${this._config.geoserver.workspace}:${snakeCase(crop)}${this._config.suitability_maps.countrLevelLayerSuffix}`
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
    let layers = [];
    let attribution = this.getSuitabilityMapAttribution();

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
          `${this._config.geoserver.workspace}:${snakeCase(crop)}${this._config.suitability_maps.municipalLevelLayerSuffix}`
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

  getNdviLayerOptions(options: L.TileLayerOptions = {}): L.TileLayerOptions {
    let attribution = this.getEarthEngineAttribution();

    return assign({}, this.getDefaultOptions(), {
      attribution
    }, options);
  }

  getRainFallLayerOptions(options: L.TileLayerOptions = {}): L.TileLayerOptions {
    let attribution = this.getEarthEngineAttribution();

    return assign({}, this.getDefaultOptions(), {
      attribution
    }, options);
  }

  createLayerFilter(gridcodes: Array<number>): string {
    let groups = groupBy(gridcodes, (gridcode: number) => {
      return (Math.floor(gridcode / 10) * 10);
    });

    let queryFilter = reduce(groups, (resolvedFilter: string, value: Array<number>) => {
      let filter;

      if (value.length > 1) {
        filter = this._betweenFilterTmpl({
          property: this._config.suitability_maps.propertyFilterName,
          lowerBoundary: min(value),
          upperBoundary: max(value)
        });
      } else {
        filter = this._equalToFilterTmpl({
          property: this._config.suitability_maps.propertyFilterName,
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


