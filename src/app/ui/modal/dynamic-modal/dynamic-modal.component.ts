/*!
 * Dynamic Modal Component
 *
 * Copyright(c) Exequiel Ceasar Navarrete <esnavarrete1@up.edu.ph>
 * Licensed under MIT
 */

import { Subscription } from 'rxjs/Subscription';
import { SpawnModalService } from '../spawn-modal.service';
import { ModalComponentData } from '../modal-component-data.interface';
import { BaseModalComponent } from '../base-modal/base-modal.component';
import { AlertModalComponent } from '../alert-modal/alert-modal.component';
import { ChartModalComponent } from '../chart-modal/chart-modal.component';
import { PdfPreviewModalComponent } from '../pdf-preview-modal/pdf-preview-modal.component';
import 'rxjs/add/operator/filter';
import 'rxjs/add/operator/debounceTime';
import {
  AfterViewInit,
  Component,
  ComponentFactoryResolver,
  HostBinding,
  ReflectiveInjector,
  ViewChild,
  ViewContainerRef
} from '@angular/core';

@Component({
  selector: 'app-dynamic-modal',
  templateUrl: './dynamic-modal.component.html',
  styleUrls: ['./dynamic-modal.component.sass'],
  entryComponents: [
    BaseModalComponent,
    AlertModalComponent,
    ChartModalComponent,
    PdfPreviewModalComponent
  ]
})
export class DynamicModalComponent implements AfterViewInit {
  private _hideSubscription: Subscription;
  private _showSubscription: Subscription;
  private _dataSubscription: Subscription;
  private _currentComponent = null;

  @HostBinding('class.modal-open') modalOpen = false;
  @ViewChild('modalContainer', { read: ViewContainerRef }) modalContainer: ViewContainerRef;

  constructor(
    private _modalService: SpawnModalService,
    private _resolver: ComponentFactoryResolver
  ) { }

  ngAfterViewInit() {
    this._modalService.stream
      .debounceTime(300)
      .filter((componentData: ModalComponentData) => {
        let flag = true;

        // mark the flag as false so that it will not execute subscribe
        if (!componentData) {
          flag = false;
        }

        return flag;
      })
      .subscribe((componentData: ModalComponentData) => {
        let resolvedInputs = [];

        if (typeof componentData.inputs !== 'undefined') {
          // Inputs need to be in the following format to be resolved properly
          const inputProviders = Object
            .keys(componentData.inputs)
            .map((inputName: string) => {
              return {
                provide: inputName,
                useValue: componentData.inputs[inputName]
              };
            })
            ;

          resolvedInputs = ReflectiveInjector.resolve(inputProviders);
        }

        // We create an injector out of the data we want to pass down and this components injector
        const injector = ReflectiveInjector.fromResolvedProviders(resolvedInputs, this.modalContainer.parentInjector);

        // We create a factory out of the component we want to create
        const factory = this._resolver.resolveComponentFactory(componentData.component);

        // We create the component using the factory and the injector
        const component = factory.create(injector);

        // enable change detection in the component
        component.changeDetectorRef.detectChanges();

        // clean up everything when component is destroyed
        component.onDestroy(() => {
          this._dataSubscription.unsubscribe();

          this._showSubscription.unsubscribe();

          this._hideSubscription.unsubscribe();

          this._currentComponent.changeDetectorRef.detach();
        });

        // We insert the component into the dom container
        this.modalContainer.insert(component.hostView);

        // destroy the previously created component
        if (this._currentComponent !== null) {
          this._currentComponent.destroy();
        }

        // save the current component
        this._currentComponent = component;

        this._dataSubscription = (component.instance as BaseModalComponent).data.subscribe((data: any) => {
          this._modalService.emitOutput(data);
        });

        this._showSubscription = (component.instance as BaseModalComponent).show.subscribe(() => {
          // add the class when modal is opened.
          this.modalOpen = true;
        });

        // destroy the component on unsubscribe
        this._hideSubscription = (component.instance as BaseModalComponent).hide.subscribe(() => {
          // remove the class when modal is closed
          this.modalOpen = false;

          setTimeout(() => {
            this._currentComponent.destroy();
          }, 0);
        });
      })
      ;
  }

}


