import { Component, OnInit, Inject, ViewChild } from '@angular/core';
import { TopgradserviceService } from '../../../topgradservice.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AuthService } from '@auth0/auth0-angular';
import { AsyncPipe, DOCUMENT, NgIf } from '@angular/common';
import { OKTA_AUTH } from '@okta/okta-angular';
import OktaAuth from '@okta/okta-auth-js';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { IdleTimeoutService } from 'src/app/idle-timeout.service';
@Component({
  selector: 'app-student-login',
  templateUrl: './student-login.component.html',
  styleUrls: ['./student-login.component.scss']
})
export class StudentLoginComponent implements OnInit {
  @ViewChild('alertLogin') alertLogin: ModalDirective;
  // loginform: FormGroup;
  // pass: String = 'password'
  // constructor(private Service: TopgradserviceService,
  //    private _snackBar: MatSnackBar,
  //    private _formBuilder: FormBuilder,
  //    private router: Router) {

  // }

  // ngOnInit(): void {
  //   this.loginform = this._formBuilder.group({
  //     uname: ['', [Validators.required, Validators.email]],
  //     pwd: ['', [Validators.required]]
  //   });
  // }

  // logincredentials() {
  //   var obj = {
  //     email: this.loginform.value.uname,
  //     password: this.loginform.value.pwd,
  //     type: 'student'
  //   }
  //   this.Service.login(obj).subscribe(res => {
  //     if (res?.token) {
  //       localStorage.setItem("userDetail", JSON.stringify(res.data));
  //       if (res.token) {
  //         localStorage.setItem("token", res.token);
  //         if (res?.data?.change_password) {
  //           this.router.navigate(['student/change-password']);
  //         } else {
  //           if (res.data?.student_profile) {
  //             this.router.navigate(['student-portal/dashboard']);
  //           } else {
  //             this.router.navigate(['student/onboarding']);
  //           }
  //         }
  //         this._snackBar.open("User Logged In Successfully", "close", { duration: 2000 });
  //       }
  //     } else {
  //       this._snackBar.open(res?.message, "close", { duration: 2000 });
  //     }
      
  //   }, err => {
  //     // if (err.error.errors.msg) {
  //     //   var ErrorMsg = err.error.errors.msg
  //     // }
  //     // if (err.status >= 400) {
  //     //   this._snackBar.open(ErrorMsg, "close", {
  //     //     duration: 2000
  //     //   });
  //     // } else {
  //     //   this._snackBar.open("Some Error Occued", "close", {
  //     //     duration: 2000
  //     //   });
  //     // }

  //        // if (err.error.errors.msg) {
  //         var ErrorMsg =  err?.error?.message || err?.error?.errors?.msg || "Incorrect email or password, please try again.";
  //         // }
  //         // console.log("login error message==============>>", err.error.errors.msg)
  //         if (err.status >= 400) {
  //           this._snackBar.open(ErrorMsg, "close", {
  //             duration: 2000
  //           });
  //         }if (err?.status === 409 && err?.error?.message === "User already exists") {
  //           this._snackBar.open(ErrorMsg, "close", { duration: 2000 });
  //         } else {
  //           this._snackBar.open(ErrorMsg, "close", {
  //             duration: 2000
  //           });
  //         }
  //   })
  // }


  // onEyeClick(field: any, type: any) {
  //   if (field == 'pass') {
  //     this.pass = type
  //   }
  // }

  // forgotPassword() {
  //   this.router.navigate(['/forgetPassword'], {queryParams: {type: 'student'}});
  // }

  loginform: FormGroup;
  isEmail:boolean = false;
  pass: String = 'password'
  constructor(private Service: TopgradserviceService,
     private _snackBar: MatSnackBar,
     private _formBuilder: FormBuilder,
     public auth: AuthService,
     @Inject(DOCUMENT) private doc: Document,
     private router: Router, @Inject(OKTA_AUTH) private oktaAuth: OktaAuth, private idleService: IdleTimeoutService) {

  }

