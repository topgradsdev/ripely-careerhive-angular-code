// // import { Injectable, NgZone } from '@angular/core';
// // import { Router } from '@angular/router';
// // import { fromEvent, merge, Subscription, timer } from 'rxjs';
// // import { switchMap } from 'rxjs/operators';
// // import { TopgradserviceService } from './topgradservice.service';
// // import { SessionSyncService } from './session-sync.service';

// // @Injectable({
// //   providedIn: 'root'
// // })
// // export class IdleTimeoutService {
// //   private userActivityEvents = ['mousemove', 'mousedown', 'keypress', 'touchstart', 'scroll'];
// //   private timeoutSubscription?: Subscription;
// //   private readonly idleTime = 0.20 * 60 * 1000; // 15 min (for testing)
// //   private readonly STORAGE_KEY = 'lastActivityTime';

// //   constructor(
// //     private router: Router,
// //     private ngZone: NgZone,
// //     private service: TopgradserviceService,
// //     private sessionSync: SessionSyncService
// //   ) {}

// //   startWatching(): void {
// //     const userProfile = JSON.parse(localStorage.getItem('userSDetail') || 'null');

// //     // ✅ Only enable for student role
// //     if (!userProfile || userProfile.role !== 'student') {
// //       this.stopWatching(); // Ensure no leftover subscriptions
// //       return;
// //     }

// //     // ✅ Sync across tabs
// //     window.addEventListener('storage', this.handleStorageChange);

// //     this.ngZone.runOutsideAngular(() => {
// //       const activity$ = merge(
// //         ...this.userActivityEvents.map(event => fromEvent(document, event))
// //       );

// //       // 🕒 Watch user activity and reset timer
// //       this.timeoutSubscription = activity$
// //         .pipe(
// //           switchMap(() => {
// //             localStorage.setItem(this.STORAGE_KEY, Date.now().toString());
// //             return timer(this.idleTime);
// //           })
// //         )
// //         .subscribe(() => {
// //           this.ngZone.run(() => this.logout());
// //         });
// //     });

// //     // Initialize timestamp for the current tab
// //     localStorage.setItem(this.STORAGE_KEY, Date.now().toString());
// //   }

// //   stopWatching(): void {
// //     this.timeoutSubscription?.unsubscribe();
// //     window.removeEventListener('storage', this.handleStorageChange);
// //   }

// //   private handleStorageChange = (event: StorageEvent): void => {
// //     if (event.key === this.STORAGE_KEY && event.newValue) {
// //       this.restartTimer();
// //     }
// //   };

// //   private restartTimer(): void {
// //     this.timeoutSubscription?.unsubscribe();

// //     this.ngZone.runOutsideAngular(() => {
// //       const activity$ = merge(
// //         ...this.userActivityEvents.map(event => fromEvent(document, event))
// //       );

// //       this.timeoutSubscription = activity$
// //         .pipe(
// //           switchMap(() => {
// //             localStorage.setItem(this.STORAGE_KEY, Date.now().toString());
// //             return timer(this.idleTime);
// //           })
// //         )
// //         .subscribe(() => {
// //           this.ngZone.run(() => this.logout());
// //         });
// //     });
// //   }

// //   private callLogoutApi(): void {
// //     const userProfile = JSON.parse(localStorage.getItem('userSDetail') || 'null');
// //     if (!userProfile || userProfile.role !== 'student') return;

// //     if(userProfile.is_admin){
// //       let body = {
// //         student_id:userProfile._id,
// //         email:userProfile?.admin_data.email,
// //         type:'admin',
// //       }
// //       this.service.impersonateLogin(body).subscribe((res: any) => {
// //       console.log("res", res)
// //       if (res.token) {
// //         // res.data['is_admin'] = true;
// //         localStorage.removeItem("userSDetail");
// //         localStorage.setItem("token", res.token);
// //         this.sessionSync.broadcastRoleSwitch('admin');
// //         this.router.navigate(["/admin/wil/view-student-profile"], {queryParams: {id: userProfile._id}});
// //       } else {
// //         console.log("res", res)
// //       }
// //     })
// //     }else{
// //        const body = {
// //       student_id: userProfile._id,
// //       type: 'student'
// //     };

// //     this.service.autoLogout(body).subscribe((res: any) => {
// //       if (res.result === 'success') {
// //         localStorage.clear();
// //         sessionStorage.clear();
// //         this.sessionSync.broadcastLogout();
// //         this.router.navigate(['/student-login']);
// //       }
// //     });
// //     }
   
