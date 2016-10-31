/*!
 * Rainfall Map Panel Component
 *
 * Copyright(c) Exequiel Ceasar Navarrete <esnavarrete1@up.edu.ph>
 * Licensed under MIT
 */

import { Component, OnInit, Output, ViewChild, ElementRef, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CustomValidators } from 'ng2-validation';

@Component({
  selector: 'app-rainfall-map-panel',
  templateUrl: './rainfall-map-panel.component.html',
  styleUrls: ['./rainfall-map-panel.component.sass']
})
export class RainfallMapPanelComponent implements OnInit {
  public filterForm: FormGroup;
  public scanDate: FormControl;

  @Output() panelIconClick: EventEmitter<Event> = new EventEmitter();
  @ViewChild('controlwrapper') controlWrapper: ElementRef;

  constructor(
    private _formBuilder: FormBuilder,
    private _router: Router
  ) {
    this.scanDate = new FormControl('', [
      Validators.required,
      CustomValidators.dateISO
    ]);

    this.filterForm = this._formBuilder.group({
      scanDate: this.scanDate
    });
  }

  ngOnInit() { }

  processRequest() {
    let value = this.filterForm.value;

    // redirect to the URL
    this._router.navigateByUrl(`/rainfall-maps/${value.scanDate}`);
  }

  onPanelIconClick(event) {
    this.panelIconClick.emit(event);
  }

}


