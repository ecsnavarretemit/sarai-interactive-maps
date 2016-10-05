import { Injectable } from '@angular/core';
import * as L from 'leaflet';

@Injectable()
export class LeafletTileProviderService {
  public baseMaps: any;

  constructor() {
    this.baseMaps = {
      OpenStreetMap: L.tileLayer("http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: 'Map data &copy; <a href="http://openstreetmap.org" target="_blank">OpenStreetMap</a> contributors'
      })
    };
  }

}


