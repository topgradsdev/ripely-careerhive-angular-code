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
import { Location } from '@angular/common';

@Component({
  selector: 'app-view-sub-heading',
  templateUrl: './view-sub-heading.component.html',
  styleUrls: ['./view-sub-heading.component.scss']
})
export class ViewSubHeadingComponent implements OnInit {
  modules = {
    toolbar: [
      ['bold', 'italic', 'underline', 'strike'],        
      [{ 'list': 'ordered'}, { 'list': 'bullet' }],
      [{ 'header': [1, 2, 3, 4, 5, 6, false] }],                                   
      ['link']   
    ]
  };
  viewsubheadingform:FormGroup
  content_id: any;
  id: any;
  type: any;

  constructor(private route:ActivatedRoute,private Service:TopgradserviceService,private _formBuilder:FormBuilder,private _snackBar: MatSnackBar, private location : Location) { 
    this.viewsubheadingform = this._formBuilder.group({
      'title':['',[Validators.required]],
      'description':['',[Validators.required]]
    })
  }

  ngOnInit(): void {
    this.getsubheading();
    this.content_id = this.route.snapshot.paramMap.get('content_id') ;
    this.id=this.route.snapshot.paramMap.get('id');
    this.type=this.route.snapshot.paramMap.get('type');
    console.log("such a boring day... such a boring people ", this.id, this.content_id);
    
  }

  getsubheading(){
   
    var obj={
      content_id:this.route.snapshot.paramMap.get('content_id'),
      sub_heading_id:this.route.snapshot.paramMap.get('id')
    }
    console.log("getsubheading   obj",obj);
    this.Service.getsubheading(obj).subscribe(res=>{
      console.log("response",res)
      this.viewsubheadingform.patchValue({
        title: res.data[0].sub_heading[0].title,
        description: res.data[0].sub_heading[0].description
      })
     
    });
  }

  navigate(){
    this.location.back();
  }

}
