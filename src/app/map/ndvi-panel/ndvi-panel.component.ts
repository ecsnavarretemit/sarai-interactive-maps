/*!
 * NDVI Panel Component
 *
 * Copyright(c) Exequiel Ceasar Navarrete <esnavarrete1@up.edu.ph>
 * Licensed under MIT
 */

import { Component } from '@angular/core';
import { basePanelAnimation, BasePanelComponent } from '../base-panel/base-panel.component';

@Component({
  selector: 'app-ndvi-panel',
  templateUrl: './ndvi-panel.component.html',
  styleUrls: ['./ndvi-panel.component.sass'],
  animations: [
    basePanelAnimation()
  ]
})
export class NdviPanelComponent extends BasePanelComponent {
  public controlWrapperAnimationState = 'hidden';

  onHideButtonClick(evt: Event) {
    // call the parent method
    super.onHideButtonClick(evt);
  }

}


