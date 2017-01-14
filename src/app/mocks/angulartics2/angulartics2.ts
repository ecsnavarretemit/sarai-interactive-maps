/*!
 * Angulartics2 (Mock)
 *
 * Copyright(c) Exequiel Ceasar Navarrete <esnavarrete1@up.edu.ph>
 * Licensed under MIT
 */

import { ReplaySubject } from 'rxjs/ReplaySubject';

export class MockAngulartics2 {
  public settings: any = {
    pageTracking: {
      autoTrackVirtualPages: true,
      basePath: '',
      excludedRoutes: []
    },
    eventTracking: {},
    developerMode: false
  };

  /*
    @Param: ({url: string, location: Location})
   */
  public pageTrack: ReplaySubject<any> = new ReplaySubject(10);

  /*
    @Param: ({action: any, properties: any})
   */
  public eventTrack: ReplaySubject<any> = new ReplaySubject(10);

  /*
    @Param: (properties: any)
   */
  public exceptionTrack: ReplaySubject<any> = new ReplaySubject(10);

  /*
    @Param: (alias: string)
   */
  public setAlias: ReplaySubject<any> = new ReplaySubject(10);

  /*
    @Param: (userId: string)
   */
  public setUsername: ReplaySubject<any> = new ReplaySubject(10);

  /*
    @Param: ({action: any, properties: any})
   */
  public setUserProperties: ReplaySubject<any> = new ReplaySubject(10);

  /*
    @Param: (properties: any)
   */
  public setUserPropertiesOnce: ReplaySubject<any> = new ReplaySubject(10);

  /*
    @Param: (properties: any)
   */
  public setSuperProperties: ReplaySubject<any> = new ReplaySubject(10);

  /*
    @Param: (properties: any)
   */
  public setSuperPropertiesOnce: ReplaySubject<any> = new ReplaySubject(10);

  /*
    @Param: (properties: any)
   */
  public userTimings: ReplaySubject<any> = new ReplaySubject(10);

  developerMode(value: boolean) {
    this.settings.developerMode = value;
  }

}


