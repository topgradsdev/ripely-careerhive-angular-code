import { Component, OnInit, Inject } from '@angular/core';
import { TopgradserviceService } from '../../../topgradservice.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AuthService } from '@auth0/auth0-angular';
import { AsyncPipe, DOCUMENT, NgIf } from '@angular/common';
import { OKTA_AUTH, OktaAuthStateService } from '@okta/okta-angular';
import OktaAuth, { Tokens } from '@okta/okta-auth-js';
import { environment } from 'src/environments/environment';
@Component({
  selector: 'app-student-login-callback',
  templateUrl: './student-login-callback.component.html',
  styleUrls: ['./student-login-callback.component.scss']
})
export class StudentLoginCallBackComponent implements OnInit {

  private oktaAuth = new OktaAuth({
    issuer: environment.okta.issuer,
    clientId: environment.okta.clientId,
    redirectUri: environment.okta.redirectUri,
    postLogoutRedirectUri: environment.okta.postLogoutRedirectUri,
    scopes: environment.okta.scopes,
    responseType: 'code',
    pkce: true
  });

  profile:any = null;
constructor(
    private router: Router,
    public auth: AuthService,
    private Service: TopgradserviceService,
    private _snackBar: MatSnackBar,
    private oktaStateService: OktaAuthStateService
  ) {}
  user:any = null;
  async ngOnInit() {
    try {
      const params = new URLSearchParams(window.location.search);
      console.log("params", params, window.location.href)

      if (params.has('code') || params.has('state')) {
        
        // Step 1: Parse tokens from URL (?code=...&state=...)
        const { tokens }: { tokens: Tokens } = await this.oktaAuth.token.parseFromUrl();
        // const { tokens } = await this.oktaAuth.token.exchangeCodeForTokens({
        //   scopes: environment.okta.scopes,
        //   redirectUri: environment.okta.redirectUri
        // });

        console.log("tokens", tokens)

        // Step 2: Save tokens in tokenManager
        this.oktaAuth.tokenManager.setTokens(tokens);

        // Step 3: Get user info
        const userdata = await this.oktaAuth.getUser();
        console.log('User Info:', userdata);
        let userInfo  = userdata;

        userInfo['type'] = 'student';
        if(userInfo?.organizationalRelationships  == "OR0017"){
          userInfo['type'] = 'staff';
        }else if(userInfo?.organizationalRelationships  == "OR0023"){
          userInfo['type'] = 'student';
        }else if(userInfo?.organizationalRelationships  == "OR0054"){
          userInfo['type'] = 'student';
        }


        // student/staff/employee

        // Step 4: Store user info in localStorage
        // localStorage.setItem('userDetail', JSON.stringify(userInfo));


      this.Service.getOktaSSO({...userInfo}).subscribe(async(res:any) => {
        if (res?.token) {
          localStorage.setItem("userDetail", JSON.stringify(res.data));
          if (res.token) {
            localStorage.setItem("token", res.token);
            if(userInfo.type=="student"){
                if (res.data?.student_profile) {
                  this.router.navigate(['student/dashboard']);
                } else {
                  this.router.navigate(['student/onboarding']);
                }
            }else if(userInfo.type=="employee"){
                const employerProfile = await this.getEmployerProfile(res.data._id);
                if(!employerProfile?.record?.company_profile) {
                    this.router.navigate(['employer/onboarding']);
                  }else {
                    this.router.navigate(['employer/dashboard']);
                  }
            }else if(userInfo.type=="staff"){
              if(!res?.data?.is_onbording){
                this.router.navigate(['/admin-onboarding']);
              }else{
                this.router.navigate(['admin/my-task']);
              }
            }
            
            this._snackBar.open("User Logged In Successfully", "close", { duration: 2000 });
          }
        } else {
          this._snackBar.open(res?.message, "close", { duration: 2000 });
        }
        
      }, err => {

        var ErrorMsg =  err?.error?.message || err?.error?.errors?.msg || "Incorrect email or password, please try again.";
        if (err.status >= 400) {
          this._snackBar.open(ErrorMsg, "close", {
            duration: 2000
          });
        }if (err?.status === 409 && err?.error?.message === "User already exists") {
          this._snackBar.open(ErrorMsg, "close", { duration: 2000 });
        } else {
          this._snackBar.open(ErrorMsg, "close", {
            duration: 2000
          });
        }

      })

      
        return;
      }else{
        this.router.navigate(['/student-login']);
      }
     

      // Step 5: Redirect based on role
      // const role = (userInfo['role'] || 'student').toLowerCase();
      // switch (role) {
      //   case 'admin':
      //     this.router.navigate(['/admin/my-task']);
      //     break;
      //   case 'student':
      //     this.router.navigate(['/student/dashboard']);
      //     break;
      //   case 'staff':
      //     this.router.navigate(['/staff/my-task']);
      //     break;
      //   case 'employee':
      //     this.router.navigate(['/employer/vacancies']);
      //     break;
      //   default:
      //     this.router.navigate(['/student/dashboard']);
      // }

    } catch (err) {
      console.error('Error handling Okta callback:', err);
      // Redirect to login on error
      // this.router.navigate(['/login']);
    }
  }

  getEmployerProfile(employerId) {
    const payload = {
      _id: employerId
    }
    return this.Service.getEmployerProfile(payload).toPromise();
  }


}
