/*!
 * WMS Layer Service
 *
 * Copyright(c) Exequiel Ceasar Navarrete <esnavarrete1@up.edu.ph>
 * Licensed under MIT
 */

import { Injectable } from '@angular/core';
import { WMSOptions, CRS } from 'leaflet';
import { assign, snakeCase, groupBy, template, reduce, min, max, size, TemplateExecutor } from 'lodash';


@Injectable()
export class WmsLayerService {
  private _leafletApi: any = L;
  private _workspace: string = 'sarai-20161024';
  private _equalToFilterTmpl: TemplateExecutor;
  private _betweenFilterTmpl: TemplateExecutor;

  public imageFormat: string = 'image/png';
  public transparent: boolean = true;
  public maxZoom: number = 18;
  public crs: CRS = this._leafletApi.CRS.EPSG900913;
  public wmsTileLayerUrl = `http://202.92.144.40:8080/geoserver/${this._workspace}/wms?tiled=true`;

  constructor() {
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

  getDefaultOptions(): any {
    return {
      format: this.imageFormat,
      transparent: this.transparent,
      maxZoom: this.maxZoom,
      crs: this.crs,
    };
  }

  getSuitabilityMapCountryLevelLayers(crop: string, options: any = {}): Array<WMSOptions> {
    let layers = [];
    let attribution = `Crop data &copy; 2016
        <a href="http://www.pcaarrd.dost.gov.ph/" target="_blank">PCAARRD</a> and
        <a href="http://uplb.edu.ph/" target="_blank">University of the Philippines Los Banos</a>`;

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
          `${this._workspace}:${snakeCase(crop)}_15_layers_gridcode_all`
        ];

        break;

      default:
        throw new Error('Not yet implemented!');
    }

    return layers.map((item) => {
      return assign({}, this.getDefaultOptions(), {
        layers: item,
        maxZoom: 10,
        zIndex: 1000,
        opacity: 0.6,
        attribution,
      }, options);
    });
  }

  createLayerFilter(gridcodes: Array<number>): string {
    let groups = groupBy(gridcodes, (gridcode: number) => {
      return (Math.floor(gridcode / 10) * 10);
    });

    let queryFilter = reduce(groups, (resolvedFilter: string, value: Array<number>) => {
      let filter;

      if (value.length > 1) {
        filter = this._betweenFilterTmpl({
          property: 'GRIDCODE',
          lowerBoundary: min(value),
          upperBoundary: max(value)
        });
      } else {
        filter = this._equalToFilterTmpl({
          property: 'GRIDCODE',
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


