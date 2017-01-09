/*!
 * Crop Production Area Panel Component
 *
 * Copyright(c) Exequiel Ceasar Navarrete <esnavarrete1@up.edu.ph>
 * Licensed under MIT
 */

import { Component, OnInit, Renderer } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { basePanelAnimation, BasePanelComponent } from '../base-panel/base-panel.component';
import { LeafletMapService } from '../../leaflet';
import { CropProductionAreaMapService } from '../crop-production-area-map.service';

@Component({
  selector: 'app-crop-production-area-panel',
  templateUrl: './crop-production-area-panel.component.html',
  styleUrls: ['./crop-production-area-panel.component.sass'],
  animations: [
    basePanelAnimation()
  ]
})
export class CropProductionAreaPanelComponent extends BasePanelComponent implements OnInit {
  public controlWrapperAnimationState: string = 'hidden';
  public cropData: Observable<any>;

  constructor(
    private _router: Router,
    private _childRenderer: Renderer,
    private _childMapService: LeafletMapService,
    private _cropProductionAreaMapService: CropProductionAreaMapService
  ) {
    // call the parent constructor
    super(_childRenderer, _childMapService);
  }

  ngOnInit() {
    // call the parent's ngOnInit lifecycle hook
    super.ngOnInit();

    this.cropData = this._cropProductionAreaMapService.getCrops();
  }

  redirect(event, crop: string) {
    // redirect to the URL
    this._router.navigateByUrl(`/crop-production-area/${crop}`);
  }

  isCropActive(crop: string): boolean {
    return this._router.isActive(`/crop-production-area/${crop}`, true);
  }

}


