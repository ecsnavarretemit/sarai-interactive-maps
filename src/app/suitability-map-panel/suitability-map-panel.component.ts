/*!
 * Suitability Map Controls Component
 *
 * Copyright(c) Exequiel Ceasar Navarrete <esnavarrete1@up.edu.ph>
 * Licensed under MIT
 */

import { Component, OnInit, Output, ViewChild, ElementRef, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-suitability-map-panel',
  templateUrl: './suitability-map-panel.component.html',
  styleUrls: ['./suitability-map-panel.component.sass']
})
export class SuitabilityMapPanelComponent implements OnInit {
  public cropData: Array<any> = [];

  @Output() panelIconClick: EventEmitter<Event> = new EventEmitter();
  @ViewChild('controlwrapper') controlWrapper: ElementRef;

  constructor(public router: Router) {
    this.cropData = [
      {
        name: 'Rice',
        slug: 'rice'
      }, {
        name: 'Corn',
        slug: 'corn',
        subcrops: [
          {name: 'Corn Dry', slug: 'corn-dry'},
          {name: 'Corn Wet', slug: 'corn-wet'}
        ]
      }, {
        name: 'Banana',
        slug: 'banana'
      }, {
        name: 'Coconut',
        slug: 'coconut'
      }, {
        name: 'Coffee',
        slug: 'coffee',
        subcrops: [
          {name: 'Coffee Arabica', slug: 'coffee-arabica'},
          {name: 'Coffee Robusta', slug: 'coffee-robusta'}
        ]
      }, {
        name: 'Cacao',
        slug: 'cacao'
      }
    ];
  }

  ngOnInit() { }

  suitabilityRedirect(event, crop: string, containsChild = true) {
    if (containsChild) {
      return;
    }

    // redirect to the URL
    this.router.navigateByUrl(`/suitability-maps/${crop}`);
  }

  onPanelIconClick(event) {
    this.panelIconClick.emit(event);
  }

}


