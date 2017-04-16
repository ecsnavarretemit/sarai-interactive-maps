/*!
 * Info Overlay Component
 *
 * Copyright(c) Exequiel Ceasar Navarrete <esnavarrete1@up.edu.ph>
 * Licensed under MIT
 */

import { animate, AnimationEntryMetadata, Component, OnInit, state, style, transition, trigger } from '@angular/core';

export function baseInfoOverlayAnimation(): AnimationEntryMetadata {
  return trigger('infoOverlay', [
    state('void', style({
      transform: 'translate3d(0, 100%, 0)'
    })),
    state('visible', style({
      transform: 'translate3d(0, 0, 0)'
    })),
    state('hidden', style({
      transform: 'translate3d(0, 100%, 0)'
    })),
    transition('void => visible', animate(500)),
    transition('visible => hidden', animate(500)),
    transition('hidden => void', animate(500)),
    transition('void => hidden', animate(500)),
    transition('hidden => visible', animate(500)),
    transition('visible => void', animate(500)),
  ]);
}

@Component({
  selector: 'app-suitability-map-info-overlay',
  templateUrl: './info-overlay.component.html',
  styleUrls: ['./info-overlay.component.sass'],
  animations: [
    baseInfoOverlayAnimation()
  ]
})
export class InfoOverlayComponent implements OnInit {
  public overlayAnimationState = 'visible';

  constructor() { }

  ngOnInit() { }

  toggle() {
    if (this.overlayAnimationState === 'hidden') {
      this.overlayAnimationState = 'visible';
    } else {
      this.overlayAnimationState = 'hidden';
    }
  }

}


