import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { TopgradserviceService } from 'src/app/topgradservice.service';

@Component({
  selector: 'app-employer-header',
  templateUrl: './employer-header.component.html',
  styleUrls: ['./employer-header.component.scss']
})
export class EmployerHeaderComponent implements OnInit {
  @Input() currentPage: String = "";
  userDetail = null;
  isDisabledNav = false;
  hiddenHeader = false;
  hiddenProfile = false;

  constructor(private router: Router, private fb: FormBuilder, private service: TopgradserviceService) { }

  ngOnInit(): void {
    this.userDetail = JSON.parse(localStorage.getItem('userDetail'));
    this.getEmployerProfile();
  }
  employerProfile:any = null;
  getEmployerProfile() {
       const payload = {
      _id: this.userDetail?._id
    }
    this.service.getEmployerProfile(payload).subscribe(response => {
      this.employerProfile = response.record;
     if(this.employerProfile?.self_source_status=='pending' || this.employerProfile?.self_source_status=='rejected'){
        this.isDisabledNav = true;
      }
      if( this.employerProfile?.site_status === 'Blacklisted' || this.employerProfile?.site_status === 'Inactive'){
        this.isDisabledNav = true;
      }
    });
  }

  ngDoCheck() {
    this.isDisabledNav = false;
    // window.location.hash
    if (window.location.pathname.includes("onboarding")) {
      this.isDisabledNav = true;
    }
    if (window.location.pathname.includes("create-vacancies-self")) {
      this.isDisabledNav = true;
    }
    this.hiddenHeader = false;
    if (window.location.pathname.includes("change-password")) {
      this.hiddenHeader = true;
    }
    if(this.employerProfile?.self_source_status=='pending'){
      this.isDisabledNav = true;
    }
     if(this.employerProfile?.self_source_status=='rejected'){
      this.isDisabledNav = true;
    }
    if( this.employerProfile?.site_status === 'Blacklisted' || this.employerProfile?.site_status === 'Inactive'){
        this.isDisabledNav = true;
        this.hiddenProfile = true;
      }
   }

  callLogoutApi() {
    this.service.logoutCompany({email:this.userDetail.email}).subscribe((res: any) => {
      console.log("success logout");
    }, (err)=>{
      console.log("error logout");
    });
  }

  logout() {
    this.callLogoutApi();
    localStorage.clear();
    this.router.navigate(['/employer-login']);
  }
}
