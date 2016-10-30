/*!
 * NDVI Panel Component
 *
 * Copyright(c) Exequiel Ceasar Navarrete <esnavarrete1@up.edu.ph>
 * Licensed under MIT
 */

import { Component, OnInit, Output, ViewChild, ElementRef, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { CustomValidators } from 'ng2-validation';

@Component({
  selector: 'app-ndvi-panel',
  templateUrl: './ndvi-panel.component.html',
  styleUrls: ['./ndvi-panel.component.sass']
})
export class NdviPanelComponent implements OnInit {
  public filterForm: FormGroup;
  public startDate: FormControl;
  public scanRange: FormControl;

  @Output() panelIconClick: EventEmitter<Event> = new EventEmitter();
  @ViewChild('controlwrapper') controlWrapper: ElementRef;

  constructor(private _formBuilder: FormBuilder) {
    this.startDate = new FormControl('', [
      Validators.required,
      CustomValidators.dateISO
    ]);

    this.scanRange = new FormControl('', [
      Validators.required,
      CustomValidators.number
    ]);

    this.filterForm = this._formBuilder.group({
      startDate: this.startDate,
      scanRange: this.scanRange
    });
  }

  ngOnInit() { }

  processRequest() {
    console.log(this.filterForm.value);
  }

  onPanelIconClick(event) {
    this.panelIconClick.emit(event);
  }

}