// //   }

// //   private logout(): void {
// //     const userProfile = JSON.parse(localStorage.getItem('userSDetail') || 'null');
// //     if (userProfile && userProfile.role === 'student') {
// //       this.callLogoutApi();
// //     }
// //   }
// // }


// import { Injectable, NgZone } from '@angular/core';
// import { Router } from '@angular/router';
// import { fromEvent, merge, Subscription, timer } from 'rxjs';
// import { switchMap } from 'rxjs/operators';
// import { TopgradserviceService } from './topgradservice.service';
// import { SessionSyncService } from './session-sync.service';

// @Injectable({ providedIn: 'root' })
// export class IdleTimeoutService {
//   private userActivityEvents = ['mousemove', 'mousedown', 'keypress', 'touchstart', 'scroll'];
//   private timeoutSubscription?: Subscription;
//   private readonly idleTime = 0.40 * 60 * 1000; // 15 minutes
//   private readonly STORAGE_KEY = 'lastActivityTime';

//   constructor(
//     private router: Router,
//     private ngZone: NgZone,
//     private service: TopgradserviceService,
//     private sessionSync: SessionSyncService
//   ) {}

//   startWatching(): void {
//     const userProfile = JSON.parse(localStorage.getItem('userSDetail') || 'null');
//     if (!userProfile || userProfile.role !== 'student') return;

//     this.ngZone.runOutsideAngular(() => {
//       const activity$ = merge(...this.userActivityEvents.map(event => fromEvent(document, event)));
//       this.timeoutSubscription = activity$
//         .pipe(
//           switchMap(() => {
//             localStorage.setItem(this.STORAGE_KEY, Date.now().toString());
//             return timer(this.idleTime);
//           })
//         )
//         .subscribe(() => this.ngZone.run(() => this.logout()));
//     });

//     localStorage.setItem(this.STORAGE_KEY, Date.now().toString());

//     // Cross-tab sync for lastActivityTime
//     window.addEventListener('storage', (event) => {
//       if (event.key === this.STORAGE_KEY && event.newValue) {
//         this.resetTimer();
//       }
//     });
//   }

//   private resetTimer(): void {
//     this.timeoutSubscription?.unsubscribe();
//     this.startWatching();
//   }

//   private logout(): void {
//     const userProfile = JSON.parse(localStorage.getItem('userSDetail') || 'null');
//     if (!userProfile || userProfile.role !== 'student') return;

//     if (userProfile.is_admin) {
//       const body = {
//         student_id: userProfile._id,
//         email: userProfile?.admin_data?.email,
//         type: 'admin'
//       };
//       this.service.impersonateLogin(body).subscribe((res: any) => {
//         if (res?.token) {
//           localStorage.setItem('token', res.token);
//           this.sessionSync.broadcastRoleSwitch('admin');
//           this.router.navigate(['/admin/wil/view-student-profile'], {
//             queryParams: { id: userProfile._id },
//           });
//         }
//       });
//     } else {
//       const body = { student_id: userProfile._id, type: 'student' };
//       this.service.autoLogout(body).subscribe((res: any) => {
//         if (res?.result === 'success') {
//           localStorage.clear();
//           sessionStorage.clear();
//           this.sessionSync.broadcastLogout();
//           this.router.navigate(['/student-login']);
//         }
//       });
//     }
//   }

//   stopWatching(): void {
//     this.timeoutSubscription?.unsubscribe();
//   }
// }

// import { Injectable, NgZone } from '@angular/core';
// import { SessionSyncService } from './session-sync.service';

// @Injectable({
//   providedIn: 'root'
// })
// export class IdleTimeoutService {
//   private idleTime = 0.5 * 60 * 1000; // 15 min
//   private activityTimer?: any;

//   constructor(private sessionSync: SessionSyncService, private ngZone: NgZone) {
//     this.init();
//   }

//   /** Initialize idle timeout */
//   init() {
//     const user = JSON.parse(localStorage.getItem('userSDetail') || '{}');
//     if (!user || user.role !== 'student') return;

//     // Listen to user activity
//     ['mousemove', 'mousedown', 'keypress', 'touchstart', 'scroll'].forEach(event =>
//       window.addEventListener(event, () => this.resetTimer(user._id))
//     );

