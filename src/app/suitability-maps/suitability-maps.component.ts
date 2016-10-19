/*!
 * Suitability Maps Component
 *
 * Copyright(c) Exequiel Ceasar Navarrete <esnavarrete1@up.edu.ph>
 * Licensed under MIT
 */

import { Component, OnInit, ViewChildren, QueryList } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { Store } from '@ngrx/store';
import { LeafletWmsLayerComponent } from '../leaflet-wms-layer/leaflet-wms-layer.component';
import { WmsLayerService } from '../wms-layer.service';
import { WMSOptions } from 'leaflet';
import { groupBy, template, reduce, min, max, size, TemplateExecutor } from 'lodash';

@Component({
  selector: 'app-suitability-maps',
  templateUrl: './suitability-maps.component.html',
  styleUrls: ['./suitability-maps.component.sass']
})
export class SuitabilityMapsComponent implements OnInit {
  public WMSTileUrl: string;
  public crop: string;
  public layersOptionsCollection: Array<WMSOptions> = [];
  private _mapState: Observable<Array<any>>;
  private _equalToFilterTmpl: TemplateExecutor;
  private _betweenFilterTmpl: TemplateExecutor;

  @ViewChildren(LeafletWmsLayerComponent) layers: QueryList<LeafletWmsLayerComponent>;

  constructor(
    private _wmsLayerService: WmsLayerService,
    private _route: ActivatedRoute,
    private _router: Router,
    private _store: Store<Array<any>>
  ) {
    // set the WMS tile URL
    this.WMSTileUrl = this._wmsLayerService.getUrl();

    // set default crop
    this.crop = 'rice';

    // get the map state store from the store
    this._mapState = this._store.select('map');

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

  ngOnInit() {
    // specify the crop
    this._route.params.forEach((params: Params) => {
      if (typeof params['crop'] !== 'undefined') {
        this.crop = params['crop'];
      }
    });

    // listen to the changes in map state and fire subscribe every 300ms
    this._mapState
      .debounceTime(300)
      .subscribe((layers) => {
        let data: any = {};
        let defaultUrl = this._wmsLayerService.getUrl();

        if (layers.length > 0) {
          data = layers[0].data;
        }

        // reset the WMS tile URL and append the new filter
        if (typeof data.gridcodes !== 'undefined') {
          this.WMSTileUrl = defaultUrl + ((defaultUrl.indexOf('?') >= 0) ? '&' : '?') + `filter=${this.createLayerFilter(data.gridcodes)}`;
        }

        if (layers.length > 0) {
          this.layersOptionsCollection = this._wmsLayerService
            .getSuitabilityMapCountryLevelLayers(this.crop);
        }
      });

    // add the new layer
    this._store.dispatch({
      type: 'ADD_LAYER',
      payload: {
        id: 1,
        zoom: 6,
        url: this.WMSTileUrl,
        data: {}
      }
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


