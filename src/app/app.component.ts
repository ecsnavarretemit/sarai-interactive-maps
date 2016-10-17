/*!
 * App Component
 *
 * Copyright(c) Exequiel Ceasar Navarrete <esnavarrete1@up.edu.ph>
 * Licensed under MIT
 */

import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.sass']
})
export class AppComponent {
  public layersOpacity = 0.6;
  public cropData: Array<any> = [];

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

  suitabilityRedirect(event, crop: string, containsChild = true) {
    if (containsChild) {
      return;
    }

    // redirect to the URL
    this.router.navigateByUrl(`/suitability-maps/${crop}`);
  }

}


