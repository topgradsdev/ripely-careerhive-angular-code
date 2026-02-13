import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TopgradserviceService } from '../../../topgradservice.service';
import { Router } from '@angular/router';
import { HttpResponseCode } from '../../../shared/enum';

@Component({
  selector: 'app-admin-onboarding',
  templateUrl: './admin-onboarding.component.html',
  styleUrls: ['./admin-onboarding.component.scss']
})
export class AdminOnboardingComponent implements OnInit {
  adminOnboarding: FormGroup;
  userDetails = null;

  constructor(private service: TopgradserviceService,
     private fb: FormBuilder, private router: Router) { }

  ngOnInit(): void {
    this.adminOnboarding = this.fb.group({
      first_name: ["", [Validators.required]],
      last_name: ["", [Validators.required]],
      image: [""],
      phone: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email, Validators.pattern('^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,8}$')]],
    });
    this.userDetails = JSON.parse(localStorage.getItem('userDetail'));
    this.adminOnboarding.patchValue({
      email: this.userDetails.email
    })
  }

  getFile(event) {
    const formData = new FormData();
    formData.append('media', event.target.files[0]);
    this.service.uploadMedia(formData).subscribe((resp: any) => {
      this.adminOnboarding.patchValue({
        image: resp.url
      });
    });
    event.target.value = "";
  }

  addSpacesInNumber() {
    this.adminOnboarding.controls.phone.patchValue(this.adminOnboarding.value.phone.replace(/[^\dA-Z]/g, '').replace(/\B(?=(\d{3})+(?!\d))/g, ' ').trim())
    const startWithZero = /^04/g;
    const num = this.adminOnboarding.value.phone.split(" ").join("");
    if (!startWithZero.test(num) && this.adminOnboarding.value.phone.length > 2) {
      this.adminOnboarding.controls.phone.setErrors({ pattern: true });
    }
    const val = this.adminOnboarding.value.phone.slice(2, 13).split(" ").join("");
    const pattern = /(\d)\1{7}/g;
    if (pattern.test(val) && val.length === 8) {
      this.adminOnboarding.controls.phone.setErrors({ pattern: true });
    }
  }

  createAccount() {
    if (this.adminOnboarding.invalid) {
      this.adminOnboarding.markAllAsTouched();
      return;
    }

    const payload = {
      ...this.adminOnboarding.value,
      is_onbording: true,
      admin_id: this.userDetails?._id
    }

    this.service.updateAdminProfile(payload).subscribe(res => {
      if (res.status == HttpResponseCode.SUCCESS) {
        this.service.showMessage({
          message: "Admin onboarding completed successfully"
        });
        // localStorage.setItem("userDetail", JSON.stringify(res.data));

        setTimeout(() => {
            let data = JSON.parse(localStorage.getItem("userDetail"));
            data.first_name =this.adminOnboarding.value.first_name; 
            data.last_name =this.adminOnboarding.value.last_name; 
            data.phone =this.adminOnboarding.value.phone; 
            console.log("data", data);
            localStorage.setItem("userDetail", JSON.stringify(data));
             this.router.navigate(['/admin/my-task']);
        }, 500);


       
      } else {
        this.service.showMessage({
          message: res.msg
        });
      }
    }, err => {
      this.service.showMessage({
        message: err.error.errors ? err.error.errors.msg : 'Something went Wrong'
      });
    })
  }
}
