import { Component, HostListener, NgZone, OnDestroy, OnInit, inject } from '@angular/core';
import { Router, NavigationEnd, NavigationStart } from '@angular/router';

import { IconSetService } from '@coreui/icons-angular';
import { freeSet } from '@coreui/icons';
import { filter } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { environment } from '../environments/environment';
import { IdleService } from './services/idle.service';
import { TopgradserviceService } from './topgradservice.service';
import { BehaviorSubject, Subscription } from 'rxjs';
import { IdleTimeoutService } from './idle-timeout.service';
import { DOCUMENT } from '@angular/common';
import { SessionSyncService } from './session-sync.service';

declare var bootstrap: any; // Bootstrap 5

// import { Idle, DEFAULT_INTERRUPTSOURCES } from '@ng-idle/core';
@Component({
  // tslint:disable-next-line
  selector: 'body',
  template: '<router-outlet></router-outlet>',
  providers: [IconSetService],
})
export class AppComponent implements OnInit, OnDestroy {
  // idleState = 'Active';
  // idleTimeout = 1 * 60; // 1 minute timeout
  // private popListener: any;

   private document = inject(DOCUMENT);
  SERVER_URL = environment.SERVER_URL;
  SERVER = environment.SERVER;
   private popListener!: (e: PopStateEvent) => void;
  private shownListener!: EventListenerOrEventListenerObject;
  private hiddenListener!: EventListenerOrEventListenerObject;
  private routerSub!: Subscription;
  private manualClose = false; // flag to ignore popstate triggered by our own history.back()
private navigatingWithinApp = false;
  constructor(
    private router: Router,
    private ngZone: NgZone,
    public iconSet: IconSetService,
    private http: HttpClient,
    private idleService: IdleService,
    private service: TopgradserviceService,
    private idleTimeoutService: IdleTimeoutService,
    private sessionSync: SessionSyncService
  ) {
    // iconSet singleton
    // alert("call Api")

    this.router.events.subscribe(() => {
      this.navigatingWithinApp = true;
    });
    iconSet.icons = { ...freeSet };

    if (environment.maintenanceMode) {
      this.router.navigate(['/maintenance']);
    }

    // this.idleService.initializeIdleTimer(1, () => {
    //   alert('You have been logged out due to inactivity.');
    //   this.logout();
    // });
    // Set idle timeout
    //  this.idle.setIdle(this.idleTimeout);
    //  this.idle.setTimeout(5); // Wait 5 more seconds before logout
    //  this.idle.setInterrupts(DEFAULT_INTERRUPTSOURCES);

    //  // When idle timeout occurs
    //  this.idle.onTimeout.subscribe(() => {
    //    alert('You have been logged out due to inactivity.');
    //    this.logout();
    //  });

    //  // Reset session storage on activity
    //  this.idle.onInterrupt.subscribe(() => {
    //    console.log('User is active again.');
    //    sessionStorage.removeItem('sessionExpired');
    //  });

    //  // Start watching for idle state
    //  this.resetIdleTimer();

  }
  // resetIdleTimer(): void {
  //   this.idle.watch();
  //   this.idleState = 'Watching for inactivity...';
  // }
  // idle: any = new Idle().whenNotInteractive().within(1).do(() => this.logout()).start();