//     // Tab / browser close
//     window.addEventListener('beforeunload', () => {
//       this.sessionSync.broadcastLogout(user._id);
//     });

//     // Start timer
//     this.startTimer(user._id);
//   }

//   private resetTimer(userId: string) {
//     clearTimeout(this.activityTimer);
//     this.sessionSync.broadcastStudentActivity(userId);
//     this.startTimer(userId);
//   }

//   private startTimer(userId: string) {
//     this.activityTimer = setTimeout(() => {
//       this.sessionSync.broadcastLogout(userId);
//     }, this.idleTime);
//   }
// }


// import { Injectable, NgZone } from '@angular/core';
// import { SessionSyncService } from './session-sync.service';

// @Injectable({
//   providedIn: 'root'
// })
// export class IdleTimeoutService {
//   private userId?: string;

//   constructor(private sessionSync: SessionSyncService, private ngZone: NgZone) {
//     this.init();
//   }

//   init() {
//     const user = JSON.parse(localStorage.getItem('userSDetail') || '{}');
//     if (!user || user.role !== 'student') return;
//     this.userId = user._id;

//     // Report activity on user events
//     ['mousemove', 'mousedown', 'keypress', 'touchstart', 'scroll'].forEach(event =>
//       window.addEventListener(event, () => this.reportActivity())
//     );

//     // Tab close
//     window.addEventListener('beforeunload', () => this.reportActivity());
    
//     // Periodic ping to server to show tab alive
//     setInterval(() => {
//       console.log
//       this.reportActivity()
//     }, 10 * 1000);
//   }

//   private reportActivity() {
//     if (!this.userId) return;
//     this.sessionSync.broadcastStudentActivity(this.userId);
//   }
// }
// import { Injectable, NgZone } from '@angular/core';
// import { SessionSyncService } from './session-sync.service';
// import { TopgradserviceService } from './topgradservice.service';
// import { Router } from '@angular/router';

// @Injectable({
//   providedIn: 'root'
// })
// export class IdleTimeoutService {
//   private timeoutInMinutes = 0.4; // ⏱️ ~24 seconds (0.4 min)
//   private timeoutHandle: any;
//   private events = ['mousemove', 'mousedown', 'keypress', 'touchstart', 'scroll'];
//   private userId: string | null = null;

//   constructor(
//     private ngZone: NgZone,
//     private sessionSync: SessionSyncService,
//     private service: TopgradserviceService,
//     private router: Router
//   ) {}

//   /** Start tracking user inactivity */
//   startTracking(userId: string) {
//     this.userId = userId;
//     this.resetTimer();
//     this.events.forEach(event =>
//       window.addEventListener(event, this.resetTimer.bind(this), true)
//     );
//   }

//   /** Stop tracking */
//   stopTracking() {
//     this.events.forEach(event =>
//       window.removeEventListener(event, this.resetTimer.bind(this), true)
//     );
//     clearTimeout(this.timeoutHandle);
//     this.userId = null;
//   }

//   /** Reset idle timer */
//   private resetTimer() {
//     clearTimeout(this.timeoutHandle);
//     this.timeoutHandle = setTimeout(() => {
//       this.ngZone.run(() => {
//         if (!this.userId) return;

//         console.log('🕒 Idle detected — auto logout triggered for', this.userId);

//         const userProfile = JSON.parse(localStorage.getItem('userSDetail') || 'null');

//         if (!userProfile) {
//           console.warn('No user profile found in localStorage.');
//           return;
//         }

//         // 🧩 Case 1: Student logged in via Admin impersonation
//         if (userProfile.is_admin) {
//           const admin = JSON.parse(localStorage.getItem('userDetail') || '{}');
//           if (!admin || !admin.email) {
//             console.error('Admin details missing in localStorage.');
//             return;
//           }

//           const body = {
//             student_id: userProfile._id,
//             email: admin.email,
//             type: 'admin'
//           };

//           this.service.impersonateLogin(body).subscribe({
//             next: (res: any) => {
//               if (res?.token) {
//                 // Notify admin tabs that student switched back
//                 this.sessionSync.broadcastStudentToAdmin(admin.email, userProfile._id);

//                 // Update local storage for admin session
//                 localStorage.removeItem('userSDetail');
//                 localStorage.setItem('userDetail', JSON.stringify(res.data));
//                 localStorage.setItem('token', res.token);

