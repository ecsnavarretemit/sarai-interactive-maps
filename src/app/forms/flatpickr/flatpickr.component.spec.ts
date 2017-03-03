/* tslint:disable:no-unused-variable */

/*!
 * FlatPickr Component Test
 *
 * Copyright(c) Exequiel Ceasar Navarrete <esnavarrete1@up.edu.ph>
 * Licensed under MIT
 */

import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { FlatpickrComponent } from './flatpickr.component';

describe('Component: Flatpickr', () => {
  let component: FlatpickrComponent;
  let fixture: ComponentFixture<FlatpickrComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FlatpickrComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FlatpickrComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should emit open event', async(() => {
    component.open.subscribe((value: string) => {
      expect(value).toBe('');
    });

    component.pluginInstance.open();
  }));

  it('should emit change event', async(() => {
    const dateStr = '2017-01-04';

    component.change.subscribe((value: string) => {
      expect(value).toBe(dateStr);
    });

    // the second argument is not documented but it means if we need to fire change event or not.
    // definitely we need to explicitly set second argument to true if we want to check if our
    // event emitter works.
    component.pluginInstance.setDate(dateStr, true);
  }));

  it('should emit close event', async(() => {
    component.close.subscribe((value: string) => {
      expect(value).toBe('');
    });

    component.pluginInstance.close();
  }));

});