  // ngOnDestroy(): void {
  //   // Stop idle timer to prevent memory leaks
  //   this.idleService.stopIdleTimer();
  // }
//  private unloadHandler = (event: BeforeUnloadEvent) => {
//     console.log('Tab or browser is closing!');

//     const userProfile = JSON.parse(localStorage.getItem('userSDetail') || 'null');
//     if (!userProfile || this.navigatingWithinApp) return;

  
//    if (userProfile.is_admin) {
//       // const body = {
//       //   student_id: userProfile._id,
//       //   email: userProfile?.admin_data?.email,
//       //   type: 'admin'
//       // };
//       // this.sendBeacon('/auth/impersonate-login', body);
//       // localStorage.setItem("token", res.token);
//       // this.sessionSync.broadcastRoleSwitch('admin');
//       // this.router.navigate(["/admin/wil/view-student-profile"], {queryParams: {id: userProfile._id}});
//         // ADMIN → Impersonate student
//       const body = {
//         student_id: userProfile._id,
//         email: userProfile?.admin_data?.email,
//         type: 'admin'
//       };

//       // ✅ Must use HttpClient to get response
//       this.http.post(this.SERVER_URL+'auth/impersonate-login', body).subscribe((res: any) => {
//         if (res && res.token) {
//           localStorage.setItem('token', res.token);
//           localStorage.setItem('role', 'student');
//           localStorage.removeItem("userSDetail");

//           // Notify all tabs
//           this.sessionSync.broadcastStudentToAdmin(res.data.email);

//           this.router.navigate(
//             ['/admin/wil/view-student-profile'],
//             { queryParams: { id: userProfile._id } }
//           );
//         }
//       }, err => {
//         console.error('Impersonate login failed:', err);
//       });


//     }else 
//      if (userProfile.role === 'student') {
//       const body = {
//         student_id: userProfile._id,
//         type: 'student'
//       };
//       this.sendBeacon('/auth/auto-logout', body);
//        // Clear storage
//       this.sessionSync.broadcastLogout(userProfile._id);
//       localStorage.clear();
//       sessionStorage.clear();
//     } 

   

//     // Optional: show confirmation dialog
//     // event.returnValue = '';
//   };

  // Helper to send data reliably on tab close
  private sendBeacon(url: string, body: any) {
    const data = JSON.stringify(body);
    navigator.sendBeacon(url, data);
  }


  // 🔹 Detect if it's a page refresh or new login
  private isPageRefresh(): boolean {
    const flag = sessionStorage.getItem('isRefresh');
    if (flag) {
      // remove flag after one use
      sessionStorage.removeItem('isRefresh');
      return true; // Fresh login or navigation, skip auto logout
    }

    // Detect actual browser reload
    const navEntries = performance.getEntriesByType('navigation') as PerformanceNavigationTiming[];
    const isReload = navEntries.length > 0 && navEntries[0].type === 'reload';
    return isReload;
  }

  private windowLoaded$ = new BehaviorSubject(false);
  private isInitialized$ = new BehaviorSubject(false);

  // @HostListener('window:load', ['$event'])
  // onWindowLoad(event: Event) {
  //   console.log('✅ Window fully loaded:', event);
    
  //   // Run inside Angular zone for stability
  //   this.ngZone.runOutsideAngular(() => {
  //     setTimeout(() => {
  //       this.ngZone.run(() => {
  //         this.afterWindowLoaded();
  //         this.windowLoaded$.next(true);
  //       });
  //     }, 500); // slight delay ensures DOM + Angular init complete
  //   });
  // }

  // private afterWindowLoaded() {
  //   if (this.isPageRefresh()) {
  //     console.log('🔁 Page refresh detected — skipping logout');
  //     return;
  //   }

  //   const user = JSON.parse(localStorage.getItem('userSDetail') || '{}');
  //   if (!user?._id) {
  //     console.log('⚠️ No valid user found in localStorage.');
  //     return;
  //   }

  //   console.log("👤 User detected:", user);

  
  //   // const body = {
  //   //   student_id: user._id,
  //   //   type: 'student'
  //   // };
  //   //   const apiUrl = `${environment.SERVER_URL}auth/auto-logout`; // adjust the endpoint path
  //   //   this.http.post(apiUrl, body).subscribe({
  //   //     next: (res: any) => {
  //   //       console.log("✅ Auto logout response:", res);
  //   //       if (res.result === 'success') {
  //   //         this.sessionSync.tabclose(user._id);
  //   //         this.sessionSync.logoutStudent(user._id);
  //   //         localStorage.clear();
  //   //         sessionStorage.clear();
  //   //         this.router.navigate(['/student-login']);
  //   //       }
  //   //     },
  //   //     error: (err) => {
  //   //       console.error("❌ Auto logout API failed:", err);
  //   //     }
  //   //   });

