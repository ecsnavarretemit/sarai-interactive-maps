/*!
 * NDVI Panel Component
 *
 * Copyright(c) Exequiel Ceasar Navarrete <esnavarrete1@up.edu.ph>
 * Licensed under MIT
 */

import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { Router, UrlTree, NavigationExtras } from '@angular/router';
import { LeafletMapService } from '../../leaflet';
import { LocationsService } from '../locations.service';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';
import { CustomValidators } from '../../forms';
import * as L from 'leaflet';
import 'rxjs/add/operator/throttleTime';
import 'rxjs/add/observable/fromEvent';
import {
  Component,
  OnInit,
  AfterViewInit,
  OnDestroy,
  Output,
  EventEmitter,
  ViewChild,
  ElementRef,
  Renderer,
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
export class NdviPanelComponent implements OnInit, AfterViewInit, OnDestroy {
  public filterForm: FormGroup;
  public startDate: FormControl;
  public scanRange: FormControl;
  public province: FormControl;
  public controlWrapperAnimationState: string = 'hidden';
  public provinces: Observable<any>;
  private _mouseOverSubscription: Subscription;
  private _mouseLeaveListener: Function;

  @Output() hideButtonClick: EventEmitter<Event> = new EventEmitter<Event>();
  @ViewChild('controlwrapper') controlWrapper: ElementRef;

  constructor(
    private _formBuilder: FormBuilder,
    private _router: Router,
    private _renderer: Renderer,
    private _mapService: LeafletMapService,
    private _locationsService: LocationsService
  ) {
    this.startDate = new FormControl('', [
      Validators.required,
      CustomValidators.dateISO
    ]);

    this.scanRange = new FormControl('', [
      Validators.required,
      CustomValidators.number
    ]);

    this.province = new FormControl('', [
      Validators.nullValidator
    ]);

    this.filterForm = this._formBuilder.group({
      startDate: this.startDate,
      scanRange: this.scanRange,
      province: this.province
    });
  }

  ngOnInit() {
    this.provinces = this._locationsService.getProvincesFromFT();
  }

  ngAfterViewInit() {
    // since mouseover is fire continuously, we throttle it so that it is only fired every 600 ms
    this._mouseOverSubscription = Observable
      .fromEvent(this.controlWrapper.nativeElement, 'mouseover')
      .throttleTime(600)
      .subscribe(() => {
        this.mouseMovementOnMapControl('over');
      })
      ;

    // listen to the mouseleave event
    this._mouseLeaveListener = this._renderer.listen(this.controlWrapper.nativeElement, 'mouseleave', () => {
      this.mouseMovementOnMapControl('leave');
    });
  }

  processRequest() {
    let value = this.filterForm.value;
    let urlExtras: NavigationExtras = {};
    let urlTree: UrlTree;

    if (value.province !== '') {
      // add a province query parameter
      urlExtras.queryParams = {
        province: value.province.name,
        center: `${value.province.center.coordinates[1]},${value.province.center.coordinates[0]}`
      };
    }

    // create the url tree
    urlTree = this._router.createUrlTree(['/ndvi', value.startDate, value.scanRange], urlExtras);

    // redirect to the URL
    this._router.navigateByUrl(urlTree);
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

  mouseMovementOnMapControl(type: string) {
    this._mapService
      .getMap()
      .then((map: L.Map) => {
        if (type === 'over') {
          // disable dragging when the mouse is over the panel
          map.dragging.disable();

          // disable scroll wheel zoom when the mouse is over the panel
          map.scrollWheelZoom.disable();
        } else {
          // enable dragging when the mouse is not ove the panel
          map.dragging.enable();

          // enable scroll wheel zoom when the mouse is not ove the panel
          map.scrollWheelZoom.enable();
        }
      })
      ;
  }

  ngOnDestroy() {
    // remove event listener
    this._mouseLeaveListener();

    // remove the subscription from the event
    this._mouseOverSubscription.unsubscribe();
  }

}


