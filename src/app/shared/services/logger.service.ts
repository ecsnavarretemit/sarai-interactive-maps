/*!
 * Logger Service
 *
 * Copyright(c) Exequiel Ceasar Navarrete <esnavarrete1@up.edu.ph>
 * Licensed under MIT
 */

import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/Subject';

export interface StreamData {
  type: string;
  title: string;
  message: string;
  emit: boolean;
}

@Injectable()
export class LoggerService {
  private _stream: Subject<StreamData>;

  constructor() {
    this._stream = new Subject<StreamData>();
  }

  write(title: string, type: string, message: string, emit: boolean) {
    this._stream.next({
      type,
      title,
      message,
      emit
    });
  }

  log(title: string, message: string, emit: boolean) {
    this.write(title, 'log', message,  emit);
  }

  error(title: string, message: string, emit: boolean) {
    this.write(title, 'error', message,  emit);
  }

  warning(title: string, message: string, emit: boolean) {
    this.write(title, 'warning', message,  emit);
  }

  getMessageStream(): Subject<StreamData> {
    return this._stream;
  }

}


