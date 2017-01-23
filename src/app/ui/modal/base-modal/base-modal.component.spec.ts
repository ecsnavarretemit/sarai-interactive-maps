/* tslint:disable:no-unused-variable */

/*!
 * Base Modal Component Test
 *
 * Copyright(c) Exequiel Ceasar Navarrete <esnavarrete1@up.edu.ph>
 * Licensed under MIT
 */

import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement, Injector } from '@angular/core';
import { ModalModule } from 'ng2-bootstrap/modal';

import { BaseModalComponent } from './base-modal.component';

describe('Component: BaseModal', () => {
  let component: BaseModalComponent;
  let fixture: ComponentFixture<BaseModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        BaseModalComponent
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
    fixture = TestBed.createComponent(BaseModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create an instance', () => {
    expect(component).toBeTruthy();
  });

});


