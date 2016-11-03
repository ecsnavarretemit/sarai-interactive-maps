/*!
 * Crop Production Area Panel Component
 *
 * Copyright(c) Exequiel Ceasar Navarrete <esnavarrete1@up.edu.ph>
 * Licensed under MIT
 */

import { Component, OnInit, Output, EventEmitter, ViewChild, ElementRef, trigger, state, style, transition, animate } from '@angular/core';

@Component({
  selector: 'app-crop-production-area-panel',
  templateUrl: './crop-production-area-panel.component.html',
  styleUrls: ['./crop-production-area-panel.component.sass'],
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
export class CropProductionAreaPanelComponent implements OnInit {
  public controlWrapperAnimationState: string = 'hidden';

  @Output() hideButtonClick: EventEmitter<Event> = new EventEmitter<Event>();
  @ViewChild('controlwrapper') controlWrapper: ElementRef;

  constructor() { }

  ngOnInit() { }

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


