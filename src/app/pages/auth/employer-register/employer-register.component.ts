import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TopgradserviceService } from '../../../topgradservice.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-employer-register',
  templateUrl: './employer-register.component.html',
  styleUrls: ['./employer-register.component.scss']
})
export class EmployerRegisterComponent implements OnInit {
  registerEmpForm: FormGroup;
  pass: String = 'password';
  emailExists: boolean = false;

  constructor(private fb: FormBuilder,
    private service: TopgradserviceService,
    private router: Router) {
    this.registerEmpForm = this.fb.group({
      email: ['', [Validators.required, Validators.email, Validators.pattern('^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,8}$')]],
      password: ['', [Validators.required, Validators.pattern(/^(?=.*?[a-z])(?=.*?[A-Z])(?=.*?[0-9]).{8,}$/)]],
      terms: ['', Validators.requiredTrue]
    })
  }

  ngOnInit(): void {
  }
  
  onEyeClick(field: any, type: any) {
    // console.log(field)
    if (field == 'pass') {
      this.pass = type
    }
  }

  createAccount() {
    if (this.registerEmpForm.invalid || this.emailExists) {
      this.registerEmpForm.markAllAsTouched();
      return;
    }

    let obj = {
      email: this.registerEmpForm.controls.email.value,
      password: this.registerEmpForm.controls.password.value,
    }

    this.service.employerRegistration(obj).subscribe(res => {
      this.service.showMessage({
        message: "Employer registration successfully"
      })
    }, err => {
        // console.log(err);
        this.service.showMessage({
          message: err.error.errors ? err.error.errors.msg : 'Something went Wrong'
        })
    })
  }

  checkEmailExists(e: any) {
    this.service.checkEmailExists(e.target.value).subscribe((res: any) => {
      this.emailExists = res
    })
  }
}