  ngOnInit(): void {

    

    if(localStorage.getItem('student-l')){
      localStorage.removeItem('student-l');
    }
    this.loginform = this._formBuilder.group({
      uname: ['', [Validators.required, Validators.email]],
      pwd: ['', [Validators.required]]
    });
  //    this.auth.isAuthenticated$.subscribe((isAuthenticated) => {
  //     console.log("isAuthenticated", isAuthenticated)
  //     if (isAuthenticated) {
  //       // ✅ Get user profile (from Auth0)
  //       this.auth.user$.subscribe(user => {
  //         console.log('Auth0 user profile:', user);
  //       });

  //       // ✅ OR fetch custom user data from your API
  //       // this.http.get('https://your-api.com/user-record').subscribe(data => {
  //       //   console.log('Fetched user data:', data);
  //       // });
  //     }
  //   });

  //   this.auth.idTokenClaims$.subscribe(claims => {
  //   const token = claims?.__raw;
  //   console.log('Auth0 user token:', token);
  //   // this.http.get('https://your-api.com/user-record', {
  //   //   headers: { Authorization: `Bearer ${token}` }
  //   // }).subscribe(data => {
  //   //   console.log('Protected data:', data);
  //   // });
  // });
    // this.auth.handleRedirectCallback().subscribe({
    //   next: (result) => {
    //     console.log('Handled redirect callback', result);
    //     this.router.navigate(['/']); // redirect to home or dashboard
    //   },
    //   error: (err) => console.error('Error during redirect callback', err),
    // });

    // // Check if authenticated and get user
    // this.auth.isAuthenticated$.subscribe((isAuthenticated) => {
    //   console.log('isAuthenticated', isAuthenticated);
    //   if (isAuthenticated) {
    //     this.auth.user$.subscribe((user) => {
    //       console.log('User:', user);
    //     });
    //   }
    // });
    //  this.auth.user$.subscribe((user) => {
    //       console.log('User:', user);
    //     });
  }

  logincredentials() {
    var obj = {
      email: this.loginform.value.uname,
      password: this.loginform.value.pwd,
      type: 'student'
    }
    this.Service.login(obj).subscribe(res => {
      console.log("res", res)
      if (res?.token) {
        localStorage.setItem("userSDetail", JSON.stringify(res.data));
        if (res.token) {
          localStorage.setItem("token", res.token);
          // this.idleService.startTracking(res?.data?._id);

           setTimeout(() => {
              this.idleService.startTracking(res?.data?._id);
          }, 500);
          

          if (res?.data?.change_password) {
            this.router.navigate(['student/change-password']);
          } else {
            if (res.data?.student_profile) {
              this.router.navigate(['student-portal/dashboard']);
            } else {
              this.router.navigate(['student/onboarding']);
            }
          }
          
          this._snackBar.open("User Logged In Successfully", "close", { duration: 5000 });
        }
      } else {
        this._snackBar.open(res?.message, "close", { duration: 5000 });
      }
      
    }, err => {
      console.log("login error==============>>", err)
      // if (err.error.errors.msg) {
      //   var ErrorMsg = err.error.errors.msg
      // }
      // console.log("login error message==============>>", err.error.errors.msg)
      // if (err.status >= 400) {
      //   this._snackBar.open(ErrorMsg, "close", {
      //     duration: 2000
      //   });
      // } else {
      //   this._snackBar.open("Some Error Occued", "close", {
      //     duration: 2000
      //   });
      // }
      var ErrorMsg =  err?.error?.message || err?.error?.errors?.msg || "Incorrect email or password, please try again.";
      if (err.status >= 400) {
        this._snackBar.open(ErrorMsg, "close", {
          duration: 5000
        });
      }if (err?.status === 409 && err?.error?.message === "User already exists") {
        this._snackBar.open(ErrorMsg, "close", { duration: 5000 });
      }else if (err?.status === 420) {
        this.alertLogin.show()
      // }else if (err?.status === 422) {
      //   this.alertLogin.show()
      } else {
        this._snackBar.open(ErrorMsg, "close", {
          duration: 5000
        });
      }

    })
  }


  userDetails:any = {};

  getEmailDetail(){
    // this.isEmail = true;
    var obj = {
      email: this.loginform.value.uname,
      type: 'student'  //admin,student,employee
    }
    this.Service.getUserByEmail(obj).subscribe(res => {
      if(res.code == 200){
        this.userDetails = res.data;
        this.isEmail = true;
      }else{
        this._snackBar.open(res.message, "close", { duration: 2000 });
      }
    }, err => {
      if (err.error.errors.msg) {
        var ErrorMsg = err.error.errors.msg
      }
      if (err.status >= 400) {
        this._snackBar.open(ErrorMsg, "close", {
          duration: 2000
        });
      } else {
        this._snackBar.open("Some Error Occued", "close", {
          duration: 2000
        });
      }

    })
  }

  onEyeClick(field: any, type: any) {
    console.log(field)
    if (field == 'pass') {
      this.pass = type
    }
  }

  forgotPassword() {
    this.router.navigate(['/forgetPassword'], {queryParams: {type: 'student'}});
  }

  loginWithRedirect() {
    this.auth.loginWithRedirect();
  }

//  logout(): void {
//   // this.auth.logout({ returnTo: this.doc.location.origin });
//    this.auth.logout({ logoutParams: { returnTo: this.doc.location.origin } });
// }

  logout() {
      this.oktaAuth.signOut({ postLogoutRedirectUri: 'https://monash.careerhive.com.au/' });
    }

  loginSSo() {
    this.oktaAuth.signOut({ postLogoutRedirectUri: 'https://monash.careerhive.com.au/' });
    this.oktaAuth.signInWithRedirect();
  }


}
