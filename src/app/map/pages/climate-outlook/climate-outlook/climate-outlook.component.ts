/*!
 * Climate Outlook Component
 *
 * Copyright(c) Exequiel Ceasar Navarrete <esnavarrete1@up.edu.ph>
 * Licensed under MIT
 */

import { Component, OnDestroy, OnInit } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';
import { LeafletMapService } from '../../../../leaflet';
import { ClimateOutookService } from '../climate-outlook.service';
import { select, geoTransform, geoPath, scaleLinear } from 'd3';
import * as L from 'leaflet';

@Component({
  selector: 'app-climate-outlook',
  templateUrl: './climate-outlook.component.html',
  styleUrls: ['./climate-outlook.component.sass']
})
export class ClimateOutlookComponent implements OnDestroy, OnInit {
  private _map: L.Map;
  private _zoomEvtSubscription: Subscription;
  private _d3ZoomEvtSubscription: Subscription;

  constructor(
    private _outlookService: ClimateOutookService,
    private _mapService: LeafletMapService
  ) { }

  ngOnInit() {
    this._mapService
      .getMap()
      .then((mapInstance: L.Map) => {
        // store the instance of the map
        this._map = mapInstance;

        this.drawOutlook(mapInstance);
      })
      ;
  }

  drawOutlook(mapInstance: L.Map) {
    // append the map overlay
    const overlayPane = mapInstance.getPane('overlayPane');
    const svg = select(overlayPane).append('svg');
    const g = svg
      .append('g')
      .attr('class', 'leaflet-zoom-hide')
      .attr('id', 'climate-outlook-overlay')
      ;

    const transform = geoTransform({
      point: this.projectPoint(mapInstance)
    });

    const path = geoPath().projection(transform);

    const colors: any = ['#ff0000', '#ff6900', '#ffff00', '#62ff00', '#00ff00'];
    const fill = scaleLinear()
      .domain([20, 40, 60, 80, 100])
      .range(colors)
      ;

    let active_layer_type = '';

    this._zoomEvtSubscription = Observable
      .fromEvent(mapInstance, 'zoomend')
      // .do(() => {
      //   // this.resetOverlayPosition(geojson, svg, g, path, feature);
      // })
      .filter((evt) => {
        const zoom = mapInstance.getZoom();
        let flag = false;

        if (zoom >= 10 && zoom < 12 && active_layer_type !== 'provincial') {
          active_layer_type = 'provincial';
          flag = true;
        } else if (zoom >= 12 && active_layer_type !== 'municipal') {
          active_layer_type = 'municipal';
          flag = true;
        } else if (zoom < 10 && active_layer_type !== 'regional') {
          active_layer_type = 'regional';
          flag = true;
        }

        return flag;
      })
      .flatMap((evt) => {
        const zoom = mapInstance.getZoom();
        const bounds = mapInstance.getBounds();

        let httpObs;

        if (zoom >= 10 && zoom < 12) {
          httpObs = this._outlookService.getProvincialBorders([
            bounds.getWest(),
            bounds.getNorth(),
            bounds.getEast(),
            bounds.getSouth()
          ]);
        } else if (zoom >= 12) {
          // municipal
          httpObs = this._outlookService.getProvincialBorders([
            bounds.getWest(),
            bounds.getNorth(),
            bounds.getEast(),
            bounds.getSouth()
          ]);
        } else {
          httpObs = this._outlookService.getRegionalBorders();
        }

        return httpObs;
      })
      .subscribe((geojson: any) => {
        const feature = g
          .selectAll('path')
          .data(geojson.features)
          .enter()
          .append('path')
          .attr('fill', (d) => {
            return fill(0);
          })
          ;
      })
      ;

    // manually fire the event
    mapInstance.fireEvent('zoomend');

    // this._outlookService
    //   .getRegionalBorders()
    //   .subscribe((geojson) => {
    //     const feature = g
    //       .selectAll('path')
    //       .data(geojson.features)
    //       .enter()
    //       .append('path')
    //       .attr('fill', (d) => {
    //         return fill(0);
    //       })
    //       ;

    //     // reposition svg items after zooming
    //     mapInstance.on('zoomend', () => {
    //       const bounds = this._map.getBounds();
    //       // console.log(`North: ${bounds.getNorth()}`);
    //       // console.log(`East: ${bounds.getEast()}`);
    //       // console.log(`South: ${bounds.getSouth()}`);
    //       // console.log(`West: ${bounds.getWest()}`);

    //       // west,north,east,south

    //       this.resetOverlayPosition(geojson, svg, g, path, feature);
    //     });

    //     this.resetOverlayPosition(geojson, svg, g, path, feature);
    //   })
    //   ;
  }

  projectPoint(mapInstance: L.Map) {
    return function (x, y) {
      // transform stream from d3
      const self: any = this;

      const point = mapInstance.latLngToLayerPoint(new L.LatLng(y, x));

      self.stream.point(point.x, point.y);
    };
  }

  resetOverlayPosition(geojson, svg, g, path, feature) {
    const [topLeft, bottomRight] = path.bounds(geojson);

    svg
      .attr('width', bottomRight[0] - topLeft[0])
      .attr('height', bottomRight[1] - topLeft[1])
      .style('left', `${topLeft[0]}px`)
      .style('top', `${topLeft[1]}px`)
      ;

    g.attr('transform', `translate(${-topLeft[0]}, ${-topLeft[1]})`);

    feature.attr(`d`, path);
  }

  ngOnDestroy() {
    // remove the zoom event subscription
    this._zoomEvtSubscription.unsubscribe();
  }

}


