/*!
 * Line Chart Component
 *
 * Copyright(c) Exequiel Ceasar Navarrete <esnavarrete1@up.edu.ph>
 * Licensed under MIT
 */

import { AfterViewInit, Component, ElementRef, Injector, Input, OnDestroy, ViewChild } from '@angular/core';
import * as Chart from 'chart.js';
import map from 'lodash-es/map';

@Component({
  selector: 'app-line-chart',
  templateUrl: './line-chart.component.html',
  styleUrls: ['./line-chart.component.sass']
})
export class LineChartComponent implements AfterViewInit, OnDestroy {
  private _chartInstance: Chart;

  @Input('data') data: Chart.LinearChartData;
  @Input('options') options: Chart.ChartOptions;
  @ViewChild('chartCanvas') chartCanvas: ElementRef;

  constructor(injector: Injector) {
    // retrieve properties from the injector
    this.data = injector.get('data', {});
    this.options = injector.get('options', {});
  }

  getChartInstance(): Chart {
    return this._chartInstance;
  }

  exportChartCanvasDataUrl(type = 'image/jpg', quality = 1.0, transparent = false) {
    const canvas = (this.chartCanvas.nativeElement as HTMLCanvasElement);
    const width = canvas.width;
    const height = canvas.height;

    const context = canvas.getContext('2d');
    const data = context.getImageData(0, 0, width, height);
    const compositeOperation = context.globalCompositeOperation;

    // make sure the rectangle will be drawn behind the chart
    // and set the background color to white
    if (type === 'image/jpg' || !transparent) {
      context.globalCompositeOperation = 'destination-over';

      context.fillStyle = 'rgb(255, 255, 255)';

      context.fillRect(0, 0, width, height);
    }

    // retrieve the modified canvas
    const dataUrl = canvas.toDataURL(type, quality);

    // revert the canvas to its orignal state to make sure that the visible canvas is not in disarray.
    if (type === 'image/jpg' || !transparent) {
      // clear the canvas
      context.clearRect(0, 0, width, height);

      // restore it with original / cached ImageData
      context.putImageData(data, 0, 0);

      // reset the globalCompositeOperation to what it was
      context.globalCompositeOperation = compositeOperation;
    }

    return dataUrl;
  }

  ngAfterViewInit() {
    this._chartInstance = new Chart((this.chartCanvas.nativeElement as HTMLCanvasElement), {
      type: 'line',
      options: this.options,
      data: this.data
    });
  }

  ngOnDestroy() {
    // destroy the chart instance
    this._chartInstance.destroy();
  }

}


