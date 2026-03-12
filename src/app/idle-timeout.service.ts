
import { Injectable, NgZone } from '@angular/core';
import { SessionSyncService } from './session-sync.service';
import { TopgradserviceService } from './topgradservice.service';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class IdleTimeoutService {
  private timeoutInMinutes = 150; // idle time in minutes
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
