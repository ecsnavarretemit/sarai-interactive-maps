/*!
 * NDVI Panel Component
 *
 * Copyright(c) Exequiel Ceasar Navarrete <esnavarrete1@up.edu.ph>
 * Licensed under MIT
 */

import { Component } from '@angular/core';
import { BasePanelAnimation, BasePanelComponent } from '../base-panel/base-panel.component';

@Component({
  selector: 'app-ndvi-panel',
  templateUrl: './ndvi-panel.component.html',
  styleUrls: ['./ndvi-panel.component.sass'],
  animations: [
    BasePanelAnimation()
  ]
})
export class NdviPanelComponent extends BasePanelComponent  {
  public controlWrapperAnimationState: string = 'hidden';
}


