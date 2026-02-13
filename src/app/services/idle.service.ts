import { Injectable, NgZone } from '@angular/core';
// import IdleJs from 'idle-js';

@Injectable({
  providedIn: 'root',
})
export class IdleService {
  // private idle: IdleJs | null = null;

  constructor(private zone: NgZone) {}

  /**
   * Initializes the idle timer
   * @param timeoutMinutes - Time in minutes before the user is considered idle
   * @param onTimeout - Callback function to execute when idle timeout occurs
   */
  // initializeIdleTimer(timeoutMinutes: number, onTimeout: () => void): void {
  //   const timeoutSeconds = timeoutMinutes * 60; // Convert minutes to seconds

  //   // Run outside Angular to prevent unnecessary change detection cycles
  //   this.zone.runOutsideAngular(() => {
  //     this.idle = new IdleJs({
  //       idle: timeoutSeconds,
  //       onIdle: () => {
  //         this.zone.run(() => onTimeout()); // Run inside Angular zone to trigger updates
  //       },
  //       onActive: () => console.log('User is active again.'),
  //       onHide: () => console.log('Browser tab is hidden.'),
  //       onShow: () => console.log('Browser tab is visible.'),
  //     });

  //     this.idle.start(); // Start the idle timer
  //     console.log(`Idle timer started with ${timeoutMinutes} minutes.`);
  //   });
  // }

  // /**
  //  * Stops the idle timer
  //  */
  // stopIdleTimer(): void {
  //   if (this.idle) {
  //     this.idle.stop();
  //     console.log('Idle timer stopped.');
  //   }
  // }
}
