/*!
 * Rainfall Map Panel Component
 *
 * Copyright(c) Exequiel Ceasar Navarrete <esnavarrete1@up.edu.ph>
 * Licensed under MIT
 */

import { Component, Renderer } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { BasePanelAnimation, BasePanelComponent } from '../base-panel/base-panel.component';
import { LeafletMapService } from '../../leaflet';
import { CustomValidators } from '../../forms';

@Component({
  selector: 'app-rainfall-map-panel',
  templateUrl: './rainfall-map-panel.component.html',
  styleUrls: ['./rainfall-map-panel.component.sass'],
  animations: [
    BasePanelAnimation()
  ]
})
export class RainfallMapPanelComponent extends BasePanelComponent {
  public filterForm: FormGroup;
  public scanDate: FormControl;
  public controlWrapperAnimationState: string = 'hidden';

  constructor(
    private _formBuilder: FormBuilder,
    private _router: Router,
    private _childRenderer: Renderer,
    private _childMapService: LeafletMapService
  ) {
    // call the parent constructor
    super(_childRenderer, _childMapService);

    this.scanDate = new FormControl('', [
      Validators.required,
      CustomValidators.dateISO
    ]);

    this.filterForm = this._formBuilder.group({
      scanDate: this.scanDate
    });
  }

  processRequest() {
    let value = this.filterForm.value;

    // redirect to the URL
    this._router.navigateByUrl(`/rainfall-maps/${value.scanDate}`);
  }

}


