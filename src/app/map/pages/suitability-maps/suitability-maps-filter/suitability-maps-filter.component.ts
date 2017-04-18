/*!
 * Suitability Maps Filter Component
 *
 * Copyright(c) Exequiel Ceasar Navarrete <esnavarrete1@up.edu.ph>
 * Licensed under MIT
 */

import { animate, Component, HostListener, OnInit, OnDestroy, Renderer, state, style, transition, trigger } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';
import { Store } from '@ngrx/store';
import { Layer } from '../../../../store';
import { LeafletMapService } from '../../../../leaflet';
import { SuitabilityMapService } from '../../../shared';
import { WindowService } from '../../../../shared';
import { SuitabilityLevel } from '../../../suitability-level.interface';
import { BasePanelComponent } from '../../../ui';
import map from 'lodash-es/map';
import omit from 'lodash-es/omit';
import values from 'lodash-es/values';
import 'rxjs/add/operator/debounceTime';

@Component({
  selector: 'app-suitability-maps-filter',
  templateUrl: './suitability-maps-filter.component.html',
  styleUrls: ['./suitability-maps-filter.component.sass'],
  animations: [
    trigger('controlWrapper', [
      state('visible', style({
        'opacity': 1,
        'display': 'block'
      })),
      state('hidden', style({
        'opacity': 0,
        'display': 'none'
      })),
      transition('* => *', animate(500))
    ]),
    trigger('button', [
      state('visible', style({
        'opacity': 1,
        'display': 'block'
      })),
      state('hidden', style({
        'opacity': 0,
        'display': 'none'
      }))
    ])
  ]
})
export class SuitabilityMapsFilterComponent extends BasePanelComponent implements OnInit, OnDestroy {
  public levels: Promise<Array<any>>;
  public controlWrapperAnimationState = 'visible';
  public buttonState = 'hidden';
  public levelTooltipsDisabled = true;
  private _suitabilityLevels: Observable<any>;
  private _panelsState: Observable<any>;
  private _panelSubscription: Subscription;

  constructor(
    private _childRenderer: Renderer,
    private _childMapService: LeafletMapService,
    private _suitabilityMapService: SuitabilityMapService,
    private _window: WindowService,
    private _store: Store<any>,
  ) {
    // call the parent component constructor method
    super(_childRenderer, _childMapService);

    // get the panels store
    this._panelsState = this._store.select('panels');

    // get the suitability levels from the store
    this._suitabilityLevels = this._store.select('suitabilityLevels');
  }

  ngOnInit() {
    // TODO: temporary hack, we must have a flag enabled on each levels and those enabled are the
    //       ones returned.
    this._store.dispatch({
      type: 'REMOVE_SUITABILITY_LEVELS'
    });

    this.levels = this._suitabilityMapService
      .getSuitabilityLevels()
      .then((levels: Array<SuitabilityLevel>) => {
        // add the suitability levels to the store
        this._store.dispatch({
          type: 'ADD_SUITABILITY_LEVELS',
          payload: levels
        });

        // add checked attribute
        return map(levels, (level: any) => {
          level.checked = true;

          return level;
        });
      })
      ;

    // invoke resize event since we cannot force the user to resize just to show the tooltip
    this._childRenderer.invokeElementMethod(this._window.getNativeWindow(), 'dispatchEvent', [
      new Event('resize')
    ]);

    // subscribe to the changes to the panels state
    this._panelSubscription = this._panelsState
      .debounceTime(100)
      .subscribe((state: any) => {
        if (state.active === 'suitability-maps') {
          this.controlWrapperAnimationState = 'visible';
          this.buttonState = 'hidden';
        } else {
          this.controlWrapperAnimationState = 'hidden';
          this.buttonState = 'hidden';
        }
      })
      ;
  }

  onHideButtonClick(evt: Event) {
    this.controlWrapperAnimationState = 'hidden';
    this.buttonState = 'visible';
  }

  onShowControl(evt: Event) {
    this.controlWrapperAnimationState = 'visible';
    this.buttonState = 'hidden';
  }

  onToggleCheckbox(isChecked: boolean, level: any) {
    // set the value to the corresponding object
    level.checked = isChecked;

    if (isChecked) {
      // add the gridcode to the store
      this._store.dispatch({
        type: 'ADD_SUITABILITY_LEVEL',
        payload: omit(level, 'checked')
      });
    } else {
      // remove the gridcode from the store
      this._store.dispatch({
        type: 'REMOVE_SUITABILITY_LEVEL',
        payload: level.gridcode
      });
    }
  }

  @HostListener('window:resize', ['$event'])
  onResize(evt: Event) {
    if ((evt.target as any).innerHeight <= 768) {
      this.levelTooltipsDisabled = false;
    } else {
      this.levelTooltipsDisabled = true;
    }
  }

  ngOnDestroy() {
    // make sure we destroy the component
    super.ngOnDestroy();

    // remove subscription from the changes to the state
    this._panelSubscription.unsubscribe();
  }

}


