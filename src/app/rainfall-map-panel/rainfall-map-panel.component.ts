/*!
 * Rainfall Map Panel Component
 *
 * Copyright(c) Exequiel Ceasar Navarrete <esnavarrete1@up.edu.ph>
 * Licensed under MIT
 */

import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CustomValidators } from 'ng2-validation';
import {
  Component,
  OnInit,
  Output,
  EventEmitter,
  ViewChild,
  ElementRef,
  trigger,
  state,
  style,
  transition,
  animate
} from '@angular/core';

@Component({
  selector: 'app-rainfall-map-panel',
  templateUrl: './rainfall-map-panel.component.html',
  styleUrls: ['./rainfall-map-panel.component.sass'],
  animations: [
    trigger('controlWrapper', [
      state('void', style({
        height: 0
      })),
      state('visible', style({
        opacity: 1,
        height: 'auto'
      })),
      state('hidden', style({
        opacity: 0,
        height: 0
      })),
      transition('* => *', animate(500))
    ])
  ]
})
export class RainfallMapPanelComponent implements OnInit {
  public filterForm: FormGroup;
  public scanDate: FormControl;
  public controlWrapperAnimationState: string = 'hidden';

  @Output() hideButtonClick: EventEmitter<Event> = new EventEmitter<Event>();
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

  onHideButtonClick(event) {
    // switch the panel animation state to hidden
    this.controlWrapperAnimationState = 'hidden';

    this.hideButtonClick.emit(event);
  }

  togglePanelVisibility() {
    if (this.controlWrapperAnimationState === 'hidden') {
      this.controlWrapperAnimationState = 'visible';
      return;
    }

    this.controlWrapperAnimationState = 'hidden';
  }

}


