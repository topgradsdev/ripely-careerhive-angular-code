import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TopgradserviceService } from '../../../topgradservice.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';

@Component({
  selector: 'app-staff-login',
  templateUrl: './staff-login.component.html',
  styleUrls: ['./staff-login.component.scss']
})
export class StaffLoginComponent implements OnInit {
  loginform: FormGroup;
  pass: String = 'password'
  checked:boolean = false;
  constructor(private Service: TopgradserviceService,
     private _snackBar: MatSnackBar,
     private _formBuilder: FormBuilder,
     private router: Router) {

  }

  onNextBack(){
    
  }
  ngOnInit(): void {
    this.loginform = this._formBuilder.group({
      uname: ['', [Validators.required, Validators.email]],
      pwd: ['', [Validators.required]],
      campus: ['', [Validators.required]]
    });
  }

  logincredentials() {
    var obj = {
      email: this.loginform.value.uname,
      password: this.loginform.value.pwd,
      type: 'employee'
    }
    this.Service.login(obj).subscribe(res => {
      localStorage.setItem("userDetail", JSON.stringify(res.data));
      if (res.token) {
        localStorage.setItem("token", res.token);
        this.router.navigate(['student/dashboard']);
        this._snackBar.open("User Logged In Successfully", "close", { duration: 2000 });
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
    if (field == 'pass') {
      this.pass = type
    }
  }
}
