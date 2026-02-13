import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';

import { TopgradserviceService } from '../../../topgradservice.service';

@Component({
  selector: 'app-forget-password',
  templateUrl: './forget-password.component.html',
  styleUrls: ['./forget-password.component.scss']
})
export class ForgetPasswordComponent implements OnInit {
  // forgetForm: boolean;
  // forgotpwdform: FormGroup
  // email: any;
  // panelType = null;
  // constructor(private Service: TopgradserviceService, private _snackBar: MatSnackBar, private _formBuilder: FormBuilder, private router: Router,
  //   private activatedRoute: ActivatedRoute
  // ) {

  //   this.forgotpwdform = this._formBuilder.group({
  //     email: ['', [Validators.required, Validators.email]],
  //   })
  // }



  // ngOnInit(): void {
  //   this.activatedRoute.queryParams.subscribe(params => {
  //     if (params?.type) {
  //       this.panelType = params.type;
  //     }
  //   });
  // }
  // onNextBack() {
  //   this.forgetForm = !this.forgetForm
  // }

  // sendemail() {
  //   var obj = {
  //     email: this.forgotpwdform.value.email,
  //     type: this.panelType,
  //     // receiver_type :this.panelType,
  //   }
  //   this.Service.sendresetmail(obj).subscribe(res => {
  //     // localStorage.setItem("admin_details",JSON.stringify(res.obj.email))
  //     if (res.code == 200) {
  //       this.Service.showMessage({ message: "Email Sent Succsessfully" });
  //       this.forgetForm = false;
  //     } else {
  //       this.Service.showMessage({ message: res.message });
  //     }
  //   }, err => {
    
  //     this.Service.showMessage({
  //       message: err.error.errors.msg ? err.error.errors.msg : 'Something went Wrong'
  //     })

  //   }
  //   );


  // }
  forgetForm: boolean= false;
  forgotpwdform: FormGroup
  email: any;
  panelType = 'employee';
  constructor(private Service: TopgradserviceService, private _snackBar: MatSnackBar, private _formBuilder: FormBuilder, private router: Router,
    private activatedRoute: ActivatedRoute
  ) {

    this.forgotpwdform = this._formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
    })
  }



  ngOnInit(): void {
    this.activatedRoute.queryParams.subscribe(params => {
      if (params?.type) {
        this.panelType = params.type;
      }
    });
  }
  onNextBack() {
    this.forgetForm = !this.forgetForm
  }

  sendemail() {
    console.log("sdsfsfdsfdfdfds", this.forgotpwdform)
    var obj = {
      email: this.forgotpwdform.value.email,
      type: this.panelType,
      // receiver_type :this.panelType,
    }
    this.Service.sendresetmail(obj).subscribe(res => {
      console.log("fgdgfdgfdfgdfgd", res);
      // localStorage.setItem("admin_details",JSON.stringify(res.obj.email))
      if (res.code == 200) {
        this.Service.showMessage({ message: "Email Sent Succsessfully" });
        this.forgetForm = true;
      } else {
        this.Service.showMessage({ message: res.message });
      }
    }, err => {
      console.log("hjjhgjhghjgjhghjgjhghjg", err);

      this.Service.showMessage({
        message: err.error.errors.msg ? err.error.errors.msg : 'Something went Wrong'
      })

    }
    );


  }

  gotoLogin(){
      if(this.panelType=='student'){
        this.router.navigate(['student-login']);
      }else  if(this.panelType=='admin'){
        this.router.navigate(['login']);
      }else{
        this.router.navigate(['employer-login']);
      }
  }
}