//                 // Navigate admin back to student profile
//                 this.router.navigateByUrl(`/admin/wil/view-student-profile?id=${userProfile._id}`, {
//                   skipLocationChange: false
//                 });
//               } else {
//                 console.error('Impersonate login failed:', res);
//               }
//             },
//             error: err => console.error('Error in impersonateLogin API:', err)
//           });
//         }

//         // 🧩 Case 2: Regular student logout
//         else {
//           const body = {
//             student_id: userProfile._id, // ✅ FIXED (was userProfile.user_id)
//             type: 'student'
//           };

//           this.service.autoLogout(body).subscribe({
//             next: (res: any) => {
//               if (res?.result === 'success') {
//                 localStorage.clear();
//                 sessionStorage.clear();
//                 this.router.navigate(['/student-login']);
//               } else {
//                 console.log('Logout failed:', res);
//               }
//             },
//             error: err => console.error('Logout error:', err)
//           });
//         }

//         // 🔔 Notify other tabs + stop tracking
//         this.sessionSync.broadcastLogout(this.userId);
//         this.stopTracking();
//       });
//     }, this.timeoutInMinutes * 60 * 1000); // ✅ FIXED multiplier (minutes → ms)
//   }
// }


// import { Injectable, NgZone } from '@angular/core';
// import { SessionSyncService } from './session-sync.service';
// import { TopgradserviceService } from './topgradservice.service';
// import { Router } from '@angular/router';

// @Injectable({
//   providedIn: 'root'
// })
// export class IdleTimeoutService {
//   private timeoutInMinutes = 15; // 10 minutes idle timeout
//   private timeoutHandle: any;
//   // private events = ['mousemove', 'mousedown', 'keypress', 'touchstart', 'scroll'];
//   private events = ['click', 'keypress', 'scroll', 'touchstart']; // meaningful activity
//   private userId: string | null = null;

//   constructor(
//     private ngZone: NgZone,
//     private sessionSync: SessionSyncService,
//     private service: TopgradserviceService,
//     private router: Router
//   ) {}

//   /** Start tracking user inactivity */
//   startTracking(userId: string) {
//     console.log("userId", userId)
//     this.userId = userId;
//     this.resetTimer();

//     // Listen to all user events
//     this.events.forEach(event =>
//       window.addEventListener(event, () => {
//         this.resetTimer();
//         this.broadcastActivity(); // notify server that this tab is active
//       }, true)
//     );

//     // Optional: heartbeat for background tabs
//     setInterval(() => this.broadcastActivity(), 30000); // every 30 seconds
//   }

//   /** Stop tracking */
//   stopTracking() {
//     this.events.forEach(event =>
//       window.removeEventListener(event, this.resetTimer.bind(this), true)
//     );
//     clearTimeout(this.timeoutHandle);
//     this.userId = null;
//   }

//   /** Reset idle timer */
//   private resetTimer() {
//     clearTimeout(this.timeoutHandle);
//     this.timeoutHandle = setTimeout(() => {
//       if (this.userId) {
//         console.log("this.userId", this.userId)
//         console.log('🕒 Idle detected in tab, sending activity to server:', this.userId);
//         this.broadcastActivity(); // final ping to server
//         // Do not logout directly in multi-tab scenario
//       }
//     }, this.timeoutInMinutes * 60 * 1000);
//   }

