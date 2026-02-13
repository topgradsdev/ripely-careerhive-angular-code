import { HttpClient } from '@angular/common/http';
import { Component, HostListener, NgZone, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SessionSyncService } from 'src/app/session-sync.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-student-default-layout',
  templateUrl: './student-default-layout.component.html',
  styleUrls: ['./student-default-layout.component.scss']
})
export class StudentDefaultLayoutComponent implements OnInit {
  currentPage :any= "";
  constructor(private ngZone:NgZone, private http:HttpClient, private sessionSync:SessionSyncService, private router:Router) { }


  
  @HostListener('window:load', ['$event'])
    onWindowLoad(event: Event) {
      console.log('✅ Window fully loaded:', event);
      
      // Run inside Angular zone for stability
      this.ngZone.runOutsideAngular(() => {
        setTimeout(() => {
          this.ngZone.run(() => {
            this.afterWindowLoaded();
          });
        }, 500); // slight delay ensures DOM + Angular init complete
      });
    }


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

      private afterWindowLoaded() {
        if (this.isPageRefresh()) {
          console.log('🔁 Page refresh detected — skipping logout');
          return;
        }
    
        const user = JSON.parse(localStorage.getItem('userSDetail') || '{}');
        if (!user?._id) {
          console.log('⚠️ No valid user found in localStorage.');
          return;
        }
    
        console.log("👤 User detected:", user);
    
      
          const body = {
          student_id: user._id,
          type: 'student'
        };
          const apiUrl = `${environment.SERVER_URL}auth/auto-logout`; // adjust the endpoint path
          this.http.post(apiUrl, body).subscribe({
            next: (res: any) => {
              console.log("✅ Auto logout response:", res);
              if (res.result === 'success') {
                // this.sessionSync.tabclose(user._id);
                // sessionStorage.setItem('isRefresh', 'true'); 
                // this.sessionSync.logoutStudent(user._id);
                let value = user?.is_admin?user?.is_admin:false;
                localStorage.clear();
                sessionStorage.clear();
                if(value){
                  localStorage.setItem('student-l', "true");
                }
                this.router.navigate(['/student-login']);
              }
            },
            error: (err) => {
              console.error("❌ Auto logout API failed:", err);
            }
          });
    
    
        console.log('🏁 Finished after window load logic');
      }

userProfile:any;
  ngOnInit(): void {
    // alert('calling')
      this.userProfile = JSON.parse(localStorage.getItem('userSDetail'));
      if(this.userProfile?.change_password){
        this.router.navigate(['student/change-password']);
      }
  }

}
