import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';

import { TopgradserviceService } from '../../topgradservice.service';
@Component({
  selector: 'app-view-profile',
  templateUrl: './view-profile.component.html',
  styleUrls: ['./view-profile.component.scss']
})
export class ViewProfileComponent implements OnInit {
  @ViewChild('headerForNg') header:ElementRef;
  profileform: FormGroup
  first_name: any;
  last_name: any;
  email: any;
  image: any;
  selectedfile: File;
  imageSrc: any;

  constructor(private Service: TopgradserviceService, private _snackBar: MatSnackBar, private _formBuilder: FormBuilder, private router: Router) {
    this.profileform = this._formBuilder.group({
      first_name: ['', [Validators.required, Validators.pattern('^[a-zA-Z \-\']+')]],
      last_name: ['', [Validators.required, Validators.pattern('^[a-zA-Z \-\']+')]],
      email: ['', [Validators.required, Validators.email, Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$')]],
      'image': [''],
      county: ['']
    })
    console.log(this.profileform);
  }

  ngOnInit(): void {
    this.admindetails();
    this.first_name = localStorage.getItem('first_name');
    console.log("gyuyutyty", this.first_name);

  }


  // jobTitles:any = [];

  // jobTitleList() {
  //   let param = { search: '' };
  //   this.service.getJobTitle(param).subscribe(res => {
  //     res.data.sort((a: any, b: any) => a.name.localeCompare(b.name));
  //     this.jobTitles = res.data;
  //   })

  // }



  onSelect(e) {
    console.log(e);
    console.log(e.target.files[0].name);
    const file = e.target.files[0];
    const fileType = file.type.split("/")[0];
    console.log(fileType);
    if (fileType == "image") {
      this.selectedfile = e.target.files[0];
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onload = e => this.imageSrc = reader.result;
      reader.readAsDataURL(file)

    }
  }

  admindetails() {
    this.first_name = localStorage.getItem('first_name');
    this.last_name = localStorage.getItem('last_name');
    this.email = localStorage.getItem('admin_email');
    this.image = localStorage.getItem('image');
  }

  editprofile() {
    if (this.profileform.invalid) {
      this.profileform.markAllAsTouched()
      this._snackBar.open('Please fill all the required fields ', 'close', {
        duration: 2000
      })
    } else {
      const formData = new FormData();
      formData.append('image', this.selectedfile);
      formData.append('first_name', this.profileform.value.first_name);
      formData.append('last_name', this.profileform.value.last_name);
      formData.append('email', this.profileform.value.email);
      this.Service.profile(formData).subscribe(res => {
        console.log("respons eof updated profile>>>>", res);

        this.emitEvent(res)

        this.router.navigate(['/dashboard'])
        this._snackBar.open("Profile Updated Succsessfully", 'close', {
          duration: 2000
        })
        if (res.code == 200) {
          localStorage.setItem('first_name', res.data.first_name);
          localStorage.setItem('last_name', res.data.last_name);
          localStorage.setItem('admin_email', res.data.email);
          localStorage.setItem('image', res.data.image);
        }
      }, err => {
        console.log("hjjhgjhghjgjhghjgjhghjg", err);

        this.Service.showMessage({
          message: err.error.errors.msg ? err.error.errors.msg : 'Something went Wrong'
        })

      }
      );
    }
  }
  emitEvent(res){
    this.Service.updateProfileImageViaFilter(res)
  }

}