//   /** Notify server that this tab is active */
//   private broadcastActivity() {
//     if (this.userId) {
//       console.log("this.userId", this.userId)
//       this.sessionSync.broadcastStudentActivity(this.userId);
//     }
//   }
// }
import { Injectable, NgZone } from '@angular/core';
import { SessionSyncService } from './session-sync.service';
import { TopgradserviceService } from './topgradservice.service';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class IdleTimeoutService {
  private timeoutInMinutes = 15; // idle time in minutes
  private timeoutHandle: any;
  private userId: string | null = null;
  private events = ['click', 'keypress', 'scroll', 'touchstart']; // meaningful activity
  private bc: BroadcastChannel;

  constructor(
    private ngZone: NgZone,
    private sessionSync: SessionSyncService,
    private service: TopgradserviceService,
    private router: Router
  ) {
    this.bc = new BroadcastChannel('angular-idle-channel');

    // Listen for activity from other Angular tabs
    this.bc.onmessage = (msg) => {
      if (msg.data === 'user-active') {
        this.resetTimer();
      }
    };
  }

  /** Start tracking user activity in this tab */
  startTracking(userId: string) {
    const userProfile = JSON.parse(localStorage.getItem('userSDetail') || 'null');
    if (!userProfile || userProfile.role !== 'student') {
      // ❌ Not a student → skip idle tracking entirely
      console.log('Idle tracking disabled (user is not a student)');
      return;
    }

    
    this.userId = userId;
    if(userProfile){
        this.userId = userProfile?._id
    }
    this.resetTimer();

    // Listen for meaningful events in this tab
    this.events.forEach(event => {
      window.addEventListener(event, () => {

        // console.log("update event", event)
        this.resetTimer();
        this.broadcastActivity();
      }, true);
    });

    // Optional: heartbeat to server every 30 seconds
    // setInterval(() => this.broadcastActivity(), 30000);
  }

  
  /** Reset the idle timer */
  private resetTimer() {
    clearTimeout(this.timeoutHandle);
    this.timeoutHandle = setTimeout(() => {
      const userProfile = JSON.parse(localStorage.getItem('userSDetail') || 'null');
      // // console.log('Idle timeout reached', this.userId);
      // if(userProfile){
      //   this.userId = userProfile?._id
      // }
      if (userProfile?._id) {
        this.handleIdleLogout();
      }
    }, this.timeoutInMinutes * 60 * 1000);
  }

  /** Handle the actual logout for idle */
  private handleIdleLogout() {
    if (!this.userId) return;
    const userProfile = JSON.parse(localStorage.getItem('userSDetail') || 'null');

    // Notify server about idle/logout
    
    // console.log("userProfile", userProfile)
    if(userProfile && userProfile.is_admin){
         const body = {
              student_id: userProfile._id,
              email: userProfile?.admin_data?.email,
              type: 'admin',
              };

         this.service.impersonateLogin(body).subscribe({
              next: (res: any) => {
                  if (res?.token) {
                  // Notify admin tabs that student switched back
                  this.sessionSync.broadcastStudentToAdmin(userProfile?.admin_data?.email, userProfile._id);

                  // Update local storage for admin session
                  localStorage.removeItem('userSDetail');
                  localStorage.setItem('userDetail', JSON.stringify(res.data));
                  localStorage.setItem('token', res.token);
                  localStorage.setItem('impersonate', "true");

                  // Navigate admin back to student profile
                  this.router.navigateByUrl(`/admin/wil/view-student-profile?id=${userProfile._id}`, {
                      skipLocationChange: false,
                  });
                  } else {
                  console.error('Impersonate login failed:', res);
                  }
              },
              error: (err) => console.error('Error in impersonateLogin API:', err),
              });
    }else{
      // this.sessionSync.tabclose(userProfile?._id);
      let body = {
        student_id:userProfile?._id,
        type:'student',
      }
      this.service.autoLogout(body).subscribe((res: any) => {
      console.log("res", res)
      if (res.result === 'success') {
        // res.data['is_admin'] = true;
        
        this.sessionSync.broadcastLogout(userProfile?.email);
        localStorage.clear();
        sessionStorage.clear();
        this.router.navigate(['/student-login']);
        // this.oktaAuth.signOut({ postLogoutRedirectUri: 'https://monash.careerhive.com.au/' });
      } else {
        console.log("res", res)
      }
    })
    }

    // Send beacon to server
    // const body = {
    //   student_id: this.userId,
    //   type: 'student'
    // };
    // this.sendBeacon('/auth/auto-logout', body);

    // // Notify other tabs to reset their timers
    // this.bc.postMessage('user-active');
  }

  /** Detect if this is a page refresh */
  private isPageRefresh(): boolean {
    const entries = performance.getEntriesByType('navigation');
    const navEntry = entries[0] as PerformanceNavigationTiming | undefined;
    return navEntry?.type === 'reload';
  }

  /** Broadcast activity to other Angular tabs and server */
  private broadcastActivity() {
    if (this.isPageRefresh()) {
      console.log('Page refresh detected — skipping activity broadcast');
      return;
    }

    if (!this.userId) return;
    // Notify server this tab is active
    // this.sessionSync.tabclose(this.userId);
    
  }

  /** Use navigator.sendBeacon to safely send data on tab close */
  private sendBeacon(url: string, body: any) {
    const data = JSON.stringify(body);
    navigator.sendBeacon(url, data);
  }
}
