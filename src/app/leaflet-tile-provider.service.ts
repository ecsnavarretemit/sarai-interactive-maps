import { Injectable } from '@angular/core';
import * as L from 'leaflet';

@Injectable()
export class LeafletTileProviderService {
  public baseMaps: any;

  constructor() {
    this.baseMaps = {
      OpenStreetMap: L.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: 'Map data &copy; <a href="http://openstreetmap.org" target="_blank">OpenStreetMap</a> contributors'
      }),
      OpenCycle: L.tileLayer('http://{s}.tile.opencyclemap.org/cycle/{z}/{x}/{y}.png', {
        attribution: 'Map data &copy; <a href="http://www.opencyclemap.org/">OpenCylcle</a> contributors'
      }),
      Mapnik: L.tileLayer('http://{s}.tiles.wmflabs.org/bw-mapnik/{z}/{x}/{y}.png', {
        attribution: 'Map data &copy; <a href="http://mapnik.org/">Mapnik</a> contributors'
      })
    };

    // Google Maps Tiles
    this.baseMaps['Google Satellite'] = L.tileLayer('http://{s}.google.com/vt/lyrs=s,h&x={x}&y={y}&z={z}',{
        subdomains: ['mt0', 'mt1', 'mt2', 'mt3']
    });

    this.baseMaps['Google Street'] = L.tileLayer('http://{s}.google.com/vt/lyrs=m&x={x}&y={y}&z={z}',{
        subdomains: ['mt0', 'mt1', 'mt2', 'mt3']
    });

    // Carto Tiles
    this.baseMaps['CartoDB Dark'] = L.tileLayer('http://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}.png', {
        attribution: `&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors,
          &copy; <a href="http://cartodb.com/attributions">CartoDB</a>`
    });

    this.baseMaps['CartoDB Light'] =  L.tileLayer('http://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png', {
        attribution: `&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors,
          &copy; <a href="http://cartodb.com/attributions">CartoDB</a>`
    })
  }

}


