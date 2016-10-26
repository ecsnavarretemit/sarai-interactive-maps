/*!
 * Download Image Form Component
 *
 * Copyright(c) Exequiel Ceasar Navarrete <esnavarrete1@up.edu.ph>
 * Licensed under MIT
 */

import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-download-image-form',
  templateUrl: './download-image-form.component.html',
  styleUrls: ['./download-image-form.component.sass']
})
export class DownloadImageFormComponent implements OnInit {
  public requestType = 'download';

  constructor() { }

  ngOnInit() { }

  processRequest(form: NgForm) {
    // log the message
    console.log(`process request called! type: ${this.requestType}`);

    console.log(form.value);
  }

}


