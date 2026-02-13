import { Component, OnInit } from '@angular/core';
import {FormControl} from '@angular/forms';
import {MatPaginator} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';
import {MatTableDataSource} from '@angular/material/table';
import {ModalDirective} from 'ngx-bootstrap/modal';
import {SelectionModel} from '@angular/cdk/collections';

import { FormBuilder, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { TopgradserviceService } from '../../../topgradservice.service';


@Component({
  selector: 'app-edit-graduate',
  templateUrl: './edit-graduate.component.html',
  styleUrls: ['./edit-graduate.component.scss']
})
export class EditGraduateComponent implements OnInit {
  imageFile: any;

  constructor(private _snackBar: MatSnackBar, private route:ActivatedRoute,private Service:TopgradserviceService, private fb:FormBuilder, private router: Router ) { }

  ngOnInit(): void {
    console.log(this.EditGraduateform)
    this.employerdetails();
  }

  EditGraduateform = this.fb.group({
    first_name: ['', [Validators.required, Validators.maxLength(50)]],
    last_name: ['', [Validators.required, Validators.maxLength(50)]],
    email: ['', [Validators.required, Validators.pattern("[a-zA-Z0-9.-_]{1,}@[a-zA-Z.-]{2,}[.]{1}[a-zA-Z]{2,}")]],
    creation_date: ['', [Validators.required, Validators.maxLength(50)]],
    status: ['', [Validators.required]],
    Image: ['',],
    county:['']
  });

  isCollapsed: boolean = false;
  iconCollapse: string = 'icon-arrow-up';

  collapsed(event: any): void {
    // console.log(event);
  }

  expanded(event: any): void {
    // console.log(event);
  }

  toggleCollapse(): void {
    this.isCollapsed = !this.isCollapsed;
    this.iconCollapse = this.isCollapsed ? 'icon-arrow-down' : 'icon-arrow-up';
  }

  employerdetails(){
    var obj = {
      user_id: this.route.snapshot.paramMap.get('id')
    }
    this.Service.getEmployerDetail(obj).subscribe((resp) => {
      console.log("employer detail is ====>", resp)

      this.imageFile = resp.data.image

      this.EditGraduateform.patchValue({
        first_name: resp.data.first_name,
        last_name: resp.data.last_name,
        email:resp.data.email,
        creation_date: resp.data.createdAt,
        status: resp.data.status
      })
      console.log("forrmmmmmmmm==========>",this.EditGraduateform);
      
    }) 
  }

  changeImage(event) {
    if (event.target.files && event.target.files[0]) {
      var reader = new FileReader();

      reader.readAsDataURL(event.target.files[0]); // read file as data url

      reader.onload = (event) => { // called once readAsDataURL is completed
        this.imageFile = event.target.result;
      }
    }
  }

  edituser(){
    var obj = {
      user_id: this.route.snapshot.paramMap.get('id'),
      image: this.imageFile,
      first_name:this.EditGraduateform.controls.first_name.value,
      last_name:this.EditGraduateform.controls.last_name.value,
      email:this.EditGraduateform.controls.email.value,
      createdAt:this.EditGraduateform.controls.creation_date.value,
      status:this.EditGraduateform.controls.status.value
    }

    this.Service.EditEmployerDetail(obj).subscribe((resp) => {
      console.log("updated graduate detail is ====>", resp)
      this.Service.showMessage({ message: "Updated successfully" })
      this.router.navigate(["/graduateList"])
    }, err => {
      console.log(err)
      this._snackBar.open('Email already exist', 'close', {
        duration: 2000
      })
    });
  }
  cancel(){
    this.router.navigate(["/graduateList"])
  }

}
