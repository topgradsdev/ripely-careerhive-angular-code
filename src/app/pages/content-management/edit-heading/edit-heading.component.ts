import { Component, OnInit } from '@angular/core';
import {MatPaginator} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';
import {MatTableDataSource} from '@angular/material/table';
import {ModalDirective} from 'ngx-bootstrap/modal';
import {SelectionModel} from '@angular/cdk/collections';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TopgradserviceService } from '../../../topgradservice.service';
import { ActivatedRoute } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { Location } from '@angular/common';

@Component({
  selector: 'app-edit-heading',
  templateUrl: './edit-heading.component.html',
  styleUrls: ['./edit-heading.component.scss']
})
export class EditHeadingComponent implements OnInit {
  modules = {
    toolbar: [
      ['bold', 'italic', 'underline', 'strike'],        
      [{ 'list': 'ordered'}, { 'list': 'bullet' }],
      [{ 'header': [1, 2, 3, 4, 5, 6, false] }],                                   
      ['link']   
    ]
  };
  editheadingform:FormGroup
  type: any;

  constructor(private route:ActivatedRoute,private Service:TopgradserviceService,private _formBuilder:FormBuilder,private _snackBar: MatSnackBar, private router: Router, private location : Location) { 
    this.editheadingform = this._formBuilder.group({
      'title':['',[Validators.required]],
      'description':['',[Validators.required]]
  })
  }

  ngOnInit(): void {
    this.getheadingdetail();
    this.type=this.route.snapshot.paramMap.get('type')
  }
  
  getheadingdetail(){
    console.log("khjhgjhgjhgjhghjghjgjhghjg");
    
    var obj = {
      content_id:this.route.snapshot.paramMap.get('id')
    }
    console.log("onnnn", obj)
    this.Service.termsheading(obj).subscribe(data => {
    console.log("main data for terms is ====", data);
    this.editheadingform.patchValue({
      title: data.data.heading.title,
      description: data.data.heading.description
    })
   
    }, err => {
    console.log(err.status)
    if (err.status >= 404) {
    console.log('Some error occured')
    } else {
    // this.toastr.error('Some error occured, please try again!!', 'Error')
    console.log('Internet Connection Error')
    }
    })
  }

  editheading(){
    console.log("sdsfsfdsfdfdfds",this.editheadingform)
    if(this.editheadingform.invalid){
      this.editheadingform.markAllAsTouched(); 
    }
    else{
      var obj={
        heading_title:this.editheadingform.value.title,
        heading_description:this.editheadingform.value.description,
        content_id:this.route.snapshot.paramMap.get('id')
      }
      this.Service.posttermheading(obj).subscribe(res=>{
        console.log("fgdgfdgfdfgdfgd",res);
        if(res.code==200){
          this._snackBar.open("Heading Updated Successfully","close",{
            duration: 2000
          });
          this.location.back();
        }
      },err => {
        console.log(err);
        this._snackBar.open("Some Error Occued","close",{
          duration: 2000})
        });
    }
  }

  navigate(){
    this.location.back();
  }


}
