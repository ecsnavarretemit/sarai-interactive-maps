/*!
 * NDVI Panel Component
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
  ViewChild,
  ElementRef,
  trigger,
  state,
  style,
  transition,
  animate
} from '@angular/core';

@Component({
  selector: 'app-ndvi-panel',
  templateUrl: './ndvi-panel.component.html',
  styleUrls: ['./ndvi-panel.component.sass'],
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
export class NdviPanelComponent implements OnInit {
  public filterForm: FormGroup;
  public startDate: FormControl;
  public scanRange: FormControl;
  public controlWrapperAnimationState: string = 'hidden';

  @ViewChild('controlwrapper') controlWrapper: ElementRef;

  constructor(
    private _formBuilder: FormBuilder,
    private _router: Router
  ) {
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
    let value = this.filterForm.value;

    // redirect to the URL
    this._router.navigateByUrl(`/ndvi/${value.startDate}/${value.scanRange}`);
  }

  togglePanelVisibility(event) {
    if (this.controlWrapperAnimationState === 'hidden') {
      this.controlWrapperAnimationState = 'visible';
      return;
    }

    this.controlWrapperAnimationState = 'hidden';
  }

}


