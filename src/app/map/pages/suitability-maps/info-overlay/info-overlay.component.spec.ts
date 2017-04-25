/*!
 * Info Overlay Component Test
 *
 * Copyright(c) Exequiel Ceasar Navarrete <esnavarrete1@up.edu.ph>
 * Licensed under MIT
 */

import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { provideStore } from '@ngrx/store';

import { PanelsReducer } from '../../../../store';
import { InfoOverlayComponent } from './info-overlay.component';

describe('InfoOverlayComponent', () => {
  let component: InfoOverlayComponent;
  let fixture: ComponentFixture<InfoOverlayComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        InfoOverlayComponent
      ],
      providers: [
        provideStore({
          panels: PanelsReducer
        })
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InfoOverlayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

});


