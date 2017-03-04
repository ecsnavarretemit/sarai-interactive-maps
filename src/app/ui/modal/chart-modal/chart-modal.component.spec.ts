/* tslint:disable:no-unused-variable */

/*!
 * Chart Modal Component Test
 *
 * Copyright(c) Exequiel Ceasar Navarrete <esnavarrete1@up.edu.ph>
 * Licensed under MIT
 */

import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { ComponentFactoryResolver, DebugElement, Injector } from '@angular/core';
import { ModalModule } from 'ng2-bootstrap/modal';

import { ChartModalComponent } from './chart-modal.component';

describe('Component: ChartModal', () => {
  let component: ChartModalComponent;
  let fixture: ComponentFixture<ChartModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        ChartModalComponent
      ],
      imports: [
        ModalModule.forRoot()
      ],
      providers: [
        ComponentFactoryResolver,
        Injector
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChartModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

});


