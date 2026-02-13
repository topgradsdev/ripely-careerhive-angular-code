import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TopgradserviceService } from '../../../topgradservice.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { environment } from '../../../../environments/environment';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-employer-login',
  templateUrl: './employer-login.component.html',
  styleUrls: ['./employer-login.component.scss']
})
export class EmployerLoginComponent implements OnInit {
  // loginform: FormGroup;
  // pass: String = 'password';
  // SERVER = environment.SERVER;
  // constructor(private Service: TopgradserviceService,
  //    private _snackBar: MatSnackBar,
  //    private _formBuilder: FormBuilder,
  //    private router: Router, private httpClient: HttpClient) {

  // }

  // ngOnInit(): void {
  //   this.loginform = this._formBuilder.group({
  //     uname: ['', [Validators.required, Validators.email]],
  //     pwd: ['', [Validators.required]]
  //   });
  // }

  // getEmployerProfile(employerId) {
  //   const payload = {
  //     _id: employerId
  //   }
  //   return this.Service.getEmployerProfile(payload).toPromise();
  // }

  // logincredentials() {
  //   const obj = {
  //     email: this.loginform.value.uname,
  //     password: this.loginform.value.pwd,
  //     type: 'employee'
  //   };
  
  //   this.Service.login(obj).subscribe(
  //     async (res) => {
  //       if (res?.token) {
  //         // Successful login logic
  //         localStorage.setItem("token", res.token);
  //         localStorage.setItem("userDetail", JSON.stringify(res.data));
  //         const employerProfile = await this.getEmployerProfile(res.data._id);
  //         res.data.placement_id = employerProfile?.record?.placement_id;
  
  //         // Route based on the response
  //         if (res?.data?.change_password) {
  //           this.router.navigate(['employer/change-password']);
  //         } else if (!employerProfile?.record?.company_profile) {
  //           this.router.navigate(['employer/onboarding']);
  //         } else {
  //           this.router.navigate(['employer/vacancies']);
  //         }
  
  //         // Notify user of success
  //         this._snackBar.open("User Logged In Successfully", "close", { duration: 2000 });
  //       } else {
  //         this._snackBar.open(res?.message || "Invalid login credentials", "close", { duration: 2000 });
  //       }
  //     },
  //     (err) => {
  //       // console.error("Login error:", err);

  //       // // Default error message
  //       // let errorMsg = "Some error occurred";
  
  //       // // Check for a valid error structure
  //       // if (err?.error) {
  //       //   if (err.error?.errors?.msg) {
  //       //     errorMsg = err.error.errors.msg;
  //       //   } else if (err.error?.message) {
  //       //     errorMsg = err.error.message;
  //       //   }
  //       // }
  
  //       // // Handle specific HTTP error status codes
  //       // else if (err.status === 409) {
  //       //   // Conflict error (duplicate entries, etc.)
  //       //   errorMsg = "Conflict: This account already exists.";
  //       // } else if (err.status === 401) {
  //       //   // Unauthorized error (invalid credentials)
  //       //   errorMsg = "Unauthorized: Invalid email or password.";
  //       // } else if (err.status === 422) {
  //       //   // Handle 422 Unprocessable Entity error (invalid input data)
  //       //   errorMsg = "Invalid input data. Please check your credentials.";
  //       // } else if (err.status) {
  //       //   // For any other HTTP status codes
  //       //   errorMsg = `Error: ${err.statusText || err.status}`;
  //       // } else if (err instanceof ErrorEvent) {
  //       //   // Handle client-side or network errors
  //       //   errorMsg = `Network error: ${err.message}`;
  //       // }
  
  //       // // Show the appropriate error message
  //       // this._snackBar.open(errorMsg, "close", { duration: 2000 });

  //         // if (err.error.errors.msg) {
  //           var ErrorMsg =  err?.error?.message || err?.error?.errors?.msg || "Incorrect email or password, please try again.";
  //           // }
  //           // console.log("login error message==============>>", err.error.errors.msg)
  //           if (err.status >= 400) {
  //             this._snackBar.open(ErrorMsg, "close", {
  //               duration: 2000
  //             });
  //           }if (err?.status === 409 && err?.error?.message === "User already exists") {
  //             this._snackBar.open(ErrorMsg, "close", { duration: 2000 });
  //           } else {
  //             this._snackBar.open(ErrorMsg, "close", {
  //               duration: 2000
  //             });
  //           }
      
  //     }
  //   );
  // }

  // // logincredentials() {
  // //   const obj = {
  // //     email: this.loginform.value.uname,
  // //     password: this.loginform.value.pwd,
  // //     type: 'employee'
  // //   };
  
