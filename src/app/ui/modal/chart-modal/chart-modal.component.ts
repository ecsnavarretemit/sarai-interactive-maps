/*!
 * Chart Modal Component
 *
 * Copyright(c) Exequiel Ceasar Navarrete <esnavarrete1@up.edu.ph>
 * Licensed under MIT
 */

import { ModalDirective } from 'ng2-bootstrap/modal';
import { LineChartComponent } from '../../charts';
import { BaseModalComponent } from '../base-modal/base-modal.component';
import { ModalComponentData } from '../modal-component-data.interface';
import {
  AfterViewInit,
  Component,
  ComponentFactoryResolver,
  Injector,
  Input,
  OnDestroy,
  ReflectiveInjector,
  ViewChild,
  ViewContainerRef
} from '@angular/core';

@Component({
  selector: 'app-chart-modal',
  templateUrl: './chart-modal.component.html',
  styleUrls: ['./chart-modal.component.sass'],
})
export class ChartModalComponent extends BaseModalComponent implements AfterViewInit, OnDestroy {
  private _currentComponent = null;

  @Input('title') title = 'Chart Title';
  @Input('chartOptions') chartOptions: ModalComponentData;
  @ViewChild('contentModal') contentModal: ModalDirective;
  @ViewChild('chartContainer', { read: ViewContainerRef }) chartContainer: ViewContainerRef;

  constructor(
    private _resolver: ComponentFactoryResolver,
    injector: Injector
  ) {
    // call the parent constructor
    super(injector);

    // retrieve properties from the injector
    this.title = injector.get('title', 'Chart Title');
    this.chartOptions = injector.get('chartOptions', null);
  }

  onHide() {
    super.onHide();
  }

  onShow() {
    super.onShow();
  }

  ngAfterViewInit() {
    let resolvedInputs = [];

    // call the parent ngAfterViewInit()
    super.ngAfterViewInit();

    // dont create any chart components when component metadata is not specified or provided.
    if (typeof this.chartOptions === 'undefined' || this.chartOptions === null) {
      return;
    }

    if (typeof this.chartOptions.inputs !== 'undefined') {
      // Inputs need to be in the following format to be resolved properly
      const inputProviders = Object
        .keys(this.chartOptions.inputs)
        .map((inputName: string) => {
          return {
            provide: inputName,
            useValue: this.chartOptions.inputs[inputName]
          };
        })
        ;

      resolvedInputs = ReflectiveInjector.resolve(inputProviders);
    }

    // We create an injector out of the data we want to pass down and this components injector
    const injector = ReflectiveInjector.fromResolvedProviders(resolvedInputs, this.chartContainer.parentInjector);

    // We create a factory out of the component we want to create
    const factory = this._resolver.resolveComponentFactory((this.chartOptions as any).type);

    // We create the component using the factory and the injector
    const component = factory.create(injector);

    // enable change detection in the component
    component.changeDetectorRef.detectChanges();

    // clean up everything when component is destroyed
    component.onDestroy(() => {
      component.changeDetectorRef.detach();
    });

    // We insert the component into the dom container
    this.chartContainer.insert(component.hostView);

    // save the current component
    this._currentComponent = component;
  }

  ngOnDestroy() {
    // destroy the dynamically created component when it is not null
    if (this._currentComponent !== null) {
      this._currentComponent.destroy();
    }
  }

}


