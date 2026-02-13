import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, FormGroupDirective, NgForm, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { TopgradserviceService } from '../../../topgradservice.service';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.scss']
})
export class ResetPasswordComponent implements OnInit {
//   temp: String = 'zz';
//   resetpwdform: FormGroup
//   pass: String = 'password'
//   confirmPass: String = 'password';
//   userDetails = null;
//   constructor(private route: ActivatedRoute, private Service: TopgradserviceService, private _snackBar: MatSnackBar, private _formBuilder: FormBuilder, private router: Router) {
//     this.resetpwdform = this._formBuilder.group({
//       password: ['', [Validators.required, Validators.pattern(/^(?=.*?[a-z])(?=.*?[0-9]).{8,}$/)]],
//       copassword: ['', [Validators.required]]
//     }, {
//       validator: this.checkPasswords,
//     })
//   }

//   ngOnInit(): void {
//     this.userDetails = JSON.parse(localStorage.getItem('userDetail'));
//   }

//   checkPasswords(group: FormGroup) {
//     let pass = group.controls.password.value;
//     let confirmPass = group.controls.copassword.value;
//     var flag = false
//     let returnable: any = {
//       pwdNotSame: null,
//     }
//     if (pass != confirmPass) {
//       returnable.pwdNotSame = true
//       flag = true
//     }
//     return flag ? returnable : null;
//   }
//   // update(){
//   //   if(this.resetpwdform.invalid){
//   //     this.resetpwdform.markAllAsTouched();
//   //     return
//   //   } 
//   //   let token = this.route.snapshot.params["token"]
//   //   let verification = this.route.snapshot.params["verification"]
//   //   var obj = {
//   //     password: this.resetpwdform.value['copassword'],
//   //     verification: verification,
//   //     token:token
//   //   }
//   //   console.log("fsfdsfdfdfdfdfdf",obj);
//   // }

//   sendlogin() {
  
//     let token = this.route.snapshot.params["token"]
//     let verification = this.route.snapshot.params["verification"]
//     if (this.resetpwdform.invalid) {
//       this.resetpwdform.markAllAsTouched();
//       return;
//     }

//     if( this.userDetails?._id){
//      var obj = {
//         password: this.resetpwdform.value.password,
//         // verification: verification,
//         // token: token
//         admin_id: this.userDetails?._id
//       }
  
//       this.Service.resetpassword(obj).subscribe(data => {
//         this.Service.showMessage({
//           message: "Password Reset Successfully"
//         })
//         this.router.navigate(["/login"])
  
//       }, err => {
       
//         this.Service.showMessage({
//           message: err.error.errors ? err.error.errors.msg : 'Something went Wrong'
//         })
//       })
//     }else{
//       var obj2 = {
//         password: this.resetpwdform.value.password,
//         verification: verification,
//         token: token
//         // admin_id: this.userDetails?._id
//       }
  
//       this.Service.ResetchangePassword(obj2).subscribe(data => {
//         this.Service.showMessage({
//           message: "Password Reset Successfully"
//         })
//         if(data.code==200){
//           this.gotoLogin(data.type);
//         }
       
//       }, err => {
//         this.Service.showMessage({
//           message: err.error.errors ? err.error.errors.msg : 'Something went Wrong'
//         })
//       })
//     }
//   }


//   gotoLogin(type){
//     if(type=='student'){
//       this.router.navigate(['student-login']);
//     }else  if(type=='admin'){
//       this.router.navigate(['login']);
//     }else{
//       this.router.navigate(['employer-login']);
//     }
// }

//   onEyeClick(field: any, type: any) {
//     if (field == 'pass') {
//       this.pass = type
//     }

//     if (field == 'confirmPass') {
//       this.confirmPass = type
//     }
//   }
temp: String = 'zz';
forgetForm: boolean= false;
resetpwdform: FormGroup
pass: String = 'password'
confirmPass: String = 'password';
userDetails = null;
panelType='employee';
constructor(private route: ActivatedRoute, private Service: TopgradserviceService, private _snackBar: MatSnackBar, private _formBuilder: FormBuilder, private router: Router) {
  this.resetpwdform = this._formBuilder.group({
    password: ['', [Validators.required,Validators.pattern(
      /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,}$/
    ),]],
    copassword: ['', [Validators.required]]
  }, {
    validator: this.checkPasswords,
  })
}

ngOnInit(): void {
  this.userDetails = JSON.parse(localStorage.getItem('userDetail'));
  if(this.route.snapshot.params["type"]){
    this.panelType = this.route.snapshot.params["type"]
  }
}

checkPasswords(group: FormGroup) {
  let pass = group.controls.password.value;
  let confirmPass = group.controls.copassword.value;
  var flag = false
  let returnable: any = {
    pwdNotSame: null,
  }
  if (pass != confirmPass) {
    returnable.pwdNotSame = true
    flag = true
  }
  return flag ? returnable : null;
}
// update(){
//   if(this.resetpwdform.invalid){
//     this.resetpwdform.markAllAsTouched();
//     return
//   } 
//   let token = this.route.snapshot.params["token"]
//   let verification = this.route.snapshot.params["verification"]
//   var obj = {
//     password: this.resetpwdform.value['copassword'],
//     verification: verification,
//     token:token
//   }
//   console.log("fsfdsfdfdfdfdfdf",obj);
// }
sendlogin() {
  console.log("gfgfgfgfgfgfgfgfgf", this.resetpwdform);

  let token = this.route.snapshot.params["token"]
  let verification = this.route.snapshot.params["verification"]
  this.panelType = this.route.snapshot.params["type"]
  if (this.resetpwdform.invalid) {
    this.resetpwdform.markAllAsTouched();
    return;
  }

  // if( this.userDetails?._id){
  //   console.log("sdsfsfdsfdfdfds", this.resetpwdform)
  //   var obj = {
  //     password: this.resetpwdform.value.password,
  //     // verification: verification,
  //     // token: token
  //     admin_id: this.userDetails?._id
  //   }

  //   this.Service.resetpassword(obj).subscribe(data => {
  //     console.log("fdfdfdfdsfdsfdsfdsfdsfdsf", data);
  //     this.Service.showMessage({
  //       message: "Password Reset Successfully"
  //     })
  //     this.router.navigate(["/login"])

  //   }, err => {
  //     console.log(err);

  //     this.Service.showMessage({
  //       message: err.error.errors ? err.error.errors.msg : 'Something went Wrong'
  //     })
  //   })
  // }else{
    console.log("sdsfsfdsfdfdfds", this.resetpwdform)
    var obj2 = {
      password: this.resetpwdform.value.password,
      verification: verification,
      token: token
      // admin_id: this.userDetails?._id
    }

    this.Service.ResetchangePassword(obj2).subscribe(data => {
      console.log("fdfdfdfdsfdsfdsfdsfdsfdsf", data);
      this.Service.showMessage({
        message: "Password Reset Successfully"
      })
      if(data.code==200){
        this.gotoLogin(data.type);
      }
     
    }, err => {
      console.log(err);
      this.Service.showMessage({
        message: err.error.errors ? err.error.errors.msg : 'Something went Wrong'
      })
    })
  // }
}


gotoLogin(type){
  if(type=='student'){
    this.router.navigate(['student-login']);
  }else  if(type=='admin'){
    this.router.navigate(['login']);
  }else{
    this.router.navigate(['employer-login']);
  }
}


onEyeClick(field: any, type: any) {
  if (field == 'pass') {
    this.pass = type
  }

  if (field == 'confirmPass') {
    this.confirmPass = type
  }
}

}
