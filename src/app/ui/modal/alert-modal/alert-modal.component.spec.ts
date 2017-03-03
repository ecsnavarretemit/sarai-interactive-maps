/* tslint:disable:no-unused-variable */

/*!
 * Alert Modal Component Test
 *
 * Copyright(c) Exequiel Ceasar Navarrete <esnavarrete1@up.edu.ph>
 * Licensed under MIT
 */

import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement, Injector } from '@angular/core';
import { ModalModule } from 'ng2-bootstrap/modal';

import { AlertModalComponent } from './alert-modal.component';

describe('Component: AlertModal', () => {
  let component: AlertModalComponent;
  let fixture: ComponentFixture<AlertModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        AlertModalComponent
      ],
      imports: [
        ModalModule.forRoot()
      ],
      providers: [
        Injector
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AlertModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create an instance', () => {
    expect(component).toBeTruthy();
  });

});


