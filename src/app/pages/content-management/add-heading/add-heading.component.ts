import { Component, OnInit } from '@angular/core';
import {MatPaginator} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';
import {MatTableDataSource} from '@angular/material/table';
import {ModalDirective} from 'ngx-bootstrap/modal';
import {SelectionModel} from '@angular/cdk/collections';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TopgradserviceService } from '../../../topgradservice.service';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import {Location} from '@angular/common';

@Component({
  selector: 'app-add-heading',
  templateUrl: './add-heading.component.html',
  styleUrls: ['./add-heading.component.scss']
})
export class AddHeadingComponent implements OnInit {
  modules = {
    toolbar: [
      ['bold', 'italic', 'underline', 'strike'],        
      [{ 'list': 'ordered'}, { 'list': 'bullet' }],
      [{ 'header': [1, 2, 3, 4, 5, 6, false] }],                                   
      ['link']   
    ]
  };
  terms_headingform:FormGroup
  type: any;

  constructor(private route:ActivatedRoute,private Service:TopgradserviceService,private _formBuilder:FormBuilder,private _snackBar: MatSnackBar, private router : Router, private location : Location) { 
    this.terms_headingform = this._formBuilder.group({
      'title':['',[Validators.required]],
      'description':['',[Validators.required]]
  })
  }

  ngOnInit(): void {
    this.type=this.route.snapshot.paramMap.get('type');
  }

  addheading(){
    console.log("sdsfsfdsfdfdfds",this.terms_headingform)
    if(this.terms_headingform.invalid){
      this.terms_headingform.markAllAsTouched(); 
    }
    else{
      var obj={
        type:this.route.snapshot.paramMap.get('type'),
        heading:{
          title:this.terms_headingform.value.title,
          description:this.terms_headingform.value.description
        }
      }
      console.log("hmara object", obj);
      this.Service.addtermheading(obj).subscribe(res=>{
        console.log("fgdgfdgfdfgdfgd",res);
        if(res.code==200){
          this._snackBar.open("Added Heading Successfully","close",{
            duration: 2000
          });
         this.location.back();
        }
      },err => {
        console.log(err);
        this._snackBar.open("Some Error Occued","close",{
          duration: 2000})
        })
    }
 
  }

  navigate(){
    this.location.back();
  }

}
