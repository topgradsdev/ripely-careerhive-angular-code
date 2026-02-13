import { Component, Inject, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TopgradserviceService } from '../../../topgradservice.service';
import OktaAuth from '@okta/okta-auth-js';
import { OKTA_AUTH } from '@okta/okta-angular';
import { SessionSyncService } from 'src/app/session-sync.service';

@Component({
  selector: 'app-student-header',
  templateUrl: './student-header.component.html',
  styleUrls: ['./student-header.component.scss']
})
export class StudentHeaderComponent implements OnInit {
  
  @Input() currentPage: String = "";
  isDisabledNav = false;
  studentProfile = null;
  hiddenHeader = false;
  userSDetail:any;
  constructor(private router: Router, private service: TopgradserviceService, private sessionSync: SessionSyncService, @Inject(OKTA_AUTH) private oktaAuth: OktaAuth) {
    
   }

   ngDoCheck() {
    this.userSDetail = JSON.parse(localStorage.getItem("userSDetail"));

    // console.log("window.location.hash", window.location.pathname)
    this.isDisabledNav = false;
    if (window.location.pathname.includes("onboarding")) {
      this.isDisabledNav = true;
    }
    this.hiddenHeader = false;
    if (window.location.pathname.includes("change-password")) {
      this.hiddenHeader = true;
    }
    let profile = localStorage.getItem('profileImage');
    if (profile) {
      try {
        profile = JSON.parse(profile);
        if (this.studentProfile?.image !== profile) {
          this.studentProfile.image = profile;
        }
      } catch (error) {
        // console.error("Invalid JSON in localStorage 'profileImage':", error);
      }
    } else {
      console.warn("No profile image found in localStorage.");
    }
    
   }

  ngOnInit(): void {
    this.userSDetail = JSON.parse(localStorage.getItem("userSDetail"));
    this.getStudentProfile();
  }

  getStudentProfile() {
    this.service.getStudentProfile({}).subscribe((res: any) => {
      this.studentProfile = { ...res?.record, ...res?.placement_type };
      if (this.studentProfile?.image) {
        localStorage.setItem('profileImage', JSON.stringify(this.studentProfile?.image));
      }
    });
  }

  logout() {

    let body = {
        student_id:this.userSDetail._id,
        type:'student',
      }
      this.service.autoLogout(body).subscribe((res: any) => {
      console.log("res", res)
      if (res.result === 'success') {
        // res.data['is_admin'] = true;
        
        this.sessionSync.broadcastLogout(this.userSDetail.email);
        localStorage.clear();
        sessionStorage.clear();
        this.router.navigate(['/student-login']);
        this.oktaAuth.signOut({ postLogoutRedirectUri: 'https://monash.careerhive.com.au/' });
      } else {
        console.log("res", res)
      }
    })
  }

  adminLoginBack() {
    const userDetail = JSON.parse(localStorage.getItem("userDetail") || '{}'); // parse properly
    if (!userDetail || !this.userSDetail) return;

    const body = {
      student_id: this.userSDetail._id,
      email: userDetail.email, // use parsed object
      type: 'admin',
    };

    this.service.impersonateLogin(body).subscribe((res: any) => {
      console.log("res", res);

      if (res.token) {
        // Notify all tabs/browser that student is switching back to admin
        this.sessionSync.broadcastStudentToAdmin(userDetail.email, this.userSDetail._id);

        // Update storage
        localStorage.removeItem("userSDetail");
        localStorage.setItem("token", res.token);
        localStorage.setItem('impersonate', "true");

        // Navigate to admin page
        this.router.navigate(['/admin/wil/view-student-profile'], {
          queryParams: { id: this.userSDetail._id }
        });
      } else {
        console.error("Impersonate login failed", res);
      }
    }, err => {
      console.error("Error in impersonateLogin API", err);
    });
  }

  
    // this.router.navigate(['admin/my-task']);
    
   

}
