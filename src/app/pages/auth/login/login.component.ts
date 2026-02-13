import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';

import { TopgradserviceService } from '../../../topgradservice.service';


@Component({
  selector: 'app-dashboard',
  templateUrl: 'login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  // admin_form: boolean;
  // loginform: FormGroup;
  // pass: String = 'password'
  // constructor(private Service: TopgradserviceService, private _snackBar: MatSnackBar, private _formBuilder: FormBuilder, private router: Router,
  //   private route: ActivatedRoute,) {

  //   this.loginform = this._formBuilder.group({
  //     uname: ['', [Validators.required, Validators.email]],
  //     pwd: ['', [Validators.required]],
  //     campus: ['Parramatta Campus', [Validators.required]]
  //   })
  // }

  // logincredentials() {
  //   var obj = {
  //     email: this.loginform.value.uname,
  //     password: this.loginform.value.pwd,
  //     type: 'admin',
  //     campus: this.loginform.value.campus
  //   }
  //   this.Service.login(obj).subscribe(res => {
  //     if (res?.token) {
  //       localStorage.setItem("userDetail", JSON.stringify(res.data));
  //       if (res.token) {
  //         localStorage.setItem("token", res.token);
  //         if (res?.data?.is_onbording) {
  //           this.router.navigate(['admin/my-task']);
  //         } else if (!res?.data?.is_password_set) {
  //           this.router.navigate(['/reset-password']);
  //         } else {
  //           this.router.navigate(['/admin-onboarding']);
  //         }
  //         this._snackBar.open("User Logged In Successfully", "close", { duration: 2000 });
  //       }
  //     } else {
  //       this._snackBar.open(res?.message, "close", { duration: 2000 });
  //     }
  //   }, err => {
  //     // if (err.error.errors.msg) {
  //       var ErrorMsg =  err?.error?.message || err?.error?.errors?.msg || "Incorrect email or password, please try again.";
  //     // }
  //     // console.log("login error message==============>>", err.error.errors.msg)
  //     if (err.status >= 400) {
  //       this._snackBar.open(ErrorMsg, "close", {
  //         duration: 2000
  //       });
  //     }if (err?.status === 409 && err?.error?.message === "User already exists") {
  //       this._snackBar.open(ErrorMsg, "close", { duration: 2000 });
  //     } else {
  //       this._snackBar.open(ErrorMsg, "close", {
  //         duration: 2000
  //       });
  //     }

  //   })
  // }


  // onEyeClick(field: any, type: any) {
  //   if (field == 'pass') {
  //     this.pass = type
  //   }
  // }

  // onNextBack(){
  //   this.admin_form = !this.admin_form
  // }

  // forgotPassword() {
  //   this.router.navigate(['/forgetPassword'], {queryParams: {type: 'admin'}});
  // }

  admin_form: boolean;
  isEmail:boolean = false;
  loginform: FormGroup;
  pass: String = 'password'
  constructor(private Service: TopgradserviceService, private _snackBar: MatSnackBar, private _formBuilder: FormBuilder, private router: Router,
    private route: ActivatedRoute,) {

    this.loginform = this._formBuilder.group({
      uname: ['', [Validators.required, Validators.email]],
      pwd: ['', [Validators.required]],
      campus: ['Parramatta Campus', [Validators.required]]
    })
  }
  campusOptions: any = [
  { id: 'Parramatta Campus', name: 'Parramatta Campus' }
];

  logincredentials() {
    var obj = {
      email: this.loginform.value.uname,
      password: this.loginform.value.pwd,
      type: 'admin',
      campus: this.loginform.value.campus
    }
    this.Service.login(obj).subscribe(res => {
      if (res?.token) {
        localStorage.setItem("userDetail", JSON.stringify(res.data));
        if (res.token) {
          localStorage.setItem("token", res.token);
          // if (res?.data?.is_onbording) {
          //   this.router.navigate(['admin/my-task']);
          // } else if (!res?.data?.is_password_set) {
          //   this.router.navigate(['/change-password']);
          // } else {
          //   this.router.navigate(['/admin-onboarding']);
          // }
          if (!res?.data?.is_password_set) {
            this.router.navigate(['/change-password']);
          } else {
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
      console.log("login error==============>>", err)

      console.log("Login error: ", err); // Debugging log
      // const errorMsg = this.handleError(err); 

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
  }


  onEyeClick(field: any, type: any) {
    console.log(field)
    if (field == 'pass') {
      this.pass = type
    }
  }

  onNextBack(){
    this.admin_form = !this.admin_form
  }

  forgotPassword() {
    this.router.navigate(['/forgetPassword'], {queryParams: {type: 'admin'}});
  }

  userDetails:any = {};

  getEmailDetail(){
    var obj = {
      email: this.loginform.value.uname,
      type: 'admin'  //admin,student,employee
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

}
