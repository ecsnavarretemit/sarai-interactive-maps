/*!
 * Spawn Modal Service
 *
 * Copyright(c) Exequiel Ceasar Navarrete <esnavarrete1@up.edu.ph>
 * Licensed under MIT
 */

import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/Subject';
import { ModalComponentData } from './modal-component-data.interface';

@Injectable()
export class SpawnModalService {
  private _stream: Subject<ModalComponentData>;

  constructor() {
    this._stream = new Subject<ModalComponentData>();
  }

  spawn(componentData: ModalComponentData) {
    this._stream.next(componentData);
  }

  get stream(): Subject<ModalComponentData> {
    return this._stream;
  }

}


