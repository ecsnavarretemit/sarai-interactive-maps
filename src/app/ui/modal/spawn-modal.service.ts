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
  private _outputStream: Subject<any>;

  constructor() {
    this._stream = new Subject<ModalComponentData>();
    this._outputStream = new Subject<any>();
  }

  spawn(componentData: ModalComponentData) {
    this._stream.next(componentData);
  }

  get stream(): Subject<ModalComponentData> {
    return this._stream;
  }

  emitOutput(output: any) {
    this._outputStream.next(output);
  }

  get outputStream(): Subject<any> {
    return this._outputStream;
  }

}