  //     // const user = JSON.parse(localStorage.getItem('userSDetail') || '{}');
  //   // if (!user?._id) return;

  //   const body = {
  //     student_id: user._id,
  //     type: 'student'
  //   };

  //   const apiUrl = `${environment.SERVER_URL}auth/auto-logout`;

  //   navigator.sendBeacon(apiUrl, JSON.stringify(body));

  //   // Optional clear
  //   localStorage.clear();
  //   sessionStorage.clear();
  //   console.log('🏁 Finished after window load logic');
  // }
  ngOnInit() {
    const userProfile = JSON.parse(localStorage.getItem('userSDetail') || 'null');
    if (userProfile && userProfile.role === 'student') {
      // this.idleTimeoutService.startTracking(userProfile._id);
      setTimeout(() => {
          this.idleTimeoutService.startTracking(userProfile._id);
      }, 500);

    }else{
      //  this.idleTimeoutService.stopTracking();
    }
    //  window.addEventListener('unload', this.onUnloadHandler);
     
    //  this.sessionSync.init();
    console.log('📡 Session sync initialized');

    // if(sessionStorage.getItem('rd_url') && JSON.parse(localStorage.getItem("userDetail"))){
    //   const role = JSON.parse(localStorage.getItem("userDetail"))?.role;
    //   if(!this.service.getToken() || role != "employee") {
    //     window.location.href = sessionStorage.getItem('rd_url')+'&auth=success';
    //   }
    // }
    //  window.addEventListener('beforeunload', this.unloadHandler);

     this.router.events.subscribe(event => {
      // Set navigatingWithinApp = true during route changes
      // You can adjust this logic if needed
      this.navigatingWithinApp = true;
      setTimeout(() => this.navigatingWithinApp = false, 500);
    });

   

   this.ngZone.runOutsideAngular(() => {
      // 🔹 POPSTATE -> close topmost modal
      this.popListener = () => {
        const shownModals = document.querySelectorAll('.modal.show');
        if (shownModals.length === 0) return;

        const modalToClose = shownModals[shownModals.length - 1] as HTMLElement;

        const $ = (window as any).$;
        if ($) {
          $(modalToClose).modal('hide'); // Bootstrap 4
        } else if ((window as any).bootstrap?.Modal) {
          // Bootstrap 5
          const inst = (window as any).bootstrap.Modal.getInstance(modalToClose);
          if (inst) inst.hide();
          else new (window as any).bootstrap.Modal(modalToClose).hide();
        } else {
          // Fallback manual close
          modalToClose.classList.remove('show');
          modalToClose.style.display = 'none';
          modalToClose.setAttribute('aria-hidden', 'true');
        }

        // 🔑 Ensure cleanup of backdrop & body lock
        setTimeout(() => {
          const stillOpen = document.querySelectorAll('.modal.show');
          if (stillOpen.length === 0) {
            document.body.classList.remove('modal-open');
            document.querySelectorAll('.modal-backdrop').forEach(b => b.remove());
          }
        }, 50);
      };

      window.addEventListener('popstate', this.popListener);

      // 🔹 When modal opens -> push history state
      this.shownListener = (evt: any) => {
        const el = evt.target as HTMLElement;
        if (!el) return;
        if (!el.id) el.id = 'modal-' + Date.now(); // ensure modal has an id
        history.pushState({ modalId: el.id }, '', window.location.href);
      };
      document.addEventListener('shown.bs.modal', this.shownListener);

      // 🔹 When modal closes manually -> pop history
      this.hiddenListener = (evt: any) => {
        const el = evt.target as HTMLElement;
        if (!el) return;

        if (history.state?.modalId === el.id) {
          this.manualClose = true;
          history.back();
          setTimeout(() => (this.manualClose = false), 100);
        }

        // Cleanup in case Bootstrap misses it
        setTimeout(() => {
          const stillOpen = document.querySelectorAll('.modal.show');
          if (stillOpen.length === 0) {
            document.body.classList.remove('modal-open');
            document.querySelectorAll('.modal-backdrop').forEach(b => b.remove());
          }
        }, 50);
      };
      document.addEventListener('hidden.bs.modal', this.hiddenListener);

      // 🔹 Close all modals on route navigation
      this.routerSub = this.router.events.subscribe(ev => {
        if (ev instanceof NavigationStart) {
          const shown = document.querySelectorAll('.modal.show');
          shown.forEach(m => {
            const $ = (window as any).$;
            if ($) (window as any).$(m).modal('hide');
            else if ((window as any).bootstrap?.Modal) {
              const inst = (window as any).bootstrap.Modal.getInstance(m);
              if (inst) inst.hide();
              else new (window as any).bootstrap.Modal(m).hide();
            } else {
              (m as HTMLElement).classList.remove('show');
              (m as HTMLElement).style.display = 'none';
              (m as HTMLElement).setAttribute('aria-hidden', 'true');
            }
          });

          document.body.classList.remove('modal-open');
          document.querySelectorAll('.modal-backdrop').forEach(b => b.remove());
        }
      });
    }); 
    
    const url = window.location.href;

    const hasCode = url.includes('code=');
    const hasState = url.includes('state=');
    console.log("hasCode", hasCode, "hasState", hasState, "url", url)
    if (hasCode && hasState) {
      const queryString = url.split('?')[1];
      const queryParams = new URLSearchParams(queryString);
      console.log("queryParams", queryParams, queryParams.get('code'), queryParams.get('state'))
      setTimeout(()=>{
         this.router.navigate(
        ['/login/callback'],
        { 
          queryParams: {
           code: queryParams.get('code'),
           state: queryParams.get('state')
          }
        }
      );
      }, 10)
    }
  
  // return false;
    this.router.events.subscribe((evt) => {
      if (!(evt instanceof NavigationEnd)) {
        return;
      }
      window.scrollTo(0, 0);
    });

    this.router.events.pipe(
      filter((event) => event instanceof NavigationEnd) // Filter to only NavigationEnd events
    ).subscribe(() => {
      if (environment.maintenanceMode && this.router.url !== '/maintenance') {
        this.router.navigate(['/maintenance']);
      } else {
        // console.log("this.router.url", this.router.url, this.router.url.includes('/login/callback'))
        if(this.router.url.includes('/login/callback')){
            // this.callApiOnNavigation();
        }else{
          this.callApiOnNavigation();
        }
      }
    });

  }

  getToken() {
    return localStorage.getItem("token")
  }

  callApiOnNavigation() {
    if (this.getToken()) {
      this.http.post(`${this.SERVER}auth/check_deactivated_user`, {}).subscribe(
        (response) => {
          // console.log('API call successful:', response);
          // Handle the response as needed
        },
        (error) => {
          // console.log("error", error)
          this.logout();
        }
      );
    }
  }



  private logout(): void {
    // alert("calling")
    // this.idleService.stopIdleTimer();
    localStorage.clear();
    sessionStorage.clear();
    this.router.navigate(['/student-login']);
  }

  ngOnDestroy() {
    // window.removeEventListener('unload', this.onUnloadHandler);
    // window.removeEventListener('beforeunload', this.unloadHandler);
    // this.idleTimeoutService.stopWatching();
    window.removeEventListener('popstate', this.popListener);
    document.removeEventListener('shown.bs.modal', this.shownListener);
    document.removeEventListener('hidden.bs.modal', this.hiddenListener);
    if (this.routerSub) this.routerSub.unsubscribe();
  }


}
