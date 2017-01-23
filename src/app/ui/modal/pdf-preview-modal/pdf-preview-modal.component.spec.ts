/* tslint:disable:no-unused-variable */

/*!
 * PDF Preview Modal Component Test
 *
 * Copyright(c) Exequiel Ceasar Navarrete <esnavarrete1@up.edu.ph>
 * Licensed under MIT
 */

import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement, Injector } from '@angular/core';
import { ModalModule } from 'ng2-bootstrap/modal';
import { PdfViewerComponent } from 'ng2-pdf-viewer';

import { PdfPreviewModalComponent } from './pdf-preview-modal.component';

describe('Component: PdfPreviewModal', () => {
  let component: PdfPreviewModalComponent;
  let fixture: ComponentFixture<PdfPreviewModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        PdfPreviewModalComponent,
        PdfViewerComponent
      ],
      imports: [
        ModalModule.forRoot()
      ],
      providers: [
        Injector,
        { provide: 'src', useValue: 'dummy.pdf'  },
        { provide: 'downloadFilename', useValue: 'dummy.pdf' }
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PdfPreviewModalComponent);
    component = fixture.componentInstance;

    fixture.detectChanges();
  });

  it('should create an instance', () => {
    expect(component).toBeTruthy();
  });

});


