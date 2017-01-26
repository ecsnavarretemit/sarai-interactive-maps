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
  @Input('xAxisLabel') xAxisLabel: string;
  @Input('yAxisLabel') yAxisLabel: string;
  @ViewChild('chartCanvas') chartCanvas: ElementRef;

  constructor(injector: Injector) {
    // retrieve properties from the injector
    this.data = injector.get('data', {});
    this.xAxisLabel = injector.get('xAxisLabel', '');
    this.yAxisLabel = injector.get('yAxisLabel', '');
  }

  ngAfterViewInit() {
    const ticks: Chart.LinearTickOptions = {
      beginAtZero: true
    };

    const scaleOptions: Chart.ChartScales = {};

    if (typeof this.xAxisLabel !== 'undefined' && typeof this.xAxisLabel !== '') {
      scaleOptions.xAxes = [{
        scaleLabel: {
          display: true,
          labelString: this.xAxisLabel
        }
      }];
    }

    if (typeof this.yAxisLabel !== 'undefined' && typeof this.yAxisLabel !== '') {
      scaleOptions.yAxes = [{
        scaleLabel: {
          display: true,
          labelString: this.yAxisLabel
        }
      }];
    }

    this._chartInstance = new Chart((this.chartCanvas.nativeElement as HTMLCanvasElement), {
      type: 'line',
      options: {
        scales: scaleOptions
      },
      data: this.data
    });
  }

  ngOnDestroy() {
    // destroy the chart instance
    this._chartInstance.destroy();
  }

}