  // //   // Direct API call inside the component
  // //   this.httpClient.post(`${this.SERVER}auth/login`, obj).subscribe(
  // //     async (res: any) => {
  // //       if (res?.token) {
  // //         // Successful login logic
  // //         localStorage.setItem("token", res.token);
  // //         localStorage.setItem("userDetail", JSON.stringify(res.data));
  // //         const employerProfile = await this.getEmployerProfile(res.data._id);
  // //         res.data.placement_id = employerProfile?.record?.placement_id;
  
  // //         // Route based on the response
  // //         if (res?.data?.change_password) {
  // //           this.router.navigate(['employer/change-password']);
  // //         } else if (!employerProfile?.record?.company_profile) {
  // //           this.router.navigate(['employer/onboarding']);
  // //         } else {
  // //           this.router.navigate(['employer/vacancies']);
  // //         }
  
  // //         // Notify user of success
  // //         this._snackBar.open("User Logged In Successfully", "close", { duration: 2000 });
  // //       } else {
  // //         this._snackBar.open(res?.message || "Invalid login credentials", "close", { duration: 2000 });
  // //       }
  // //     },
  // //     (err) => {
  // //       // Log the full error object for better debugging
  // //       // console.error("Login error:", err);
  
  // //       // console.error("Full error details:", JSON.stringify(err, null, 2));

  // //       // Default error message
  // //       let errorMsg = "Some error occurred";
  
  // //       // Check for a valid error structure
  // //       if (err?.error) {
  // //         if (err.error?.errors?.msg) {
  // //           errorMsg = err.error.errors.msg;
  // //         } else if (err.error?.message) {
  // //           errorMsg = err.error.message;
  // //         }
  // //       }
  
  // //       // Handle specific HTTP error status codes
  // //       else if (err.status === 409) {
  // //         // Conflict error (duplicate entries, etc.)
  // //         errorMsg = "Conflict: This account already exists.";
  // //       } else if (err.status === 401) {
  // //         // Unauthorized error (invalid credentials)
  // //         errorMsg = "Unauthorized: Invalid email or password.";
  // //       } else if (err.status === 422) {
  // //         // Handle 422 Unprocessable Entity error (invalid input data)
  // //         errorMsg = "Invalid input data. Please check your credentials.";
  // //       } else if (err.status) {
  // //         // For any other HTTP status codes
  // //         errorMsg = `Error: ${err.statusText || err.status}`;
  // //       } else if (err instanceof ErrorEvent) {
  // //         // Handle client-side or network errors
  // //         errorMsg = `Network error: ${err.message}`;
  // //       }
  
  // //       // Show the appropriate error message
  // //       this._snackBar.open(errorMsg, "close", { duration: 2000 });
  // //     }
  // //   );
  // // }
  

  
  // onEyeClick(field: any, type: any) {
  //   // console.log(field)
  //   if (field == 'pass') {
  //     this.pass = type
  //   }
  // }

  // forgotPassword() {
  //   this.router.navigate(['/forgetPassword'], {queryParams: {type: 'employee'}});
  // }

  loginform: FormGroup;
  pass: String = 'password';
  constructor(private Service: TopgradserviceService,
     private _snackBar: MatSnackBar,
     private _formBuilder: FormBuilder,
     private router: Router) {

  }

  ngOnInit(): void {
    this.loginform = this._formBuilder.group({
      uname: ['', [Validators.required, Validators.email]],
      pwd: ['', [Validators.required]]
    });
  }

  getEmployerProfile(employerId) {
    const payload = {
      _id: employerId
    }
    return this.Service.getEmployerProfile(payload).toPromise();
  }

  logincredentials() {
    var obj = {
      email: this.loginform.value.uname,
      password: this.loginform.value.pwd,
      type: 'employee'
    }
    this.Service.login(obj).subscribe(async res => {
      if (res?.token) {
        localStorage.setItem("token", res.token);
        if (res.token) {
          const employerProfile = await this.getEmployerProfile(res.data._id);
          res.data.placement_id = employerProfile?.record?.placement_id;
          if (res?.data?.change_password) {
            this.router.navigate(['employer/change-password']);
          } else {
            if(res?.data?.company_type=="self_source"){
              if(res?.data?.self_source_step === "onbording") {
                this.router.navigate(['employer/onboarding-self']);
              } else if(res?.data?.self_source_step === "create_vacancy") {
                this.router.navigate(['employer/vacancies/create-vacancies-self']);
              } else{
                 this.router.navigate(['employer/dashboard']);
              }
            }else{
               if(!employerProfile?.record?.company_profile) {
                  this.router.navigate(['employer/onboarding']);
                }else {
                  this.router.navigate(['employer/dashboard']);
                }
            }
          }
          
          
          this._snackBar.open("User Logged In Successfully", "close", { duration: 2000 });
        }
        localStorage.setItem("userDetail", JSON.stringify(res.data));
      } else {
        this._snackBar.open(res?.message, "close", { duration: 2000 });
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

  forgotPassword() {
    this.router.navigate(['/forgetPassword'], {queryParams: {type: 'employee'}});
  }
}
