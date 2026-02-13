import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { TopgradserviceService } from '../../topgradservice.service';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.scss']
})
export class ChangePasswordComponent implements OnInit {
  changepwdform: FormGroup;
  current_pwd: any;
  new_pwd: any;
  confirm_pwd: any;

  currentShowPassword: boolean = false;
  confirmShowPassword: boolean = false;
  newShowPassword: boolean = false;
  confirmInput: any;
  newInput: any;
  currentInput: any;
  userDetail = null;
  panelType='employee';
  constructor(private sanitizer: DomSanitizer, private Service: TopgradserviceService, private _snackBar: MatSnackBar, private _formBuilder: FormBuilder, private router: Router) {
    this.changepwdform = this._formBuilder.group({
      'current_pwd': ['', [Validators.required]],
      'new_pwd': ['', [Validators.required, Validators.pattern(
       /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,}$/
      ),]],
      'confirm_pwd': ['', [Validators.required]]

    }, {

      validator: [this.checkNotSamePassword, this.checkSamePassword]
    }
    )
  }

  userSDetail:any;

  ngOnInit(): void {
    this.userDetail = JSON.parse(localStorage.getItem("userDetail"));
    this.userSDetail = JSON.parse(localStorage.getItem("userSDetail"));
    if(this.userDetail){
      this.panelType= this.userDetail.type;
    }
    if(this.userSDetail){
      this.panelType= this.userSDetail.type;
    }

    history.pushState(null, '', location.href);
    window.onpopstate = () => {
      history.pushState(null, '', location.href);
    };
  }

  ngOnDestroy() {
    window.onpopstate = null;
  }

  checkSamePassword(group: FormGroup) {
    let pass = group.controls.current_pwd.value;
    let new_password = group.controls.new_pwd.value;
    let flag = false
    let returnable: any = {
      pwdSame: null
    }
    if (pass == new_password) {
      returnable.pwdSame = true
      flag = true
    } return flag ? returnable : null
  }

  checkNotSamePassword(group: FormGroup) {
    let passs = group.controls.new_pwd.value;
    let confirm_password = group.controls.confirm_pwd.value;
    let flagg = false
    let returnablee: any = {
      pwdNotSame: null
    }
    if (passs != confirm_password) {
      returnablee.pwdNotSame = true
      flagg = true
    } return flagg ? returnablee : null
  }


  change() {
  if (this.changepwdform.invalid) {
    this.changepwdform.markAllAsTouched();
    this._snackBar.open('Please fill all the required fields', 'close', {
      duration: 2000
    });
  } else {
    const obj = {
      old_password: this.changepwdform.value.current_pwd,
      new_password: this.changepwdform.value.new_pwd
    };

    this.Service.changePassword(obj).subscribe(
      data => {
        console.log("data", data);

        if (data.code === 200) {  // FIXED
          this._snackBar.open("Password changed successfully", "close", { duration: 2000 });

          this.changepwdform.reset();
          localStorage.clear();

          if (this.userSDetail?.role === 'student') {
            this.router.navigate(['/student-login']);
          } else if (this.userDetail?.role === 'employee') {
            this.router.navigate(['/employer-login']);
          } else {
            this.router.navigate(['/login']);
          }

        } else {
          this._snackBar.open(data?.errors?.msg || "Something went wrong", "close", {
            duration: 2000
          });
        }
      },
      err => {
        console.log("err", err);

        // FIXED: backend returns errors.msg
        this._snackBar.open(err?.error?.errors?.msg || "Some error occurred", "close", {
          duration: 2000
        });
      }
    );
  }
}



  currentToggleShow() {
    this.currentShowPassword = !this.currentShowPassword;
  }
  newToggleShow() {
    this.newShowPassword = !this.newShowPassword;
  }
  confirmToggleShow() {
    this.confirmShowPassword = !this.confirmShowPassword;
  }

  cancel() {
    if (this.userDetail?.role === 'student') {
      this.router.navigate(['/student/dashboard']);
    } else if (this.userDetail?.role === 'employee') {
      this.router.navigate(['/employer/vacancies']);
    }else {
      this.router.navigate(['/login']);
    }
  }

}
