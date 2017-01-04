/*!
 * FlatPickr Model
 *
 * Copyright(c) Exequiel Ceasar Navarrete <esnavarrete1@up.edu.ph>
 * Licensed under MIT
 */

declare namespace FlatpickrTypes {
  type DateString = Date | string;
  type DateRange = DateString | { from: DateString, to: DateString } | ((date: Date) => boolean);
  type Mode = 'single' | 'multiple' | 'range';
  type EventCallback = (selectedDates: Date[], dateStr: string, instance: Flatpickr, elem: HTMLElement) => void;
}

export interface Flatpickr {
  constructor(element: string | Element, options?: FlatpickrOptions);

  changeMonth(month: number, isOffset: boolean): void;
  clear(): void;
  close(): void;
  destroy(): void;
  formatDate(format: string, date: Date): string;
  jumpToDate(date?: FlatpickrTypes.DateString): void;
  open(): void;
  parseDate(date: string): Date;
  redraw(): void;
  set(option: string, value: any): void;
  setDate(date: FlatpickrTypes.DateString | FlatpickrTypes.DateString[]): void;
  toggle(): void;
}

export interface FlatpickrOptions {
  altFormat?: string;
  altInput?: boolean;
  altInputClass?: string;
  allowInput?: boolean;
  clickOpens?: boolean;
  dateFormat?: string | null;
  defaultDate?: FlatpickrTypes.DateString | FlatpickrTypes.DateString[];
  disable?: FlatpickrTypes.DateRange[];
  enable?: FlatpickrTypes.DateRange[];
  enableTime?: boolean;
  enableSeconds?: boolean;
  hourIncrement?: number;
  inline?: boolean;
  maxDate?: FlatpickrTypes.DateString;
  minDate?: FlatpickrTypes.DateString;
  minuteIncrement?: number;
  mode?: FlatpickrTypes.Mode;
  nextArrow?: string;
  noCalendar?: boolean;
  onChange?: FlatpickrTypes.EventCallback | FlatpickrTypes.EventCallback[];
  onClose?: FlatpickrTypes.EventCallback | FlatpickrTypes.EventCallback[];
  onOpen?: FlatpickrTypes.EventCallback | FlatpickrTypes.EventCallback[];
  onReady?: FlatpickrTypes.EventCallback | FlatpickrTypes.EventCallback[];
  onMonthChange?: FlatpickrTypes.EventCallback | FlatpickrTypes.EventCallback[];
  onYearChange?: FlatpickrTypes.EventCallback | FlatpickrTypes.EventCallback[];
  onValueUpdate?: FlatpickrTypes.EventCallback | FlatpickrTypes.EventCallback[];
  onDayCreate?: FlatpickrTypes.EventCallback | FlatpickrTypes.EventCallback[];
  parseDate?: (date: string) => Date;
  prevArrow?: string;
  shorthandCurrentMonth?: boolean;
  static?: boolean;
  time_24hr?: boolean;
  utc?: boolean;
  weekNumbers?: boolean;
  wrap?: boolean;
}


